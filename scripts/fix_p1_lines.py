with open('scripts/design_day37_data.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_block = """console.log('=== CSS STACKING CONTEXT CONFLICT RESOLUTION ===');
const tooltipRes = StackingContextResolver.getStackingVector(domNodes.get('tooltip-alpha')!, domNodes);
const navRes = StackingContextResolver.getStackingVector(domNodes.get('profile-avatar')!, domNodes);

console.log('Tooltip Alpha Stacking Path:', tooltipRes.path.join(' -> '));
console.log('Tooltip Alpha Hierarchical Vector:', JSON.stringify(tooltipRes.vector));
console.log('\\\\nNav Header Avatar Stacking Path:', navRes.path.join(' -> '));
console.log('Nav Header Avatar Hierarchical Vector:', JSON.stringify(navRes.vector));

const comparison = StackingContextResolver.compare(tooltipRes.vector, navRes.vector);
const isTrapped = comparison < 0;
console.log('\\\\nVisual Rendering Evaluation:');
console.log(`Did Tooltip (z: 999999) lose to Nav Header (z: 10)? ${isTrapped ? 'YES - TRAPPED IN LOCAL CONTEXT' : 'NO'}`);\"\"\",
"""

# replace lines 83-92
lines[83:93] = [new_block]

with open('scripts/design_day37_data.py', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Fixed lines 83-92!")
