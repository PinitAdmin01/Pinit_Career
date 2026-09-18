'use client';

import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile } from './StudentCard';
import { toast } from '@/lib/store/useAppStore';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface FriendChatViewProps {
  initialFriendId?: string;
  friends: StudentProfile[];
  onOpenProfile: (student: StudentProfile) => void;
  onOpenChallenge: (student: StudentProfile) => void;
  onOpenProjectInvite: (student: StudentProfile) => void;
}

export const FriendChatView: React.FC<FriendChatViewProps> = ({
  initialFriendId,
  friends,
  onOpenProfile,
  onOpenChallenge,
  onOpenProjectInvite,
}) => {
  const [activeFriend, setActiveFriend] = useState<StudentProfile>(() => {
    if (initialFriendId) {
      const found = friends.find(f => f.id === initialFriendId);
      if (found) return found;
    }
    return friends[0] || {
      id: 'rahul_shetty',
      name: 'Rahul Shetty',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      college: 'RVCE',
      course: 'B.Tech',
      skills: ['Python', 'AI/ML'],
      online: true
    };
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialFriendId) {
      const found = friends.find(f => f.id === initialFriendId);
      if (found) setActiveFriend(found);
    }
  }, [initialFriendId, friends]);

  useEffect(() => {
    if (activeFriend) {
      fetchMessages(activeFriend.id);
    }
  }, [activeFriend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (friendId: string) => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`/api/friends/messages?friendId=${friendId}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.messages)) {
        if (data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          // Provide default conversational messages if empty
          setMessages([
            {
              id: 'seed-1',
              sender_id: friendId,
              receiver_id: 'current_user',
              message: `Hey! Are you working on the campus sprint this weekend?`,
              created_at: new Date(Date.now() - 3600000).toISOString(),
              is_read: true
            },
            {
              id: 'seed-2',
              sender_id: 'current_user',
              receiver_id: friendId,
              message: `Yes! Focusing on Next.js 14 and full-stack integrations. Let's sync up!`,
              created_at: new Date(Date.now() - 1800000).toISOString(),
              is_read: true
            }
          ]);
        }
      }
    } catch (err) {
      console.error('Failed to load chat messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeFriend) return;
    const text = inputText.trim();
    setInputText('');

    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      sender_id: 'current_user',
      receiver_id: activeFriend.id,
      message: text,
      created_at: new Date().toISOString(),
      is_read: false
    };

    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await fetch('/api/friends/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: activeFriend.id, message: text })
      });
      const data = await res.json();
      if (!data.ok) {
        toast.error('Failed to send', data.error || 'Message error');
      }
    } catch (err) {
      toast.error('Network Error', 'Could not send message');
    }
  };

  const filteredFriends = friends.filter(f =>
    f.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (f.college && f.college.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      height: '620px',
      background: 'rgba(15, 23, 42, 0.75)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 16,
      overflow: 'hidden'
    }}>
      
      {/* ── Left Sidebar: Friends & Active Threads ── */}
      <div style={{
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(15, 23, 42, 0.5)'
      }}>
        {/* Search header */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: 12.5,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Friends List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {filteredFriends.map((friend) => {
            const isActive = activeFriend?.id === friend.id;
            return (
              <div
                key={friend.id}
                onClick={() => setActiveFriend(friend)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  cursor: 'pointer',
                  background: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                  borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ position: 'relative', width: 38, height: 38, flexShrink: 0 }}>
                  <img
                    src={friend.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={friend.name}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  {friend.online && <span className="online-beacon" />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {friend.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {friend.course} • {friend.college}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right Pane: Active Chat Window ── */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(10, 15, 30, 0.6)' }}>
        
        {/* Chat Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', width: 40, height: 40 }}>
              <img
                src={activeFriend.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={activeFriend.name}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
              {activeFriend.online && <span className="online-beacon" />}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{activeFriend.name}</div>
              <div style={{ fontSize: 11.5, color: '#34d399' }}>
                {activeFriend.online ? 'Online on campus' : 'Offline'} • {activeFriend.college}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="friends-btn friends-btn-secondary"
              style={{ padding: '6px 12px', fontSize: 11.5 }}
              onClick={() => onOpenProfile(activeFriend)}
            >
              Profile
            </button>
            <button
              className="friends-btn friends-btn-secondary"
              style={{ padding: '6px 12px', fontSize: 11.5 }}
              onClick={() => onOpenChallenge(activeFriend)}
            >
              ⚔️ Duel
            </button>
            <button
              className="friends-btn friends-btn-secondary"
              style={{ padding: '6px 12px', fontSize: 11.5 }}
              onClick={() => onOpenProjectInvite(activeFriend)}
            >
              👥 Project
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map((msg) => {
            const isMe = msg.sender_id === 'current_user';
            const timeFormatted = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: 8
                }}
              >
                {!isMe && (
                  <img
                    src={activeFriend.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={activeFriend.name}
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                  />
                )}
                <div style={{
                  maxWidth: '65%',
                  padding: '10px 14px',
                  borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  background: isMe
                    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                    : 'rgba(30, 41, 59, 0.75)',
                  color: '#ffffff',
                  fontSize: 13,
                  lineHeight: 1.45,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}>
                  <div>{msg.message}</div>
                  <div style={{
                    fontSize: 10,
                    color: isMe ? 'rgba(255, 255, 255, 0.7)' : '#94a3b8',
                    textAlign: 'right',
                    marginTop: 4
                  }}>
                    {timeFormatted} {isMe && '✓✓'}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div style={{ display: 'flex', gap: 8, padding: '6px 20px', overflowX: 'auto' }}>
          <button
            onClick={() => setInputText("Are you free to do an Arena duel on algorithms?")}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 12,
              padding: '4px 10px',
              fontSize: 11,
              color: '#94a3b8',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            ⚔️ "Up for an Arena duel?"
          </button>
          <button
            onClick={() => setInputText("Would love to collaborate on a squad project with you!")}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 12,
              padding: '4px 10px',
              fontSize: 11,
              color: '#94a3b8',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            👥 "Want to join our project squad?"
          </button>
        </div>

        {/* Chat Input Bar */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          gap: 10,
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <input
            type="text"
            placeholder={`Message ${activeFriend.name.split(' ')[0]}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: 13,
              outline: 'none'
            }}
          />
          <button
            className="friends-btn friends-btn-primary"
            onClick={handleSendMessage}
            style={{ padding: '10px 16px', fontSize: 13 }}
          >
            Send ➤
          </button>
        </div>

      </div>

    </div>
  );
};