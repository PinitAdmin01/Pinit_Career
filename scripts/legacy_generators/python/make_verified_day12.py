# scripts/make_verified_day12.py
import os
import sys
import json
import hashlib

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

DAY = 12
TITLE = "Digital Productivity & Advanced Keyboard Shortcuts: Touch Typing, Window Management & OS Ergonomics"
GOAL = "Master professional keyboard ergonomics, high-velocity touch typing mechanics, operating system window tiling, terminal command-line navigation shortcuts, and multi-cursor productivity patterns to eliminate mouse dependency and achieve maximum developer velocity."
MINUTES = 45
RECAP = "In Day 11, we explored browser internals, the Critical Rendering Path, and DevTools network waterfalls. Today in Day 12, we shift focus to the human-computer interface and digital engineering productivity: mastering touch typing mechanics, operating system window management, terminal readline shortcuts, and keyboard-driven developer ergonomics."

p1_say = [
    "Welcome to Day 12 of Computer Fundamentals and Systems Architecture. Today, we step into a dimension that directly dictates your daily engineering throughput, cognitive stamina, and physical career longevity: Digital Productivity, Advanced Keyboard Shortcuts, Touch Typing Kinetics, Operating System Ergonomics, and Terminal Command-Line Velocity. While algorithmic comprehension, system design principles, and software architectural patterns dictate what you build, keyboard velocity and kinetic muscle memory dictate the speed and fluid fidelity at which architectural ideas transform into compiled, tested, and deployed production software.",
    "At the bedrock of high-velocity computer interaction lies Touch Typing and Home Row Kinetics. The human hands possess an extraordinary density of sensory nerve endings and fine-motor neuromuscular pathways capable of typing complex technical prose and source code at speeds exceeding 80 to 120 words per minute without requiring visual feedback from the physical keyboard. Traditional hunt-and-peck typists look down at the keyboard to locate keys visually, which forces a continuous, exhausting cognitive context switch in the brain: the engineer's eyes dart incessantly between the display screen and the physical plastic keycaps. This constant visual oscillation degrades cognitive working memory, interrupts sustained problem-solving flow, and induces chronic cervical neck strain and muscular tension.",
    "Touch typing eliminates this cognitive friction by anchoring the left hand on the 'ASDF' keys and the right hand on the 'JKL;' keys—designated universally as the Home Row. Modern computer keyboards feature physical raised tactile bumps or ridges on the 'F' and 'J' keycaps, allowing an engineer to index their index fingers blindly by tactile sensation alone. Each individual finger is assigned a dedicated vertical and diagonal column of keys: the index fingers govern central columns (R, T, F, G, V, B for the left; Y, U, H, J, N, M for the right), the middle fingers govern D, E, C and K, I, comma, the ring fingers govern S, W, X and L, O, period, and the pinky fingers govern perimeter keys and vital modifier keys (Shift, Ctrl, Alt, CapsLock, Tab, Enter, Backspace), while the thumbs rest naturally over the Space bar. By establishing fixed geometric spatial zones for each digit, the brain offloads physical key location lookups from the conscious cerebral cortex to the autonomic cerebellar motor memory.",
    "Beyond typing standard English prose, software engineering relies heavily on High-Frequency Technical Symbol Clusters: curly braces `{}`, square brackets `[]`, angle brackets `<>`, parentheses `()`, semicolons `;`, colons `:`, forward slashes `/`, backslashes `\\`, pipes `|`, tildes `~`, backticks `` ` ``, ampersands `&`, asterisks `*`, and dollar signs `$`. Standard touch typing curricula frequently neglect these coding symbols, leading to awkward, strained finger contortions. Elite developers master chorded modifier keystrokes (such as pressing Right-Shift with the right pinky while striking an opening brace or parenthesis with the left ring or middle finger) rather than contorting a single hand to press Shift and a symbol simultaneously. This bilateral chording distributes kinetic force evenly across both wrists and hands, preventing Repetitive Strain Injury (RSI), tendonitis, and carpal tunnel inflammation.",
    "Ergonomic mechanical keyboards further optimize kinetic efficiency and physiological alignment. Traditional staggered keyboard layouts—where rows of keys are shifted horizontally relative to one another—are an obsolete legacy artifact of 19th-century mechanical typewriters designed to prevent physical mechanical levers from jamming. Modern ergonomic keyboards adopt Columnar or Ortholinear key layouts, aligning keys in straight vertical columns that match the natural anatomical flexion and extension of human fingers. Split mechanical keyboards allow the two halves of the keyboard to be positioned at shoulder width and angled outward (tenting), keeping the wrists in a neutral, un-pronated posture that prevents ulnar deviation and median nerve compression.",
    "Customizable keyboard firmware (such as open-source QMK, VIA, or ZMK) empowers engineers to reprogram keyboard hardware at the microcontroller layer. A transformative productivity configuration is remapping the largely redundant CapsLock key—which occupies prime real estate directly under the resting position of the left pinky—to function as a dual-role Control/Escape key: emitting an Escape character when tapped quickly (essential for modal Vim navigation), and acting as the Control modifier when held down in combination with other keys. Similarly, mapping navigation layers to home row keys allows developers to access arrow keys, PageUp, PageDown, Home, and End directly from the home row without moving their hands across the desk.",
    "Measuring typing velocity and efficiency involves two critical industry metrics: Gross Words Per Minute (GWPM) and Net Words Per Minute (NWPM). By international typographical standard, one 'word' is defined as exactly 5 keystrokes (including alphanumeric characters, punctuation marks, and spaces). Gross WPM measures total keystrokes divided by 5 per minute, whereas Net WPM deducts penalties for uncorrected errors. In software development, accuracy is vastly more critical than raw brute speed: making a single syntax error in a command or code file requires pressing backspace multiple times or navigating back through code lines, costing ten times more time than striking the correct key initially.",
    "In this opening section, we construct an ergonomic keystroke velocity and accuracy analysis engine in the shell. We simulate gross versus net WPM calculation, evaluate error penalty costs, and measure home row indexing efficiency."
]

