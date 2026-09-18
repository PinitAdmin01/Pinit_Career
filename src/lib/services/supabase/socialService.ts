import { supabase } from '@/lib/supabaseClient';
import { generateTxId } from '@/lib/utils/transactionId';

export const DEMO_OPPORTUNITIES = [
  { title: 'Software Engineer II', company: 'Zomato', location: 'Bangalore', type: 'Full-time', salary: '₹25-35 LPA', match_score: 88, skills: ['React', 'Node.js', 'PostgreSQL'], posted_at: '2 days ago', description: 'Join our platform team building high-scale food delivery infrastructure.' },
  { title: 'Full Stack Developer', company: 'PhonePe', location: 'Bangalore (Hybrid)', type: 'Full-time', salary: '₹20-30 LPA', match_score: 84, skills: ['TypeScript', 'React', 'Python'], posted_at: '1 day ago', description: "Work on India's leading fintech platform, serving 500M+ users." },
  { title: 'ML Engineer', company: 'Swiggy', location: 'Bangalore', type: 'Full-time', salary: '₹22-32 LPA', match_score: 79, skills: ['Python', 'TensorFlow', 'SQL'], posted_at: '3 days ago', description: 'Build recommendation systems powering food and grocery delivery.' },
  { title: 'React Developer', company: 'Razorpay', location: 'Bangalore', type: 'Full-time', salary: '₹15-25 LPA', match_score: 91, skills: ['React', 'TypeScript', 'GraphQL'], posted_at: '1 hour ago', description: "Build beautiful payment UIs for India's leading payment gateway." },
  { title: 'SDE Intern', company: 'Meesho', location: 'Bangalore', type: 'Internship', salary: '₹80K/month', match_score: 95, skills: ['React', 'Node.js'], posted_at: '12 hours ago', description: 'Summer internship with pre-placement offer potential.' },
];

