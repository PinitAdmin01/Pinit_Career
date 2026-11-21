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
  hasVectorStore: boolean;
  hasMatchingEngine: boolean;
  hasSecurityShield: boolean;
  hasMediaServer: boolean;
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
  { type: 'Client App', category: 'client' as const, color: 'var(--info)', icon: '📱' },
  { type: 'CDN (Cloudflare)', category: 'gateway' as const, color: 'var(--warning)', icon: '⚡' },
  { type: 'Load Balancer', category: 'gateway' as const, color: 'var(--reward)', icon: '⚖️' },
  { type: 'API Gateway', category: 'gateway' as const, color: 'var(--brand)', icon: '🛡️' },
  { type: 'Microservice', category: 'compute' as const, color: 'var(--success)', icon: '⚙️' },
  { type: 'Worker / Cron', category: 'compute' as const, color: 'var(--accent-teal)', icon: '⏱️' },
  { type: 'Redis Cache', category: 'storage' as const, color: 'var(--danger)', icon: '🚀' },
  { type: 'Postgres DB', category: 'storage' as const, color: '#0ea5e9', icon: '🗄️' },
  { type: 'Kafka / Queue', category: 'queue' as const, color: '#ec4899', icon: '📨' },
  { type: 'Blob Storage (S3)', category: 'storage' as const, color: '#f97316', icon: '📦' },
  { type: 'Vector DB (pgvector / Pinecone)', category: 'storage' as const, color: '#8b5cf6', icon: '🔍' },
  { type: 'Matching Engine (LMAX / Disruptor)', category: 'compute' as const, color: '#f59e0b', icon: '⚡' },
  { type: 'IoT / MQTT Edge Gateway', category: 'gateway' as const, color: '#06b6d4', icon: '📡' },
  { type: 'WAF / API Shield', category: 'gateway' as const, color: '#e11d48', icon: '🛡️' },
  { type: 'Auth & KMS Vault (OIDC / Vault)', category: 'storage' as const, color: '#7c3aed', icon: '🔑' },
  { type: 'Media Server (WebRTC / SFU)', category: 'compute' as const, color: '#0284c7', icon: '🎥' },
];

const NON_TECH_COMPONENTS = [
  // Finance, Accounting, Tax & Banking Controls (B.Com India & Global)
  { type: 'Invoice / Voucher Intake', category: 'business' as const, color: '#0ea5e9', icon: '🧾' },
  { type: '3-Way Match & Audit', category: 'business' as const, color: '#8b5cf6', icon: '🔍' },
  { type: 'GST / Tax Engine', category: 'business' as const, color: '#f59e0b', icon: '🏛️' },
  { type: 'General Ledger (Dr=Cr)', category: 'business' as const, color: '#10b981', icon: '📒' },
  { type: 'Treasury & Bank Recon', category: 'business' as const, color: '#06b6d4', icon: '🏦' },
  { type: 'Financial Reporting (Ind AS/IFRS)', category: 'business' as const, color: '#ec4899', icon: '📊' },
  // Commercial, Marketing & Operations
  { type: 'Target Audience', category: 'business' as const, color: 'var(--info)', icon: '👥' },
  { type: 'Ad Campaign', category: 'business' as const, color: 'var(--warning)', icon: '📣' },
  { type: 'Landing Page', category: 'business' as const, color: 'var(--reward)', icon: '🎯' },
  { type: 'Checkout Engine', category: 'business' as const, color: 'var(--success)', icon: '💳' },
  { type: 'CRM / Support', category: 'business' as const, color: 'var(--brand)', icon: '🎧' },
  { type: 'Logistics Hub', category: 'business' as const, color: '#f97316', icon: '🚚' },
  { type: 'Retention Loop', category: 'business' as const, color: '#ec4899', icon: '🔄' },
  { type: 'Supplier Network', category: 'business' as const, color: 'var(--accent-teal)', icon: '🏭' },
];