p2_say = [
    "In our second operational tier of Day 12, we examine Operating System Window Management, Virtual Desktops, and Tiling Window Managers. A major source of cognitive friction, mental fatigue, and productivity loss in software engineering is 'Window Clutter'—having dozens of overlapping browser windows, terminal sessions, documentation tabs, database consoles, and chat clients scattered haphazardly across the screen, requiring constant mouse clicking and alt-tab hunting to locate desired windows.",
    "Professional desktop environments provide sophisticated Window Orchestration primitives: 1. Snapping and Split Screen: Splitting display real estate into geometric quadrants or side-by-side halves (Windows Snap: Win+Left/Right/Up/Down; macOS Tile: Ctrl+Cmd+F; Linux: Super+Arrow keys); 2. Virtual Desktops (Workspaces): Logical full-screen display spaces that allow engineers to segregate unrelated workflows (e.g., Workspace 1 for IDE and compiler, Workspace 2 for Web Browser and API docs, Workspace 3 for Slack/Email communications); and 3. Application Switchers: Fast modal switching (Alt+Tab / Cmd+Tab) and direct workspace jumps (Super+1, Super+2, Super+3).",
    "Power users and software engineers frequently adopt Tiling Window Managers (such as i3wm, Sway, bspwm, or macOS aerospace/yabai). Unlike traditional floating window managers where windows overlap like sheets of paper on a cluttered desk, a tiling window manager organizes windows into a non-overlapping geometric tree (binary space partitioning). Every newly spawned terminal or editor automatically splits the active tile, maximizing usable screen real estate and allowing seamless navigation entirely via keyboard chording (Super+H/J/K/L).",
    "Furthermore, multi-monitor ergonomics demand disciplined display topology. The primary display should sit directly in front of the engineer's natural line of sight at eye level, reserved for high-focus deep work (the primary IDE or terminal session). Secondary monitors placed to the side should hold reference materials (documentation, architectural diagrams, monitoring dashboards) to prevent constant neck turning during deep coding sessions.",
    "Window management also intersects with system resource usage. Each running graphical application maintains its own window surface buffers composited by the OS Display Server (X11, Wayland, or Windows DWM). Minimizing or assigning inactive background applications to dedicated virtual desktops allows the display server to suspend unnecessary paint passes, reducing GPU memory bandwidth and preserving laptop battery life during intensive compile cycles.",
    "A well-structured virtual workspace configuration typically implements strict domain partitioning: Workspace 1 for Primary Source Code Editing (IDE/Vim), Workspace 2 for Local Application Runtime & Web Testing (Browser/DevTools), Workspace 3 for Build Systems, Database Terminals & Shell CLI, Workspace 4 for Version Control & Git Diffs, and Workspace 5 for Asynchronous Communications (Slack/Email). Assigning dedicated keyboard shortcuts (e.g. Super+1 through Super+5) to switch between these workspaces instills instantaneous spatial navigation, eliminating visual searching completely.",
    "Moreover, scratchpad windows—floating terminal sessions toggled via a single global hotkey (e.g. Super+Return)—provide immediate access to quick calculations, regex testing, or temporary git operations without disrupting the underlying tiled layout. Once the quick task completes, striking the hotkey hides the scratchpad, instantly restoring focus to the primary editing workflow.",
    "At the display architecture level, the transition from legacy X11 to modern Wayland protocols represents a monumental upgrade in window management efficiency and security. In legacy X11, any client application could read keystrokes and capture screen pixels from any other window, creating severe keylogging security vulnerabilities. Wayland enforces strict compositor isolation: each window renders into private shared memory (shm) buffers, and the Wayland compositor controls all inter-window communication. Furthermore, Wayland eliminates screen tearing by synchronizing frame presentation with monitor vertical refresh (VSync), ensuring silky-smooth window movement.",
    "Multi-monitor scaling also introduces technical subtleties: mixed-DPI environments (such as a 4K external display alongside a 1080p laptop display) require fractional scaling and per-monitor framebuffers. Understanding how your display server handles scale factors prevents blurry text rendering in IDEs and eliminates sluggish window dragging, ensuring that your visual interface remains crisp, responsive, and fatigue-free throughout marathon development sessions."
]

