(()=>{var e={};e.id=9536,e.ids=[9536],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},63526:(e,t,i)=>{"use strict";i.r(t),i.d(t,{GlobalError:()=>r.a,__next_app__:()=>f,originalPathname:()=>p,pages:()=>c,routeModule:()=>x,tree:()=>d}),i(7972),i(27479),i(35866);var n=i(23191),s=i(88716),a=i(37922),r=i.n(a),l=i(95231),o={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>l[e]);i.d(t,o);let d=["",{children:["finance",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,7972)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\finance\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(i.t.bind(i,35866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\finance\\page.tsx"],p="/finance/page",f={require:i,loadChunk:()=>Promise.resolve()},x=new n.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/finance/page",pathname:"/finance",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},4569:(e,t,i)=>{Promise.resolve().then(i.bind(i,31085))},31085:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>o});var n=i(10326),s=i(17577),a=i(65309),r=i(94282),l=i(42434);function o(){let[e,t]=(0,s.useState)(null),[i,o]=(0,s.useState)([]),[d,c]=(0,s.useState)(null),[p,f]=(0,s.useState)(null),[x,u]=(0,s.useState)("card"),[h,m]=(0,s.useState)({number:"",expiry:"",cvc:""}),[g,y]=(0,s.useState)(""),[b,j]=(0,s.useState)(!1),[v,S]=(0,s.useState)(!1),[w,k]=(0,s.useState)(!1),[C]=(0,s.useState)(9.4),D=async()=>{try{let e=await a.hi.get("/api/finance/student-dues");t(e)}catch(e){console.error("Failed to load dues sheet",e)}},P=async e=>{k(!0);try{let t=await a.hi.post("/api/finance/apply-scholarship",{scholarshipId:e});t&&t.ok&&(alert(`Scholarship applied! A waiver of ₹${(t.waiver??0).toLocaleString()} has been deducted from your remaining final installment.`),D())}catch{alert("Failed to apply scholarship.")}finally{k(!1)}},z=async e=>{if(e&&e.preventDefault(),d){j(!0);try{let e=await a.hi.post("/api/payment/create-order",{planId:`installment_${d.id}`,amount:100*(d.amount||1e4)}),t=e.keyId||process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID||"";if(!t){r.toast.error("Payment Error","Razorpay payment gateway key is not configured. Please contact administration."),j(!1),c(null);return}await (0,l.r)({key:t,amount:e.amount||100*d.amount,currency:"INR",name:"PinIT Campus Fee Payment",description:`Installment ${d.installmentNo} — ${d.title||"Tuition Fee"}`,order_id:e.orderId,handler:async e=>{let t=await a.hi.post("/api/finance/pay-due",{installmentId:d.id,paymentId:e.razorpay_payment_id});t&&t.ok&&(S(!0),setTimeout(()=>{S(!1),c(null),D()},1200))},theme:{color:"#4f46e5"}})}catch(e){alert(e.message||"Razorpay checkout initialization failed.")}finally{j(!1)}}};if(!e)return(0,n.jsx)("div",{style:{padding:40,textAlign:"center",color:"#64748b"},children:"Loading finance records..."});let N=(e.installments||[]).filter(e=>"Paid"===e.status).reduce((e,t)=>e+t.amount,0),I=(e.installments||[]).filter(e=>"Unpaid"===e.status).reduce((e,t)=>e+t.amount,0)+(e.fineLevied||0);return(0,n.jsxs)("div",{style:{minHeight:"100vh",background:"#f8fafc",color:"#0f172a",padding:"30px 20px",fontFamily:"var(--font-body), sans-serif"},children:[(0,n.jsx)("style",{children:`
        .finance-wrapper {
          max-width: 1080px;
          margin: 0 auto;
        }
        .section-title {
          font-family: var(--font-display), sans-serif;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.6px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .grid-3 {
            grid-template-columns: 1fr;
          }
        }
        .stats-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.01);
        }
        .stats-lbl {
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .stats-val {
          font-size: 26px;
          font-weight: 900;
          color: #0f172a;
          margin-top: 6px;
        }
        .alert-banner {
          background: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 24px;
        }
        .main-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }
        .card-block {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
        }
        .card-subtitle {
          font-family: var(--font-display), sans-serif;
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .table-fees {
          width: 100%;
          border-collapse: collapse;
        }
        .table-fees th {
          text-align: left;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          padding-bottom: 12px;
          border-bottom: 1px solid #cbd5e1;
        }
        .table-fees td {
          padding: 14px 0;
          font-size: 13.5px;
          border-bottom: 1px solid #f1f5f9;
        }
        .table-fees tr:last-child td {
          border-bottom: none;
        }
        .badge-status {
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 10.5px;
          font-weight: 700;
        }
        .badge-paid { background: #ecfdf5; color: #059669; }
        .badge-unpaid { background: #fef2f2; color: #dc2626; }
        .checkout-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .checkout-modal {
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 440px;
          padding: 28px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
        }
        .btn-pay {
          background: #2563eb;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-pay:hover { background: #1d4ed8; }
        .receipt-seal {
          border: 2px dashed #059669;
          color: #059669;
          font-family: monospace;
          font-weight: 800;
          font-size: 12px;
          padding: 8px;
          text-transform: uppercase;
          border-radius: 4px;
          display: inline-block;
          transform: rotate(-3deg);
        }
      `}),(0,n.jsxs)("div",{className:"finance-wrapper",children:[(0,n.jsx)("h1",{className:"section-title",children:"\uD83D\uDCB3 Finance & Fee Desk"}),e.fineLevied>0&&(0,n.jsxs)("div",{className:"alert-banner",children:[(0,n.jsx)("span",{style:{fontSize:20},children:"⚠️"}),(0,n.jsxs)("div",{children:[(0,n.jsx)("div",{style:{fontSize:13.5,fontWeight:800,color:"#92400e"},children:"Installment Overdue Alert"}),(0,n.jsxs)("p",{style:{fontSize:12,color:"#b45309",marginTop:3},children:["Your Final Installment deadline was ",(0,n.jsx)("strong",{children:"July 10, 2026"}),". A late payment fine of ",(0,n.jsx)("strong",{children:"₹1,500"})," has been applied to your outstanding balance. Please clear dues online to remove late restrictions."]})]})]}),(0,n.jsxs)("div",{className:"grid-3",children:[(0,n.jsxs)("div",{className:"stats-card",children:[(0,n.jsx)("div",{className:"stats-lbl",children:"Total Annual Course Fees"}),(0,n.jsxs)("div",{className:"stats-val",style:{color:"#2563eb"},children:["₹",(e.totalTermFees??0).toLocaleString()]}),e.scholarshipWaiver>0&&(0,n.jsxs)("div",{style:{fontSize:11,color:"#059669",fontWeight:700,marginTop:4},children:["Includes Waiver: -₹",(e.scholarshipWaiver??0).toLocaleString()]})]}),(0,n.jsxs)("div",{className:"stats-card",children:[(0,n.jsx)("div",{className:"stats-lbl",children:"Fees Cleared To Date"}),(0,n.jsxs)("div",{className:"stats-val",style:{color:"#10b981"},children:["₹",N.toLocaleString()]}),(0,n.jsxs)("div",{style:{fontSize:11,color:"#64748b",marginTop:4},children:["Payment efficiency: ",Math.round(N/e.totalTermFees*100),"%"]})]}),(0,n.jsxs)("div",{className:"stats-card",children:[(0,n.jsx)("div",{className:"stats-lbl",children:"Dues Outstanding (with Fines)"}),(0,n.jsxs)("div",{className:"stats-val",style:{color:I>0?"#ef4444":"#10b981"},children:["₹",I.toLocaleString()]}),(0,n.jsx)("div",{style:{fontSize:11,color:"#64748b",marginTop:4},children:"Next due deadline: Immediate"})]})]}),(0,n.jsxs)("div",{className:"main-grid",children:[(0,n.jsxs)("div",{className:"card-block",style:{display:"flex",flexDirection:"column",gap:14},children:[(0,n.jsx)("h3",{className:"card-subtitle",children:"\uD83D\uDCC5 Installments Timeline"}),(0,n.jsxs)("table",{className:"table-fees",children:[(0,n.jsx)("thead",{children:(0,n.jsxs)("tr",{children:[(0,n.jsx)("th",{children:"Milestone Name"}),(0,n.jsx)("th",{children:"Deadline Date"}),(0,n.jsx)("th",{children:"Amount"}),(0,n.jsx)("th",{children:"Status"}),(0,n.jsx)("th",{children:"Action"})]})}),(0,n.jsx)("tbody",{children:(e.installments||[]).map(t=>(0,n.jsxs)("tr",{children:[(0,n.jsx)("td",{style:{fontWeight:700},children:t.name}),(0,n.jsx)("td",{style:{color:"#64748b"},children:new Date(t.deadline).toLocaleDateString()}),(0,n.jsxs)("td",{style:{fontWeight:700},children:["₹",("Inst-3"===t.id&&e.fineLevied>0?(t.amount||0)+(e.fineLevied||0):t.amount||0).toLocaleString(),"Inst-3"===t.id&&e.fineLevied>0&&(0,n.jsx)("span",{style:{fontSize:10,color:"#dc2626",marginLeft:4},children:"(+₹1,500 Fine)"})]}),(0,n.jsx)("td",{children:(0,n.jsx)("span",{className:`badge-status ${"Paid"===t.status?"badge-paid":"badge-unpaid"}`,children:t.status})}),(0,n.jsx)("td",{children:"Paid"===t.status?(0,n.jsx)("button",{onClick:()=>f(t),className:"btn-ghost btn-sm",style:{border:"1px solid #cbd5e1",fontSize:11},children:"\uD83D\uDCC4 View Receipt"}):(0,n.jsx)("button",{onClick:()=>c(t),className:"btn-primary",style:{fontSize:11,padding:"6px 12px",background:"#2563eb"},children:"\uD83D\uDCB3 Pay Online"})})]},t.id))})]})]}),(0,n.jsxs)("div",{className:"card-block",style:{display:"flex",flexDirection:"column",gap:16},children:[(0,n.jsx)("h3",{className:"card-subtitle",children:"\uD83C\uDF93 Scholarships & Waivers Desk"}),(0,n.jsx)("p",{style:{fontSize:12.5,color:"#64748b"},children:"Students meeting institutional performance benchmarks are eligible to claim waivers applied directly to their due sheets."}),(0,n.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:10},children:i.map(t=>{let i=e.scholarshipWaiver===t.value,s=C>=9;return(0,n.jsxs)("div",{style:{background:"#f8fafc",padding:14,borderRadius:12,border:"1px solid #cbd5e1"},children:[(0,n.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,n.jsx)("span",{style:{fontSize:13,fontWeight:700},children:t.name}),(0,n.jsxs)("span",{style:{fontSize:12,fontWeight:800,color:"#059669"},children:["-₹",(t.value??0).toLocaleString()]})]}),(0,n.jsxs)("div",{style:{fontSize:11,color:"#64748b",marginTop:4},children:["Criteria: ",t.criteria]}),(0,n.jsx)("div",{style:{marginTop:10,display:"flex",justifyContent:"flex-end"},children:i?(0,n.jsx)("span",{style:{fontSize:11,fontWeight:800,color:"#059669"},children:"✓ Waiver Applied"}):(0,n.jsx)("button",{onClick:()=>P(t.id),disabled:!s||w,className:"btn-ghost btn-sm",style:{border:"1.5px solid #cbd5e1",fontSize:11,background:s?"#eff6ff":"#f1f5f9",color:s?"#2563eb":"#94a3b8"},children:s?"Claim Waiver":"Ineligible"})})]},t.id)})})]})]})]}),d&&(0,n.jsx)("div",{className:"checkout-overlay",children:(0,n.jsxs)("div",{className:"checkout-modal",children:[(0,n.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20},children:[(0,n.jsx)("h3",{style:{fontFamily:"var(--font-display)",fontSize:16,fontWeight:800},children:"\uD83D\uDD12 Secure Fee Payment Checkout"}),(0,n.jsx)("button",{onClick:()=>c(null),style:{border:"none",background:"none",fontSize:18,cursor:"pointer",color:"#64748b"},children:"✕"})]}),v?(0,n.jsxs)("div",{style:{textAlign:"center",padding:"20px 0"},children:[(0,n.jsx)("div",{style:{fontSize:40,marginBottom:10},children:"\uD83C\uDF89"}),(0,n.jsx)("h4",{style:{fontSize:16,fontWeight:800,color:"#059669"},children:"Payment Confirmed!"}),(0,n.jsx)("p",{style:{fontSize:12,color:"#64748b",marginTop:4},children:"Your transaction was logged and receipt generated."})]}):(0,n.jsxs)("form",{onSubmit:z,style:{display:"flex",flexDirection:"column",gap:16},children:[(0,n.jsxs)("div",{style:{background:"#f8fafc",padding:12,borderRadius:10,border:"1px solid #e2e8f0",fontSize:13},children:[(0,n.jsxs)("div",{style:{color:"#64748b"},children:["Paying: ",d.name]}),(0,n.jsxs)("div",{style:{fontSize:16,fontWeight:900,color:"#0f172a",marginTop:4},children:["₹",("Inst-3"===d.id&&e.fineLevied>0?(d.amount||0)+(e.fineLevied||0):d.amount||0).toLocaleString()]})]}),(0,n.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,background:"#f1f5f9",padding:4,borderRadius:10},children:[(0,n.jsx)("button",{type:"button",onClick:()=>u("card"),style:{padding:"8px",border:"none",borderRadius:8,fontSize:12,fontWeight:700,background:"card"===x?"#ffffff":"transparent",color:"card"===x?"#0f172a":"#64748b",cursor:"pointer"},children:"Credit / Debit Card"}),(0,n.jsx)("button",{type:"button",onClick:()=>u("upi"),style:{padding:"8px",border:"none",borderRadius:8,fontSize:12,fontWeight:700,background:"upi"===x?"#ffffff":"transparent",color:"upi"===x?"#0f172a":"#64748b",cursor:"pointer"},children:"UPI Payment"})]}),"card"===x?(0,n.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("label",{style:{fontSize:11,fontWeight:800,color:"#64748b"},children:"CARD NUMBER"}),(0,n.jsx)("input",{type:"text",className:"form-input",style:{marginTop:4},placeholder:"4111 2222 3333 4444",value:h.number,onChange:e=>m(t=>({...t,number:e.target.value})),required:!0})]}),(0,n.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("label",{style:{fontSize:11,fontWeight:800,color:"#64748b"},children:"EXPIRY DATE"}),(0,n.jsx)("input",{type:"text",className:"form-input",style:{marginTop:4},placeholder:"MM/YY",value:h.expiry,onChange:e=>m(t=>({...t,expiry:e.target.value})),required:!0})]}),(0,n.jsxs)("div",{children:[(0,n.jsx)("label",{style:{fontSize:11,fontWeight:800,color:"#64748b"},children:"CVC CODE"}),(0,n.jsx)("input",{type:"text",className:"form-input",style:{marginTop:4},placeholder:"123",value:h.cvc,onChange:e=>m(t=>({...t,cvc:e.target.value})),required:!0})]})]})]}):(0,n.jsxs)("div",{children:[(0,n.jsx)("label",{style:{fontSize:11,fontWeight:800,color:"#64748b"},children:"UPI VIRTUAL PAYMENT ADDRESS (VPA)"}),(0,n.jsx)("input",{type:"text",className:"form-input",style:{marginTop:4},placeholder:"ashwanth@oksbi",value:g,onChange:e=>y(e.target.value),required:!0})]}),(0,n.jsx)("button",{type:"submit",className:"btn-pay",disabled:b,children:b?"Processing Securely...":`✓ Complete Payment Gateway`})]})]})}),p&&(0,n.jsx)("div",{className:"checkout-overlay",children:(0,n.jsxs)("div",{className:"checkout-modal",style:{maxWidth:500,padding:36,position:"relative"},children:[(0,n.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"2px solid #0f172a",paddingBottom:16,marginBottom:20},children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("h4",{style:{fontFamily:"var(--font-display)",fontSize:15,fontWeight:900},children:"BGS INSTITUTE OF MANAGEMENT"}),(0,n.jsx)("div",{style:{fontSize:10,color:"#64748b",fontFamily:"var(--font-mono)"},children:"AFFILIATED TO CAMPUS CORE OS"})]}),(0,n.jsx)("button",{onClick:()=>f(null),style:{border:"none",background:"none",fontSize:18,cursor:"pointer",color:"#64748b"},children:"✕"})]}),(0,n.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:14,fontSize:13},children:[(0,n.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[(0,n.jsx)("span",{style:{color:"#64748b"},children:"Receipt Reference:"}),(0,n.jsx)("span",{style:{fontFamily:"var(--font-mono)",fontWeight:700},children:p.receiptId})]}),(0,n.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[(0,n.jsx)("span",{style:{color:"#64748b"},children:"Student Name:"}),(0,n.jsx)("span",{style:{fontWeight:700},children:"Ashwanth Kumar"})]}),(0,n.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[(0,n.jsx)("span",{style:{color:"#64748b"},children:"Paid Date:"}),(0,n.jsx)("span",{style:{fontWeight:700},children:new Date(p.paidOn).toLocaleDateString()})]}),(0,n.jsxs)("div",{style:{borderTop:"1px dashed #cbd5e1",borderBottom:"1px dashed #cbd5e1",padding:"12px 0",margin:"10px 0"},children:[(0,n.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontWeight:700,marginBottom:6},children:[(0,n.jsx)("span",{children:"Payment Item"}),(0,n.jsx)("span",{children:"Amount"})]}),(0,n.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",color:"#475569",fontSize:12.5},children:[(0,n.jsx)("span",{children:p.name}),(0,n.jsxs)("span",{children:["₹",(p.amount??0).toLocaleString()]})]}),"Inst-3"===p.id&&(0,n.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",color:"#dc2626",fontSize:12.5,marginTop:4},children:[(0,n.jsx)("span",{children:"Late Payment Penalty Fee"}),(0,n.jsx)("span",{children:"₹1,500"})]})]}),(0,n.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:900,marginBottom:20},children:[(0,n.jsx)("span",{children:"Total Amount Paid:"}),(0,n.jsxs)("span",{children:["₹",("Inst-3"===p.id?(p.amount||0)+1500:p.amount||0).toLocaleString()]})]}),(0,n.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,n.jsx)("div",{className:"receipt-seal",children:"Secured Paid"}),(0,n.jsx)("button",{onClick:()=>{window.print()},className:"btn-ghost",style:{border:"1.5px solid #cbd5e1",fontSize:12,padding:"6px 12px"},children:"\uD83D\uDDA8 Print Invoice"})]})]})]})})]})}},42434:(e,t,i)=>{"use strict";async function n(e){if(!await new Promise(e=>e(!1)))throw Error("Razorpay SDK failed to load. Please check your internet connection.");return new window.Razorpay(e).open(),!0}i.d(t,{r:()=>n})},7972:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>n});let n=(0,i(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\finance\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),n=t.X(0,[9276,8042,9421],()=>i(63526));module.exports=n})();