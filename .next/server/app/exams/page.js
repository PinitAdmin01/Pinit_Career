(()=>{var e={};e.id=6920,e.ids=[6920],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},95657:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>o.a,__next_app__:()=>p,originalPathname:()=>x,pages:()=>c,routeModule:()=>h,tree:()=>a}),s(2406),s(27479),s(35866);var i=s(23191),r=s(88716),n=s(37922),o=s.n(n),d=s(95231),l={};for(let e in d)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>d[e]);s.d(t,l);let a=["",{children:["exams",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,2406)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\exams\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,35866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\exams\\page.tsx"],x="/exams/page",p={require:s,loadChunk:()=>Promise.resolve()},h=new i.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/exams/page",pathname:"/exams",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:a}})},35202:(e,t,s)=>{Promise.resolve().then(s.bind(s,97593))},97593:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>o});var i=s(10326),r=s(17577),n=s(65309);function o(){let[e,t]=(0,r.useState)("schedule"),[s,o]=(0,r.useState)([]),[d,l]=(0,r.useState)(null),[a,c]=(0,r.useState)(!1),[x,p]=(0,r.useState)(!1),[h,f]=(0,r.useState)(null),g=async()=>{try{let e=await n.hi.get("/api/exams/student-schedule");o(e.schedule||[])}catch(e){console.error("Failed to fetch exam schedule:",e)}},u=async()=>{try{f(null);let e=await n.hi.get("/api/exams/student-results");l(e)}catch(e){console.error("Failed to load exam data:",e),f("Failed to load examination sheets. Please retry.")}};return h?(0,i.jsxs)("div",{style:{padding:40,textAlign:"center",color:"#ef4444"},children:[(0,i.jsx)("p",{style:{marginBottom:12},children:h}),(0,i.jsx)("button",{onClick:()=>{g(),u()},style:{padding:"8px 16px",background:"#3b82f6",color:"#fff",borderRadius:6,border:"none",cursor:"pointer"},children:"Retry"})]}):d?(0,i.jsxs)("div",{style:{minHeight:"100vh",background:"#f8fafc",color:"#0f172a",padding:"30px 20px",fontFamily:"var(--font-body), sans-serif"},children:[(0,i.jsx)("style",{children:`
        .exams-container {
          max-width: 1000px;
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
        .nav-tabs {
          display: flex;
          gap: 6px;
          background: #e2e8f0;
          padding: 4px;
          border-radius: 12px;
          width: fit-content;
          margin-bottom: 24px;
        }
        .tab-btn {
          border: none;
          background: transparent;
          padding: 8px 18px;
          border-radius: 9px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          color: #475569;
          transition: all 0.15s;
        }
        .tab-btn.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
        }
        .card-box {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
        }
        .grid-schedule {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        .slot-card {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          padding: 16px;
          position: relative;
        }
        .slot-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          background: #eff6ff;
          color: #2563eb;
        }
        .tbl-results {
          width: 100%;
          border-collapse: collapse;
        }
        .tbl-results th {
          text-align: left;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          padding-bottom: 12px;
          border-bottom: 1px solid #cbd5e1;
        }
        .tbl-results td {
          padding: 14px 0;
          font-size: 13.5px;
          border-bottom: 1px solid #f1f5f9;
        }
        .badge-grade {
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 800;
          font-size: 11px;
        }
        .badge-green { background: #d1fae5; color: #065f46; }
        .badge-gray { background: #f1f5f9; color: #475569; }
        .badge-red { background: #fee2e2; color: #ef4444; }
        
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
          border-radius: 24px;
          width: 100%;
          max-width: 520px;
          padding: 30px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
        }
        .ticket-body {
          border: 2px dashed #cbd5e1;
          border-radius: 14px;
          padding: 20px;
          margin-top: 16px;
          background: #fafafa;
        }
        .transcript-sheet {
          background: #fff;
          border: 8px double #cbd5e1;
          padding: 30px;
          border-radius: 12px;
          position: relative;
        }
        .watermark {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 48px;
          font-weight: 900;
          color: rgba(15, 23, 42, 0.03);
          pointer-events: none;
          white-space: nowrap;
          text-transform: uppercase;
        }
      `}),(0,i.jsxs)("div",{className:"exams-container",children:[(0,i.jsx)("h1",{className:"page-title",children:"\uD83D\uDCDD Exam Cell & Results Desk"}),(0,i.jsxs)("div",{className:"nav-tabs",children:[(0,i.jsx)("button",{onClick:()=>t("schedule"),className:`tab-btn ${"schedule"===e?"active":""}`,children:"\uD83D\uDCC5 Exam Schedule & Hall Ticket"}),(0,i.jsx)("button",{onClick:()=>t("results"),className:`tab-btn ${"results"===e?"active":""}`,children:"\uD83C\uDF93 Semester Grades & Transcripts"})]}),"schedule"===e&&(0,i.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:20},children:[(0,i.jsxs)("div",{className:"card-box",style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12},children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("h3",{style:{fontFamily:"var(--font-display)",fontSize:16,fontWeight:800},children:"\uD83C\uDFAB Semester Hall Entry Ticket"}),(0,i.jsx)("p",{style:{fontSize:12.5,color:"#64748b",marginTop:4},children:"Download or view your verified entry pass for the upcoming semester laboratory and theory blocks."})]}),(0,i.jsx)("button",{onClick:()=>c(!0),className:"btn-primary",style:{background:"#2563eb",padding:"10px 20px"},children:"\uD83C\uDF9F View Hall Ticket"})]}),(0,i.jsxs)("div",{className:"card-box",children:[(0,i.jsx)("h3",{style:{fontFamily:"var(--font-display)",fontSize:16,fontWeight:800,marginBottom:16},children:"\uD83D\uDDD3 Upcoming Timetable"}),(0,i.jsx)("div",{className:"grid-schedule",children:s.map(e=>(0,i.jsxs)("div",{className:"slot-card",children:[(0,i.jsx)("span",{className:"slot-badge",children:e.slot}),(0,i.jsx)("div",{style:{fontSize:11,fontWeight:800,color:"#2563eb",fontFamily:"var(--font-mono)"},children:e.code}),(0,i.jsx)("div",{style:{fontSize:14,fontWeight:800,color:"#0f172a",margin:"6px 0 10px",maxWidth:"80%"},children:e.course}),(0,i.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:4,fontSize:12,color:"#64748b"},children:[(0,i.jsxs)("div",{children:["\uD83D\uDCC5 Date: ",(0,i.jsx)("strong",{children:new Date(e.date).toLocaleDateString()})]}),(0,i.jsxs)("div",{children:["⏰ Time: ",(0,i.jsx)("strong",{children:e.time})]}),(0,i.jsxs)("div",{children:["\uD83D\uDEAA Assigned Hall: ",(0,i.jsx)("strong",{children:e.room})]})]})]},e.id))})]})]}),"results"===e&&(0,i.jsx)("div",{children:d.isPublished?(0,i.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:20},children:[(0,i.jsxs)("div",{className:"card-box",style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12},children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("h3",{style:{fontFamily:"var(--font-display)",fontSize:16,fontWeight:800},children:"Consolidated Report Card"}),(0,i.jsx)("p",{style:{fontSize:12.5,color:"#64748b",marginTop:4},children:"Marks and grades for all semester course codes are locked and published."})]}),(0,i.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:20},children:[(0,i.jsxs)("div",{style:{textAlign:"right"},children:[(0,i.jsx)("div",{style:{fontSize:11,fontWeight:800,color:"#64748b"},children:"CUMULATIVE GPA"}),(0,i.jsxs)("div",{style:{fontSize:28,fontWeight:900,color:"#10b981"},children:[d.gpa," / 10"]})]}),(0,i.jsx)("button",{onClick:()=>p(!0),className:"btn-primary",style:{background:"#10b981",borderColor:"#10b981",padding:"10px 20px"},children:"\uD83C\uDF93 View Official Transcript"})]})]}),(0,i.jsxs)("div",{className:"card-box",children:[(0,i.jsx)("h3",{style:{fontFamily:"var(--font-display)",fontSize:16,fontWeight:800,marginBottom:16},children:"\uD83D\uDCCA Semester Roster"}),(0,i.jsxs)("table",{className:"tbl-results",children:[(0,i.jsx)("thead",{children:(0,i.jsxs)("tr",{children:[(0,i.jsx)("th",{children:"Course Code"}),(0,i.jsx)("th",{children:"Subject Title"}),(0,i.jsx)("th",{children:"Internal (30)"}),(0,i.jsx)("th",{children:"Semester (70)"}),(0,i.jsx)("th",{children:"Total Marks"}),(0,i.jsx)("th",{children:"Grade"}),(0,i.jsx)("th",{children:"Result"})]})}),(0,i.jsx)("tbody",{children:(d.results||[]).map(e=>{let t=e.internals+e.semester,s=t>=40;return(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{style:{fontFamily:"var(--font-mono)",fontSize:11,fontWeight:700},children:e.code}),(0,i.jsx)("td",{style:{fontWeight:600},children:e.course}),(0,i.jsxs)("td",{children:[e.internals," / 30"]}),(0,i.jsxs)("td",{children:[e.semester," / 70"]}),(0,i.jsxs)("td",{style:{fontWeight:700},children:[t," / 100"]}),(0,i.jsx)("td",{children:(0,i.jsx)("span",{className:`badge-grade ${s?"badge-green":"badge-red"}`,children:e.grade})}),(0,i.jsx)("td",{style:{fontWeight:700,color:s?"#059669":"#dc2626"},children:s?"Pass":"Fail"})]},e.code)})})]})]})]}):(0,i.jsxs)("div",{className:"card-box",style:{background:"#fef2f2",border:"1px solid #fee2e2",textAlign:"center",padding:"40px 20px"},children:[(0,i.jsx)("div",{style:{fontSize:44,marginBottom:12},children:"⚠️"}),(0,i.jsx)("h3",{style:{fontFamily:"var(--font-display)",fontSize:18,fontWeight:800,color:"#991b1b"},children:"Results Audit Status"}),(0,i.jsx)("p",{style:{fontSize:13,color:"#b91c1c",maxWidth:460,margin:"8px auto 0"},children:"The Semester Grades for Academic Year 2025–26 have not been published by the Exam Cell. Marks are currently undergoing board verification audits."}),(0,i.jsx)("div",{style:{fontSize:11,color:"#dc2626",marginTop:14,fontFamily:"var(--font-mono)"},children:"ESTIMATED RELEASE: Immediate after officer audit confirmation."})]})})]}),a&&(0,i.jsx)("div",{className:"overlay",children:(0,i.jsxs)("div",{className:"ticket-modal",children:[(0,i.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #e2e8f0",paddingBottom:12},children:[(0,i.jsx)("h3",{style:{fontFamily:"var(--font-display)",fontSize:16,fontWeight:800},children:"\uD83C\uDFAB Examination Hall entry Ticket"}),(0,i.jsx)("button",{onClick:()=>c(!1),style:{border:"none",background:"none",fontSize:18,cursor:"pointer",color:"#64748b"},children:"✕"})]}),(0,i.jsxs)("div",{className:"ticket-body",children:[(0,i.jsxs)("div",{style:{display:"flex",gap:16,borderBottom:"1px dashed #cbd5e1",paddingBottom:14},children:[(0,i.jsx)("div",{style:{width:64,height:64,borderRadius:8,background:"#cbd5e1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24},children:"\uD83E\uDDD1‍\uD83C\uDF93"}),(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{style:{fontSize:14,fontWeight:800},children:"Ashwanth Kumar"}),(0,i.jsxs)("div",{style:{fontSize:12,color:"#64748b",marginTop:2},children:["Register Number: ",(0,i.jsx)("strong",{children:"BGS2024001"})]}),(0,i.jsxs)("div",{style:{fontSize:12,color:"#64748b"},children:["Major: ",(0,i.jsx)("strong",{children:"Computer Science Engineering"})]})]})]}),(0,i.jsxs)("div",{style:{marginTop:14},children:[(0,i.jsx)("div",{style:{fontSize:11,fontWeight:800,color:"#64748b",marginBottom:8},children:"LICENSED EXAMINATION SCHEDULE"}),(0,i.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:6},children:s.map(e=>(0,i.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12,background:"#ffffff",padding:"8px 12px",borderRadius:8,border:"1px solid #e2e8f0"},children:[(0,i.jsxs)("span",{children:[(0,i.jsx)("strong",{children:e.code})," \xb7 ",(e.course||"").slice(0,24),"..."]}),(0,i.jsx)("span",{style:{color:"#2563eb",fontWeight:700},children:e.room})]},e.id))})]}),(0,i.jsxs)("div",{style:{borderTop:"1px dashed #cbd5e1",marginTop:14,paddingTop:14,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:"#64748b"},children:[(0,i.jsxs)("span",{children:["\uD83D\uDD12 Security Code: ",(0,i.jsx)("strong",{children:"DSAI-ENTRY-PASS"})]}),(0,i.jsx)("button",{onClick:()=>window.print(),className:"btn-ghost btn-sm",style:{border:"1px solid #cbd5e1"},children:"\uD83D\uDDA8 Print Ticket"})]})]})]})}),x&&d.isPublished&&(0,i.jsx)("div",{className:"overlay",children:(0,i.jsx)("div",{className:"ticket-modal",style:{maxWidth:540,padding:0},children:(0,i.jsxs)("div",{className:"transcript-sheet",children:[(0,i.jsx)("div",{className:"watermark",children:"OFFICIAL TRANSCRIPT"}),(0,i.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:"3px double #0f172a",paddingBottom:14,marginBottom:20},children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("h3",{style:{fontFamily:"var(--font-display)",fontSize:15,fontWeight:900},children:"BGS INSTITUTE OF MANAGEMENT"}),(0,i.jsx)("div",{style:{fontSize:10,color:"#64748b",fontFamily:"var(--font-mono)"},children:"EXAMINATION CONTROL CELL OFFICE"})]}),(0,i.jsx)("button",{onClick:()=>p(!1),style:{border:"none",background:"none",fontSize:18,cursor:"pointer",color:"#64748b"},children:"✕"})]}),(0,i.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,fontSize:12,marginBottom:20,background:"#f8fafc",padding:12,borderRadius:8,border:"1px solid #cbd5e1"},children:[(0,i.jsxs)("div",{children:["Name: ",(0,i.jsx)("strong",{children:"Ashwanth Kumar"})]}),(0,i.jsxs)("div",{children:["Reg No: ",(0,i.jsx)("strong",{children:"BGS2024001"})]}),(0,i.jsxs)("div",{children:["Program: ",(0,i.jsx)("strong",{children:"B.Tech CSE"})]}),(0,i.jsxs)("div",{children:["Date Issued: ",(0,i.jsx)("strong",{children:new Date().toLocaleDateString()})]})]}),(0,i.jsxs)("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:20},children:[(0,i.jsx)("thead",{children:(0,i.jsxs)("tr",{style:{borderBottom:"2px solid #0f172a",fontWeight:800},children:[(0,i.jsx)("th",{style:{textAlign:"left",padding:"6px 0"},children:"Code"}),(0,i.jsx)("th",{style:{textAlign:"left"},children:"Course Title"}),(0,i.jsx)("th",{style:{textAlign:"center"},children:"Grade"}),(0,i.jsx)("th",{style:{textAlign:"right"},children:"Credits"})]})}),(0,i.jsx)("tbody",{children:(d.results||[]).map(e=>(0,i.jsxs)("tr",{style:{borderBottom:"1px solid #f1f5f9"},children:[(0,i.jsx)("td",{style:{fontFamily:"var(--font-mono)",padding:"8px 0"},children:e.code}),(0,i.jsx)("td",{children:e.course}),(0,i.jsx)("td",{style:{textAlign:"center",fontWeight:700},children:e.grade}),(0,i.jsx)("td",{style:{textAlign:"right",fontWeight:700},children:"4.0"})]},e.code))})]}),(0,i.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-end",borderTop:"2px solid #cbd5e1",paddingTop:16},children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{style:{fontSize:10,color:"#64748b"},children:"VERIFICATION SECURITY QR"}),(0,i.jsx)("div",{style:{width:54,height:54,background:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:"1px solid #cbd5e1",marginTop:4},children:"\uD83C\uDFC1"})]}),(0,i.jsxs)("div",{style:{textAlign:"right",fontSize:13},children:[(0,i.jsxs)("div",{children:["Cumulative CGPA: ",(0,i.jsx)("strong",{style:{color:"#10b981",fontSize:16},children:d.gpa})]}),(0,i.jsx)("div",{style:{fontSize:10,color:"#64748b",marginTop:6},children:"CONTROLLER OF EXAMINATIONS"}),(0,i.jsx)("div",{style:{fontSize:10,fontWeight:700,color:"#0f172a"},children:"[DIGITALLY SEALED]"})]})]}),(0,i.jsx)("div",{style:{marginTop:20,textAlign:"right"},children:(0,i.jsx)("button",{onClick:()=>window.print(),className:"btn-submit",style:{width:"auto",padding:"8px 16px",background:"#10b981"},children:"\uD83D\uDDA8 Print Transcript"})})]})})})]}):(0,i.jsx)("div",{style:{padding:40,textAlign:"center",color:"#64748b"},children:"Loading examination sheets..."})}},2406:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>i});let i=(0,s(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\exams\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),i=t.X(0,[9276,8042,9421],()=>s(95657));module.exports=i})();