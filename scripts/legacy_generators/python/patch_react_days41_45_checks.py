import json
import re

CHECKS_DATA = {
    41: [
        {
            "question": "What is the primary difference between traditional SSR and React Server Components regarding client bundle payloads?",
            "options": [
                "Server Components execute exclusively on the server and emit a serialized wire stream, sending 0 KB of component code or dependencies to the client bundle",
                "Server Components send their full JavaScript source code to the client for local execution",
                "Server Components only run on mobile web browsers",
                "Server Components replace CSS style sheets with JSON arrays"
            ],
            "answer": 0,
            "why": "RSC renders component trees on the server and streams serialized virtual DOM nodes, eliminating all component code and backend library dependencies from the client bundle."
        },
        {
            "question": "Why can a Server Component be passed as a child prop to a Client Component without entering the client bundle?",
            "options": [
                "Because the Server Component is executed on the server first, and only its serialized JSX output is passed as a child slot into the Client Component",
                "Because Client Components automatically transpile server code into WebAssembly",
                "Because React strips all child props before client hydration",
                "Because parent components always overwrite child components"
            ],
            "answer": 0,
            "why": "Composition allows Server Components to evaluate on the server and pass their rendered element slots to Client Components without leaking server dependencies into the client bundle."
        },
        {
            "question": "Why does moving a markdown parser to a Server Component eliminate the hydration cost on the client device?",
            "options": [
                "The heavy parser library executes exclusively on the server, outputting pure static HTML/JSX and adding 0 KB to client bundle and 0ms to client hydration",
                "The browser uses native C++ markdown parsers built into the HTML parser",
                "Markdown parsing is deferred until the user scrolls to the bottom of the page",
                "Hydration only runs for image tags"
            ],
            "answer": 0,
            "why": "Server Components offload expensive tokenization and transformation libraries to the server runtime, completely freeing the client browser from downloading or hydrating them."
        },
        {
            "question": 'What do the control characters \\"M\\" and \\"J\\" signify in the RSC wire protocol?',
            "options": [
                "'M' defines a Client Component module reference (chunk ID and export name), while 'J' defines a serialized UI element tree",
                "'M' stands for Memory allocation and 'J' stands for JavaScript minification",
                "'M' signifies Mutation events and 'J' signifies JSON database records",
                "'M' indicates Mobile viewport and 'J' indicates Java backend"
            ],
            "answer": 0,
            "why": "In the RSC wire protocol stream, 'M' declares client module boundary imports and 'J' describes virtual element hierarchies containing HTML tags and module references."
        },
        {
            "question": "How does the client deserializer reconstruct interactive event handlers without executing server component code?",
            "options": [
                "The client runtime matches 'M' client module references from the stream to local client bundles, instantiating interactive handlers only at declared client leaf nodes",
                "The server transmits compiled machine code via WebSockets",
                "The browser eval()s raw strings inside the HTML body",
                "All event handlers are stored in cookies"
            ],
            "answer": 0,
            "why": "The RSC runtime replaces Server Components with pure serialized element data and references Client Components via module chunks, hydrating interactivity only at client leaf boundaries."
        }
    ],
    42: [
        {
            "question": "Why does traditional renderToString cause high TTFB when a page contains slow data dependencies?",
            "options": [
                "renderToString is a synchronous, blocking call that must wait for all database queries and promises to resolve before flushing a single byte of HTML",
                "Because HTML files cannot be sent over TCP connections",
                "Because renderToString converts all HTML tags into JPEG images",
                "Because Node.js does not support string concatenation"
            ],
            "answer": 0,
            "why": "Monolithic renderToString blocks on the slowest database call, preventing the browser from receiving the HTML document head, stylesheets, or layouts."
        },
        {
            "question": "What role does the browser preload scanner play when the document head is flushed early?",
            "options": [
                "It discovers critical CSS, fonts, and JavaScript bundles in the early shell and begins downloading them immediately in parallel with server rendering",
                "It validates SQL database schema migrations",
                "It executes all React hooks before DOM construction",
                "It compresses HTML text using gzip on the client device"
            ],
            "answer": 0,
            "why": "Flushing the HTML shell early enables the browser preload scanner to fetch stylesheets and scripts over the network while the server streams deferred content."
        },
        {
            "question": "How does the $RC script find and replace the fallback content in the DOM?",
            "options": [
                "It uses document.getElementById to locate the fallback container ('B:0') and replaces it with the contents of the deferred template chunk ('S:0')",
                "It reloads the entire web page from scratch",
                "It deletes the entire DOM body and requests a new page",
                "It modifies the browser history state without updating the screen"
            ],
            "answer": 0,
            "why": "React's out-of-order streaming script ($RC) targets the placeholder boundary ID in the DOM and swaps in the rendered HTML nodes from the hidden template."
        },
        {
            "question": "Why can a server not change the HTTP status code from 200 to 500 after onShellReady has fired?",
            "options": [
                "Because HTTP response headers and status codes are transmitted in the first network packet; once flushed, headers cannot be modified",
                "Because HTTP protocol only permits status code 200",
                "Because React disables error handling after rendering starts",
                "Because browsers reject status codes other than 200"
            ],
            "answer": 0,
            "why": "Once the streaming shell flushes to the client, the HTTP header packet is committed on the wire; subsequent errors must be handled gracefully in downstream chunks."
        },
        {
            "question": "What are the four primary phases of the Streaming SSR pipeline?",
            "options": [
                "Early Shell Flush, Asynchronous Boundary Resolution, Deferred Chunk Streaming, and Client DOM Replacement ($RC)",
                "Compilation, Minification, Bundling, and Compression",
                "DNS Lookup, TCP Handshake, SSL Negotiation, and Page Render",
                "Component Mount, Component Update, Component Unmount, and Error Catch"
            ],
            "answer": 0,
            "why": "Streaming SSR flushes the layout shell, resolves Suspense boundaries in parallel, streams HTML chunks as they finish, and swaps templates into the DOM."
        }
    ],
    43: [
        {
            "question": 'What causes the \\"Hydration Uncanny Valley\\" in traditional single-page applications?',
            "options": [
                "The page appears visually complete due to SSR HTML, but buttons and inputs are completely unresponsive until the entire monolithic JavaScript bundle has downloaded and hydrated",
                "The screen turns black and white during hydration",
                "The browser battery level drops below 10%",
                "The HTML tags fail to render in alphabetical order"
            ],
            "answer": 0,
            "why": "Users see rendered interactive elements but their taps and clicks are ignored because the single-threaded client runtime is busy hydrating the whole component tree."
        },
        {
            "question": "How does React 18 hydrateRoot break up the monolithic component tree?",
            "options": [
                "It treats Suspense boundaries as isolated hydration islands, hydrating each sub-tree independently without blocking the rest of the page",
                "It converts all components into Web Workers",
                "It deletes all HTML elements and re-creates them from scratch",
                "It replaces JavaScript with CSS animations"
            ],
            "answer": 0,
            "why": "hydrateRoot decouples hydration across Suspense boundaries, allowing fast components to become interactive while slow components are still streaming or hydrating."
        },
        {
            "question": "What happens when a user clicks a button that has not yet finished hydrating in React 18?",
            "options": [
                "React intercepts the event during the capture phase, elevates that component's hydration to SyncLane, hydrates it immediately, and replays the original click event",
                "The browser discards the click and shows an alert dialog",
                "The page reloads from the server",
                "The button is permanently disabled"
            ],
            "answer": 0,
            "why": "Capture-phase event interception records user interactions on unhydrated islands, prioritizes their hydration, and replays the interaction seamlessly."
        },
        {
            "question": "Why does React defer below-the-fold component hydration to IdleLane?",
            "options": [
                "To prioritize main-thread execution time for immediately visible content and high-priority user interactions, maintaining 0ms Total Blocking Time",
                "Because below-the-fold components are deleted by the browser",
                "Because mobile screens cannot render HTML below 800 pixels",
                "Because IdleLane uses more CPU cores than SyncLane"
            ],
            "answer": 0,
            "why": "Hydrating offscreen content in IdleLane keeps the main UI thread free for user clicks, scrolling, and above-the-fold interactivity."
        },
        {
            "question": "How does priority promotion prevent dropped user clicks during progressive page hydration?",
            "options": [
                "When a click is detected on an unhydrated boundary, React bumps its priority from Default/Idle to SyncLane, pausing other tasks to hydrate and process that click immediately",
                "It stores clicks in localStorage for the next session",
                "It forces the user to double-click every button",
                "It converts clicks into touch events"
            ],
            "answer": 0,
            "why": "Priority promotion ensures that user intent directly re-orders hydration scheduling, preventing missed clicks and eliminating interaction lag."
        }
    ],
    44: [
        {
            "question": "What major friction points of traditional REST API mutations are eliminated by Server Actions?",
            "options": [
                "They eliminate manual fetch() endpoint boilerplate, separate API route handlers, manual request serializing, and disjointed client-side cache invalidation",
                "They remove the need for database storage",
                "They allow servers to run without electricity",
                "They turn all POST requests into GET requests"
            ],
            "answer": 0,
            "why": "Server Actions provide type-safe RPC functions invoked directly from JSX forms and event handlers, bridging client state and backend mutations seamlessly."
        },
        {
            "question": "How does progressive enhancement ensure that forms work even before JavaScript has finished hydrating?",
            "options": [
                "The form renders with a native HTML action attribute pointing to a server endpoint, allowing standard multi-page POST submissions if JS is unavailable or loading",
                "By embedding the entire Node.js runtime into the browser cache",
                "By executing form validations via CSS selectors",
                "By disabling the submit button until full hydration"
            ],
            "answer": 0,
            "why": "Native HTML <form action> allows browsers to submit forms via standard HTTP POST even if JavaScript is loading, disabled, or failed to download."
        },
        {
            "question": "What are the three values returned by the useActionState hook tuple?",
            "options": [
                "[state, formAction, isPending] representing the current mutation result, the wrapped dispatch action, and the pending transition state",
                "[data, loading, error]",
                "[value, setValue, resetValue]",
                "[request, response, next]"
            ],
            "answer": 0,
            "why": "useActionState returns the current action state, the enhanced action function for form binding, and a boolean indicating whether the server transition is pending."
        },
        {
            "question": "How does useOptimistic protect against UI desynchronization when a server mutation fails?",
            "options": [
                "It applies an immediate temporary projection to the UI during the transition and automatically rolls back to the authoritative server state if the action rejects",
                "It permanently overwrites the database with client values",
                "It shuts down the web server to prevent corrupt data",
                "It logs the user out of their session"
            ],
            "answer": 0,
            "why": "useOptimistic binds temporary state to the lifecycle of the transition; if the action throws or rejects, the optimistic projection is discarded automatically."
        },
        {
            "question": "What guarantees database transactional integrity during concurrent Server Action calls?",
            "options": [
                "Atomic database transactions (e.g. ACID transactions with rollback capabilities) paired with server-side optimistic concurrency checks",
                "Client-side localStorage locks",
                "Disabling concurrent network requests in the browser",
                "Using random sleep timers before writing to disk"
            ],
            "answer": 0,
            "why": "ACID transactions on the server ensure that inventory decrements and balance changes commit atomically or roll back completely without data corruption."
        }
    ],
    45: [
        {
            "question": "What are the four architectural building blocks of a modern hybrid RSC application?",
            "options": [
                "React Server Components (RSC), Streaming SSR with Suspense, Selective Hydration with event replay, and Server Actions with optimistic updates",
                "HTML, CSS, jQuery, and Apache",
                "Redux, MobX, Zustand, and Recoil",
                "Webpack, Babel, Gulp, and Grunt"
            ],
            "answer": 0,
            "why": "Milestone 8 combines RSC for zero bundle weight, Streaming SSR for sub-50ms TTFB, Selective Hydration for 0ms TBT, and Server Actions for atomic mutations."
        },
        {
            "question": "Why does compiling markdown on the server eliminate client bundle weight?",
            "options": [
                "The markdown parsing library and its syntax tokenizer execute strictly on the server and are never bundled or shipped to the browser",
                "Markdown files are smaller than HTML files",
                "Browsers have native markdown engines built into CSS",
                "The client downloads markdown files directly from GitHub"
            ],
            "answer": 0,
            "why": "Server Components execute backend dependencies on the server runtime, emitting only static virtual DOM nodes without leaking library code to client bundles."
        },
        {
            "question": "How does out-of-order streaming prevent slow reviews from blocking the product layout shell?",
            "options": [
                "The product layout shell flushes immediately with a Suspense fallback skeleton, while slow customer reviews stream in subsequent chunks and swap in via $RC scripts",
                "By discarding reviews that take longer than 10 milliseconds",
                "By rendering reviews only when the user refreshes the page",
                "By converting customer reviews into images"
            ],
            "answer": 0,
            "why": "Wrapping deferred components in Suspense allows the server to flush the main layout shell immediately and stream reviews asynchronously as data resolves."
        },
        {
            "question": "What safeguards are activated if a purchase action is submitted for an out-of-stock item?",
            "options": [
                "The server rejects the transaction, preventing inventory negative balances, and the client useOptimistic hook rolls back the optimistic UI state",
                "The server crashes and restarts",
                "The user's credit card is charged double",
                "The item is automatically ordered from an external competitor"
            ],
            "answer": 0,
            "why": "Atomic transaction checks reject the mutation on the server, and the transition boundary rolls back the optimistic cart count to the true server state."
        },
        {
            "question": "What five performance and architectural criteria are validated by the Milestone 8 audit suite?",
            "options": [
                "0ms Total Blocking Time (TBT), sub-100ms TTFB, zero client dependency leaks, out-of-order Suspense replacement, and zero-JS form fallbacks",
                "Color contrast, font size, page margins, line height, and image aspect ratio",
                "CPU clock speed, RAM usage, hard drive capacity, monitor refresh rate, and mouse DPI",
                "HTML validity, XML schema, CSS linting, TypeScript strictness, and ESLint warnings"
            ],
            "answer": 0,
            "why": "The Milestone 8 verification suite audits TBT, TTFB, bundle leakage, streaming template swapping, and progressive enhancement form fallbacks."
        }
    ]
}

