(()=>{var e={};e.id=8834,e.ids=[8834],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},22988:(e,t,i)=>{"use strict";i.r(t),i.d(t,{GlobalError:()=>a.a,__next_app__:()=>x,originalPathname:()=>p,pages:()=>c,routeModule:()=>f,tree:()=>d}),i(69274),i(27479),i(35866);var s=i(23191),r=i(88716),n=i(37922),a=i.n(n),o=i(95231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);i.d(t,l);let d=["",{children:["grievances",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,69274)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\grievances\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(i.t.bind(i,35866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\grievances\\page.tsx"],p="/grievances/page",x={require:i,loadChunk:()=>Promise.resolve()},f=new s.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/grievances/page",pathname:"/grievances",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},59890:(e,t,i)=>{Promise.resolve().then(i.bind(i,94813))},94813:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>o});var s=i(10326),r=i(17577),n=i(65309),a=i(57112);function o(){let{user:e}=(0,a.a)(),[t,i]=(0,r.useState)([]),[o,l]=(0,r.useState)("General"),[d,c]=(0,r.useState)(""),[p,x]=(0,r.useState)(""),[f,g]=(0,r.useState)(!1),[u,h]=(0,r.useState)(!1),[m,b]=(0,r.useState)(null),v=e?.displayName||e?.username||"Student",y=async()=>{try{let e=((await n.api.get("/api/grievances/stats")).grievances||[]).filter(e=>e.reporterName===v||e.anonymous&&"student"===e.reporterType);i(e)}catch{}},j=async e=>{e.preventDefault(),h(!0);try{let e=await n.api.post("/api/grievances/submit",{reporterType:"student",reporterName:f?"Anonymous Student":v,category:o,title:d,description:p,anonymous:f});e&&e.ok&&(alert("Grievance filed successfully! The administrative board has been notified."),c(""),x(""),g(!1),y())}catch{alert("Failed to submit grievance.")}finally{h(!1)}};return(0,s.jsxs)("div",{style:{minHeight:"100vh",background:"#f8fafc",color:"#0f172a",padding:"30px 20px",fontFamily:"var(--font-body), sans-serif"},children:[(0,s.jsx)("style",{children:`
        .grv-wrapper {
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
        .grid-split {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
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
        .tbl-grv {
          width: 100%;
          border-collapse: collapse;
        }
        .tbl-grv th {
          text-align: left;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          padding-bottom: 12px;
          border-bottom: 1px solid #cbd5e1;
        }
        .tbl-grv td {
          padding: 12px 0;
          font-size: 13.5px;
          border-bottom: 1px solid #f1f5f9;
        }
        .status-badge {
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 10.5px;
          font-weight: 700;
        }
        .overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .ticket-modal {
          background: #ffffff;
          border-radius: 20px;
          width: 100%;
          max-width: 540px;
          padding: 30px;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
        }
        .lbl-switch {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
          user-select: none;
        }
      `}),(0,s.jsxs)("div",{className:"grv-wrapper",children:[(0,s.jsx)("h1",{className:"page-title",children:"⚖️ Grievance Portal"}),(0,s.jsxs)("div",{className:"grid-split",children:[(0,s.jsxs)("div",{className:"card-box",style:{height:"fit-content"},children:[(0,s.jsx)("h3",{className:"card-title",children:"✍️ Submit Grievance Ticket"}),(0,s.jsxs)("form",{onSubmit:j,style:{display:"flex",flexDirection:"column",gap:14},children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Grievance Category"}),(0,s.jsxs)("select",{className:"form-input",value:o,onChange:e=>l(e.target.value),children:[(0,s.jsx)("option",{value:"Academic",children:"Academic / Syllabus"}),(0,s.jsx)("option",{value:"Hostel Facilities",children:"Hostel Facilities"}),(0,s.jsx)("option",{value:"Finance & Fees",children:"Finance & Tuition"}),(0,s.jsx)("option",{value:"Transportation",children:"Transportation & Bus routes"}),(0,s.jsx)("option",{value:"General",children:"General Campus Infrastructure"})]})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Complaint Subject Title *"}),(0,s.jsx)("input",{type:"text",required:!0,className:"form-input",placeholder:"e.g. Broken laboratory desks in Room 102",value:d,onChange:e=>c(e.target.value)})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Detailed Description *"}),(0,s.jsx)("textarea",{className:"form-input",rows:4,required:!0,placeholder:"Provide precise details to help investigators verify the issue...",value:p,onChange:e=>x(e.target.value)})]}),(0,s.jsxs)("div",{style:{margin:"4px 0"},children:[(0,s.jsxs)("label",{className:"lbl-switch",children:[(0,s.jsx)("input",{type:"checkbox",checked:f,onChange:e=>g(e.target.checked)}),(0,s.jsx)("span",{children:"File complaint anonymously"})]}),(0,s.jsx)("div",{style:{fontSize:10.5,color:"#64748b",marginTop:4,marginLeft:22},children:"If checked, your name and profile information will be completely hidden from administrators."})]}),(0,s.jsx)("button",{type:"submit",disabled:u,className:"btn-primary",style:{width:"100%"},children:u?"Submitting ticket...":"⚖️ File Grievance Ticket"})]})]}),(0,s.jsxs)("div",{className:"card-box",children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83D\uDCCB Track Grievance Status"}),0===t.length?(0,s.jsx)("div",{style:{padding:"40px 0",textAlign:"center",color:"#64748b"},children:"No active complaints filed in ticket system."}):(0,s.jsxs)("table",{className:"tbl-grv",children:[(0,s.jsx)("thead",{children:(0,s.jsxs)("tr",{children:[(0,s.jsx)("th",{children:"Ref ID"}),(0,s.jsx)("th",{children:"Category"}),(0,s.jsx)("th",{children:"Ticket Title"}),(0,s.jsx)("th",{children:"Date Filed"}),(0,s.jsx)("th",{children:"Status"}),(0,s.jsx)("th",{children:"Action"})]})}),(0,s.jsx)("tbody",{children:t.map(e=>(0,s.jsxs)("tr",{children:[(0,s.jsx)("td",{style:{fontFamily:"var(--font-mono)",fontSize:11,fontWeight:700},children:e.id}),(0,s.jsx)("td",{style:{fontWeight:600},children:e.category}),(0,s.jsxs)("td",{children:[(0,s.jsx)("div",{children:e.title}),e.anonymous&&(0,s.jsx)("span",{style:{fontSize:9.5,background:"#f1f5f9",color:"#475569",padding:"1px 5px",borderRadius:4,fontWeight:700},children:"Anonymous Report"})]}),(0,s.jsx)("td",{style:{color:"#64748b"},children:new Date(e.filedOn).toLocaleDateString()}),(0,s.jsx)("td",{children:(0,s.jsx)("span",{className:"status-badge",style:{background:"Resolved"===e.status?"#ecfdf5":"In Investigation"===e.status?"#eff6ff":"#fef3c7",color:"Resolved"===e.status?"#047857":"In Investigation"===e.status?"#1d4ed8":"#b45309"},children:e.status})}),(0,s.jsx)("td",{children:(0,s.jsx)("button",{onClick:()=>b(e),className:"btn-ghost btn-sm",style:{border:"1px solid #cbd5e1",fontSize:11},children:"Details"})})]},e.id))})]})]})]})]}),m&&(0,s.jsx)("div",{className:"overlay",children:(0,s.jsxs)("div",{className:"ticket-modal",children:[(0,s.jsxs)("h3",{style:{fontFamily:"var(--font-display)",fontSize:17,fontWeight:800,borderBottom:"1px solid #e2e8f0",paddingBottom:10,marginBottom:14},children:["Grievance Ticket details (",m.id,")"]}),(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:12,fontSize:13.5,color:"#334155"},children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{children:"Category:"})," ",m.category]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{children:"Subject:"})," ",m.title]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{children:"Date Filed:"})," ",new Date(m.filedOn).toLocaleString()]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{children:"Reporter Name:"})," ",m.reporterName]}),(0,s.jsxs)("div",{style:{background:"#f8fafc",padding:12,borderRadius:10,border:"1px solid #e2e8f0"},children:[(0,s.jsx)("strong",{children:"Complaint Details:"}),(0,s.jsx)("p",{style:{marginTop:4,lineHeight:1.5,color:"#475569"},children:m.description})]}),(0,s.jsxs)("div",{style:{borderTop:"1px solid #e2e8f0",paddingTop:12,marginTop:4},children:[(0,s.jsx)("strong",{children:"Investigation Status:"}),(0,s.jsx)("span",{className:"status-badge",style:{marginLeft:8,background:"Resolved"===m.status?"#ecfdf5":"In Investigation"===m.status?"#eff6ff":"#fef3c7",color:"Resolved"===m.status?"#047857":"In Investigation"===m.status?"#1d4ed8":"#b45309"},children:m.status})]}),"Resolved"===m.status?(0,s.jsxs)("div",{style:{background:"#ecfdf5",border:"1px solid #a7f3d0",padding:12,borderRadius:10,color:"#065f46"},children:[(0,s.jsx)("strong",{children:"Board Resolution Note:"}),(0,s.jsx)("p",{style:{marginTop:4,lineHeight:1.5},children:m.resolution}),(0,s.jsxs)("div",{style:{fontSize:10.5,color:"#047857",marginTop:6},children:["Resolved on ",new Date(m.resolvedOn).toLocaleDateString()]})]}):(0,s.jsx)("div",{style:{fontSize:12.5,color:"#64748b",background:"#eff6ff",padding:10,borderRadius:8,border:"1px solid #bfdbfe"},children:"ℹ️ This grievance ticket is currently being investigated by the institutional administrative committee. Action responses will update here automatically."})]}),(0,s.jsx)("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:20},children:(0,s.jsx)("button",{onClick:()=>b(null),className:"btn-primary",style:{background:"#0f172a"},children:"✕ Close Ticket Tracker"})})]})})]})}},69274:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>s});let s=(0,i(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\grievances\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),s=t.X(0,[9276,8042,9421],()=>i(22988));module.exports=s})();