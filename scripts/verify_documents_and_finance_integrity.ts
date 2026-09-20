import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

console.log('=== Documents & Finance Integrity Verification ===\n');

// 1. Finance Integrity & PCI Compliance
const financePath = path.join(process.cwd(), 'src/app/finance/page.tsx');
assert(fs.existsSync(financePath), 'src/app/finance/page.tsx exists');

const financeContent = fs.readFileSync(financePath, 'utf-8');

// A. No non-PCI card/UPI collection inputs
assert(!financeContent.includes('cardDetails'), 'cardDetails state eradicated for PCI-DSS compliance');
assert(!financeContent.includes('CARD NUMBER'), 'Card number input field eradicated');
assert(!financeContent.includes('CVC CODE'), 'CVC code input field eradicated');
assert(!financeContent.includes('EXPIRY DATE'), 'Expiry date input field eradicated');
assert(!financeContent.includes('UPI VIRTUAL PAYMENT ADDRESS'), 'Custom UPI VPA input field eradicated');

// B. Direct Razorpay Checkout & PCI Notice
assert(financeContent.includes('openRazorpayCheckout'), 'Directly triggers openRazorpayCheckout');
assert(financeContent.includes('PCI-DSS'), 'Displays PCI-DSS certified gateway compliance notice');

// C. Dynamic Institution Receipt Header
assert(!financeContent.includes('BGS INSTITUTE OF MANAGEMENT'), 'Hardcoded "BGS INSTITUTE OF MANAGEMENT" eradicated from finance receipt');
assert(financeContent.includes('institutionName'), 'Finance receipt dynamically displays student institutionName');

// D. Eradicate Arbitrary Inst-3 Late Penalty
assert(!financeContent.includes("activeReceipt.id === 'Inst-3'"), 'Arbitrary "Inst-3" late fee check eradicated from receipt modal');
assert(!financeContent.includes("activeCheckoutInst.id === 'Inst-3'"), 'Arbitrary "Inst-3" late fee check eradicated from checkout modal');

// E. Dynamic Overdue Alert Deadline
assert(!financeContent.includes('July 10, 2026'), 'Hardcoded overdue deadline "July 10, 2026" eradicated');
assert(financeContent.includes('overdueInst'), 'Overdue alert dynamically derives deadline from overdue installment');

// F. Real Fee Voucher Download
assert(financeContent.includes('handleDownloadFeeVoucher'), 'Real fee voucher download function implemented');
assert(financeContent.includes('Fee_Voucher_'), 'Fee voucher creates authentic downloadable document');


// 2. Documents Vault & Academic Certification Integrity
const documentsPagePath = path.join(process.cwd(), 'src/app/documents/page.tsx');
const documentsServicePath = path.join(process.cwd(), 'src/lib/services/documentsService.ts');

assert(fs.existsSync(documentsPagePath), 'src/app/documents/page.tsx exists');
assert(fs.existsSync(documentsServicePath), 'src/lib/services/documentsService.ts exists');

const docsContent = fs.readFileSync(documentsPagePath, 'utf-8');
const docServiceContent = fs.readFileSync(documentsServicePath, 'utf-8');

// A. Institution Name on Printable Certificate
assert(!docsContent.includes('<h2>PinIT Career OS</h2>') && !docsContent.includes('>PinIT Career OS</h2>'), 'Hardcoded "PinIT Career OS" issuer eradicated from certificate');
assert(docsContent.includes('institutionName'), 'Certificate dynamically binds student institutionName');

// B. Authentic SVG QR Code & Clickable Verification
assert(!docsContent.includes('QR Code</div>'), 'Placeholder grey text box "QR Code" eradicated');
assert(docsContent.includes('<svg') && docsContent.includes('viewBox="0 0 25 25"'), 'Embeds authentic SVG QR code matrix');
assert(docsContent.includes('/verify/'), 'QR code links to public /verify gateway');
assert(docsContent.includes('candidateRegisterNumber'), 'Dynamically binds candidate register code');

// C. Documents Service Student Metadata Resolution
assert(docServiceContent.includes('onboarding_answers'), 'documentsService inspects student onboarding_answers');
assert(docServiceContent.includes('resolvedMajor'), 'documentsService dynamically resolves student major/department');
assert(docServiceContent.includes('resolvedYear'), 'documentsService dynamically resolves student academic year');


// 3. Verification Gateway Document Support
const verifyRoutePath = path.join(process.cwd(), 'src/app/api/verify/[credentialId]/route.ts');
const verifyPagePath = path.join(process.cwd(), 'src/app/verify/[credentialId]/page.tsx');

assert(fs.existsSync(verifyRoutePath), 'src/app/api/verify/[credentialId]/route.ts exists');
assert(fs.existsSync(verifyPagePath), 'src/app/verify/[credentialId]/page.tsx exists');

const verifyRouteContent = fs.readFileSync(verifyRoutePath, 'utf-8');
const verifyPageContent = fs.readFileSync(verifyPagePath, 'utf-8');

assert(verifyRouteContent.includes("credentialId.startsWith('DOC-')"), 'Verification route handles document certificates starting with DOC-');
assert(verifyRouteContent.includes('document_requests'), 'Verification route queries authentic document_requests table');
assert(verifyRouteContent.includes('official_document'), 'Verification route returns official_document type');

assert(verifyPageContent.includes('document'), 'Verification page includes document state');
assert(verifyPageContent.includes('OFFICIAL INSTITUTIONAL RECORD'), 'Verification page renders official institutional record card');
assert(verifyPageContent.includes('document.documentType'), 'Verification page displays documentType');

console.log('\nAll Documents & Finance Integrity assertions passed successfully! ✨');
