import { supabase } from '@/lib/supabaseClient';

function parsePath(path: string): { col: string; id?: string } {
  const parts = path.split('/').filter(Boolean);
  return {
    col: parts[0] || 'default',
    id: parts[1]
  };
}

// Known tables present in Supabase PostgREST schema
const SUPABASE_TABLES = new Set(['users', 'profiles', 'audit_logs']);

export const DB = {
  async save(path: string, data: any) {
    const { col } = parsePath(path);
    const id = data.id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const cleanData = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString()
    };

    if (SUPABASE_TABLES.has(col)) {
      try {
        const { data: res, error } = await supabase.from(col).insert([cleanData]).select().single();
        if (!error && res) cleanData.id = res.id;
      } catch {}
    }

    try {
      const existing = JSON.parse(localStorage.getItem(`pinit_db_${col}`) || '[]');
      existing.push(cleanData);
      localStorage.setItem(`pinit_db_${col}`, JSON.stringify(existing));
    } catch {}

    return cleanData.id;
  },

  async getAll(path: string) {
    const { col } = parsePath(path);

    // Special mapping for 'students' -> query user profiles from Supabase users table
    if (col === 'students') {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('role', 'student');
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(u => ({
            id: u.id,
            name: u.display_name || u.name || u.username || 'Student',
            displayName: u.display_name || u.name || u.username || 'Student',
            registerNumber: u.register_number || u.id?.slice(0, 8),
            batch: u.batch || 'Batch 1',
            email: u.email || '',
            phone: u.phone || '',
            ats_score: u.ats_score || 65,
            trust_score: u.trust_score || 70,
            attendance: u.attendance || 82,
            exam_score: u.exam_score || 74
          }));
        }
      } catch {}
    }

    if (SUPABASE_TABLES.has(col)) {
      try {
        const { data, error } = await supabase.from(col).select('*');
        if (!error && Array.isArray(data) && data.length > 0) {
          return data;
        }
      } catch {}
    }

    // High-performance LocalStorage fallback for app collections
    try {
      const cached = localStorage.getItem(`pinit_db_${col}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}

    return [];
  },

  async getOne(path: string) {
    const { col, id } = parsePath(path);
    if (!id) return null;
    if (SUPABASE_TABLES.has(col)) {
      try {
        const { data, error } = await supabase.from(col).select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch {}
    }

    try {
      const cached = JSON.parse(localStorage.getItem(`pinit_db_${col}`) || '[]');
      return cached.find((item: any) => item.id === id) || null;
    } catch {
      return null;
    }
  },

  async update(path: string, data: any) {
    const { col, id } = parsePath(path);
    if (!id) return;
    if (SUPABASE_TABLES.has(col)) {
      try {
        await supabase.from(col).upsert([{ ...data, id, updatedAt: new Date().toISOString() }]);
      } catch {}
    }

    try {
      const cached = JSON.parse(localStorage.getItem(`pinit_db_${col}`) || '[]');
      const idx = cached.findIndex((item: any) => item.id === id);
      if (idx !== -1) {
        cached[idx] = { ...cached[idx], ...data };
      } else {
        cached.push({ ...data, id });
      }
      localStorage.setItem(`pinit_db_${col}`, JSON.stringify(cached));
    } catch {}
  },

  async patch(path: string, data: any) {
    return this.update(path, data);
  },

  async delete(path: string) {
    const { col, id } = parsePath(path);
    if (!id) return;
    if (SUPABASE_TABLES.has(col)) {
      try {
        await supabase.from(col).delete().eq('id', id);
      } catch {}
    }

    try {
      const cached = JSON.parse(localStorage.getItem(`pinit_db_${col}`) || '[]');
      const filtered = cached.filter((item: any) => item.id !== id);
      localStorage.setItem(`pinit_db_${col}`, JSON.stringify(filtered));
    } catch {}
  }
};

export const FileStorage = {
  download(base64: string, fileName: string) {
    if (typeof window === 'undefined') return;
    const link = document.createElement('a');
    link.href = base64;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  openInTab(base64: string) {
    if (typeof window === 'undefined') return;
    const win = window.open();
    if (win) {
      win.document.write(`<iframe src="${base64}" style="width:100%;height:100vh;border:none;"></iframe>`);
    }
  },
  formatSize(bytes: number) {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  },
  getIcon(fileType: string = '', fileName: string = '') {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (fileType.includes('pdf') || ext === 'pdf') return '📄';
    if (fileType.includes('word') || ext === 'docx' || ext === 'doc') return '📝';
    if (fileType.includes('sheet') || ext === 'xlsx' || ext === 'xls') return '📊';
    if (fileType.includes('presentation') || ext === 'pptx' || ext === 'ppt') return '📊';
    if (fileType.includes('image') || ['png','jpg','jpeg','gif','webp'].includes(ext)) return '🖼️';
    if (fileType.includes('zip') || ['zip','rar','7z'].includes(ext)) return '🗜️';
    if (fileType.includes('text') || ext === 'txt') return '📃';
    return '📎';
  }
};
