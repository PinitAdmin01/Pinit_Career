import { supabase } from '@/lib/supabaseClient';
import { tableExists } from '@/lib/services/supabaseTable';

export interface TeacherEventRecord {
  id: string;
  title: string;
  category: 'Workshop' | 'Hackathon' | 'Seminar' | 'Symposium' | 'Placement Drive';
  venue: string;
  eventDate: string;
  durationHours: number;
  budget: number;
  attendeesCount: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  auditStatus: 'approved' | 'pending_audit' | 'compliance_flagged';
  auditedBy: string;
  auditNotes: string;
  startedAt?: string;
  createdAt: string;
}

const STORAGE_KEY = 'pinit_teacher_events_audit_ledger';

const DEFAULT_EVENTS: TeacherEventRecord[] = [
  {
    id: 'evt_001',
    title: 'Annual Campus Hackathon & Open Innovation Expo',
    category: 'Hackathon',
    venue: 'Innovation Hall 101 & Hybrid Discord',
    eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    durationHours: 24,
    budget: 75000,
    attendeesCount: 140,
    status: 'scheduled',
    auditStatus: 'approved',
    auditedBy: 'Dr. Kashyap',
    auditNotes: 'All fire safety, cloud credits, and mentor allocations verified.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'evt_002',
    title: 'NextGen AI & Cloud Infrastructure Workshop',
    category: 'Workshop',
    venue: 'CS Seminar Hall B',
    eventDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    durationHours: 4,
    budget: 15000,
    attendeesCount: 85,
    status: 'scheduled',
    auditStatus: 'approved',
    auditedBy: 'Prof. Anish',
    auditNotes: 'Guest speakers confirmed from Google Cloud & Microsoft Azure.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'evt_003',
    title: 'Enterprise Placement & Mock Defense Symposium',
    category: 'Placement Drive',
    venue: 'Auditorium 1',
    eventDate: new Date().toISOString(),
    durationHours: 6,
    budget: 30000,
    attendeesCount: 210,
    status: 'live',
    auditStatus: 'approved',
    auditedBy: 'Dr. Priya',
    auditNotes: 'Live defense sessions ongoing with Tier-1 recruiters.',
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

let memoryEvents: TeacherEventRecord[] | null = null;

function getStoredEvents(): TeacherEventRecord[] {
  if (typeof window === 'undefined') return memoryEvents || DEFAULT_EVENTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : (memoryEvents || DEFAULT_EVENTS);
  } catch {
    return memoryEvents || DEFAULT_EVENTS;
  }
}

function setStoredEvents(events: TeacherEventRecord[]): void {
  memoryEvents = events;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {}
}

export const teacherEventService = {
  async getEvents(): Promise<TeacherEventRecord[]> {
    try {
      const hasTable = await tableExists('teacher_events_audit');
      if (hasTable) {
        const { data, error } = await supabase.from('teacher_events_audit').select('*').order('event_date', { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            title: d.title,
            category: d.category || 'Workshop',
            venue: d.venue || 'Campus Auditorium',
            eventDate: d.event_date,
            durationHours: Number(d.duration_hours) || 3,
            budget: Number(d.budget) || 10000,
            attendeesCount: Number(d.attendees_count) || 0,
            status: d.status || 'scheduled',
            auditStatus: d.audit_status || 'approved',
            auditedBy: d.audited_by || '',
            auditNotes: d.audit_notes || '',
            startedAt: d.started_at,
            createdAt: d.created_at || new Date().toISOString()
          }));
        }
      }
    } catch {}

    return getStoredEvents();
  },

  async auditEvent(id: string, updates: { auditStatus: 'approved' | 'pending_audit' | 'compliance_flagged'; auditNotes: string; auditedBy: string; budget?: number }): Promise<TeacherEventRecord> {
    const events = await this.getEvents();
    const target = events.find(e => e.id === id);
    if (!target) throw new Error('Event not found');

    const updated: TeacherEventRecord = {
      ...target,
      auditStatus: updates.auditStatus,
      auditNotes: updates.auditNotes,
      auditedBy: updates.auditedBy || 'Faculty Auditor',
      budget: updates.budget !== undefined ? updates.budget : target.budget
    };

    const nextEvents = events.map(e => (e.id === id ? updated : e));
    setStoredEvents(nextEvents);

    try {
      const hasTable = await tableExists('teacher_events_audit');
      if (hasTable) {
        await supabase.from('teacher_events_audit').update({
          audit_status: updated.auditStatus,
          audit_notes: updated.auditNotes,
          audited_by: updated.auditedBy,
          budget: updated.budget
        }).eq('id', id);
      }
    } catch {}

    return updated;
  },

  async startEvent(id: string): Promise<TeacherEventRecord> {
    const events = await this.getEvents();
    const target = events.find(e => e.id === id);
    if (!target) throw new Error('Event not found');

    const updated: TeacherEventRecord = {
      ...target,
      status: 'live',
      startedAt: new Date().toISOString()
    };

    const nextEvents = events.map(e => (e.id === id ? updated : e));
    setStoredEvents(nextEvents);

    try {
      const hasTable = await tableExists('teacher_events_audit');
      if (hasTable) {
        await supabase.from('teacher_events_audit').update({
          status: 'live',
          started_at: updated.startedAt
        }).eq('id', id);
      }
    } catch {}

    return updated;
  },

  async createEvent(data: Partial<TeacherEventRecord>): Promise<TeacherEventRecord> {
    const newEvent: TeacherEventRecord = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: data.title || 'Campus Academic Event',
      category: data.category || 'Workshop',
      venue: data.venue || 'Campus Hall 1',
      eventDate: data.eventDate || new Date(Date.now() + 86400000 * 7).toISOString(),
      durationHours: Number(data.durationHours) || 3,
      budget: Number(data.budget) || 20000,
      attendeesCount: 0,
      status: 'scheduled',
      auditStatus: 'pending_audit',
      auditedBy: '',
      auditNotes: 'Pending faculty inspection.',
      createdAt: new Date().toISOString()
    };

    const events = await this.getEvents();
    const nextEvents = [newEvent, ...events];
    setStoredEvents(nextEvents);

    try {
      const hasTable = await tableExists('teacher_events_audit');
      if (hasTable) {
        await supabase.from('teacher_events_audit').insert({
          id: newEvent.id,
          title: newEvent.title,
          category: newEvent.category,
          venue: newEvent.venue,
          event_date: newEvent.eventDate,
          duration_hours: newEvent.durationHours,
          budget: newEvent.budget,
          attendees_count: newEvent.attendeesCount,
          status: newEvent.status,
          audit_status: newEvent.auditStatus,
          audit_notes: newEvent.auditNotes,
          created_at: newEvent.createdAt
        });
      }
    } catch {}

    return newEvent;
  }
};
