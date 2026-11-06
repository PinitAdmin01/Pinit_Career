const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/university/StudentPortfolioShowcase.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const target1 = `              const user = JSON.parse(storedUser);
              const userName = user.displayName || user.name;
              if (userName && updated.fullName === 'Arjun Verma' && !updated.studentId.includes('arjun')) {
                updated.fullName = userName;
                updated.studentId = user.id || updated.studentId;
              }`;

const repl1 = `              const user = JSON.parse(storedUser);
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

// Normalize line endings to test
content = content.replace(/\r\n/g, '\n');
const target1Norm = target1.replace(/\r\n/g, '\n');
const repl1Norm = repl1.replace(/\r\n/g, '\n');

if (content.includes(target1Norm)) {
  content = content.replace(target1Norm, repl1Norm);
  console.log('Replaced hydration user logic successfully!');
} else {
  console.log('target1Norm NOT found');
}

// Omit CGPA chip if undefined instead of showing "Unrecorded"
const target2 = `              {portfolio.cgpa && portfolio.cgpa > 0 ? (
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

const repl2 = `              {portfolio.cgpa && portfolio.cgpa > 0 ? (
                <>
                  <span className="meta-dot">•</span>
                  <span className="meta-item cgpa">
                    <span>⭐</span> CGPA {portfolio.cgpa.toFixed(2)}
                  </span>
                </>
              ) : null}`;

const target2Norm = target2.replace(/\r\n/g, '\n');
const repl2Norm = repl2.replace(/\r\n/g, '\n');

if (content.includes(target2Norm)) {
  content = content.replace(target2Norm, repl2Norm);
  console.log('Replaced CGPA chip logic successfully!');
} else {
  console.log('target2Norm NOT found');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Saved StudentPortfolioShowcase.tsx');
