(()=>{var e={};e.id=4852,e.ids=[4852],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},40385:(e,t,i)=>{"use strict";i.r(t),i.d(t,{GlobalError:()=>r.a,__next_app__:()=>u,originalPathname:()=>p,pages:()=>c,routeModule:()=>m,tree:()=>d}),i(69177),i(27479),i(35866);var s=i(23191),n=i(88716),a=i(37922),r=i.n(a),l=i(95231),o={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>l[e]);i.d(t,o);let d=["",{children:["alumni",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,69177)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\alumni\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(i.t.bind(i,35866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\alumni\\page.tsx"],p="/alumni/page",u={require:i,loadChunk:()=>Promise.resolve()},m=new s.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/alumni/page",pathname:"/alumni",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},66052:(e,t,i)=>{Promise.resolve().then(i.bind(i,99190))},99190:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>r});var s=i(10326),n=i(17577),a=i(65309);function r(){let[e,t]=(0,n.useState)("directory"),[i,r]=(0,n.useState)([]),[l,o]=(0,n.useState)([]),[d,c]=(0,n.useState)([]),[p,u]=(0,n.useState)([]),[m,f]=(0,n.useState)([]),[x,h]=(0,n.useState)([]),[g,b]=(0,n.useState)(""),[y,j]=(0,n.useState)(""),[v,D]=(0,n.useState)(""),[S,C]=(0,n.useState)(!1),[w,N]=(0,n.useState)("5000"),[k,z]=(0,n.useState)(""),[P,A]=(0,n.useState)(!1),q=async()=>{try{let e=await a.api.get("/api/alumni/stats");r(e.directory||[]),o(e.jobs||[]),c(e.donations||[]),u(e.events||[]),f(e.connects||[]),h(e.referrals||[])}catch{}},R=async e=>{e.preventDefault(),C(!0);try{let e=await a.api.post("/api/alumni/mentorship-request",{mentorName:y,studentName:"Ashwanth Kumar",slot:v});e&&e.ok&&(alert(`Mentorship slot session requested with ${y} ✓`),j(""),D(""),q())}catch{alert("Request failed")}finally{C(!1)}},T=async e=>{try{let t=await a.api.post("/api/alumni/referral-request",{jobId:e,studentName:"Ashwanth Kumar"});t&&t.ok&&(alert("Job referral request submitted to alum! Resume portfolio attached ✓"),q())}catch{alert("Referral request failed")}},W=async e=>{if(e.preventDefault(),!k){alert("Please select a donation campaign drive");return}A(!0);try{let e=await a.api.post("/api/alumni/donate",{campaignId:k,amount:Number(w),contributorName:"Ashwanth Kumar"});e&&e.ok&&(alert("Thank you for contributing to institutional development campaigns! Payment simulator verified ✓"),N("5000"),q())}catch{alert("Donation simulator failed")}finally{A(!1)}},_=i.filter(e=>e.name.toLowerCase().includes(g.toLowerCase())||e.company.toLowerCase().includes(g.toLowerCase())||e.role.toLowerCase().includes(g.toLowerCase())||e.domain.toLowerCase().includes(g.toLowerCase())),B=`
    .alm-wrapper {
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
    .sub-tab-bar {
      display: flex;
      gap: 6px;
      border-bottom: 1px solid #cbd5e1;
      margin-bottom: 24px;
      overflow-x: auto;
    }
    .sub-tab-btn {
      padding: 10px 18px;
      font-size: 13.5px;
      font-weight: 700;
      color: #64748b;
      border: none;
      background: none;
      cursor: pointer;
      border-bottom: 3.5px solid transparent;
      transition: all 0.2s ease;
    }
    .sub-tab-btn.active {
      color: #0f172a;
      border-bottom-color: #0f172a;
    }
    .card-box {
      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, 0.05);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
    }
    .directory-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 18px;
    }
    .profile-card {
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .jobs-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .job-card {
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 20px;
      background: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .campaign-card {
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 20px;
      background: #ffffff;
      margin-bottom: 18px;
    }
    .progress-bar {
      background: #e2e8f0;
      border-radius: 10px;
      height: 10px;
      overflow: hidden;
      width: 100%;
      margin: 10px 0;
    }
    .progress-bar-fill {
      height: 100%;
      background: #10b981;
    }
  `;return(0,s.jsxs)("div",{style:{minHeight:"100vh",background:"#f8fafc",color:"#0f172a",padding:"30px 20px",fontFamily:"var(--font-body), sans-serif"},children:[(0,s.jsx)("style",{dangerouslySetInnerHTML:{__html:B}}),(0,s.jsxs)("div",{className:"alm-wrapper",children:[(0,s.jsx)("h1",{className:"page-title",children:"\uD83C\uDF93 Alumni Portal"}),(0,s.jsx)("div",{className:"sub-tab-bar",children:[{id:"directory",label:"Alumni Directory"},{id:"mentorship",label:"Mentorship Sync"},{id:"jobs",label:"Referrals & Jobs"},{id:"donations",label:"Development Fund"},{id:"events",label:"Reunion Events"}].map(i=>(0,s.jsx)("button",{onClick:()=>t(i.id),className:`sub-tab-btn ${e===i.id?"active":""}`,children:i.label},i.id))}),"directory"===e&&(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:20},children:[(0,s.jsx)("div",{style:{display:"flex",gap:10},children:(0,s.jsx)("input",{type:"text",className:"form-input",style:{width:"100%",maxWidth:400},placeholder:"\uD83D\uDD0D Search alumni by name, company, batch, or domain...",value:g,onChange:e=>b(e.target.value)})}),(0,s.jsx)("div",{className:"directory-grid",children:0===_.length?(0,s.jsx)("div",{style:{gridColumn:"1/-1",textAlign:"center",padding:"60px 0",color:"#64748b"},children:"No alumni directory entries match search query."}):_.map(e=>(0,s.jsxs)("div",{className:"profile-card",children:[(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontSize:11,color:"#64748b",fontWeight:800,marginBottom:6},children:[(0,s.jsxs)("span",{children:["Batch of ",e.batch]}),(0,s.jsx)("span",{children:e.id})]}),(0,s.jsx)("h3",{style:{margin:"0 0 6px 0",fontSize:15,fontWeight:800},children:e.name}),(0,s.jsx)("div",{style:{fontSize:13,color:"#0f172a",fontWeight:600},children:e.role}),(0,s.jsxs)("div",{style:{fontSize:12.5,color:"#475569"},children:["\uD83C\uDFE2 ",e.company]}),(0,s.jsxs)("div",{style:{fontSize:12,color:"#64748b",marginTop:4},children:["Expertise: ",e.domain]})]}),(0,s.jsxs)("div",{style:{borderTop:"1px solid #f1f5f9",paddingTop:10,marginTop:14,display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,s.jsx)("span",{style:{fontSize:11,color:"#64748b"},children:e.email}),(0,s.jsx)("button",{onClick:()=>{t("mentorship"),j(e.name),D(e.slot)},className:"btn-ghost btn-sm",style:{border:"1px solid #cbd5e1",fontSize:11},children:"\uD83D\uDCAC Connect"})]})]},e.id))})]}),"mentorship"===e&&(0,s.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:24},children:[(0,s.jsxs)("div",{className:"card-box",style:{height:"fit-content"},children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83E\uDD1D Request Alumni Mentorship"}),(0,s.jsxs)("form",{onSubmit:R,style:{display:"flex",flexDirection:"column",gap:14},children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Mentor Professional Name"}),(0,s.jsx)("input",{type:"text",required:!0,className:"form-input",placeholder:"e.g. Rahul Varma",value:y,onChange:e=>j(e.target.value)})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Available Sync Slot Time"}),(0,s.jsx)("input",{type:"text",required:!0,className:"form-input",placeholder:"e.g. Saturdays 10-11 AM",value:v,onChange:e=>D(e.target.value)})]}),(0,s.jsx)("button",{type:"submit",disabled:S,className:"btn-primary",style:{width:"100%",marginTop:6},children:S?"Submitting request...":"✓ Schedule Sync Session"})]})]}),(0,s.jsxs)("div",{className:"card-box",children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83D\uDCCB Active Sync Connections"}),0===m.length?(0,s.jsx)("div",{style:{padding:"30px 0",textAlign:"center",color:"#64748b",fontSize:13.5},children:"No mentorship request logs filed yet. Find mentors in directory and click connect!"}):(0,s.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:12},children:m.map(e=>(0,s.jsxs)("div",{style:{padding:14,borderRadius:12,border:"1px solid #e2e8f0",background:"#f8fafc"},children:[(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,s.jsx)("span",{style:{fontWeight:800,fontSize:13.5},children:e.mentorName}),(0,s.jsx)("span",{style:{padding:"3px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"#eff6ff",color:"#1e40af"},children:e.status})]}),(0,s.jsxs)("div",{style:{fontSize:12,color:"#64748b",marginTop:4},children:["Slot Time: ",e.slot]}),(0,s.jsxs)("div",{style:{fontSize:11,color:"#64748b",marginTop:2},children:["Requested Date: ",e.date]})]},e.id))})]})]}),"jobs"===e&&(0,s.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:24},children:(0,s.jsxs)("div",{className:"card-box",children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83D\uDCBC Alumni Job Postings & Referral Gateways"}),(0,s.jsx)("div",{className:"jobs-list",children:l.map(e=>{let t=x.some(t=>t.jobId===e.id);return(0,s.jsxs)("div",{className:"job-card",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("h4",{style:{margin:"0 0 4px 0",fontSize:15,fontWeight:800},children:e.title}),(0,s.jsxs)("div",{style:{fontSize:13,color:"#0f172a",fontWeight:600},children:[e.company," - ",(0,s.jsx)("span",{style:{color:"#64748b",fontWeight:500},children:e.location})]}),(0,s.jsxs)("div",{style:{fontSize:12,color:"#64748b",marginTop:4},children:["Posted By: ",(0,s.jsx)("strong",{children:e.postedBy})," | Salary: ",e.salary]})]}),(0,s.jsx)("div",{children:t?(0,s.jsx)("span",{style:{fontSize:12,color:"var(--teal)",fontWeight:700},children:"✓ Referral Requested"}):(0,s.jsx)("button",{onClick:()=>T(e.id),className:"btn-primary",style:{fontSize:12,padding:"8px 14px"},children:"\uD83C\uDF9F Ask for Referral"})})]},e.id)})})]})}),"donations"===e&&(0,s.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:24},children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("h3",{style:{fontFamily:"var(--font-display)",fontSize:16,fontWeight:800,marginBottom:14},children:"\uD83D\uDE80 Active Development Campaigns"}),d.map(e=>{let t=Math.min(100,Math.round(e.raised/e.goal*100));return(0,s.jsxs)("div",{className:"campaign-card",children:[(0,s.jsx)("h4",{style:{margin:"0 0 8px 0",fontSize:14.5,fontWeight:800},children:e.title}),(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12,color:"#64748b",marginBottom:4},children:[(0,s.jsxs)("span",{children:["Raised: ",(0,s.jsxs)("strong",{children:["₹",e.raised.toLocaleString()]})]}),(0,s.jsxs)("span",{children:["Goal: ₹",e.goal.toLocaleString()]})]}),(0,s.jsx)("div",{className:"progress-bar",children:(0,s.jsx)("div",{className:"progress-bar-fill",style:{width:`${t}%`}})}),(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",fontSize:11,color:"#64748b"},children:[(0,s.jsxs)("span",{children:[t,"% Completed"]}),(0,s.jsxs)("span",{children:[e.contributors," Alumni Contributors"]})]})]},e.id)})]}),(0,s.jsxs)("div",{className:"card-box",style:{height:"fit-content"},children:[(0,s.jsx)("h3",{className:"card-title",children:"\uD83D\uDCB0 Donate to Development Seeds"}),(0,s.jsxs)("form",{onSubmit:W,style:{display:"flex",flexDirection:"column",gap:14},children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Select Campaign *"}),(0,s.jsxs)("select",{className:"form-input",value:k,onChange:e=>z(e.target.value),children:[(0,s.jsx)("option",{value:"",children:"-- Choose Campaign --"}),d.map(e=>(0,s.jsx)("option",{value:e.id,children:e.title},e.id))]})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{style:{fontSize:11,fontWeight:700,color:"#64748b",display:"block",marginBottom:4},children:"Donation Amount (₹) *"}),(0,s.jsx)("input",{type:"number",required:!0,className:"form-input",placeholder:"5000",value:w,onChange:e=>N(e.target.value)})]}),(0,s.jsx)("button",{type:"submit",disabled:P,className:"btn-primary",style:{width:"100%",marginTop:6,background:"#10b981"},children:P?"Simulating payment...":"\uD83D\uDCB3 Contribute Seed Funds"})]})]})]}),"events"===e&&(0,s.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:20},children:[(0,s.jsx)("h3",{style:{fontFamily:"var(--font-display)",fontSize:16,fontWeight:800,marginBottom:4},children:"\uD83C\uDF89 Alumni Reunions & Networking Dinners"}),(0,s.jsx)("div",{className:"directory-grid",children:p.map(e=>(0,s.jsxs)("div",{className:"profile-card",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{style:{fontSize:10,fontWeight:800,background:"#eff6ff",color:"#2563eb",padding:"2px 6px",borderRadius:4,textTransform:"uppercase"},children:"Reunion"}),(0,s.jsx)("h3",{style:{margin:"8px 0 6px 0",fontSize:15,fontWeight:800},children:e.title}),(0,s.jsxs)("div",{style:{fontSize:12.5,color:"#475569",marginBottom:12},children:[(0,s.jsxs)("div",{children:["\uD83D\uDCC5 Date: ",e.date]}),(0,s.jsxs)("div",{children:["\uD83D\uDD52 Time: ",e.time]}),(0,s.jsxs)("div",{children:["\uD83D\uDCCD Venue: ",e.venue]})]})]}),(0,s.jsxs)("div",{style:{borderTop:"1px solid #f1f5f9",paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,s.jsxs)("span",{style:{fontSize:11.5,color:"#64748b"},children:["\uD83D\uDC65 ",e.attendees," Attending"]}),(0,s.jsx)("button",{onClick:()=>{alert("RSVP confirmed! Invitation badge sent to registered email."),q()},className:"btn-primary btn-sm",style:{fontSize:11},children:"✓ Attend"})]})]},e.id))})]})]})]})}},69177:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>s});let s=(0,i(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\alumni\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),s=t.X(0,[9276,8042,9421],()=>i(40385));module.exports=s})();