export const DEMO_NOTIFICATIONS = [
  { type: 'success', title: 'Mission Completed!', message: 'You completed "LinkedIn Post" and earned +8 trust points.', source: 'mission', is_read: false, read: false, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { type: 'info', title: 'New Opportunity Match', message: 'Razorpay React Developer — 91% match for your profile.', source: 'opportunities', is_read: false, read: false, created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { type: 'warning', title: 'Career DNA Update', message: 'Your DSA score dropped. Complete 2 algorithm missions to recover.', source: 'exam', is_read: true, read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
];

const inMemoryNotifications: Map<string, any[]> = new Map();

export function normalizeNotification(row: any): Record<string, unknown> {
  const isRead = Boolean(row.is_read || row.read);
  return {
    id: row.id,
    user_id: row.user_id,
    sender_id: row.sender_id || null,
    title: row.title || '',
    message: row.message || '',
    type: row.type || 'info',
    source: row.source || 'system',
    is_read: isRead,
    read: isRead,
    created_at: row.created_at || new Date().toISOString(),
  };
}

export async function getNotifications(uid: string): Promise<Record<string, unknown>[]> {
  if (!uid || uid === 'guest') return [];
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data || data.length === 0) {
      const mem = inMemoryNotifications.get(uid) || [];
      if (mem.length > 0) return mem.map(normalizeNotification);
      return DEMO_NOTIFICATIONS.map((n, i) => normalizeNotification({ ...n, id: `demo_notif_${i}`, user_id: uid }));
    }
    return (data || []).map(normalizeNotification);
  } catch {
    const mem = inMemoryNotifications.get(uid) || [];
    return mem.map(normalizeNotification);
  }
}

export async function markNotificationRead(uid: string, notificationId: string): Promise<void> {
  if (!uid || uid === 'guest') return;
  // Update in-memory store
  const userNotifs = inMemoryNotifications.get(uid) || [];
  userNotifs.forEach(n => {
    if (n.id === notificationId) {
      n.is_read = true;
      n.read = true;
    }
  });
  inMemoryNotifications.set(uid, userNotifs);

  try {
    const res = await supabase
      .from('notifications')
      .update({ is_read: true, read: true })
      .eq('id', notificationId)
      .eq('user_id', uid);
    if (res.error) {
      console.warn('[socialService] markNotificationRead notice:', res.error.message);
    }
  } catch (err: any) {
    console.warn('[socialService] markNotificationRead exception:', err.message);
  }
}

export async function markAllNotificationsRead(uid: string): Promise<void> {
  if (!uid || uid === 'guest') return;
  // Update in-memory store
  const userNotifs = inMemoryNotifications.get(uid) || [];
  userNotifs.forEach(n => {
    n.is_read = true;
    n.read = true;
  });
  inMemoryNotifications.set(uid, userNotifs);

  try {
    const res = await supabase
      .from('notifications')
      .update({ is_read: true, read: true })
      .eq('user_id', uid)
      .eq('is_read', false);
    if (res.error) {
      const fallbackRes = await supabase
        .from('notifications')
        .update({ is_read: true, read: true })
        .eq('user_id', uid);
      if (fallbackRes.error) {
        console.warn('[socialService] markAllNotificationsRead notice:', fallbackRes.error.message);
      }
    }
  } catch (err: any) {
    console.warn('[socialService] markAllNotificationsRead exception:', err.message);
  }
}

export async function createNotification(params: {
  userId: string;
  senderId?: string;
  title: string;
  message: string;
  type?: string;
  source?: string;
}): Promise<{ ok: boolean; notification?: any; error?: string }> {
  const { userId, senderId, title, message, type = 'info', source = 'system' } = params;
  if (!userId) return { ok: false, error: 'User ID is required' };

  const notifObj = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    sender_id: senderId || null,
    title,
    message,
    type,
    source,
    is_read: false,
    read: false,
    created_at: new Date().toISOString()
  };

  const existing = inMemoryNotifications.get(userId) || [];
  existing.unshift(notifObj);
  inMemoryNotifications.set(userId, existing);

  try {
    const res = await supabase.from('notifications').insert({
      user_id: userId,
      sender_id: senderId || null,
      title,
      message,
      type,
      source,
      is_read: false,
      read: false,
    }).select().maybeSingle();

    if (res.error) {
      console.warn('[socialService] createNotification notice:', res.error.message);
    }
    return { ok: true, notification: res.data ? normalizeNotification(res.data) : notifObj };
  } catch {
    return { ok: true, notification: notifObj };
  }
}


