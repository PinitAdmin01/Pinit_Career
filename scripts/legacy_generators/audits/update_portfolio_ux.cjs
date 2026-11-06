const fs = require('fs');
const path = require('path');

// 1. Update StudentPortfolioShowcase.tsx
const showcasePath = path.join(__dirname, '../src/components/university/StudentPortfolioShowcase.tsx');
let showcase = fs.readFileSync(showcasePath, 'utf8');

// Replace hydration user check
const oldHydrationUser = `              const user = JSON.parse(storedUser);
              const userName = user.displayName || user.name;
              if (userName && updated.fullName === 'Arjun Verma' && !updated.studentId.includes('arjun')) {
                updated.fullName = userName;
                updated.studentId = user.id || updated.studentId;
              }`;

const newHydrationUser = `              const user = JSON.parse(storedUser);
              const userName = user.displayName || user.name || user.fullName;
              if (userName) {
                updated.fullName = userName;
                if (user.id) updated.studentId = user.id;
              }
              const userCollege = user.college || user.university || user.onboardingAnswers?.college || user.onboardingAnswers?.university;
              if (userCollege) {
                updated.institutionName = userCollege;
              }
              if (user.cgpa && Number(user.cgpa) > 0) {
                updated.cgpa = Number(user.cgpa);
              }`;

if (showcase.includes(oldHydrationUser)) {
  showcase = showcase.replace(oldHydrationUser, newHydrationUser);
}

// Omit CGPA chip if undefined instead of showing "Unrecorded"
const oldCgpaBlock = `              {portfolio.cgpa && portfolio.cgpa > 0 ? (
                <>
                  <span className="meta-dot">•</span>
                  <span className="meta-item cgpa">
                    <span>⭐</span> CGPA {portfolio.cgpa.toFixed(2)}
                  </span>
                </>
              ) : (
                <>
                  <span className="meta-dot">•</span>
                  <span className="meta-item cgpa text-muted-dim">
                    <span>⭐</span> CGPA: Unrecorded (Self-Taught Track)
                  </span>
                </>
              )}`;

const newCgpaBlock = `              {portfolio.cgpa && portfolio.cgpa > 0 ? (
                <>
                  <span className="meta-dot">•</span>
                  <span className="meta-item cgpa">
                    <span>⭐</span> CGPA {portfolio.cgpa.toFixed(2)}
                  </span>
                </>
              ) : null}`;

if (showcase.includes(oldCgpaBlock)) {
  showcase = showcase.replace(oldCgpaBlock, newCgpaBlock);
}

fs.writeFileSync(showcasePath, showcase, 'utf8');
console.log('Successfully updated StudentPortfolioShowcase.tsx');

// 2. Update TrackSelectorDrawer.tsx
const drawerPath = path.join(__dirname, '../src/app/quests/components/TrackSelectorDrawer.tsx');
let drawer = fs.readFileSync(drawerPath, 'utf8');

drawer = drawer.replace(
  '<span>Certification &amp; Skill Passport</span>',
  '<span>Certification Programs</span>'
);

fs.writeFileSync(drawerPath, drawer, 'utf8');
console.log('Successfully updated TrackSelectorDrawer.tsx');
