import React from 'react';
import type { Node, FlowStep, VisualTone } from '@/lib/types/lessonVisual';
import { getToneColor, getToneBg, getToneTextColor, RenderWithFaintSpaces } from './visualTokens';

interface FlowTemplateProps {
  nodes: Node[];
  step: FlowStep;
  highlightedLabel: string | null;
  onShapeTap?: (label: string) => void;
  showSpaces?: boolean;
}

export function FlowTemplate({
  nodes,
  step,
  highlightedLabel,
  onShapeTap,
  showSpaces,
}: FlowTemplateProps): React.ReactElement {
  const isLitArrow = (fromId: string, toId: string): boolean => {
    return step.arrows.some(([from, to]: [string, string]) => from === fromId && to === toId);
  };

  // Check if this is the convergent 2-row layout of 3.6
  const isConvergent =
    nodes.length === 5 &&
    nodes.map((n) => n.id).join(',') === 'item,clean_item,category,clean_category,label';

  const renderNodeBox = (node: Node) => {
    const isHighlighted =
      highlightedLabel !== null &&
      highlightedLabel.trim().toLowerCase() === node.label.trim().toLowerCase();

    const rawTone: VisualTone = step.tones[node.id] || 'idle';
    const effectiveTone: VisualTone = isHighlighted ? 'data' : rawTone;
    const isTappable = node.tappable !== false;
    const value = step.values[node.id] || '';

    return (
      <div
        key={node.id}
        onClick={isTappable ? () => onShapeTap?.(node.label) : undefined}
        role={isTappable ? 'button' : undefined}
        tabIndex={isTappable ? 0 : undefined}
        onKeyDown={
          isTappable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onShapeTap?.(node.label);
                }
              }
            : undefined
        }
        aria-label={`${node.label}: ${value || 'empty'}`}
        style={{
          border: `2px solid ${getToneColor(effectiveTone)}`,
          background: getToneBg(effectiveTone),
          borderRadius: '12px',
          padding: '12px 14px',
          minWidth: '110px',
          maxWidth: '180px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          cursor: isTappable ? 'pointer' : 'default',
          transition: 'background 300ms ease, border-color 300ms ease, box-shadow 300ms ease',
          boxShadow: isHighlighted ? '0 0 0 3px rgba(59, 130, 246, 0.35)' : undefined,
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: getToneTextColor(effectiveTone),
          }}
        >
          {node.label}
        </span>
        <div
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--t1)',
            textAlign: 'center',
            wordBreak: 'break-word',
            minHeight: '22px',
          }}
        >
          {value ? (
            <RenderWithFaintSpaces text={value} showSpaces={showSpaces} />
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>(empty)</span>
          )}
        </div>
      </div>
    );
  };

  const renderArrow = (lit: boolean, key: string) => (
    <div
      key={key}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px',
      }}
      aria-hidden="true"
    >
      <svg width="28" height="20" viewBox="0 0 28 20" style={{ flexShrink: 0 }}>
        <path
          d="M 4 10 L 22 10 M 16 4 L 22 10 L 16 16"
          fill="none"
          stroke={lit ? 'var(--accent)' : 'var(--border)'}
          strokeWidth={lit ? '2.5' : '1.8'}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'stroke 300ms ease, stroke-width 300ms ease' }}
        />
      </svg>
    </div>
  );

  if (isConvergent) {
    // 3.6 convergent pipeline
    const itemNode = nodes[0];
    const cleanItemNode = nodes[1];
    const catNode = nodes[2];
    const cleanCatNode = nodes[3];
    const labelNode = nodes[4];

    const arrowItem = isLitArrow('item', 'clean_item');
    const arrowCat = isLitArrow('category', 'clean_category');
    const arrowToLabel =
      isLitArrow('clean_item', 'label') || isLitArrow('clean_category', 'label');

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '100%',
          padding: '16px 8px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderNodeBox(itemNode)}
            {renderArrow(arrowItem, 'a1')}
            {renderNodeBox(cleanItemNode)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderNodeBox(catNode)}
            {renderArrow(arrowCat, 'a2')}
            {renderNodeBox(cleanCatNode)}
          </div>
        </div>

        {renderArrow(arrowToLabel, 'a3')}
        {renderNodeBox(labelNode)}
      </div>
    );
  }

  // Linear flow
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        padding: '16px 8px',
      }}
    >
      {nodes.map((node, i) => {
        const nextNode = nodes[i + 1];
        const lit = nextNode ? isLitArrow(node.id, nextNode.id) : false;

        return (
          <React.Fragment key={node.id}>
            {renderNodeBox(node)}
            {nextNode && renderArrow(lit, `arrow-${node.id}-${nextNode.id}`)}
          </React.Fragment>
        );
      })}
    </div>
  );
}
