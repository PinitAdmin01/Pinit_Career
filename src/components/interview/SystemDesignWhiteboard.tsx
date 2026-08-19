'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

export interface BoardNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  category: 'client' | 'gateway' | 'compute' | 'storage' | 'queue' | 'business';
  color?: string;
}

export interface BoardLink {
  id: string;
  from: string;
  to: string;
  protocol?: string;
}

export interface SystemTopologySnapshot {
  nodeCount: number;
  linkCount: number;
  nodes: { id: string; type: string; label: string; category: string }[];
  links: { fromType: string; toType: string; protocol: string }[];
  hasLoadBalancer: boolean;
  hasCachingLayer: boolean;
  hasDatabase: boolean;
  hasQueue: boolean;
  isFullyConnected: boolean;
}

interface Props {
  domainStream?: 'tech' | 'non_tech';
  activeTopic?: string;
  onTopologyChange?: (snapshot: SystemTopologySnapshot) => void;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

const TECH_COMPONENTS = [
  { type: 'Client App', category: 'client' as const, color: '#3b82f6', icon: '📱' },
  { type: 'CDN (Cloudflare)', category: 'gateway' as const, color: '#f59e0b', icon: '⚡' },
  { type: 'Load Balancer', category: 'gateway' as const, color: '#8b5cf6', icon: '⚖️' },
  { type: 'API Gateway', category: 'gateway' as const, color: '#6366f1', icon: '🛡️' },
  { type: 'Microservice', category: 'compute' as const, color: '#10b981', icon: '⚙️' },
  { type: 'Worker / Cron', category: 'compute' as const, color: '#14b8a6', icon: '⏱️' },
  { type: 'Redis Cache', category: 'storage' as const, color: '#ef4444', icon: '🚀' },
  { type: 'Postgres DB', category: 'storage' as const, color: '#0ea5e9', icon: '🗄️' },
  { type: 'Kafka / Queue', category: 'queue' as const, color: '#ec4899', icon: '📨' },
  { type: 'Blob Storage (S3)', category: 'storage' as const, color: '#f97316', icon: '📦' },
];

const NON_TECH_COMPONENTS = [
  { type: 'Target Audience', category: 'business' as const, color: '#3b82f6', icon: '👥' },
  { type: 'Ad Campaign', category: 'business' as const, color: '#f59e0b', icon: '📣' },
  { type: 'Landing Page', category: 'business' as const, color: '#8b5cf6', icon: '🎯' },
  { type: 'Checkout Engine', category: 'business' as const, color: '#10b981', icon: '💳' },
  { type: 'CRM / Support', category: 'business' as const, color: '#6366f1', icon: '🎧' },
  { type: 'Logistics Hub', category: 'business' as const, color: '#f97316', icon: '🚚' },
  { type: 'Retention Loop', category: 'business' as const, color: '#ec4899', icon: '🔄' },
  { type: 'Supplier Network', category: 'business' as const, color: '#14b8a6', icon: '🏭' },
];

export default function SystemDesignWhiteboard({
  domainStream = 'tech',
  activeTopic = 'Distributed Architecture',
  onTopologyChange,
  onAnalyze,
  isAnalyzing = false
}: Props) {
  const [nodes, setNodes] = useState<BoardNode[]>([
    { id: 'node_1', type: 'Client App', label: 'Web/Mobile Client', x: 40, y: 160, category: 'client', color: '#3b82f6' },
    { id: 'node_2', type: 'Load Balancer', label: 'ALB / Nginx', x: 230, y: 160, category: 'gateway', color: '#8b5cf6' },
    { id: 'node_3', type: 'Microservice', label: 'Core App Server', x: 430, y: 160, category: 'compute', color: '#10b981' },
    { id: 'node_4', type: 'Postgres DB', label: 'Primary Relational DB', x: 640, y: 240, category: 'storage', color: '#0ea5e9' },
    { id: 'node_5', type: 'Redis Cache', label: 'Session / Cache Layer', x: 640, y: 80, category: 'storage', color: '#ef4444' }
  ]);

  const [links, setLinks] = useState<BoardLink[]>([
    { id: 'link_1', from: 'node_1', to: 'node_2', protocol: 'HTTPS/REST' },
    { id: 'link_2', from: 'node_2', to: 'node_3', protocol: 'gRPC' },
    { id: 'link_3', from: 'node_3', to: 'node_5', protocol: 'Cache Read' },
    { id: 'link_4', from: 'node_3', to: 'node_4', protocol: 'SQL Read/Write' }
  ]);

  const [isConnectMode, setIsConnectMode] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [activeProtocol, setActiveProtocol] = useState<string>('HTTPS/REST');

  const canvasRef = useRef<HTMLDivElement>(null);

  const palette = domainStream === 'non_tech' ? NON_TECH_COMPONENTS : TECH_COMPONENTS;

  // ─── Generate & Propagate Topology Snapshot ──────────────────────────────
  const emitTopology = useCallback((currentNodes: BoardNode[], currentLinks: BoardLink[]) => {
    const nodeTypeMap = new Map(currentNodes.map(n => [n.id, n.type]));
    
    const serializedLinks = currentLinks.map(l => ({
      fromType: nodeTypeMap.get(l.from) || 'Unknown',
      toType: nodeTypeMap.get(l.to) || 'Unknown',
      protocol: l.protocol || 'Direct'
    }));

    const snapshot: SystemTopologySnapshot = {
      nodeCount: currentNodes.length,
      linkCount: currentLinks.length,
      nodes: currentNodes.map(n => ({ id: n.id, type: n.type, label: n.label, category: n.category })),
      links: serializedLinks,
      hasLoadBalancer: currentNodes.some(n => n.type.toLowerCase().includes('load balancer') || n.type.toLowerCase().includes('alb')),
      hasCachingLayer: currentNodes.some(n => n.type.toLowerCase().includes('redis') || n.type.toLowerCase().includes('cache')),
      hasDatabase: currentNodes.some(n => n.type.toLowerCase().includes('db') || n.type.toLowerCase().includes('postgres') || n.type.toLowerCase().includes('mongo')),
      hasQueue: currentNodes.some(n => n.type.toLowerCase().includes('kafka') || n.type.toLowerCase().includes('queue')),
      isFullyConnected: currentNodes.length > 0 && currentLinks.length >= currentNodes.length - 1
    };

    if (onTopologyChange) {
      onTopologyChange(snapshot);
    }
  }, [onTopologyChange]);

  useEffect(() => {
    emitTopology(nodes, links);
  }, [nodes, links, emitTopology]);

  // ─── Node Handlers ───────────────────────────────────────────────────────
  const addNode = (template: typeof palette[0]) => {
    const nextId = 'node_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5);
    const randomOffset = (nodes.length % 5) * 20;
    const newNode: BoardNode = {
      id: nextId,
      type: template.type,
      label: template.type,
      x: 100 + randomOffset,
      y: 100 + randomOffset,
      category: template.category,
      color: template.color
    };
    setNodes(prev => [...prev, newNode]);
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setLinks(prev => prev.filter(l => l.from !== id && l.to !== id));
    if (selectedSourceId === id) setSelectedSourceId(null);
  };

  const updateNodeLabel = (id: string, newLabel: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, label: newLabel } : n));
  };

  // ─── Drag & Drop ─────────────────────────────────────────────────────────
  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    if (isConnectMode) {
      handleNodeClick(id);
      return;
    }
    const node = nodes.find(n => n.id === id);
    if (!node || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    setDraggingNodeId(id);
    setDragOffset({
      x: (e.clientX - canvasRect.left) - node.x,
      y: (e.clientY - canvasRect.top) - node.y
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const rawX = e.clientX - canvasRect.left - dragOffset.x;
    const rawY = e.clientY - canvasRect.top - dragOffset.y;

    const clampedX = Math.max(10, Math.min(canvasRect.width - 150, rawX));
    const clampedY = Math.max(10, Math.min(canvasRect.height - 80, rawY));

    setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: clampedX, y: clampedY } : n));
  };

  const handleCanvasMouseUp = () => {
    setDraggingNodeId(null);
  };

  // ─── Connection Management ───────────────────────────────────────────────
  const handleNodeClick = (id: string) => {
    if (!isConnectMode) return;

    if (!selectedSourceId) {
      setSelectedSourceId(id);
    } else {
      if (selectedSourceId !== id) {
        const exists = links.some(l => l.from === selectedSourceId && l.to === id);
        if (!exists) {
          const newLink: BoardLink = {
            id: 'link_' + Date.now(),
            from: selectedSourceId,
            to: id,
            protocol: activeProtocol
          };
          setLinks(prev => [...prev, newLink]);
        }
      }
      setSelectedSourceId(null);
    }
  };

  // ─── Presets ─────────────────────────────────────────────────────────────
  const loadPreset = (presetName: '3tier' | 'microservices') => {
    if (presetName === '3tier') {
      const n: BoardNode[] = [
        { id: 'p_1', type: 'Client App', label: 'Browser / iOS / Android', x: 30, y: 160, category: 'client', color: '#3b82f6' },
        { id: 'p_2', type: 'CDN (Cloudflare)', label: 'Edge Static Cache', x: 200, y: 80, category: 'gateway', color: '#f59e0b' },
        { id: 'p_3', type: 'Load Balancer', label: 'AWS ALB (SSL Term)', x: 200, y: 240, category: 'gateway', color: '#8b5cf6' },
        { id: 'p_4', type: 'Microservice', label: 'Node.js App Cluster', x: 410, y: 240, category: 'compute', color: '#10b981' },
        { id: 'p_5', type: 'Redis Cache', label: 'ElastiCache (LRU)', x: 620, y: 140, category: 'storage', color: '#ef4444' },
        { id: 'p_6', type: 'Postgres DB', label: 'Aurora Primary (Multi-AZ)', x: 620, y: 290, category: 'storage', color: '#0ea5e9' },
      ];
      const l: BoardLink[] = [
        { id: 'pl_1', from: 'p_1', to: 'p_2', protocol: 'HTTPS/CDN' },
        { id: 'pl_2', from: 'p_1', to: 'p_3', protocol: 'HTTPS/API' },
        { id: 'pl_3', from: 'p_3', to: 'p_4', protocol: 'HTTP/2' },
        { id: 'pl_4', from: 'p_4', to: 'p_5', protocol: 'TCP/Cache' },
        { id: 'pl_5', from: 'p_4', to: 'p_6', protocol: 'PostgreSQL' },
      ];
      setNodes(n);
      setLinks(l);
    } else if (presetName === 'microservices') {
      const n: BoardNode[] = [
        { id: 'm_1', type: 'Client App', label: 'Client Gateway', x: 30, y: 180, category: 'client', color: '#3b82f6' },
        { id: 'm_2', type: 'API Gateway', label: 'Kong API Gateway', x: 200, y: 180, category: 'gateway', color: '#6366f1' },
        { id: 'm_3', type: 'Microservice', label: 'User Service', x: 390, y: 80, category: 'compute', color: '#10b981' },
        { id: 'm_4', type: 'Microservice', label: 'Order Service', x: 390, y: 280, category: 'compute', color: '#10b981' },
        { id: 'm_5', type: 'Kafka / Queue', label: 'Kafka Event Bus', x: 590, y: 180, category: 'queue', color: '#ec4899' },
        { id: 'm_6', type: 'Worker / Cron', label: 'Payment & Fulfillment', x: 770, y: 180, category: 'compute', color: '#14b8a6' },
      ];
      const l: BoardLink[] = [
        { id: 'ml_1', from: 'm_1', to: 'm_2', protocol: 'HTTPS' },
        { id: 'ml_2', from: 'm_2', to: 'm_3', protocol: 'gRPC' },
        { id: 'ml_3', from: 'm_2', to: 'm_4', protocol: 'gRPC' },
        { id: 'ml_4', from: 'm_4', to: 'm_5', protocol: 'Event Publish' },
        { id: 'ml_5', from: 'm_5', to: 'm_6', protocol: 'Event Consume' },
      ];
      setNodes(n);
      setLinks(l);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg2)', padding: 16, borderRadius: 16, border: '1px solid var(--border)' }}>
      {/* Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Interactive System Whiteboard
          </span>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>
            Architecture Topology: {activeTopic}
          </h3>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={activeProtocol}
            onChange={(e) => setActiveProtocol(e.target.value)}
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t1)', padding: '5px 8px', borderRadius: 8, fontSize: 11, fontWeight: 800 }}
          >
            <option value='HTTPS/REST'>Protocol: HTTPS/REST</option>
            <option value='gRPC'>Protocol: gRPC</option>
            <option value='SQL Query'>Protocol: SQL Query</option>
            <option value='Redis Cache'>Protocol: Cache Get/Set</option>
            <option value='Kafka Event'>Protocol: Event Pub/Sub</option>
            <option value='Websocket'>Protocol: WebSocket Stream</option>
          </select>

          <button
            onClick={() => {
              setIsConnectMode(c => !c);
              setSelectedSourceId(null);
            }}
            style={{
              background: isConnectMode ? 'var(--accent)' : 'var(--bg3)',
              border: isConnectMode ? '2px solid var(--accent)' : '1px solid var(--border)',
              color: isConnectMode ? '#fff' : 'var(--t1)',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span>{isConnectMode ? '🔗 Connection Mode ON' : '🔗 Connect Nodes'}</span>
          </button>

          <button onClick={() => loadPreset('3tier')} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t2)', borderRadius: 8, padding: '6px 10px', fontSize: 10.5, fontWeight: 800, cursor: 'pointer' }}>
            ⚡ 3-Tier Web App
          </button>

          <button onClick={() => loadPreset('microservices')} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t2)', borderRadius: 8, padding: '6px 10px', fontSize: 10.5, fontWeight: 800, cursor: 'pointer' }}>
            ⚙️ Microservices Bus
          </button>

          {onAnalyze && (
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                border: 'none',
                color: '#fff',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 900,
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {isAnalyzing ? '🤖 Evaluating...' : '🤖 Evaluate Architecture'}
            </button>
          )}
        </div>
      </div>

      {/* Palette Toolbar */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg3)', padding: 8, borderRadius: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', marginRight: 4 }}>+ ADD:</span>
        {palette.map(item => (
          <button
            key={item.type}
            onClick={() => addNode(item)}
            style={{
              background: 'var(--bg2)',
              border: '1px solid ' + item.color + '44',
              color: 'var(--t1)',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span>{item.icon}</span>
            <span>{item.type}</span>
          </button>
        ))}
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        style={{
          position: 'relative',
          height: 440,
          background: 'radial-gradient(var(--border) 1px, var(--bg) 1px)',
          backgroundSize: '16px 16px',
          borderRadius: 14,
          border: '1px solid var(--border)',
          overflow: 'hidden',
          cursor: draggingNodeId ? 'grabbing' : isConnectMode ? 'crosshair' : 'default'
        }}
      >
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            <marker id='board-arrow' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'>
              <path d='M 0 0 L 10 5 L 0 10 z' fill='var(--accent)' />
            </marker>
          </defs>

          {links.map(l => {
            const fromNode = nodes.find(n => n.id === l.from);
            const toNode = nodes.find(n => n.id === l.to);
            if (!fromNode || !toNode) return null;

            const fromCenterX = fromNode.x + 70;
            const fromCenterY = fromNode.y + 25;
            const toCenterX = toNode.x + 70;
            const toCenterY = toNode.y + 25;

            const midX = (fromCenterX + toCenterX) / 2;
            const midY = (fromCenterY + toCenterY) / 2;

            return (
              <g key={l.id}>
                <line
                  x1={fromCenterX}
                  y1={fromCenterY}
                  x2={toCenterX}
                  y2={toCenterY}
                  stroke='var(--accent)'
                  strokeWidth='2.5'
                  markerEnd='url(#board-arrow)'
                  strokeDasharray='5,5'
                  opacity={0.85}
                />
                {l.protocol && (
                  <text
                    x={midX}
                    y={midY - 6}
                    fill='var(--t2)'
                    fontSize='9'
                    fontWeight='800'
                    textAnchor='middle'
                  >
                    {l.protocol}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {nodes.map(n => {
          const isSelected = selectedSourceId === n.id;
          const isEditing = editingNodeId === n.id;

          return (
            <div
              key={n.id}
              onMouseDown={(e) => handleNodeMouseDown(e, n.id)}
              onClick={() => handleNodeClick(n.id)}
              style={{
                position: 'absolute',
                left: n.x,
                top: n.y,
                width: 145,
                padding: '8px 10px',
                background: isSelected ? 'var(--accent-light)' : 'var(--bg2)',
                border: isSelected ? '2px solid var(--accent)' : ('1.5px solid ' + (n.color || 'var(--border)')),
                borderLeft: '4px solid ' + (n.color || 'var(--accent)'),
                borderRadius: 10,
                color: 'var(--t1)',
                fontSize: 11,
                cursor: isConnectMode ? 'pointer' : 'grab',
                boxShadow: 'var(--shadow-sm)',
                userSelect: 'none',
                zIndex: isSelected ? 10 : 2
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 9.5, fontWeight: 900, color: n.color || 'var(--accent)', textTransform: 'uppercase' }}>
                  {n.type}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(n.id);
                  }}
                  style={{
                    background: '#ef4444',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 15,
                    height: 15,
                    fontSize: 8,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>

              {isEditing ? (
                <input
                  type='text'
                  value={n.label}
                  autoFocus
                  onChange={(e) => updateNodeLabel(n.id, e.target.value)}
                  onBlur={() => setEditingNodeId(null)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setEditingNodeId(null); }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    background: 'var(--bg3)',
                    border: '1px solid var(--accent)',
                    color: 'var(--t1)',
                    borderRadius: 4,
                    padding: '2px 4px',
                    fontSize: 10,
                    fontWeight: 700
                  }}
                />
              ) : (
                <div
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingNodeId(n.id);
                  }}
                  style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t1)', cursor: 'text' }}
                  title='Double click to rename'
                >
                  {n.label}
                </div>
              )}

              <div style={{ fontSize: 8.5, color: isSelected ? 'var(--accent)' : 'var(--t3)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span>{isSelected ? '🎯 Source Node' : isConnectMode ? 'Click to Link' : 'Drag to Move'}</span>
                <span style={{ fontSize: 8 }}>2x click</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Metrics */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--t3)', fontWeight: 800, padding: '4px 6px' }}>
        <div>
          <span>Nodes: {nodes.length}</span> • <span>Connections: {links.length}</span> • <span>Mode: {domainStream.toUpperCase()}</span>
        </div>
        <div>
          <span>Tip: Double click any component to edit label • Toggle Connect Mode to link nodes</span>
        </div>
      </div>
    </div>
  );
}
