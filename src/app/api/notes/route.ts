import { NextResponse } from 'next/server';

interface NoteRecord {
  id: string;
  title: string;
  file_name: string;
  word_count: number;
  created_at: string;
}

const DEFAULT_NOTES: NoteRecord[] = [
  {
    id: 'note_1',
    title: 'React Fiber Reconciliation & Scheduling',
    file_name: 'react_fiber_notes.md',
    word_count: 840,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'note_2',
    title: 'PostgreSQL Indexing & B-Tree Optimization',
    file_name: 'sql_indexes.md',
    word_count: 620,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export async function GET(req: Request) {
  return NextResponse.json({ notes: DEFAULT_NOTES, count: DEFAULT_NOTES.length });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const newNote: NoteRecord = {
      id: `note_${Date.now()}`,
      title: body.title || 'Untitled Note',
      file_name: body.file_name || 'quick_note.md',
      word_count: typeof body.content === 'string' ? body.content.split(/\s+/).length : 120,
      created_at: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, note: newNote });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create note', message: err?.message }, { status: 400 });
  }
}
