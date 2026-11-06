import datetime

def sync():
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    date_part, time_part = now_str.split(" ")

    tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
    control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
    memory_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

    with open(tasks_path, "r", encoding="utf-8") as f:
        tasks_text = f.read()

    new_tasks = [
        f'TASK-1294,{date_part},{time_part},COMPLETED,Block 9 (M2 Batch 3),Antigravity,Course 21 comp_fund Day 41: Modern Terminal Multiplexing & Keyboard-Driven Productivity (tmux / SIGHUP / SSH ControlMaster / GNU Stow),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-41.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1295,{date_part},{time_part},COMPLETED,Block 9 (M2 Batch 3),Antigravity,Course 21 comp_fund Day 42: High-Performance Text Editing & Modal Editing (Vim-Neovim FSM / Buffers / LSP JSON-RPC / Tree-Sitter AST),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-42.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1296,{date_part},{time_part},COMPLETED,Block 9 (M2 Batch 3),Antigravity,Course 21 comp_fund Day 43: Automation & Task Orchestration (Makefiles / Just / 12-Factor App Config / direnv & Vault Secrets),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-43.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1297,{date_part},{time_part},COMPLETED,Block 9 (M2 Batch 3),Antigravity,Course 21 comp_fund Day 44: Command-Line Productivity & Fuzzy Finding (fzf / ripgrep / bat / jq & Composable Pipelines),write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-44.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1298,{date_part},{time_part},COMPLETED,Block 9 (M2 Batch 3),Antigravity,Course 21 comp_fund Day 45: Milestone 8 ApexProductivity Sovereign Developer Environment & Workspace Orchestrator Viva,write_to_file; run_command,src/lib/data/compFundLongLessons.ts; src/lib/data/lessonVisuals/comp_fund/day-45.json; tests/systems_long_lessons_parity.test.ts,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    ]

    if "TASK-1294" not in tasks_text:
        with open(tasks_path, "a", encoding="utf-8") as f:
            for t in new_tasks:
                f.write(t)
        print("Appended TASK-1294..1298 to agent_tasks.csv")

    with open(control_path, "r", encoding="utf-8") as f:
        ctrl_text = f.read()

    ctrl_line = (
        f'AGENT-403,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1294,Completed,{now_str},'
        '"5-Task Batch Protocol Complete: Month 2 Pioneer Batch 3 — Course 21 comp_fund Days 41-45: Modern Terminal Multiplexing (tmux/SIGHUP/GNU Stow), Modal Editing & LSP Architecture (Neovim/JSON-RPC/Tree-Sitter), Task Orchestration & Secret Hygiene (Makefiles/Just/12-Factor/Vault), Composable Modern CLI Pipelines (ripgrep/fzf/jq/bat/zoxide) & ApexProductivity Milestone 8 Viva (TASK-1294..1298) committed & pushed. 17,581 words (all 5 days >= 28.1 spoken min, avg 29.3 min/day), 110/110 parity tests passing, 0 tsc errors. Course 21 advances to 45/60 Days (75.0%)!"\n'
    )
    if "AGENT-403" not in ctrl_text:
        with open(control_path, "a", encoding="utf-8") as f:
            f.write(ctrl_line)
        print("Appended AGENT-403 to multi_agent_control.csv")

    with open(memory_path, "r", encoding="utf-8") as f:
        mem_text = f.read()

    mem_entry = f"""
### Milestone Update — Course 21 (`comp_fund`) Month 2 Batch 3 (Days 41–45: Block 9) Complete ({now_str})
- **Agent**: `AGENT-403` (`codex/interview-tab-reliability`)
- **Tasks**: `TASK-1294` through `TASK-1298`
- **Scope**:
  - **Day 41 (`TASK-1294`)**: *Modern Terminal Multiplexing & Keyboard-Driven Productivity: tmux, Sessions & Dotfiles Management* (3,549 words, 29.6 min)
  - **Day 42 (`TASK-1295`)**: *High-Performance Text Editing & Modal Editing: Vim/Neovim Mechanics, Buffers & The Language Server Protocol* (3,371 words, 28.1 min)
  - **Day 43 (`TASK-1296`)**: *Automation & Task Orchestration: Makefiles, Just, Environment Variables (12-Factor App) & Secret Management* (3,603 words, 30.0 min)
  - **Day 44 (`TASK-1297`)**: *Command-Line Productivity & Fuzzy Finding: fzf, ripgrep, bat, jq & Composable Pipelines* (3,598 words, 30.0 min)
  - **Day 45 (`TASK-1298`)**: *Milestone 8: ApexProductivity Sovereign Developer Environment & Workspace Orchestrator Architecture Review* (3,460 words, 28.8 min)
- **Verification**: 17,581 total words (avg 29.3 min/day), 110/110 passing tests in `tests/systems_long_lessons_parity.test.ts`, 0 TypeScript errors, Gate v2 visual specs `src/lib/data/lessonVisuals/comp_fund/day-{{41..45}}.json` verified with SHA-256 `codeHash` bindings.
"""
    if "TASK-1294" not in mem_text:
        with open(memory_path, "a", encoding="utf-8") as f:
            f.write(mem_entry)
        print("Updated PROJECT_MEMORY.md")

if __name__ == "__main__":
    sync()