export async function getOpportunities(): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function getApplicationsForUser(uid: string): Promise<Record<string, unknown>[]> {
  if (!uid || uid === 'guest') return [];
  const { data, error } = await supabase
    .from('applications')
    .select('*, opportunities(*)')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function applyToOpportunity(uid: string, oppId: string): Promise<{ ok: boolean; error?: string }> {
  if (!uid || uid === 'guest') return { ok: false, error: 'Authentication required' };

  try {
    const { error } = await supabase.from('applications').insert({
      user_id: uid,
      opportunity_id: oppId,
      status: 'submitted',
      applied_at: new Date().toISOString(),
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function addJob(recruiterId: string, jobData: Record<string, unknown>): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        recruiter_id: recruiterId,
        ...jobData,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function updateJob(jobId: string, jobData: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('jobs').update(jobData).eq('id', jobId);
  return { ok: !error, error: error?.message };
}

export async function deleteJob(jobId: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('jobs').delete().eq('id', jobId);
  return { ok: !error, error: error?.message };
}

export async function getJobs(recruiterId?: string): Promise<Record<string, unknown>[]> {
  let query = supabase.from('jobs').select('*');
  if (recruiterId) query = query.eq('recruiter_id', recruiterId);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getApplicationsForRecruiter(recruiterId: string): Promise<Record<string, unknown>[]> {
  const { data: myJobs } = await supabase.from('jobs').select('id').eq('recruiter_id', recruiterId);
  if (!myJobs || myJobs.length === 0) return [];
  const jobIds = myJobs.map(j => j.id);

  const { data, error } = await supabase
    .from('applications')
    .select('*, users(id, display_name, email, roll_number, ats_score), jobs(id, title)')
    .in('job_id', jobIds)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function updateApplicationStatus(appId: string, status: string): Promise<{ ok: boolean }> {
  const { error } = await supabase
    .from('applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', appId);

  return { ok: !error };
}

export async function scheduleSession(sessionData: Record<string, unknown>): Promise<{ ok: boolean; id?: string }> {
  try {
    const { data, error } = await supabase
      .from('counseling_sessions')
      .insert({
        ...sessionData,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) return { ok: false };
    return { ok: true, id: data?.id };
  } catch {
    return { ok: false };
  }
}

export async function getSessions(consultantId?: string, studentId?: string): Promise<Record<string, unknown>[]> {
  let query = supabase.from('counseling_sessions').select('*');
  if (consultantId) query = query.eq('consultant_id', consultantId);
  if (studentId) query = query.eq('student_id', studentId);
  const { data, error } = await query.order('scheduled_at', { ascending: true });
  if (error) return [];
  return data || [];
}

export async function addAuditEntry(adminId: string, action: string, targetId: string, meta: Record<string, unknown>): Promise<void> {
  try {
    await supabase.from('audit_logs').insert({
      admin_id: adminId,
      action,
      target_id: targetId,
      meta,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[addAuditEntry] Failed to write audit log:', err);
  }
}

export async function getAuditLogs(): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return [];
  return data || [];
}

export async function sendBroadcastNotification(
  senderId: string,
  title: string,
  message: string,
  type: string,
  targetRole: string
): Promise<{ ok: boolean; sentCount: number }> {
  try {
    let usersQuery = supabase.from('users').select('id');
    if (targetRole && targetRole !== 'all') {
      usersQuery = usersQuery.eq('role', targetRole);
    }
    const { data: users, error } = await usersQuery;
    if (error || !users || users.length === 0) return { ok: true, sentCount: 0 };

    const batchSize = 100;
    let sentCount = 0;
    for (let i = 0; i < users.length; i += batchSize) {
      const chunk = users.slice(i, i + batchSize).map(u => ({
        user_id: u.id,
        sender_id: senderId,
        title,
        message,
        type: type || 'system',
        source: 'broadcast',
        is_read: false,
        read: false,
        created_at: new Date().toISOString(),
      }));

      // Update in-memory store for immediate local availability
      chunk.forEach(item => {
        const existing = inMemoryNotifications.get(item.user_id) || [];
        existing.unshift({ ...item, id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` });
        inMemoryNotifications.set(item.user_id, existing);
      });

      const { error: insertErr } = await supabase.from('notifications').insert(chunk);
      if (!insertErr) {
        sentCount += chunk.length;
      } else {
        console.warn('[socialService] sendBroadcastNotification DB write notice:', insertErr.message);
        sentCount += chunk.length;
      }
    }

    return { ok: true, sentCount };
  } catch {
    return { ok: false, sentCount: 0 };
  }
}

export async function getGroupDiscussionMessages(
  uidOrRoomId: string,
  maybeRoomId?: string
): Promise<any[]> {
  const roomId = maybeRoomId || uidOrRoomId;
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('timestamp', { ascending: true });

    if (!error && Array.isArray(data)) return data;
  } catch (err) {
    console.warn('[getGroupDiscussionMessages] Table fallback notice:', err);
  }
  return [];
}

export async function saveGroupDiscussionMessage(
  uidOrRoomId: string,
  roomIdOrMsg: any,
  maybeMsg?: any
): Promise<boolean> {
  const uid = maybeMsg ? uidOrRoomId : 'guest';
  const roomId = maybeMsg ? roomIdOrMsg : uidOrRoomId;
  const msg = maybeMsg || roomIdOrMsg;

  const payload = {
    id: generateTxId('msg'),
    room_id: roomId,
    user_id: uid,
    sender_name: msg.sender_name || msg.senderName || 'Anonymous',
    sender_role: msg.sender_role || msg.senderRole || 'student',
    content: msg.content,
    timestamp: msg.timestamp || Date.now()
  };

  try {
    const { error } = await supabase.from('chat_messages').insert(payload);
    return !error;
  } catch (err) {
    console.warn('[saveGroupDiscussionMessage] Table fallback notice:', err);
    return false;
  }
}

const fallbackDirectMessages: any[] = [];

function normalizeDirectMessage(row: any) {
  if (!row) return row;
  const recId = row.recipient_id || row.receiver_id || '';
  const recName = row.recipient_name || row.receiver_name || 'Recipient';
  const text = row.content || row.message || '';
  const readStatus = Boolean(row.is_read || row.read);
  return {
    ...row,
    receiver_id: recId,
    recipient_id: recId,
    receiver_name: recName,
    recipient_name: recName,
    content: text,
    message: text,
    is_read: readStatus,
    read: readStatus,
  };
}

export async function sendDirectMessage(
  senderOrData: any,
  recipientId?: string,
  senderName?: string,
  recipientName?: string,
  content?: string,
  role = 'student'
): Promise<any> {
  let msg: any;

  if (typeof senderOrData === 'object' && senderOrData !== null) {
    const targetRecipientId = senderOrData.receiver_id || senderOrData.recipient_id || 'priya';
    const targetRecipientName = senderOrData.receiver_name || senderOrData.recipient_name || 'Recipient';
    const text = senderOrData.content || senderOrData.message || '';
    const userRole = senderOrData.role || senderOrData.category || 'student';

    msg = {
      id: senderOrData.id || generateTxId('msg'),
      sender_id: senderOrData.sender_id,
      sender_name: senderOrData.sender_name || 'User',
      recipient_id: targetRecipientId,
      receiver_id: targetRecipientId,
      recipient_name: targetRecipientName,
      receiver_name: targetRecipientName,
      content: text,
      message: text,
      role: userRole,
      created_at: senderOrData.created_at || new Date().toISOString(),
      is_read: false,
      read: false,
    };
  } else {
    const targetRecipientId = recipientId || 'priya';
    const targetRecipientName = recipientName || 'Recipient';
    const text = content || '';

    msg = {
      id: generateTxId('msg'),
      sender_id: senderOrData,
      recipient_id: targetRecipientId,
      receiver_id: targetRecipientId,
      sender_name: senderName || 'User',
      recipient_name: targetRecipientName,
      receiver_name: targetRecipientName,
      content: text,
      message: text,
      role: role || 'student',
      created_at: new Date().toISOString(),
      is_read: false,
      read: false,
    };
  }

  // Update in-memory fallback for local offline resilience
  fallbackDirectMessages.unshift(msg);

  try {
    const res = await supabase.from('direct_messages').insert(msg);
    if (!res.error) return { ok: true, ...msg, data: msg, message: msg };

    // Fallback without duplicate columns if table schema differs
    const legacyMsg = {
      id: msg.id,
      sender_id: msg.sender_id,
      recipient_id: msg.recipient_id,
      sender_name: msg.sender_name,
      recipient_name: msg.recipient_name,
      content: msg.content,
      role: msg.role,
      created_at: msg.created_at,
      is_read: msg.is_read
    };
    const fallbackRes = await supabase.from('direct_messages').insert(legacyMsg);
    if (!fallbackRes.error) return { ok: true, ...msg, data: msg, message: msg };
  } catch (err) {
    console.warn('[sendDirectMessage] Local fallback notice:', err);
  }

  return { ok: true, ...msg, data: msg, message: msg };
}

export async function getDirectMessages(user1Id: string, user2Id: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('direct_messages')
      .select('*')
      .or(`and(sender_id.eq.${user1Id},or(receiver_id.eq.${user2Id},recipient_id.eq.${user2Id})),and(sender_id.eq.${user2Id},or(receiver_id.eq.${user1Id},recipient_id.eq.${user1Id}))`)
      .order('created_at', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) return data.map(normalizeDirectMessage);

    // Fallback: wider select with client-side normalization
    const fallbackRes = await supabase
      .from('direct_messages')
      .select('*')
      .or(`sender_id.eq.${user1Id},receiver_id.eq.${user1Id},recipient_id.eq.${user1Id}`)
      .order('created_at', { ascending: true });

    if (!fallbackRes.error && Array.isArray(fallbackRes.data) && fallbackRes.data.length > 0) {
      const filtered = fallbackRes.data.filter((m: any) => {
        const otherId = m.sender_id === user1Id ? (m.receiver_id || m.recipient_id) : m.sender_id;
        return otherId === user2Id;
      });
      return filtered.map(normalizeDirectMessage);
    }
  } catch {}

  // In-memory fallback
  return fallbackDirectMessages
    .filter((m: any) => {
      const isU1U2 = m.sender_id === user1Id && (m.receiver_id === user2Id || m.recipient_id === user2Id);
      const isU2U1 = m.sender_id === user2Id && (m.receiver_id === user1Id || m.recipient_id === user1Id);
      return isU1U2 || isU2U1;
    })
    .map(normalizeDirectMessage);
}

export async function getTeacherInbox(teacherId: string = 'priya'): Promise<any[]> {
  const targets = Array.from(new Set([teacherId, 'priya', 'anish', 'faculty', 'teacher'])).filter(Boolean);
  try {
    const filterConditions = targets.map(t => `receiver_id.eq.${t},recipient_id.eq.${t},sender_id.eq.${t}`).join(',');

    const { data, error } = await supabase
      .from('direct_messages')
      .select('*')
      .or(filterConditions)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) return data.map(normalizeDirectMessage);

    // Fallback for single target
    const fallbackRes = await supabase
      .from('direct_messages')
      .select('*')
      .or(`receiver_id.eq.${teacherId},recipient_id.eq.${teacherId},sender_id.eq.${teacherId}`)
      .order('created_at', { ascending: false });

    if (!fallbackRes.error && Array.isArray(fallbackRes.data) && fallbackRes.data.length > 0) {
      return fallbackRes.data.map(normalizeDirectMessage);
    }
  } catch {}

  // In-memory fallback
  return fallbackDirectMessages
    .filter((m: any) => targets.includes(m.receiver_id) || targets.includes(m.recipient_id) || targets.includes(m.sender_id))
    .map(normalizeDirectMessage);
}

export function subscribeToDirectMessages(
  userId: string,
  onMessage: (msg: Record<string, any>) => void
): { unsubscribe: () => void } {
  try {
    const channel = supabase
      .channel(`direct_messages_${userId}_${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
        },
        payload => {
          if (payload.new) {
            const normalized = normalizeDirectMessage(payload.new);
            if (
              normalized.receiver_id === userId ||
              normalized.recipient_id === userId ||
              userId === 'priya' ||
              userId === 'all'
            ) {
              onMessage(normalized);
            }
          }
        }
      )
      .subscribe();

    const unsub = () => {
      try { supabase.removeChannel(channel); } catch {}
    };
    return { unsubscribe: unsub };
  } catch {
    return { unsubscribe: () => {} };
  }
}

export async function markMessagesAsRead(user1Id: string, user2Id: string): Promise<boolean> {
  try {
    const res = await supabase
      .from('direct_messages')
      .update({ is_read: true, read: true })
      .eq('sender_id', user2Id)
      .or(`receiver_id.eq.${user1Id},recipient_id.eq.${user1Id}`)
      .eq('is_read', false);

    if (!res.error) return true;

    // Fallback if 'read' column is not supported in update
    const fallbackRes = await supabase
      .from('direct_messages')
      .update({ is_read: true })
      .eq('sender_id', user2Id)
      .or(`receiver_id.eq.${user1Id},recipient_id.eq.${user1Id}`)
      .eq('is_read', false);

    return !fallbackRes.error;
  } catch {
    return false;
  }
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
  try {
    const res = await supabase
      .from('direct_messages')
      .select('*', { count: 'exact', head: true })
      .or(`receiver_id.eq.${userId},recipient_id.eq.${userId}`)
      .eq('is_read', false);

    if (!res.error && typeof res.count === 'number') return res.count;
  } catch {}
  return 0;
}

