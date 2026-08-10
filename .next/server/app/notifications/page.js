(()=>{var e={};e.id=5193,e.ids=[5193],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},96e3:(e,t,i)=>{"use strict";i.r(t),i.d(t,{GlobalError:()=>r.a,__next_app__:()=>x,originalPathname:()=>p,pages:()=>c,routeModule:()=>f,tree:()=>d}),i(93468),i(27479),i(35866);var s=i(23191),n=i(88716),a=i(37922),r=i.n(a),o=i(95231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);i.d(t,l);let d=["",{children:["notifications",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,93468)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\notifications\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(i.t.bind(i,35866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\notifications\\page.tsx"],p="/notifications/page",x={require:i,loadChunk:()=>Promise.resolve()},f=new s.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/notifications/page",pathname:"/notifications",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},20416:(e,t,i)=>{Promise.resolve().then(i.bind(i,36130))},36130:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>l});var s=i(10326),n=i(17577),a=i(65309),r=i(42344);let o={success:{icon:"✓",color:"#10b981",bg:"#eff6ff"},warning:{icon:"⚠",color:"#f59e0b",bg:"#fef3c7"},danger:{icon:"✗",color:"#ef4444",bg:"#fee2e2"},info:{icon:"◎",color:"#3b82f6",bg:"#dbeafe"}};function l(){let[e,t]=(0,n.useState)("announcements"),{data:i,isLoading:l}=(0,r.zn)();(0,r.oj)();let[d,c]=(0,n.useState)([]),[p,x]=(0,n.useState)([]),[f,m]=(0,n.useState)([]),[g,u]=(0,n.useState)(null),[b,h]=(0,n.useState)("New Job Referral Match"),[y,j]=(0,n.useState)("Rahul Varma has approved your referral request for NVIDIA."),[v,S]=(0,n.useState)(null),w=async()=>{try{await a.hi.post("/api/notifications/mark-all-read",{}),alert("All notifications marked as read ✓"),window.location.reload()}catch{}},k=Array.isArray(i)?i:i?.notifications||[],N=k.filter(e=>!e.is_read).length,D=`
    .comm-wrapper {
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
    .tab-bar {
      display: flex;
      gap: 6px;
      border-bottom: 1px solid #cbd5e1;
      margin-bottom: 24px;
      overflow-x: auto;
    }
    .tab-btn {
      padding: 10px 18px;
      font-size: 13.5px;
      font-weight: 700;
      color: #64748b;
      border: none;
      background: none;
      cursor: pointer;
      border-bottom: 3.5px solid transparent;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tab-btn.active {
      color: #0f172a;
      border-bottom-color: #0f172a;
    }
    .badge-count {
      background: #ef4444;
      color: #ffffff;
      font-size: 10px;
      font-weight: 800;
      padding: 1.5px 5px;
      border-radius: 10px;
    }
    .card-box {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.05);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
    }
    .announcement-card {
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 20px;
      background: #ffffff;
      margin-bottom: 14px;
      transition: all 0.2s ease;
    }
    .announcement-card:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);
    }
    .email-inbox-grid {
      display: grid;
      grid-template-columns: 1.2fr 1.8fr;
      gap: 20px;
      min-height: 400px;
    }
    .email-item {
      padding: 14px;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .email-item:hover {
      background: #f8fafc;
    }
    .email-item.selected {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
    }
    .phone-screen {
      width: 320px;
      height: 560px;
      border: 12px solid #1e293b;
      border-radius: 36px;
      background: #0f172a;
      margin: 0 auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .phone-header {
      height: 24px;
      background: #1e293b;
      color: #94a3b8;
      font-size: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
    }
    .phone-body {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f1f5f9;
    }
    .sms-bubble {
      background: #ffffff;
      color: #0f172a;
      border-radius: 14px;
      padding: 10px 14px;
      font-size: 12px;
      max-width: 85%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      align-self: flex-start;
      border-bottom-left-radius: 2px;
    }
    .sms-time {
      font-size: 9px;
      color: #94a3b8;
      margin-top: 4px;
      text-align: right;
    }
    .sms-sender {
      font-weight: 700;
      font-size: 10px;
      color: #64748b;
      margin-bottom: 2px;
    }
    .push-banner-overlay {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 340px;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 16px;
      color: #ffffff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 9999;
      animation: push-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes push-slide-in {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;return(0,s.jsxs)("div",{style:{minHeight:"100vh",background:"#f8fafc",color:"#0f172a",padding:"30px 20px",fontFamily:"var(--font-body), sans-serif"},children:[(0,s.jsx)("style",{dangerouslySetInnerHTML:{__html:D}}),v&&(0,s.jsxs)("div",{className:"push-banner-overlay",children:[(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6},children:[(0,s.jsx)("span",{style:{fontSize:10,fontWeight:800,textTransform:"uppercase",color:"#3b82f6",letterSpacing:.4},children:"\uD83D\uDCF2 Push Notification Alert"}),(0,s.jsx)("span",{style:{fontSize:10,color:"#94a3b8"},children:v.timestamp})]}),(0,s.jsx)("strong",{style:{display:"block",fontSize:13},children:v.title}),(0,s.jsx)("p",{style:{fontSize:12,color:"#e2e8f0",margin:"4px 0 0 0",lineHeight:1.4},children:v.message})]}),(0,s.jsxs)("div",{className:"comm-wrapper",children:[(0,s.jsx)("h1",{className:"page-title",children:"\uD83D\uDCE2 Campus Communication Hub"}),(0,s.jsx)("div",{className:"tab-bar",children:[{id:"announcements",label:"Announcement Board"},{id:"notifications",label:"System Alerts",count:N},{id:"emails",label:"Email Box"},{id:"sms",label:"SMS Feed"},{id:"tester",label:"Push Notifications"}].map(i=>(0,s.jsxs)("button",{onClick:()=>t(i.id),className:`tab-btn ${e===i.id?"active":""}`,children:[i.label,void 0!==i.count&&i.count>0&&(0,s.jsx)("span",{className:"badge-count",children:i.count})]},i.id))}),"announcements"===e&&(0,s.jsxs)("div",{className:"card-box",children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83D\uDCE3 Campus Announcement Bulletins"}),(0,s.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:6},children:d.map(e=>(0,s.jsxs)("div",{className:"announcement-card",children:[(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8},children:[(0,s.jsx)("span",{style:{padding:"3px 8px",borderRadius:6,fontSize:10,fontWeight:800,background:"Academics"===e.category?"#eff6ff":"#f1f5f9",color:"Academics"===e.category?"#2563eb":"#475569"},children:e.category}),(0,s.jsxs)("span",{style:{fontSize:11,color:"#64748b"},children:["\uD83D\uDCC5 Date: ",e.date]})]}),(0,s.jsx)("h4",{style:{margin:"0 0 6px 0",fontSize:15,fontWeight:800},children:e.title}),(0,s.jsx)("p",{style:{margin:0,fontSize:13,color:"#475569",lineHeight:1.5},children:e.message})]},e.id))})]}),"notifications"===e&&(0,s.jsxs)("div",{className:"card-box",children:[(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18},children:[(0,s.jsx)("h3",{className:"card-title",style:{margin:0},children:"\uD83D\uDD14 Individual System Alerts"}),N>0&&(0,s.jsx)("button",{onClick:w,className:"btn-ghost btn-sm",children:"✓ Mark All Read"})]}),l?(0,s.jsx)("div",{children:"Loading alert log..."}):0===k.length?(0,s.jsx)("div",{style:{padding:"40px 0",textAlign:"center",color:"#64748b"},children:"All caught up! No notifications yet."}):(0,s.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:8},children:k.map(e=>{let t=o[e.type]||o.info;return(0,s.jsxs)("div",{style:{padding:14,borderRadius:12,border:"1px solid #e2e8f0",background:e.is_read?"#f8fafc":"#ffffff",display:"flex",gap:14,alignItems:"flex-start",opacity:e.is_read?.75:1},children:[(0,s.jsx)("div",{style:{width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:t.bg,color:t.color,fontSize:14,fontWeight:900},children:t.icon}),(0,s.jsxs)("div",{style:{flex:1},children:[(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,s.jsx)("strong",{style:{fontSize:13.5},children:e.title}),(0,s.jsx)("span",{style:{fontSize:10,color:"#94a3b8"},children:e.source})]}),(0,s.jsx)("p",{style:{margin:"4px 0 0 0",fontSize:12.5,color:"#475569"},children:e.message})]})]},e.id)})})]}),"emails"===e&&(0,s.jsxs)("div",{className:"card-box email-inbox-grid",children:[(0,s.jsx)("div",{style:{borderRight:"1px solid #e2e8f0",overflowY:"auto",maxHeight:420},children:0===p.length?(0,s.jsx)("div",{style:{padding:20,textAlign:"center",color:"#64748b"},children:"No emails."}):p.map(e=>(0,s.jsxs)("div",{className:`email-item ${g?.id===e.id?"selected":""}`,onClick:()=>u(e),children:[(0,s.jsx)("div",{style:{fontSize:10,color:"#64748b",marginBottom:2},children:e.sender}),(0,s.jsx)("strong",{style:{display:"block",fontSize:12.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:e.subject}),(0,s.jsx)("span",{style:{fontSize:9.5,color:"#94a3b8"},children:e.date})]},e.id))}),(0,s.jsx)("div",{style:{padding:"0 10px",display:"flex",flexDirection:"column"},children:g?(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{style:{borderBottom:"1px solid #f1f5f9",paddingBottom:14,marginBottom:14},children:[(0,s.jsx)("h3",{style:{margin:"0 0 6px 0",fontSize:16,fontWeight:800},children:g.subject}),(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12,color:"#64748b"},children:[(0,s.jsxs)("span",{children:["From: ",(0,s.jsx)("strong",{children:g.sender})]}),(0,s.jsx)("span",{children:g.date})]})]}),(0,s.jsx)("p",{style:{fontSize:13.5,color:"#334155",lineHeight:1.6,whiteSpace:"pre-line"},children:g.body})]}):(0,s.jsx)("div",{style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#64748b",fontSize:13},children:"Select an email to read its contents."})})]}),"sms"===e&&(0,s.jsxs)("div",{className:"card-box",children:[(0,s.jsx)("h3",{className:"card-title",style:{textAlign:"center",marginBottom:18},children:"\uD83D\uDCF1 Mock mobile Phone SMS Screen"}),(0,s.jsxs)("div",{className:"phone-screen",children:[(0,s.jsxs)("div",{className:"phone-header",children:[(0,s.jsx)("span",{children:"CAMPUS-OS NETWORK"}),(0,s.jsx)("span",{children:"10:42 AM"})]}),(0,s.jsx)("div",{className:"phone-body",children:f.map(e=>(0,s.jsxs)("div",{className:"sms-bubble",children:[(0,s.jsx)("div",{className:"sms-sender",children:e.sender}),(0,s.jsx)("div",{children:e.text}),(0,s.jsx)("div",{className:"sms-time",children:e.date})]},e.id))})]})]}),"tester"===e&&(0,s.jsxs)("div",{className:"card-box",style:{maxWidth:540,margin:"0 auto"},children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83D\uDCF2 Push Notification Simulator Sandbox"}),(0,s.jsx)("p",{style:{fontSize:13,color:"#64748b",marginBottom:18},children:"Configure a mock alert context and trigger a real-time toaster overlay to preview client-side push notification prompts."}),(0,s.jsxs)("form",{onSubmit:e=>{e.preventDefault(),S({title:b,message:y,timestamp:new Date().toLocaleTimeString()}),setTimeout(()=>{S(null)},4500)},style:{display:"flex",flexDirection:"column",gap:14},children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Alert Title *"}),(0,s.jsx)("input",{type:"text",required:!0,className:"form-input",value:b,onChange:e=>h(e.target.value)})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Alert Message Context *"}),(0,s.jsx)("textarea",{required:!0,className:"form-input",style:{minHeight:80,resize:"vertical"},value:y,onChange:e=>j(e.target.value)})]}),(0,s.jsx)("button",{type:"submit",className:"btn-primary",style:{width:"100%",marginTop:6,background:"#2563eb"},children:"⚡ Trigger Live Push Alert Overlay"})]})]})]})]})}},93468:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>s});let s=(0,i(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\notifications\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),s=t.X(0,[9276,8042,9421],()=>i(96e3));module.exports=s})();