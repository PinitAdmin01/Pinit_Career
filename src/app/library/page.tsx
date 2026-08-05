'use client';
// src/app/library/page.tsx
// Student Library Center portal page containing Books Catalog search, borrows, returns, reserves, and digital e-textbook reader lightbox.

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';

export default function StudentLibrary() {
  const [books, setBooks] = useState<any[]>([]);
  const [borrowed, setBorrowed] = useState<any[]>([]);
  const [reserves, setReserves] = useState<any[]>([]);
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [bookType, setBookType] = useState<'all' | 'physical' | 'ebook'>('all');
  
  // Modals / Lightbox
  const [readingEbook, setReadingEbook] = useState<any | null>(null);

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const fetchLibraryData = async () => {
    try {
      const data = await api.get<{ books: any[]; borrowed: any[]; reserves: any[] }>('/api/library/books');
      setBooks(data.books || []);
      setBorrowed(data.borrowed || []);
      setReserves(data.reserves || []);
    } catch {}
  };

  const handleBorrow = async (isbn: string) => {
    try {
      const res = await api.post<{ ok: boolean; message?: string }>('/api/library/borrow', { isbn });
      if (res && res.ok) {
        alert('Book borrowed successfully! Dynamic due date set for 14 days from today.');
        fetchLibraryData();
      } else {
        alert(res.message || 'Borrow failed.');
      }
    } catch {
      alert('Network error borrowing book.');
    }
  };

  const handleReturn = async (borrowId: string) => {
    try {
      const res = await api.post<{ ok: boolean; fine: number }>('/api/library/return', { borrowId });
      if (res && res.ok) {
        if (res.fine > 0) {
          alert(`Book returned successfully! A late penalty fine of ₹${res.fine} has been added to your finance dues ledger.`);
        } else {
          alert('Book returned successfully with zero penalty fines.');
        }
        fetchLibraryData();
      }
    } catch {
      alert('Return failed.');
    }
  };

  const handleReserve = async (isbn: string) => {
    try {
      const res = await api.post<{ ok: boolean; reserve: any }>('/api/library/reserve', { isbn });
      if (res && res.ok) {
        alert(`Reservation placed! You are at position #${res.reserve.position} in the waitlist queue.`);
        fetchLibraryData();
      }
    } catch {
      alert('Reservation failed.');
    }
  };

  // Filter computations
  const filteredBooks = books.filter(b => {
    const matchesSearch = (b.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (b.author || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (b.isbn || '').includes(searchQuery);
    const matchesGenre = !selectedGenre || b.genre === selectedGenre;
    const matchesType = bookType === 'all' ? true :
                        bookType === 'ebook' ? b.isEbook : !b.isEbook;
    return matchesSearch && matchesGenre && matchesType;
  });

  const genres = Array.from(new Set(books.map(b => b.genre)));

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '30px 20px', fontFamily: 'var(--font-body), sans-serif' }}>
      <style>{`
        .lib-wrapper {
          max-width: 1040px;
          margin: 0 auto;
        }
        .page-title {
          font-family: var(--font-display), sans-serif;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.6px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .search-bar-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .search-bar-row {
            grid-template-columns: 1fr;
          }
        }
        .card-box {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
        }
        .card-title {
          font-family: var(--font-display), sans-serif;
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .grid-books {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .book-card {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 16px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          transition: all 0.2s;
        }
        .book-card:hover {
          border-color: #2563eb;
          box-shadow: 0 10px 30px rgba(37, 99, 235, 0.04);
        }
        .book-title {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.3;
        }
        .book-author {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }
        .book-meta {
          font-size: 11px;
          color: #94a3b8;
          font-family: var(--font-mono);
          margin-top: 8px;
        }
        .book-genre-tag {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          background: #f1f5f9;
          color: #475569;
          padding: 3px 8px;
          border-radius: 6px;
          width: fit-content;
          margin-top: 8px;
        }
        .book-footer {
          border-top: 1px solid #e2e8f0;
          margin-top: 16px;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .availability-lbl {
          font-size: 11px;
          font-weight: 700;
        }
        .layout-split {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 24px;
          margin-top: 24px;
        }
        @media (max-width: 900px) {
          .layout-split {
            grid-template-columns: 1fr;
          }
        }
        .tbl-borrows {
          width: 100%;
          border-collapse: collapse;
        }
        .tbl-borrows th {
          text-align: left;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          padding-bottom: 12px;
          border-bottom: 1px solid #cbd5e1;
        }
        .tbl-borrows td {
          padding: 12px 0;
          font-size: 13px;
          border-bottom: 1px solid #f1f5f9;
        }
        .overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .reader-modal {
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 640px;
          padding: 30px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
        }
        .reader-content-box {
          background: #fafafa;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 24px;
          font-size: 14.5px;
          line-height: 1.6;
          color: #334155;
          max-height: 380px;
          overflow-y: auto;
          margin-top: 16px;
          white-space: pre-wrap;
        }
      `}</style>

      <div className="lib-wrapper">
        <h1 className="page-title">📚 Library Center</h1>

        {/* Search Row */}
        <div className="search-bar-row">
          <input
            type="text"
            className="form-input"
            placeholder="Search books by title, author, or ISBN..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)} className="form-input">
            <option value="">All Genres / Subjects</option>
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={bookType} onChange={e => setBookType(e.target.value as any)} className="form-input">
            <option value="all">Format: All</option>
            <option value="physical">Format: Physical Copies</option>
            <option value="ebook">Format: E-Books</option>
          </select>
        </div>

        {/* Section 1: Book Inventory Catalog */}
        <div className="card-box">
          <h3 className="card-title">📖 Textbook Catalog ({filteredBooks.length} entries)</h3>
          
          {filteredBooks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              No books matching your query criteria.
            </div>
          ) : (
            <div className="grid-books">
              {filteredBooks.map(b => {
                const alreadyBorrowed = borrowed.find(br => br.isbn === b.isbn && !br.returned);
                return (
                  <div key={b.isbn} className="book-card">
                    <div>
                      <div className="book-title">{b.title}</div>
                      <div className="book-author">by {b.author}</div>
                      <div className="book-meta">ISBN: {b.isbn}</div>
                      <div className="book-genre-tag">{b.genre}</div>
                    </div>

                    <div className="book-footer">
                      <div>
                        <div className="availability-lbl" style={{ color: b.available > 0 ? '#059669' : '#dc2626' }}>
                          {b.available > 0 ? `${b.available} of ${b.copies} available` : 'Out of stock'}
                        </div>
                        {b.isEbook && <div style={{ fontSize: 10, color: '#2563eb', marginTop: 2, fontWeight: 700 }}>⚡ Digital E-Book Available</div>}
                      </div>

                      <div style={{ display: 'flex', gap: 6 }}>
                        {b.isEbook && (
                          <button
                            onClick={() => setReadingEbook(b)}
                            className="btn-ghost btn-sm"
                            style={{ border: '1.5px solid #2563eb', color: '#2563eb', padding: '6px 10px', fontSize: 11 }}
                          >
                            📖 Read
                          </button>
                        )}
                        {b.available > 0 ? (
                          <button
                            onClick={() => handleBorrow(b.isbn)}
                            disabled={!!alreadyBorrowed}
                            className="btn-primary"
                            style={{ fontSize: 11, padding: '6px 12px', background: alreadyBorrowed ? '#cbd5e1' : '#2563eb', borderColor: alreadyBorrowed ? '#cbd5e1' : '#2563eb' }}
                          >
                            {alreadyBorrowed ? 'Borrowed' : 'Borrow'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReserve(b.isbn)}
                            className="btn-ghost btn-sm"
                            style={{ border: '1.5px solid #dc2626', color: '#dc2626', fontSize: 11 }}
                          >
                            Reserve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Layout Split: Borrowed Registry & Reservations */}
        <div className="layout-split">
          {/* Active Borrowings */}
          <div className="card-block" style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(15,23,42,0.06)' }}>
            <h3 className="card-title">📋 Active borrowed Registers</h3>
            
            {borrowed.length === 0 ? (
              <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
                No active borrowings recorded in register.
              </div>
            ) : (
              <table className="tbl-borrows">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Book Title</th>
                    <th>Borrowed Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowed.map(br => {
                    const isOverdue = new Date().getTime() > new Date(br.dueOn).getTime() && !br.returned;
                    return (
                      <tr key={br.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>{br.id}</td>
                        <td style={{ fontWeight: 600 }}>{br.title}</td>
                        <td style={{ color: '#64748b' }}>{new Date(br.borrowedOn).toLocaleDateString()}</td>
                        <td style={{ color: isOverdue ? '#dc2626' : '#64748b', fontWeight: isOverdue ? 700 : 400 }}>{new Date(br.dueOn).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge-status ${br.returned ? 'badge-paid' : isOverdue ? 'badge-unpaid' : 'badge-gray'}`} style={{
                            background: br.returned ? '#ecfdf5' : isOverdue ? '#fef2f2' : '#f1f5f9',
                            color: br.returned ? '#059669' : isOverdue ? '#ef4444' : '#475569'
                          }}>
                            {br.returned ? 'Returned' : isOverdue ? 'Overdue' : 'Active'}
                          </span>
                        </td>
                        <td>
                          {!br.returned && (
                            <button
                              onClick={() => handleReturn(br.id)}
                              className="btn-ghost btn-sm"
                              style={{ border: '1px solid #cbd5e1', fontSize: 11, padding: '4px 8px' }}
                            >
                              Return
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Active Reservations */}
          <div className="card-block" style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(15,23,42,0.06)' }}>
            <h3 className="card-title">⏳ Waitlist Reserves</h3>
            
            {reserves.length === 0 ? (
              <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
                No active reservations placed.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {reserves.map(r => (
                  <div key={r.id} style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Queue pos: <strong>#{r.position}</strong></div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '3px 8px', borderRadius: 20 }}>Reserved</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: E-BOOK TEXT READER */}
      {readingEbook && (
        <div className="overlay">
          <div className="reader-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 900, color: '#2563eb' }}>⚡ BGS Digital Library E-Reader</h4>
                <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 800, marginTop: 2 }}>{readingEbook.title}</div>
              </div>
              <button onClick={() => setReadingEbook(null)} style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <div className="reader-content-box">
              {readingEbook.ebookContent}
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setReadingEbook(null)} className="btn-primary" style={{ background: '#2563eb' }}>
                Close Reader Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
