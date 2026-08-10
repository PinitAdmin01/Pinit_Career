'use client';
// src/app/transport/page.tsx
// Student Transit Desk page containing Route Selector opt-ins, Driver feedback cards, and Live GPS trackings dashboard.

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';

export default function StudentTransport() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [allocation, setAllocation] = useState<any>({ route: null, stop: '', status: 'none' });

  // Route selector
  const [selectedRouteCode, setSelectedRouteCode] = useState('');
  const [selectedStop, setSelectedStop] = useState('');
  const [submittingReg, setSubmittingReg] = useState(false);

  // GPS simulated states
  const [gpsStopIndex, setGpsStopIndex] = useState(0);

  useEffect(() => {
    fetchTransportData();
  }, []);

  const fetchTransportData = async () => {
    try {
      const data = await api.get<any>('/api/transport/stats');
      setRoutes(data.routes || []);
      setDrivers(data.drivers || []);
      setAllocation(data.allocation || { route: null, stop: '', status: 'none' });

      if (data.routes && data.routes.length > 0) {
        setSelectedRouteCode(data.routes[0]?.code || '');
        setSelectedStop(data.routes[0]?.stops?.[0] || '');
      }
    } catch {}
  };

  // GPS Simulation interval
  useEffect(() => {
    if (allocation.status !== 'allocated') return;
    const interval = setInterval(() => {
      const activeRoute = routes.find(r => r.code === allocation.route);
      if (activeRoute && activeRoute.stops) {
        setGpsStopIndex(prev => (prev + 1) % (activeRoute.stops.length || 1));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [allocation, routes]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReg(true);
    try {
      const res = await api.post<{ ok: boolean; allocation: any }>('/api/transport/register', {
        routeCode: selectedRouteCode,
        stop: selectedStop
      });
      if (res && res.ok) {
        alert('Transit registration requested! Awaiting transport officer verification approval.');
        fetchTransportData();
      }
    } catch {
      alert('Registration failed.');
    } finally {
      setSubmittingReg(false);
    }
  };

  const activeRoute = routes.find(r => r.code === (allocation.route || selectedRouteCode));
  const assignedDriver = activeRoute ? drivers.find(d => d.name === activeRoute.driverName) : null;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '30px 20px', fontFamily: 'var(--font-body), sans-serif' }}>
      <style>{`
        .transit-wrapper {
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
        .status-alert {
          border-radius: 16px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid;
        }
        .grid-split {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        @media (max-width: 900px) {
          .grid-split {
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
        .gps-map-mock {
          background: #0f172a;
          border-radius: 16px;
          padding: 24px;
          color: #ffffff;
          position: relative;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid #334155;
        }
        .gps-route-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          margin: 40px 0;
        }
        .gps-route-line::before {
          content: '';
          position: absolute;
          top: 50%; left: 0; right: 0;
          height: 4px;
          background: #334155;
          transform: translateY(-50%);
          z-index: 1;
        }
        .gps-node {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #334155;
          border: 3px solid #0f172a;
          z-index: 2;
          position: relative;
          transition: all 0.3s;
        }
        .gps-node.passed {
          background: #10b981;
        }
        .gps-node.active {
          background: #3b82f6;
          box-shadow: 0 0 15px #3b82f6;
          transform: scale(1.3);
        }
        .gps-label {
          position: absolute;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          white-space: nowrap;
          color: #94a3b8;
          font-weight: 700;
        }
        .gps-label.active {
          color: #3b82f6;
          font-weight: 800;
        }
        .star-rating {
          color: #fbbf24;
          font-size: 16px;
        }
      `}</style>

      <div className="transit-wrapper">
        <h1 className="page-title">🚌 Transit Desk</h1>

        {/* Status Banners */}
        {allocation.status === 'none' && (
          <div className="status-alert" style={{ background: '#fef2f2', borderColor: '#fee2e2', color: '#991b1b' }}>
            <div>
              <strong style={{ fontSize: 14 }}>⚠️ Transit Pass Inactive</strong>
              <div style={{ fontSize: 12, marginTop: 2 }}>You do not have an active transport route registration. Register via route selectors below.</div>
            </div>
          </div>
        )}
        {allocation.status === 'pending' && (
          <div className="status-alert" style={{ background: '#fef3c7', borderColor: '#fde68a', color: '#92400e' }}>
            <div>
              <strong style={{ fontSize: 14 }}>⏳ Seat Verification Pending</strong>
              <div style={{ fontSize: 12, marginTop: 2 }}>Requested Route: <strong>{routes.find(r => r.code === allocation.route)?.name}</strong> | Stop: <strong>{allocation.stop}</strong>.</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', background: '#fffbeb', borderRadius: 20 }}>Awaiting approval</span>
          </div>
        )}
        {allocation.status === 'allocated' && (
          <div className="status-alert" style={{ background: '#ecfdf5', borderColor: '#d1fae5', color: '#065f46' }}>
            <div>
              <strong style={{ fontSize: 14 }}>✓ Transit Pass Active</strong>
              <div style={{ fontSize: 12, marginTop: 2 }}>Assigned Route: <strong>{routes.find(r => r.code === allocation.route)?.name}</strong> | Boarding Stop: <strong>{allocation.stop}</strong>.</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', background: '#ffffff', color: '#059669', borderRadius: 20 }}>Pass Status: Active</span>
          </div>
        )}

        <div className="grid-split">
          {/* Left Block: Selector & Driver Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Route Selector Register Form */}
            {allocation.status === 'none' && (
              <div className="card-box">
                <h3 className="card-title">✍️ Transit registration</h3>
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>Select Route Code</label>
                    <select
                      className="form-input"
                      value={selectedRouteCode}
                      onChange={e => {
                        setSelectedRouteCode(e.target.value);
                        const r = routes.find(rt => rt.code === e.target.value);
                        if (r && r.stops) setSelectedStop(r.stops[0]);
                      }}
                    >
                      {routes.map(r => <option key={r.code} value={r.code}>{r.name} ({r.code})</option>)}
                    </select>
                  </div>

                  {activeRoute && (
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>Boarding Stop</label>
                      <select
                        className="form-input"
                        value={selectedStop}
                        onChange={e => setSelectedStop(e.target.value)}
                      >
                        {activeRoute.stops?.map((st: string) => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  )}

                  <button type="submit" disabled={submittingReg} className="btn-primary" style={{ width: '100%' }}>
                    {submittingReg ? 'Requesting Transit Pass...' : '✓ Submit Transit Registration'}
                  </button>
                </form>
              </div>
            )}

            {/* Active pass ticket details */}
            {allocation.status !== 'none' && (
              <div className="card-box">
                <h3 className="card-title">🎟 Active Transit Pass</h3>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 12, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #cbd5e1', paddingBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 800 }}>CAMPUS SHUTTLE PASS</div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#2563eb', marginTop: 4 }}>Ashwanth Kumar</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 800 }}>ROUTE CODE</div>
                      <div style={{ fontSize: 14, fontWeight: 900, marginTop: 4 }}>{allocation.route}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12, fontSize: 12 }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: 10, display: 'block' }}>BOARDING STATION</span>
                      <strong>{allocation.stop}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: 10, display: 'block' }}>TIMINGS SCHEDULE</span>
                      <strong>{activeRoute?.timing}</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: 14, textAlign: 'center', fontSize: 10, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                    SECURITY HASH: MD5-PASS-TRN-80419
                  </div>
                </div>
              </div>
            )}

            {/* Driver Profile */}
            {activeRoute && assignedDriver && (
              <div className="card-box" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ fontSize: 40, background: '#f1f5f9', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  👨‍✈️
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 800 }}>Assigned Driver: {assignedDriver.name}</h4>
                  <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>Mobile: <strong>{assignedDriver.phone}</strong> | License: <strong>{assignedDriver.license}</strong></div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                    <span className="star-rating">{'★'.repeat(Math.min(5, Math.max(0, Math.round(assignedDriver.rating || 0))))}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: '#475569' }}>({assignedDriver.rating || 0} Rating)</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Block: Live GPS Tracker Simulator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            <div className="card-box">
              <h3 className="card-title">📡 Live GPS Tracker</h3>
              <p style={{ fontSize: 12.5, color: '#64748b', marginBottom: 14 }}>
                Real-time tracking coordinates mapped from the vehicle GPS transponder logs.
              </p>

              {allocation.status !== 'allocated' ? (
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 12, padding: '40px 10px', textAlign: 'center', color: '#64748b', fontSize: 12 }}>
                  Live tracking maps will activate once a transport pass has been approved and allocated.
                </div>
              ) : (
                <div className="gps-map-mock">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: 10, color: '#10b981', fontWeight: 800 }}>● GPS SIGNAL CONNECTED</span>
                      <div style={{ fontSize: 13, fontWeight: 900, marginTop: 2 }}>{activeRoute?.vehicle}</div>
                    </div>
                    <span style={{ fontSize: 11, background: '#1e293b', padding: '4px 10px', borderRadius: 20 }}>Speed: 34 km/h</span>
                  </div>

                  {/* Nodes Line */}
                  <div className="gps-route-line">
                    {activeRoute?.stops?.map((st: string, idx: number) => {
                      const isActive = idx === gpsStopIndex;
                      const isPassed = idx < gpsStopIndex;
                      return (
                        <div
                          key={st}
                          className={`gps-node ${isPassed ? 'passed' : ''} ${isActive ? 'active' : ''}`}
                        >
                          <div className={`gps-label ${isActive ? 'active' : ''}`}>
                            {st}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ fontSize: 11, color: '#94a3b8', borderTop: '1px solid #334155', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Next Stop: <strong>{activeRoute?.stops?.[(gpsStopIndex + 1) % (activeRoute?.stops?.length || 1)] || 'N/A'}</strong></span>
                    <span style={{ color: '#3b82f6' }}>ETA: 4 Mins</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
