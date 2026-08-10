(()=>{var e={};e.id=38,e.ids=[38],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},56145:(e,t,i)=>{"use strict";i.r(t),i.d(t,{GlobalError:()=>n.a,__next_app__:()=>f,originalPathname:()=>p,pages:()=>c,routeModule:()=>x,tree:()=>d}),i(2072),i(27479),i(35866);var a=i(23191),r=i(88716),s=i(37922),n=i.n(s),o=i(95231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);i.d(t,l);let d=["",{children:["events",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,2072)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\events\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(i.t.bind(i,35866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\events\\page.tsx"],p="/events/page",f={require:i,loadChunk:()=>Promise.resolve()},x=new a.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/events/page",pathname:"/events",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},3859:(e,t,i)=>{Promise.resolve().then(i.bind(i,23206))},23206:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>n});var a=i(10326),r=i(17577),s=i(65309);function n(){let[e,t]=(0,r.useState)([]),[i,n]=(0,r.useState)([]),[o,l]=(0,r.useState)("All"),[d,c]=(0,r.useState)(!1),[p,f]=(0,r.useState)(null),x=async()=>{try{let e=await s.api.get("/api/events/stats");t(e.catalog||[]),n(e.rsvps||[])}catch{}},m=async e=>{try{let t=await s.api.post("/api/events/rsvp",{eventId:e,studentName:"Ashwanth Kumar"});t&&t.ok?(alert("RSVP confirmed! See you at the event \uD83C\uDF89"),x()):alert(t.error||"Failed to RSVP.")}catch{alert("Error confirming RSVP.")}},u=e=>i.some(t=>t.eventId===e&&"Ashwanth Kumar"===t.studentName),g=e=>i.find(t=>t.eventId===e&&"Ashwanth Kumar"===t.studentName),h=e.filter(e=>!e.completed&&("All"===o||e.category===o)),v=e.filter(e=>e.completed).map(e=>{let t=g(e.id);return t?{...e,rsvpInfo:t}:null}).filter(Boolean);return(0,a.jsxs)("div",{style:{minHeight:"100vh",background:"#f8fafc",color:"#0f172a",padding:"30px 20px",fontFamily:"var(--font-body), sans-serif"},children:[(0,a.jsx)("style",{children:`
        .evt-wrapper {
          max-width: 1040px;
          margin: 0 auto;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .page-title {
          font-family: var(--font-display), sans-serif;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.6px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;
        }
        .filter-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .filter-btn {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-btn.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .evt-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .evt-badge {
          align-self: flex-start;
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .evt-title {
          font-family: var(--font-display), sans-serif;
          font-size: 16px;
          font-weight: 800;
          margin: 0 0 8px 0;
        }
        .evt-desc {
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 16px;
        }
        .evt-meta {
          font-size: 12px;
          color: #64748b;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }
        .evt-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .card-box {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
        }
        .cert-card {
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
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
        .cert-modal {
          background: #ffffff;
          border-radius: 20px;
          width: 90%;
          max-width: 680px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
        }
        .cert-border {
          border: 8px double #0f172a;
          padding: 30px;
          text-align: center;
          background: #fdfdfd;
          position: relative;
        }
      `}),(0,a.jsxs)("div",{className:"evt-wrapper",children:[(0,a.jsx)("div",{className:"page-header",children:(0,a.jsx)("h1",{className:"page-title",children:"\uD83C\uDF89 Campus Events Hub"})}),(0,a.jsx)("div",{className:"filter-bar",children:["All","Hackathons","Seminars","Clubs","General"].map(e=>(0,a.jsx)("button",{onClick:()=>l(e),className:`filter-btn ${o===e?"active":""}`,children:e},e))}),(0,a.jsx)("div",{className:"events-grid",children:0===h.length?(0,a.jsx)("div",{style:{gridColumn:"1/-1",textAlign:"center",padding:"60px 0",color:"#64748b"},children:"No upcoming campus events listed in category."}):h.map(e=>{let t=u(e.id),i=e.rsvpCount>=e.capacity;return(0,a.jsxs)("div",{className:"evt-card",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("span",{className:"evt-badge",style:{background:"Hackathons"===e.category?"#fee2e2":"Seminars"===e.category?"#eff6ff":"#f3e8ff",color:"Hackathons"===e.category?"#ef4444":"Seminars"===e.category?"#2563eb":"#9333ea"},children:e.category}),(0,a.jsx)("h3",{className:"evt-title",children:e.title}),(0,a.jsx)("p",{className:"evt-desc",children:e.description})]}),(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:"evt-meta",children:[(0,a.jsxs)("div",{className:"evt-meta-item",children:[(0,a.jsx)("span",{children:"\uD83D\uDCC5"})," ",(0,a.jsx)("strong",{children:new Date(e.date).toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"})})]}),(0,a.jsxs)("div",{className:"evt-meta-item",children:[(0,a.jsx)("span",{children:"\uD83D\uDD52"})," ",e.time]}),(0,a.jsxs)("div",{className:"evt-meta-item",children:[(0,a.jsx)("span",{children:"\uD83D\uDCCD"})," ",e.venue]}),(0,a.jsxs)("div",{className:"evt-meta-item",children:[(0,a.jsx)("span",{children:"\uD83D\uDC65"})," Capacity: ",e.rsvpCount," / ",e.capacity," Seats Filled"]}),(0,a.jsxs)("div",{className:"evt-meta-item",children:[(0,a.jsx)("span",{children:"\uD83C\uDFEB"})," Host: ",e.host]})]}),t?(0,a.jsx)("button",{className:"btn-ghost",disabled:!0,style:{width:"100%",border:"1.5px solid #22c55e",color:"#22c55e",background:"#f0fdf4",fontWeight:700},children:"✓ RSVP Confirmed"}):(0,a.jsx)("button",{onClick:()=>m(e.id),disabled:i,className:"btn-primary",style:{width:"100%"},children:i?"\uD83D\uDEAB Full Capacity":"\uD83C\uDF9F RSVP Now"})]})]},e.id)})}),(0,a.jsxs)("div",{className:"card-box",style:{marginTop:24},children:[(0,a.jsx)("h3",{style:{fontFamily:"var(--font-display)",fontSize:16,fontWeight:800,marginBottom:16},children:"\uD83D\uDCDC Event Participation Certificates"}),0===v.length?(0,a.jsx)("div",{style:{padding:"30px 0",textAlign:"center",color:"#64748b",fontSize:13.5},children:"No completed events with RSVP confirmations found. Certificates unlock automatically once coordinators close events."}):v.map(e=>(0,a.jsxs)("div",{className:"cert-card",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{style:{fontSize:14},children:e.title}),(0,a.jsxs)("div",{style:{fontSize:11.5,color:"#64748b",marginTop:4},children:["Held: ",e.date," | Category: ",e.category]})]}),e.rsvpInfo.hasCertificate?(0,a.jsx)("button",{onClick:()=>f(e),className:"btn-ghost btn-sm",style:{border:"1.5px solid #0f172a",color:"#0f172a",padding:"6px 12px"},children:"\uD83C\uDF93 View Certificate"}):(0,a.jsx)("span",{style:{fontSize:12,color:"#f59e0b",fontWeight:600},children:"⌛ Processing Approval"})]},e.id))]})]}),p&&(0,a.jsx)("div",{className:"overlay",children:(0,a.jsxs)("div",{className:"cert-modal",children:[(0,a.jsxs)("div",{className:"cert-border",children:[(0,a.jsx)("div",{style:{fontFamily:"Georgia, serif",fontSize:32,fontWeight:"bold",color:"#0f172a",marginBottom:12},children:"Certificate of Participation"}),(0,a.jsx)("div",{style:{fontSize:14,fontStyle:"italic",color:"#475569",marginBottom:20},children:"This is proudly presented to"}),(0,a.jsx)("div",{style:{fontSize:24,fontWeight:800,textDecoration:"underline",color:"#0f172a",marginBottom:18},children:"ASHWANTH KUMAR"}),(0,a.jsxs)("div",{style:{fontSize:13.5,color:"#334155",maxWidth:480,margin:"0 auto",lineHeight:1.6,marginBottom:24},children:["for outstanding active attendance and contributions during the campus event ",(0,a.jsx)("strong",{children:p.title}),", hosted by the ",p.host," on ",p.date," at ",p.venue,"."]}),(0,a.jsxs)("div",{style:{display:"flex",justifyContent:"space-around",alignItems:"center",marginTop:40},children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{style:{fontSize:13,fontWeight:700,borderBottom:"1px solid #94a3b8",width:140,margin:"0 auto 4px auto",paddingBottom:6},children:"PinIT Dean"}),(0,a.jsx)("div",{style:{fontSize:10,color:"#64748b"},children:"Authorized Signatory"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{style:{fontFamily:"monospace",fontSize:12,fontWeight:700,color:"#0f172a"},children:p.rsvpInfo.certificateCode}),(0,a.jsx)("div",{style:{fontSize:10,color:"#64748b"},children:"Verification Hash ID"})]})]})]}),(0,a.jsxs)("div",{style:{display:"flex",justifyContent:"flex-end",gap:10,marginTop:24},children:[(0,a.jsx)("button",{onClick:()=>window.print(),className:"btn-ghost",style:{border:"1.5px solid #0f172a"},children:"\uD83D\uDDA8 Print Layout"}),(0,a.jsx)("button",{onClick:()=>f(null),className:"btn-primary",style:{background:"#0f172a"},children:"✕ Close Vault"})]})]})})]})}},2072:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>a});let a=(0,i(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\events\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),a=t.X(0,[9276,8042,9421],()=>i(56145));module.exports=a})();