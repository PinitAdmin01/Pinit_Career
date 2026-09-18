'use client';

import {
  sendDirectMessage,
  getTeacherInbox,
  getDirectMessages,
  markMessagesAsRead,
  subscribeToDirectMessages
} from '@/lib/services/supabase/socialService';

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

class InboxSyncService {
  private channel: BroadcastChannel | null = null;
  private listeners: ((conversations: StudentConversation[]) => void)[] = [];
  private realtimeUnsub: (() => void) | null = null;
  private isSubscribedRealtime = false;

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

  private memoryStore: StudentConversation[] = [];

  public getConversations(): StudentConversation[] {
    if (typeof window === 'undefined') return [...this.memoryStore];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[InboxSyncService] Error reading conversations from storage:', e);
    }
    return [...this.memoryStore];
  }

  private saveConversations(convs: StudentConversation[]): void {
    this.memoryStore = [...convs];
    if (typeof window === 'undefined') {
      this.notifyListeners(convs);
      return;
    }
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

  /**
   * Synchronize conversations from the database.
   * Pulls all direct messages addressed to or from this teacher/mentor,
   * merges with existing local state, and notifies listeners.
   */
  public async syncFromDatabase(targetId: string = 'priya'): Promise<StudentConversation[]> {
    try {
      const dbMessages = await getTeacherInbox(targetId);
      if (!Array.isArray(dbMessages) || dbMessages.length === 0) {
        return this.getConversations();
      }

      const convs = this.getConversations();
      const convMap = new Map<string, StudentConversation>();

      // Populate existing local conversations
      convs.forEach(c => convMap.set(c.studentId, { ...c, messages: [...c.messages] }));

      for (const row of dbMessages) {
        const isTeacher = row.role === 'teacher' || row.sender_id === targetId;
        const studentId = isTeacher ? (row.receiver_id || row.recipient_id) : row.sender_id;
        if (!studentId) continue;

        const studentName = isTeacher
          ? (row.receiver_name || row.recipient_name || 'Student')
          : (row.sender_name || 'Student');

        const rawContent = row.content || row.message || '';
        let topic = 'General';
        let text = rawContent;
        const match = rawContent.match(/^\[(.*?)\]:\s*(.*)$/);
        if (match) {
          topic = match[1];
          text = match[2];
        }

        const msg: StudentMessage = {
          id: row.id,
          sender: isTeacher ? 'teacher' : 'student',
          senderName: row.sender_name || (isTeacher ? 'Faculty Mentor' : studentName),
          studentId,
          text,
          timestamp: new Date(row.created_at).getTime(),
          topic,
        };

        if (!convMap.has(studentId)) {
          convMap.set(studentId, {
            studentId,
            studentName,
            studentEmail: `${studentId}@campus.edu`,
            course: topic !== 'General' ? topic : 'Academic Guidance',
            lastMessage: msg.text,
            lastTimestamp: msg.timestamp,
            unreadCount: !isTeacher && !row.is_read ? 1 : 0,
            messages: [msg],
          });
        } else {
          const conv = convMap.get(studentId)!;
          // Avoid duplicate messages
          if (!conv.messages.some(m => m.id === msg.id)) {
            conv.messages.push(msg);
            conv.messages.sort((a, b) => a.timestamp - b.timestamp);
            if (msg.timestamp > conv.lastTimestamp) {
              conv.lastMessage = msg.text;
              conv.lastTimestamp = msg.timestamp;
            }
            if (!isTeacher && !row.is_read) {
              conv.unreadCount += 1;
            }
          }
        }
      }

      const merged = Array.from(convMap.values()).sort((a, b) => b.lastTimestamp - a.lastTimestamp);
      this.saveConversations(merged);
      return merged;
    } catch (err) {
      console.warn('[InboxSyncService] Failed to sync from database:', err);
      return this.getConversations();
    }
  }

  public sendStudentMessage(params: {
    studentId: string;
    studentName?: string;
    studentEmail?: string;
    course?: string;
    text: string;
    topic?: string;
    recipientId?: string;
    recipientName?: string;
  }): StudentMessage {
    const {
      studentId,
      studentName = 'Student',
      studentEmail = 'student@campus.edu',
      course = 'Active Curriculum',
      text,
      topic,
      recipientId = 'priya',
      recipientName = 'Faculty Mentor'
    } = params;
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

    // Persist to database asynchronously
    sendDirectMessage({
      id: newMsg.id,
      sender_id: studentId,
      sender_name: studentName,
      receiver_id: recipientId,
      recipient_id: recipientId,
      receiver_name: recipientName,
      recipient_name: recipientName,
      content: topic ? `[${topic}]: ${text.trim()}` : text.trim(),
      message: topic ? `[${topic}]: ${text.trim()}` : text.trim(),
      role: 'student',
      created_at: new Date(newMsg.timestamp).toISOString()
    }).catch(err => {
      console.warn('[InboxSyncService] Database message save warning:', err);
    });

    return newMsg;
  }

  public sendTeacherReply(
    studentId: string,
    replyText: string,
    teacherName = 'Faculty Mentor',
    teacherId = 'priya'
  ): StudentMessage | null {
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

      // Persist reply to database asynchronously
      sendDirectMessage({
        id: (emittedMsg as StudentMessage).id,
        sender_id: teacherId,
        sender_name: teacherName,
        receiver_id: studentId,
        recipient_id: studentId,
        receiver_name: 'Student',
        recipient_name: 'Student',
        content: replyText.trim(),
        message: replyText.trim(),
        role: 'teacher',
        created_at: new Date((emittedMsg as StudentMessage).timestamp).toISOString()
      }).catch(err => {
        console.warn('[InboxSyncService] Database reply save warning:', err);
      });

      // Mark incoming student messages as read in DB
      markMessagesAsRead(teacherId, studentId).catch(() => {});
    }
    return emittedMsg;
  }

  public markThreadAsRead(studentId: string, readerId: string = 'priya'): void {
    const convs = this.getConversations();
    const updated = convs.map(c => (c.studentId === studentId ? { ...c, unreadCount: 0 } : c));
    this.saveConversations(updated);
    markMessagesAsRead(readerId, studentId).catch(() => {});
  }

  public subscribe(callback: (conversations: StudentConversation[]) => void): () => void {
    this.listeners.push(callback);

    // Lazily subscribe to database real-time stream if not already active
    if (!this.isSubscribedRealtime && typeof window !== 'undefined') {
      try {
        const res = subscribeToDirectMessages('priya', () => {
          this.syncFromDatabase('priya');
        });
        this.realtimeUnsub = res.unsubscribe;
        this.isSubscribedRealtime = true;
      } catch {
        // Realtime optional
      }
    }

    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
      if (this.listeners.length === 0 && this.realtimeUnsub) {
        this.realtimeUnsub();
        this.realtimeUnsub = null;
        this.isSubscribedRealtime = false;
      }
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
