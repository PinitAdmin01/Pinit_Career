'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';
import { TimelineCategory } from '../types';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tech: string[];
  verified: boolean;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  verified: boolean;
  score?: number;
  assessmentPassed?: boolean;
  assessmentScore?: number;
  verificationStatus?: string;
  auditStatus?: string;
  verifiedAt?: string;
  assessedAt?: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  category: TimelineCategory;
  title: string;
  detail: string;
  verified: boolean;
}

export interface AchievementItem {
  id: string;
  title: string;
  detail: string;
  date?: string;
  verified?: boolean;
}

export interface RecommendationItem {
  id: string;
  author: string;
  role?: string;
  text: string;
  date?: string;
  verified?: boolean;
}

export interface ResearchItem {
  id: string;
  title: string;
  journal: string;
  verified: boolean;
}

export interface LinkedRepoItem {
  repoUrl: string;
  fullName: string;
  description: string;
  stars: number;
  score: number;
  skills: string[];
  verifiedAt: string;
}

export function usePortfolioData(user: any) {
  const [pitch, setPitch] = useState<string>("Add a short professional pitch about your skills and goals.");
  const [tempPitch, setTempPitch] = useState<string>(pitch);
  const [editingPitch, setEditingPitch] = useState<boolean>(false);

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [researchPapers, setResearchPapers] = useState<ResearchItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [linkedRepos, setLinkedRepos] = useState<LinkedRepoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to persist data directly to Supabase portfolio_items
  const persistToSupabase = useCallback(async (itemType: string, itemData: any) => {
    if (!user?.id) return;
    try {
      const { error } = await supabase.from('portfolio_items').upsert({
        user_id: user.id,
        item_type: itemType,
        item_data: itemData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,item_type' });

      if (error) {
        console.warn(`[usePortfolioData] Supabase upsert failed for ${itemType}:`, error.message);
      }
    } catch (err) {
      console.warn(`[usePortfolioData] Network error upserting ${itemType}:`, err);
    }
  }, [user?.id]);

  // Load from Supabase on mount
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadPortfolio() {
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('item_type, item_data')
          .eq('user_id', user.id);

        if (error) {
          console.warn('[usePortfolioData] Error fetching portfolio_items from Supabase:', error.message);
        }

        if (data && data.length > 0 && isMounted) {
          data.forEach(row => {
            const val = row.item_data;
            if (!val) return;
            switch (row.item_type) {
              case 'pitch':
                if (typeof val === 'string') {
                  setPitch(val);
                  setTempPitch(val);
                } else if (val.text) {
                  setPitch(val.text);
                  setTempPitch(val.text);
                }
                break;
              case 'project':
              case 'projects':
                setProjects(val.items || val || []);
                break;
              case 'certificate':
              case 'certificates':
                setCertificates(val.items || val || []);
                break;
              case 'timeline':
                setTimeline(val.items || val || []);
                break;
              case 'research':
                setResearchPapers(val.items || val || []);
                break;
              case 'achievement':
              case 'achievements':
                setAchievements(val.items || val || []);
                break;
              case 'recommendation':
              case 'recommendations':
                setRecommendations(val.items || val || []);
                break;
              case 'github_repo':
              case 'github_repos':
                setLinkedRepos(val.items || val || []);
                break;
            }
          });
        } else if (isMounted) {
          // Fallback to onboarding answers or user profile properties
          const obAny = user?.onboardingAnswers as any;
          if (obAny?.portfolio_projects || user?.projects) {
            setProjects(obAny?.portfolio_projects || user?.projects || []);
          }
          if (obAny?.portfolio_certificates || user?.certifications) {
            setCertificates(obAny?.portfolio_certificates || user?.certifications || []);
          }
          if (obAny?.portfolio_timeline || user?.timeline) {
            setTimeline(obAny?.portfolio_timeline || user?.timeline || []);
          }
          if (obAny?.portfolio_achievements || user?.achievements) {
            setAchievements(obAny?.portfolio_achievements || user?.achievements || []);
          }
          if (obAny?.portfolio_recommendations || user?.recommendations) {
            setRecommendations(obAny?.portfolio_recommendations || user?.recommendations || []);
          }
        }
      } catch (err) {
        console.error('[usePortfolioData] Unexpected error loading portfolio:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.onboardingAnswers, user?.projects, user?.certifications, user?.timeline, user?.achievements, user?.recommendations]);

  const savePitch = useCallback(async (customText?: string) => {
    const textToSave = customText !== undefined ? customText : tempPitch;
    setPitch(textToSave);
    setEditingPitch(false);
    await persistToSupabase('pitch', { text: textToSave });
    api.patch('/api/auth/profile', { bio: textToSave }).catch(() => {});
    toast.success('Pitch Updated', 'Your profile pitch has been saved to Supabase cloud.');
  }, [tempPitch, persistToSupabase]);

  const saveProjects = useCallback(async (next: ProjectItem[]) => {
    setProjects(next);
    await persistToSupabase('projects', { items: next });
    api.patch('/api/auth/profile', { projects: next }).catch(() => {});
  }, [persistToSupabase]);

  const addProject = useCallback(async (title: string, desc: string, tech: string) => {
    if (!title || !desc) return;
    const newProj: ProjectItem = {
      id: `p_${Date.now()}`,
      title,
      description: desc,
      tech: tech.split(',').map(t => t.trim()).filter(Boolean),
      verified: false
    };
    const next = [...projects, newProj];
    await saveProjects(next);
    toast.success('Project Pitch Saved', 'Your project has been synced to Supabase. Pending faculty verification.');
  }, [projects, saveProjects]);

  const saveCertificates = useCallback(async (next: CertificateItem[]) => {
    setCertificates(next);
    await persistToSupabase('certificates', { items: next });
    api.patch('/api/auth/profile', { certificates: next }).catch(() => {});
  }, [persistToSupabase]);

  const saveTimeline = useCallback(async (next: TimelineItem[]) => {
    setTimeline(next);
    await persistToSupabase('timeline', { items: next });
    api.patch('/api/auth/profile', { timeline: next }).catch(() => {});
  }, [persistToSupabase]);

  const addTimelineEvent = useCallback(async (year: string, category: TimelineCategory, title: string, detail: string) => {
    if (!title || !detail) return;
    const newEvt: TimelineItem = {
      id: `t_evt_${Date.now()}`,
      year,
      category,
      title,
      detail,
      verified: false
    };
    const next = [newEvt, ...timeline];
    await saveTimeline(next);
    toast.success('Event Added', 'Milestone event added to timeline and synced to Supabase.');
  }, [timeline, saveTimeline]);

  const saveAchievements = useCallback(async (next: AchievementItem[]) => {
    setAchievements(next);
    await persistToSupabase('achievements', { items: next });
    api.patch('/api/auth/profile', { achievements: next }).catch(() => {});
  }, [persistToSupabase]);

  const addAchievement = useCallback(async (title: string, detail: string) => {
    if (!title.trim()) return;
    const newAch: AchievementItem = {
      id: `ach_${Date.now()}`,
      title: title.trim(),
      detail: detail.trim() || 'Competition & Honors Record',
      date: new Date().toLocaleDateString(),
      verified: false
    };
    const updated = [newAch, ...achievements];
    await saveAchievements(updated);
    toast.success('Achievement Logged', 'Honor / award added to portfolio and synced to Supabase.');
  }, [achievements, saveAchievements]);

  const saveRecommendations = useCallback(async (next: RecommendationItem[]) => {
    setRecommendations(next);
    await persistToSupabase('recommendations', { items: next });
    api.patch('/api/auth/profile', { recommendations: next }).catch(() => {});
  }, [persistToSupabase]);

  const addRecommendation = useCallback(async (author: string, role: string, text: string) => {
    if (!author.trim() || !text.trim()) return;

    let isServerVerified = false;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      const res = await fetch('/api/portfolio/verify-endorsement', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'add_recommendation',
          author: author.trim(),
          role: role.trim(),
          text: text.trim(),
        })
      });
      if (res.ok) {
        const data = await res.json();
        isServerVerified = Boolean(data.isVerified);
      }
    } catch {
      isServerVerified = false;
    }

    const newRec: RecommendationItem = {
      id: `rec_${Date.now()}`,
      author: author.trim(),
      role: role.trim() || 'Academic / Industry Mentor',
      text: text.trim(),
      date: new Date().toLocaleDateString(),
      verified: isServerVerified
    };
    const updated = [newRec, ...recommendations];
    await saveRecommendations(updated);
    toast.success(
      isServerVerified ? 'Faculty Recommendation Verified' : 'Recommendation Submitted',
      isServerVerified
        ? 'Official faculty endorsement validated by institutional authority.'
        : 'Recommendation submitted. Awaiting official faculty verification.'
    );
  }, [recommendations, saveRecommendations]);

  const saveResearch = useCallback(async (next: ResearchItem[]) => {
    setResearchPapers(next);
    await persistToSupabase('research', { items: next });
    api.patch('/api/auth/profile', { researchPapers: next }).catch(() => {});
  }, [persistToSupabase]);

  const saveLinkedRepos = useCallback(async (next: LinkedRepoItem[]) => {
    setLinkedRepos(next);
    await persistToSupabase('github_repos', { items: next });
  }, [persistToSupabase]);

  const toggleVerification = useCallback(async (type: 'project' | 'certificate' | 'research' | 'timeline', id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      const res = await fetch('/api/portfolio/verify-endorsement', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'verify_item',
          type,
          id,
          studentId: user?.id
        })
      });
      if (!res.ok) {
        toast.error('Permission Denied', 'Only authenticated faculty mentors and institutional administrators can verify portfolio evidence.');
        return;
      }
    } catch {
      toast.error('Verification Error', 'Failed to reach server for institutional role verification.');
      return;
    }

    if (type === 'project') {
      const next = projects.map(p => p.id === id ? { ...p, verified: !p.verified } : p);
      await saveProjects(next);
    } else if (type === 'certificate') {
      const next = certificates.map(c => c.id === id ? { ...c, verified: !c.verified } : c);
      await saveCertificates(next);
    } else if (type === 'research') {
      const next = researchPapers.map(r => r.id === id ? { ...r, verified: !r.verified } : r);
      await saveResearch(next);
    } else if (type === 'timeline') {
      const next = timeline.map(t => t.id === id ? { ...t, verified: !t.verified } : t);
      await saveTimeline(next);
    }
    toast.success('Verification status updated');
  }, [projects, certificates, researchPapers, timeline, user?.id, saveProjects, saveCertificates, saveResearch, saveTimeline]);

  return {
    pitch,
    setPitch,
    tempPitch,
    setTempPitch,
    editingPitch,
    setEditingPitch,
    savePitch,
    projects,
    setProjects,
    saveProjects,
    addProject,
    certificates,
    setCertificates,
    saveCertificates,
    timeline,
    setTimeline,
    saveTimeline,
    addTimelineEvent,
    researchPapers,
    setResearchPapers,
    saveResearch,
    achievements,
    setAchievements,
    saveAchievements,
    addAchievement,
    recommendations,
    setRecommendations,
    saveRecommendations,
    addRecommendation,
    linkedRepos,
    setLinkedRepos,
    saveLinkedRepos,
    toggleVerification,
    loading
  };
}
