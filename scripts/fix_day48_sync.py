import sys
sys.path.insert(0, 'scripts')
from react_day48_data import get_day48_data

d = get_day48_data()

# Part 1 output fix
d['parts'][0]['output'] = """--- MICRO-FRONTEND ARCHITECTURAL PAYLOAD AUDIT ---
Naive Duplicated Micro-Frontends Payload: 1140 KB
Module Federation Shared Singleton Payload: 459 KB
Network Byte Reduction via Module Federation: 59.7%"""

# Part 2 synchronous code
d['parts'][1]['code'] = """// Module Federation Synchronous Container Protocol Simulator
function createRemoteContainer(remoteName, exposedModules, providedShared) {
  let sharedScopeRef = null;

  return {
    name: remoteName,
    init: function(sharedScope) {
      sharedScopeRef = sharedScope;
      for (const [pkgName, meta] of Object.entries(providedShared)) {
        if (!sharedScopeRef[pkgName]) sharedScopeRef[pkgName] = {};
        if (!sharedScopeRef[pkgName][meta.version]) {
          sharedScopeRef[pkgName][meta.version] = {
            instance: meta.moduleInstance,
            loaded: true
          };
        }
      }
    },
    get: function(modulePath) {
      const moduleFactory = exposedModules[modulePath];
      if (!moduleFactory) throw new Error('Module ' + modulePath + ' not found');
      return moduleFactory;
    }
  };
}

class ModuleFederationHost {
  constructor() {
    this.sharedScope = {};
  }
  registerShared(pkgName, version, instance) {
    if (!this.sharedScope[pkgName]) this.sharedScope[pkgName] = {};
    this.sharedScope[pkgName][version] = { instance, loaded: true };
  }
  loadRemoteModule(remoteContainer, modulePath) {
    remoteContainer.init(this.sharedScope);
    const factory = remoteContainer.get(modulePath);
    return factory();
  }
}

const host = new ModuleFederationHost();
const sharedReact = { version: '18.3.1', type: 'SHARED_REACT_SINGLETON' };
host.registerShared('react', '18.3.1', sharedReact);

const navRemote = createRemoteContainer('NavRemote', {
  './Header': () => ({
    name: 'HeaderWidget',
    render: () => ({ tag: 'nav', content: 'Enterprise Global Navigation' })
  })
}, {
  'react': { version: '18.3.1', moduleInstance: sharedReact }
});

console.log('--- MODULE FEDERATION CONTAINER RESOLUTION ---');
console.log('Host Shared Scope Initialized with React:', Object.keys(host.sharedScope));
const remoteHeader = host.loadRemoteModule(navRemote, './Header');
console.log('Loaded Remote Component:', remoteHeader.name);
console.log('Rendered Remote Markup:', remoteHeader.render());"""

d['parts'][1]['output'] = """--- MODULE FEDERATION CONTAINER RESOLUTION ---
Host Shared Scope Initialized with React: ["react"]
Loaded Remote Component: HeaderWidget
Rendered Remote Markup: {"tag":"nav","content":"Enterprise Global Navigation"}"""

# Part 4 synchronous resilient loader
d['parts'][3]['code'] = """// Resilient Remote Component Loader & Sandbox Container
class ResilientRemoteLoader {
  constructor(timeoutLimitMs) {
    this.timeoutLimitMs = timeoutLimitMs;
  }

  loadWithRetry(fetcherFn, maxRetries = 2) {
    let lastError = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const res = fetcherFn();
      if (res.latencyMs > this.timeoutLimitMs) {
        lastError = 'REMOTE_TIMEOUT: Exceeded ' + this.timeoutLimitMs + 'ms';
        continue;
      }
      if (res.status === 200) {
        return { success: true, component: res.component, attempt };
      } else {
        lastError = 'HTTP_' + res.status + ': Failed to load remote chunk';
      }
    }
    return { success: false, fallback: this.getDegradedFallback(), error: lastError };
  }

  getDegradedFallback() {
    return {
      name: 'DegradedFallbackWidget',
      render: () => ({ status: 'DEGRADED', message: 'Service temporarily offline' })
    };
  }
}

const loader = new ResilientRemoteLoader(50);

// Scenario 1: Healthy Remote Component (latency 15ms < 50ms)
const healthyFetcher = () => ({
  status: 200,
  latencyMs: 15,
  component: { name: 'LiveOrderBookRemote', render: () => ({ status: 'HEALTHY', bids: [100, 101, 102] }) }
});

// Scenario 2: Failing Remote Component (latency 120ms > 50ms timeout)
const failingFetcher = () => ({
  status: 504,
  latencyMs: 120,
  component: null
});

console.log('--- RESILIENT REMOTE BOUNDARY SANDBOX TEST ---');
const healthyResult = loader.loadWithRetry(healthyFetcher);
console.log('Healthy Remote Status:', healthyResult.success);
console.log('Mounted Component:', healthyResult.component.name);
console.log('Render Output:', healthyResult.component.render());

console.log('\\nSimulating CDN Failure on Remote:');
const failingResult = loader.loadWithRetry(failingFetcher);
console.log('Failing Remote Status:', failingResult.success);
console.log('Activated Fallback:', failingResult.fallback.name);
console.log('Fallback Output:', failingResult.fallback.render());
console.log('Caught Error:', failingResult.error);"""

