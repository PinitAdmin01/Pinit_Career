(()=>{var e={};e.id=2326,e.ids=[2326],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},82077:(e,t,i)=>{"use strict";i.r(t),i.d(t,{GlobalError:()=>r.a,__next_app__:()=>u,originalPathname:()=>p,pages:()=>d,routeModule:()=>f,tree:()=>c}),i(67666),i(27479),i(35866);var s=i(23191),a=i(88716),o=i(37922),r=i.n(o),l=i(95231),n={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(n[e]=()=>l[e]);i.d(t,n);let c=["",{children:["hostel",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,67666)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\hostel\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(i.t.bind(i,35866,23)),"next/dist/client/components/not-found-error"]}],d=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\hostel\\page.tsx"],p="/hostel/page",u={require:i,loadChunk:()=>Promise.resolve()},f=new s.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/hostel/page",pathname:"/hostel",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},5341:(e,t,i)=>{Promise.resolve().then(i.bind(i,46796))},46796:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>r});var s=i(10326),a=i(17577),o=i(65309);function r(){let[e,t]=(0,a.useState)([]),[i,r]=(0,a.useState)({requestedRoom:null,status:"none"}),[l,n]=(0,a.useState)([]),[c,d]=(0,a.useState)([]),[p,u]=(0,a.useState)([]),[f,g]=(0,a.useState)({category:"Plumbing",title:"",description:""}),[x,h]=(0,a.useState)({name:"",relation:"",purpose:""}),[m,y]=(0,a.useState)(!1),[b,v]=(0,a.useState)(!1),j=async()=>{try{let e=await o.hi.get("/api/hostel/stats");t(e.rooms||[]),r(e.allocation||{requestedRoom:null,status:"none"}),n(e.attendance||[]),d(e.complaints||[]),u(e.visitors||[])}catch{}},k=async e=>{try{let t=await o.hi.post("/api/hostel/request-room",{roomCode:e});t&&t.ok&&(alert(`Room allocation requested for ${e}! Awaiting warden review approval.`),j())}catch{alert("Request failed.")}},S=async e=>{if("allocated"!==i.status){alert("Roll-call checks are only available for allocated residents.");return}try{let t=await o.hi.post("/api/hostel/log-attendance",{type:e,roomCode:i.requestedRoom});t&&t.ok&&(alert(`Biometric ${e} logged successfully! Nightly roll-call verified.`),j())}catch{alert("Biometric log failed.")}},C=async e=>{e.preventDefault(),y(!0);try{let e=await o.hi.post("/api/hostel/raise-complaint",f);e&&e.ok&&(alert("Complaint filed successfully! Maintenance team has been notified."),g({category:"Plumbing",title:"",description:""}),j())}catch{alert("Failed to raise ticket.")}finally{y(!1)}},D=async e=>{e.preventDefault(),v(!0);try{let e=await o.hi.post("/api/hostel/register-visitor",x);e&&e.ok&&(alert("Visitor security pass generated! Share the ID with the gatekeeper office."),h({name:"",relation:"",purpose:""}),j())}catch{alert("Failed to generate pass.")}finally{v(!1)}},w=async e=>{try{let t=await o.hi.post("/api/hostel/checkout-visitor",{visitorId:e});t&&t.ok&&(alert("Visitor check-out logged successfully."),j())}catch{alert("Check-out failed.")}};return(0,s.jsxs)("div",{style:{minHeight:"100vh",background:"#f8fafc",color:"#0f172a",padding:"30px 20px",fontFamily:"var(--font-body), sans-serif"},children:[(0,s.jsx)("style",{children:`
        .hostel-wrapper {
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
        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }
        .room-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .room-card:hover {
          border-color: #2563eb;
          background: #f8fafc;
        }
        .attendance-fingerprint {
          background: #eff6ff;
          border: 2px dashed #2563eb;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          margin: 16px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .attendance-fingerprint:active {
          transform: scale(0.9);
        }
        .ticket-row {
          background: #f8fafc;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}),(0,s.jsxs)("div",{className:"hostel-wrapper",children:[(0,s.jsx)("h1",{className:"page-title",children:"\uD83C\uDFE2 Hostel Hub"}),"none"===i.status&&(0,s.jsx)("div",{className:"status-alert",style:{background:"#fef2f2",borderColor:"#fee2e2",color:"#991b1b"},children:(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{style:{fontSize:14},children:"⚠️ Accommodation Required"}),(0,s.jsx)("div",{style:{fontSize:12,marginTop:2},children:"You do not currently have any active room allocations. Please pick a room from the catalog grid below."})]})}),"pending"===i.status&&(0,s.jsxs)("div",{className:"status-alert",style:{background:"#fef3c7",borderColor:"#fde68a",color:"#92400e"},children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{style:{fontSize:14},children:"⏳ Allocation Review Pending"}),(0,s.jsxs)("div",{style:{fontSize:12,marginTop:2},children:["Requested Room: ",(0,s.jsx)("strong",{children:i.requestedRoom}),". Wardens are verifying room balances."]})]}),(0,s.jsx)("span",{style:{fontSize:11,fontWeight:700,padding:"4px 10px",background:"#fffbeb",borderRadius:20},children:"Awaiting Warden"})]}),"allocated"===i.status&&(0,s.jsxs)("div",{className:"status-alert",style:{background:"#ecfdf5",borderColor:"#d1fae5",color:"#065f46"},children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{style:{fontSize:14},children:"✓ Accommodation Allocated"}),(0,s.jsxs)("div",{style:{fontSize:12,marginTop:2},children:["Room Code: ",(0,s.jsx)("strong",{children:i.requestedRoom})," | Block B. All facilities activated."]})]}),(0,s.jsx)("span",{style:{fontSize:11,fontWeight:700,padding:"4px 10px",background:"#ffffff",color:"#059669",borderRadius:20},children:"Resident Profile Active"})]}),(0,s.jsxs)("div",{className:"grid-split",children:[(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:24},children:[(0,s.jsxs)("div",{className:"card-box",children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83D\uDD11 Available Hostel Rooms"}),(0,s.jsx)("p",{style:{fontSize:12.5,color:"#64748b",marginBottom:14},children:"Review room counts and select a vacant room to submit allocation check-in requests."}),(0,s.jsx)("div",{className:"rooms-grid",children:e.map(e=>{let t=e.occupied<e.capacity&&"none"===i.status;return(0,s.jsxs)("div",{onClick:()=>t&&k(e.code),className:"room-card",style:{borderColor:t?"#e2e8f0":"#cbd5e1",opacity:t?1:.8,cursor:t?"pointer":"not-allowed"},children:[(0,s.jsx)("div",{style:{fontWeight:800,fontSize:15,color:"#0f172a"},children:e.code}),(0,s.jsx)("div",{style:{fontSize:11,color:"#64748b",marginTop:2},children:e.block}),(0,s.jsxs)("div",{style:{fontSize:11,fontWeight:700,color:e.occupied===e.capacity?"#ef4444":"#059669",marginTop:6},children:[e.occupied," / ",e.capacity," Beds Occupied"]}),t&&(0,s.jsx)("span",{style:{display:"block",fontSize:10,color:"#2563eb",fontWeight:700,marginTop:8},children:"Select Room"})]},e.code)})})]}),(0,s.jsxs)("div",{className:"card-box",children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83D\uDEE0 Maintenance Complaints"}),(0,s.jsxs)("form",{onSubmit:C,style:{display:"flex",flexDirection:"column",gap:12,marginBottom:16},children:[(0,s.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 2fr",gap:10},children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Category"}),(0,s.jsxs)("select",{className:"form-input",value:f.category,onChange:e=>g(t=>({...t,category:e.target.value})),children:[(0,s.jsx)("option",{value:"Plumbing",children:"Plumbing"}),(0,s.jsx)("option",{value:"Electrical",children:"Electrical"}),(0,s.jsx)("option",{value:"Housekeeping",children:"Housekeeping"})]})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Problem Title *"}),(0,s.jsx)("input",{type:"text",className:"form-input",required:!0,placeholder:"e.g. Geyser not working",value:f.title,onChange:e=>g(t=>({...t,title:e.target.value}))})]})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Details Description"}),(0,s.jsx)("textarea",{className:"form-input",rows:2,placeholder:"Provide details about the issue...",value:f.description,onChange:e=>g(t=>({...t,description:e.target.value}))})]}),(0,s.jsx)("button",{type:"submit",disabled:m,className:"btn-primary",style:{alignSelf:"flex-end",fontSize:12},children:m?"Raising ticket...":"Raise Maintenance Ticket"})]}),(0,s.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:8},children:c.map(e=>(0,s.jsxs)("div",{className:"ticket-row",children:[(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{style:{fontSize:13,fontWeight:700},children:[e.title," (",e.category,")"]}),(0,s.jsx)("div",{style:{fontSize:11,color:"#64748b",marginTop:2},children:e.description})]}),(0,s.jsx)("span",{style:{fontSize:10.5,fontWeight:700,padding:"3px 8px",borderRadius:20,background:"Pending"===e.status?"#fef3c7":"#ecfdf5",color:"Pending"===e.status?"#b45309":"#059669"},children:e.status})]},e.id))})]})]}),(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:24},children:[(0,s.jsxs)("div",{className:"card-box",style:{textAlign:"center"},children:[(0,s.jsx)("h3",{className:"card-title",style:{justifyContent:"center"},children:"\uD83D\uDCF8 Room Biometric Roll-Call"}),(0,s.jsx)("p",{style:{fontSize:12,color:"#64748b"},children:"Verify nightly roll-call logs via biometric check-in. Scanner active from 8:00 PM to 10:00 PM."}),(0,s.jsx)("div",{className:"attendance-fingerprint",onClick:()=>S("check-in"),children:"\uD83D\uDC46"}),(0,s.jsxs)("div",{style:{display:"flex",gap:6,justifyContent:"center",marginTop:10},children:[(0,s.jsx)("button",{onClick:()=>S("check-in"),className:"btn-ghost btn-sm",style:{border:"1px solid #e2e8f0",fontSize:11},children:"Log check-in"}),(0,s.jsx)("button",{onClick:()=>S("check-out"),className:"btn-ghost btn-sm",style:{border:"1px solid #e2e8f0",fontSize:11},children:"Log check-out"})]}),(0,s.jsxs)("div",{style:{borderTop:"1px solid #f1f5f9",marginTop:16,paddingTop:12,textAlign:"left",maxHeight:150,overflowY:"auto"},children:[(0,s.jsx)("div",{style:{fontSize:11.5,fontWeight:800,color:"#475569",marginBottom:6,textAlign:"left"},children:"Recent Punch Logs"}),l.map(e=>(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontSize:11,color:"#64748b",padding:"4px 0"},children:[(0,s.jsx)("span",{children:"check-in"===e.type?"\uD83D\uDFE2 Checked In":"\uD83D\uDD34 Checked Out"}),(0,s.jsx)("span",{children:new Date(e.timestamp).toLocaleTimeString()})]},e.id))]})]}),(0,s.jsxs)("div",{className:"card-box",children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83D\uDEC2 Visitor Pass Registry"}),(0,s.jsxs)("form",{onSubmit:D,style:{display:"flex",flexDirection:"column",gap:10,marginBottom:14},children:[(0,s.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:8},children:[(0,s.jsx)("input",{type:"text",className:"form-input",placeholder:"Guest Full Name *",required:!0,value:x.name,onChange:e=>h(t=>({...t,name:e.target.value}))}),(0,s.jsx)("input",{type:"text",className:"form-input",placeholder:"Relation *",required:!0,value:x.relation,onChange:e=>h(t=>({...t,relation:e.target.value}))})]}),(0,s.jsx)("input",{type:"text",className:"form-input",placeholder:"Purpose of visit (e.g. deliver documents)",value:x.purpose,onChange:e=>h(t=>({...t,purpose:e.target.value}))}),(0,s.jsx)("button",{type:"submit",disabled:b,className:"btn-primary",style:{width:"100%",fontSize:11.5},children:b?"Generating Pass...":"✓ Generate Visitor security Pass"})]}),(0,s.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:8},children:p.map(e=>(0,s.jsxs)("div",{style:{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:12,fontSize:12.5},children:[(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontWeight:700},children:[(0,s.jsxs)("span",{children:[e.name," (",e.relation,")"]}),(0,s.jsx)("span",{style:{color:"checked-in"===e.status?"#2563eb":"#64748b"},children:"checked-in"===e.status?"Active Entry":"Checked out"})]}),(0,s.jsxs)("div",{style:{fontSize:11,color:"#64748b",marginTop:4},children:["Purpose: ",e.purpose]}),"checked-in"===e.status&&(0,s.jsx)("button",{onClick:()=>w(e.id),className:"btn-ghost btn-sm",style:{border:"1px solid #cbd5e1",fontSize:11,marginTop:8,width:"100%"},children:"Log checkout Sign-out"})]},e.id))})]})]})]})]})]})}},67666:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>s});let s=(0,i(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\hostel\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),s=t.X(0,[9276,8042,9421],()=>i(82077));module.exports=s})();