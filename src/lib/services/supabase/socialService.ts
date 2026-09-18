'use client';

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
  { type: 'success', title: 'Mission Completed!', message: 'You completed "LinkedIn Post" and earned +8 trust points.', source: 'mission', is_read: false, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { type: 'info', title: 'New Opportunity Match', message: 'Razorpay React Developer — 91% match for your profile.', source: 'opportunities', is_read: false, created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { type: 'warning', title: 'Career DNA Update', message: 'Your DSA score dropped. Complete 2 algorithm missions to recover.', source: 'exam', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
];

export async function getNotifications(uid: string): Promise<Record<string, unknown>[]> {
  if (!uid || uid === 'guest') return [];
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return [];
  return data || [];
}

export async function markNotificationRead(uid: string, notificationId: string): Promise<void> {
  if (!uid || uid === 'guest') return;
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', uid);
}

export async function markAllNotificationsRead(uid: string): Promise<void> {
  if (!uid || uid === 'guest') return;
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', uid)
    .eq('read', false);
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
        read: false,
        created_at: new Date().toISOString(),
      }));

      const { error: insertErr } = await supabase.from('notifications').insert(chunk);
      if (!insertErr) sentCount += chunk.length;
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
    msg = {
      id: generateTxId('msg'),
      sender_id: senderOrData.sender_id,
      sender_name: senderOrData.sender_name || 'User',
      recipient_id: senderOrData.receiver_id || senderOrData.recipient_id,
      recipient_name: senderOrData.receiver_name || senderOrData.recipient_name || 'Recipient',
      content: senderOrData.content,
      role: senderOrData.category || 'student',
      created_at: new Date().toISOString(),
      is_read: false,
    };
  } else {
    msg = {
      id: generateTxId('msg'),
      sender_id: senderOrData,
      recipient_id: recipientId,
      sender_name: senderName || 'User',
      recipient_name: recipientName || 'Recipient',
      content: content || '',
      role: role || 'student',
      created_at: new Date().toISOString(),
      is_read: false,
    };
  }

  try {
    const { error } = await supabase.from('direct_messages').insert(msg);
    if (!error) return { ok: true, message: msg, ...msg };
  } catch (err) {
    console.warn('[sendDirectMessage] Local fallback notice:', err);
  }

  return { ok: true, message: msg, ...msg };
}

export async function getDirectMessages(user1Id: string, user2Id: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('direct_messages')
      .select('*')
      .or(`and(sender_id.eq.${user1Id},receiver_id.eq.${user2Id}),and(sender_id.eq.${user2Id},receiver_id.eq.${user1Id})`)
      .order('created_at', { ascending: true });

    if (!error && Array.isArray(data)) return data;
  } catch {}
  return [];
}

export async function getTeacherInbox(teacherId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('direct_messages')
      .select('*')
      .eq('receiver_id', teacherId)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) return data;
  } catch {}
  return [];
}

export function subscribeToDirectMessages(
  userId: string,
  onMessage: (msg: Record<string, any>) => void
): { unsubscribe: () => void } {
  try {
    const channel = supabase
      .channel(`direct_messages_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `receiver_id=eq.${userId}`,
        },
        payload => {
          if (payload.new) onMessage(payload.new);
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
    const { error } = await supabase
      .from('direct_messages')
      .update({ read: true })
      .eq('sender_id', user2Id)
      .eq('receiver_id', user1Id)
      .eq('read', false);

    return !error;
  } catch {
    return false;
  }
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('direct_messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('read', false);

    if (!error && typeof count === 'number') return count;
  } catch {}
  return 0;
}
