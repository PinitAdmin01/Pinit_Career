export interface ConceptAnalogy {
  conceptId: string;
  title: string;
  analogy: string;
  realWorldUseCase: string;
  productionSnippet?: string;
}

export const CONCEPT_ANALOGIES_REGISTRY: Record<string, ConceptAnalogy> = {
  // 🐍 PYTHON CORE
  'python-functions': {
    conceptId: 'python-functions',
    title: 'Python Functions (`def`)',
    analogy: '🧑‍🍳 A Commercial Restaurant Chef with a Reusable Recipe. Instead of re-chopping ingredients and re-writing cooking steps for every customer, you write the recipe `def prepare_dish(order)` once, and call it instantly whenever a new order arrives!',
    realWorldUseCase: '🚀 Stripe Payment Webhook Handlers: Called automatically 50,000 times/sec whenever a customer clicks "Pay Now" on Shopify or Amazon.',
    productionSnippet: `def process_stripe_payment(order_id: str, amount_cents: int):\n    # Reusable function executed on every payment event\n    gateway_response = stripe.Charge.create(amount=amount_cents, currency="usd")\n    return gateway_response.status == "succeeded"`
  },
  'python-loops': {
    conceptId: 'python-loops',
    title: 'Python Iteration & Loops (`for` / `while`)',
    analogy: '🏭 An Automated Factory Conveyor Belt. Inspecting and processing thousands of package items one by one in precise sequence without human intervention.',
    realWorldUseCase: '🚀 Instagram Email Notification Pipeline: Iterating through 10,000 user profiles to send daily engagement summary digests.',
    productionSnippet: `for user in target_users:\n    if user.has_unread_notifications:\n        send_digest_email(user.email, user.unread_items)`
  },
  'python-dicts': {
    conceptId: 'python-dicts',
    title: 'Python Hash Maps & Dictionaries (`dict`)',
    analogy: '🔑 A Smart Locker Storage System. Instead of searching through every box in a warehouse, you use a unique barcode key to unlock your package instantly in O(1) time.',
    realWorldUseCase: '🚀 Redis Caching Layer in Uber: Looking up active driver GPS coordinates instantly using driver_id keys.',
    productionSnippet: `driver_locations = {"driver_101": (12.9716, 77.5946), "driver_102": (12.9352, 77.6245)}\nactive_coords = driver_locations.get("driver_101")`
  },
  'python-classes': {
    conceptId: 'python-classes',
    title: 'Python Object-Oriented Classes (`class`)',
    analogy: '🏗️ Architectural Blueprint Templates. The class is the master architectural drawing; each object created (`House()`) is an actual physical house built from that blueprint with customized colors.',
    realWorldUseCase: '🚀 Banking System Account Entities: Creating 1,000,000 distinct HDFC/ICICI user bank accounts from a single `BankAccount` class template.',
    productionSnippet: `class BankAccount:\n    def __init__(self, owner: str, balance: float):\n        self.owner = owner\n        self.balance = balance`
  },
  'python-async': {
    conceptId: 'python-async',
    title: 'Python AsyncIO & Event Loops (`async` / `await`)',
    analogy: '🍽️ A Pro Restaurant Waiter. Instead of standing idle at Table 1 waiting 15 minutes for the food to cook, the waiter takes orders from 10 tables simultaneously while the kitchen cooks!',
    realWorldUseCase: '🚀 FastAPI High-Concurrency Services: Handling 50,000 incoming HTTP requests/sec without blocking server threads.',
    productionSnippet: `async def fetch_user_dashboard(user_id: str):\n    profile, orders = await asyncio.gather(get_profile(user_id), get_orders(user_id))\n    return {"profile": profile, "orders": orders}`
  },

  // ☕ JAVA CORE
  'java-oop': {
    conceptId: 'java-oop',
    title: 'Java Object-Oriented Principles & Interfaces',
    analogy: '🔌 Standardized Universal USB-C Ports. Any device (phone, laptop, headphones) can plug in because they all follow the exact same interface contract.',
    realWorldUseCase: '🚀 Enterprise Payment Gateways: Switching between HDFC, ICICI, or Razorpay seamlessly using a single `PaymentProcessor` interface.',
    productionSnippet: `public interface PaymentProcessor {\n    boolean processTransaction(double amount);\n}`
  },
  'java-memory': {
    conceptId: 'java-memory',
    title: 'Java Stack vs Heap Memory Allocation',
    analogy: '📝 Desk Notepad (Stack) vs Warehouse Pallets (Heap). Quick scratch notes sit on your desk (Stack) and vanish when done. Heavy furniture is stored in the warehouse (Heap) and managed by the Garbage Collector.',
    realWorldUseCase: '🚀 High-Throughput Trading Engine (NSE/BSE): Preventing Java GC pauses by recycling heap objects in zero-allocation loops.',
    productionSnippet: `// Stack: primitive local variables (fast)\nint orderId = 98421;\n// Heap: persistent object references\nOrderTarget target = new OrderTarget("AAPL", 150.50);`
  },

  // ⚛️ REACT CORE
  'react-components': {
    conceptId: 'react-components',
    title: 'React Modular Components & Virtual DOM',
    analogy: '🧱 Reusable Modular Lego Blocks. Building complex skyscrapers by snapping together standard Lego bricks (`<Button />`, `<Card />`, `<Navbar />`).',
    realWorldUseCase: '🚀 Netflix Video Player UI: Rendering identical movie cards across desktop, mobile, and smart TVs.',
    productionSnippet: `export function MovieCard({ title, rating }: { title: string; rating: number }) {\n  return <div className="card"><h3>{title}</h3><span>⭐ {rating}</span></div>;\n}`
  },
  'react-hooks': {
    conceptId: 'react-hooks',
    title: 'React State & Lifecycle Hooks (`useState`, `useEffect`)',
    analogy: '🔋 Smart Electric Sockets & Internal Battery. `useState` is the phone memory saving your settings; `useEffect` is the automatic motion sensor light turning on when you enter the room.',
    realWorldUseCase: '🚀 Live Crypto Price Tickers (Binance/Coinbase): Subscribing to WebSocket feeds and updating component state in real time.',
    productionSnippet: `const [price, setPrice] = useState(0);\nuseEffect(() => {\n  const ws = connectCryptoStream(p => setPrice(p));\n  return () => ws.close();\n}, []);`
  },

  // 🧠 AI & MACHINE LEARNING
  'ml-neural-nets': {
    conceptId: 'ml-neural-nets',
    title: 'Neural Networks & PyTorch Tensors',
    analogy: '🧠 Human Biological Brain Synapses. Neurons fire signals through layers of weighted connections to learn patterns like recognizing handwritten digits or face IDs.',
    realWorldUseCase: '🚀 Tesla Autopilot Vision System: Processing 360-degree camera feeds at 60 FPS to detect pedestrians and lane boundaries.',
    productionSnippet: `import torch.nn as nn\nmodel = nn.Sequential(nn.Linear(784, 128), nn.ReLU(), nn.Linear(128, 10))`
  },
  'ml-rag-vector': {
    conceptId: 'ml-rag-vector',
    title: 'RAG Vector Embeddings & Similarity Search',
    analogy: '🗺️ A 3D Map of Human Knowledge. Similar concepts (e.g. "Cat" and "Kitten") sit close together in coordinate space like neighboring cities.',
    realWorldUseCase: '🚀 ChatGPT / Perplexity Document Search: Finding exact relevant paragraphs in a 500-page PDF manual in 20 milliseconds.',
    productionSnippet: `query_vector = embed("What is the refund policy?")\nrelevant_docs = vector_db.search(query_vector, top_k=3)`
  },

  // 💾 SQL & DATABASES
  'db-indexes': {
    conceptId: 'db-indexes',
    title: 'Database B-Tree Indexes',
    analogy: '📖 Encyclopedia Book Index. Looking up "Photosynthesis" in the back-of-the-book index in 5 seconds instead of reading all 1,000 pages page-by-page.',
    realWorldUseCase: '🚀 Amazon Order History Search: Executing `SELECT * FROM orders WHERE customer_id = 99` in 1ms across 500,000,000 order records.',
    productionSnippet: `CREATE INDEX idx_orders_customer_id ON orders(customer_id);`
  },
  'db-acid': {
    conceptId: 'db-acid',
    title: 'ACID Database Transactions',
    analogy: '🏧 Bank ATM Cash Withdrawal. Either the money is deducted from your balance AND cash is dispensed, or NEITHER happens (Atomicity). Money never vanishes into thin air.',
    realWorldUseCase: '🚀 Google Pay / PhonePe Balance Transfers: Ensuring zero double-spending or money loss during network drops.',
    productionSnippet: `BEGIN TRANSACTION;\nUPDATE account SET balance = balance - 500 WHERE id = 1;\nUPDATE account SET balance = balance + 500 WHERE id = 2;\nCOMMIT;`
  },

  // 🚀 CLOUD & DEVOPS
  'devops-docker': {
    conceptId: 'devops-docker',
    title: 'Docker Containers & Image Packaging',
    analogy: '🚢 Standardized Shipping Cargo Containers. Packing your application with all its tools, code, and OS libraries so it runs identically on Mac, Windows, AWS, or Linux.',
    realWorldUseCase: '🚀 Spotify Backend Microservices: Running 5,000 containerized services smoothly on Kubernetes clusters.',
    productionSnippet: `FROM python:3.12-slim\nWORKDIR /app\nCOPY . .\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0"]`
  },

  // 📈 BUSINESS, FINANCE & OPERATIONS (BCOM)
  'bcom-accounting': {
    conceptId: 'bcom-accounting',
    title: 'Double-Entry Bookkeeping & P&L Ledgers',
    analogy: '⚖️ A Balanced Precision Seesaw. For every credit entry on one side, there MUST be an equal debit entry on the opposite side to keep financial balance at 100%.',
    realWorldUseCase: '🚀 Corporate Quarterly Audit (Deloitte / EY): Verifying millions of rupee transactions for annual tax & SEC compliance.',
    productionSnippet: `// Debit: Cash Asset (+100,000) | Credit: Sales Revenue (+100,000)`
  },
  'bcom-supplychain': {
    conceptId: 'bcom-supplychain',
    title: 'Economic Order Quantity (EOQ) & Inventory Reorder',
    analogy: '🛒 Restaurant Fresh Grocery Restocking Schedule. Ordering exact milk inventory to never run out for coffee orders, while never ordering so much that milk spoils in the fridge.',
    realWorldUseCase: '🚀 Amazon Prime 1-Day Fulfillment Centers: Automatically triggering supplier purchase orders when inventory hits calculated safety thresholds.',
    productionSnippet: `EOQ = sqrt((2 * Annual_Demand * Setup_Cost) / Holding_Cost)`
  },
  'bcom-marketing': {
    conceptId: 'bcom-marketing',
    title: 'Customer Acquisition Cost (CAC) & LTV Ratio',
    analogy: '🎣 Fishing Net Efficiency. Calculating how much money you spent on fishing bait (Ad Spend) versus the total value of fish caught (Customer Lifetime Value).',
    realWorldUseCase: '🚀 Meta / Google Performance Marketing: Scaling ad campaigns when LTV:CAC ratio exceeds 3.0x profitability.',
    productionSnippet: `CAC = Total_Ad_Spend / New_Customers_Acquired`
  }
};
