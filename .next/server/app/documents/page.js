(()=>{var e={};e.id=8479,e.ids=[8479],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1852:(e,t,i)=>{"use strict";i.r(t),i.d(t,{GlobalError:()=>n.a,__next_app__:()=>u,originalPathname:()=>p,pages:()=>c,routeModule:()=>x,tree:()=>d}),i(89563),i(27479),i(35866);var r=i(23191),s=i(88716),a=i(37922),n=i.n(a),o=i(95231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);i.d(t,l);let d=["",{children:["documents",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,89563)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\documents\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(i.t.bind(i,35866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\documents\\page.tsx"],p="/documents/page",u={require:i,loadChunk:()=>Promise.resolve()},x=new r.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/documents/page",pathname:"/documents",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},6207:(e,t,i)=>{Promise.resolve().then(i.bind(i,9559))},9559:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>l});var r=i(10326),s=i(17577),a=i(65309),n=i(57112),o=i(42342);function l(){let{user:e}=(0,n.a)(),[t,i]=(0,s.useState)([]),[l,d]=(0,s.useState)({totalIssued:0,pendingApprovals:0,totalRequests:0}),[c,p]=(0,s.useState)(!0),[u,x]=(0,s.useState)("Bonafide Certificate"),[m,g]=(0,s.useState)(""),[h,f]=(0,s.useState)(!1),[y,v]=(0,s.useState)(null);async function b(){p(!0);try{let e=await a.hi.get("/api/documents/stats");i(e.documents||[]),d(e.stats||{totalIssued:0,pendingApprovals:0,totalRequests:0})}catch{console.error("Failed to load documents stats")}finally{p(!1)}}let j=async e=>{if(e.preventDefault(),!m.trim()){alert("Please state a purpose for your request.");return}f(!0);try{let e=await a.hi.post("/api/documents/request",{type:u,purpose:m.trim()});e?.ok&&(g(""),b())}catch{alert("Failed to request document. Please try again.")}finally{f(!1)}};return(0,r.jsx)(o.default,{children:(0,r.jsxs)("div",{style:{maxWidth:1280,margin:"0 auto",paddingBottom:60},className:"animate-fade-in",children:[(0,r.jsx)("style",{children:`
          .docs-grid {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 20px;
            align-items: start;
          }
          @media (max-width: 900px) {
            .docs-grid {
              grid-template-columns: 1fr;
            }
          }
          .docs-card {
            background: var(--bg2);
            border: 1px solid var(--border);
            border-radius: var(--radius-xl);
            padding: 20px;
            box-shadow: var(--shadow-sm);
          }
          .docs-card-title {
            font-size: 10.5px;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            color: var(--t3);
            font-family: var(--font-mono);
            font-weight: 600;
            margin-bottom: 16px;
            display: block;
          }
          .form-label {
            font-size: 11.5px;
            font-weight: 700;
            color: var(--t2);
            margin-bottom: 6px;
            display: block;
          }
          .form-select, .form-input {
            width: 100%;
            height: 42px;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: var(--bg3);
            color: var(--t1);
            padding: 0 12px;
            font-size: 13px;
            outline: none;
            margin-bottom: 16px;
            transition: border 0.2s;
          }
          .form-select:focus, .form-input:focus {
            border-color: var(--accent);
          }
          .btn-primary {
            background: linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%);
            color: white;
            border: none;
            height: 42px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
            transition: opacity 0.2s;
          }
          .btn-primary:hover {
            opacity: 0.9;
          }
          .stats-mini-box {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            margin-bottom: 20px;
          }
          .stat-mini-item {
            background: var(--bg3);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 12px;
            text-align: center;
          }
          .stat-mini-val {
            font-size: 18px;
            font-weight: 900;
            color: var(--accent);
          }
          .stat-mini-lbl {
            font-size: 9.5px;
            text-transform: uppercase;
            color: var(--t3);
            margin-top: 4px;
          }
          
          /* Certificate print CSS styles */
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-cert-area, .printable-cert-area * {
              visibility: visible;
            }
            .printable-cert-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              z-index: 9999;
              background: white !important;
              color: black !important;
            }
            .cert-print-btn, .modal-dismiss-btn {
              display: none !important;
            }
          }
        `}),(0,r.jsxs)("div",{style:{marginBottom:24},children:[(0,r.jsx)("h1",{style:{fontFamily:"var(--font-display)",fontSize:22,fontWeight:900,letterSpacing:"-0.5px",marginBottom:4},children:"\uD83D\uDCC2 Digital Credentials & Documents Vault"}),(0,r.jsx)("p",{style:{color:"var(--t2)",fontSize:13.5},children:"Request verified academic transcripts, bonafide headers, or school leaving certificates with dynamic digital approval stamps."})]}),(0,r.jsxs)("div",{className:"docs-grid",children:[(0,r.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:16},children:[(0,r.jsxs)("div",{className:"docs-card",children:[(0,r.jsx)("span",{className:"docs-card-title",children:"\uD83D\uDCDC Document Stats"}),(0,r.jsxs)("div",{className:"stats-mini-box",children:[(0,r.jsxs)("div",{className:"stat-mini-item",children:[(0,r.jsx)("div",{className:"stat-mini-val",children:l.totalRequests}),(0,r.jsx)("div",{className:"stat-mini-lbl",children:"Requests"})]}),(0,r.jsxs)("div",{className:"stat-mini-item",children:[(0,r.jsx)("div",{className:"stat-mini-val",children:l.totalIssued}),(0,r.jsx)("div",{className:"stat-mini-lbl",children:"Issued"})]}),(0,r.jsxs)("div",{className:"stat-mini-item",children:[(0,r.jsx)("div",{className:"stat-mini-val",children:l.pendingApprovals}),(0,r.jsx)("div",{className:"stat-mini-lbl",children:"Pending"})]})]})]}),(0,r.jsxs)("div",{className:"docs-card",children:[(0,r.jsx)("span",{className:"docs-card-title",children:"✍️ Request Credentials"}),(0,r.jsxs)("form",{onSubmit:j,children:[(0,r.jsx)("label",{className:"form-label",children:"Select Document Type"}),(0,r.jsx)("select",{className:"form-select",value:u,onChange:e=>x(e.target.value),children:["Bonafide Certificate","Transfer Certificate (TC)","Semester Marks Card","Migration Certificate","Course Completion Certificate"].map(e=>(0,r.jsx)("option",{value:e,children:e},e))}),(0,r.jsx)("label",{className:"form-label",children:"Purpose of Request"}),(0,r.jsx)("input",{type:"text",className:"form-input",placeholder:"e.g. Scholarship application, passport verification",value:m,onChange:e=>g(e.target.value),required:!0}),(0,r.jsx)("button",{type:"submit",className:"btn-primary",disabled:h,children:h?"Submitting...":"Request Certification →"})]})]})]}),(0,r.jsxs)("div",{className:"docs-card",children:[(0,r.jsx)("span",{className:"docs-card-title",children:"\uD83D\uDCCB Active Document Locker"}),c?(0,r.jsx)("div",{style:{textAlign:"center",padding:"40px 0",color:"var(--t3)"},children:"Loading locker registry..."}):0===t.length?(0,r.jsx)("div",{style:{textAlign:"center",padding:"40px 0",color:"var(--t3)"},children:"No documents requested. Submit a form to request one."}):(0,r.jsx)("div",{style:{overflowX:"auto"},children:(0,r.jsxs)("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:13},children:[(0,r.jsx)("thead",{children:(0,r.jsxs)("tr",{style:{borderBottom:"1px solid var(--border)",background:"rgba(255,255,255,0.01)"},children:[(0,r.jsx)("th",{style:{padding:12,textAlign:"left",color:"var(--t3)"},children:"ID"}),(0,r.jsx)("th",{style:{padding:12,textAlign:"left",color:"var(--t3)"},children:"Credential Title"}),(0,r.jsx)("th",{style:{padding:12,textAlign:"left",color:"var(--t3)"},children:"Purpose"}),(0,r.jsx)("th",{style:{padding:12,textAlign:"left",color:"var(--t3)"},children:"Requested Date"}),(0,r.jsx)("th",{style:{padding:12,textAlign:"left",color:"var(--t3)"},children:"Approval Status"}),(0,r.jsx)("th",{style:{padding:12,textAlign:"center",color:"var(--t3)"},children:"Actions"})]})}),(0,r.jsx)("tbody",{children:t.map(e=>(0,r.jsxs)("tr",{style:{borderBottom:"1px solid var(--border)"},children:[(0,r.jsx)("td",{style:{padding:12,fontFamily:"var(--font-mono)",fontSize:11.5,color:"var(--t2)"},children:e.id}),(0,r.jsx)("td",{style:{padding:12,fontWeight:700},children:e.type}),(0,r.jsx)("td",{style:{padding:12,color:"var(--t2)"},children:e.purpose}),(0,r.jsx)("td",{style:{padding:12,color:"var(--t3)",fontSize:12},children:e.dateRequested}),(0,r.jsx)("td",{style:{padding:12},children:(0,r.jsx)("span",{style:{fontSize:10,padding:"3px 8px",borderRadius:100,fontWeight:700,background:"Issued"===e.status?"var(--green-light)":"var(--amber-light)",color:"Issued"===e.status?"var(--green)":"var(--amber)"},children:e.status})}),(0,r.jsx)("td",{style:{padding:12,textAlign:"center"},children:"Issued"===e.status?(0,r.jsx)("button",{onClick:()=>v(e),style:{background:"var(--accent)",border:"none",borderRadius:8,padding:"6px 12px",color:"white",fontWeight:700,fontSize:12,cursor:"pointer"},children:"\uD83D\uDC41️ View & Print"}):(0,r.jsx)("span",{style:{fontSize:12,color:"var(--t3)"},children:"Awaiting Sign"})})]},e.id))})]})})]})]}),y&&(0,r.jsx)("div",{style:{position:"fixed",inset:0,zIndex:1e3,background:"rgba(15,23,42,0.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:20},children:(0,r.jsxs)("div",{style:{width:"100%",maxWidth:800,background:"white",borderRadius:20,padding:24,boxShadow:"0 25px 50px -12px rgba(0,0,0,0.5)",display:"flex",flexDirection:"column",gap:16,color:"black"},children:[(0,r.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #e2e8f0",paddingBottom:12},children:[(0,r.jsxs)("span",{style:{fontSize:14,fontWeight:800,color:"#334155"},children:["\uD83D\uDCDC Verification Frame: ",y.id]}),(0,r.jsxs)("div",{style:{display:"flex",gap:8},children:[(0,r.jsx)("button",{onClick:()=>{window.print()},className:"cert-print-btn",style:{background:"#2563eb",color:"white",border:"none",padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"},children:"\uD83D\uDDA8️ Print Certificate"}),(0,r.jsx)("button",{onClick:()=>v(null),className:"modal-dismiss-btn",style:{background:"#f1f5f9",color:"#475569",border:"none",padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"},children:"Close"})]})]}),(0,r.jsxs)("div",{className:"printable-cert-area",style:{border:"8px double #1e3a8a",padding:40,background:"#ffffff",fontFamily:"Georgia, serif",position:"relative",textAlign:"center"},children:[(0,r.jsx)("div",{style:{position:"absolute",inset:0,opacity:.03,zIndex:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:180,pointerEvents:"none"},children:"\uD83C\uDF93"}),(0,r.jsxs)("div",{style:{position:"relative",zIndex:1},children:[(0,r.jsx)("h2",{style:{margin:"0 0 4px",fontSize:24,fontWeight:800,textTransform:"uppercase",color:"#1e3a8a",letterSpacing:"0.5px"},children:"PinIT Career OS"}),(0,r.jsx)("div",{style:{fontSize:12,textTransform:"uppercase",color:"#475569",fontWeight:600,letterSpacing:"1px",marginBottom:20},children:"Office of the Registrar \xb7 Academic Credentials Division"}),(0,r.jsx)("div",{style:{width:80,height:1,background:"#cbd5e1",margin:"0 auto 30px"}}),(0,r.jsx)("h3",{style:{fontFamily:"var(--font-display)",fontSize:20,fontStyle:"italic",color:"#334155",marginBottom:24},children:"Official Certification Document"}),(0,r.jsxs)("p",{style:{fontSize:15,lineHeight:1.8,color:"#1e293b",textAlign:"justify",margin:"0 auto 30px",maxWidth:640},children:["This is to certify that student ",(0,r.jsx)("strong",{children:e?.displayName||"Student User"})," is officially enrolled in the ",(0,r.jsx)("strong",{children:y.major})," department as a ",(0,r.jsx)("strong",{children:y.year})," under candidate code ",(0,r.jsx)("strong",{children:e?.registerNumber||"BGS2024001"}),"."]}),(0,r.jsxs)("p",{style:{fontSize:15,lineHeight:1.8,color:"#1e293b",textAlign:"justify",margin:"0 auto 30px",maxWidth:640},children:["This document is issued upon request for the designated purpose: ",(0,r.jsxs)("em",{children:['"',y.purpose,'"']}),". It carries digital verification credentials issued dynamically on ",(0,r.jsx)("strong",{children:y.dateIssued}),"."]}),(0,r.jsx)("div",{style:{height:40}}),(0,r.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"end",marginTop:40},children:[(0,r.jsxs)("div",{style:{textAlign:"left",display:"flex",gap:12,alignItems:"center"},children:[(0,r.jsx)("div",{style:{width:68,height:68,background:"#f8fafc",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#64748b",fontWeight:600},children:"QR Code"}),(0,r.jsxs)("div",{children:[(0,r.jsx)("div",{style:{fontSize:10,color:"#64748b",textTransform:"uppercase"},children:"Secure Verify Code"}),(0,r.jsx)("div",{style:{fontSize:12,fontFamily:"monospace",fontWeight:700,color:"#1e3a8a"},children:y.verificationCode})]})]}),(0,r.jsxs)("div",{style:{textAlign:"right"},children:[(0,r.jsx)("div",{style:{fontSize:14,fontStyle:"italic",fontFamily:'"Brush Script MT", cursive',color:"#1e3a8a",marginBottom:2},children:"Registrar Office"}),(0,r.jsx)("div",{style:{width:140,height:1,background:"#475569",margin:"4px 0 4px auto"}}),(0,r.jsx)("div",{style:{fontSize:10,textTransform:"uppercase",color:"#64748b",letterSpacing:"0.5px"},children:"Authorized Digital Seal"})]})]})]})]})]})})]})})}},89563:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>r});let r=(0,i(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\documents\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),r=t.X(0,[9276,8042,9421],()=>i(1852));module.exports=r})();