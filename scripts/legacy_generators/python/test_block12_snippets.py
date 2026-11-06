# scripts/test_block12_snippets.py
import subprocess

snippets = [
    # Snippet 1
    ("""interface RouteConfig {
  path: string;
  remoteName: string;
  component: string;
}

class MicroFrontendRouter {
  private routes = new Map<string, RouteConfig>();
  private activePath = "/";

  registerRoute(route: RouteConfig): void {
    this.routes.set(route.path, route);
  }

  navigate(path: string): string {
    this.activePath = path;
    const match = this.routes.get(path);
    if (!match) return `[Router] 404 Not Found: ${path}`;
    return `[Router] Routed to ${match.remoteName} -> ${match.component} at ${path}`;
  }

  getCurrentPath(): string {
    return this.activePath;
  }
}

const router = new MicroFrontendRouter();
router.registerRoute({ path: "/orders", remoteName: "orderApp", component: "OrderHistory" });
router.registerRoute({ path: "/profile", remoteName: "accountApp", component: "UserProfile" });

console.log(router.navigate("/orders"));
console.log(router.navigate("/profile"));
""", """[Router] Routed to orderApp -> OrderHistory at /orders
[Router] Routed to accountApp -> UserProfile at /profile"""),

    # Snippet 2
    ("""interface SharedDependency {
  name: string;
  version: string;
  requiredRange: string;
  singleton: boolean;
  instance: any;
}

class SharedScopeManager {
  private scope = new Map<string, SharedDependency>();

  registerDependency(dep: SharedDependency): void {
    const existing = this.scope.get(dep.name);
    if (existing && existing.singleton) {
      if (existing.version !== dep.version) {
        console.log(`[Shared Scope] Warning: Version mismatch for singleton ${dep.name}: existing v${existing.version} vs incoming v${dep.version}`);
      }
      return;
    }
    this.scope.set(dep.name, dep);
  }

  getDependency<T = any>(name: string): T {
    const dep = this.scope.get(name);
    if (!dep) throw new Error(`Dependency ${name} not found in shared scope`);
    return dep.instance;
  }
}

const sharedScope = new SharedScopeManager();
const reactMock = { version: "18.2.0", createElement: () => "vnode" };
sharedScope.registerDependency({ name: "react", version: "18.2.0", requiredRange: "^18.0.0", singleton: true, instance: reactMock });
sharedScope.registerDependency({ name: "react", version: "18.3.0", requiredRange: "^18.0.0", singleton: true, instance: { version: "18.3.0" } });

const resolvedReact = sharedScope.getDependency<{ version: string }>("react");
console.log(`[Shared Scope] Active React Singleton Version: ${resolvedReact.version}`);
""", """[Shared Scope] Warning: Version mismatch for singleton react: existing v18.2.0 vs incoming v18.3.0
[Shared Scope] Active React Singleton Version: 18.2.0"""),

    # Snippet 3
    ("""interface MFEEvent<T = any> {
  topic: string;
  sender: string;
  payload: T;
}

class CrossAppEventBus {
  private listeners = new Map<string, Array<(event: MFEEvent) => void>>();

  subscribe(topic: string, handler: (event: MFEEvent) => void): () => void {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, []);
    }
    this.listeners.get(topic)!.push(handler);
    return () => {
      const arr = this.listeners.get(topic) || [];
      this.listeners.set(topic, arr.filter(h => h !== handler));
    };
  }

  publish<T>(topic: string, sender: string, payload: T): void {
    const handlers = this.listeners.get(topic) || [];
    for (const h of handlers) {
      h({ topic, sender, payload });
    }
  }
}

const bus = new CrossAppEventBus();
bus.subscribe("auth:login", (evt) => {
  console.log(`[Event Bus] Received ${evt.topic} from ${evt.sender}: User ID ${evt.payload.userId}`);
});

bus.publish("auth:login", "authApp", { userId: "user_enterprise_99" });
""", """[Event Bus] Received auth:login from authApp: User ID user_enterprise_99"""),

    # Snippet 4
    ("""class StyleIsolationContainer {
  private isolatedDOM = new Map<string, { styles: string[]; markup: string }>();

  mountComponent(name: string, styles: string[], markup: string): string {
    this.isolatedDOM.set(name, { styles, markup });
    const prefixedStyles = styles.map(s => `[data-mfe-container="${name}"] ${s}`).join("; ");
    return `<div data-mfe-container="${name}"><style>${prefixedStyles}</style>${markup}</div>`;
  }
}

const container = new StyleIsolationContainer();
const rendered = container.mountComponent(
  "checkoutWidget",
  [".btn { background-color: blue }", ".title { font-weight: bold }"],
  "<h1 class='title'>Checkout</h1><button class='btn'>Pay</button>"
);
console.log(`[Style Isolation] Mounted Container: checkoutWidget`);
console.log(`[Style Isolation] Markup Length: ${rendered.length} characters`);
""", """[Style Isolation] Mounted Container: checkoutWidget
[Style Isolation] Markup Length: 172 characters"""),

    # Snippet 5
    ("""interface RemoteHealth {
  consecutiveFailures: number;
  status: "HEALTHY" | "DEGRADED" | "QUARANTINED";
}

class MicroFrontendSentinel {
  private healthMap = new Map<string, RemoteHealth>();

  recordLoadResult(remoteName: string, success: boolean): RemoteHealth {
    let health = this.healthMap.get(remoteName) || { consecutiveFailures: 0, status: "HEALTHY" };
    if (success) {
      health.consecutiveFailures = 0;
      health.status = "HEALTHY";
    } else {
      health.consecutiveFailures += 1;
      if (health.consecutiveFailures >= 3) {
        health.status = "QUARANTINED";
      } else {
        health.status = "DEGRADED";
      }
    }
    this.healthMap.set(remoteName, health);
    return health;
  }
}

const sentinel = new MicroFrontendSentinel();
sentinel.recordLoadResult("recsApp", false);
sentinel.recordLoadResult("recsApp", false);
const finalHealth = sentinel.recordLoadResult("recsApp", false);

console.log(`[Sentinel] Remote recsApp Consecutive Failures: ${finalHealth.consecutiveFailures}`);
console.log(`[Sentinel] Remote recsApp Final Status: ${finalHealth.status}`);
""", """[Sentinel] Remote recsApp Consecutive Failures: 3
[Sentinel] Remote recsApp Final Status: QUARANTINED""")
]

for idx, (code, exp) in enumerate(snippets):
    with open('tmp_test.ts', 'w', encoding='utf-8') as f:
        f.write(code)
    res = subprocess.run(['npx', 'tsx', 'tmp_test.ts'], capture_output=True, text=True, shell=True)
    act = res.stdout.strip()
    status = "PASS" if act == exp.strip() else f"FAIL\nExpected:\n{exp}\nActual:\n{act}"
    print(f"Snippet {idx+1}: {status}")