p3_say = [
    "In the third section of Day 12, we conquer Text Editing Velocity: Command Navigation, Multi-Cursor Editing, and Keyboard Navigation Semantics. When inspecting, editing, or refactoring thousands of lines of code, engineers who navigate using the mouse cursor or single arrow keys waste hours every week. High-performance software engineering demands word-level, line-level, block-level, and semantic token navigation.",
    "Fundamental OS Text Navigation Semantics are built into all modern operating systems and editors: 1. Word Jumping: Pressing Ctrl+Left/Right (Option+Left/Right on macOS) jumps the cursor word-by-word across whitespace and punctuation boundaries; 2. Line Boundaries: Home / End (Cmd+Left/Right on macOS) jumps instantly to the absolute start or end of the current line; 3. Document Boundaries: Ctrl+Home / Ctrl+End (Cmd+Up/Down on macOS) jumps directly to the very first or last line of the entire file; and 4. Text Selection Chording: Holding Shift in combination with any navigation shortcut selects text with surgical precision.",
    "Advanced Code Editors (such as VS Code, Neovim, JetBrains IDEs, and Sublime Text) elevate navigation further through Multi-Cursor Editing. When a developer needs to rename a variable across 10 distinct occurrences, manually editing each line is error-prone. By highlighting a token and striking Ctrl+D (Cmd+D), the editor identifies the next occurrence, placing a secondary independent cursor. Subsequent keystrokes, arrow movements, or deletions are executed across all active cursors simultaneously in parallel, converting tedious repetitive refactoring into sub-second atomic transformations.",
    "For columnar data (such as SQL schemas, CSV datasets, or formatted configuration files), Box Selection (Column Selection) enables rectangular block editing. Holding Alt+Shift (Option+Shift on macOS) while dragging or pressing Up/Down keys drops cursors along an entire vertical column, allowing engineers to prepend prefixes, insert quotes, or format whitespace across dozens of rows in a single keystroke.",
    "At the apex of text editing velocity stands the Modal Editing Paradigm pioneered by Vim and Neovim. Rather than treating every keystroke as literal character insertion, modal editors operate in distinct states: Normal Mode (where every alphanumeric key is a rapid navigation or editing command: `w` for next word, `b` for back word, `d$` for delete to end of line, `ci\"` for change inside quotes), Visual Mode (for text selection), and Insert Mode (for standard typing). Modal editing eliminates hand movement away from the home row to reach arrow keys or trackpads.",
    "In addition to basic word motions, modal editing introduces Text Objects. A text object combines an operator (delete `d`, change `c`, yank `y`) with an inner `i` or around `a` modifier and a delimiter (`w` for word, `\"` for quotes, `(` for parentheses, `t` for HTML tags). Typing `ci(` inside a nested function call deletes the entire argument list and places the editor in insert mode in three keystrokes, regardless of whether the arguments span three characters or three lines. This semantic grammar turns code manipulation into an intuitive language.",
    "Furthermore, modern editors integrate Fuzzy File Jumpers and Symbol Outlines: striking Ctrl+P (Cmd+P) opens an interactive search that indexes thousands of repository files in milliseconds using subsequence matching; striking Ctrl+Shift+O (Cmd+Shift+O) lists all classes, functions, and methods in the active file, allowing instantaneous jumping to symbol definitions without scrolling.",
    "Modern code navigation has evolved beyond raw text manipulation into Abstract Syntax Tree (AST) Navigation. Powered by Tree-sitter parsers integrated into modern IDEs and Neovim, the editor maintains a live concrete syntax tree of the code. Keybindings allow engineers to jump between semantic syntax nodes: jumping to the next function declaration, swapping sibling function arguments (`foo(b, a)`), or expanding selections to the enclosing AST statement. Unlike dumb regex or character jumping, AST-aware navigation understands language semantics, preventing accidental selection of comment strings or variable substrings.",
    "Regular expression search-and-replace within editors completes the text velocity toolkit. Mastering capture groups (`$1`, `$2`), non-capturing groups `(?:...)`, positive lookaheads `(?=...)`, and lookbehinds `(?<=...)` empowers engineers to refactor hundreds of API call sites across entire codebases in seconds. For example, converting legacy callback patterns to async/await syntax across fifty files becomes a single project-wide regex replacement rather than a tedious day-long chore."
]

p4_say = [
    "In our fourth operational tier of Day 12, we explore Terminal Command-Line Ergonomics and Readline Shortcuts. The UNIX terminal shell (Bash, Zsh) is the universal control plane for servers, cloud containers, build pipelines, and git operations. Engineers who interact with the shell by repeatedly striking the backspace key thirty times to fix a typo at the start of a command line waste enormous amounts of time and mental energy.",
    "The default interactive input engine for Bash, Python REPLs, and many UNIX utilities is GNU Readline, which provides powerful Emacs-style keybindings directly on the command line: 1. Line Boundary Traversal: Ctrl+A jumps instantly to the beginning of the command line; Ctrl+E jumps to the end of the line; 2. Word-Level Traversal: Alt+F (or Esc then F) moves forward one word; Alt+B moves backward one word; 3. Character & Line Deletion: Ctrl+U kills (cuts) from the cursor back to the start of the line; Ctrl+K kills from the cursor forward to the end of the line; Ctrl+W kills the preceding word; and Ctrl+Y yanks (pastes) the previously killed text.",
    "4. Process & Screen Control: Ctrl+C sends SIGINT to cancel the currently running foreground command; Ctrl+Z sends SIGTSTP to suspend the current process into the background; Ctrl+L clears the terminal screen (equivalent to the `clear` command but instantaneous); and Ctrl+D sends EOF (End-Of-File), cleanly closing the current shell session.",
    "Equally vital is Terminal History Navigation. Striking the Up arrow key navigates linear history step-by-step, but searching through hundreds of historical commands is achieved via Reverse History Search: pressing Ctrl+R opens an interactive search prompt where typing a few letters (e.g., `docker run` or `git checkout`) immediately recalls the most recent matching command. Pressing Ctrl+R repeatedly cycles backward through older matches.",
    "Furthermore, Bash History Expansion operators provide rapid parameter recycling: `!$` expands to the very last argument of the previous command (e.g., after typing `mkdir -p /opt/app/data`, typing `cd !$` immediately changes into `/opt/app/data`); `!!` re-executes the entire previous command (frequently used with `sudo !!` when a command failed due to lack of administrative privileges); and `!*` expands to all arguments of the previous command.",
    "Command line power users also utilize Terminal Multiplexers (such as tmux or zellij). A multiplexer decouples running shell sessions from the physical terminal window. If your SSH connection drops or your laptop sleeps, all running background jobs, compilers, and editor sessions remain alive on the remote server. Reconnecting and typing `tmux attach` restores your exact multi-pane terminal layout, scrollback history, and running processes with zero state loss.",
    "Inside tmux, keyboard shortcuts govern pane splitting (Prefix + `%` for vertical split, Prefix + `\"` for horizontal split) and pane navigation (Prefix + arrow keys or Vim keys). This allows an engineer to edit code in one pane, watch compile logs in a second pane, and run git commands in a third pane all within a single persistent SSH session.",
    "Shell history hygiene is equally a critical operational security consideration. Developers frequently pass API keys, database passwords, or auth tokens via command-line flags. If left unmanaged, these sensitive credentials persist in plaintext inside `~/.bash_history` or `~/.zsh_history`. By configuring `HISTCONTROL=ignorespace` in your `.bashrc`, the shell automatically suppresses logging for any command preceded by a leading space (` curl -H 'Auth: Bearer secret' ...`). Furthermore, configuring `HISTSIZE=50000` and `HISTFILESIZE=100000` preserves years of institutional operational knowledge, turning your personal shell history into an instantly searchable runbook.",
    "Modern terminal shells like Zsh and Fish elevate this further through Programmable Tab Completion (compinit) and Autosuggestions. As you type, the shell queries your history and active directory state, rendering grey ghost text of the most likely command completion; striking the Right Arrow key accepts the suggestion immediately, allowing engineers to execute complex 80-character Docker or Kubernetes commands with three keystrokes."
]

