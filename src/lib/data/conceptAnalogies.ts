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
  'java-concurrency': {
    conceptId: 'java-concurrency',
    title: 'Java Multi-Threading & Synchronization',
    analogy: '🚦 Single-Lane Mountain Tunnel with Traffic Signal Lights. When multiple cars (threads) arrive at a single-lane bridge (shared resource), the semaphore light ensures only one car crosses at a time to prevent collisions.',
    realWorldUseCase: '🚀 High-Traffic Flight Booking Systems: Preventing two travelers from booking the same airline seat simultaneously using synchronized lock primitives.',
    productionSnippet: `synchronized(seatLock) {\n    if (!seat.isBooked()) {\n        seat.book(userId);\n    }\n}`
  },

  // ⚛️ REACT & FRONTEND
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
  'frontend-event-loop': {
    conceptId: 'frontend-event-loop',
    title: 'JavaScript Browser Event Loop & Callbacks',
    analogy: '🎡 Fast-Food Drive-Through Order Window. The cashier takes your order immediately, hands you a receipt buzzer, and immediately serves the next car. When your burger is ready, the buzzer alerts you to pick it up.',
    realWorldUseCase: '🚀 Browser UI Responsiveness: Keeping web pages smooth at 60 FPS while background network requests fetch gigabytes of data.',
    productionSnippet: `console.log("Start");\nsetTimeout(() => console.log("Timer fired"), 0);\nconsole.log("End"); // Runs before timer callback!`
  },

  // 🔢 DATA STRUCTURES & ALGORITHMS
  'dsa-binary-search': {
    conceptId: 'dsa-binary-search',
    title: 'Binary Search & Logarithmic Time O(log N)',
    analogy: '📖 Splitting a Phone Directory in Half. To find "Taylor", you flip directly to the middle (M). Since T is after M, you instantly throw away the entire left half of the book, finding the name in 10 flips instead of 10,000 pages.',
    realWorldUseCase: '🚀 Git Bisect: Locating the exact bug-introducing commit out of 10,000 git commits in just 14 tests.',
    productionSnippet: `let low = 0, high = commits.length - 1;\nwhile (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    if (testCommit(commits[mid])) low = mid + 1;\n    else high = mid - 1;\n}`
  },
  'dsa-dynamic-programming': {
    conceptId: 'dsa-dynamic-programming',
    title: 'Dynamic Programming & Memoization',
    analogy: '📝 Writing 1+1+1 on a Notepad. If you write 1+1+1 on paper and ask someone what it is, they count "3". If you write "+1" at the end, they do not recount the first three; they remember "3" and immediately say "4".',
    realWorldUseCase: '🚀 Google Maps Routing: Reusing the shortest path between Chicago and Denver when calculating a journey from New York to San Francisco.',
    productionSnippet: `const cache = new Map();\nfunction fib(n) {\n    if (n <= 1) return n;\n    if (!cache.has(n)) cache.set(n, fib(n - 1) + fib(n - 2));\n    return cache.get(n);\n}`
  },
  'dsa-trees-graphs': {
    conceptId: 'dsa-trees-graphs',
    title: 'Graphs & Tree Traversals (BFS / DFS)',
    analogy: '🗺️ Subway Route Navigation System. Exploring neighboring metro stations tier by tier using a ripple wave (Breadth-First Search) to guarantee the route with the fewest transfers.',
    realWorldUseCase: '🚀 LinkedIn 2nd and 3rd Degree Connections: Finding friends-of-friends using Breadth-First Search across 900 million member profiles.',
    productionSnippet: `const queue = [startUser];\nwhile (queue.length) {\n    const curr = queue.shift();\n    for (const friend of curr.connections) {\n        if (!visited.has(friend)) { visited.add(friend); queue.push(friend); }\n    }\n}`
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
  'db-sharding': {
    conceptId: 'db-sharding',
    title: 'Database Sharding & Horizontal Partitioning',
    analogy: '🗄️ Splitting Phone Directories by Postal Code. Instead of keeping one gigantic book that collapses the bookshelf, the city prints 10 smaller regional booklets (Shards).',
    realWorldUseCase: '🚀 Slack Message Storage: Partitioning billions of chat messages by Workspace ID across thousands of database clusters.',
    productionSnippet: `const shardId = hash(workspaceId) % TOTAL_SHARDS;\nconst dbConnection = getShardPool(shardId);`
  },

  // 🌐 SYSTEMS & CONCURRENCY
  'sys-deadlocks': {
    conceptId: 'sys-deadlocks',
    title: 'Deadlocks & Circular Wait Conditions',
    analogy: '🚗 Four Cars Arriving Simultaneously at a 4-Way Stop. Car A waits for Car B, Car B waits for Car C, Car C waits for Car D, and Car D waits for Car A. No car moves forward until someone backs up.',
    realWorldUseCase: '🚀 High-Volume Bank Transfers: Enforcing strict alphabetical account ID lock ordering to prevent transfer deadlocks between Account 1 and Account 2.',
    productionSnippet: `// Deadlock-free lock acquisition order:\nconst [firstLock, secondLock] = accA.id < accB.id ? [accA, accB] : [accB, accA];\nacquire(firstLock);\nacquire(secondLock);`
  },
  'sys-virtual-memory': {
    conceptId: 'sys-virtual-memory',
    title: 'Virtual Memory & Paging',
    analogy: '📚 Study Desk (RAM) vs Library Book Stacks (SSD). Your desk only holds 4 open textbooks at a time. When you need a 5th textbook, you swap the least recently used book back onto the library shelf.',
    realWorldUseCase: '🚀 Linux OS Kernel Memory Management: Allowing an 8GB RAM computer to smoothly run 40 applications totaling 32GB of virtual memory address space.',
    productionSnippet: `# OS page faults trigger swapped page retrieval from swap file into physical RAM`
  },

  // 🚀 CLOUD & DEVOPS
  'devops-docker': {
    conceptId: 'devops-docker',
    title: 'Docker Containers & Image Packaging',
    analogy: '🚢 Standardized Shipping Cargo Containers. Packing your application with all its tools, code, and OS libraries so it runs identically on Mac, Windows, AWS, or Linux.',
    realWorldUseCase: '🚀 Spotify Backend Microservices: Running 5,000 containerized services smoothly on Kubernetes clusters.',
    productionSnippet: `FROM python:3.12-slim\nWORKDIR /app\nCOPY . .\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0"]`
  },
  'devops-ci-cd': {
    conceptId: 'devops-ci-cd',
    title: 'CI/CD Automated Deployment Pipelines',
    analogy: '🧪 Automobile Quality Crash-Testing Assembly Line. Before any new vehicle model is allowed on public highways, automated robotic rigs crash test brakes, airbags, and engines in minutes.',
    realWorldUseCase: '🚀 GitHub Actions Deployment: Automatically verifying 500 unit tests on every pull request before shipping code to production servers.',
    productionSnippet: `name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm test`
  },
  'cloud-autoscaling': {
    conceptId: 'cloud-autoscaling',
    title: 'Cloud Auto-Scaling Groups & Load Balancers',
    analogy: '🎟️ Highway Toll Booth Gates during Rush Hour. On Sunday night when traffic surges 10x, the highway authority opens 10 additional toll booths in parallel, closing them when traffic calms.',
    realWorldUseCase: '🚀 Hotstar / Disney+ Cricket Streaming: Automatically spinning up 20,000 EC2 instances during the final overs of an IPL championship match.',
    productionSnippet: `aws autoscaling set-desired-capacity --auto-scaling-group-name api-asg --desired-capacity 20`
  },

  // 🛡️ CYBERSECURITY
  'sec-zero-trust': {
    conceptId: 'sec-zero-trust',
    title: 'Zero-Trust Architecture & Token Authentication',
    analogy: '🏢 High-Security Pentagon Badge Scanners at Every Door. Having a badge to enter the front lobby does not let you enter the server room; every single interior room scans your badge again.',
    realWorldUseCase: '🚀 Microservice Service Mesh: Authenticating every inter-service gRPC API call using cryptographic JWT / mTLS tokens.',
    productionSnippet: `const token = req.headers.authorization?.split(" ")[1];\nconst payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });`
  },
  'sec-sql-injection': {
    conceptId: 'sec-sql-injection',
    title: 'SQL Injection & Prepared Statements',
    analogy: '🏦 Bank Cashier with Separate Deposit Slip Forms. A robber writing "Give me all money" on a blank check does not make the teller give up the vault, because checks only have fields for numbers and signatures.',
    realWorldUseCase: '🚀 E-commerce Checkout Defense: Parameterizing user input so malicious input like `\' OR 1=1 --` is treated as literal text instead of executable SQL code.',
    productionSnippet: `// Parameterized query isolates data from SQL instructions:\nawait db.query("SELECT * FROM users WHERE email = $1", [userEmail]);`
  },

  // 🧠 AI, ML & NLP
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
  'ml-transformer-attention': {
    conceptId: 'ml-transformer-attention',
    title: 'Transformer Multi-Head Self-Attention',
    analogy: '🔦 Highlighting Reading Glasses. In the sentence "The bank was slippery because of the river", attention highlights the word "river" to understand "bank" means a riverbank, not a financial vault.',
    realWorldUseCase: '🚀 Modern Large Language Models (GPT-4 / Claude / Gemini): Understanding contextual nuance across thousands of words simultaneously.',
    productionSnippet: `attention_scores = softmax(Q @ K.T / sqrt(d_k)) @ V`
  },
  'ml-prompt-engineering': {
    conceptId: 'ml-prompt-engineering',
    title: 'Prompt Engineering & System Personas',
    analogy: '📋 Executive Briefing Memo for a World-Class Consultant. If you say "Fix my business", you get generic fluff. If you provide specific role, context, constraints, and target JSON output, you get actionable corporate strategy.',
    realWorldUseCase: '🚀 Enterprise Financial Document Extraction: Parsing unstructured PDF balance sheets into standardized JSON with zero hallucinations.',
    productionSnippet: `System: "You are a chartered accountant. Extract total revenues and EBITDA into JSON matching schema { revenue: number, ebitda: number }."`
  },

  // 🔌 EMBEDDED & IOT
  'iot-microcontroller': {
    conceptId: 'iot-microcontroller',
    title: 'Microcontroller Registers & Interrupts',
    analogy: '🚨 Fire Alarm Wall Pull Station. The building occupants do not continuously stare at the ceiling sensor 24/7. When smoke trips the alarm, an Interrupt immediately pauses current activity to initiate evacuation.',
    realWorldUseCase: '🚀 Automotive Airbag Controllers: Triggering airbag deployment within 15 milliseconds of an accelerometer crash interrupt.',
    productionSnippet: `void IRAM_ATTR onCrashSensorInterrupt() {\n    deploy_airbag_charge();\n}`
  },

  // 🔮 3D GRAPHICS
  'graphics-shaders': {
    conceptId: 'graphics-shaders',
    title: '3D Shaders & GPU Parallelism',
    analogy: '🎨 10,000 Miniature Painters Working Simultaneously. Instead of one master painter coloring a 4K canvas pixel-by-pixel (CPU), 10,000 tiny painters each calculate one pixel color at the exact same instant (GPU).',
    realWorldUseCase: '🚀 Unreal Engine / WebGL 3D Games: Rendering real-time water reflections and sunlight glints at 120 frames per second.',
    productionSnippet: `void main() {\n    gl_FragColor = vec4(ambientLight * surfaceColor, 1.0);\n}`
  },

  // 🪙 BLOCKCHAIN
  'web3-smart-contracts': {
    conceptId: 'web3-smart-contracts',
    title: 'Smart Contracts & Gas Limits',
    analogy: '🤖 A Mechanical Vending Machine. You insert ₹20 (Gas & Payment) and press B4. The machine drops the soda automatically via mechanical gears. No human clerk can accept your money and refuse the soda.',
    realWorldUseCase: '🚀 Decentralized Finance (Uniswap / Aave): Swapping digital assets or earning loan interest without intermediary bank brokers.',
    productionSnippet: `function swapTokens(uint amountIn) external {\n    require(amountIn > 0, "Zero deposit");\n    transferOut(calculateQuote(amountIn));\n}`
  },

  // 📈 QUANTITATIVE FINANCE
  'quant-order-book': {
    conceptId: 'quant-order-book',
    title: 'Limit Order Book (LOB) & Market Microstructure',
    analogy: '⚖️ High-Speed Double-Auction Ladder. Buyers stand on the left shouting maximum purchase bids, sellers stand on the right shouting minimum ask prices. When prices cross, the matching engine executes trades in nanoseconds.',
    realWorldUseCase: '🚀 Stock Exchange Engines (NSE, NASDAQ): Processing 1,000,000 order cancellations and matching executions per second.',
    productionSnippet: `if (incomingBuyOrder.price >= lowestAsk.price) {\n    executeTrade(incomingBuyOrder, lowestAsk);\n}`
  },

  // 📊 BUSINESS, FINANCE & OPERATIONS (BCOM)
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
  },
  'bcom-working-capital': {
    conceptId: 'bcom-working-capital',
    title: 'Working Capital & Liquidity Management',
    analogy: '🩸 Blood Circulation in the Human Body. A business can have massive muscles (fixed assets like buildings and factories), but if blood (cash flow) stops circulating through the veins, the body collapses.',
    realWorldUseCase: '🚀 CFO Cash Flow Strategy: Ensuring the company has sufficient current assets to cover payroll and supplier invoices during seasonal sales lulls.',
    productionSnippet: `Working_Capital = Current_Assets - Current_Liabilities`
  },
  'bcom-sales-pipeline': {
    conceptId: 'bcom-sales-pipeline',
    title: 'B2B Sales Velocity & MEDDIC Qualification',
    analogy: '🔍 Gold Prospector Sifting Pan. Pouring hundreds of river rocks (raw leads) into the pan, washing away gravel (unqualified prospects), and keeping only pure gold nuggets (economic decision-makers with confirmed budgets).',
    realWorldUseCase: '🚀 Enterprise Software Sales (Salesforce / SAP): Forecasting annual enterprise ARR closures based on stage-weighted pipeline velocity.',
    productionSnippet: `Pipeline_Velocity = (Qualified_Deals * Win_Rate * Average_Deal_Size) / Sales_Cycle_Days`
  },

  // 🐙 GIT & VERSION CONTROL
  'git-dag': {
    conceptId: 'git-dag',
    title: 'Git Directed Acyclic Graph (DAG) & Snapshots',
    analogy: '📸 Parallel Multiverse Film Strips. Each commit is an immutable photograph of your entire project. Branches are alternate universes where you experiment freely, rebasing them back onto the main film timeline.',
    realWorldUseCase: '🚀 Team Collaboration across 500 Engineers: Merging independent features daily without stepping on each other code.',
    productionSnippet: `git checkout -b feature/auth\ngit add -A\ngit commit -m "feat: oauth2 login"\ngit rebase main`
  },

  // 📊 EXCEL & DATA ANALYSIS
  'excel-formulas': {
    conceptId: 'excel-formulas',
    title: 'Excel Dynamic Arrays & Lookups (XLOOKUP)',
    analogy: '🎛️ Digital Soundboard Mixing Faders. Turning a master volume dial (input cell) instantly updates 50 connected instrument channels across the stadium without manual rewiring.',
    realWorldUseCase: '🚀 Financial Modeling & Valuations: Instantly recalculating company NPV and projected revenue when interest rate assumptions shift by 0.5%.',
    productionSnippet: `=XLOOKUP(employee_id, staff_ids, salaries, "Not Found", 0)`
  },

  // 🗣️ COMMUNICATION & CAREER
  'soft-skills-star': {
    conceptId: 'soft-skills-star',
    title: 'The STAR Behavioral Interview Method',
    analogy: '🎬 Hollywood Action Movie Trailer. Situation sets the world, Task introduces the ticking bomb, Action shows the protagonist heroics, and Result reveals the triumphant climax with fireworks.',
    realWorldUseCase: '🚀 Executive Job Interviews at Google / Microsoft: Convincingly communicating high-stakes engineering leadership decisions in under 2 minutes.',
    productionSnippet: `STAR: Situation (Context) -> Task (Challenge) -> Action (My decisions) -> Result (Quantified impact)`
  }
};

