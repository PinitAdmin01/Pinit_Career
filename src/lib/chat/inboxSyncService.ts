'use client';

export interface StudentMessage {
  id: string;
  sender: 'student' | 'teacher';
  senderName: string;
  studentId: string;
  text: string;
  timestamp: number;
  topic?: string;
}

export interface StudentConversation {
  studentId: string;
  studentName: string;
  studentEmail: string;
  course: string;
  lastMessage: string;
  lastTimestamp: number;
  unreadCount: number;
  messages: StudentMessage[];
}

const STORAGE_KEY = 'pinit_mentor_inbox_conversations';
const CHANNEL_NAME = 'pinit_chat_sync_channel';

const DEFAULT_CONVERSATIONS: StudentConversation[] = [
  {
    studentId: 'std_101',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@campus.edu',
    course: 'Full-Stack React Web Development',
    lastMessage: 'Professor, I had a doubt regarding Server Components vs Client Components in Next.js 14.',
    lastTimestamp: Date.now() - 1000 * 60 * 25,
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        sender: 'student',
        senderName: 'Aarav Sharma',
        studentId: 'std_101',
        text: 'Hello Professor! Completed Day 12 of the React curriculum.',
        timestamp: Date.now() - 1000 * 60 * 120,
        topic: 'React 14 SSR'
      },
      {
        id: 'm2',
        sender: 'teacher',
        senderName: 'Faculty Mentor',
        studentId: 'std_101',
        text: 'Great progress Aarav! Remember to keep stateful event listeners strictly in client components.',
        timestamp: Date.now() - 1000 * 60 * 60,
        topic: 'React 14 SSR'
      },
      {
        id: 'm3',
        sender: 'student',
        senderName: 'Aarav Sharma',
        studentId: 'std_101',
        text: 'Professor, I had a doubt regarding Server Components vs Client Components in Next.js 14.',
        timestamp: Date.now() - 1000 * 60 * 25,
        topic: 'React 14 SSR'
      }
    ]
  },
  {
    studentId: 'std_102',
    studentName: 'Sneha Patel',
    studentEmail: 'sneha.patel@campus.edu',
    course: 'Java Fundamentals & Core Logic',
    lastMessage: 'Thank you for reviewing my Day 8 exam code! The recursion tree explanation helped a lot.',
    lastTimestamp: Date.now() - 1000 * 60 * 180,
    unreadCount: 0,
    messages: [
      {
        id: 'm4',
        sender: 'student',
        senderName: 'Sneha Patel',
        studentId: 'std_102',
        text: 'Thank you for reviewing my Day 8 exam code! The recursion tree explanation helped a lot.',
        timestamp: Date.now() - 1000 * 60 * 180,
        topic: 'Java Recursion'
      }
    ]
  },
  {
    studentId: 'std_103',
    studentName: 'Rohan Verma',
    studentEmail: 'rohan.verma@campus.edu',
    course: 'Digital Accounting & Taxation',
    lastMessage: 'Sir, how do we adjust GST credit across state borders in Tally Prime?',
    lastTimestamp: Date.now() - 1000 * 60 * 300,
    unreadCount: 1,
    messages: [
      {
        id: 'm5',
        sender: 'student',
        senderName: 'Rohan Verma',
        studentId: 'std_103',
        text: 'Sir, how do we adjust GST credit across state borders in Tally Prime?',
        timestamp: Date.now() - 1000 * 60 * 300,
        topic: 'GST Input Tax Credit'
      }
    ]
  }
];

class InboxSyncService {
  private channel: BroadcastChannel | null = null;
  private listeners: ((conversations: StudentConversation[]) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'CONVERSATIONS_UPDATED') {
            this.notifyListeners(this.getConversations());
          }
        };
      } catch {
        // Fallback if BroadcastChannel is not supported
      }
    }
  }

  public getConversations(): StudentConversation[] {
    if (typeof window === 'undefined') return DEFAULT_CONVERSATIONS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[InboxSyncService] Error reading conversations from storage:', e);
    }
    // Initialize with default demo conversations
    this.saveConversations(DEFAULT_CONVERSATIONS);
    return DEFAULT_CONVERSATIONS;
  }

  private saveConversations(convs: StudentConversation[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
      this.channel?.postMessage({ type: 'CONVERSATIONS_UPDATED' });
      this.notifyListeners(convs);
    } catch (e) {
      console.warn('[InboxSyncService] Error saving conversations to storage:', e);
    }
  }

  public getStudentThread(studentId: string): StudentMessage[] {
    const convs = this.getConversations();
    const match = convs.find(c => c.studentId === studentId);
    return match ? match.messages : [];
  }

  public sendStudentMessage(params: {
    studentId: string;
    studentName?: string;
    studentEmail?: string;
    course?: string;
    text: string;
    topic?: string;
  }): StudentMessage {
    const { studentId, studentName = 'Student', studentEmail = 'student@campus.edu', course = 'Active Curriculum', text, topic } = params;
    const convs = this.getConversations();

    const newMsg: StudentMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      sender: 'student',
      senderName: studentName,
      studentId,
      text: text.trim(),
      timestamp: Date.now(),
      topic
    };

    let found = false;
    const updated = convs.map(c => {
      if (c.studentId === studentId) {
        found = true;
        return {
          ...c,
          lastMessage: newMsg.text,
          lastTimestamp: newMsg.timestamp,
          unreadCount: c.unreadCount + 1,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    });

    if (!found) {
      updated.unshift({
        studentId,
        studentName,
        studentEmail,
        course,
        lastMessage: newMsg.text,
        lastTimestamp: newMsg.timestamp,
        unreadCount: 1,
        messages: [newMsg]
      });
    }

    this.saveConversations(updated);
    return newMsg;
  }

  public sendTeacherReply(studentId: string, replyText: string, teacherName = 'Faculty Mentor'): StudentMessage | null {
    const convs = this.getConversations();
    let emittedMsg: StudentMessage | null = null;

    const updated = convs.map(c => {
      if (c.studentId === studentId) {
        const newMsg: StudentMessage = {
          id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          sender: 'teacher',
          senderName: teacherName,
          studentId,
          text: replyText.trim(),
          timestamp: Date.now(),
          topic: c.course
        };
        emittedMsg = newMsg;
        return {
          ...c,
          lastMessage: newMsg.text,
          lastTimestamp: newMsg.timestamp,
          unreadCount: 0,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    });

    if (emittedMsg) {
      this.saveConversations(updated);
    }
    return emittedMsg;
  }

  public markThreadAsRead(studentId: string): void {
    const convs = this.getConversations();
    const updated = convs.map(c => (c.studentId === studentId ? { ...c, unreadCount: 0 } : c));
    this.saveConversations(updated);
  }

  public subscribe(callback: (conversations: StudentConversation[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(convs: StudentConversation[]): void {
    this.listeners.forEach(cb => {
      try {
        cb(convs);
      } catch (err) {
        console.error('[InboxSyncService] Listener error:', err);
      }
    });
  }
}

export const inboxSyncService = new InboxSyncService();
