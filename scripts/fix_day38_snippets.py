with open('scripts/design_day38_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Part 3: prepend AnchorPositioningEngine definition
p3_helper = '''type Placement = 
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
  ): { x: number; y: number } {
    let x = 0;
    let y = 0;
    switch (placement) {
      case 'top':
        x = anchor.left + (anchor.width / 2) - (floating.width / 2);
        y = anchor.top - floating.height - gap;
        break;
      case 'bottom':
        x = anchor.left + (anchor.width / 2) - (floating.width / 2);
        y = anchor.bottom + gap;
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
    return { x: Math.round(x), y: Math.round(y) };
  }
}

interface VirtualElement {'''

text = text.replace('interface VirtualElement {', p3_helper, 1)

# Part 5: prepend definitions for VirtualAnchorFactory, CollisionResolutionEngine, FloatingArrowEngine
p5_helper = '''type Placement = 
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

interface VirtualElement {
  getBoundingClientRect(): Rect;
  contextName: string;
}

class VirtualAnchorFactory {
  public static fromCanvasNode(canvasRect: Rect, nodeRelX: number, nodeRelY: number, nodeWidth: number, nodeHeight: number): VirtualElement {
    const absLeft = canvasRect.left + nodeRelX;
    const absTop = canvasRect.top + nodeRelY;
    return {
      contextName: 'Canvas Candlestick Marker',
      getBoundingClientRect: (): Rect => ({
        top: absTop,
        bottom: absTop + nodeHeight,
        left: absLeft,
        right: absLeft + nodeWidth,
        width: nodeWidth,
        height: nodeHeight
      })
    };
  }
}

class CollisionResolutionEngine {
  public static resolvePlacement(
    anchor: Rect,
    floating: { width: number; height: number },
    preferredPlacement: Placement,
    viewport: { width: number; height: number; padding: number },
    gap: number = 8
  ): { finalPlacement: Placement; finalCoordinates: { x: number; y: number } } {
    let finalPlacement = preferredPlacement;
    const spaceAbove = anchor.top - viewport.padding;
    if (preferredPlacement === 'top' && spaceAbove < (floating.height + gap)) {
      finalPlacement = 'bottom';
    }
    let x = anchor.left + (anchor.width / 2) - (floating.width / 2);
    let y = finalPlacement === 'bottom' ? anchor.bottom + gap : anchor.top - floating.height - gap;
    return {
      finalPlacement,
      finalCoordinates: { x: Math.round(x), y: Math.round(y) }
    };
  }
}

class FloatingArrowEngine {
  public static computeArrow(
    anchor: Rect,
    floatingRect: { left: number; top: number; width: number; height: number },
    placement: Placement
  ): { clampedOffset: number; style: { top?: string; bottom?: string; left?: string; transform: string } } {
    const anchorCenterX = anchor.left + (anchor.width / 2);
    const arrowLeft = anchorCenterX - floatingRect.left - 6;
    const clampedLeft = Math.max(12, Math.min(arrowLeft, floatingRect.width - 24));
    return {
      clampedOffset: Math.round(clampedLeft),
      style: {
        top: placement.startsWith('bottom') ? '-6px' : undefined,
        bottom: placement.startsWith('top') ? '-6px' : undefined,
        left: `${Math.round(clampedLeft)}px`,
        transform: 'rotate(45deg)'
      }
    };
  }
}

interface CandlestickData {'''

text = text.replace('interface CandlestickData {', p5_helper, 1)

with open('scripts/design_day38_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Prepend complete for Day 38 snippets!")
