import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Lightbulb, 
  Users, 
  Calendar, 
  Clock,
  MessageSquare,
  MessageCircle,
  ThumbsUp,
  ExternalLink,
  Plus,
  Trash2,
  Download,
  Share2,
  Filter,
  Search,
  SortAsc,
  Save,
  Edit,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Tag,
  Info,
  PanelLeftClose,
  ArrowRightCircle,
  BarChart,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface IdeaTag {
  id: string;
  name: string;
  color: string;
}

interface Idea {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  votes: number;
  tags: string[];
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
}

interface Participant {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  department?: string;
}

interface BrainstormSession {
  id: string;
  title: string;
  description: string;
  status: 'scheduled' | 'active' | 'completed' | 'archived';
  scheduledDate?: Date;
  startDate?: Date;
  endDate?: Date;
  facilitator: string;
  participants: Participant[];
  topic: string;
  ideas: Idea[];
  tags: IdeaTag[];
  goal: string;
}

const BrainstormingSessions: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'past' | 'ideas'>('upcoming');
  const [sessions, setSessions] = useState<BrainstormSession[]>([]);
  const [activeSession, setActiveSession] = useState<BrainstormSession | null>(null);
  const [showIdeaPanel, setShowIdeaPanel] = useState<boolean>(true);
  const [newIdea, setNewIdea] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'votes'>('latest');
  const [newSessionForm, setNewSessionForm] = useState<{
    title: string;
    description: string;
    topic: string;
    goal: string;
    scheduledDate: string;
    scheduledTime: string;
  }>({
    title: '',
    description: '',
    topic: '',
    goal: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00',
  });
  const [showNewSessionForm, setShowNewSessionForm] = useState<boolean>(false);
  const [commentIdea, setCommentIdea] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>('');

  // Demo data for brainstorming sessions
  useEffect(() => {
    // Initial demo data
    const demoSessions: BrainstormSession[] = [
      {
        id: 'session-1',
        title: 'ASML EUV Innovation Workshop',
        description: 'Brainstorming session to explore innovation opportunities in EUV lithography process improvements',
        status: 'active',
        startDate: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        scheduledDate: new Date(),
        facilitator: 'Thomas Chen',
        participants: [
          { id: 'p1', name: 'Thomas Chen', role: 'Senior Process Engineer', avatarColor: '#4c9be8', department: 'EUV Process' },
          { id: 'p2', name: 'Sarah Johnson', role: 'Optical Systems Specialist', avatarColor: '#e85c4c', department: 'Optics' },
          { id: 'p3', name: 'David Kim', role: 'Source Integration Engineer', avatarColor: '#53d969', department: 'EUV Source' },
          { id: 'p4', name: 'Emily Rodriguez', role: 'Metrology Engineer', avatarColor: '#d9c653', department: 'Metrology' },
          { id: 'p5', name: 'Michael Wei', role: 'Software Developer', avatarColor: '#aa68e8', department: 'System Control' },
        ],
        topic: 'EUV process window optimization for sub-2nm nodes',
        goal: 'Generate 5 testable ideas to improve exposure latitude and CD uniformity for EUV-based contact hole patterning',
        ideas: [
          {
            id: 'idea-1',
            content: 'Implement dynamic dose correction based on real-time resist temperature monitoring',
            author: 'Sarah Johnson',
            timestamp: new Date(Date.now() - 20 * 60 *
1000),
            votes: 3,
            tags: ['process-improvement', 'high-impact'],
            comments: [
              {
                id: 'comment-1',
                author: 'David Kim',
                content: 'This could also help with the dose variation we\'ve been seeing at the wafer edge. How would we implement the temperature sensor?',
                timestamp: new Date(Date.now() - 15 * 60 * 1000)
              }
            ]
          },
          {
            id: 'idea-2',
            content: 'Develop enhanced pellicle materials with improved EUV transmission and thermal stability',
            author: 'Thomas Chen',
            timestamp: new Date(Date.now() - 18 * 60 * 1000),
            votes: 5,
            tags: ['materials', 'high-impact', 'long-term'],
            comments: []
          },
          {
            id: 'idea-3',
            content: 'Create an ML model to predict optimal focus-exposure conditions based on historical process data',
            author: 'Michael Wei',
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            votes: 7,
            tags: ['software', 'ml-ai', 'quick-win'],
            comments: [
              {
                id: 'comment-2',
                author: 'Emily Rodriguez',
                content: 'We have sufficient historical data from the YieldStar metrology to train this model fairly quickly.',
                timestamp: new Date(Date.now() - 8 * 60 * 1000)
              },
              {
                id: 'comment-3',
                author: 'Thomas Chen',
                content: 'This could be implemented as an extension to the current dose mapping module.',
                timestamp: new Date(Date.now() - 5 * 60 * 1000)
              }
            ]
          },
        ],
        tags: [
          { id: 'tag-1', name: 'process-improvement', color: '#4c9be8' },
          { id: 'tag-2', name: 'high-impact', color: '#e85c4c' },
          { id: 'tag-3', name: 'quick-win', color: '#53d969' },
          { id: 'tag-4', name: 'long-term', color: '#d9c653' },
          { id: 'tag-5', name: 'materials', color: '#aa68e8' },
          { id: 'tag-6', name: 'software', color: '#e86dd4' },
          { id: 'tag-7', name: 'ml-ai', color: '#68e8d8' },
        ]
      },
      {
        id: 'session-2',
        title: 'ASML TWINSCAN NXT Productivity Enhancement',
        description: 'Session focused on identifying opportunities to improve throughput and system availability',
        status: 'scheduled',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days in future
        facilitator: 'James Wilson',
        participants: [
          { id: 'p6', name: 'James Wilson', role: 'System Integration Manager', avatarColor: '#4c9be8' },
          { id: 'p7', name: 'Lisa Chen', role: 'Field Service Engineer', avatarColor: '#e85c4c' },
          { id: 'p8', name: 'Robert Martinez', role: 'Software Engineer', avatarColor: '#53d969' },
          { id: 'p9', name: 'Amanda Park', role: 'Process Engineer', avatarColor: '#d9c653' },
        ],
        topic: 'Improving system uptime and throughput for TWINSCAN NXT:2000i systems',
        goal: 'Develop 3-5 actionable ideas to reduce setup time and improve wafer swap efficiency',
        ideas: [],
        tags: [
          { id: 'tag-1', name: 'productivity', color: '#4c9be8' },
          { id: 'tag-2', name: 'hardware', color: '#e85c4c' },
          { id: 'tag-3', name: 'software', color: '#53d969' },
          { id: 'tag-4', name: 'maintenance', color: '#d9c653' },
          { id: 'tag-5', name: 'automation', color: '#aa68e8' },
        ]
      },
      {
        id: 'session-3',
        title: 'Next-Gen Wafer Stage Design Concepts',
        description: 'Brainstorming on innovative design concepts for next-generation wafer stage technology',
        status: 'completed',
        scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
        facilitator: 'Karen Zhang',
        participants: [
          { id: 'p10', name: 'Karen Zhang', role: 'Mechanical Design Lead', avatarColor: '#4c9be8' },
          { id: 'p11', name: 'John Davis', role: 'Motion Control Specialist', avatarColor: '#e85c4c' },
          { id: 'p12', name: 'Michelle Lee', role: 'Systems Engineer', avatarColor: '#53d969' },
          { id: 'p13', name: 'Brian Taylor', role: 'Thermal Engineer', avatarColor: '#d9c653' },
          { id: 'p14', name: 'Rachel Kim', role: 'Vibration Analysis Expert', avatarColor: '#aa68e8' },
        ],
        topic: 'Novel wafer stage designs for sub-nm positioning accuracy',
        goal: 'Explore radical design concepts that could enable <0.1nm positioning accuracy for future lithography systems',
        ideas: [
          {
            id: 'idea-4',
            content: 'Multi-stage system with dynamic handover for continuous scanning with zero settling time',
            author: 'John Davis',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
            votes: 12,
            tags: ['mechanical', 'high-impact', 'long-term'],
            comments: []
          },
          {
            id: 'idea-5',
            content: 'Implement active vibration cancellation using predictive modeling of floor vibrations',
            author: 'Rachel Kim',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
            votes: 8,
            tags: ['vibration', 'quick-win'],
            comments: []
          },
          {
            id: 'idea-6',
            content: 'Superconducting magnetic levitation stage with integrated cooling system',
            author: 'Karen Zhang',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
            votes: 15,
            tags: ['mechanical', 'thermal', 'long-term'],
            comments: []
          },
          {
            id: 'idea-7',
            content: 'Thermal expansion compensation using real-time modeling and adaptive control',
            author: 'Brian Taylor',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000),
            votes: 10,
            tags: ['thermal', 'software', 'medium-term'],
            comments: []
          },
        ],
        tags: [
          { id: 'tag-8', name: 'mechanical', color: '#4c9be8' },
          { id: 'tag-9', name: 'thermal', color: '#e85c4c' },
          { id: 'tag-10', name: 'vibration', color: '#53d969' },
          { id: 'tag-11', name: 'high-impact', color: '#d9c653' },
          { id: 'tag-12', name: 'medium-term', color: '#aa68e8' },
          { id: 'tag-13', name: 'long-term', color: '#e86dd4' },
          { id: 'tag-14', name: 'quick-win', color: '#68e8d8' },
          { id: 'tag-15', name: 'software', color: '#e89c68' },
        ]
      }
    ];

    setSessions(demoSessions);
    setActiveSession(demoSessions.find(s => s.status === 'active') || null);
  }, []);

  const joinSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      // In a real app, this would involve API calls to join a session
      setActiveSession(session);
      setActiveTab('active');
      
      toast({
        title: "Session Joined",
        description: `You have joined the "${session.title}" brainstorming session`
      });
    }
  };

  const handleAddIdea = () => {
    if (!activeSession) return;
    if (!newIdea.trim()) {
      toast({
        title: "Error",
        description: "Please enter an idea",
        variant: "destructive"
      });
      return;
    }

    const idea: Idea = {
      id: `idea-${Date.now()}`,
      content: newIdea,
      author: "You", // In a real app, this would be the current user
      timestamp: new Date(),
      votes: 0,
      tags: selectedTags,
      comments: []
    };

    const updatedSession = {
      ...activeSession,
      ideas: [idea, ...activeSession.ideas]
    };

    setSessions(sessions.map(s => s.id === activeSession.id ? updatedSession : s));
    setActiveSession(updatedSession);
    setNewIdea('');
    setSelectedTags([]);

    toast({
      title: "Idea Added",
      description: "Your idea has been added to the session"
    });
  };

  const handleVoteIdea = (ideaId: string) => {
    if (!activeSession) return;

    const updatedIdeas = activeSession.ideas.map(idea => {
      if (idea.id === ideaId) {
        return { ...idea, votes: idea.votes + 1 };
      }
      return idea;
    });

    const updatedSession = {
      ...activeSession,
      ideas: updatedIdeas
    };

    setSessions(sessions.map(s => s.id === activeSession.id ? updatedSession : s));
    setActiveSession(updatedSession);

    toast({
      title: "Vote Recorded",
      description: "You've voted for this idea"
    });
  };

  const handleAddComment = (ideaId: string) => {
    if (!activeSession || !newComment.trim()) return;

    const updatedIdeas = activeSession.ideas.map(idea => {
      if (idea.id === ideaId) {
        const comment: Comment = {
          id: `comment-${Date.now()}`,
          author: "You", // In a real app, this would be the current user
          content: newComment,
          timestamp: new Date()
        };
        return { 
          ...idea, 
          comments: [...idea.comments, comment] 
        };
      }
      return idea;
    });

    const updatedSession = {
      ...activeSession,
      ideas: updatedIdeas
    };

    setSessions(sessions.map(s => s.id === activeSession.id ? updatedSession : s));
    setActiveSession(updatedSession);
    setCommentIdea(null);
    setNewComment('');

    toast({
      title: "Comment Added",
      description: "Your comment has been added to the idea"
    });
  };

  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const createNewSession = () => {
    if (!newSessionForm.title.trim() || !newSessionForm.topic.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive"
      });
      return;
    }

    const scheduledDateTime = new Date(`${newSessionForm.scheduledDate}T${newSessionForm.scheduledTime}`);

    const newSession: BrainstormSession = {
      id: `session-${Date.now()}`,
      title: newSessionForm.title,
      description: newSessionForm.description,
      status: 'scheduled',
      scheduledDate: scheduledDateTime,
      facilitator: "You", // In a real app, this would be the current user
      participants: [
        { id: 'you', name: "You", role: "Session Creator", avatarColor: '#4c9be8' }
      ],
      topic: newSessionForm.topic,
      goal: newSessionForm.goal,
      ideas: [],
      tags: [
        { id: 'tag-new-1', name: 'process-improvement', color: '#4c9be8' },
        { id: 'tag-new-2', name: 'high-impact', color: '#e85c4c' },
        { id: 'tag-new-3', name: 'quick-win', color: '#53d969' },
      ]
    };

    setSessions([newSession, ...sessions]);
    setShowNewSessionForm(false);
    
    // Reset form
    setNewSessionForm({
      title: '',
      description: '',
      topic: '',
      goal: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00',
    });

    toast({
      title: "Session Created",
      description: "New brainstorming session has been scheduled"
    });
  };

  const sortIdeas = (ideas: Idea[]) => {
    if (sortOrder === 'votes') {
      return [...ideas].sort((a, b) => b.votes - a.votes);
    } else {
      return [...ideas].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
  };

  const filterIdeas = (ideas: Idea[]) => {
    return ideas.filter(idea => {
      // Apply search filter
      if (searchQuery && !idea.content.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled');
  const activeSessions = sessions.filter(s => s.status === 'active');
  const pastSessions = sessions.filter(s => s.status === 'completed' || s.status === 'archived');

  return (
    <div className="p-6 bg-[#1e1e1e] text-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-white">Brainstorming Sessions</h1>
        <p className="text-[#aaa]">Collaborate and capture innovative ideas with your team</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#363636] mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'upcoming' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-[#aaa] hover:text-white'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          <Calendar className="h-4 w-4 inline mr-2" />
          Upcoming Sessions
          {upcomingSessions.length > 0 && (
            <span className="ml-2 bg-purple-900/50 text-purple-300 text-xs px-1.5 py-0.5 rounded-full">
              {upcomingSessions.length}
            </span>
          )}
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'active' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-[#aaa] hover:text-white'}`}
          onClick={() => setActiveTab('active')}
        >
          <BrainCircuit className="h-4 w-4 inline mr-2" />
          Active Sessions
          {activeSessions.length > 0 && (
            <span className="ml-2 bg-green-900/50 text-green-300 text-xs px-1.5 py-0.5 rounded-full">
              {activeSessions.length}
            </span>
          )}
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'past' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-[#aaa] hover:text-white'}`}
          onClick={() => setActiveTab('past')}
        >
          <Clock className="h-4 w-4 inline mr-2" />
          Past Sessions
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'ideas' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-[#aaa] hover:text-white'}`}
          onClick={() => setActiveTab('ideas')}
        >
          <Lightbulb className="h-4 w-4 inline mr-2" />
          Idea Repository
        </button>
      </div>

      {/* Upcoming Sessions Tab */}
      {activeTab === 'upcoming' && (
        <div>
          <div className="flex justify-between mb-6">
            <h2 className="text-lg font-medium">Scheduled Brainstorming Sessions</h2>
            <Button
              onClick={() => setShowNewSessionForm(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Schedule New Session
            </Button>
          </div>

          {/* New Session Form */}
          {showNewSessionForm && (
            <div className="bg-[#252525] border border-[#363636] rounded-lg p-5 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Schedule New Brainstorming Session</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewSessionForm(false)}
                  className="text-[#aaa] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-[#aaa] mb-1">Session Title*</label>
                  <Input
                    value={newSessionForm.title}
                    onChange={(e) => setNewSessionForm({...newSessionForm, title: e.target.value})}
                    placeholder="Enter a title for the session"
                    className="bg-[#2a2a2a] border-[#444] text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-[#aaa] mb-1">Topic*</label>
                  <Input
                    value={newSessionForm.topic}
                    onChange={(e) => setNewSessionForm({...newSessionForm, topic: e.target.value})}
                    placeholder="Main topic for brainstorming"
                    className="bg-[#2a2a2a] border-[#444] text-white"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm text-[#aaa] mb-1">Description</label>
                <Textarea
                  value={newSessionForm.description}
                  onChange={(e) => setNewSessionForm({...newSessionForm, description: e.target.value})}
                  placeholder="Provide more details about the session"
                  className="bg-[#2a2a2a] border-[#444] text-white"
                  rows={2}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm text-[#aaa] mb-1">Goal</label>
                <Textarea
                  value={newSessionForm.goal}
                  onChange={(e) => setNewSessionForm({...newSessionForm, goal: e.target.value})}
                  placeholder="What do you hope to achieve in this session?"
                  className="bg-[#2a2a2a] border-[#444] text-white"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-[#aaa] mb-1">Date</label>
                  <Input
                    type="date"
                    value={newSessionForm.scheduledDate}
                    onChange={(e) => setNewSessionForm({...newSessionForm, scheduledDate: e.target.value})}
                    className="bg-[#2a2a2a] border-[#444] text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-[#aaa] mb-1">Time</label>
                  <Input
                    type="time"
                    value={newSessionForm.scheduledTime}
                    onChange={(e) => setNewSessionForm({...newSessionForm, scheduledTime: e.target.value})}
                    className="bg-[#2a2a2a] border-[#444] text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  className="mr-2 border-[#444] text-[#aaa] hover:text-white"
                  onClick={() => setShowNewSessionForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createNewSession}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Schedule Session
                </Button>
              </div>
            </div>
          )}

          {/* Upcoming Sessions List */}
          {upcomingSessions.length === 0 ? (
            <div className="text-center py-12 bg-[#252525] rounded-lg border border-[#363636]">
              <Calendar className="h-16 w-16 mx-auto mb-3 text-[#555]" />
              <p className="text-lg text-[#aaa]">No upcoming sessions scheduled</p>
              <p className="text-sm text-[#888] mt-1 mb-6">
                Schedule a new brainstorming session to collaborate with your team
              </p>
              <Button
                onClick={() => setShowNewSessionForm(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div 
                  key={session.id}
                  className="bg-[#252525] border border-[#363636] rounded-lg p-4 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{session.title}</h3>
                      <p className="text-[#aaa] text-sm mt-1">{session.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-purple-300">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {formatDate(session.scheduledDate)}
                      </div>
                      <div className="text-xs text-[#888] mt-1">
                        Facilitator: {session.facilitator}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#2a2a2a] p-3 rounded">
                      <div className="text-xs text-[#888] uppercase mb-1">Topic</div>
                      <div className="text-sm">{session.topic}</div>
                    </div>
                    
                    <div className="bg-[#2a2a2a] p-3 rounded">
                      <div className="text-xs text-[#888] uppercase mb-1">Goal</div>
                      <div className="text-sm">{session.goal || "No specific goal set"}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {session.participants.slice(0, 5).map((participant, i) => (
                        <div 
                          key={participant.id} 
                          className="w-8 h-8 rounded-full border-2 border-[#252525]" 
                          style={{ backgroundColor: participant.avatarColor }}
                          title={participant.name}
                        >
                          <div className="flex items-center justify-center h-full text-white text-xs font-medium">
                            {participant.name.charAt(0)}
                          </div>
                        </div>
                      ))}
                      {session.participants.length > 5 && (
                        <div className="w-8 h-8 rounded-full border-2 border-[#252525] bg-[#444] flex items-center justify-center text-white text-xs">
                          +{session.participants.length - 5}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#444] text-[#aaa] hover:text-white"
                      >
                        <Share2 className="h-4 w-4 mr-1.5" />
                        Share
                      </Button>
                      
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => joinSession(session.id)}
                      >
                        <ArrowRightCircle className="h-4 w-4 mr-1.5" />
                        Join Session
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Sessions Tab */}
      {activeTab === 'active' && (
        <div>
          {!activeSession ? (
            <div className="text-center py-12 bg-[#252525] rounded-lg border border-[#363636]">
              <BrainCircuit className="h-16 w-16 mx-auto mb-3 text-[#555]" />
              <p className="text-lg text-[#aaa]">No active brainstorming session</p>
              <p className="text-sm text-[#888] mt-1 mb-6">
                Join an existing session or start a new one
              </p>
              <Button
                onClick={() => setActiveTab('upcoming')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Scheduled Sessions
              </Button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Session Header */}
              <div className="bg-[#252525] border border-[#363636] rounded-lg p-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-medium">{activeSession.title}</h2>
                    <p className="text-[#aaa] text-sm mt-1">{activeSession.description}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      {activeSession.startDate && (
                        <div className="text-sm text-green-300">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Started: {formatDate(activeSession.startDate)}
                        </div>
                      )}
                      <div className="text-xs text-[#888] mt-1">
                        Facilitator: {activeSession.facilitator}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#aaa] hover:text-white border border-[#444]"
                      onClick={() => setShowIdeaPanel(!showIdeaPanel)}
                    >
                      <PanelLeftClose className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#2a2a2a] p-3 rounded">
                    <div className="text-xs text-[#888] uppercase mb-1">Topic</div>
                    <div className="text-sm">{activeSession.topic}</div>
                  </div>
                  
                  <div className="bg-[#2a2a2a] p-3 rounded">
                    <div className="text-xs text-[#888] uppercase mb-1">Goal</div>
                    <div className="text-sm">{activeSession.goal || "No specific goal set"}</div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="text-xs text-[#888]">Participants:</div>
                    <div className="flex -space-x-2">
                      {activeSession.participants.map((participant) => (
                        <div 
                          key={participant.id} 
                          className="w-8 h-8 rounded-full border-2 border-[#252525]" 
                          style={{ backgroundColor: participant.avatarColor }}
                          title={`${participant.name} (${participant.role})`}
                        >
                          <div className="flex items-center justify-center h-full text-white text-xs font-medium">
                            {participant.name.charAt(0)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#444] text-[#aaa] hover:text-white"
                  >
                    < BarChart className="h-4 w-4 mr-1.5" />
                    Present Ideas
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-6 h-[calc(100vh-28rem)]">
                {/* Idea Panel */}
                {showIdeaPanel && (
                  <div className="w-72 flex-shrink-0 flex flex-col">
                    <div className="bg-[#252525] border border-[#363636] rounded-lg p-4 mb-4">
                      <h3 className="text-md font-medium mb-3">Add New Idea</h3>
                      
                      <Textarea
                        placeholder="Share your idea here..."
                        value={newIdea}
                        onChange={(e) => setNewIdea(e.target.value)}
                        className="bg-[#2a2a2a] border-[#444] text-white resize-none mb-3"
                        rows={4}
                      />
                      
                      <div className="mb-3">
                        <div className="text-xs text-[#888] mb-2">Add tags:</div>
                        <div className="flex flex-wrap gap-2">
                          {activeSession.tags.map((tag) => (
                            <button
                              key={tag.id}
                              onClick={() => handleToggleTag(tag.id)}
                              className={`text-xs px-2 py-1 rounded-full border ${
                                selectedTags.includes(tag.id) 
                                  ? `bg-opacity-30 bg-[${tag.color}] border-[${tag.color}] text-white` 
                                  : 'border-[#444] text-[#aaa] hover:text-white'
                              }`}
                              style={{
                                backgroundColor: selectedTags.includes(tag.id) ? `${tag.color}33` : 'transparent',
                                borderColor: selectedTags.includes(tag.id) ? tag.color : undefined
                              }}
                            >
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        onClick={handleAddIdea}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Lightbulb className="h-4 w-4 mr-1.5" />
                        Share Idea
                      </Button>
                    </div>
                    
                    <div className="bg-[#252525] border border-[#363636] rounded-lg p-4 overflow-auto flex-1">
                      <h3 className="text-md font-medium mb-3">Session Participants</h3>
                      
                      <div className="space-y-3">
                        {activeSession.participants.map((participant) => (
                          <div key={participant.id} className="flex items-center">
                            <div 
                              className="w-8 h-8 rounded-full mr-3 flex-shrink-0" 
                              style={{ backgroundColor: participant.avatarColor }}
                            >
                              <div className="flex items-center justify-center h-full text-white text-xs font-medium">
                                {participant.name.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">{participant.name}</div>
                              <div className="text-xs text-[#888]">{participant.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Ideas Display */}
                <div className="flex-1 bg-[#252525] border border-[#363636] rounded-lg overflow-hidden flex flex-col">
                  <div className="border-b border-[#363636] p-3 bg-[#222]">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-medium">Shared Ideas</h3>
                      
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="h-3.5 w-3.5 text-[#888] absolute left-2 top-1/2 transform -translate-y-1/2" />
                          <Input
                            placeholder="Search ideas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-7 pl-7 pr-2 py-1 bg-[#2a2a2a] border-[#444] text-white text-sm w-44"
                          />
                        </div>
                        
                        <button
                          onClick={() => setSortOrder(sortOrder === 'latest' ? 'votes' : 'latest')}
                          className="flex items-center text-xs text-[#aaa] hover:text-white"
                        >
                          <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
                          Sort: {sortOrder === 'latest' ? 'Latest' : 'Top Votes'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 overflow-y-auto flex-1">
                    {activeSession.ideas.length === 0 ? (
                      <div className="text-center py-8">
                        <Lightbulb className="h-12 w-12 mx-auto mb-3 text-[#555]" />
                        <p className="text-[#aaa]">No ideas shared yet</p>
                        <p className="text-sm text-[#888] mt-1">
                          Be the first to share an idea with the group
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sortIdeas(filterIdeas(activeSession.ideas)).map((idea) => (
                          <div 
                            key={idea.id}
                            className="bg-[#2a2a2a] border border-[#363636] rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                                <button
                                  onClick={() => handleVoteIdea(idea.id)}
                                  className="flex flex-col items-center mr-4 text-[#aaa] hover:text-purple-400 transition-colors"
                                >
                                  <ThumbsUp className="h-5 w-5 mb-1" />
                                  <span className="text-xs font-medium">{idea.votes}</span>
                                </button>
                                
                                <div>
                                  <p className="text-white mb-2">{idea.content}</p>
                                  
                                  {idea.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                      {idea.tags.map((tagId) => {
                                        const tag = activeSession.tags.find(t => t.id === tagId);
                                        if (!tag) return null;
                                        return (
                                          <span 
                                            key={tagId}
                                            className="text-xs px-1.5 py-0.5 rounded-full"
                                            style={{ 
                                              backgroundColor: `${tag.color}33`,
                                              color: tag.color
                                            }}
                                          >
                                            {tag.name}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  )}
                                  
                                  <div className="text-xs text-[#888]">
                                    <span className="text-[#aaa]">{idea.author}</span> · {idea.timestamp.toLocaleTimeString()}
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[#aaa] hover:text-white"
                                onClick={() => commentIdea === idea.id ? setCommentIdea(null) : setCommentIdea(idea.id)}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {/* Comments Section */}
                            {(idea.comments.length > 0 || commentIdea === idea.id) && (
                              <div className="mt-3 pt-3 border-t border-[#363636]">
                                {/* Existing Comments */}
                                {idea.comments.length > 0 && (
                                  <div className="mb-3">
                                    {idea.comments.map((comment) => (
                                      <div key={comment.id} className="mb-2 last:mb-0">
                                        <div className="flex items-start">
                                          <div 
                                            className="w-6 h-6 rounded-full mr-2 flex-shrink-0 bg-purple-900"
                                          >
                                            <div className="flex items-center justify-center h-full text-white text-xs font-medium">
                                              {comment.author.charAt(0)}
                                            </div>
                                          </div>
                                          <div className="bg-[#333] rounded-lg p-2 text-sm">
                                            <div className="text-xs text-[#aaa] mb-1">{comment.author}</div>
                                            <p>{comment.content}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Add Comment */}
                                {commentIdea === idea.id && (
                                  <div className="flex items-start">
                                    <div 
                                      className="w-6 h-6 rounded-full mr-2 flex-shrink-0 bg-purple-900"
                                    >
                                      <div className="flex items-center justify-center h-full text-white text-xs font-medium">Y</div>
                                    </div>
                                    <div className="flex-1">
                                      <Textarea
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="w-full bg-[#333] border-[#444] text-white resize-none text-sm p-2 h-20"
                                      />
                                      <div className="flex justify-end mt-2">
                                        <Button
                                          size="sm"
                                          className="h-7 bg-purple-600 hover:bg-purple-700 text-xs"
                                          onClick={() => handleAddComment(idea.id)}
                                        >
                                          Add Comment
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Past Sessions Tab */}
      {activeTab === 'past' && (
        <div>
          <div className="flex justify-between mb-6">
            <h2 className="text-lg font-medium">Completed Brainstorming Sessions</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-[#888] absolute left-2 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Search sessions..."
                  className="h-8 pl-7 bg-[#2a2a2a] border-[#444] text-white"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="border-[#444] text-[#aaa] hover:text-white"
              >
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                Filter
              </Button>
            </div>
          </div>

          {pastSessions.length === 0 ? (
            <div className="text-center py-12 bg-[#252525] rounded-lg border border-[#363636]">
              <Clock className="h-16 w-16 mx-auto mb-3 text-[#555]" />
              <p className="text-lg text-[#aaa]">No past sessions found</p>
              <p className="text-sm text-[#888] mt-1">
                Completed sessions will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastSessions.map((session) => (
                <div 
                  key={session.id}
                  className="bg-[#252525] border border-[#363636] rounded-lg p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{session.title}</h3>
                      <p className="text-[#aaa] text-sm mt-1">{session.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#aaa]">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {formatDate(session.endDate)}
                      </div>
                      <div className="text-xs text-[#888] mt-1">
                        {session.ideas.length} ideas generated
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-xs text-[#888] uppercase mb-2">Top Ideas:</div>
                    <div className="space-y-2">
                      {session.ideas
                        .sort((a, b) => b.votes - a.votes)
                        .slice(0, 3)
                        .map((idea) => (
                          <div 
                            key={idea.id}
                            className="bg-[#2a2a2a] p-3 rounded-md flex items-start"
                          >
                            <div className="bg-purple-900/30 text-purple-300 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                              {idea.votes}
                            </div>
                            <div className="flex-1 text-sm">{idea.content}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {session.participants.slice(0, 5).map((participant) => (
                        <div 
                          key={participant.id} 
                          className="w-7 h-7 rounded-full border-2 border-[#252525]" 
                          style={{ backgroundColor: participant.avatarColor }}
                          title={participant.name}
                        >
                          <div className="flex items-center justify-center h-full text-white text-xs font-medium">
                            {participant.name.charAt(0)}
                          </div>
                        </div>
                      ))}
                      {session.participants.length > 5 && (
                        <div className="w-7 h-7 rounded-full border-2 border-[#252525] bg-[#444] flex items-center justify-center text-white text-xs">
                          +{session.participants.length - 5}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#444] text-[#aaa] hover:text-white"
                      >
                        <Download className="h-4 w-4 mr-1.5" />
                        Export
                      </Button>
                      
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => {
                          setActiveSession(session);
                          setActiveTab('ideas');
                        }}
                      >
                        <Lightbulb className="h-4 w-4 mr-1.5" />
                        View Ideas
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ideas Repository Tab */}
      {activeTab === 'ideas' && (
        <div>
          <div className="flex justify-between mb-6">
            <h2 className="text-lg font-medium">Idea Repository</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-[#888] absolute left-2 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Search ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-7 bg-[#2a2a2a] border-[#444] text-white"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="border-[#444] text-[#aaa] hover:text-white"
                onClick={() => setSortOrder(sortOrder === 'latest' ? 'votes' : 'latest')}
              >
                <SortAsc className="h-3.5 w-3.5 mr-1.5" />
                {sortOrder === 'latest' ? 'Latest' : 'Top Votes'}
              </Button>
            </div>
          </div>

          {!activeSession ? (
            <div className="text-center py-12 bg-[#252525] rounded-lg border border-[#363636]">
              <Lightbulb className="h-16 w-16 mx-auto mb-3 text-[#555]" />
              <p className="text-lg text-[#aaa]">No session selected</p>
              <p className="text-sm text-[#888] mt-1 mb-6">
                Select a past session to view its ideas
              </p>
              <Button
                onClick={() => setActiveTab('past')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Clock className="h-4 w-4 mr-2" />
                View Past Sessions
              </Button>
            </div>
          ) : (
            <div>
              <div className="bg-[#252525] border border-[#363636] rounded-lg p-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{activeSession.title}</h3>
                    <p className="text-[#aaa] text-sm mt-1">{activeSession.description}</p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      activeSession.status === 'active' ? 'bg-green-900/30 text-green-300' :
                      activeSession.status === 'completed' ? 'bg-purple-900/30 text-purple-300' :
                      'bg-gray-900/30 text-gray-300'
                    }`}>
                      {activeSession.status.charAt(0).toUpperCase() + activeSession.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeSession.tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => {
                        // Add tag filter logic here
                      }}
                      className="text-xs px-2 py-1 rounded-full border border-[#444] text-[#aaa] hover:text-white"
                    >
                      <Tag className="h-3 w-3 inline mr-1" />
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortIdeas(filterIdeas(activeSession.ideas)).map((idea) => (
                  <div 
                    key={idea.id}
                    className="bg-[#252525] border border-[#363636] rounded-lg p-4 flex flex-col"
                  >
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center">
                        <div 
                          className="w-7 h-7 rounded-full mr-2 flex-shrink-0" 
                          style={{ backgroundColor: activeSession.participants.find(p => p.name === idea.author)?.avatarColor || '#4c9be8' }}
                        >
                          <div className="flex items-center justify-center h-full text-white text-xs font-medium">
                            {idea.author.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{idea.author}</div>
                          <div className="text-xs text-[#888]">{idea.timestamp.toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-900/30 text-purple-300 font-medium rounded-full px-2 py-0.5 flex items-center text-xs">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {idea.votes}
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3 flex-1">{idea.content}</p>
                    
                    {idea.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {idea.tags.map((tagId) => {
                          const tag = activeSession.tags.find(t => t.id === tagId);
                          if (!tag) return null;
                          return (
                            <span 
                              key={tagId}
                              className="text-xs px-1.5 py-0.5 rounded-full"
                              style={{ 
                                backgroundColor: `${tag.color}33`,
                                color: tag.color
                              }}
                            >
                              {tag.name}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-auto pt-2 border-t border-[#363636]">
                      <span className="text-xs text-[#888]">
                        <MessageCircle className="h-3.5 w-3.5 inline mr-1" />
                        {idea.comments.length} comments
                      </span>
                      
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-[#aaa] hover:text-white"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-[#aaa] hover:text-white"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrainstormingSessions;