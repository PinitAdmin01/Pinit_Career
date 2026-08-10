(()=>{var e={};e.id=6450,e.ids=[6450],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},36966:(e,t,i)=>{"use strict";i.r(t),i.d(t,{GlobalError:()=>r.a,__next_app__:()=>m,originalPathname:()=>p,pages:()=>c,routeModule:()=>u,tree:()=>d}),i(61012),i(27479),i(35866);var a=i(23191),s=i(88716),n=i(37922),r=i.n(n),o=i(95231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);i.d(t,l);let d=["",{children:["admissions",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,61012)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\admissions\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(i.t.bind(i,35866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\admissions\\page.tsx"],p="/admissions/page",m={require:i,loadChunk:()=>Promise.resolve()},u=new a.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/admissions/page",pathname:"/admissions",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},43240:(e,t,i)=>{Promise.resolve().then(i.bind(i,10243))},10243:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>o});var a=i(10326),s=i(17577),n=i(90434),r=i(65309);function o(){let[e,t]=(0,s.useState)({name:"",email:"",gpa:"",course:"Computer Science"}),[i,o]=(0,s.useState)(!1),[l,d]=(0,s.useState)(!1),[c,p]=(0,s.useState)(null),[m,u]=(0,s.useState)(""),[f,x]=(0,s.useState)(null),[g,h]=(0,s.useState)(""),b=async a=>{if(a.preventDefault(),!i){alert("Please upload/simulate your 12th Grade Mark Sheet PDF first.");return}d(!0);try{let i=await r.hi.post("/api/admissions/apply",e);i&&i.ok&&(p(i.application),t({name:"",email:"",gpa:"",course:"Computer Science"}),o(!1))}catch{alert("Failed to submit application. Try again.")}finally{d(!1)}},y=async e=>{e.preventDefault(),h(""),x(null);try{let e=await r.hi.get("/api/admissions/applications"),t=e.applications?.find(e=>e.id.toLowerCase()===m.trim().toLowerCase());t?x(t):h("No application found matching this ID. Format: APP-2026-XXXX")}catch{h("Failed to query tracking database.")}};return(0,a.jsxs)("div",{style:{minHeight:"100vh",background:"#f8fafc",color:"#0f172a",fontFamily:"var(--font-body), sans-serif"},children:[(0,a.jsx)("style",{children:`
        /* Header topbar styles matching landing page */
        .header-topbar {
          position: sticky;
          top: 0;
          background: rgba(248, 250, 252, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(15, 23, 42, 0.05);
          z-index: 50;
          transition: background 0.3s;
        }
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .nav-group {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(15, 23, 42, 0.04);
          padding: 4px;
          border-radius: 30px;
        }
        .nav-btn {
          text-decoration: none;
          color: #475569;
          font-size: 13.5px;
          font-weight: 600;
          padding: 7px 18px;
          border-radius: 20px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-btn.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
        }
        .nav-btn:hover:not(.active) {
          color: #0f172a;
        }
        .action-btn-primary {
          background: #2563eb;
          color: #ffffff;
          border: none;
          border-radius: 50px;
          padding: 11px 26px;
          font-size: 13.5px;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.12);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .action-btn-primary:hover {
          background: #1d4ed8;
          transform: translateY(-1.5px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25);
        }

        .admissions-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 45px 20px;
        }
        .header-section {
          text-align: center;
          margin-bottom: 50px;
        }
        .header-title {
          font-family: var(--font-display), sans-serif;
          font-size: 38px;
          font-weight: 900;
          letter-spacing: -1px;
          color: #0f172a;
          margin-bottom: 12px;
        }
        .header-title span {
          background: linear-gradient(135deg, #2563eb, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .header-desc {
          font-size: 15px;
          color: #475569;
          max-width: 600px;
          margin: 0 auto;
        }
        .portal-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 30px;
        }
        @media (max-width: 768px) {
          .portal-grid {
            grid-template-columns: 1fr;
          }
          .nav-group {
            display: none !important;
          }
        }
        .card-box {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
        }
        .card-title {
          font-family: var(--font-display), sans-serif;
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .form-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #475569;
          margin-bottom: 6px;
          display: block;
        }
        .form-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          font-size: 13.5px;
          outline: none;
          background: #f8fafc;
          transition: all 0.2s;
        }
        .form-input:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
        }
        .btn-submit {
          background: #2563eb;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
          transition: background 0.2s;
          width: 100%;
          text-align: center;
        }
        .btn-submit:hover {
          background: #1d4ed8;
        }
        .timeline {
          margin-top: 24px;
          position: relative;
          padding-left: 24px;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 6px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e2e8f0;
        }
        .timeline-item {
          position: relative;
          padding-bottom: 24px;
        }
        .timeline-item:last-child {
          padding-bottom: 0;
        }
        .timeline-dot {
          position: absolute;
          left: -23px;
          top: 4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #cbd5e1;
          border: 2px solid #ffffff;
        }
        .timeline-dot.active {
          background: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
        }
        .timeline-dot.success {
          background: #10b981;
        }
        .timeline-dot.danger {
          background: #ef4444;
        }
        .timeline-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }
        .timeline-desc {
          font-size: 11.5px;
          color: #64748b;
          margin-top: 2px;
        }
      `}),(0,a.jsx)("header",{className:"header-topbar",children:(0,a.jsxs)("div",{className:"header-content",children:[(0,a.jsxs)(n.default,{href:"/",style:{display:"flex",alignItems:"center",gap:10,textDecoration:"none"},children:[(0,a.jsx)("div",{style:{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,#2563eb,#8b5cf6)",display:"flex",alignItems:"center",justifyItems:"center",fontSize:17,fontWeight:800,color:"white",justifyContent:"center",boxShadow:"0 4px 12px rgba(37,99,235,0.25)"},children:"Pi"}),(0,a.jsxs)("div",{children:[(0,a.jsx)("span",{style:{fontSize:19,fontWeight:900,color:"#0f172a",letterSpacing:"-0.6px",fontFamily:"var(--font-display)"},children:"PinIT"}),(0,a.jsx)("span",{style:{fontSize:10,color:"var(--primary)",fontWeight:800,marginLeft:6,textTransform:"uppercase",letterSpacing:"0.8px",fontFamily:"var(--font-mono)"},children:"Career OS"})]})]}),(0,a.jsxs)("nav",{className:"nav-group",children:[(0,a.jsx)(n.default,{href:"/",className:"nav-btn",children:"Home"}),(0,a.jsx)(n.default,{href:"/admissions",className:"nav-btn active",children:"Admissions \uD83C\uDF93"})]}),(0,a.jsxs)(n.default,{href:"/?login=true",className:"action-btn-primary",style:{textDecoration:"none"},children:["Sign In ",(0,a.jsx)("span",{children:"→"})]})]})}),(0,a.jsxs)("div",{className:"admissions-container",children:[(0,a.jsx)("div",{style:{marginBottom:24},children:(0,a.jsx)(n.default,{href:"/",style:{fontSize:13,fontWeight:700,color:"#2563eb",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:6},children:"← Back to Campus Portal Home"})}),(0,a.jsxs)("div",{className:"header-section",children:[(0,a.jsxs)("h1",{className:"header-title",children:["Admissions ",(0,a.jsx)("span",{children:"Portal"})]}),(0,a.jsx)("p",{className:"header-desc",children:"Submit your application for the Academic Year 2026–27, upload documents, and track your selection status in real-time."})]}),(0,a.jsxs)("div",{className:"portal-grid",children:[(0,a.jsxs)("div",{className:"card-box",children:[(0,a.jsx)("h2",{className:"card-title",children:"\uD83D\uDCDD Online Application Form"}),c?(0,a.jsxs)("div",{style:{background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:12,padding:20,textAlign:"center"},children:[(0,a.jsx)("div",{style:{fontSize:32,marginBottom:8},children:"\uD83C\uDF89"}),(0,a.jsx)("h3",{style:{fontSize:16,fontWeight:800,color:"#065f46",marginBottom:4},children:"Application Submitted!"}),(0,a.jsx)("p",{style:{fontSize:13,color:"#047857",marginBottom:12},children:"Your application has been registered successfully."}),(0,a.jsx)("div",{style:{background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:8,padding:10,display:"inline-block",fontFamily:"monospace",fontWeight:700,fontSize:15},children:c.id}),(0,a.jsx)("p",{style:{fontSize:11,color:"#64748b",marginTop:10},children:"Copy this ID and paste it in the Tracking Widget to monitor document audit status."}),(0,a.jsx)("button",{onClick:()=>p(null),className:"btn-submit",style:{marginTop:16,background:"#10b981"},children:"Submit Another Application"})]}):(0,a.jsxs)("form",{onSubmit:b,style:{display:"flex",flexDirection:"column",gap:16},children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"form-label",children:"Full Name"}),(0,a.jsx)("input",{type:"text",value:e.name,onChange:e=>t(t=>({...t,name:e.target.value})),className:"form-input",placeholder:"Ashwin Nair",required:!0})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"form-label",children:"Email Address"}),(0,a.jsx)("input",{type:"email",value:e.email,onChange:e=>t(t=>({...t,email:e.target.value})),className:"form-input",placeholder:"ashwin@gmail.com",required:!0})]}),(0,a.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:12},children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"form-label",children:"12th GPA / Board Grade (0-10)"}),(0,a.jsx)("input",{type:"number",step:"0.01",min:"0",max:"10",value:e.gpa,onChange:e=>t(t=>({...t,gpa:e.target.value})),className:"form-input",placeholder:"e.g. 9.4",required:!0})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"form-label",children:"Course Preference"}),(0,a.jsx)("select",{value:e.course,onChange:e=>t(t=>({...t,course:e.target.value})),className:"form-input",children:["Computer Science","DSAI","Electronics","Mechanical"].map(e=>(0,a.jsx)("option",{value:e,children:e},e))})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"form-label",children:"12th Grade Mark Sheet PDF"}),(0,a.jsxs)("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[(0,a.jsx)("button",{type:"button",onClick:()=>o(!0),style:{padding:"10px 14px",borderRadius:10,border:"1.5px dashed #cbd5e1",cursor:"pointer",fontSize:12.5,fontWeight:700,background:i?"#ecfdf5":"#ffffff",color:i?"#047857":"#475569",borderColor:i?"#a7f3d0":"#cbd5e1",flexGrow:1},children:i?"✓ 12th_marksheet.pdf Attached":"\uD83D\uDCC1 Attach Simulated Marksheet PDF"}),i&&(0,a.jsx)("button",{type:"button",onClick:()=>o(!1),style:{color:"#ef4444",border:"none",background:"none",cursor:"pointer",fontSize:13,fontWeight:700},children:"Remove"})]})]}),(0,a.jsx)("button",{type:"submit",className:"btn-submit",disabled:l,children:l?"Submitting Application...":"Submit Application Form"})]})]}),(0,a.jsxs)("div",{className:"card-box",style:{display:"flex",flexDirection:"column",gap:20},children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{className:"card-title",children:"\uD83D\uDD0D Status Tracking"}),(0,a.jsx)("p",{style:{fontSize:13,color:"#475569",marginBottom:14},children:"Enter your unique Application ID to pull the current stage of document verification and seat allocations."}),(0,a.jsxs)("form",{onSubmit:y,style:{display:"flex",gap:8},children:[(0,a.jsx)("input",{type:"text",value:m,onChange:e=>u(e.target.value),className:"form-input",placeholder:"e.g. APP-2026-0105",required:!0}),(0,a.jsx)("button",{type:"submit",className:"btn-submit",style:{width:"auto",whiteSpace:"nowrap",padding:"0 20px"},children:"Track ID"})]}),g&&(0,a.jsxs)("div",{style:{color:"#ef4444",fontSize:12.5,marginTop:8,fontWeight:600},children:["⚠️ ",g]})]}),f&&(0,a.jsxs)("div",{style:{borderTop:"1px solid #e2e8f0",paddingTop:20},children:[(0,a.jsxs)("div",{style:{background:"#f8fafc",padding:14,borderRadius:12,border:"1px solid #e2e8f0",marginBottom:20},children:[(0,a.jsx)("div",{style:{fontSize:11,fontWeight:800,color:"#64748b",textTransform:"uppercase"},children:"Candidate Details"}),(0,a.jsx)("div",{style:{fontSize:15,fontWeight:800,color:"#0f172a",marginTop:2},children:f.name}),(0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12.5,color:"#475569",marginTop:6},children:[(0,a.jsxs)("span",{children:["Course: ",(0,a.jsx)("strong",{children:f.course})]}),(0,a.jsxs)("span",{children:["12th GPA: ",(0,a.jsx)("strong",{children:f.gpa})]})]})]}),(0,a.jsxs)("div",{className:"timeline",children:[(0,a.jsxs)("div",{className:"timeline-item",children:[(0,a.jsx)("div",{className:"timeline-dot success"}),(0,a.jsx)("div",{className:"timeline-title",children:"Application Submitted"}),(0,a.jsxs)("div",{className:"timeline-desc",children:["Registered successfully on ",new Date(f.submittedAt).toLocaleDateString()]})]}),(0,a.jsxs)("div",{className:"timeline-item",children:[(0,a.jsx)("div",{className:`timeline-dot ${"Rejected"===f.status?"danger":"Document Verified"===f.status||"Seat Allocated"===f.status?"success":"active"}`}),(0,a.jsx)("div",{className:"timeline-title",children:"Rejected"===f.status?"Documents Flagged / Rejected":"Document Verification"}),(0,a.jsxs)("div",{className:"timeline-desc",children:["Applied"===f.status&&"Audit in queue: Admission Officer reviewing mark sheet details.","Document Verified"===f.status&&"12th Marks verified successfully against institutional parameters.","Rejected"===f.status&&"Audit rejected. Please contact admissions office.","Seat Allocated"===f.status&&"12th Marks verified."]})]}),(0,a.jsxs)("div",{className:"timeline-item",children:[(0,a.jsx)("div",{className:`timeline-dot ${"Seat Allocated"===f.status?"success":""}`}),(0,a.jsx)("div",{className:"timeline-title",children:"Merit List Seat Allocation"}),(0,a.jsx)("div",{className:"timeline-desc",children:"Seat Allocated"===f.status?"Confirmed! Seat allocated according to merit rank score.":"Waiting for Document Verification completion and Merit allocation release."})]})]})]})]})]})]})]})}},61012:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>a});let a=(0,i(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\admissions\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),a=t.X(0,[9276,8042,9421],()=>i(36966));module.exports=a})();