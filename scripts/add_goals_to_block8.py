with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

DAY_METADATA = {
    36: {
        "goal": "Master accessible modal dialog engineering: implement focus trapping loops, layout-shift-free body scroll locks, and WAI-ARIA 1.2 modal contracts for enterprise confirmation flows.",
        "minutes": 25,
        "recap": "Yesterday we certified the Headless Component Architecture suite in Milestone 7. Today we initiate Block 8, constructing sovereign overlay systems beginning with accessible modal dialogs and focus traps."
    },
    37: {
        "goal": "Master Portal architecture, stacking context resolution, and anchor positioning mechanics: teleport nodes to viewport root and bypass clipping boundaries with automated auto-flip collision detection.",
        "minutes": 25,
        "recap": "Yesterday we engineered accessible modal dialogs with focus trapping loops. Today we decouple floating UI elements from nested DOM stacking contexts via root Portals and twelve-point coordinate geometry."
    },
    38: {
        "goal": "Master micro-overlay interaction physics: differentiate tooltips from interactive popovers, implement the Safe Triangle hover bridge, and position floating arrows over canvas virtual anchors.",
        "minutes": 25,
        "recap": "Yesterday we built root Portal managers and anchor positioning engines. Today we refine micro-overlays, engineering safe hover bridges and virtual anchors for text selections and high-density financial charts."
    },
    39: {
        "goal": "Master off-canvas drawers and mobile bottom sheets: engineer touch gesture kinematics, logarithmic rubber-band resistance, and mobile viewport shields handling notch safe areas and virtual keyboards.",
        "minutes": 25,
        "recap": "Yesterday we mastered popovers, tooltips, and virtual anchoring geometry. Today we transition to off-canvas navigation and mobile touch kinematics, building fluid bottom sheets with velocity-based dismissal."
    },
    40: {
        "goal": "Synthesize the complete enterprise overlay suite in the Milestone 8 Capstone: coordinate multi-layered modals, drawers, popovers, and tooltips in a unified focus stack with LIFO escape unwinding.",
        "minutes": 25,
        "recap": "Over the past four days, we engineered modals, portals, micro-overlays, and touch gesture sheets. Today we achieve Milestone 8 Capstone certification, orchestrating multi-layered overlay stacks in an Institutional Trading Hub."
    }
}

for day_num, meta in DAY_METADATA.items():
    target = f'"day": {day_num},\n    "title":'
    replacement = f'"day": {day_num},\n    "title":' # check existing
    
    # We want to insert goal, minutes, recap right after title
    # Let's find `"day": {day_num},`
    day_marker = f'"day": {day_num},'
    idx = text.find(day_marker)
    assert idx != -1, f"Could not find day {day_num}"
    
    # Find the title line after day_marker
    title_idx = text.find('"title":', idx)
    end_of_title_line = text.find('\n', title_idx)
    
    insert_str = f'\n    "goal": "{meta["goal"]}",\n    "minutes": {meta["minutes"]},\n    "recap": "{meta["recap"]}",'
    text = text[:end_of_title_line] + insert_str + text[end_of_title_line:]

with open('src/lib/data/designWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Successfully injected goal, minutes, recap into Days 36-40 in designWebLongLessons.ts!")