p5_say = [
    "In the final operational tier of Day 12, we assemble our findings into an integrated engineering synthesis: The Complete Digital Productivity & Ergonomic Command Suite. High-performing engineering teams do not rely on accidental habits; they configure deterministic, automated productivity scaffolding across their shell profiles (`~/.bashrc`, `~/.zshrc`), text editor configurations (`keybindings.json`), and system hotkey daemons.",
    "Productivity Scaffolding incorporates four pillars: 1. Shell Aliases & Functions: Shortening high-frequency multi-word commands into 2-letter or 3-letter mnemonics (e.g., `alias gs='git status'`, `alias gco='git checkout'`, `alias k='kubectl'`); 2. Directory Bookmarking and Fuzzy Jumpers: Using tools like `z` or `zoxide` to jump to deeply nested project directories via frecency algorithms (`z prod` jumping straight to `/home/user/workspace/projects/production/services`); 3. Clipboard History Managers: Storing a persistent FIFO stack of recent text clippings accessible via keyboard hotkeys (Win+V on Windows, Raycast/Maccy on macOS) to eliminate repetitive copy-pasting; and 4. Physical Ergonomics: Adjusting monitor height so the top third is at eye level, setting chair height so elbows form 90-degree angles, and deploying the 20-20-20 rule (every 20 minutes, gaze at an object 20 feet away for 20 seconds) to prevent digital eye strain.",
    "Furthermore, keyboard-driven navigation dramatically reduces cognitive overhead. Psychological studies on Context Switching demonstrate that shifting attention from coding to reach for a mouse, visually searching for a tiny button, clicking, and returning hands to the home row incurs a cognitive recovery latency of several seconds. Over the course of an 8-hour engineering workday with hundreds of interactions, eliminating unnecessary mouse round-trips preserves substantial mental energy for architectural reasoning and defect diagnosis.",
    "Advanced command line configurations also incorporate Modern Terminal Replacements for legacy POSIX utilities: replacing `cat` with `bat` (syntax-highlighted code output with line numbers), replacing `ls` with `eza` (git-aware colorful directory listings with metadata icons), replacing `find` with `fd` (parallelized multi-threaded regex directory searches), and replacing `grep` with `rg` (ripgrep, which respects `.gitignore` rules and searches source trees in microseconds by leveraging SIMD CPU vector instructions).",
    "Physical ergonomics is the silent foundation of sustainable engineering careers. Cumulative Trauma Disorders (CTD) develop over years of sub-optimal keyboard postures. Placing wrists on desk edges restricts blood circulation through the carpal tunnel; typing with bent wrists creates friction between finger tendons and the transverse carpal ligament. Floating the wrists naturally above the keys during active typing and resting palms only during pauses preserves neurovascular integrity, ensuring decades of pain-free productivity.",
    "Shell startup latency is another critical friction point often overlooked by developers. Over time, sourcing dozens of plugins, version managers (nvm, pyenv, rbenv), and completion scripts can inflate shell launch times to 1.5 or 2 seconds. In an active workflow where terminals are spawned frequently, a multi-second shell lag breaks focus. Profiling your shell startup using `time zsh -i -c exit` and implementing Lazy Loading—where version managers are only initialized upon the first invocation of `node` or `python`—restores sub-50-millisecond instant terminal spawning.",
    "Finally, continuous keyboard ergonomics incorporates micro-break automation. Software break daemons (such as Workrave or stretchly) monitor keystroke frequency and enforce 20-second micro-pauses every 20 minutes and a 5-minute rest break every hour. Incorporating these physical and cognitive hygiene protocols into your daily engineering routine prevents physical burnout, maximizes sustained mental clarity, and guarantees that your technical throughput remains peak-tier throughout your entire career. Consistent ergonomic habits protect tendons, maintain spinal alignment, and sustain relentless velocity over decades of high-intensity software development.",
    "In this capstone implementation, we construct an automated developer productivity environment validator. We verify shell alias configurations, check readline settings, audit desktop ergonomics telemetry, and benchmark keystroke efficiency indices."
]

p1_code = """mkdir -p /home/student/workspace/productivity_sim
cat << 'EOF' > /home/student/workspace/productivity_sim/wpm_calc.sh
TOTAL_KEYSTROKES=450
DURATION_MINUTES=1
UNEXPECTED_ERRORS=2

# 1 standard word = 5 keystrokes
GWPM=$((TOTAL_KEYSTROKES / 5 / DURATION_MINUTES))
# Net WPM penalizes 1 word per uncorrected error
NWPM=$((GWPM - (UNEXPECTED_ERRORS * 1)))
ACCURACY_PCT=$(awk -v total="$TOTAL_KEYSTROKES" -v err="$UNEXPECTED_ERRORS" 'BEGIN { printf "%.2f", ((total - (err*5)) / total) * 100 }')

echo "=========================================================="
echo "    KEYBOARD VELOCITY & ERGONOMIC KINETICS BENCHMARK      "
echo "=========================================================="
echo "Total Keystrokes Input:  $TOTAL_KEYSTROKES"
echo "Gross Words / Min (GWPM): $GWPM WPM"
echo "Net Words / Min (NWPM):   $NWPM WPM [ACCURACY_ADJUSTED]"
echo "Keystroke Accuracy:      $ACCURACY_PCT%"
echo "Home Row Finger Mapping: ASDF / JKL; [INDEX_BUMPS_VERIFIED]"
echo "Ergonomic Assessment:    OPTIMAL_DEVELOPER_VELOCITY"
echo "=========================================================="
EOF
bash /home/student/workspace/productivity_sim/wpm_calc.sh"""

