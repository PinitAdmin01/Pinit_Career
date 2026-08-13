export default function NotFound() {
  return (
    <div style={{ padding: 48, textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Page not found</h1>
      <p style={{ color: '#64748b' }}>The page you requested does not exist.</p>
      <p style={{ marginTop: 16 }}>
        <a href="/" style={{ color: '#4f46e5' }}>Back to PinIT</a>
      </p>
    </div>
  );
}
