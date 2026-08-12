import { supabase } from '@/lib/supabaseClient';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const DB_FILE = 'src/lib/data/library_db.json';

// Interface types
export interface LibraryBook {
  isbn: string;
  title: string;
  author: string;
  genre: string;
  copies: number;
  available: number;
  isEbook: boolean;
  ebookContent?: string;
}

export interface LibraryBorrowing {
  id: string;
  studentId: string;
  studentName: string;
  isbn: string;
  title: string;
  borrowedOn: string;
  dueOn: string;
  returned: boolean;
  returnedOn?: string;
  fine: number;
}

export interface LibraryReservation {
  id: string;
  studentId: string;
  studentName: string;
  isbn: string;
  title: string;
  position: number;
  createdAt: string;
}

// Read local JSON database
async function readLocalDb(): Promise<any> {
  return await readLocalJson(DB_FILE, { books: [], borrowed: [], reserves: [] });
}

// Write local JSON database
async function writeLocalDb(data: any): Promise<void> {
  await writeLocalJson(DB_FILE, data);
}

// Check if Supabase tables exist
async function checkSupabaseAvailable(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select('count', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
}

export const libraryService = {
  async getStats(studentId: string, studentName: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('library_books');

    if (isSupabaseAvailable) {
      try {
        const { data: books } = await supabase.from('library_books').select('*');
        const { data: borrowings } = await supabase.from('library_borrowings').select('*').eq('student_id', studentId);
        const { data: reservations } = await supabase.from('library_reservations').select('*').eq('student_id', studentId);

        return {
          books: (books || []).map(b => ({
            isbn: b.isbn,
            title: b.title,
            author: b.author,
            genre: b.genre,
            copies: b.copies,
            available: b.available,
            isEbook: b.is_ebook,
            ebookContent: b.ebook_content
          })),
          borrowed: (borrowings || []).map(br => ({
            id: br.id,
            studentId: br.student_id,
            studentName: br.student_name,
            isbn: br.isbn,
            title: br.title,
            borrowedOn: br.borrowed_on,
            dueOn: br.due_on,
            returned: br.returned,
            returnedOn: br.returned_on,
            fine: br.fine
          })),
          reserves: (reservations || []).map(r => ({
            id: r.id,
            studentId: r.student_id,
            studentName: r.student_name,
            isbn: r.isbn,
            title: r.title,
            position: r.position,
            createdAt: r.created_at
          }))
        };
      } catch (err) {
        console.warn('Supabase read failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const myBorrows = db.borrowed?.filter((b: any) => b.studentId === studentId || b.studentName === studentName) || [];
    const myReserves = db.reserves?.filter((r: any) => r.studentId === studentId || r.studentName === studentName) || [];

    return {
      books: db.books || [],
      borrowed: myBorrows,
      reserves: myReserves
    };
  },

  async borrow(studentId: string, studentName: string, isbn: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('library_borrowings');

    if (isSupabaseAvailable) {
      try {
        const { data: book } = await supabase.from('library_books').select('available, title').eq('isbn', isbn).single();
        if (book && book.available > 0) {
          await supabase.from('library_books').update({ available: book.available - 1 }).eq('isbn', isbn);
          await supabase.from('library_borrowings').insert({
            student_id: studentId,
            student_name: studentName,
            isbn,
            title: book.title,
            due_on: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          });
          return { ok: true };
        }
        return { ok: false, message: 'Out of stock' };
      } catch (err: any) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const book = db.books.find((b: any) => b.isbn === isbn);
    if (book && book.available > 0) {
      book.available -= 1;
      db.borrowed.unshift({
        id: `BOR-${Math.floor(100 + Math.random() * 900)}`,
        studentId,
        studentName,
        isbn,
        title: book.title,
        borrowedOn: new Date().toISOString(),
        dueOn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        returned: false,
        fine: 0
      });
      await writeLocalDb(db);
      return { ok: true };
    }
    return { ok: false, message: 'Out of stock' };
  },

  async returnBook(studentId: string, borrowId: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('library_borrowings');

    if (isSupabaseAvailable) {
      try {
        const { data: borrow } = await supabase.from('library_borrowings').select('isbn, due_on, returned').eq('id', borrowId).single();
        if (borrow && !borrow.returned) {
          // Increment book available copy
          const { data: book } = await supabase.from('library_books').select('available').eq('isbn', borrow.isbn).single();
          if (book) {
            await supabase.from('library_books').update({ available: book.available + 1 }).eq('isbn', borrow.isbn);
          }

          // Calculate dynamic late penalty fine (Rs. 10 per day)
          const diffTime = Date.now() - new Date(borrow.due_on).getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const fine = diffDays > 0 ? diffDays * 10 : 0;

          await supabase.from('library_borrowings').update({
            returned: true,
            returned_on: new Date().toISOString(),
            fine
          }).eq('id', borrowId);

          return { ok: true, fine };
        }
        return { ok: false };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const borrowIndex = db.borrowed.findIndex((b: any) => b.id === borrowId);
    if (borrowIndex >= 0) {
      const borrow = db.borrowed[borrowIndex];
      borrow.returned = true;
      borrow.returnedOn = new Date().toISOString();

      const book = db.books.find((b: any) => b.isbn === borrow.isbn);
      if (book) {
        book.available += 1;
      }

      // Calculate dynamic late penalty fine (Rs. 10 per day)
      const diffTime = Date.now() - new Date(borrow.dueOn).getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const fine = diffDays > 0 ? diffDays * 10 : 0;
      borrow.fine = fine;

      await writeLocalDb(db);
      return { ok: true, fine };
    }
    return { ok: false, fine: 0 };
  },

  async reserve(studentId: string, studentName: string, isbn: string) {
    const isSupabaseAvailable = await checkSupabaseAvailable('library_reservations');

    if (isSupabaseAvailable) {
      try {
        const { data: book } = await supabase.from('library_books').select('title').eq('isbn', isbn).single();
        if (book) {
          const { count } = await supabase.from('library_reservations').select('*', { count: 'exact', head: true }).eq('isbn', isbn);
          const queuePosition = (count || 0) + 1;

          const { data: reservation } = await supabase.from('library_reservations').insert({
            student_id: studentId,
            student_name: studentName,
            isbn,
            title: book.title,
            position: queuePosition
          }).select('*').single();

          return { ok: true, reserve: { position: queuePosition } };
        }
        return { ok: false };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }

    // Local Database Fallback
    const db = await readLocalDb();
    const book = db.books.find((b: any) => b.isbn === isbn);
    if (book) {
      const queuePosition = db.reserves.filter((r: any) => r.isbn === isbn).length + 1;
      const reserve = {
        id: `RES-${Math.floor(100 + Math.random() * 900)}`,
        studentId,
        studentName,
        isbn,
        title: book.title,
        position: queuePosition,
        createdAt: new Date().toISOString()
      };
      db.reserves.push(reserve);
      await writeLocalDb(db);
      return { ok: true, reserve };
    }
    return { ok: false };
  },

  async addBook(isbn: string, title: string, author: string, genre: string, copies: number) {
    const isSupabaseAvailable = await checkSupabaseAvailable('library_books');
    const book = {
      isbn: isbn || `ISBN-${Date.now()}`,
      title: title || 'Untitled',
      author: author || 'Unknown',
      genre: genre || 'General',
      copies: copies || 1,
      available: copies || 1,
      isEbook: false,
    };
    if (isSupabaseAvailable) {
      try {
        await supabase.from('library_books').insert({
          isbn: book.isbn,
          title: book.title,
          author: book.author,
          genre: book.genre,
          copies: book.copies,
          available: book.available,
          is_ebook: false,
        });
        return { ok: true, book };
      } catch (err) {
        console.warn('Supabase write failed, falling back to local database:', err);
      }
    }
    const db = await readLocalDb();
    db.books = db.books || [];
    db.books.push(book);
    await writeLocalDb(db);
    return { ok: true, book };
  },
};