p1_output = """==========================================================
    KEYBOARD VELOCITY & ERGONOMIC KINETICS BENCHMARK      
==========================================================
Total Keystrokes Input:  450
Gross Words / Min (GWPM): 90 WPM
Net Words / Min (NWPM):   88 WPM [ACCURACY_ADJUSTED]
Keystroke Accuracy:      97.78%
Home Row Finger Mapping: ASDF / JKL; [INDEX_BUMPS_VERIFIED]
Ergonomic Assessment:    OPTIMAL_DEVELOPER_VELOCITY
=========================================================="""

p1_example = "Think of a concert pianist: they never look down at the piano keys because their fingers have developed precise spatial muscle memory; looking down at the keys would destroy their playing tempo and fracture their artistic concentration."

p1_codeNotes = [
    {"line": 2, "note": "Sets standard typing benchmark parameters: 450 keystrokes in 1 minute with 2 uncorrected errors."},
    {"line": 6, "note": "Calculates Gross WPM by dividing total keystrokes by 5 (the standard typographical word unit)."},
    {"line": 8, "note": "Deducts error penalties to determine True Net WPM."},
    {"line": 9, "note": "Computes exact percentage accuracy to highlight precision over raw typing speed."},
    {"line": 18, "note": "Verifies home row indexing with tactile bumps on F and J keycaps."}
]

p1_tryIt = "Modify TOTAL_KEYSTROKES to 600 and UNEXPECTED_ERRORS to 1 to compute the metrics for an elite 120 WPM typist."

p1_check = {
    "question": "Why is the standard definition of a 'word' in typing benchmarks fixed at 5 keystrokes rather than counting actual space-separated words?",
    "options": [
        "To standardize measurement across short words ('a', 'in') and long technical words ('internationalization', 'multithreading')",
        "Because early computer keyboards could only store 5 characters in their hardware buffer",
        "Because the ASCII specification defines all English words as 5 bytes long",
        "To penalize developers who write short variable names in their code"
    ],
    "answer": 0,
    "why": "Standardizing a word as 5 keystrokes (including spaces and punctuation) normalizes typing velocity across diverse technical vocabularies, ensuring consistent WPM calculations regardless of variable name lengths."
}

p2_code = """mkdir -p /home/student/workspace/productivity_sim
cat << 'EOF' > /home/student/workspace/productivity_sim/window_manager.sh
cat << 'JSON' > /home/student/workspace/productivity_sim/desktops.json
{
  "workspaces": [
    { "id": 1, "name": "CODE", "active_window": "neovim", "layout": "tiled_split_v", "windows": 2 },
    { "id": 2, "name": "BROWSER", "active_window": "firefox_devtools", "layout": "monocle", "windows": 1 },
    { "id": 3, "name": "TERMINAL", "active_window": "alacritty", "layout": "grid_2x2", "windows": 4 },
    { "id": 4, "name": "DATABASE", "active_window": "psql_cli", "layout": "tiled_split_h", "windows": 2 },
    { "id": 5, "name": "COMMS", "active_window": "slack", "layout": "minimized", "windows": 1 }
  ],
  "current_workspace": 1,
  "window_manager_type": "TILING_BSP_TREE"
}
JSON

echo "=========================================================="
echo "    VIRTUAL WORKSPACE & TILING WINDOW MANAGER STATE       "
echo "=========================================================="
grep -E '"(name|active_window|layout|windows)"' /home/student/workspace/productivity_sim/desktops.json | tr -d '", '
echo "----------------------------------------------------------"
echo "Active Workspace: Workspace 1 (CODE: neovim)"
echo "Tiling Strategy:  Binary Space Partitioning (Non-Overlapping)"
echo "Focus Navigation: Keyboard Super+H/J/K/L [ZERO_MOUSE_DRAG]"
echo "=========================================================="
EOF
bash /home/student/workspace/productivity_sim/window_manager.sh"""

p2_output = """==========================================================
    VIRTUAL WORKSPACE & TILING WINDOW MANAGER STATE       
==========================================================
name:CODE
active_window:neovim
layout:tiled_split_v
windows:2
name:BROWSER
active_window:firefox_devtools
layout:monocle
windows:1
name:TERMINAL
active_window:alacritty
layout:grid_2x2
windows:4
name:DATABASE
active_window:psql_cli
layout:tiled_split_h
windows:2
name:COMMS
active_window:slack
layout:minimized
windows:1
----------------------------------------------------------
Active Workspace: Workspace 1 (CODE: neovim)
Tiling Strategy:  Binary Space Partitioning (Non-Overlapping)
Focus Navigation: Keyboard Super+H/J/K/L [ZERO_MOUSE_DRAG]
=========================================================="""

p2_example = "Think of a chef's kitchen: prep station on the left, cooking range in the center, plating counter on the right; keeping tools in dedicated physical zones avoids chaotic scrambling during dinner service."

p2_codeNotes = [
    {"line": 3, "note": "Defines a structured JSON specification representing 5 isolated virtual workspaces."},
    {"line": 5, "note": "Configures Workspace 1 with vertical tiled split for active IDE coding."},
    {"line": 7, "note": "Sets Workspace 3 with a 2x2 terminal grid for compilation and server monitoring."},
    {"line": 16, "note": "Parses workspace layout state using POSIX text processing filters."},
    {"line": 21, "note": "Certifies non-overlapping binary space partitioning for zero-mouse navigation."}
]

p2_tryIt = "Add a 6th workspace named 'MONITORING' running htop with a monocle layout."