def format_check(chk):
    lines = ["check: {"]
    lines.append(f'          question: {json.dumps(chk["question"])},')
    lines.append('          options: [')
    for opt in chk["options"]:
        lines.append(f'            {json.dumps(opt)},')
    lines[-1] = lines[-1].rstrip(',')
    lines.append('          ],')
    lines.append(f'          answer: {chk["answer"]},')
    lines.append(f'          why: {json.dumps(chk["why"])}')
    lines.append('        }')
    return "\n".join(lines)

def main():
    target_file = r"c:\Users\Admin\Desktop\projects\Present-Career-os\src\lib\data\reactLongLessons.ts"
    with open(target_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the split for days 41-45
    # Day 41 starts at '    day: 41,'
    day41_idx = content.find("    day: 41,")
    if day41_idx == -1:
        print("Day 41 not found!")
        return

    prefix = content[:day41_idx]
    block9 = content[day41_idx:]

    # For each day in 41..45, replace each check string with format_check
    for day in range(41, 46):
        chks = CHECKS_DATA[day]
        for part_idx, chk in enumerate(chks):
            q = chk["question"]
            pattern = re.compile(rf'check:\s*"{re.escape(q)}"')
            replacement = format_check(chk)
            match = pattern.search(block9)
            if match:
                block9 = pattern.sub(replacement, block9, count=1)
                print(f"Patched Day {day} Part {part_idx+1} check")
            else:
                print(f"FAILED to find check for Day {day} Part {part_idx+1}: {q}")

    # Now replace 'checklist: [' with 'steps: [' inside projectStep for days 41..45
    block9 = block9.replace("checklist: [", "steps: [")
    print("Replaced checklist with steps in projectStep")

    new_content = prefix + block9
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(new_content)

    print("Finished updating reactLongLessons.ts successfully!")

if __name__ == "__main__":
    main()
