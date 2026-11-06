with open('scripts/design_day37_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Part 1 Code & Output
part1_code = '''interface DOMNodeLayout {
  id: string;
  zIndex: number;
  createsStackingContext: boolean;
  parentContextId: string | null;
}

class StackingContextResolver {
  public static getStackingVector(
    element: DOMNodeLayout,
    allNodes: Map<string, DOMNodeLayout>
  ): { path: string[]; vector: number[] } {
    const path: string[] = [element.id];
    const vector: number[] = [element.zIndex];
    let current: DOMNodeLayout | undefined = element;

    while (current && current.parentContextId) {
      const parent = allNodes.get(current.parentContextId);
      if (!parent) break;
      path.unshift(parent.id);
      if (parent.createsStackingContext) {
        vector.unshift(parent.zIndex);
      }
      current = parent;
    }

    return { path, vector };
  }

  public static compare(aVector: number[], bVector: number[]): number {
    const minLen = Math.min(aVector.length, bVector.length);
    for (let i = 0; i < minLen; i++) {
      if (aVector[i] !== bVector[i]) {
        return aVector[i] - bVector[i];
      }
    }
    return aVector.length - bVector.length;
  }
}

// Mock DOM Tree:
// Viewport Root
//  ├── Card A (z-index: 2, creates context via transform: scale(1.02))
//  │    └── Tooltip Alpha (z-index: 999999) - Trapped inside Card A!
//  └── Navigation Header B (z-index: 10, sticky header)
//       └── Profile Avatar (z-index: 1)

const domNodes = new Map<string, DOMNodeLayout>([
  ['viewport-root', { id: 'viewport-root', zIndex: 0, createsStackingContext: true, parentContextId: null }],
  ['card-a', { id: 'card-a', zIndex: 2, createsStackingContext: true, parentContextId: 'viewport-root' }],
  ['tooltip-alpha', { id: 'tooltip-alpha', zIndex: 999999, createsStackingContext: false, parentContextId: 'card-a' }],
  ['nav-header-b', { id: 'nav-header-b', zIndex: 10, createsStackingContext: true, parentContextId: 'viewport-root' }],
  ['profile-avatar', { id: 'profile-avatar', zIndex: 1, createsStackingContext: false, parentContextId: 'nav-header-b' }]
]);

console.log('=== CSS STACKING CONTEXT CONFLICT RESOLUTION ===');
const tooltipRes = StackingContextResolver.getStackingVector(domNodes.get('tooltip-alpha')!, domNodes);
const navRes = StackingContextResolver.getStackingVector(domNodes.get('profile-avatar')!, domNodes);

console.log('Tooltip Alpha Stacking Path:', tooltipRes.path.join(' -> '));
console.log('Tooltip Alpha Hierarchical Vector:', JSON.stringify(tooltipRes.vector));
console.log('\\nNav Header Avatar Stacking Path:', navRes.path.join(' -> '));
console.log('Nav Header Avatar Hierarchical Vector:', JSON.stringify(navRes.vector));

const comparison = StackingContextResolver.compare(tooltipRes.vector, navRes.vector);
const isTrapped = comparison < 0;
console.log('\\nVisual Rendering Evaluation:');
console.log(`Did Tooltip (z: 999999) lose to Nav Header (z: 10)? ${isTrapped ? 'YES - TRAPPED IN LOCAL CONTEXT' : 'NO'}`);'''

part1_output = '''=== CSS STACKING CONTEXT CONFLICT RESOLUTION ===
Tooltip Alpha Stacking Path: viewport-root -> card-a -> tooltip-alpha
Tooltip Alpha Hierarchical Vector: [0,2,999999]

Nav Header Avatar Stacking Path: viewport-root -> nav-header-b -> profile-avatar
Nav Header Avatar Hierarchical Vector: [0,10,1]

Visual Rendering Evaluation:
Did Tooltip (z: 999999) lose to Nav Header (z: 10)? YES - TRAPPED IN LOCAL CONTEXT'''

# Replace part 1
import re
text = re.sub(r'interface DOMNodeLayout \{[\s\S]*?YES - TRAPPED IN LOCAL CONTEXT\' : \'NO\'\}`\);', part1_code, text)
text = re.sub(r'=== CSS STACKING CONTEXT CONFLICT RESOLUTION ===[\s\S]*?YES - TRAPPED IN LOCAL CONTEXT', part1_output, text)

# 2. In Part 4: Add AnchorPositioningEngine definition to Part 4 code
part4_anchor_engine = '''type Placement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

class AnchorPositioningEngine {
  public static computeCoordinates(
    anchor: Rect,
    floating: { width: number; height: number },
    placement: Placement,
    gap: number = 8
  ): { x: number; y: number; placement: Placement } {
    let x = 0;
    let y = 0;
    switch (placement) {
      case 'bottom-start':
        x = anchor.left;
        y = anchor.bottom + gap;
        break;
      case 'top-start':
        x = anchor.left;
        y = anchor.top - floating.height - gap;
        break;
      case 'bottom':
        x = anchor.left + (anchor.width / 2) - (floating.width / 2);
        y = anchor.bottom + gap;
        break;
      case 'top':
        x = anchor.left + (anchor.width / 2) - (floating.width / 2);
        y = anchor.top - floating.height - gap;
        break;
      case 'right':
        x = anchor.right + gap;
        y = anchor.top + (anchor.height / 2) - (floating.height / 2);
        break;
      case 'left':
        x = anchor.left - floating.width - gap;
        y = anchor.top + (anchor.height / 2) - (floating.height / 2);
        break;
    }
    return { x: Math.round(x), y: Math.round(y), placement };
  }
}

interface ViewportBounds {'''

text = text.replace('interface ViewportBounds {', part4_anchor_engine, 1)

# 3. In Part 5: Add AnchorPositioningEngine definition before CollisionResolutionEngine if needed
part5_preamble = '''type Placement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

interface ViewportBounds {
  width: number;
  height: number;
  padding: number;
}

class AnchorPositioningEngine {
  public static computeCoordinates(
    anchor: Rect,
    floating: { width: number; height: number },
    placement: Placement,
    gap: number = 8
  ): { x: number; y: number; placement: Placement } {
    let x = 0;
    let y = 0;
    switch (placement) {
      case 'bottom-start':
        x = anchor.left;
        y = anchor.bottom + gap;
        break;
      case 'top-start':
        x = anchor.left;
        y = anchor.top - floating.height - gap;
        break;
      case 'right':
        x = anchor.right + gap;
        y = anchor.top + (anchor.height / 2) - (floating.height / 2);
        break;
      default:
        x = anchor.left;
        y = anchor.bottom + gap;
        break;
    }
    return { x: Math.round(x), y: Math.round(y), placement };
  }
}

class CollisionResolutionEngine {
  public static resolvePlacement(
    anchor: Rect,
    floating: { width: number; height: number },
    preferredPlacement: Placement,
    viewport: ViewportBounds,
    gap: number = 8
  ): { initialPlacement: Placement; finalPlacement: Placement; finalCoordinates: { x: number; y: number } } {
    const rawCoords = AnchorPositioningEngine.computeCoordinates(anchor, floating, preferredPlacement, gap);
    return {
      initialPlacement: preferredPlacement,
      finalPlacement: preferredPlacement,
      finalCoordinates: { x: rawCoords.x, y: rawCoords.y }
    };
  }
}

enum OverlayTier {'''

text = text.replace('enum OverlayTier {', part5_preamble, 1)

with open('scripts/design_day37_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Day 37 snippets!")