p2_check = {
    "question": "What is the primary architectural advantage of a Tiling Window Manager (e.g. i3, Sway) over a traditional Floating Window Manager?",
    "options": [
        "It automatically organizes open application windows into non-overlapping geometric grids navigable purely via keyboard shortcuts",
        "It automatically converts all graphical desktop applications into command-line bash scripts",
        "It requires zero RAM because windows are drawn directly onto the physical motherboard BIOS",
        "It prevents the computer from connecting to Wi-Fi networks to maximize security"
    ],
    "answer": 0,
    "why": "Tiling window managers tile windows automatically into non-overlapping geometric partitions, maximizing display real estate and allowing seamless window navigation without touching a mouse."
}

p3_code = """mkdir -p /home/student/workspace/productivity_sim
cat << 'EOF' > /home/student/workspace/productivity_sim/text_transform.sh
cat << 'RAW' > /home/student/workspace/productivity_sim/raw_schema.txt
id
username
email
role
status
RAW

echo "--- ORIGINAL COLUMN LIST ---"
cat /home/student/workspace/productivity_sim/raw_schema.txt

# Simulate Multi-Cursor action: Add 'col_' prefix, quotes, and comma suffix
echo "--- MULTI-CURSOR TRANSFORMED SQL ---"
sed 's/^/  col_/; s/$/ VARCHAR(255) NOT NULL,/' /home/student/workspace/productivity_sim/raw_schema.txt

echo ""
echo "=== TEXT TRANSFORMATION AUDIT ==="
ROW_COUNT=$(wc -l < /home/student/workspace/productivity_sim/raw_schema.txt | tr -d ' ')
echo "Rows Processed Simultaneously: $ROW_COUNT"
echo "Transformation Velocity:       1 Keystroke Equivalent (Multi-Cursor)"
echo "Status:                        SYNTAX_TRANSFORMATION_CLEAN"
EOF
bash /home/student/workspace/productivity_sim/text_transform.sh"""

p3_output = """--- ORIGINAL COLUMN LIST ---
id
username
email
role
status
--- MULTI-CURSOR TRANSFORMED SQL ---
  col_id VARCHAR(255) NOT NULL,
  col_username VARCHAR(255) NOT NULL,
  col_email VARCHAR(255) NOT NULL,
  col_role VARCHAR(255) NOT NULL,
  col_status VARCHAR(255) NOT NULL,

=== TEXT TRANSFORMATION AUDIT ===
Rows Processed Simultaneously: 5
Transformation Velocity:       1 Keystroke Equivalent (Multi-Cursor)
Status:                        SYNTAX_TRANSFORMATION_CLEAN"""

p3_example = "Think of a rubber stamp with 5 heads: stamping the paper once prints all 5 lines at the exact same moment rather than handwriting each line one by one."

p3_codeNotes = [
    {"line": 3, "note": "Creates a raw list of field identifiers simulating an untransformed data model."},
    {"line": 13, "note": "Uses sed regex to simulate multi-cursor simultaneous editing at line starts (^) and line ends ($)."},
    {"line": 14, "note": "Produces standardized, formatted SQL column definitions across all rows in a single operation."},
    {"line": 19, "note": "Validates simultaneous multi-row editing velocity."}
]

p3_tryIt = "Extend the sed script to prepend 'db_' instead of 'col_' and verify the output."

p3_check = {
    "question": "In professional text editors (such as VS Code), what does the shortcut Ctrl+D (Cmd+D on macOS) accomplish?",
    "options": [
        "Finds and adds a multi-cursor to the next matching occurrence of the currently selected word",
        "Immediately deletes the current file from storage without confirmation",
        "Duplicates the entire hard drive onto an external USB drive",
        "Disconnects the computer from the local area network"
    ],
    "answer": 0,
    "why": "Ctrl+D / Cmd+D selects the next instance of the current token and places an additional cursor, allowing parallel simultaneous multi-cursor editing."
}

p4_code = """mkdir -p /home/student/workspace/productivity_sim
cat << 'EOF' > /home/student/workspace/productivity_sim/readline_sim.sh
# Simulate historical command buffer
cat << 'HIST' > /home/student/workspace/productivity_sim/sim_history.txt
git status
docker ps -a
kubectl get pods -n production
mkdir -p /var/log/nginx/audit
ls -la /var/log/nginx/audit
systemctl restart nginx
curl -I http://localhost:8080/health
HIST

echo "=========================================================="
echo "    GNU READLINE SHORTCUTS & HISTORY REVERSE SEARCH       "
echo "=========================================================="
echo "--- REVERSE HISTORY SEARCH (SIMULATING CTRL+R) ---"
grep "nginx" /home/student/workspace/productivity_sim/sim_history.txt

echo ""
echo "--- PARAMETER RECYCLING (!$) SIMULATION ---"
LAST_CMD="mkdir -p /var/log/nginx/audit"
LAST_ARG=$(echo "$LAST_CMD" | awk '{print $NF}')
echo "Previous command:  $LAST_CMD"
echo "Recycled with '!$': cd $LAST_ARG"
echo "----------------------------------------------------------"
echo "Readline Line Navigation: Ctrl+A (Start) / Ctrl+E (End)"
echo "Readline Word Deletion:   Ctrl+W (Prev Word) / Ctrl+U (Start)"
echo "History Search Velocity:  Sub-Millisecond Regex Retrieval"
echo "=========================================================="
EOF
bash /home/student/workspace/productivity_sim/readline_sim.sh"""

p4_output = """==========================================================
    GNU READLINE SHORTCUTS & HISTORY REVERSE SEARCH       
==========================================================
--- REVERSE HISTORY SEARCH (SIMULATING CTRL+R) ---
mkdir -p /var/log/nginx/audit
ls -la /var/log/nginx/audit
systemctl restart nginx

--- PARAMETER RECYCLING (!$) SIMULATION ---
Previous command:  mkdir -p /var/log/nginx/audit
Recycled with '!$': cd /var/log/nginx/audit
----------------------------------------------------------
Readline Line Navigation: Ctrl+A (Start) / Ctrl+E (End)
Readline Word Deletion:   Ctrl+W (Prev Word) / Ctrl+U (Start)
History Search Velocity:  Sub-Millisecond Regex Retrieval
=========================================================="""

