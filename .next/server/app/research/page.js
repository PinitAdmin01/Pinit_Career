(()=>{var e={};e.id=9214,e.ids=[9214],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},5532:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>n.a,__next_app__:()=>f,originalPathname:()=>p,pages:()=>c,routeModule:()=>x,tree:()=>d}),r(21735),r(27479),r(35866);var s=r(23191),i=r(88716),a=r(37922),n=r.n(a),l=r(95231),o={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>l[e]);r.d(t,o);let d=["",{children:["research",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,21735)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\research\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,35866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\research\\page.tsx"],p="/research/page",f={require:r,loadChunk:()=>Promise.resolve()},x=new s.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/research/page",pathname:"/research",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},25328:(e,t,r)=>{Promise.resolve().then(r.bind(r,89284))},89284:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>n});var s=r(10326),i=r(17577),a=r(65309);function n(){let[e,t]=(0,i.useState)([]),[r,n]=(0,i.useState)([]),[l,o]=(0,i.useState)([]),[d,c]=(0,i.useState)([]),[p,f]=(0,i.useState)(""),[x,u]=(0,i.useState)("Ashwanth Kumar"),[g,h]=(0,i.useState)(""),[b,m]=(0,i.useState)(!1),v=async()=>{try{let e=await a.api.get("/api/research/stats");t(e.papers||[]),n(e.projects||[]),o(e.patents||[]),c(e.funding||[])}catch{}},y=async e=>{e.preventDefault(),m(!0);try{let e=await a.api.post("/api/research/publish-paper",{title:p,authors:x,journal:g,status:"Draft"});e&&e.ok&&(alert("Research manuscript initialized in Publication Tracker ✓"),f(""),h(""),v())}catch{alert("Failed to publish paper.")}finally{m(!1)}},j=e=>{switch(e){case"Draft":default:return 1;case"Under Review":return 2;case"Accepted":return 3;case"Published":return 4}};return(0,s.jsxs)("div",{style:{minHeight:"100vh",background:"#f8fafc",color:"#0f172a",padding:"30px 20px",fontFamily:"var(--font-body), sans-serif"},children:[(0,s.jsx)("style",{children:`
        .res-wrapper {
          max-width: 1040px;
          margin: 0 auto;
        }
        .page-title {
          font-family: var(--font-display), sans-serif;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.6px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .metric-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
        }
        .metric-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.5px;
        }
        .metric-value {
          font-family: var(--font-display), sans-serif;
          font-size: 22px;
          font-weight: 850;
          margin-top: 6px;
        }
        .grid-split {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .grid-split {
            grid-template-columns: 1fr;
          }
        }
        .card-box {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
        }
        .card-title {
          font-family: var(--font-display), sans-serif;
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tracker-bar {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          position: relative;
        }
        .tracker-bar::before {
          content: '';
          position: absolute;
          top: 8px; left: 0; right: 0;
          height: 3px;
          background: #e2e8f0;
          z-index: 1;
        }
        .tracker-step {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
        }
        .tracker-dot {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #cbd5e1;
          border: 3px solid #ffffff;
          margin-bottom: 4px;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.05);
        }
        .tracker-step.active {
          color: #2563eb;
        }
        .tracker-step.active .tracker-dot {
          background: #2563eb;
        }
        .progress-bar-container {
          background: #e2e8f0;
          border-radius: 10px;
          height: 8px;
          overflow: hidden;
          width: 100%;
          margin-top: 6px;
        }
        .progress-bar-fill {
          height: 100%;
          background: #10b981;
          border-radius: 10px;
        }
        .project-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          background: #f8fafc;
        }
      `}),(0,s.jsxs)("div",{className:"res-wrapper",children:[(0,s.jsx)("h1",{className:"page-title",children:"\uD83D\uDD2C Institutional Research Desk"}),(0,s.jsx)("div",{className:"metric-grid",children:[{label:"Published Papers",value:`${e.filter(e=>"Published"===e.status).length} Papers`,color:"#2563eb"},{label:"Active Projects",value:`${r.length} Grants`,color:"#10b981"},{label:"Filed Patents",value:`${l.length} Filings`,color:"#8b5cf6"},{label:"Funding Secured",value:`₹${(r.reduce((e,t)=>e+(t.grantAmount||0),0)/1e5).toFixed(1)}L`,color:"#f59e0b"}].map(e=>(0,s.jsxs)("div",{className:"metric-card",children:[(0,s.jsx)("div",{className:"metric-label",children:e.label}),(0,s.jsx)("div",{className:"metric-value",style:{color:e.color},children:e.value})]},e.label))}),(0,s.jsxs)("div",{className:"grid-split",children:[(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:24},children:[(0,s.jsxs)("div",{className:"card-box",children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83D\uDCDD Publication Submission Pipeline"}),(0,s.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:16},children:e.map(e=>{let t=j(e.status);return(0,s.jsxs)("div",{style:{border:"1px solid #e2e8f0",borderRadius:14,padding:18,background:"#ffffff"},children:[(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,s.jsx)("span",{style:{fontFamily:"var(--font-mono)",fontSize:10.5,fontWeight:700,background:"#f1f5f9",padding:"2px 6px",borderRadius:4},children:e.id}),(0,s.jsx)("span",{style:{padding:"3px 8px",borderRadius:20,fontSize:10.5,fontWeight:700,background:"Published"===e.status?"#d1fae5":"Accepted"===e.status?"#dbeafe":"#fef3c7",color:"Published"===e.status?"#065f46":"Accepted"===e.status?"#1e40af":"#b45309"},children:e.status})]}),(0,s.jsx)("h4",{style:{margin:"8px 0 4px 0",fontSize:14.5,fontWeight:800},children:e.title}),(0,s.jsxs)("div",{style:{fontSize:11.5,color:"#64748b"},children:["Authors: ",e.authors," | Target Journal: ",e.journal]}),(0,s.jsx)("div",{className:"tracker-bar",children:[{label:"Draft",step:1},{label:"Review",step:2},{label:"Accepted",step:3},{label:"Published",step:4}].map(e=>(0,s.jsxs)("div",{className:`tracker-step ${t>=e.step?"active":""}`,children:[(0,s.jsx)("div",{className:"tracker-dot"}),(0,s.jsx)("span",{children:e.label})]},e.label))})]},e.id)})}),(0,s.jsxs)("form",{onSubmit:y,style:{borderTop:"1px solid #e2e8f0",paddingTop:20,marginTop:20,display:"flex",flexDirection:"column",gap:12},children:[(0,s.jsx)("h4",{style:{fontSize:14,fontWeight:800,margin:0},children:"➕ Log Manuscript/Draft Paper"}),(0,s.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"2fr 1fr",gap:10},children:[(0,s.jsx)("input",{type:"text",required:!0,className:"form-input",placeholder:"Manuscript Paper Title",value:p,onChange:e=>f(e.target.value)}),(0,s.jsx)("input",{type:"text",required:!0,className:"form-input",placeholder:"Target Journal (e.g. IEEE)",value:g,onChange:e=>h(e.target.value)})]}),(0,s.jsx)("button",{type:"submit",disabled:b,className:"btn-primary",style:{width:"100%"},children:b?"Submitting Draft...":"✓ Register to Tracker"})]})]}),(0,s.jsxs)("div",{className:"card-box",children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83D\uDCA1 Intellectual Property (Patents)"}),(0,s.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:12},children:l.map(e=>(0,s.jsxs)("div",{style:{padding:16,borderRadius:12,border:"1px solid #e2e8f0",background:"#f8fafc",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{style:{fontSize:13.5},children:e.title}),(0,s.jsxs)("div",{style:{fontSize:11.5,color:"#64748b",marginTop:4},children:["Inventors: ",e.inventors," | File Ref: ",e.fileNo]}),(0,s.jsxs)("div",{style:{fontSize:11,color:"#64748b",marginTop:2},children:["Filed Date: ",e.filedOn]})]}),(0,s.jsx)("span",{style:{padding:"3px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"#eff6ff",color:"#1e40af",border:"1px solid #bfdbfe"},children:e.status})]},e.id))})]})]}),(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:24},children:[(0,s.jsxs)("div",{className:"card-box",children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83D\uDD2C Sponsored Research Projects"}),(0,s.jsx)("div",{children:r.map(e=>(0,s.jsxs)("div",{className:"project-card",children:[(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontSize:11.5,fontWeight:800,color:"#64748b",marginBottom:6},children:[(0,s.jsxs)("span",{children:["Ref: ",e.id]}),(0,s.jsxs)("span",{children:["Budget: ₹",(e.grantAmount||0).toLocaleString()]})]}),(0,s.jsx)("h4",{style:{margin:"0 0 6px 0",fontSize:14,fontWeight:800},children:e.title}),(0,s.jsxs)("div",{style:{fontSize:12,color:"#475569",marginBottom:12},children:[(0,s.jsxs)("div",{children:["Principal Inv. (PI): ",(0,s.jsx)("strong",{children:e.pi})]}),(0,s.jsxs)("div",{children:["Co-PI: ",e.coPi]}),(0,s.jsxs)("div",{children:["Funding Agency: ",e.fundingAgency]}),(0,s.jsxs)("div",{children:["Duration: ",e.duration]})]}),(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:700,color:"#475569"},children:[(0,s.jsx)("span",{children:"Research Milestones"}),(0,s.jsxs)("span",{children:[e.progress,"%"]})]}),(0,s.jsx)("div",{className:"progress-bar-container",children:(0,s.jsx)("div",{className:"progress-bar-fill",style:{width:`${e.progress}%`}})})]})]},e.id))})]}),(0,s.jsxs)("div",{className:"card-box",children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83D\uDCB0 Grants & Seed Funding"}),(0,s.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:10},children:d.map(e=>(0,s.jsxs)("div",{style:{padding:14,borderRadius:10,border:"1px solid #e2e8f0",background:"#ffffff",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12.5},children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{children:e.title}),(0,s.jsxs)("div",{style:{color:"#64748b",fontSize:11,marginTop:2},children:["PI: ",e.pi," | Agency: ",e.agency]}),(0,s.jsxs)("div",{style:{fontWeight:700,color:"#0f172a",marginTop:4},children:["Amount: ₹",e.amount.toLocaleString()]})]}),(0,s.jsx)("span",{style:{padding:"3px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"Approved"===e.status?"#ecfdf5":"#fef3c7",color:"Approved"===e.status?"#047857":"#b45309"},children:e.status})]},e.id))})]})]})]})]})]})}},21735:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});let s=(0,r(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\research\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[9276,8042,9421],()=>r(5532));module.exports=s})();