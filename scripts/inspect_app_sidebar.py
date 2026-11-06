with open(r'src/components/ui/AppSidebar.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("AppSidebar total lines:", len(lines))
for i, line in enumerate(lines):
    if 'export function AppSidebar' in line or 'export const AppSidebar' in line or 'export default function AppSidebar' in line:
        print(f"AppSidebar component at line {i+1}")
    if 'export const RIGHT_NAV' in line or 'RIGHT_NAV' in line and '=' in line:
        print(f"RIGHT_NAV at line {i+1}: {line.strip()[:80]}")
