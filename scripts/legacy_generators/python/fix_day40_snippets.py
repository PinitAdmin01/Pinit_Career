from design_day40_data import DAY_40

preamble = '''enum LayerKind {
  BOTTOM_SHEET = 'BOTTOM_SHEET',
  MODAL_DIALOG = 'MODAL_DIALOG',
  POPOVER = 'POPOVER',
  TOOLTIP = 'TOOLTIP'
}

interface OverlayLayer {
  id: string;
  kind: LayerKind;
  zIndex: number;
  triggerId: string;
  isDismissibleOnEsc: boolean;
  trapsFocus: boolean;
}

class UnifiedLayerCoordinator {
  private static instance: UnifiedLayerCoordinator;
  private stack: OverlayLayer[] = [];
  private baseZIndexMap: Record<LayerKind, number> = {
    [LayerKind.BOTTOM_SHEET]: 3000,
    [LayerKind.MODAL_DIALOG]: 4000,
    [LayerKind.POPOVER]: 5000,
    [LayerKind.TOOLTIP]: 6000
  };

  private constructor() {}

  public static getInstance(): UnifiedLayerCoordinator {
    if (!UnifiedLayerCoordinator.instance) {
      UnifiedLayerCoordinator.instance = new UnifiedLayerCoordinator();
    }
    return UnifiedLayerCoordinator.instance;
  }

  public registerLayer(id: string, kind: LayerKind, triggerId: string, trapsFocus = true): OverlayLayer {
    const depth = this.stack.length;
    const computedZ = this.baseZIndexMap[kind] + (depth * 10);
    const layer: OverlayLayer = {
      id,
      kind,
      zIndex: computedZ,
      triggerId,
      isDismissibleOnEsc: true,
      trapsFocus
    };
    this.stack.push(layer);
    return layer;
  }

  public handleGlobalEscape(): { dismissedId?: string; remainingCount: number; restoredFocusTo?: string } {
    if (this.stack.length === 0) return { remainingCount: 0 };
    const top = this.stack.pop()!;
    return {
      dismissedId: top.id,
      remainingCount: this.stack.length,
      restoredFocusTo: `#${top.triggerId}`
    };
  }

  public getActiveStackReport(): string[] {
    return this.stack.map(
      (l, idx) => `[Index ${idx}] Layer: ${l.id} (${l.kind}) | Z-Index: ${l.zIndex} | Focus Trap: ${l.trapsFocus}`
    );
  }
}

interface FocusTrapSnapshot {
  overlayId: string;
  trapContainerId: string;
  previouslyFocusedElementId: string;
  focusableElementIds: string[];
  currentFocusIndex: number;
  isActive: boolean;
}

class NestedFocusStackEngine {
  private trapStack: FocusTrapSnapshot[] = [];

  public pushTrap(
    overlayId: string,
    containerId: string,
    previouslyFocusedId: string,
    focusableIds: string[]
  ): { initialFocusTarget: string; pausedTrapId?: string } {
    let pausedTrapId: string | undefined;
    if (this.trapStack.length > 0) {
      const currentActive = this.trapStack[this.trapStack.length - 1];
      currentActive.isActive = false;
      pausedTrapId = currentActive.overlayId;
    }
    const newTrap: FocusTrapSnapshot = {
      overlayId,
      trapContainerId: containerId,
      previouslyFocusedElementId: previouslyFocusedId,
      focusableElementIds: focusableIds,
      currentFocusIndex: 0,
      isActive: true
    };
    this.trapStack.push(newTrap);
    return {
      initialFocusTarget: `#${focusableIds[0]}`,
      pausedTrapId
    };
  }

  public handleTabNavigation(shift = false): { targetId: string; activeTrapId: string } | null {
    if (this.trapStack.length === 0) return null;
    const activeTrap = this.trapStack[this.trapStack.length - 1];
    const count = activeTrap.focusableElementIds.length;
    activeTrap.currentFocusIndex = (activeTrap.currentFocusIndex + 1) % count;
    return {
      targetId: `#${activeTrap.focusableElementIds[activeTrap.currentFocusIndex]}`,
      activeTrapId: activeTrap.overlayId
    };
  }

  public popTrap(): { restoredFocusTo: string; resumedTrapId?: string } | null {
    if (this.trapStack.length === 0) return null;
    const closingTrap = this.trapStack.pop()!;
    let resumedTrapId: string | undefined;
    if (this.trapStack.length > 0) {
      const parentTrap = this.trapStack[this.trapStack.length - 1];
      parentTrap.isActive = true;
      resumedTrapId = parentTrap.overlayId;
    }
    return {
      restoredFocusTo: `#${closingTrap.previouslyFocusedElementId}`,
      resumedTrapId
    };
  }
}

class OverlayStateMachine {
  private stack: { id: string; containerId: string; triggerId: string }[] = [];
  public push(id: string, containerId: string, triggerId: string): void {
    this.stack.push({ id, containerId, triggerId });
  }
  public pop() { return this.stack.pop() ?? null; }
  public getDepth() { return this.stack.length; }
}
'''

# Update Part 4 code
DAY_40['parts'][3]['code'] = preamble + '\n' + DAY_40['parts'][3]['code']

# Update Part 5 code
DAY_40['parts'][4]['code'] = preamble + '\n' + DAY_40['parts'][4]['code']

# Write back to design_day40_data.py
with open('scripts/design_day40_data.py', 'w', encoding='utf-8') as f:
    f.write('import re\n\n')
    f.write('def count_words(say_list):\n')
    f.write('    total = 0\n')
    f.write('    for para in say_list:\n')
    f.write('        clean = re.sub(r"[`*_#>\-\\[\\]\\(\\)]", "", para)\n')
    f.write('        total += len(clean.split())\n')
    f.write('    return total\n\n')
    f.write('DAY_40 = ')
    f.write(repr(DAY_40))
    f.write('\n\nif __name__ == "__main__":\n')
    f.write('    all_ok = True\n')
    f.write('    for i, p in enumerate(DAY_40["parts"]):\n')
    f.write('        words = count_words(p["say"])\n')
    f.write('        print(f"Day 40 Part {i+1} (\'{p[\'title\'][:35]}...\'): {words} words")\n')
    f.write('        if words < 600:\n')
    f.write('            all_ok = False\n')
    f.write('    assert all_ok, "Some Day 40 parts are < 600 words!"\n')
    f.write('    print("ALL DAY 40 PARTS SATISFY >= 600 WORDS INVARIANT!")\n')

print("Updated Day 40 with self-contained preambles!")
