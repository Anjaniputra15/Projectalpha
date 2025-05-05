import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package
import { FileSystemItem } from "@/lib/types";
import { format } from "date-fns";

// Mock data store to replace Supabase
const mockDb = {
  notes: [] as any[],
  listeners: [] as Function[],
  
  // Helper to notify listeners when data changes
  notifyChange() {
    this.listeners.forEach(listener => listener());
  },
  
  // Add a change listener
  onChanges(callback: Function) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  },
  
  // CRUD operations
  async getNotes() {
    return { 
      data: [...this.notes], 
      error: null 
    };
  },
  
  async insertNote(note: any) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newNote = {
      id,
      ...note,
      created_at: now,
      updated_at: now
    };
    this.notes.push(newNote);
    this.notifyChange();
    return { data: newNote, error: null };
  },
  
  async updateNote(id: string, updates: any) {
    const index = this.notes.findIndex(note => note.id === id);
    if (index >= 0) {
      this.notes[index] = {
        ...this.notes[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      this.notifyChange();
      return { error: null };
    }
    return { error: { message: "Note not found" } };
  },
  
  async deleteNote(id: string) {
    const initialLength = this.notes.length;
    this.notes = this.notes.filter(note => note.id !== id);
    if (this.notes.length !== initialLength) {
      this.notifyChange();
      return { error: null };
    }
    return { error: { message: "Note not found" } };
  }
};

export const useNotes = () => {
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [currentNote, setCurrentNote] = useState<FileSystemItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Organize items into a tree structure
  const organizeItems = (flatItems: FileSystemItem[]): FileSystemItem[] => {
    const itemMap = new Map<string, FileSystemItem>();
    const rootItems: FileSystemItem[] = [];

    // First pass: create map of all items
    flatItems.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Second pass: build tree structure
    flatItems.forEach(item => {
      const mappedItem = itemMap.get(item.id)!;
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!;
        parent.children = parent.children || [];
        parent.children.push(mappedItem);
      } else {
        rootItems.push(mappedItem);
      }
    });

    return rootItems;
  };

  useEffect(() => {
    const fetchNotes = async () => {
      // Now using our mock database instead of Supabase
      const { data: notes, error } = await mockDb.getNotes();

      if (error || !notes) {
        toast({
          variant: "destructive",
          title: "Error loading notes",
          description: "Failed to fetch your notes. Please try again.",
        });
        return;
      }

      const transformedNotes = notes.map((note): FileSystemItem => ({
        id: note.id,
        type: note.content === null ? "folder" : "file",
        name: note.title,
        content: note.content ?? undefined,
        parentId: note.folder_id ?? undefined,
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at),
        userId: note.user_id,
      }));

      const organizedItems = organizeItems(transformedNotes);
      setItems(organizedItems);
      setIsLoading(false);
    };

    fetchNotes();

    // Subscribe to changes from our mock database
    const unsubscribe = mockDb.onChanges(() => {
      fetchNotes();
    });

    return () => {
      unsubscribe();
    };
  }, [toast]);

  const generateNoteName = (parentId?: string) => {
    const today = new Date();
    const baseTitle = format(today, "MMMM d, yyyy");
    const existingNotes = items.filter(
      (item) => item.parentId === parentId && item.name.startsWith(baseTitle)
    ).length;

    return existingNotes > 0 
      ? `${baseTitle} (${existingNotes + 1})`
      : baseTitle;
  };

  const handleCreateNote = async (parentId?: string) => {
    try {
      const userId = "default-user";
      const noteName = generateNoteName(parentId);
      
      const { data: noteData, error: noteError } = await mockDb.insertNote({
        title: noteName,
        content: "",
        folder_id: parentId ?? null,
        user_id: userId,
      });

      if (noteError || !noteData) {
        console.error("Error creating note:", noteError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create note. Please try again.",
        });
        return;
      }

      const newNote: FileSystemItem = {
        id: noteData.id,
        type: "file",
        name: noteName,
        content: "",
        parentId: noteData.folder_id ?? undefined,
        createdAt: new Date(noteData.created_at),
        updatedAt: new Date(noteData.updated_at),
        userId: userId,
      };

      setItems((prevItems) => [...prevItems, newNote]);
      setCurrentNote(newNote);

      toast({
        title: "Success",
        description: `Note "${noteName}" has been created`,
      });

    } catch (error) {
      console.error("Error in handleCreateNote:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleCreateFolder = async (name: string, parentId?: string) => {
    try {
      const userId = "default-user";

      const { data: folderData, error: folderError } = await mockDb.insertNote({
        title: name,
        content: null,
        folder_id: parentId ?? null,
        user_id: userId,
      });

      if (folderError || !folderData) {
        console.error("Error creating folder:", folderError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create folder. Please try again.",
        });
        return;
      }

      const newFolder: FileSystemItem = {
        id: folderData.id,
        type: "folder",
        name: name,
        parentId: folderData.folder_id ?? undefined,
        children: [],
        createdAt: new Date(folderData.created_at),
        updatedAt: new Date(folderData.updated_at),
        userId: userId,
      };

      setItems((prevItems) => [...prevItems, newFolder]);

      toast({
        title: "Success",
        description: `Folder "${name}" has been created`,
      });
    } catch (error) {
      console.error("Error in handleCreateFolder:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleRenameItem = async (id: string, newName: string) => {
    const userId = "default-user";

    const { error } = await mockDb.updateNote(id, { 
      title: newName,
      updated_at: new Date().toISOString()
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to rename item. Please try again.",
      });
      return;
    }

    setItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          return { ...item, name: newName, updatedAt: new Date() };
        }
        return item;
      })
    );

    toast({
      title: "Item renamed",
      description: `Item has been renamed to "${newName}"`,
    });
  };

  const handleDeleteItem = async (id: string) => {
    // First, recursively delete all children if it's a folder
    const itemToDelete = items.find(item => item.id === id);
    if (itemToDelete?.type === "folder") {
      const childrenIds = items
        .filter(item => item.parentId === id)
        .map(child => child.id);

      for (const childId of childrenIds) {
        await handleDeleteItem(childId);
      }
    }

    const { error } = await mockDb.deleteNote(id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete item. Please try again.",
      });
      return;
    }

    setItems((items) =>
      items.filter((item) => item.id !== id)
    );

    if (currentNote?.id === id) {
      setCurrentNote(null);
    }

    toast({
      title: "Item deleted",
      description: "The item has been deleted",
    });
  };

  return {
    items,
    currentNote,
    setCurrentNote,
    isLoading,
    handleCreateNote,
    handleCreateFolder,
    handleRenameItem,
    handleDeleteItem
  };
};