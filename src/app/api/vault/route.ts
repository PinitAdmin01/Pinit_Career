import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export interface VaultItem {
  id: string;
  title: string;
  item_type: string;
  organization_name?: string;
  description?: string;
  verified: boolean;
  ai_confidence_score: number;
  skill_tags: string[];
  is_public: boolean;
  used_in_resume?: boolean;
  used_in_portfolio?: boolean;
  proof_url?: string;
}

const DEFAULT_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'vault-item-1',
    title: 'Full-Stack Web Development Foundations',
    item_type: 'certification',
    organization_name: 'PinIT Tech Labs',
    description: 'Verified capstone competency in TypeScript, Next.js, and API architecture.',
    verified: true,
    ai_confidence_score: 96,
    skill_tags: ['TypeScript', 'Next.js', 'React', 'REST APIs'],
    is_public: true,
  },
  {
    id: 'vault-item-2',
    title: 'Enterprise Relational Database Design',
    item_type: 'project',
    organization_name: 'Campus Engineering Lab',
    description: 'PostgreSQL schema optimization, ACID transactions, and query indexation benchmark.',
    verified: true,
    ai_confidence_score: 92,
    skill_tags: ['PostgreSQL', 'SQL', 'Database Optimization'],
    is_public: true,
  },
];

export async function GET(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isConfigured = Boolean(url && key && !url.includes('placeholder') && !url.includes('127.0.0.1'));

    if (isConfigured) {
      const { data, error } = await supabase.from('vault_items').select('*').limit(50);
      if (!error && Array.isArray(data) && data.length > 0) {
        return NextResponse.json({ items: data });
      }
    }

    return NextResponse.json({ items: DEFAULT_VAULT_ITEMS });
  } catch (err: any) {
    return NextResponse.json({ items: DEFAULT_VAULT_ITEMS, warning: err?.message || 'Local fallback' });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newItem: VaultItem = {
      id: body.id || `vault_${Date.now()}`,
      title: body.title || 'Untitled Credential',
      item_type: body.item_type || 'certificate',
      organization_name: body.organization_name || 'PinIT Career OS',
      description: body.description || '',
      verified: body.verified ?? true,
      ai_confidence_score: body.ai_confidence_score || 90,
      skill_tags: Array.isArray(body.skill_tags) ? body.skill_tags : ['General'],
      is_public: body.is_public ?? true,
      proof_url: body.proof_url,
    };

    return NextResponse.json({ success: true, item: newItem });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to record vault item', message: err?.message }, { status: 400 });
  }
}