export default function SystemDesignWhiteboard({
  domainStream = 'tech',
  activeTopic = 'Distributed Architecture',
  onTopologyChange,
  onAnalyze,
  isAnalyzing = false
}: Props) {
  const [nodes, setNodes] = useState<BoardNode[]>([]);
  const [links, setLinks] = useState<BoardLink[]>([]);

  const [isConnectMode, setIsConnectMode] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [activeProtocol, setActiveProtocol] = useState<string>(
    domainStream === 'non_tech' ? 'Funnel Flow' : 'HTTPS/REST'
  );
  const [pendingPreset, setPendingPreset] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Keep activeProtocol & category synchronized with domainStream so non-tech never draws "HTTPS/REST"
  useEffect(() => {
    setActiveProtocol(domainStream === 'non_tech' ? 'Funnel Flow' : 'HTTPS/REST');
    setSelectedCategory('all');
  }, [domainStream]);

  useEffect(() => {
    if (!pendingPreset) return;
    const t = setTimeout(() => setPendingPreset(null), 4000);
    return () => clearTimeout(t);
  }, [pendingPreset]);

  const canvasRef = useRef<HTMLDivElement>(null);

  const palette = domainStream === 'non_tech' ? NON_TECH_COMPONENTS : TECH_COMPONENTS;

  const prevTopicRef = useRef(activeTopic);
  const prevStreamRef = useRef(domainStream);
  const onTopologyChangeRef = useRef(onTopologyChange);
  onTopologyChangeRef.current = onTopologyChange;

  // Reset topology ONLY when domain stream or topic actually changes to a different one
  useEffect(() => {
    if (prevTopicRef.current !== activeTopic || prevStreamRef.current !== domainStream) {
      console.log(`[Whiteboard] 🔄 Resetting to blank canvas for new stream: ${domainStream} | Topic: ${activeTopic}`);
      prevTopicRef.current = activeTopic;
      prevStreamRef.current = domainStream;
      setNodes([]);
      setLinks([]);
      setSelectedSourceId(null);
      setSelectedCategory('all');
    }
  }, [domainStream, activeTopic]);

  // ─── Generate & Propagate Topology Snapshot ──────────────────────────────
  const emitTopology = useCallback((currentNodes: BoardNode[], currentLinks: BoardLink[]) => {
    const nodeTypeMap = new Map(currentNodes.map(n => [n.id, n.type]));
    
    const serializedLinks = currentLinks.map(l => ({
      fromType: nodeTypeMap.get(l.from) || 'Unknown',
      toType: nodeTypeMap.get(l.to) || 'Unknown',
      protocol: l.protocol || 'Direct'
    }));

    // Real undirected connectivity check via BFS (prevents spaghetti multi-links between 2 nodes from passing as "fully connected")
    const computeIsFullyConnected = (): boolean => {
      if (currentNodes.length === 0) return false;
      if (currentNodes.length === 1) return true;
      const adj = new Map<string, Set<string>>();
      currentNodes.forEach(n => adj.set(n.id, new Set()));
      currentLinks.forEach(l => {
        if (adj.has(l.from) && adj.has(l.to)) {
          adj.get(l.from)!.add(l.to);
          adj.get(l.to)!.add(l.from);
        }
      });
      const visited = new Set<string>();
      const queue: string[] = [currentNodes[0].id];
      visited.add(currentNodes[0].id);
      while (queue.length > 0) {
        const curr = queue.shift()!;
        for (const nb of adj.get(curr) || []) {
          if (!visited.has(nb)) {
            visited.add(nb);
            queue.push(nb);
          }
        }
      }
      return visited.size === currentNodes.length;
    };

    const snapshot: SystemTopologySnapshot = {
      nodeCount: currentNodes.length,
      linkCount: currentLinks.length,
      nodes: currentNodes.map(n => ({ id: n.id, type: n.type, label: n.label, category: n.category })),
      links: serializedLinks,
      hasLoadBalancer: currentNodes.some(n => n.type.toLowerCase().includes('load balancer') || n.type.toLowerCase().includes('alb')),
      hasCachingLayer: currentNodes.some(n => n.type.toLowerCase().includes('redis') || n.type.toLowerCase().includes('cache')),
      hasDatabase: currentNodes.some(n => n.type.toLowerCase().includes('db') || n.type.toLowerCase().includes('postgres') || n.type.toLowerCase().includes('mongo')),
      hasQueue: currentNodes.some(n => n.type.toLowerCase().includes('kafka') || n.type.toLowerCase().includes('queue')),
      hasVectorStore: currentNodes.some(n => n.type.toLowerCase().includes('vector') || n.label.toLowerCase().includes('vector') || n.label.toLowerCase().includes('pgvector') || n.label.toLowerCase().includes('pinecone')),
      hasMatchingEngine: currentNodes.some(n => n.type.toLowerCase().includes('matching') || n.label.toLowerCase().includes('matching') || n.label.toLowerCase().includes('disruptor') || n.label.toLowerCase().includes('orderbook')),
      hasSecurityShield: currentNodes.some(n => /waf|shield|firewall|vault|security|kms/i.test(n.type + ' ' + n.label)),
      hasMediaServer: currentNodes.some(n => /media|webrtc|sfu|video|relay/i.test(n.type + ' ' + n.label)),
      isFullyConnected: computeIsFullyConnected()
    };

    if (onTopologyChangeRef.current) {
      onTopologyChangeRef.current(snapshot);
    }
  }, []);

  useEffect(() => {
    emitTopology(nodes, links);
  }, [nodes, links, emitTopology]);

  // ─── Node Handlers ───────────────────────────────────────────────────────
  const addNode = (template: typeof palette[0]) => {
    const nextId = 'node_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5);
    setNodes(prev => {
      // Place nodes on a clean 4-column grid so newly added components never overlap
      const idx = prev.length;
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      const x = 36 + col * 185;
      const y = 38 + (row % 3) * 112 + (row >= 3 ? 22 : 0);
      const newNode: BoardNode = {
        id: nextId,
        type: template.type,
        label: template.type,
        x,
        y,
        category: template.category,
        color: template.color
      };
      return [...prev, newNode];
    });
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setLinks(prev => prev.filter(l => l.from !== id && l.to !== id));
    if (selectedSourceId === id) setSelectedSourceId(null);
  };

  const deleteLink = (linkId: string) => {
    setLinks(prev => prev.filter(l => l.id !== linkId));
  };

  const updateNodeLabel = (id: string, newLabel: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, label: newLabel } : n));
  };

  // ─── Drag & Drop ─────────────────────────────────────────────────────────
  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    if (isConnectMode || editingNodeId === id) {
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
            id: 'link_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
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

  // ─── Touch Support ────────────────────────────────────────────────────────
  const handleNodeTouchStart = (e: React.TouchEvent, id: string) => {
    if (isConnectMode || editingNodeId === id) {
      return;
    }
    const node = nodes.find(n => n.id === id);
    if (!node || !canvasRef.current || !e.touches[0]) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    setDraggingNodeId(id);
    setDragOffset({
      x: (e.touches[0].clientX - canvasRect.left) - node.x,
      y: (e.touches[0].clientY - canvasRect.top) - node.y
    });
  };

  const handleCanvasTouchMove = (e: React.TouchEvent) => {
    if (!draggingNodeId || !canvasRef.current || !e.touches[0]) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const rawX = e.touches[0].clientX - canvasRect.left - dragOffset.x;
    const rawY = e.touches[0].clientY - canvasRect.top - dragOffset.y;

    const clampedX = Math.max(10, Math.min(canvasRect.width - 150, rawX));
    const clampedY = Math.max(10, Math.min(canvasRect.height - 80, rawY));

    setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: clampedX, y: clampedY } : n));
  };

  const handleCanvasTouchEnd = () => {
    setDraggingNodeId(null);
  };

  // ─── Presets ─────────────────────────────────────────────────────────────
  type PresetKey =
    | '3tier'
    | 'microservices'
    | 'rag_pipeline'
    | 'quant_exchange'
    | 'zero_trust_security'
    | 'webrtc_conferencing'
    | 'growth_funnel'
    | 'ecommerce_ops'
    | 'erp_ledger';

  const loadPreset = (presetName: PresetKey, force: boolean = false) => {
    // Inline 2-click confirmation preserves browser Fullscreen Gaming Mode (never calls window.confirm)
    if (!force && nodes.length > 2 && pendingPreset !== presetName) {
      setPendingPreset(presetName);
      return;
    }
    setPendingPreset(null);
    setSelectedSourceId(null);
    console.log(`[Whiteboard] Loading architecture preset: ${presetName}`);

    if (presetName === '3tier') {
      const n: BoardNode[] = [
        { id: 'p_1', type: 'Client App', label: 'Browser / iOS / Android', x: 30, y: 160, category: 'client', color: 'var(--info)' },
        { id: 'p_2', type: 'CDN (Cloudflare)', label: 'Edge Static Cache', x: 200, y: 80, category: 'gateway', color: 'var(--warning)' },
        { id: 'p_3', type: 'Load Balancer', label: 'AWS ALB (SSL Term)', x: 200, y: 240, category: 'gateway', color: 'var(--reward)' },
        { id: 'p_4', type: 'Microservice', label: 'Node.js App Cluster', x: 410, y: 240, category: 'compute', color: 'var(--success)' },
        { id: 'p_5', type: 'Redis Cache', label: 'ElastiCache (LRU)', x: 620, y: 140, category: 'storage', color: 'var(--danger)' },
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
        { id: 'm_1', type: 'Client App', label: 'Client Gateway', x: 30, y: 180, category: 'client', color: 'var(--info)' },
        { id: 'm_2', type: 'API Gateway', label: 'Kong API Gateway', x: 200, y: 180, category: 'gateway', color: 'var(--brand)' },
        { id: 'm_3', type: 'Microservice', label: 'User Service', x: 390, y: 80, category: 'compute', color: 'var(--success)' },
        { id: 'm_4', type: 'Microservice', label: 'Order Service', x: 390, y: 280, category: 'compute', color: 'var(--success)' },
        { id: 'm_5', type: 'Kafka / Queue', label: 'Kafka Event Bus', x: 590, y: 180, category: 'queue', color: '#ec4899' },
        { id: 'm_6', type: 'Worker / Cron', label: 'Payment & Fulfillment', x: 770, y: 180, category: 'compute', color: 'var(--accent-teal)' },
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
    } else if (presetName === 'rag_pipeline') {
      const n: BoardNode[] = [
        { id: 'rag_1', type: 'Client App', label: 'User Chat Client', x: 30, y: 180, category: 'client', color: 'var(--info)' },
        { id: 'rag_2', type: 'API Gateway', label: 'LLM Guardrail Ingress', x: 200, y: 180, category: 'gateway', color: 'var(--brand)' },
        { id: 'rag_3', type: 'Worker / Cron', label: 'Embedding & Chunk Worker', x: 390, y: 80, category: 'compute', color: 'var(--accent-teal)' },
        { id: 'rag_4', type: 'Vector DB (pgvector / Pinecone)', label: 'Vector DB (Cosine ANN)', x: 620, y: 80, category: 'storage', color: '#8b5cf6' },
        { id: 'rag_5', type: 'Blob Storage (S3)', label: 'Raw S3 Document Chunks', x: 620, y: 220, category: 'storage', color: '#f97316' },
        { id: 'rag_6', type: 'Postgres DB', label: 'User & Auth Metadata DB', x: 620, y: 340, category: 'storage', color: '#0ea5e9' },
      ];
      const l: BoardLink[] = [
        { id: 'ragl_1', from: 'rag_1', to: 'rag_2', protocol: 'HTTPS/REST' },
        { id: 'ragl_2', from: 'rag_2', to: 'rag_3', protocol: 'Tokenized Context' },
        { id: 'ragl_3', from: 'rag_3', to: 'rag_4', protocol: 'Cosine ANN Query' },
        { id: 'ragl_4', from: 'rag_3', to: 'rag_5', protocol: 'Raw Chunk Hydration' },
        { id: 'ragl_5', from: 'rag_2', to: 'rag_6', protocol: 'PostgreSQL/Auth' },
      ];
      setNodes(n);
      setLinks(l);
    } else if (presetName === 'quant_exchange') {
      const n: BoardNode[] = [
        { id: 'q_1', type: 'API Gateway', label: 'FIX 4.4 Ingress Gateway', x: 30, y: 180, category: 'gateway', color: 'var(--brand)' },
        { id: 'q_2', type: 'Matching Engine (LMAX / Disruptor)', label: 'Deterministic LMAX Engine', x: 230, y: 180, category: 'compute', color: '#f59e0b' },
        { id: 'q_3', type: 'Kafka / Queue', label: 'Disruptor Ring Buffer', x: 440, y: 180, category: 'queue', color: '#ec4899' },
        { id: 'q_4', type: 'Microservice', label: 'UDP Market Data Feed', x: 650, y: 100, category: 'compute', color: 'var(--success)' },
        { id: 'q_5', type: 'Postgres DB', label: 'Post-Trade Clearing DB', x: 650, y: 260, category: 'storage', color: '#0ea5e9' },
      ];
      const l: BoardLink[] = [
        { id: 'ql_1', from: 'q_1', to: 'q_2', protocol: 'TCP/FIX Ingress' },
        { id: 'ql_2', from: 'q_2', to: 'q_3', protocol: 'Lock-Free Journal' },
        { id: 'ql_3', from: 'q_3', to: 'q_4', protocol: 'Multicast UDP' },
        { id: 'ql_4', from: 'q_3', to: 'q_5', protocol: 'Async Audit Commit' },
      ];
      setNodes(n);
      setLinks(l);
    } else if (presetName === 'zero_trust_security') {
      const n: BoardNode[] = [
        { id: 'sec_1', type: 'Client App', label: 'External Client App', x: 30, y: 180, category: 'client', color: 'var(--info)' },
        { id: 'sec_2', type: 'WAF / API Shield', label: 'Cloudflare WAF / API Shield', x: 220, y: 180, category: 'gateway', color: '#e11d48' },
        { id: 'sec_3', type: 'API Gateway', label: 'OIDC Ingress Auth Gateway', x: 420, y: 180, category: 'gateway', color: 'var(--brand)' },
        { id: 'sec_4', type: 'Microservice', label: 'Protected Core Microservice', x: 620, y: 100, category: 'compute', color: 'var(--success)' },
        { id: 'sec_5', type: 'Auth & KMS Vault (OIDC / Vault)', label: 'HashiCorp Vault / KMS', x: 620, y: 260, category: 'storage', color: '#7c3aed' },
        { id: 'sec_6', type: 'Kafka / Queue', label: 'SIEM Audit Stream', x: 820, y: 180, category: 'queue', color: '#ec4899' },
      ];
      const l: BoardLink[] = [
        { id: 'sl_1', from: 'sec_1', to: 'sec_2', protocol: 'HTTPS/TLS 1.3' },
        { id: 'sl_2', from: 'sec_2', to: 'sec_3', protocol: 'Filtered Traffic' },
        { id: 'sl_3', from: 'sec_3', to: 'sec_4', protocol: 'mTLS JWT Token' },
        { id: 'sl_4', from: 'sec_4', to: 'sec_5', protocol: 'Vault Envelope Key' },
        { id: 'sl_5', from: 'sec_4', to: 'sec_6', protocol: 'Audit Pub/Sub' },
      ];
      setNodes(n);
      setLinks(l);
    } else if (presetName === 'webrtc_conferencing') {
      const n: BoardNode[] = [
        { id: 'rtc_1', type: 'Client App', label: 'WebRTC Video Participant', x: 30, y: 180, category: 'client', color: 'var(--info)' },
        { id: 'rtc_2', type: 'Load Balancer', label: 'STUN / TURN Edge Relay', x: 230, y: 180, category: 'gateway', color: 'var(--reward)' },
        { id: 'rtc_3', type: 'Media Server (WebRTC / SFU)', label: 'LiveKit SFU Media Server', x: 440, y: 180, category: 'compute', color: '#0284c7' },
        { id: 'rtc_4', type: 'Redis Cache', label: 'Redis Room Signaling Cache', x: 650, y: 100, category: 'storage', color: 'var(--danger)' },
        { id: 'rtc_5', type: 'Blob Storage (S3)', label: 'S3 Composite Recording Bucket', x: 650, y: 260, category: 'storage', color: '#f97316' },
      ];
      const l: BoardLink[] = [
        { id: 'rl_1', from: 'rtc_1', to: 'rtc_2', protocol: 'UDP NAT Traversal' },
        { id: 'rl_2', from: 'rtc_2', to: 'rtc_3', protocol: 'RTP Media Stream' },
        { id: 'rl_3', from: 'rtc_3', to: 'rtc_4', protocol: 'SDP Signaling Sync' },
        { id: 'rl_4', from: 'rtc_3', to: 'rtc_5', protocol: 'HLS Archive Store' },
      ];
      setNodes(n);
      setLinks(l);
    } else if (presetName === 'growth_funnel') {
      const n: BoardNode[] = [
        { id: 'gf_1', type: 'Target Audience', label: 'ICP Paid & Organic Reach', x: 30, y: 170, category: 'business', color: 'var(--info)' },
        { id: 'gf_2', type: 'Ad Campaign', label: 'Meta / Search Acquisition', x: 220, y: 90, category: 'business', color: 'var(--warning)' },
        { id: 'gf_3', type: 'Landing Page', label: 'A/B Tested Funnel Page', x: 220, y: 250, category: 'business', color: 'var(--reward)' },
        { id: 'gf_4', type: 'Checkout Engine', label: 'Subscription & Pricing Tier', x: 430, y: 170, category: 'business', color: 'var(--success)' },
        { id: 'gf_5', type: 'CRM / Support', label: 'Onboarding & Lifecycle CRM', x: 630, y: 100, category: 'business', color: 'var(--brand)' },
        { id: 'gf_6', type: 'Retention Loop', label: 'Referral & Upsell Cohort', x: 630, y: 250, category: 'business', color: '#ec4899' },
      ];
      const l: BoardLink[] = [
        { id: 'gfl_1', from: 'gf_1', to: 'gf_2', protocol: 'Targeting' },
        { id: 'gfl_2', from: 'gf_2', to: 'gf_3', protocol: 'CTR Click' },
        { id: 'gfl_3', from: 'gf_3', to: 'gf_4', protocol: 'Checkout CR' },
        { id: 'gfl_4', from: 'gf_4', to: 'gf_5', protocol: 'CRM Sync' },
        { id: 'gfl_5', from: 'gf_5', to: 'gf_6', protocol: 'LTV Loop' },
      ];
      setNodes(n);
      setLinks(l);
    } else if (presetName === 'ecommerce_ops') {
      const n: BoardNode[] = [
        { id: 'ec_1', type: 'Supplier Network', label: 'Tier-1 Vendors & Sourcing', x: 30, y: 170, category: 'business', color: 'var(--accent-teal)' },
        { id: 'ec_2', type: 'Logistics Hub', label: 'Regional Fulfillment WMS', x: 230, y: 170, category: 'business', color: '#f97316' },
        { id: 'ec_3', type: 'Checkout Engine', label: 'Omnichannel Order OMS', x: 440, y: 90, category: 'business', color: 'var(--success)' },
        { id: 'ec_4', type: 'CRM / Support', label: 'Returns & SLA Resolution', x: 440, y: 260, category: 'business', color: 'var(--brand)' },
        { id: 'ec_5', type: 'Retention Loop', label: 'Inventory Forecast & Reorder', x: 650, y: 170, category: 'business', color: '#ec4899' },
      ];
      const l: BoardLink[] = [
        { id: 'ecl_1', from: 'ec_1', to: 'ec_2', protocol: 'PO Inbound' },
        { id: 'ecl_2', from: 'ec_2', to: 'ec_3', protocol: 'Live Stock' },
        { id: 'ecl_3', from: 'ec_3', to: 'ec_4', protocol: 'Order SLA' },
        { id: 'ecl_4', from: 'ec_2', to: 'ec_5', protocol: 'Turnover KPI' },
      ];
      setNodes(n);
      setLinks(l);
    } else if (presetName === 'erp_ledger') {
      const n: BoardNode[] = [
        { id: 'erp_1', type: 'Invoice / Voucher Intake', label: 'Invoice & Voucher Intake', x: 28, y: 170, category: 'business', color: '#0ea5e9' },
        { id: 'erp_2', type: '3-Way Match & Audit', label: 'PO / GRN 3-Way Audit Gate', x: 215, y: 170, category: 'business', color: '#8b5cf6' },
        { id: 'erp_3', type: 'GST / Tax Engine', label: 'GST / GSTR-2B & TDS Engine', x: 405, y: 95, category: 'business', color: '#f59e0b' },
        { id: 'erp_4', type: 'General Ledger (Dr=Cr)', label: 'Double-Entry General Ledger', x: 405, y: 245, category: 'business', color: '#10b981' },
        { id: 'erp_5', type: 'Treasury & Bank Recon', label: 'Bank Recon & Cash Treasury', x: 605, y: 110, category: 'business', color: '#06b6d4' },
        { id: 'erp_6', type: 'Financial Reporting (Ind AS/IFRS)', label: 'Ind AS / IFRS Board P&L', x: 605, y: 245, category: 'business', color: '#ec4899' },
      ];
      const l: BoardLink[] = [
        { id: 'erpl_1', from: 'erp_1', to: 'erp_2', protocol: 'SLA Handoff' },
        { id: 'erpl_2', from: 'erp_2', to: 'erp_3', protocol: 'Data Sync' },
        { id: 'erpl_3', from: 'erp_3', to: 'erp_4', protocol: 'Ledger Entry' },
        { id: 'erpl_4', from: 'erp_4', to: 'erp_5', protocol: 'Data Sync' },
        { id: 'erpl_5', from: 'erp_4', to: 'erp_6', protocol: 'KPI Loop' },
      ];
      setNodes(n);
      setLinks(l);
    }
  };

  const presetButtons: Array<{ key: PresetKey; label: string }> = domainStream === 'non_tech'
    ? [
        { key: 'erp_ledger', label: '📒 Order-to-Cash & GST Control' },
        { key: 'growth_funnel', label: '📣 Growth & Unit Economics Funnel' },
        { key: 'ecommerce_ops', label: '🚚 E-Commerce Fulfillment Ops' },
      ]
    : [
        { key: '3tier', label: '⚡ 3-Tier Web App' },
        { key: 'microservices', label: '⚙️ Microservices Bus' },
        { key: 'rag_pipeline', label: '🧠 RAG AI Pipeline' },
        { key: 'quant_exchange', label: '📈 Quant Exchange' },
        { key: 'zero_trust_security', label: '🛡️ Zero-Trust Security' },
        { key: 'webrtc_conferencing', label: '🎥 WebRTC Video' },
      ];

  const categories = domainStream === 'non_tech'
    ? [
        { id: 'all', label: 'All (14)' },
        { id: 'finance_audit', label: '📒 Finance & Audit' },
        { id: 'acquisition', label: '📣 Acquisition' },
        { id: 'operations', label: '🚚 Commerce & Ops' },
        { id: 'retention', label: '🔄 CRM & Retention' },
      ]
    : [
        { id: 'all', label: 'All (16)' },
        { id: 'client_gateway', label: '🌐 Ingress & Gateways' },
        { id: 'compute', label: '⚙️ Compute' },
        { id: 'storage', label: '💾 Storage' },
        { id: 'queue', label: '📨 Queues' },
      ];

  const filteredPalette = selectedCategory === 'all'
    ? palette
    : palette.filter(item => {
        if (domainStream === 'non_tech') {
          if (selectedCategory === 'finance_audit') {
            return [
              'Invoice / Voucher Intake',
              '3-Way Match & Audit',
              'GST / Tax Engine',
              'General Ledger (Dr=Cr)',
              'Treasury & Bank Recon',
              'Financial Reporting (Ind AS/IFRS)',
            ].includes(item.type);
          }
          if (selectedCategory === 'acquisition') return ['Target Audience', 'Ad Campaign', 'Landing Page'].includes(item.type);
          if (selectedCategory === 'operations') return ['Checkout Engine', 'Logistics Hub', 'Supplier Network'].includes(item.type);
          if (selectedCategory === 'retention') return ['CRM / Support', 'Retention Loop'].includes(item.type);
          return true;
        }
        if (selectedCategory === 'client_gateway') return item.category === 'gateway' || item.category === 'client';
        return item.category === selectedCategory;
      });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--bg2)', padding: 12, borderRadius: 14, border: '1px solid var(--border)' }}>
      {/* Header Toolbar - Single Row Consolidated Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
        <div>
          <span style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            {domainStream === 'non_tech' ? 'Interactive Business Workflow Canvas' : 'Interactive System Whiteboard'}
          </span>
          <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 900, color: 'var(--t1)' }}>
            {domainStream === 'non_tech' ? `Business Workflow: ${activeTopic}` : `Architecture Topology: ${activeTopic}`}
          </h3>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={activeProtocol}
            onChange={(e) => setActiveProtocol(e.target.value)}
            className="iv-select"
            style={{ padding: '5px 8px', fontSize: 11.5, fontWeight: 800 }}
          >
            {domainStream === 'non_tech' ? (
              <>
                <option value='Funnel Flow'>Flow: Funnel Conversion</option>
                <option value='Data Sync'>Flow: CRM / ERP Sync</option>
                <option value='SLA Handoff'>Flow: Operational Handoff</option>
                <option value='Ledger Entry'>Flow: Journal / Audit</option>
                <option value='KPI Loop'>Flow: Feedback / KPI</option>
              </>
            ) : (
              <>
                <option value='HTTPS/REST'>Protocol: HTTPS/REST</option>
                <option value='gRPC'>Protocol: gRPC</option>
                <option value='SQL Query'>Protocol: SQL Query</option>
                <option value='Redis Cache'>Protocol: Cache Get/Set</option>
                <option value='Kafka Event'>Protocol: Event Pub/Sub</option>
                <option value='Websocket'>Protocol: WebSocket Stream</option>
              </>
            )}
          </select>

          <button
            type="button"
            onClick={() => {
              setIsConnectMode(c => !c);
              setSelectedSourceId(null);
            }}
            style={{
              background: isConnectMode ? 'var(--accent)' : 'var(--bg3)',
              border: isConnectMode ? '2px solid var(--accent)' : '1px solid var(--border)',
              color: isConnectMode ? '#ffffff' : 'var(--t1)',
              borderRadius: 8,
              padding: '5px 10px',
              fontSize: 11.5,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span>{isConnectMode ? '🔗 Connect ON' : '🔗 Connect'}</span>
          </button>

          {/* Preset Selector Dropdown - Replaces 6 standalone wide buttons */}
          <select
            aria-label="Load architecture preset"
            value=""
            onChange={(e) => {
              const val = e.target.value as PresetKey;
              if (val) loadPreset(val);
            }}
            className="iv-select"
            style={{
              padding: '5px 8px',
              fontSize: 11.5,
              fontWeight: 800,
              background: 'var(--bg3)',
              color: 'var(--t1)',
              borderRadius: 8,
              border: '1px solid var(--border)',
              cursor: 'pointer'
            }}
          >
            <option value="" disabled>📐 Load Preset Template…</option>
            {presetButtons.map(preset => (
              <option key={preset.key} value={preset.key}>
                {preset.label}
              </option>
            ))}
          </select>

          {pendingPreset && (
            <button
              type="button"
              onClick={() => loadPreset(pendingPreset as PresetKey, true)}
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid var(--warning, #f59e0b)',
                color: 'var(--amber-mid)',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              ✓ Confirm Replace with {presetButtons.find(p => p.key === pendingPreset)?.label}?
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setNodes([]);
              setLinks([]);
              setSelectedSourceId(null);
              setPendingPreset(null);
            }}
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--coral-mid)', borderRadius: 8, padding: '5px 9px', fontSize: 11.5, fontWeight: 800, cursor: 'pointer' }}
            title="Reset canvas to blank"
          >
            🗑️ Clear
          </button>

          {onAnalyze && (
            <button
              type="button"
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="iv-btn-primary"
              style={{
                padding: '5px 12px',
                fontSize: 11.5,
                borderRadius: 8,
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              }}
            >
              {isAnalyzing
                ? '🤖 Evaluating...'
                : domainStream === 'non_tech'
                ? '🤖 Evaluate Workflow'
                : '🤖 Evaluate Architecture'}
            </button>
          )}
        </div>
      </div>

      {/* Palette Toolbar - Streamlined 1-Row Ergonomics with Categories */}
      <div style={{
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        background: 'var(--bg3)',
        padding: '5px 8px',
        borderRadius: 8,
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        {/* Category Filter Tabs */}
        <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '3px 7px',
                fontSize: 10.5,
                fontWeight: 800,
                borderRadius: 5,
                border: selectedCategory === cat.id ? '1px solid var(--accent)' : '1px solid transparent',
                background: selectedCategory === cat.id ? 'var(--accent)' : 'transparent',
                color: selectedCategory === cat.id ? '#ffffff' : 'var(--t2)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 18, background: 'var(--border)', flexShrink: 0 }} />

        {/* Horizontally scrollable chip row */}
        <div style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          gap: 5,
          overflowX: 'auto',
          flexWrap: 'nowrap',
          scrollbarWidth: 'none',
          alignItems: 'center',
          padding: '1px 0'
        }}>
          {filteredPalette.map(item => (
            <button
              key={item.type}
              type="button"
              onClick={() => addNode(item)}
              className="iv-seg-btn"
              title={`Add ${item.type} to canvas`}
              style={{
                background: 'var(--bg2)',
                border: `1px solid color-mix(in srgb, ${item.color} 38%, var(--border))`,
                color: 'var(--t1)',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <span style={{ fontSize: 11 }}>{item.icon}</span>
              <span>{item.type}</span>
            </button>
          ))}
        </div>

        {/* Instant Add Dropdown */}
        <select
          aria-label="Add component to canvas"
          value=""
          onChange={(e) => {
            const item = palette.find(p => p.type === e.target.value);
            if (item) addNode(item);
          }}
          className="iv-select"
          style={{
            padding: '3px 6px',
            fontSize: 10.5,
            fontWeight: 700,
            flexShrink: 0,
            cursor: 'pointer'
          }}
        >
          <option value="" disabled>+ Add node…</option>
          {palette.map(p => (
            <option key={p.type} value={p.type}>
              {p.icon} {p.type}
            </option>
          ))}
        </select>
      </div>

      {/* Canvas Area - Generous Designer Height */}
      <div
        ref={canvasRef}
        className="iv-canvas-bg"
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onTouchMove={handleCanvasTouchMove}
        onTouchEnd={handleCanvasTouchEnd}
        style={{
          position: 'relative',
          height: 'clamp(340px, 48vh, 460px)',
          backgroundImage: 'radial-gradient(var(--border2) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          borderRadius: 14,
          border: '1px solid var(--border)',
          overflow: 'hidden',
          touchAction: 'none',
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
                {/* Wide transparent hit target so clicking any arrow cleanly deletes that connection */}
                <line
                  x1={fromCenterX}
                  y1={fromCenterY}
                  x2={toCenterX}
                  y2={toCenterY}
                  stroke='transparent'
                  strokeWidth='14'
                  className='iv-wb-link-hit'
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLink(l.id);
                  }}
                >
                  <title>Click to remove connection ({l.protocol || 'link'})</title>
                </line>
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
                  <g>
                    <rect
                      x={midX - Math.max(30, l.protocol.length * 3.4 + 8)}
                      y={midY - 17}
                      width={Math.max(60, l.protocol.length * 6.8 + 16)}
                      height={16}
                      rx={5}
                      fill='var(--bg2)'
                      stroke='var(--border)'
                      strokeWidth='1'
                      opacity={0.95}
                    />
                    <text
                      x={midX}
                      y={midY - 6}
                      fill='var(--t1)'
                      fontSize='9.5'
                      fontWeight='800'
                      textAnchor='middle'
                    >
                      {l.protocol}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {nodes.length === 0 && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
            color: 'var(--t3)', textAlign: 'center', padding: 20
          }}>
            <div style={{ fontSize: 35, marginBottom: 8, opacity: 0.6 }}>📐</div>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t2)', marginBottom: 4 }}>
              {domainStream === 'non_tech' ? 'Empty Business Workflow Canvas' : 'Empty Architecture Whiteboard'}
            </div>
            <div style={{ fontSize: 12, maxWidth: 380, lineHeight: 1.45, color: 'var(--t3)' }}>
              {domainStream === 'non_tech'
                ? <>Click business stages from the palette above to map your funnel &amp; operations, then toggle <strong>🔗 Connect</strong> to draw directional handover arrows.</>
                : <>Click components from the palette above to place nodes, then toggle <strong>🔗 Connect</strong> to draw data flow arrows.</>}
            </div>
          </div>
        )}

        {nodes.map(n => {
          const isSelected = selectedSourceId === n.id;
          const isEditing = editingNodeId === n.id;

          return (
            <div
              key={n.id}
              onMouseDown={(e) => handleNodeMouseDown(e, n.id)}
              onTouchStart={(e) => handleNodeTouchStart(e, n.id)}
              onClick={() => handleNodeClick(n.id)}
              style={{
                position: 'absolute',
                left: n.x,
                top: n.y,
                width: 148,
                padding: '8px 10px',
                background: isSelected ? 'var(--accent-light)' : 'var(--bg2)',
                border: isSelected ? '2px solid var(--accent)' : ('1.5px solid ' + (n.color || 'var(--border)')),
                borderLeft: '4px solid ' + (n.color || 'var(--accent)'),
                borderRadius: 10,
                color: 'var(--t1)',
                fontSize: 12,
                cursor: isConnectMode ? 'pointer' : 'grab',
                boxShadow: isSelected ? '0 0 0 3px var(--accent-glow), var(--shadow-md)' : 'var(--shadow-sm)',
                userSelect: 'none',
                zIndex: isSelected ? 10 : 2
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 10.5, fontWeight: 900, color: n.color || 'var(--accent)', textTransform: 'uppercase' }}>
                  {n.type}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${n.label}`}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(n.id);
                  }}
                  style={{
                    background: 'var(--danger)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    fontSize: 9,
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
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onChange={(e) => updateNodeLabel(n.id, e.target.value)}
                  onBlur={() => setEditingNodeId(null)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingNodeId(null); }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    background: 'var(--bg3)',
                    border: '1px solid var(--accent)',
                    color: 'var(--t1)',
                    borderRadius: 4,
                    padding: '2px 4px',
                    fontSize: 11,
                    fontWeight: 700
                  }}
                />
              ) : (
                <div
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingNodeId(n.id);
                  }}
                  style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t1)', cursor: 'text' }}
                  title='Double click to rename'
                >
                  {n.label}
                </div>
              )}

              <div style={{ fontSize: 9.5, color: isSelected ? 'var(--accent)' : 'var(--t3)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span>{isSelected ? '🎯 Source Node' : isConnectMode ? 'Click to Link' : 'Drag to Move'}</span>
                <span style={{ fontSize: 9 }}>2x click</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Metrics */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, fontSize: 12, color: 'var(--t3)', fontWeight: 800, padding: '4px 6px' }}>
        <div>
          <span>Nodes: {nodes.length}</span> • <span>Connections: {links.length}</span> • <span>Mode: {domainStream.toUpperCase()}</span>
        </div>
        <div>
          <span>Tip: Double click node to rename • Click any arrow to delete link</span>
        </div>
      </div>
    </div>
  );
}
