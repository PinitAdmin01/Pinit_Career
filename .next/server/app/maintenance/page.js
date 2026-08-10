(()=>{var e={};e.id=5368,e.ids=[5368],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},898:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>r.a,__next_app__:()=>u,originalPathname:()=>p,pages:()=>d,routeModule:()=>x,tree:()=>c}),s(7377),s(27479),s(35866);var i=s(23191),a=s(88716),n=s(37922),r=s.n(n),l=s(95231),o={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>l[e]);s.d(t,o);let c=["",{children:["maintenance",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,7377)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\maintenance\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,35866,23)),"next/dist/client/components/not-found-error"]}],d=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\maintenance\\page.tsx"],p="/maintenance/page",u={require:s,loadChunk:()=>Promise.resolve()},x=new i.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/maintenance/page",pathname:"/maintenance",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},44390:(e,t,s)=>{Promise.resolve().then(s.bind(s,58562))},58562:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>r});var i=s(10326),a=s(17577),n=s(65309);function r(){let[e,t]=(0,a.useState)([]),[s,r]=(0,a.useState)("All"),[l,o]=(0,a.useState)("All"),[c,d]=(0,a.useState)("Electricity"),[p,u]=(0,a.useState)(""),[x,g]=(0,a.useState)(""),[h,f]=(0,a.useState)(!1),m=async()=>{try{let e=await n.hi.get("/api/maintenance/stats");t(e.tickets||[])}catch{}},b=async e=>{e.preventDefault(),f(!0);try{let e=await n.hi.post("/api/maintenance/report",{category:c,location:p,description:x});e&&e.ok&&(alert("Infrastructure maintenance ticket logged successfully! Campus facilities team notified ✓"),u(""),g(""),m())}catch{alert("Failed to log ticket")}finally{f(!1)}},y=e.filter(e=>{let t="All"===s||e.category===s,i="All"===l||e.status===l;return t&&i}),v=`
    .mnt-wrapper {
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
    .tbl-mnt {
      width: 100%;
      border-collapse: collapse;
    }
    .tbl-mnt th {
      text-align: left;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: #64748b;
      padding-bottom: 12px;
      border-bottom: 1px solid #cbd5e1;
    }
    .tbl-mnt td {
      padding: 12px 0;
      font-size: 13px;
      border-bottom: 1px solid #f1f5f9;
    }
    .status-badge {
      padding: 3px 8px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 18px;
      margin-bottom: 24px;
    }
    .metric-card {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.05);
      border-radius: 14px;
      padding: 18px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.01);
    }
  `;return(0,i.jsxs)("div",{style:{minHeight:"100vh",background:"#f8fafc",color:"#0f172a",padding:"30px 20px",fontFamily:"var(--font-body), sans-serif"},children:[(0,i.jsx)("style",{dangerouslySetInnerHTML:{__html:v}}),(0,i.jsxs)("div",{className:"mnt-wrapper",children:[(0,i.jsx)("h1",{className:"page-title",children:"\uD83D\uDD27 Infrastructure Maintenance Desk"}),(0,i.jsx)("div",{className:"metric-grid",children:[{label:"Reported Issues",value:`${e.filter(e=>"Reported"===e.status).length} Pending`,color:"#f59e0b"},{label:"Scheduled Visits",value:`${e.filter(e=>"Scheduled"===e.status).length} Assigned`,color:"#2563eb"},{label:"Work In Progress",value:`${e.filter(e=>"In Progress"===e.status).length} Active`,color:"#8b5cf6"},{label:"Issues Resolved",value:`${e.filter(e=>"Resolved"===e.status).length} Succeeded`,color:"#10b981"}].map(e=>(0,i.jsxs)("div",{className:"metric-card",children:[(0,i.jsx)("div",{style:{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:.4},children:e.label}),(0,i.jsx)("div",{style:{fontSize:18,fontWeight:800,color:e.color,marginTop:4},children:e.value})]},e.label))}),(0,i.jsxs)("div",{className:"grid-split",children:[(0,i.jsxs)("div",{className:"card-box",style:{height:"fit-content"},children:[(0,i.jsx)("h3",{className:"card-title",children:"\uD83D\uDEA8 Report Campus Fault / Issue"}),(0,i.jsxs)("form",{onSubmit:b,style:{display:"flex",flexDirection:"column",gap:14},children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Issue Category *"}),(0,i.jsxs)("select",{className:"form-input",value:c,onChange:e=>d(e.target.value),children:[(0,i.jsx)("option",{value:"Electricity",children:"\uD83D\uDCA1 Electricity (Power failure, flickering lights)"}),(0,i.jsx)("option",{value:"Internet",children:"\uD83C\uDF10 Internet (WiFi down, slow ethernet)"}),(0,i.jsx)("option",{value:"Classroom Issues",children:"\uD83C\uDFEB Classroom Issues (Damaged benches, faulty projector screens)"}),(0,i.jsx)("option",{value:"Lab Maintenance",children:"\uD83E\uDDEA Lab Maintenance (Faulty sockets, gas leak, gear calibration)"})]})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Exact Campus Location *"}),(0,i.jsx)("input",{type:"text",required:!0,className:"form-input",placeholder:"e.g. Block C, Room 304",value:p,onChange:e=>u(e.target.value)})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Detailed Fault Description *"}),(0,i.jsx)("textarea",{required:!0,className:"form-input",style:{minHeight:80,resize:"vertical"},placeholder:"Describe the issue (e.g. ceiling fan is making clicking sound and running slow)",value:x,onChange:e=>g(e.target.value)})]}),(0,i.jsx)("button",{type:"submit",disabled:h,className:"btn-primary",style:{width:"100%",marginTop:6},children:h?"Logging Ticket...":"✓ Log Maintenance Request"})]})]}),(0,i.jsxs)("div",{className:"card-box",children:[(0,i.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16},children:[(0,i.jsx)("h3",{className:"card-title",style:{margin:0},children:"\uD83D\uDCCB Campus Infrastructure Tickets"}),(0,i.jsxs)("div",{style:{display:"flex",gap:8},children:[(0,i.jsxs)("select",{className:"form-input",style:{fontSize:11,padding:"4px 8px",width:110},value:s,onChange:e=>r(e.target.value),children:[(0,i.jsx)("option",{value:"All",children:"All Categories"}),(0,i.jsx)("option",{value:"Electricity",children:"Electricity"}),(0,i.jsx)("option",{value:"Internet",children:"Internet"}),(0,i.jsx)("option",{value:"Classroom Issues",children:"Classroom"}),(0,i.jsx)("option",{value:"Lab Maintenance",children:"Lab"})]}),(0,i.jsxs)("select",{className:"form-input",style:{fontSize:11,padding:"4px 8px",width:100},value:l,onChange:e=>o(e.target.value),children:[(0,i.jsx)("option",{value:"All",children:"All Statuses"}),(0,i.jsx)("option",{value:"Reported",children:"Reported"}),(0,i.jsx)("option",{value:"Scheduled",children:"Scheduled"}),(0,i.jsx)("option",{value:"In Progress",children:"In Progress"}),(0,i.jsx)("option",{value:"Resolved",children:"Resolved"})]})]})]}),(0,i.jsx)("div",{style:{overflowX:"auto"},children:(0,i.jsxs)("table",{className:"tbl-mnt",children:[(0,i.jsx)("thead",{children:(0,i.jsxs)("tr",{children:[(0,i.jsx)("th",{children:"Ref ID"}),(0,i.jsx)("th",{children:"Category / Location"}),(0,i.jsx)("th",{children:"Description"}),(0,i.jsx)("th",{children:"Technician"}),(0,i.jsx)("th",{children:"Status"})]})}),(0,i.jsx)("tbody",{children:0===y.length?(0,i.jsx)("tr",{children:(0,i.jsx)("td",{colSpan:5,style:{textAlign:"center",padding:"40px 0",color:"#64748b"},children:"No maintenance tickets logged matching current filters."})}):y.map(e=>{let t="#fef3c7",s="#b45309";return"Scheduled"===e.status?(t="#dbeafe",s="#1e40af"):"In Progress"===e.status?(t="#f3e8ff",s="#6b21a8"):"Resolved"===e.status&&(t="#d1fae5",s="#065f46"),(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{style:{fontFamily:"var(--font-mono)",fontSize:11,fontWeight:700},children:e.id}),(0,i.jsxs)("td",{children:[(0,i.jsx)("strong",{style:{display:"block",fontSize:13},children:e.category}),(0,i.jsxs)("span",{style:{fontSize:11,color:"#64748b"},children:["\uD83D\uDCCD ",e.location]})]}),(0,i.jsx)("td",{style:{maxWidth:200,fontSize:12},children:e.description}),(0,i.jsx)("td",{style:{fontSize:12,fontWeight:600},children:e.technician||"Not assigned yet"}),(0,i.jsx)("td",{children:(0,i.jsx)("span",{className:"status-badge",style:{background:t,color:s},children:e.status})})]},e.id)})})]})})]})]})]})]})}},7377:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>i});let i=(0,s(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\maintenance\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),i=t.X(0,[9276,8042,9421],()=>s(898));module.exports=i})();