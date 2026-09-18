export default function Loading() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 40,
    }}>
      <div style={{
        width: 48, height: 48,
        border: '4px solid var(--surface, #2a2a3e)',
        borderTop: '4px solid var(--accent, #7c6af7)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--t2, #888)', fontSize: 14 }}>Loading...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