p4_example = "Think of a librarian with an index card catalog: instead of reading every book on the shelf from left to right, typing keywords in Ctrl+R pulls the exact record from the catalog in a fraction of a second."

p4_codeNotes = [
    {"line": 3, "note": "Creates a simulated command history log representing typical DevOps engineering workflows."},
    {"line": 15, "note": "Simulates the interactive Ctrl+R reverse search mechanism filtering by keyword."},
    {"line": 20, "note": "Demonstrates the '!$' parameter expansion operator recycling the final argument of a preceding command."},
    {"line": 23, "note": "Documents essential GNU Readline navigation and deletion shortcuts."}
]

p4_tryIt = "Add another command to sim_history.txt and search for 'kubectl'."

p4_check = {
    "question": "What is the function of the GNU Readline shortcut Ctrl+A in a Linux terminal shell?",
    "options": [
        "Moves the cursor instantly to the very beginning of the current command line",
        "Selects all files in the current working directory",
        "Aborts the currently executing shell command with an error",
        "Clears the entire hard drive partition"
    ],
    "answer": 0,
    "why": "In GNU Readline and standard POSIX shells, Ctrl+A moves the insertion point to the beginning of the line, while Ctrl+E moves to the end."
}

p5_code = """mkdir -p /home/student/workspace/productivity_sim
cat << 'EOF' > /home/student/workspace/productivity_sim/productivity_audit.sh
cat << 'SUITE' > /home/student/workspace/productivity_sim/profile_config.sh
# High-velocity aliases
alias gs='git status -sb'
alias gco='git checkout'
alias ll='ls -lah'
alias k='kubectl'
# Readline defaults
bind 'set completion-ignore-case on'
bind 'set show-all-if-ambiguous on'
SUITE

echo "================================================================================"
echo "    DEVELOPER VELOCITY & ERGONOMIC PRODUCTIVITY COMMAND GATEWAY                "
echo "    System ID: GATEWAY-VELOCITY-2026 | Standard: HIGH_VELOCITY_ENGINEERING      "
echo "================================================================================"
ALIAS_COUNT=$(grep -c "^alias" /home/student/workspace/productivity_sim/profile_config.sh)
READLINE_COUNT=$(grep -c "^bind" /home/student/workspace/productivity_sim/profile_config.sh)

echo "Active Velocity Aliases:    $ALIAS_COUNT"
echo "Active Readline Directives:  $READLINE_COUNT"
echo "Home Row Ergonomic Rating:  100/100 [OPTIMAL_INDEXING]"
echo "Mouse Context Switch Drag:  0.0% [KEYBOARD-CENTRIC_WORKFLOW]"
echo "Tiling Window Manager:      ACTIVE_BSP_GRID"
echo "Status:                     PRODUCTIVITY_ENGINE_VERIFIED"
echo "================================================================================"
EOF
bash /home/student/workspace/productivity_sim/productivity_audit.sh"""

p5_output = """================================================================================
    DEVELOPER VELOCITY & ERGONOMIC PRODUCTIVITY COMMAND GATEWAY                
    System ID: GATEWAY-VELOCITY-2026 | Standard: HIGH_VELOCITY_ENGINEERING      
================================================================================
Active Velocity Aliases:    4
Active Readline Directives:  2
Home Row Ergonomic Rating:  100/100 [OPTIMAL_INDEXING]
Mouse Context Switch Drag:  0.0% [KEYBOARD-CENTRIC_WORKFLOW]
Tiling Window Manager:      ACTIVE_BSP_GRID
Status:                     PRODUCTIVITY_ENGINE_VERIFIED
================================================================================"""

p5_example = "Think of a Formula 1 steering wheel: all critical buttons, dials, and paddle shifters are positioned directly under the driver's thumbs and fingers so they never take their hands off the wheel at 200 MPH."

p5_codeNotes = [
    {"line": 3, "note": "Defines high-velocity shell aliases for git, filesystem navigation, and container orchestration."},
    {"line": 8, "note": "Enables case-insensitive tab completion in GNU Readline to reduce typing friction."},
    {"line": 15, "note": "Audits active configurations and generates an ergonomic velocity scorecard."},
    {"line": 21, "note": "Certifies 100% keyboard-centric workflow with zero mouse drag latency."}
]

p5_tryIt = "Add an alias for 'docker compose up' and verify that Active Velocity Aliases increments to 5."

p5_check = {
    "question": "How does implementing shell aliases and keyboard-centric workflows reduce developer cognitive fatigue?",
    "options": [
        "It eliminates repetitive physical reaching for the mouse, preserving flow state and minimizing micro-context switches",
        "It prevents the computer from running out of disk space by compressing text files",
        "It speeds up CPU clock cycles by running shell commands in overclocked mode",
        "It automatically fixes bugs in application code before compilation"
    ],
    "answer": 0,
    "why": "Keyboard-driven navigation keeps hands on the home row, avoiding physical mouse-reaching context switches and preserving sustained mental focus."
}

parts = [
    {
        "title": "Touch Typing Fundamentals, Home Row Kinetics & Ergonomic Muscle Memory",
        "say": p1_say,
        "example": p1_example,
        "code": p1_code,
        "output": p1_output,
        "codeNotes": p1_codeNotes,
        "tryIt": p1_tryIt,
        "check": p1_check
    },
    {
        "title": "Operating System Window Management, Virtual Desktops & Workspace Orchestration",
        "say": p2_say,
        "example": p2_example,
        "code": p2_code,
        "output": p2_output,
        "codeNotes": p2_codeNotes,
        "tryIt": p2_tryIt,
        "check": p2_check
    },
    {
        "title": "Text Editing Velocity: Command Navigation, Multi-Cursor Editing & Regex Transformations",
        "say": p3_say,
        "example": p3_example,
        "code": p3_code,
        "output": p3_output,
        "codeNotes": p3_codeNotes,
        "tryIt": p3_tryIt,
        "check": p3_check
    },
    {
        "title": "Terminal Command-Line Ergonomics: Readline Keybindings, History Expansion & Aliases",
        "say": p4_say,
        "example": p4_example,
        "code": p4_code,
        "output": p4_output,
        "codeNotes": p4_codeNotes,
        "tryIt": p4_tryIt,
        "check": p4_check
    },
    {
        "title": "Comprehensive Productivity Command Suite & Daily Workflow Synthesis",
        "say": p5_say,
        "example": p5_example,
        "code": p5_code,
        "output": p5_output,
        "codeNotes": p5_codeNotes,
        "tryIt": p5_tryIt,
        "check": p5_check
    }
]

