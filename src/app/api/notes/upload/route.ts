import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const note = {
      id: `note_up_${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      file_name: file.name,
      word_count: Math.max(50, Math.floor(file.size / 6)),
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, note });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process note upload', message: err?.message }, { status: 400 });
  }
}
