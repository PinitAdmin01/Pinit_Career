with open('scripts/design_day39_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

p5_preamble = '''interface PointerSample {
  y: number;
  time: number;
}

interface GestureDecision {
  action: 'DISMISS' | 'SNAP_BACK';
  finalTranslateY: number;
  velocity: number;
  reason: string;
}

class BottomSheetPhysicsEngine {
  private sheetHeight: number;
  private dismissDistanceRatio = 0.4;
  private velocityThreshold = 0.6;

  constructor(sheetHeight: number) {
    this.sheetHeight = sheetHeight;
  }

  public evaluateRelease(finalDeltaY: number, recentSamples: PointerSample[]): GestureDecision {
    let velocity = 0;
    if (recentSamples.length >= 2) {
      const p1 = recentSamples[recentSamples.length - 2];
      const p2 = recentSamples[recentSamples.length - 1];
      const dt = p2.time - p1.time;
      const dy = p2.y - p1.y;
      velocity = dt > 0 ? dy / dt : 0;
    }
    const distanceExceeded = finalDeltaY > (this.sheetHeight * this.dismissDistanceRatio);
    const flickDismiss = velocity > this.velocityThreshold;

    if (flickDismiss) {
      return {
        action: 'DISMISS',
        finalTranslateY: this.sheetHeight,
        velocity: parseFloat(velocity.toFixed(2)),
        reason: `Fast downward flick detected (${velocity.toFixed(2)} px/ms); instantaneous dismissal triggered.`
      };
    } else if (distanceExceeded) {
      return {
        action: 'DISMISS',
        finalTranslateY: this.sheetHeight,
        velocity: parseFloat(velocity.toFixed(2)),
        reason: `Distance threshold exceeded; dismissing.`
      };
    } else {
      return {
        action: 'SNAP_BACK',
        finalTranslateY: 0,
        velocity: parseFloat(velocity.toFixed(2)),
        reason: 'Snap back.'
      };
    }
  }
}

interface MobileDeviceMetrics {
  screenWidth: number;
  screenHeight: number;
  isAddressBarExpanded: boolean;
  isVirtualKeyboardActive: boolean;
  keyboardHeight: number;
  safeAreaBottom: number;
}

class MobileViewportShield {
  public static computeSafeSheetBounds(requestedSheetHeight: number, metrics: MobileDeviceMetrics) {
    return {
      effectiveHeight: requestedSheetHeight,
      safePaddingBottom: metrics.safeAreaBottom
    };
  }
}

interface BankTransaction {'''

text = text.replace('interface BankTransaction {', p5_preamble, 1)

with open('scripts/design_day39_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Prepend complete for Day 39 Part 5!")