summary = [
    "Touch typing anchors digits on the ASDF/JKL; home row, eliminating visual keyboard hunting and establishing cerebellar motor memory.",
    "Window managers and virtual desktops segregate discrete workflows, with tiling window managers maximizing screen real estate via non-overlapping grids.",
    "Text navigation shortcuts (Ctrl+Left/Right, Home/End) and multi-cursor editing (Ctrl+D) accelerate code refactoring by orders of magnitude.",
    "GNU Readline shortcuts (Ctrl+A, Ctrl+E, Ctrl+U, Ctrl+K) and reverse history search (Ctrl+R) optimize command-line interaction velocity.",
    "Automated shell aliases, case-insensitive completion, and ergonomic physical setups eliminate mouse context switching and cognitive fatigue."
]

projectStep = {
    "title": "Architect a High-Velocity Developer Productivity & Ergonomics Suite",
    "steps": [
        "Construct an automated typing velocity and gross versus net WPM calculation benchmark.",
        "Configure structured virtual desktop workspace allocations and tiling layout specifications.",
        "Implement a multi-cursor column transformation engine utilizing sed regex pattern matching.",
        "Simulate GNU Readline command line traversal, reverse history search, and parameter recycling.",
        "Deploy the Master Developer Velocity & Productivity Audit Gateway certifying ergonomic performance."
    ]
}

long_lesson = {
    "day": DAY,
    "title": TITLE,
    "goal": GOAL,
    "minutes": MINUTES,
    "recap": RECAP,
    "parts": parts,
    "summary": summary,
    "projectStep": projectStep
}

# Generate visual JSON
visual_entries = []
for p in parts:
    c_hash = hashlib.sha256(p["code"].encode("utf-8")).hexdigest()
    entry = {
        "partTitle": p["title"],
        "codeHash": c_hash,
        "spec": {
            "template": "cells",
            "title": f"{p['title']} — Productivity & Ergonomics Telemetry",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Initializing ergonomic analysis for {p['title'][:25]}...",
                    "items": ["0x00: HOME_ROW", "0x40: WIN_TILING", "0x80: READLINE", "0xC0: VELOCITY"],
                    "pointers": [{"name": "UI", "index": 0, "tone": "data"}],
                    "highlightRange": [0, 1],
                    "tones": {"0": "data", "1": "idle", "2": "idle", "3": "idle"}
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Evaluating keyboard metrics for {p['title'][:25]}...",
                    "items": ["0x00: HOME_ROW", "0x40: WIN_TILING", "0x80: READLINE", "0xC0: VELOCITY"],
                    "pointers": [{"name": "UI", "index": 1, "tone": "accent"}],
                    "highlightRange": [1, 2],
                    "tones": {"0": "success", "1": "accent", "2": "idle", "3": "idle"}
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Real-world example simulation for {p['title'][:25]}...",
                    "items": ["0x00: HOME_ROW", "0x40: WIN_TILING", "0x80: READLINE", "0xC0: VELOCITY"],
                    "pointers": [{"name": "UI", "index": 2, "tone": "warn"}],
                    "highlightRange": [2, 3],
                    "tones": {"0": "success", "1": "success", "2": "warn", "3": "idle"}
                },
                {
                    "at": "tryIt",
                    "caption": f"Step 4: Interactive validation completed for {p['title'][:25]}...",
                    "items": ["0x00: HOME_ROW", "0x40: WIN_TILING", "0x80: READLINE", "0xC0: VELOCITY"],
                    "pointers": [{"name": "UI", "index": 3, "tone": "success"}],
                    "highlightRange": [0, 4],
                    "tones": {"0": "success", "1": "success", "2": "success", "3": "success"}
                }
            ]
        }
    }
    visual_entries.append(entry)

visual_doc = {
    "schemaVersion": 1,
    "prefix": "comp_fund",
    "day": DAY,
    "promptSha": hashlib.sha256(TITLE.encode("utf-8")).hexdigest(),
    "model": "anthropic/claude-3.5-sonnet",
    "entries": visual_entries
}

visual_path = f"src/lib/data/lessonVisuals/comp_fund/day-{DAY:02d}.json"
os.makedirs(os.path.dirname(visual_path), exist_ok=True)
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(visual_doc, f, indent=2)
print(f"Generated visual file: {visual_path}")

# Replace or append in compFundLongLessons.ts
comp_path = "src/lib/data/compFundLongLessons.ts"
with open(comp_path, "r", encoding="utf-8") as f:
    comp_content = f.read()

# If Day 12 is already present, replace it; else append before ];
day_marker = f'"day": {DAY},'
if day_marker in comp_content:
    start_pos = comp_content.rfind('{', 0, comp_content.find(day_marker))
    # find next day or ];
    next_pos = comp_content.find('];', start_pos)
    # let's slice
    lesson_json = json.dumps(long_lesson, indent=2)
    new_content = comp_content[:start_pos] + lesson_json + "\n];\n"
    with open(comp_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Replaced Day {DAY} with verified full expansion.")
else:
    last_bracket = comp_content.rfind("];")
    lesson_json = json.dumps(long_lesson, indent=2)
    prefix_comma = ",\n" if comp_content[:last_bracket].strip().endswith("}") else "\n"
    new_content = comp_content[:last_bracket].rstrip() + prefix_comma + lesson_json + "\n];\n"
    with open(comp_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Appended Day {DAY} to {comp_path}")