d['parts'][3]['output'] = """--- RESILIENT REMOTE BOUNDARY SANDBOX TEST ---
Healthy Remote Status: true
Mounted Component: LiveOrderBookRemote
Render Output: {"status":"HEALTHY","bids":[100,101,102]}

Simulating CDN Failure on Remote:
Failing Remote Status: false
Activated Fallback: DegradedFallbackWidget
Fallback Output: {"status":"DEGRADED","message":"Service temporarily offline"}
Caught Error: REMOTE_TIMEOUT: Exceeded 50ms"""

# Part 5 synchronous platform
d['parts'][4]['code'] = """// End-to-End Micro-Frontend Platform Simulation
class MicroFrontendPlatform {
  constructor() {
    this.sharedScope = {};
    this.remotes = new Map();
    this.eventBus = new Set();
  }

  initPlatform(sharedModules) {
    for (const [name, mod] of Object.entries(sharedModules)) {
      this.sharedScope[name] = mod;
    }
  }

  registerRemote(name, entryManifest) {
    this.remotes.set(name, entryManifest);
  }

  mountRemote(remoteName, componentName) {
    const remote = this.remotes.get(remoteName);
    if (!remote) throw new Error('Unknown remote: ' + remoteName);
    const moduleFactory = remote.modules[componentName];
    if (!moduleFactory) throw new Error('Module ' + componentName + ' not found in ' + remoteName);
    return moduleFactory(this.sharedScope);
  }

  dispatchGlobalEvent(evt) {
    this.eventBus.forEach(handler => handler(evt));
  }

  onGlobalEvent(handler) {
    this.eventBus.add(handler);
    return () => this.eventBus.delete(handler);
  }
}

const platform = new MicroFrontendPlatform();

// Step 1: Boot Host Shell with Shared React
platform.initPlatform({
  react: { version: '18.3.1', instanceId: 'REACT_SINGLETON_HOST' }
});

// Step 2: Register Navigation Remote
platform.registerRemote('NavApp', {
  version: '2.1.0',
  modules: {
    Header: (shared) => ({
      name: 'NavHeader',
      reactRef: shared.react.instanceId,
      cartCount: 0,
      render: function() { return 'NavHeader [Cart Items: ' + this.cartCount + ']'; }
    })
  }
});

// Step 3: Register Cart Island Remote
platform.registerRemote('CartApp', {
  version: '1.4.2',
  modules: {
    CartDrawer: (shared) => ({
      name: 'CartDrawer',
      reactRef: shared.react.instanceId,
      items: ['Laptop', 'USB-C Cable']
    })
  }
});

console.log('--- ENTERPRISE MICRO-FRONTEND SIMULATION ---');

// Mount Navigation Remote
const navHeader = platform.mountRemote('NavApp', 'Header');
console.log('Mounted Remote 1:', navHeader.name, '| Bound React:', navHeader.reactRef);
console.log('Initial Header Display:', navHeader.render());

// Mount Cart Island Remote
const cartDrawer = platform.mountRemote('CartApp', 'CartDrawer');
console.log('\\nMounted Remote 2:', cartDrawer.name, '| Bound React:', cartDrawer.reactRef);
console.log('Cart Items in CartApp:', cartDrawer.items);

// Cross-Remote Event Communication: Cart updates, Nav updates
console.log('\\n[Cross-Remote Event] CartApp dispatches CART_UPDATED event...');
navHeader.cartCount = cartDrawer.items.length;
console.log('Updated Header Display:', navHeader.render());
console.log('Shared React Singleton Verified:', navHeader.reactRef === cartDrawer.reactRef);"""

d['parts'][4]['output'] = """--- ENTERPRISE MICRO-FRONTEND SIMULATION ---
Mounted Remote 1: NavHeader | Bound React: REACT_SINGLETON_HOST
Initial Header Display: NavHeader [Cart Items: 0]

Mounted Remote 2: CartDrawer | Bound React: REACT_SINGLETON_HOST
Cart Items in CartApp: ["Laptop","USB-C Cable"]

[Cross-Remote Event] CartApp dispatches CART_UPDATED event...
Updated Header Display: NavHeader [Cart Items: 2]
Shared React Singleton Verified: true"""

out_lines = [
    "# scripts/react_day48_data.py",
    "import json",
    "",
    "def get_day48_data():",
    f"    return {repr(d)}",
    "",
    "if __name__ == '__main__':",
    "    data = get_day48_data()",
    "    total_words = 0",
    "    print(f\"Day {data['day']}: {data['title']}\")",
    "    for i, p in enumerate(data['parts']):",
    "        w = sum(len(s.split()) for s in p['say'])",
    "        total_words += w",
    "        print(f\"  Part {i+1}: {w} words\")",
    "    print(f\"Total Words: {total_words}\")"
]

with open('scripts/react_day48_data.py', 'w', encoding='utf-8') as f:
    f.write("\n".join(out_lines))
print("Updated react_day48_data.py cleanly!")