/**
 * Intelligent concept analogy finder matching topics, keywords, or course domains
 * without falling back to a hardcoded generic concept.
 */
export function findConceptAnalogy(topic: string, courseId?: string): ConceptAnalogy {
  const t = (topic || '').toLowerCase();
  const c = (courseId || '').toLowerCase();

  // 1. Precise Domain & Multi-Word Matches First
  if (t.includes('b-tree') || t.includes('btree') || t.includes('index') || t.includes('database query')) return CONCEPT_ANALOGIES_REGISTRY['db-indexes'];
  if (t.includes('attention') || t.includes('transformer') || t.includes('bert') || t.includes('gpt') || t.includes('nlp')) return CONCEPT_ANALOGIES_REGISTRY['ml-transformer-attention'];
  if (t.includes('inventory') || t.includes('supply chain') || t.includes('eoq') || t.includes('procure') || t.includes('logistics')) return CONCEPT_ANALOGIES_REGISTRY['bcom-supplychain'];
  if (t.includes('order book') || t.includes('lob') || t.includes('trading') || t.includes('quantitative') || t.includes('vwap') || t.includes('slippage')) return CONCEPT_ANALOGIES_REGISTRY['quant-order-book'];
  if (t.includes('autoscal') || t.includes('auto-scal') || t.includes('auto scale') || t.includes('load balanc')) return CONCEPT_ANALOGIES_REGISTRY['cloud-autoscaling'];

  // 2. Topic Keyword Matches
  if (t.includes('loop') || t.includes('iterat') || t.includes('while') || t.includes('for ')) return CONCEPT_ANALOGIES_REGISTRY['python-loops'];
  if (t.includes('dict') || t.includes('hash') || t.includes('map') || t.includes('key-value')) return CONCEPT_ANALOGIES_REGISTRY['python-dicts'];
  if (t.includes('class') || t.includes('oop') || t.includes('object') || t.includes('encapsulat')) return CONCEPT_ANALOGIES_REGISTRY['python-classes'];
  if (t.includes('async') || t.includes('await') || t.includes('event loop') || t.includes('promise')) return CONCEPT_ANALOGIES_REGISTRY['python-async'];
  if (t.includes('interface') || t.includes('polymorph') || t.includes('abstract')) return CONCEPT_ANALOGIES_REGISTRY['java-oop'];
  if (t.includes('memory') || t.includes('stack') || t.includes('heap') || t.includes('garbage')) return CONCEPT_ANALOGIES_REGISTRY['java-memory'];
  if (t.includes('thread') || t.includes('concurr') || t.includes('lock') || t.includes('mutex') || t.includes('deadlock')) return CONCEPT_ANALOGIES_REGISTRY['sys-deadlocks'];
  if (t.includes('component') || t.includes('jsx') || t.includes('vdom') || t.includes('virtual dom')) return CONCEPT_ANALOGIES_REGISTRY['react-components'];
  if (t.includes('hook') || t.includes('state') || t.includes('useeffect') || t.includes('usestate')) return CONCEPT_ANALOGIES_REGISTRY['react-hooks'];
  if (t.includes('binary search') || t.includes('search') || t.includes('big-o') || t.includes('complexity')) return CONCEPT_ANALOGIES_REGISTRY['dsa-binary-search'];
  if (t.includes('dynamic program') || t.includes('memoiz') || t.includes('dp')) return CONCEPT_ANALOGIES_REGISTRY['dsa-dynamic-programming'];
  if (t.includes('tree') || t.includes('graph') || t.includes('bfs') || t.includes('dfs') || t.includes('travers')) return CONCEPT_ANALOGIES_REGISTRY['dsa-trees-graphs'];
  if (t.includes('acid') || t.includes('transaction') || t.includes('commit') || t.includes('rollback')) return CONCEPT_ANALOGIES_REGISTRY['db-acid'];
  if (t.includes('shard') || t.includes('partition') || t.includes('replicat')) return CONCEPT_ANALOGIES_REGISTRY['db-sharding'];
  if (t.includes('docker') || t.includes('container') || t.includes('image')) return CONCEPT_ANALOGIES_REGISTRY['devops-docker'];
  if (t.includes('ci/cd') || t.includes('pipeline') || t.includes('action') || t.includes('deploy')) return CONCEPT_ANALOGIES_REGISTRY['devops-ci-cd'];
  if (t.includes('security') || t.includes('zero-trust') || t.includes('jwt') || t.includes('auth')) return CONCEPT_ANALOGIES_REGISTRY['sec-zero-trust'];
  if (t.includes('sql injection') || t.includes('sqli') || t.includes('prepared') || t.includes('xss')) return CONCEPT_ANALOGIES_REGISTRY['sec-sql-injection'];
  if (t.includes('neural') || t.includes('pytorch') || t.includes('tensor') || t.includes('deep learn')) return CONCEPT_ANALOGIES_REGISTRY['ml-neural-nets'];
  if (t.includes('rag') || t.includes('vector') || t.includes('embed') || t.includes('similar')) return CONCEPT_ANALOGIES_REGISTRY['ml-rag-vector'];
  if (t.includes('prompt') || t.includes('few-shot') || t.includes('cot') || t.includes('chain-of-thought')) return CONCEPT_ANALOGIES_REGISTRY['ml-prompt-engineering'];
  if (t.includes('sensor') || t.includes('microcontroller') || t.includes('embedded') || t.includes('gpio') || t.includes('iot')) return CONCEPT_ANALOGIES_REGISTRY['iot-microcontroller'];
  if (t.includes('3d') || t.includes('shader') || t.includes('webgl') || t.includes('mesh') || t.includes('render')) return CONCEPT_ANALOGIES_REGISTRY['graphics-shaders'];
  if (t.includes('blockchain') || t.includes('smart contract') || t.includes('solidity') || t.includes('web3')) return CONCEPT_ANALOGIES_REGISTRY['web3-smart-contracts'];
  if (t.includes('accounting') || t.includes('debit') || t.includes('credit') || t.includes('gst') || t.includes('ledger') || t.includes('tax')) return CONCEPT_ANALOGIES_REGISTRY['bcom-accounting'];
  if (t.includes('marketing') || t.includes('cac') || t.includes('roas') || t.includes('brand') || t.includes('seo')) return CONCEPT_ANALOGIES_REGISTRY['bcom-marketing'];
  if (t.includes('working capital') || t.includes('liquidity') || t.includes('cash flow') || t.includes('finance') || t.includes('wacc') || t.includes('npv')) return CONCEPT_ANALOGIES_REGISTRY['bcom-working-capital'];
  if (t.includes('sales') || t.includes('crm') || t.includes('bant') || t.includes('customer success') || t.includes('pipeline')) return CONCEPT_ANALOGIES_REGISTRY['bcom-sales-pipeline'];
  if (t.includes('git') || t.includes('commit') || t.includes('branch') || t.includes('merge') || t.includes('rebase')) return CONCEPT_ANALOGIES_REGISTRY['git-dag'];
  if (t.includes('excel') || t.includes('pivot') || t.includes('xlookup') || t.includes('vlookup') || t.includes('formula')) return CONCEPT_ANALOGIES_REGISTRY['excel-formulas'];
  if (t.includes('interview') || t.includes('communication') || t.includes('star') || t.includes('soft skill')) return CONCEPT_ANALOGIES_REGISTRY['soft-skills-star'];

  // 2. Course ID Category Fallbacks
  if (c.includes('accounting') || c.includes('tax')) return CONCEPT_ANALOGIES_REGISTRY['bcom-accounting'];
  if (c.includes('finance') || c.includes('invest')) return CONCEPT_ANALOGIES_REGISTRY['bcom-working-capital'];
  if (c.includes('marketing')) return CONCEPT_ANALOGIES_REGISTRY['bcom-marketing'];
  if (c.includes('sales') || c.includes('crm')) return CONCEPT_ANALOGIES_REGISTRY['bcom-sales-pipeline'];
  if (c.includes('operations') || c.includes('supplychain')) return CONCEPT_ANALOGIES_REGISTRY['bcom-supplychain'];
  if (c.includes('analytics') || c.includes('excel')) return CONCEPT_ANALOGIES_REGISTRY['excel-formulas'];
  if (c.includes('git')) return CONCEPT_ANALOGIES_REGISTRY['git-dag'];
  if (c.includes('softskills') || c.includes('interview')) return CONCEPT_ANALOGIES_REGISTRY['soft-skills-star'];
  if (c.includes('dsa')) return CONCEPT_ANALOGIES_REGISTRY['dsa-binary-search'];
  if (c.includes('database')) return CONCEPT_ANALOGIES_REGISTRY['db-indexes'];
  if (c.includes('devops') || c.includes('cloud')) return CONCEPT_ANALOGIES_REGISTRY['devops-docker'];
  if (c.includes('cyber')) return CONCEPT_ANALOGIES_REGISTRY['sec-zero-trust'];
  if (c.includes('ai') || c.includes('nlp')) return CONCEPT_ANALOGIES_REGISTRY['ml-rag-vector'];
  if (c.includes('iot')) return CONCEPT_ANALOGIES_REGISTRY['iot-microcontroller'];
  if (c.includes('3d') || c.includes('graphics')) return CONCEPT_ANALOGIES_REGISTRY['graphics-shaders'];
  if (c.includes('blockchain')) return CONCEPT_ANALOGIES_REGISTRY['web3-smart-contracts'];
  if (c.includes('quant')) return CONCEPT_ANALOGIES_REGISTRY['quant-order-book'];
  if (c.includes('react') || c.includes('frontend')) return CONCEPT_ANALOGIES_REGISTRY['react-components'];
  if (c.includes('java')) return CONCEPT_ANALOGIES_REGISTRY['java-oop'];

  // 3. General Default
  return CONCEPT_ANALOGIES_REGISTRY['python-functions'];
}
