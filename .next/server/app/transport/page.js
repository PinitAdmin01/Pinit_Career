(()=>{var e={};e.id=2964,e.ids=[2964],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},99355:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>a.a,__next_app__:()=>x,originalPathname:()=>p,pages:()=>c,routeModule:()=>f,tree:()=>d}),s(61830),s(27479),s(35866);var i=s(23191),r=s(88716),n=s(37922),a=s.n(n),o=s(95231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);s.d(t,l);let d=["",{children:["transport",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,61830)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\transport\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,35866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\transport\\page.tsx"],p="/transport/page",x={require:s,loadChunk:()=>Promise.resolve()},f=new i.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/transport/page",pathname:"/transport",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},28015:(e,t,s)=>{Promise.resolve().then(s.bind(s,93075))},93075:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>a});var i=s(10326),r=s(17577),n=s(65309);function a(){let[e,t]=(0,r.useState)([]),[s,a]=(0,r.useState)([]),[o,l]=(0,r.useState)({route:null,stop:"",status:"none"}),[d,c]=(0,r.useState)(""),[p,x]=(0,r.useState)(""),[f,g]=(0,r.useState)(!1),[h,u]=(0,r.useState)(0),m=async()=>{try{let e=await n.api.get("/api/transport/stats");t(e.routes||[]),a(e.drivers||[]),l(e.allocation||{route:null,stop:"",status:"none"}),e.routes&&e.routes.length>0&&(c(e.routes[0]?.code||""),x(e.routes[0]?.stops?.[0]||""))}catch{}},b=async e=>{e.preventDefault(),g(!0);try{let e=await n.api.post("/api/transport/register",{routeCode:d,stop:p});e&&e.ok&&(alert("Transit registration requested! Awaiting transport officer verification approval."),m())}catch{alert("Registration failed.")}finally{g(!1)}},v=e.find(e=>e.code===(o.route||d)),y=v?s.find(e=>e.name===v.driverName):null;return(0,i.jsxs)("div",{style:{minHeight:"100vh",background:"#f8fafc",color:"#0f172a",padding:"30px 20px",fontFamily:"var(--font-body), sans-serif"},children:[(0,i.jsx)("style",{children:`
        .transit-wrapper {
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
        .status-alert {
          border-radius: 16px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid;
        }
        .grid-split {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
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
        .gps-map-mock {
          background: #0f172a;
          border-radius: 16px;
          padding: 24px;
          color: #ffffff;
          position: relative;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid #334155;
        }
        .gps-route-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          margin: 40px 0;
        }
        .gps-route-line::before {
          content: '';
          position: absolute;
          top: 50%; left: 0; right: 0;
          height: 4px;
          background: #334155;
          transform: translateY(-50%);
          z-index: 1;
        }
        .gps-node {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #334155;
          border: 3px solid #0f172a;
          z-index: 2;
          position: relative;
          transition: all 0.3s;
        }
        .gps-node.passed {
          background: #10b981;
        }
        .gps-node.active {
          background: #3b82f6;
          box-shadow: 0 0 15px #3b82f6;
          transform: scale(1.3);
        }
        .gps-label {
          position: absolute;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          white-space: nowrap;
          color: #94a3b8;
          font-weight: 700;
        }
        .gps-label.active {
          color: #3b82f6;
          font-weight: 800;
        }
        .star-rating {
          color: #fbbf24;
          font-size: 16px;
        }
      `}),(0,i.jsxs)("div",{className:"transit-wrapper",children:[(0,i.jsx)("h1",{className:"page-title",children:"\uD83D\uDE8C Transit Desk"}),"none"===o.status&&(0,i.jsx)("div",{className:"status-alert",style:{background:"#fef2f2",borderColor:"#fee2e2",color:"#991b1b"},children:(0,i.jsxs)("div",{children:[(0,i.jsx)("strong",{style:{fontSize:14},children:"⚠️ Transit Pass Inactive"}),(0,i.jsx)("div",{style:{fontSize:12,marginTop:2},children:"You do not have an active transport route registration. Register via route selectors below."})]})}),"pending"===o.status&&(0,i.jsxs)("div",{className:"status-alert",style:{background:"#fef3c7",borderColor:"#fde68a",color:"#92400e"},children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("strong",{style:{fontSize:14},children:"⏳ Seat Verification Pending"}),(0,i.jsxs)("div",{style:{fontSize:12,marginTop:2},children:["Requested Route: ",(0,i.jsx)("strong",{children:e.find(e=>e.code===o.route)?.name})," | Stop: ",(0,i.jsx)("strong",{children:o.stop}),"."]})]}),(0,i.jsx)("span",{style:{fontSize:11,fontWeight:700,padding:"4px 10px",background:"#fffbeb",borderRadius:20},children:"Awaiting approval"})]}),"allocated"===o.status&&(0,i.jsxs)("div",{className:"status-alert",style:{background:"#ecfdf5",borderColor:"#d1fae5",color:"#065f46"},children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("strong",{style:{fontSize:14},children:"✓ Transit Pass Active"}),(0,i.jsxs)("div",{style:{fontSize:12,marginTop:2},children:["Assigned Route: ",(0,i.jsx)("strong",{children:e.find(e=>e.code===o.route)?.name})," | Boarding Stop: ",(0,i.jsx)("strong",{children:o.stop}),"."]})]}),(0,i.jsx)("span",{style:{fontSize:11,fontWeight:700,padding:"4px 10px",background:"#ffffff",color:"#059669",borderRadius:20},children:"Pass Status: Active"})]}),(0,i.jsxs)("div",{className:"grid-split",children:[(0,i.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:24},children:["none"===o.status&&(0,i.jsxs)("div",{className:"card-box",children:[(0,i.jsx)("h3",{className:"card-title",children:"✍️ Transit registration"}),(0,i.jsxs)("form",{onSubmit:b,style:{display:"flex",flexDirection:"column",gap:14},children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Select Route Code"}),(0,i.jsx)("select",{className:"form-input",value:d,onChange:t=>{c(t.target.value);let s=e.find(e=>e.code===t.target.value);s&&s.stops&&x(s.stops[0])},children:e.map(e=>(0,i.jsxs)("option",{value:e.code,children:[e.name," (",e.code,")"]},e.code))})]}),v&&(0,i.jsxs)("div",{children:[(0,i.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Boarding Stop"}),(0,i.jsx)("select",{className:"form-input",value:p,onChange:e=>x(e.target.value),children:v.stops?.map(e=>i.jsx("option",{value:e,children:e},e))})]}),(0,i.jsx)("button",{type:"submit",disabled:f,className:"btn-primary",style:{width:"100%"},children:f?"Requesting Transit Pass...":"✓ Submit Transit Registration"})]})]}),"none"!==o.status&&(0,i.jsxs)("div",{className:"card-box",children:[(0,i.jsx)("h3",{className:"card-title",children:"\uD83C\uDF9F Active Transit Pass"}),(0,i.jsxs)("div",{style:{background:"#f8fafc",border:"1px solid #cbd5e1",borderRadius:12,padding:18},children:[(0,i.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",borderBottom:"1px dashed #cbd5e1",paddingBottom:10},children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{style:{fontSize:10,color:"#64748b",fontWeight:800},children:"CAMPUS SHUTTLE PASS"}),(0,i.jsx)("div",{style:{fontSize:14,fontWeight:900,color:"#2563eb",marginTop:4},children:"Ashwanth Kumar"})]}),(0,i.jsxs)("div",{style:{textAlign:"right"},children:[(0,i.jsx)("div",{style:{fontSize:10,color:"#64748b",fontWeight:800},children:"ROUTE CODE"}),(0,i.jsx)("div",{style:{fontSize:14,fontWeight:900,marginTop:4},children:o.route})]})]}),(0,i.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12,fontSize:12},children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("span",{style:{color:"#64748b",fontSize:10,display:"block"},children:"BOARDING STATION"}),(0,i.jsx)("strong",{children:o.stop})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("span",{style:{color:"#64748b",fontSize:10,display:"block"},children:"TIMINGS SCHEDULE"}),(0,i.jsx)("strong",{children:v?.timing})]})]}),(0,i.jsx)("div",{style:{marginTop:14,textAlign:"center",fontSize:10,color:"#94a3b8",fontFamily:"var(--font-mono)"},children:"SECURITY HASH: MD5-PASS-TRN-80419"})]})]}),v&&y&&(0,i.jsxs)("div",{className:"card-box",style:{display:"flex",gap:16,alignItems:"center"},children:[(0,i.jsx)("div",{style:{fontSize:40,background:"#f1f5f9",borderRadius:"50%",width:70,height:70,display:"flex",alignItems:"center",justifyContent:"center"},children:"\uD83D\uDC68‍✈️"}),(0,i.jsxs)("div",{children:[(0,i.jsxs)("h4",{style:{fontSize:14,fontWeight:800},children:["Assigned Driver: ",y.name]}),(0,i.jsxs)("div",{style:{fontSize:11.5,color:"#64748b",marginTop:2},children:["Mobile: ",(0,i.jsx)("strong",{children:y.phone})," | License: ",(0,i.jsx)("strong",{children:y.license})]}),(0,i.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:6,marginTop:8},children:[(0,i.jsx)("span",{className:"star-rating",children:"★".repeat(Math.min(5,Math.max(0,Math.round(y.rating||0))))}),(0,i.jsxs)("span",{style:{fontSize:11.5,fontWeight:700,color:"#475569"},children:["(",y.rating||0," Rating)"]})]})]})]})]}),(0,i.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:24},children:(0,i.jsxs)("div",{className:"card-box",children:[(0,i.jsx)("h3",{className:"card-title",children:"\uD83D\uDCE1 Live GPS Tracker"}),(0,i.jsx)("p",{style:{fontSize:12.5,color:"#64748b",marginBottom:14},children:"Real-time tracking coordinates mapped from the vehicle GPS transponder logs."}),"allocated"!==o.status?(0,i.jsx)("div",{style:{background:"#f8fafc",border:"1px dashed #cbd5e1",borderRadius:12,padding:"40px 10px",textAlign:"center",color:"#64748b",fontSize:12},children:"Live tracking maps will activate once a transport pass has been approved and allocated."}):(0,i.jsxs)("div",{className:"gps-map-mock",children:[(0,i.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #334155",paddingBottom:10},children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("span",{style:{fontSize:10,color:"#10b981",fontWeight:800},children:"● GPS SIGNAL CONNECTED"}),(0,i.jsx)("div",{style:{fontSize:13,fontWeight:900,marginTop:2},children:v?.vehicle})]}),(0,i.jsx)("span",{style:{fontSize:11,background:"#1e293b",padding:"4px 10px",borderRadius:20},children:"Speed: 34 km/h"})]}),(0,i.jsx)("div",{className:"gps-route-line",children:v?.stops?.map((e,t)=>{let s=t===h;return i.jsx("div",{className:`gps-node ${t<h?"passed":""} ${s?"active":""}`,children:i.jsx("div",{className:`gps-label ${s?"active":""}`,children:e})},e)})}),(0,i.jsxs)("div",{style:{fontSize:11,color:"#94a3b8",borderTop:"1px solid #334155",paddingTop:10,display:"flex",justifyContent:"space-between"},children:[(0,i.jsxs)("span",{children:["Next Stop: ",(0,i.jsx)("strong",{children:v?.stops?.[(h+1)%(v?.stops?.length||1)]||"N/A"})]}),(0,i.jsx)("span",{style:{color:"#3b82f6"},children:"ETA: 4 Mins"})]})]})]})})]})]})]})}},61830:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>i});let i=(0,s(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\transport\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),i=t.X(0,[9276,8042,9421],()=>s(99355));module.exports=i})();