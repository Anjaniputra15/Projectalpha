
export interface FileSystemItem {
  id: string;
  type: "file" | "folder";
  name: string;
  content?: string;
  parentId?: string;
  children?: FileSystemItem[];
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
}
