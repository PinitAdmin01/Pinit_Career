(()=>{var e={};e.id=1931,e.ids=[1931],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},18377:(e,s,a)=>{"use strict";a.r(s),a.d(s,{GlobalError:()=>n.a,__next_app__:()=>x,originalPathname:()=>p,pages:()=>d,routeModule:()=>h,tree:()=>c}),a(35480),a(27479),a(35866);var r=a(23191),i=a(88716),t=a(37922),n=a.n(t),o=a(95231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);a.d(s,l);let c=["",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,35480)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\page.tsx"]}]},{layout:[()=>Promise.resolve().then(a.bind(a,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,35866,23)),"next/dist/client/components/not-found-error"]}],d=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\page.tsx"],p="/page",x={require:a,loadChunk:()=>Promise.resolve()},h=new r.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/page",pathname:"/",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},7042:(e,s,a)=>{Promise.resolve().then(a.bind(a,9805))},9805:(e,s,a)=>{"use strict";a.r(s),a.d(s,{default:()=>h});var r=a(10326),i=a(17577),t=a(35047),n=a(90434),o=a(57112),l=a(71632),c=a(37439);function d(e,s){let a=e?.toLowerCase()||"",r=s?.toLowerCase()||"";return"admin@pinit.in"===a||"admin"===r||"superadmin"===r?"/admin":"teacher"===r||"faculty"===r?"/admin/teacher":"rec@pinit.in"===a||"recruiter"===r?"/recruiter":"con@pinit.in"===a||"consultant"===r?"/consultant":"parent"===r?"/parent":"/dashboard"}function p({onClose:e,preselectRole:s,loginFn:a}){let o=(0,t.useRouter)(),[c,p]=(0,i.useState)("password"),[x,h]=(0,i.useState)({username:"",password:""}),[m,g]=(0,i.useState)(""),[u,b]=(0,i.useState)(!1),[f,j]=(0,i.useState)(!1),[v,w]=(0,i.useState)(null),[y,N]=(0,i.useState)(null),[k,F]=(0,i.useState)("loading"),[D,C]=(0,i.useState)(300),[A,z]=(0,i.useState)(""),[E,B]=(0,i.useState)(!1),[S,P]=(0,i.useState)(!1),I=(0,i.useRef)(null);(0,i.useCallback)(async()=>{I.current&&(I.current(),I.current=null),F("loading"),C(300),w(null),N(null),z(""),P(!1);try{let{data:e,error:s}=await l.O.from("qr_login_sessions").insert({status:"ready",expires_at:new Date(Date.now()+3e5).toISOString()}).select().single();if(s)throw s;let r=e.id;w(r);let i=`${window.location.origin}/qr-confirm?token=${r}`;N(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(i)}&bgcolor=ffffff&color=2563eb&margin=10&format=svg`),F("ready");let t=l.O.channel(`qr-login-${r}`).on("postgres_changes",{event:"*",schema:"public",table:"qr_login_sessions",filter:`id=eq.${r}`},async e=>{let s=e.new;if(s){if("scanned"===s.status)F("scanned"),z("Phone scanned — verifying biometrics...");else if("confirmed"===s.status){F("confirmed"),z("Biometrics Confirmed! Logging in...");try{if(s.access_token&&s.refresh_token){await l.O.auth.setSession({access_token:s.access_token,refresh_token:s.refresh_token});let{data:{user:e}}=await l.O.auth.getUser();if(!e)throw Error("Auth session sync failed");await l.O.from("qr_login_sessions").delete().eq("id",r),o.push(d(e.email,e.user_metadata?.role||"student"))}else if(s.email&&s.password){let e=await a(s.email,s.password);await l.O.from("qr_login_sessions").delete().eq("id",r),o.push(d(e?.email,e?.role))}}catch(e){F("expired"),z("Authentication failed: "+e.message)}}else"expired"===s.status&&(F("expired"),z("Session expired."))}}).subscribe();I.current=()=>{l.O.removeChannel(t)}}catch{let e="mock-sim-"+Math.random().toString(36).substring(2,11);w(e),P(!0);let s=`${window.location.origin}/qr-confirm?token=${e}`;N(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(s)}&bgcolor=ffffff&color=2563eb&margin=10&format=svg`),F("ready"),z("Local simulator mode (Offline Broker)"),localStorage.setItem(`qr_session_${e}`,JSON.stringify({status:"ready",createdAt:Date.now(),expiresAt:Date.now()+3e5}))}},[a,o]);let R=async e=>{e.preventDefault(),b(!0),g("");try{let e=await a(x.username,x.password);o.push(d(e?.email,e?.role))}catch(e){g(e?.message||"Invalid username or password.")}finally{b(!1)}},W=String(Math.floor(D/60)).padStart(2,"0"),M=String(D%60).padStart(2,"0");return(0,r.jsx)("div",{className:"modal-mask-overlay",onClick:s=>{s.target===s.currentTarget&&e()},children:(0,r.jsxs)("div",{className:"modal-body-container",children:[(0,r.jsx)("button",{onClick:e,className:"modal-dismiss-btn",children:"✕"}),(0,r.jsx)("h2",{className:"modal-header-title",children:"Sign In"}),(0,r.jsx)("p",{className:"modal-header-desc",children:"Log in to access your dashboard workspace"}),(0,r.jsx)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,background:"#f1f5f9",padding:4,borderRadius:10,marginBottom:20},children:["password","qr"].map(e=>(0,r.jsx)("button",{onClick:()=>p(e),style:{padding:"8px 10px",borderRadius:8,fontSize:12.5,fontWeight:700,cursor:"pointer",border:"none",background:c===e?"#ffffff":"transparent",color:c===e?"#0f172a":"#64748b",boxShadow:c===e?"0 1px 4px rgba(0,0,0,0.06)":"none",transition:"all 0.2s"},children:"password"===e?"Password":"Scan QR"},e))}),"password"===c?(0,r.jsxs)("form",{onSubmit:R,style:{display:"flex",flexDirection:"column",gap:14},children:[(0,r.jsxs)("div",{className:"input-group-vertical",children:[(0,r.jsx)("label",{className:"input-label",children:"Username / Email"}),(0,r.jsx)("input",{type:"text",value:x.username,onChange:e=>h(s=>({...s,username:e.target.value})),className:"input-textbox",placeholder:"admin@pinit.in",required:!0})]}),(0,r.jsxs)("div",{className:"input-group-vertical",children:[(0,r.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,r.jsx)("label",{className:"input-label",children:"Password"}),(0,r.jsx)(n.default,{href:"/reset-password",style:{fontSize:11,color:"#7C3AED",textDecoration:"none",fontWeight:600},children:"Forgot?"})]}),(0,r.jsx)("input",{type:f?"text":"password",value:x.password,onChange:e=>h(s=>({...s,password:e.target.value})),className:"input-textbox",placeholder:"••••••••",required:!0})]}),(0,r.jsxs)("div",{className:"demo-shortcuts-box",children:[(0,r.jsx)("div",{className:"demo-shortcuts-title",children:"⚡ Quick Demo Shortcuts"}),(0,r.jsx)("div",{className:"demo-buttons-layout",children:[{label:"Admin",email:"admin@pinit.in"},{label:"Teacher",email:"teacher@pinit.in"},{label:"Recruiter",email:"rec@pinit.in"},{label:"Consultant",email:"con@pinit.in"},{label:"Parent",email:"parent@pinit.in"},{label:"Student",email:"student@pinit.in"}].map(e=>(0,r.jsx)("button",{type:"button",onClick:()=>h({username:e.email,password:"111111"}),className:"demo-pill-btn",children:e.label},e.label))})]}),m&&(0,r.jsxs)("div",{className:"error-alert-banner",children:["⚠️ ",m]}),(0,r.jsx)("button",{type:"submit",className:"pc-btn-primary",style:{width:"100%",justifyContent:"center",marginTop:6},disabled:u,children:u?"Logging in...":"Sign In →"})]}):(0,r.jsxs)("div",{style:{textAlign:"center"},children:[(0,r.jsx)("div",{style:{width:180,height:180,margin:"0 auto 16px",border:"1.5px solid #e2e8f0",borderRadius:16,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:"#f8fafc"},children:"loading"===k?(0,r.jsx)("div",{style:{fontSize:12,color:"#64748b"},children:"Generating QR..."}):y?(0,r.jsx)("img",{src:y,alt:"QR Code",style:{width:"100%",height:"100%"}}):null}),(0,r.jsxs)("div",{style:{fontSize:11.5,color:"#64748b",fontFamily:"monospace",marginBottom:16},children:["ready"===k&&`Scan with phone \xb7 Expiring: ${W}:${M}`,"ready"!==k&&A]}),("ready"===k||"scanned"===k)&&(0,r.jsx)("button",{type:"button",onClick:()=>{if(!v)return;B(!0),F("scanned"),z("Biometric scanner active on mobile phone...");let e=x.username||"student@pinit.in",s=x.password||"111111";setTimeout(async()=>{if(S){localStorage.setItem(`qr_session_${v}`,JSON.stringify({status:"confirmed",email:e,password:s})),F("confirmed");let r=await a(e,s);localStorage.removeItem(`qr_session_${v}`),o.push(d(r?.email,r?.role))}else await l.O.from("qr_login_sessions").update({status:"confirmed",email:e,password:s}).eq("id",v);B(!1)},1200)},disabled:E,className:"pc-btn-outline",style:{width:"100%",justifyContent:"center"},children:"\uD83D\uDCF1 Simulate Biometrics Scan"})]})]})})}function x(){let[e,s]=(0,i.useState)("dark"),[a,n]=(0,i.useState)({activeLearners:"100K+",projectsBuilt:"30K+",expertMentors:"500+",communityMembers:"50K+",hiringPartners:"500+",successRate:"89%"}),[l,d]=(0,i.useState)(!1),[x,h]=(0,i.useState)(!1),[m,g]=(0,i.useState)(!1),{login:u}=(0,o.a)();return(0,t.useSearchParams)(),(0,r.jsxs)("div",{className:"landing-page",children:[(0,r.jsx)("div",{className:"bg-grid-pattern"}),(0,r.jsx)("div",{className:"floating-blob blob-1"}),(0,r.jsx)("div",{className:"floating-blob blob-2"}),(0,r.jsx)("div",{className:"floating-blob blob-3"}),(0,r.jsx)(c.Z,{onLoginClick:()=>{d(!0)}}),(0,r.jsxs)("main",{className:"main-content",children:[(0,r.jsx)("section",{className:"hero-section section-padding",children:(0,r.jsxs)("div",{className:"container hero-grid",children:[(0,r.jsxs)("div",{className:"hero-left",children:[(0,r.jsx)("div",{className:"badge-pill",children:"The Future of Career Learning"}),(0,r.jsxs)("h1",{className:"hero-title",children:["PinitCareer is More Than Learning.",(0,r.jsx)("br",{}),"It's Your Complete",(0,r.jsx)("br",{}),(0,r.jsx)("span",{className:"text-gradient",children:"Career Operating System."})]}),(0,r.jsx)("p",{className:"hero-subtitle",children:"Learn with AI. Build real skills. Compete with peers. Collaborate in communities. Get discovered by companies. PinitCareer connects learning, projects, reputation, and opportunities into one intelligent ecosystem."}),(0,r.jsxs)("div",{className:"feature-chips",children:[(0,r.jsxs)("div",{className:"feature-chip",children:[(0,r.jsx)("div",{className:"chip-icon",children:"\uD83E\uDD16"}),(0,r.jsxs)("div",{className:"chip-text",children:[(0,r.jsx)("strong",{children:"AI-Powered Learning"}),(0,r.jsx)("span",{children:"Personal AI mentor 24/7 guidance"})]})]}),(0,r.jsxs)("div",{className:"feature-chip",children:[(0,r.jsx)("div",{className:"chip-icon",children:"\uD83D\uDCBC"}),(0,r.jsxs)("div",{className:"chip-text",children:[(0,r.jsx)("strong",{children:"Real Projects"}),(0,r.jsx)("span",{children:"Build. Deploy. Showcase."})]})]}),(0,r.jsxs)("div",{className:"feature-chip",children:[(0,r.jsx)("div",{className:"chip-icon",children:"⚔️"}),(0,r.jsxs)("div",{className:"chip-text",children:[(0,r.jsx)("strong",{children:"Code Wars"}),(0,r.jsx)("span",{children:"Compete. Rank. Win rewards."})]})]}),(0,r.jsxs)("div",{className:"feature-chip",children:[(0,r.jsx)("div",{className:"chip-icon",children:"\uD83C\uDFE2"}),(0,r.jsxs)("div",{className:"chip-text",children:[(0,r.jsx)("strong",{children:"Get Hired"}),(0,r.jsx)("span",{children:"Companies discover and hire you."})]})]})]}),(0,r.jsxs)("div",{className:"hero-ctas",children:[(0,r.jsx)("button",{className:"pc-btn-primary pc-btn-glow",children:"Start Your Journey – It's Free →"}),(0,r.jsxs)("button",{className:"pc-btn-outline",children:[(0,r.jsx)("span",{style:{marginRight:6},children:"▶"})," Explore How It Works"]})]}),(0,r.jsxs)("div",{className:"trust-section",children:[(0,r.jsx)("p",{className:"trust-text",children:"Trusted by 100K+ learners and 500+ companies worldwide"}),(0,r.jsxs)("div",{className:"company-logos",children:[(0,r.jsx)("span",{className:"logo-google",children:"Google"}),(0,r.jsx)("span",{className:"logo-ms",children:"Microsoft"}),(0,r.jsx)("span",{className:"logo-tcs",children:"tcs"}),(0,r.jsx)("span",{className:"logo-infosys",children:"Infosys"}),(0,r.jsx)("span",{className:"logo-amazon",children:"amazon"}),(0,r.jsx)("span",{className:"logo-deloitte",children:"Deloitte."})]})]})]}),(0,r.jsx)("div",{className:"hero-right",children:(0,r.jsxs)("div",{className:"hub-diagram",children:[(0,r.jsxs)("div",{className:"hub-center-hex",children:[(0,r.jsxs)("svg",{width:"220",height:"220",viewBox:"0 0 220 220",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[(0,r.jsx)("polygon",{points:"110,12 195,61 195,159 110,208 25,159 25,61",fill:"url(#hexGradient3D)",filter:"drop-shadow(0px 14px 36px rgba(124, 58, 237, 0.45))"}),(0,r.jsx)("polygon",{points:"110,12 195,61 195,159 110,208",fill:"white",fillOpacity:"0.08"}),(0,r.jsx)("polygon",{points:"110,12 25,61 110,208",fill:"black",fillOpacity:"0.06"}),(0,r.jsx)("path",{d:"M92 48H124C136 48 144 57 144 69C144 81 136 90 124 90H106V118H92V48Z",fill:"white"}),(0,r.jsx)("defs",{children:(0,r.jsxs)("linearGradient",{id:"hexGradient3D",x1:"25",y1:"12",x2:"195",y2:"208",gradientUnits:"userSpaceOnUse",children:[(0,r.jsx)("stop",{stopColor:"#8B5CF6"}),(0,r.jsx)("stop",{offset:"0.5",stopColor:"#7C3AED"}),(0,r.jsx)("stop",{offset:"1",stopColor:"#5B21B6"})]})})]}),(0,r.jsxs)("div",{className:"hub-center-labels",children:[(0,r.jsx)("span",{className:"hub-brand-name",children:"PINITCAREER"}),(0,r.jsx)("span",{className:"hub-sub-name",children:"Your Career Engine"})]})]}),(0,r.jsxs)("div",{className:"hub-node node-top",children:[(0,r.jsx)("div",{className:"node-icon-circle",children:"\uD83E\uDD16"}),(0,r.jsxs)("div",{className:"node-text-wrap",children:[(0,r.jsx)("strong",{className:"node-title",children:"AI Mentor"}),(0,r.jsxs)("span",{className:"node-desc",children:["Personalized guidance",(0,r.jsx)("br",{}),"24/7"]})]})]}),(0,r.jsxs)("div",{className:"hub-node node-top-right",children:[(0,r.jsx)("div",{className:"node-icon-circle",children:"⚔️"}),(0,r.jsxs)("div",{className:"node-text-wrap",children:[(0,r.jsx)("strong",{className:"node-title",children:"Code Wars"}),(0,r.jsxs)("span",{className:"node-desc",children:["Daily challenges",(0,r.jsx)("br",{}),"Leaderboards"]})]})]}),(0,r.jsxs)("div",{className:"hub-node node-right",children:[(0,r.jsx)("div",{className:"node-icon-circle",children:"\uD83C\uDFE2"}),(0,r.jsxs)("div",{className:"node-text-wrap",children:[(0,r.jsx)("strong",{className:"node-title",children:"Companies"}),(0,r.jsxs)("span",{className:"node-desc",children:["Real requirements",(0,r.jsx)("br",{}),"Real hiring"]})]})]}),(0,r.jsxs)("div",{className:"hub-node node-bottom-right",children:[(0,r.jsx)("div",{className:"node-icon-circle",children:"\uD83C\uDFC6"}),(0,r.jsxs)("div",{className:"node-text-wrap",children:[(0,r.jsx)("strong",{className:"node-title",children:"Job Offers"}),(0,r.jsxs)("span",{className:"node-desc",children:["Internships &",(0,r.jsx)("br",{}),"Full-time roles"]})]})]}),(0,r.jsxs)("div",{className:"hub-node node-bottom",children:[(0,r.jsx)("div",{className:"node-icon-circle",children:"\uD83D\uDCBC"}),(0,r.jsxs)("div",{className:"node-text-wrap",children:[(0,r.jsx)("strong",{className:"node-title",children:"Portfolio"}),(0,r.jsxs)("span",{className:"node-desc",children:["Projects, skills",(0,r.jsx)("br",{}),"& achievements"]})]})]}),(0,r.jsxs)("div",{className:"hub-node node-bottom-left",children:[(0,r.jsx)("div",{className:"node-icon-circle",children:"\uD83D\uDC65"}),(0,r.jsxs)("div",{className:"node-text-wrap",children:[(0,r.jsx)("strong",{className:"node-title",children:"Communities"}),(0,r.jsxs)("span",{className:"node-desc",children:["Learn together",(0,r.jsx)("br",{}),"Grow together"]})]})]}),(0,r.jsxs)("div",{className:"hub-node node-left",children:[(0,r.jsx)("div",{className:"node-icon-circle",children:"\uD83D\uDCDA"}),(0,r.jsxs)("div",{className:"node-text-wrap",children:[(0,r.jsx)("strong",{className:"node-title",children:"Learning"}),(0,r.jsxs)("span",{className:"node-desc",children:["AI-powered",(0,r.jsx)("br",{}),"personalized roadmaps"]})]})]}),(0,r.jsxs)("div",{className:"hub-node node-top-left",children:[(0,r.jsx)("div",{className:"node-icon-circle",children:"\uD83D\uDCBC"}),(0,r.jsxs)("div",{className:"node-text-wrap",children:[(0,r.jsx)("strong",{className:"node-title",children:"Projects"}),(0,r.jsxs)("span",{className:"node-desc",children:["Build real-world",(0,r.jsx)("br",{}),"projects"]})]})]}),(0,r.jsxs)("svg",{className:"hub-lines-svg",viewBox:"0 0 500 500",children:[(0,r.jsx)("circle",{cx:"250",cy:"250",r:"185",stroke:"#7C3AED",strokeWidth:"1.5",strokeDasharray:"3 6",opacity:"0.3",fill:"none"}),(0,r.jsx)("line",{x1:"250",y1:"250",x2:"250",y2:"65",stroke:"#7C3AED",strokeWidth:"1.5",strokeDasharray:"3 5",opacity:"0.35"}),(0,r.jsx)("line",{x1:"250",y1:"250",x2:"380",y2:"120",stroke:"#7C3AED",strokeWidth:"1.5",strokeDasharray:"3 5",opacity:"0.35"}),(0,r.jsx)("line",{x1:"250",y1:"250",x2:"435",y2:"250",stroke:"#7C3AED",strokeWidth:"1.5",strokeDasharray:"3 5",opacity:"0.35"}),(0,r.jsx)("line",{x1:"250",y1:"250",x2:"380",y2:"380",stroke:"#7C3AED",strokeWidth:"1.5",strokeDasharray:"3 5",opacity:"0.35"}),(0,r.jsx)("line",{x1:"250",y1:"250",x2:"250",y2:"435",stroke:"#7C3AED",strokeWidth:"1.5",strokeDasharray:"3 5",opacity:"0.35"}),(0,r.jsx)("line",{x1:"250",y1:"250",x2:"120",y2:"380",stroke:"#7C3AED",strokeWidth:"1.5",strokeDasharray:"3 5",opacity:"0.35"}),(0,r.jsx)("line",{x1:"250",y1:"250",x2:"65",y2:"250",stroke:"#7C3AED",strokeWidth:"1.5",strokeDasharray:"3 5",opacity:"0.35"}),(0,r.jsx)("line",{x1:"250",y1:"250",x2:"120",y2:"120",stroke:"#7C3AED",strokeWidth:"1.5",strokeDasharray:"3 5",opacity:"0.35"}),(0,r.jsx)("circle",{cx:"250",cy:"65",r:"4",fill:"#7C3AED"}),(0,r.jsx)("circle",{cx:"380",cy:"120",r:"4",fill:"#7C3AED"}),(0,r.jsx)("circle",{cx:"435",cy:"250",r:"4",fill:"#7C3AED"}),(0,r.jsx)("circle",{cx:"380",cy:"380",r:"4",fill:"#7C3AED"}),(0,r.jsx)("circle",{cx:"250",cy:"435",r:"4",fill:"#7C3AED"}),(0,r.jsx)("circle",{cx:"120",cy:"380",r:"4",fill:"#7C3AED"}),(0,r.jsx)("circle",{cx:"65",cy:"250",r:"4",fill:"#7C3AED"}),(0,r.jsx)("circle",{cx:"120",cy:"120",r:"4",fill:"#7C3AED"})]})]})})]})}),(0,r.jsx)("section",{id:"what-is",className:"what-is-section section-padding",children:(0,r.jsxs)("div",{className:"container what-is-grid",children:[(0,r.jsxs)("div",{className:"what-is-left",children:[(0,r.jsx)("h2",{children:"What is PinitCareer?"}),(0,r.jsx)("p",{className:"section-desc",children:"PinitCareer is an AI-powered career platform that helps students learn the right skills, build real projects, compete with peers, collaborate in communities, and get hired by top-companies."}),(0,r.jsx)("p",{className:"bold-line",children:"It is not just a learning platform."}),(0,r.jsx)("p",{className:"bold-line text-purple",children:"It is a career transformation platform."}),(0,r.jsxs)("div",{className:"features-grid-2x3",children:[(0,r.jsxs)("div",{className:"feature-item",children:[(0,r.jsx)("div",{className:"icon-circ",children:"\uD83E\uDD16"}),(0,r.jsx)("span",{children:"AI-driven personalized roadmaps"})]}),(0,r.jsxs)("div",{className:"feature-item",children:[(0,r.jsx)("div",{className:"icon-circ",children:"\uD83D\uDCD6"}),(0,r.jsx)("span",{children:"Skill-based learning & real projects"})]}),(0,r.jsxs)("div",{className:"feature-item",children:[(0,r.jsx)("div",{className:"icon-circ",children:"\uD83D\uDCBB"}),(0,r.jsx)("span",{children:"Code-in-portfolio & leaderboards"})]}),(0,r.jsxs)("div",{className:"feature-item",children:[(0,r.jsx)("div",{className:"icon-circ",children:"\uD83D\uDC65"}),(0,r.jsx)("span",{children:"Peer collaboration & study groups"})]}),(0,r.jsxs)("div",{className:"feature-item",children:[(0,r.jsx)("div",{className:"icon-circ",children:"\uD83C\uDFF7️"}),(0,r.jsx)("span",{children:"Verified portfolio & skill badges"})]}),(0,r.jsxs)("div",{className:"feature-item",children:[(0,r.jsx)("div",{className:"icon-circ",children:"\uD83D\uDD17"}),(0,r.jsx)("span",{children:"Direct access to company requirements & hiring"})]})]}),(0,r.jsxs)("div",{className:"journey-steps-wrapper",children:[(0,r.jsx)("h4",{children:"One Platform. Every Step of Your Career Journey."}),(0,r.jsxs)("div",{className:"journey-steps",children:[(0,r.jsxs)("div",{className:"j-step",children:[(0,r.jsx)("div",{className:"j-icon-bg",children:"\uD83D\uDCDA"}),(0,r.jsx)("span",{children:"Learn"})]}),(0,r.jsx)("div",{className:"j-arrow",children:"→"}),(0,r.jsxs)("div",{className:"j-step",children:[(0,r.jsx)("div",{className:"j-icon-bg",children:"\uD83D\uDD28"}),(0,r.jsx)("span",{children:"Build"})]}),(0,r.jsx)("div",{className:"j-arrow",children:"→"}),(0,r.jsxs)("div",{className:"j-step",children:[(0,r.jsx)("div",{className:"j-icon-bg",children:"⚔️"}),(0,r.jsx)("span",{children:"Compete"})]}),(0,r.jsx)("div",{className:"j-arrow",children:"→"}),(0,r.jsxs)("div",{className:"j-step",children:[(0,r.jsx)("div",{className:"j-icon-bg",children:"\uD83D\uDC65"}),(0,r.jsx)("span",{children:"Collaborate"})]}),(0,r.jsx)("div",{className:"j-arrow",children:"→"}),(0,r.jsxs)("div",{className:"j-step",children:[(0,r.jsx)("div",{className:"j-icon-bg",children:"\uD83D\uDCBC"}),(0,r.jsx)("span",{children:"Get Hired"})]})]})]})]}),(0,r.jsxs)("div",{className:"what-is-right",children:[(0,r.jsxs)("div",{className:"glass-card welcome-card",children:[(0,r.jsx)("div",{className:"welcome-header",children:(0,r.jsx)("h3",{children:"Welcome back, Arjun! \uD83D\uDC4B"})}),(0,r.jsxs)("div",{className:"welcome-body-grid",children:[(0,r.jsxs)("div",{className:"ai-chat-box",children:[(0,r.jsx)("div",{className:"ai-avatar-small",children:"\uD83E\uDD16"}),(0,r.jsxs)("div",{className:"ai-msg-content",children:[(0,r.jsx)("strong",{className:"ai-msg-title",children:"Your AI Mentor"}),(0,r.jsx)("p",{className:"ai-msg-text",children:"Based on your goals, I've created a personalized roadmap to become a Full Stack Developer in 24 weeks."}),(0,r.jsx)("button",{className:"pc-btn-purple-sm",children:"View Roadmap"})]})]}),(0,r.jsxs)("div",{className:"readiness-score-box",children:[(0,r.jsx)("span",{className:"score-heading",children:"Career Readiness Score"}),(0,r.jsxs)("div",{className:"score-gauge",children:[(0,r.jsxs)("svg",{width:"84",height:"84",viewBox:"0 0 84 84",children:[(0,r.jsx)("circle",{cx:"42",cy:"42",r:"36",stroke:"#E2E8F0",strokeWidth:"8",fill:"none"}),(0,r.jsx)("circle",{cx:"42",cy:"42",r:"36",stroke:"#10B981",strokeWidth:"8",fill:"none",strokeDasharray:"226",strokeDashoffset:"50",strokeLinecap:"round",transform:"rotate(-90 42 42)"})]}),(0,r.jsx)("div",{className:"score-center-val",children:"78%"})]}),(0,r.jsx)("span",{className:"score-subtext",children:"You're on the right track!"})]})]})]}),(0,r.jsxs)("div",{className:"roadmap-preview-card",children:[(0,r.jsx)("h4",{children:"Your Personalized Roadmap"}),(0,r.jsxs)("div",{className:"timeline-cards-grid",children:[(0,r.jsxs)("div",{className:"t-card border-t-green",children:[(0,r.jsx)("span",{className:"week-label",children:"Week 1-4"}),(0,r.jsx)("strong",{className:"phase-title",children:"Foundation"}),(0,r.jsx)("span",{className:"tech-stack-sub",children:"HTML, CSS, JS, Git"}),(0,r.jsx)("span",{className:"status-badge status-done",children:"Completed"})]}),(0,r.jsxs)("div",{className:"t-card border-t-amber",children:[(0,r.jsx)("span",{className:"week-label",children:"Week 5-10"}),(0,r.jsx)("strong",{className:"phase-title",children:"Frontend"}),(0,r.jsx)("span",{className:"tech-stack-sub",children:"React, Tailwind, Redux"}),(0,r.jsx)("span",{className:"status-badge status-prog",children:"In Progress"})]}),(0,r.jsxs)("div",{className:"t-card border-t-amber",children:[(0,r.jsx)("span",{className:"week-label",children:"Week 11-16"}),(0,r.jsx)("strong",{className:"phase-title",children:"Backend"}),(0,r.jsx)("span",{className:"tech-stack-sub",children:"Node.js, Express, MongoDB"}),(0,r.jsx)("span",{className:"status-badge status-prog",children:"In Progress"})]}),(0,r.jsxs)("div",{className:"t-card border-t-purple",children:[(0,r.jsx)("span",{className:"week-label",children:"Week 17-20"}),(0,r.jsx)("strong",{className:"phase-title",children:"Real Projects"}),(0,r.jsx)("span",{className:"tech-stack-sub",children:"Build & Deploy"}),(0,r.jsx)("span",{className:"status-badge status-next",children:"Upcoming"})]}),(0,r.jsxs)("div",{className:"t-card border-t-purple",children:[(0,r.jsx)("span",{className:"week-label",children:"Week 21-24"}),(0,r.jsx)("strong",{className:"phase-title",children:"Interview Ready"}),(0,r.jsx)("span",{className:"tech-stack-sub",children:"DSA, System Design"}),(0,r.jsx)("span",{className:"status-badge status-next",children:"Upcoming"})]})]})]}),(0,r.jsxs)("div",{className:"action-cards-row",children:[(0,r.jsxs)("div",{className:"glass-card action-card",children:[(0,r.jsx)("span",{className:"action-lbl",children:"Upcoming Milestone"}),(0,r.jsx)("strong",{className:"action-title",children:"Build a MERN E-commerce Project"}),(0,r.jsx)("span",{className:"action-meta",children:"Due in 5 days"}),(0,r.jsx)("button",{className:"pc-btn-primary btn-sm",children:"Continue"})]}),(0,r.jsxs)("div",{className:"glass-card action-card",children:[(0,r.jsx)("span",{className:"action-lbl",children:"Next Challenge"}),(0,r.jsx)("strong",{className:"action-title",children:"Code War: Array Battle"}),(0,r.jsx)("span",{className:"action-meta",children:"Starts in 02:15:30"}),(0,r.jsx)("button",{className:"pc-btn-purple-outline btn-sm",children:"Join Now"})]})]})]})]})}),(0,r.jsx)("section",{id:"how-it-works",className:"how-gain-section section-padding alt-bg",children:(0,r.jsxs)("div",{className:"container",children:[(0,r.jsx)("h2",{className:"text-center mb-10 section-title-lg",children:"How Students Gain from PinitCareer"}),(0,r.jsxs)("div",{className:"gain-grid",children:[(0,r.jsxs)("div",{className:"gain-card",children:[(0,r.jsx)("div",{className:"g-icon-illustration",children:(0,r.jsxs)("svg",{width:"64",height:"64",viewBox:"0 0 64 64",fill:"none",children:[(0,r.jsx)("rect",{width:"64",height:"64",rx:"16",fill:"#EFF6FF"}),(0,r.jsx)("path",{d:"M16 24H48M16 32H36M16 40H28",stroke:"#3B82F6",strokeWidth:"3",strokeLinecap:"round"}),(0,r.jsx)("circle",{cx:"44",cy:"36",r:"8",fill:"#3B82F6",opacity:"0.2"}),(0,r.jsx)("path",{d:"M42 36L44 38L48 34",stroke:"#2563EB",strokeWidth:"2",strokeLinecap:"round"})]})}),(0,r.jsx)("h3",{children:"Personalized AI Roadmaps"}),(0,r.jsx)("p",{children:"AI creates your unique roadmap based on your goals, skills, college, and target companies."})]}),(0,r.jsxs)("div",{className:"gain-card",children:[(0,r.jsx)("div",{className:"g-icon-illustration",children:(0,r.jsxs)("svg",{width:"64",height:"64",viewBox:"0 0 64 64",fill:"none",children:[(0,r.jsx)("rect",{width:"64",height:"64",rx:"16",fill:"#F0FDF4"}),(0,r.jsx)("circle",{cx:"32",cy:"28",r:"12",fill:"#10B981",opacity:"0.2"}),(0,r.jsx)("path",{d:"M26 28C26 24.6863 28.6863 22 32 22C35.3137 22 38 24.6863 38 28C38 31.3137 35.3137 34 32 34V38",stroke:"#059669",strokeWidth:"3",strokeLinecap:"round"}),(0,r.jsx)("circle",{cx:"32",cy:"44",r:"2",fill:"#059669"})]})}),(0,r.jsx)("h3",{children:"Learn with AI Mentor"}),(0,r.jsx)("p",{children:"Get 24/7 guidance, doubt solving, explanations, and feedback from your AI mentor."})]}),(0,r.jsxs)("div",{className:"gain-card",children:[(0,r.jsx)("div",{className:"g-icon-illustration",children:(0,r.jsxs)("svg",{width:"64",height:"64",viewBox:"0 0 64 64",fill:"none",children:[(0,r.jsx)("rect",{width:"64",height:"64",rx:"16",fill:"#FAF5FF"}),(0,r.jsx)("rect",{x:"18",y:"22",width:"28",height:"18",rx:"3",stroke:"#9333EA",strokeWidth:"2.5"}),(0,r.jsx)("path",{d:"M14 42H50",stroke:"#9333EA",strokeWidth:"3",strokeLinecap:"round"})]})}),(0,r.jsx)("h3",{children:"Build Real Projects"}),(0,r.jsx)("p",{children:"Build industry projects, collaborate with peers, and create an impressive portfolio."})]}),(0,r.jsxs)("div",{className:"gain-card",children:[(0,r.jsx)("div",{className:"g-icon-illustration",children:(0,r.jsxs)("svg",{width:"64",height:"64",viewBox:"0 0 64 64",fill:"none",children:[(0,r.jsx)("rect",{width:"64",height:"64",rx:"16",fill:"#FEF3C7",opacity:"0.5"}),(0,r.jsx)("path",{d:"M22 22H42V32C42 37.5228 37.5228 42 32 42C26.4772 42 22 37.5228 22 32V22Z",fill:"#F59E0B",opacity:"0.3",stroke:"#D97706",strokeWidth:"2.5"}),(0,r.jsx)("path",{d:"M32 42V48M24 48H40",stroke:"#D97706",strokeWidth:"2.5",strokeLinecap:"round"})]})}),(0,r.jsx)("h3",{children:"Compete & Rank"}),(0,r.jsx)("p",{children:"Participate in code wars, contests, and hackathons. Climb leaderboards."})]}),(0,r.jsxs)("div",{className:"gain-card",children:[(0,r.jsx)("div",{className:"g-icon-illustration",children:(0,r.jsxs)("svg",{width:"64",height:"64",viewBox:"0 0 64 64",fill:"none",children:[(0,r.jsx)("rect",{width:"64",height:"64",rx:"16",fill:"#FEE2E2",opacity:"0.6"}),(0,r.jsx)("circle",{cx:"26",cy:"28",r:"6",fill:"#EF4444",opacity:"0.3",stroke:"#DC2626",strokeWidth:"2"}),(0,r.jsx)("circle",{cx:"38",cy:"28",r:"6",fill:"#EF4444",opacity:"0.3",stroke:"#DC2626",strokeWidth:"2"}),(0,r.jsx)("path",{d:"M18 42C18 37.5817 21.5817 34 26 34C30.4183 34 34 37.5817 34 42",stroke:"#DC2626",strokeWidth:"2",strokeLinecap:"round"})]})}),(0,r.jsx)("h3",{children:"Collaborate in Communities"}),(0,r.jsx)("p",{children:"Join study groups, tech communities, voice rooms, and meet like-minded peers."})]}),(0,r.jsxs)("div",{className:"gain-card",children:[(0,r.jsx)("div",{className:"g-icon-illustration",children:(0,r.jsxs)("svg",{width:"64",height:"64",viewBox:"0 0 64 64",fill:"none",children:[(0,r.jsx)("rect",{width:"64",height:"64",rx:"16",fill:"#EEF2FF"}),(0,r.jsx)("rect",{x:"20",y:"24",width:"24",height:"16",rx:"3",stroke:"#4F46E5",strokeWidth:"2.5"}),(0,r.jsx)("circle",{cx:"44",cy:"38",r:"8",fill:"#6366F1"}),(0,r.jsx)("path",{d:"M41 38L43 40L47 36",stroke:"white",strokeWidth:"2",strokeLinecap:"round"})]})}),(0,r.jsx)("h3",{children:"Get Discovered & Hired"}),(0,r.jsx)("p",{children:"Companies find you based on your skills, projects, rankings, and performance."})]})]})]})}),(0,r.jsx)("section",{id:"ai-roadmap",className:"ai-roadmap-section section-padding",children:(0,r.jsxs)("div",{className:"container",children:[(0,r.jsx)("h2",{className:"mb-8 text-left section-title-lg",children:"AI-Powered Roadmap Experience"}),(0,r.jsxs)("div",{className:"roadmap-experience-grid",children:[(0,r.jsx)("div",{className:"re-left",children:(0,r.jsxs)("div",{className:"profile-and-analysis-box",children:[(0,r.jsxs)("div",{className:"profile-header",children:[(0,r.jsx)("div",{className:"avatar-photo-circle",children:(0,r.jsx)("span",{className:"avatar-emoji",children:"\uD83D\uDC68‍\uD83C\uDF93"})}),(0,r.jsxs)("div",{className:"profile-details",children:[(0,r.jsx)("span",{className:"info-lbl-sm",children:"Your Profile"}),(0,r.jsx)("h3",{className:"profile-name",children:"Arjun Sharma"}),(0,r.jsx)("p",{className:"profile-sub",children:"B.Tech CSE | 2nd Year"}),(0,r.jsx)("p",{className:"profile-meta",children:"Goal: Full Stack Developer"}),(0,r.jsx)("p",{className:"profile-meta",children:"Target Companies: Google, Microsoft"}),(0,r.jsx)("p",{className:"profile-meta",children:"Available Time: 2-3 hrs/day"})]})]}),(0,r.jsxs)("div",{className:"ai-analysis-part",children:[(0,r.jsx)("h4",{className:"analytics-title",children:"AI Analysis"}),(0,r.jsxs)("ul",{className:"check-list",children:[(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"check-icon",children:"✓"})," Current Skills Assessment"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"check-icon",children:"✓"})," Aptitude & IQ Analysis"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"check-icon",children:"✓"})," Strengths & Weaknesses"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"check-icon",children:"✓"})," Learning Style Detection"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"check-icon",children:"✓"})," Career Interest Mapping"]})]})]})]})}),(0,r.jsxs)("div",{className:"re-right",children:[(0,r.jsx)("h3",{className:"rm-section-head",children:"Your Personalized Roadmap"}),(0,r.jsxs)("div",{className:"phases-timeline-row",children:[(0,r.jsxs)("div",{className:"phase-card",children:[(0,r.jsx)("span",{className:"phase-num-tag",children:"Phase 1"}),(0,r.jsx)("h4",{className:"phase-head",children:"Foundation"}),(0,r.jsx)("span",{className:"phase-dur",children:"4 Weeks"}),(0,r.jsxs)("ul",{className:"phase-check-items",children:[(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Web Basics"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," JavaScript"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Git & GitHub"]})]})]}),(0,r.jsx)("div",{className:"phase-arrow-icon",children:"→"}),(0,r.jsxs)("div",{className:"phase-card",children:[(0,r.jsx)("span",{className:"phase-num-tag",children:"Phase 2"}),(0,r.jsx)("h4",{className:"phase-head",children:"Frontend"}),(0,r.jsx)("span",{className:"phase-dur",children:"6 Weeks"}),(0,r.jsxs)("ul",{className:"phase-check-items",children:[(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," React"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Tailwind CSS"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," State Management"]})]})]}),(0,r.jsx)("div",{className:"phase-arrow-icon",children:"→"}),(0,r.jsxs)("div",{className:"phase-card",children:[(0,r.jsx)("span",{className:"phase-num-tag",children:"Phase 3"}),(0,r.jsx)("h4",{className:"phase-head",children:"Backend"}),(0,r.jsx)("span",{className:"phase-dur",children:"6 Weeks"}),(0,r.jsxs)("ul",{className:"phase-check-items",children:[(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Node.js"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Express"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Database"]})]})]}),(0,r.jsx)("div",{className:"phase-arrow-icon",children:"→"}),(0,r.jsxs)("div",{className:"phase-card",children:[(0,r.jsx)("span",{className:"phase-num-tag",children:"Phase 4"}),(0,r.jsx)("h4",{className:"phase-head",children:"Projects"}),(0,r.jsx)("span",{className:"phase-dur",children:"6 Weeks"}),(0,r.jsxs)("ul",{className:"phase-check-items",children:[(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Industry Projects"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Deployment"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Portfolio"]})]})]})]}),(0,r.jsx)("p",{className:"roadmap-footer-note",children:"AI continuously updates your roadmap based on your progress, performance, and company requirements."})]})]})]})}),(0,r.jsx)("section",{id:"code-wars",className:"code-wars-section section-padding alt-bg",children:(0,r.jsxs)("div",{className:"container code-wars-grid",children:[(0,r.jsxs)("div",{className:"cw-left",children:[(0,r.jsx)("h2",{children:"Code Wars & Competitions"}),(0,r.jsx)("p",{className:"section-desc",children:"Practice. Compete. Improve. Win. Daily challenges, weekly leagues, coding battles, and hackathons to test your skills and rank globally."}),(0,r.jsxs)("div",{className:"glass-card leaderboard-card mb-6",children:[(0,r.jsxs)("div",{className:"lb-header-bar",children:[(0,r.jsx)("span",{className:"live-dot",children:"●"})," Live Leaderboard"]}),(0,r.jsx)("table",{className:"lb-table",children:(0,r.jsxs)("tbody",{children:[(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{className:"rank-col",children:"\uD83E\uDD47 1"}),(0,r.jsxs)("td",{className:"user-col",children:[(0,r.jsx)("div",{className:"user-avatar-tiny",children:"\uD83D\uDC69‍\uD83D\uDCBB"})," Riya Singh"]}),(0,r.jsx)("td",{className:"xp-col",children:"2450 XP"})]}),(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{className:"rank-col",children:"\uD83E\uDD48 2"}),(0,r.jsxs)("td",{className:"user-col",children:[(0,r.jsx)("div",{className:"user-avatar-tiny",children:"\uD83E\uDDD1‍\uD83D\uDCBB"})," Arjun Dev"]}),(0,r.jsx)("td",{className:"xp-col",children:"2330 XP"})]}),(0,r.jsxs)("tr",{children:[(0,r.jsx)("td",{className:"rank-col",children:"\uD83E\uDD49 3"}),(0,r.jsxs)("td",{className:"user-col",children:[(0,r.jsx)("div",{className:"user-avatar-tiny",children:"\uD83D\uDC68‍\uD83D\uDCBB"})," Karthik S."]}),(0,r.jsx)("td",{className:"xp-col",children:"2150 XP"})]}),(0,r.jsxs)("tr",{className:"highlight-user-row",children:[(0,r.jsx)("td",{className:"rank-col",children:"\uD83C\uDFC5 4"}),(0,r.jsxs)("td",{className:"user-col",children:[(0,r.jsx)("div",{className:"user-avatar-tiny",children:"\uD83D\uDC64"})," ",(0,r.jsx)("strong",{children:"You"})]}),(0,r.jsx)("td",{className:"xp-col",children:(0,r.jsx)("strong",{children:"1980 XP"})})]})]})})]}),(0,r.jsx)("button",{className:"pc-btn-purple-outline pc-btn-wide",children:"Explore Code Wars"}),(0,r.jsxs)("div",{className:"cw-tags-row",children:[(0,r.jsx)("span",{className:"cw-tag",children:"Algorithms"}),(0,r.jsx)("span",{className:"cw-tag",children:"Data Structures"}),(0,r.jsx)("span",{className:"cw-tag",children:"System Design"}),(0,r.jsx)("span",{className:"cw-tag",children:"Debugging"}),(0,r.jsx)("span",{className:"cw-tag",children:"AI Challenges"}),(0,r.jsx)("span",{className:"cw-tag",children:"Company Challenges"})]})]}),(0,r.jsxs)("div",{className:"cw-right",children:[(0,r.jsxs)("div",{className:"vs-illustration-box",children:[(0,r.jsx)("div",{className:"coder-card left-coder",children:(0,r.jsx)("div",{className:"coder-avatar-frame",children:"\uD83E\uDDD1‍\uD83D\uDCBB"})}),(0,r.jsx)("div",{className:"vs-badge-glow",children:"VS"}),(0,r.jsx)("div",{className:"coder-card right-coder",children:(0,r.jsx)("div",{className:"coder-avatar-frame",children:"\uD83D\uDC69‍\uD83D\uDCBB"})})]}),(0,r.jsxs)("div",{className:"upcoming-events-card",children:[(0,r.jsx)("h4",{className:"events-head",children:"Upcoming Events"}),(0,r.jsxs)("div",{className:"event-row",children:[(0,r.jsx)("div",{className:"event-icon-badge bg-purple-light",children:"⚔️"}),(0,r.jsxs)("div",{className:"event-info",children:[(0,r.jsx)("strong",{children:"Array Battle"}),(0,r.jsx)("span",{children:"Today, 8:00 PM"})]}),(0,r.jsx)("button",{className:"pc-btn-purple-outline btn-xs",children:"Join"})]}),(0,r.jsxs)("div",{className:"event-row",children:[(0,r.jsx)("div",{className:"event-icon-badge bg-green-light",children:"\uD83C\uDFC6"}),(0,r.jsxs)("div",{className:"event-info",children:[(0,r.jsx)("strong",{children:"Weekly Contest"}),(0,r.jsx)("span",{children:"Sat, 10:00 AM"})]}),(0,r.jsx)("button",{className:"pc-btn-purple-outline btn-xs",children:"Join"})]}),(0,r.jsxs)("div",{className:"event-row",children:[(0,r.jsx)("div",{className:"event-icon-badge bg-blue-light",children:"\uD83D\uDCBB"}),(0,r.jsxs)("div",{className:"event-info",children:[(0,r.jsx)("strong",{children:"Hackathon"}),(0,r.jsx)("span",{children:"Next Week"})]}),(0,r.jsx)("button",{className:"pc-btn-purple-outline btn-xs",children:"Register"})]}),(0,r.jsxs)("div",{className:"event-row",children:[(0,r.jsx)("div",{className:"event-icon-badge bg-amber-light",children:"\uD83D\uDC1B"}),(0,r.jsxs)("div",{className:"event-info",children:[(0,r.jsx)("strong",{children:"Bug Bounty"}),(0,r.jsx)("span",{children:"Ongoing"})]}),(0,r.jsx)("button",{className:"pc-btn-purple-outline btn-xs",children:"Participate"})]}),(0,r.jsx)("div",{className:"view-events-footer",children:(0,r.jsx)("a",{href:"#code-wars",className:"view-all-link",children:"View All Events →"})})]})]})]})}),(0,r.jsx)("section",{id:"for-companies",className:"for-companies-section section-padding",children:(0,r.jsxs)("div",{className:"container",children:[(0,r.jsx)("span",{className:"tag-pill-sub",children:"For Companies"}),(0,r.jsx)("h2",{className:"section-title-lg mb-2",children:"Hire Future-Ready Talent"}),(0,r.jsx)("p",{className:"section-desc mb-6 max-w-2xl",children:"Post your requirements and let our AI find, train, and recommend the right students for your roles."}),(0,r.jsxs)("ul",{className:"company-checklist mb-8",children:[(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Post role requirements"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Get AI-generated skill roadmap"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Access pre-assessed talent pool"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Conduct challenges & interviews"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Hire interns & full-time talent"]})]}),(0,r.jsx)("button",{className:"pc-btn-primary mb-12",children:"I'm a Hiring Manager"}),(0,r.jsxs)("div",{className:"hiring-flow-grid",children:[(0,r.jsxs)("div",{className:"h-step-card",children:[(0,r.jsx)("span",{className:"h-step-title",children:"You Post Requirement"}),(0,r.jsxs)("div",{className:"h-card-inner",children:[(0,r.jsx)("strong",{className:"role-head",children:"React Developer"}),(0,r.jsx)("p",{className:"req-skills",children:"Skills: React, Node.js, MongoDB, AWS"}),(0,r.jsx)("p",{className:"req-exp",children:"Experience: Fresher / Intern"})]})]}),(0,r.jsx)("div",{className:"h-arrow-sep",children:"→"}),(0,r.jsxs)("div",{className:"h-step-card",children:[(0,r.jsx)("span",{className:"h-step-title",children:"AI Creates Roadmap"}),(0,r.jsx)("div",{className:"h-card-inner",children:(0,r.jsxs)("ul",{className:"h-check-list",children:[(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Skills Gap Analysis"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Personalized Learning Path"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Projects & Challenges"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"chk",children:"✓"})," Interview Preparation"]})]})})]}),(0,r.jsx)("div",{className:"h-arrow-sep",children:"→"}),(0,r.jsxs)("div",{className:"h-step-card",children:[(0,r.jsx)("span",{className:"h-step-title",children:"Students Get Trained"}),(0,r.jsx)("div",{className:"h-card-inner",children:(0,r.jsxs)("ul",{className:"h-badge-list",children:[(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"b-icon",children:"\uD83D\uDCDA"})," Learn"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"b-icon",children:"\uD83D\uDD28"})," Build"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"b-icon",children:"⚔️"})," Compete"]}),(0,r.jsxs)("li",{children:[(0,r.jsx)("span",{className:"b-icon",children:"Verified"})," Get Verified"]})]})})]}),(0,r.jsx)("div",{className:"h-arrow-sep",children:"→"}),(0,r.jsxs)("div",{className:"h-step-card",children:[(0,r.jsx)("span",{className:"h-step-title",children:"You Hire Top Talent"}),(0,r.jsxs)("div",{className:"h-card-inner",children:[(0,r.jsx)("p",{className:"shortlist-lbl",children:"Shortlisted Candidates"}),(0,r.jsx)("p",{className:"match-lbl",children:"AI Match Score"}),(0,r.jsxs)("div",{className:"candidates-avatars-row",children:[(0,r.jsx)("div",{className:"c-avatar",children:"\uD83D\uDC69"}),(0,r.jsx)("div",{className:"c-avatar",children:"\uD83E\uDDD1"}),(0,r.jsx)("div",{className:"c-avatar",children:"\uD83D\uDC68"}),(0,r.jsx)("span",{className:"match-badge",children:"95% Match"})]})]})]})]}),(0,r.jsxs)("div",{className:"company-trust-footer mt-12 text-center",children:[(0,r.jsx)("p",{className:"trust-companies-text",children:"Trusted by 500+ companies to hire top talent"}),(0,r.jsxs)("div",{className:"company-logos-row",children:[(0,r.jsx)("span",{className:"logo-item",children:"Google"}),(0,r.jsx)("span",{className:"logo-item",children:"Microsoft"}),(0,r.jsx)("span",{className:"logo-item",children:"amazon"}),(0,r.jsx)("span",{className:"logo-item",children:"tcs"}),(0,r.jsx)("span",{className:"logo-item",children:"Infosys"}),(0,r.jsx)("span",{className:"logo-item",children:"Deloitte."})]})]})]})}),(0,r.jsx)("section",{className:"stats-bar-section",children:(0,r.jsxs)("div",{className:"container stats-grid-6",children:[(0,r.jsxs)("div",{className:"stat-card",children:[(0,r.jsx)("div",{className:"stat-icon-badge",children:"\uD83C\uDF93"}),(0,r.jsx)("div",{className:"stat-num",children:"100K+"}),(0,r.jsx)("div",{className:"stat-lbl",children:"Active Learners"})]}),(0,r.jsxs)("div",{className:"stat-card",children:[(0,r.jsx)("div",{className:"stat-icon-badge",children:"\uD83D\uDCBC"}),(0,r.jsx)("div",{className:"stat-num",children:"30K+"}),(0,r.jsx)("div",{className:"stat-lbl",children:"Projects Built"})]}),(0,r.jsxs)("div",{className:"stat-card",children:[(0,r.jsx)("div",{className:"stat-icon-badge",children:"\uD83D\uDC68‍\uD83C\uDFEB"}),(0,r.jsx)("div",{className:"stat-num",children:"500+"}),(0,r.jsx)("div",{className:"stat-lbl",children:"Expert Mentors"})]}),(0,r.jsxs)("div",{className:"stat-card",children:[(0,r.jsx)("div",{className:"stat-icon-badge",children:"\uD83D\uDC65"}),(0,r.jsx)("div",{className:"stat-num",children:"50K+"}),(0,r.jsx)("div",{className:"stat-lbl",children:"Community Members"})]}),(0,r.jsxs)("div",{className:"stat-card",children:[(0,r.jsx)("div",{className:"stat-icon-badge",children:"\uD83C\uDFE2"}),(0,r.jsx)("div",{className:"stat-num",children:"500+"}),(0,r.jsx)("div",{className:"stat-lbl",children:"Hiring Partners"})]}),(0,r.jsxs)("div",{className:"stat-card",children:[(0,r.jsx)("div",{className:"stat-icon-badge",children:"⭐"}),(0,r.jsx)("div",{className:"stat-num",children:"89%"}),(0,r.jsx)("div",{className:"stat-lbl",children:"Hiring Success Rate"})]})]})}),(0,r.jsx)("section",{className:"final-cta-section section-padding",children:(0,r.jsxs)("div",{className:"container final-cta-wrapper",children:[(0,r.jsx)("div",{className:"cta-mascot-left",children:(0,r.jsx)("div",{className:"student-mascot-illustration",children:(0,r.jsx)("div",{className:"mascot-avatar-lg",children:"\uD83C\uDF92\uD83E\uDDD1‍\uD83C\uDF93"})})}),(0,r.jsxs)("div",{className:"cta-content-right",children:[(0,r.jsxs)("h2",{className:"cta-heading",children:["Your Future Doesn't Start After Graduation.",(0,r.jsx)("br",{}),"It Starts ",(0,r.jsx)("span",{className:"text-purple",children:"Today."})]}),(0,r.jsx)("p",{className:"cta-sub",children:"Join thousands of students who are building skills, earning reputation, and getting hired with PinitCareer."}),(0,r.jsxs)("div",{className:"cta-buttons-row",children:[(0,r.jsx)("button",{className:"pc-btn-primary pc-btn-glow-lg",children:"Start Your Journey – It's Free →"}),(0,r.jsx)("button",{className:"pc-btn-outline-lg",children:"Explore Career Paths"})]}),(0,r.jsxs)("div",{className:"cta-guarantees-row",children:[(0,r.jsx)("span",{children:"✓ No Credit Card Required"}),(0,r.jsx)("span",{children:"✓ Free Forever Plan Available"})]})]})]})})]}),(0,r.jsxs)("footer",{className:"footer-section",children:[(0,r.jsxs)("div",{className:"container footer-grid",children:[(0,r.jsxs)("div",{className:"f-col brand-col",children:[(0,r.jsxs)("div",{className:"brand-logo mb-4",children:[(0,r.jsx)("span",{className:"pi-icon",children:"Pi"}),(0,r.jsx)("span",{className:"brand-text",children:"PINITCAREER"})]}),(0,r.jsx)("p",{className:"f-desc mb-4",children:"Empowering students to build their career through AI-driven learning, real projects, and community."})]}),(0,r.jsxs)("div",{className:"f-col",children:[(0,r.jsx)("h4",{children:"Platform"}),(0,r.jsxs)("ul",{children:[(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"AI Roadmap"})}),(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"Code Wars"})}),(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"Projects"})}),(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"Community"})}),(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"Portfolio"})})]})]}),(0,r.jsxs)("div",{className:"f-col",children:[(0,r.jsx)("h4",{children:"Company"}),(0,r.jsxs)("ul",{children:[(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"About"})}),(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"Careers"})}),(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"Blog"})}),(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"Contact"})}),(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"Partners"})})]})]}),(0,r.jsxs)("div",{className:"f-col",children:[(0,r.jsx)("h4",{children:"Legal"}),(0,r.jsxs)("ul",{children:[(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"Privacy"})}),(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"Terms"})}),(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"Cookie Policy"})}),(0,r.jsx)("li",{children:(0,r.jsx)("a",{href:"#",children:"Security"})})]})]})]}),(0,r.jsxs)("div",{className:"container footer-bottom",children:[(0,r.jsx)("p",{children:"\xa9 2026 PinitCareer Technologies. All rights reserved."}),(0,r.jsxs)("div",{className:"social-icons",children:[(0,r.jsx)("span",{children:"\uD835\uDD4F"}),(0,r.jsx)("span",{children:"in"}),(0,r.jsx)("span",{children:"fb"}),(0,r.jsx)("span",{children:"ig"})]})]})]}),(0,r.jsxs)("div",{className:"floating-chat-wrapper",children:[x&&(0,r.jsxs)("div",{className:"chat-panel glass-card morph-widget-container",children:[(0,r.jsxs)("div",{className:"chat-header",children:[(0,r.jsxs)("div",{className:"chat-h-left",children:[(0,r.jsx)("span",{className:"chat-bot-icon",children:"\uD83E\uDD16"}),(0,r.jsx)("strong",{children:"AI Career Mentor"})]}),(0,r.jsx)("button",{className:"close-chat-btn",onClick:()=>h(!1),children:"✕"})]}),(0,r.jsxs)("div",{className:"chat-body",children:[(0,r.jsx)("div",{className:"chat-msg bot-msg",children:"Hello! I'm your PinitCareer AI Mentor. How can I help you map out your future today?"}),(0,r.jsxs)("div",{className:"sandbox-queries",children:[(0,r.jsx)("button",{className:"sq-btn",children:"Create a frontend roadmap"}),(0,r.jsx)("button",{className:"sq-btn",children:"How do I prepare for FAANG?"}),(0,r.jsx)("button",{className:"sq-btn",children:"What projects should I build?"})]})]}),(0,r.jsxs)("div",{className:"chat-footer",children:[(0,r.jsx)("input",{type:"text",placeholder:"Ask me anything...",className:"chat-input"}),(0,r.jsx)("button",{className:"chat-send-btn",children:"➔"})]})]}),(0,r.jsx)("button",{className:"chat-toggle-btn",onClick:()=>h(!x),children:x?"✕":"\uD83E\uDD16"})]}),l&&(0,r.jsx)(p,{onClose:()=>d(!1),preselectRole:null,loginFn:u||(async()=>({}))}),(0,r.jsx)("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');

        :root {
          /* Dark mode variables (Default) */
          --bg-primary: #080A1A;
          --bg-secondary: #0F1225;
          --bg-card: rgba(15, 18, 40, 0.75);
          --bg-card-solid: #12152B;
          --text-primary: #FFFFFF;
          --text-secondary: #94A3B8;
          --text-tertiary: #64748B;
          --border-color: rgba(255, 255, 255, 0.08);
          --border-hover: rgba(124, 58, 237, 0.4);
          --accent: #7C3AED;
          --accent-hover: #6D28D9;
          --accent-glow: rgba(124, 58, 237, 0.3);
          --accent-cyan: #06B6D4;
          --accent-green: #10B981;
          --accent-amber: #F59E0B;
          --accent-pink: #EC4899;
          --trust-bg: transparent;
          
          --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        [data-theme='light'] {
          --bg-primary: #FFFFFF;
          --bg-secondary: #F8FAFC;
          --bg-card: #FFFFFF;
          --bg-card-solid: #FFFFFF;
          --text-primary: #0F172A;
          --text-secondary: #475569;
          --text-tertiary: #94A3B8;
          --border-color: rgba(0, 0, 0, 0.08);
          --border-hover: rgba(124, 58, 237, 0.3);
          --accent: #7C3AED;
          --accent-hover: #6D28D9;
          --accent-glow: rgba(124, 58, 237, 0.15);
          --trust-bg: #F8FAFC;
        }

        /* GLOBAL RESETS */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { 
          width: 100%; min-height: 100vh; overflow-x: hidden; scroll-behavior: smooth; 
        }
        body {
          font-family: var(--font-body);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        a { text-decoration: none; color: inherit; }
        ul { list-style: none; }
        button { font-family: inherit; cursor: pointer; }
        
        .container {
          max-width: 1200px; margin: 0 auto; padding: 0 24px; width: 100%;
        }
        .section-padding { padding: 80px 0; }
        .alt-bg { background-color: var(--bg-secondary); }
        .mb-4 { margin-bottom: 16px; }
        .mb-6 { margin-bottom: 24px; }
        .mb-8 { margin-bottom: 32px; }
        .mb-10 { margin-bottom: 40px; }
        .mb-12 { margin-bottom: 48px; }
        .mt-2 { margin-top: 8px; }
        .mt-4 { margin-top: 16px; }
        .mt-8 { margin-top: 32px; }
        .mt-12 { margin-top: 48px; }
        .text-center { text-align: center; }
        .max-w-2xl { max-width: 42rem; margin-left: auto; margin-right: auto; }
        .flex-1 { flex: 1; }

        /* TYPOGRAPHY UTILS */
        .text-gradient {
          background: linear-gradient(135deg, #7C3AED, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .text-accent-green { color: var(--accent-green); }
        h2 { font-size: 36px; font-weight: 800; line-height: 1.2; }
        h3 { font-size: 24px; font-weight: 700; }
        h4 { font-size: 18px; font-weight: 700; }
        .section-desc { font-size: 16px; color: var(--text-secondary); line-height: 1.6; }

        /* BUTTONS */
        .pc-btn-primary {
          background: linear-gradient(135deg, var(--accent), #A855F7);
          color: #FFF; border: none; padding: 12px 24px; border-radius: 50px; font-weight: 700;
          transition: all 0.2s ease; display: inline-flex; align-items: center;
        }
        .pc-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px var(--accent-glow); }
        .pc-btn-primary.btn-sm { padding: 8px 16px; font-size: 13px; }
        .pc-btn-primary.btn-lg { padding: 16px 32px; font-size: 18px; }
        .pc-btn-glow { box-shadow: 0 0 20px var(--accent-glow); }
        
        .pc-btn-outline {
          background: transparent; color: var(--text-primary); border: 1.5px solid var(--border-color);
          padding: 12px 24px; border-radius: 50px; font-weight: 600; transition: all 0.2s ease;
        }
        .pc-btn-outline:hover { border-color: var(--accent); color: var(--accent); }
        .pc-btn-outline.btn-sm { padding: 8px 16px; font-size: 13px; }

        /* GLASS CARD */
        .glass-card {
          background: var(--bg-card);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--border-color);
          border-radius: 20px; padding: 24px;
        }

        /* ANIMATIONS */
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
          100% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(124, 58, 237, 0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }

        /* BACKGROUND ELEMENTS */
        .bg-grid-pattern {
          position: fixed; inset: 0; z-index: -2; pointer-events: none;
          background-image: linear-gradient(var(--border-color) 1px, transparent 1px),
                            linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
          background-size: 40px 40px; opacity: 0.3;
        }
        .floating-blob {
          position: fixed; border-radius: 50%; filter: blur(80px); z-index: -1; pointer-events: none; opacity: 0.4;
        }
        .blob-1 { width: 400px; height: 400px; background: rgba(124, 58, 237, 0.3); top: -100px; left: -100px; animation: float 15s infinite alternate ease-in-out; }
        .blob-2 { width: 300px; height: 300px; background: rgba(6, 182, 212, 0.2); bottom: 10%; right: 5%; animation: float 18s infinite alternate-reverse ease-in-out; }
        .blob-3 { width: 350px; height: 350px; background: rgba(236, 72, 153, 0.2); top: 40%; left: 30%; animation: float 20s infinite alternate ease-in-out; }

        /* 1. NAVBAR */
        .navbar {
          position: sticky; top: 0; z-index: 100; height: 64px;
          background: var(--bg-card); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-color);
        }
        .nav-container { display: flex; align-items: center; justify-content: space-between; height: 100%; max-width: 1400px; margin: 0 auto; padding: 0 24px; }
        .brand-logo { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 18px; letter-spacing: -0.5px; }
        .pi-icon { background: linear-gradient(135deg, #7C3AED, #A855F7); color: #fff; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 16px; }
        
        .nav-center { display: flex; gap: 24px; align-items: center; }
        .nav-link { font-size: 13px; font-weight: 500; color: var(--text-secondary); transition: color 0.2s; }
        .nav-link:hover { color: var(--accent); }
        
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .theme-toggle-btn { background: none; border: none; font-size: 18px; padding: 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--bg-card-solid); border: 1px solid var(--border-color); width: 36px; height: 36px; }
        .nav-login-btn { background: transparent; color: var(--text-primary); border: none; font-size: 14px; font-weight: 600; }
        .nav-cta { padding: 8px 20px; font-size: 13px; }
        .mobile-menu-btn { display: none; background: none; border: none; font-size: 24px; color: var(--text-primary); }

        @media (max-width: 1024px) {
          .nav-center { display: none; position: absolute; top: 64px; left: 0; right: 0; background: var(--bg-primary); flex-direction: column; padding: 24px; border-bottom: 1px solid var(--border-color); }
          .nav-center.mobile-open { display: flex; }
          .mobile-menu-btn { display: block; }
          .nav-cta { display: none; }
        }

        /* 2. HERO SECTION */
        .hero-section { padding-top: 80px; padding-bottom: 60px; }
        .hero-grid { display: flex; align-items: center; gap: 40px; }
        .hero-left { flex: 0 0 55%; max-width: 55%; }
        .hero-right { flex: 0 0 45%; max-width: 45%; }
        
        .badge-pill { display: inline-block; background: rgba(124, 58, 237, 0.15); color: var(--accent); padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 700; margin-bottom: 24px; border: 1px solid rgba(124, 58, 237, 0.3); }
        .hero-title { font-size: 48px; font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 24px; }
        .hero-subtitle { font-size: 16px; color: var(--text-secondary); line-height: 1.7; max-width: 540px; margin-bottom: 32px; }
        
        .feature-chips { display: flex; gap: 16px; margin-bottom: 36px; flex-wrap: wrap; }
        .feature-chip { display: flex; align-items: center; gap: 12px; background: var(--bg-card); padding: 8px 16px 8px 8px; border-radius: 50px; border: 1px solid var(--border-color); }
        .chip-icon { width: 36px; height: 36px; border-radius: 50%; background: rgba(124,58,237,0.1); display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .chip-text { display: flex; flex-direction: column; font-size: 12px; }
        .chip-text strong { color: var(--text-primary); font-size: 13px; }
        .chip-text span { color: var(--text-tertiary); font-size: 11px; line-height: 1.2; }
        
        .hero-ctas { display: flex; gap: 12px; margin-bottom: 40px; flex-wrap: wrap; }
        .trust-text { font-size: 12px; color: var(--text-tertiary); margin-bottom: 12px; font-weight: 500; }
        .company-logos { display: flex; gap: 24px; flex-wrap: wrap; color: var(--text-primary); opacity: 0.6; font-weight: 700; font-size: 18px; font-family: var(--font-body); }

        .hub-diagram { position: relative; width: 100%; max-width: 580px; aspect-ratio: 1; margin: -20px auto 0; display: flex; align-items: center; justify-content: center; }
        .hub-center-hex { position: relative; display: flex; align-items: center; justify-content: center; z-index: 10; width: 220px; height: 220px; }
        .hub-center-labels { position: absolute; bottom: 32px; left: 0; right: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; pointer-events: none; z-index: 12; }
        .hub-brand-name { font-weight: 900; font-size: 13.5px; letter-spacing: 1px; color: #FFFFFF; text-shadow: 0 2px 6px rgba(0,0,0,0.4); line-height: 1; }
        .hub-sub-name { font-size: 9.5px; color: rgba(255,255,255,0.95); font-weight: 600; margin-top: 3px; }

        .hub-lines-svg { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }

        .hub-node { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; z-index: 5; width: 130px; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .hub-node:hover { transform: scale(1.1) translateY(-2px); }
        .node-icon-circle { width: 52px; height: 52px; border-radius: 50%; background: #FFFFFF; border: 2px solid rgba(124, 58, 237, 0.2); display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 8px 24px rgba(124, 58, 237, 0.16); margin-bottom: 6px; transition: all 0.2s ease; }
        .hub-node:hover .node-icon-circle { border-color: #7C3AED; box-shadow: 0 10px 28px rgba(124, 58, 237, 0.25); }
        .node-title { font-size: 12.5px; color: #0F172A; font-weight: 800; line-height: 1.2; display: block; letter-spacing: -0.2px; }
        .node-desc { font-size: 10px; color: #64748B; font-weight: 600; display: block; margin-top: 2px; line-height: 1.3; }

        .node-top { top: -2%; left: 50%; transform: translateX(-50%); }
        .node-top-right { top: 8%; right: 4%; }
        .node-right { top: 50%; right: -5%; transform: translateY(-50%); }
        .node-bottom-right { bottom: 8%; right: 4%; }
        .node-bottom { bottom: -2%; left: 50%; transform: translateX(-50%); }
        .node-bottom-left { bottom: 8%; left: 4%; }
        .node-left { top: 50%; left: -5%; transform: translateY(-50%); }
        .node-top-left { top: 8%; left: 4%; }

        @media (max-width: 900px) {
          .hero-grid { flex-direction: column; text-align: center; gap: 32px; }
          .hero-left, .hero-right { flex: 0 0 100%; max-width: 100%; }
          .hero-title { font-size: 32px; line-height: 1.2; letter-spacing: -0.5px; margin-bottom: 16px; }
          .hero-subtitle { font-size: 14px; margin: 0 auto 24px auto; }
          .feature-chips { justify-content: center; }
          .hero-ctas { justify-content: center; width: 100%; }
          .hero-ctas a, .hero-ctas button { width: 100%; text-align: center; justify-content: center; }
          .company-logos { justify-content: center; font-size: 15px; gap: 16px; }
          
          /* Mobile Hub Diagram Optimization */
          .hub-diagram { aspect-ratio: auto; height: auto; display: flex; flex-direction: column; align-items: center; gap: 20px; margin: 0 auto; max-width: 100%; }
          .hub-center-hex { width: 160px; height: 160px; }
          .hub-center-hex svg { width: 160px; height: 160px; }
          .hub-brand-name { font-size: 11px; }
          .hub-sub-name { font-size: 8px; }
          .hub-lines-svg { display: none; }
          .hub-node { position: static; transform: none !important; width: 100%; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 12px; flex-direction: row; text-align: left; gap: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
          .node-icon-circle { margin-bottom: 0; width: 40px; height: 40px; font-size: 20px; flex-shrink: 0; }
          .node-text-wrap { display: flex; flex-direction: column; }
        }

        /* 3. WHAT IS PINITCAREER */
        .what-is-grid { display: flex; gap: 40px; align-items: flex-start; }
        .what-is-left { flex: 0 0 52%; max-width: 52%; }
        .what-is-right { flex: 0 0 48%; max-width: 48%; display: flex; flex-direction: column; gap: 20px; }
        
        .bold-line { font-size: 18px; font-weight: 800; margin-top: 10px; color: var(--text-primary); }
        .text-purple { color: #7C3AED; }
        
        .features-grid-2x3 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 28px 0; }
        .feature-item { display: flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .icon-circ { width: 36px; height: 36px; border-radius: 50%; background: rgba(124,58,237,0.08); border: 1px solid rgba(124,58,237,0.15); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        
        .journey-steps-wrapper { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .journey-steps-wrapper h4 { margin-bottom: 20px; font-size: 15px; text-align: center; font-weight: 800; color: var(--text-primary); }
        .journey-steps { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
        .j-step { display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--text-primary); }
        .j-icon-bg { width: 44px; height: 44px; border-radius: 50%; background: #F8FAFC; border: 1.5px solid #E2E8F0; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .j-arrow { color: #94A3B8; font-weight: bold; font-size: 14px; margin-bottom: 22px; }

        /* Student Dashboard Preview Cards */
        .welcome-card { padding: 24px; border-radius: 24px; border: 1px solid var(--border-color); background: var(--bg-card); }
        .welcome-header h3 { font-size: 20px; font-weight: 800; color: var(--text-primary); margin-bottom: 18px; }
        .welcome-body-grid { display: flex; gap: 20px; align-items: center; }
        .ai-chat-box { flex: 1; display: flex; gap: 12px; background: rgba(124, 58, 237, 0.05); border: 1px solid rgba(124, 58, 237, 0.15); padding: 16px; border-radius: 16px; }
        .ai-avatar-small { font-size: 24px; flex-shrink: 0; }
        .ai-msg-content { display: flex; flex-direction: column; gap: 6px; }
        .ai-msg-title { font-size: 12px; font-weight: 800; color: #7C3AED; }
        .ai-msg-text { font-size: 12px; color: var(--text-secondary); line-height: 1.4; }
        .pc-btn-purple-sm { align-self: flex-start; padding: 6px 14px; border-radius: 50px; background: #7C3AED; color: #FFFFFF; font-size: 11px; font-weight: 700; border: none; cursor: pointer; margin-top: 4px; }
        
        .readiness-score-box { display: flex; flex-direction: column; align-items: center; text-align: center; width: 140px; flex-shrink: 0; background: #FFFFFF; padding: 14px; border-radius: 18px; border: 1px solid #E2E8F0; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
        .score-heading { font-size: 10.5px; font-weight: 800; color: #475569; margin-bottom: 8px; line-height: 1.2; text-transform: uppercase; letter-spacing: 0.3px; }
        .score-gauge { position: relative; width: 84px; height: 84px; display: flex; align-items: center; justify-content: center; }
        .score-center-val { position: absolute; font-size: 18px; font-weight: 900; color: #0F172A; }
        .score-subtext { font-size: 10px; color: #10B981; font-weight: 700; margin-top: 6px; }

        /* Timeline Cards (5 Phases) */
        .roadmap-preview-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 24px; }
        .roadmap-preview-card h4 { margin-bottom: 16px; font-size: 16px; font-weight: 800; color: var(--text-primary); }
        .timeline-cards-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .t-card { background: #FFFFFF; padding: 12px 10px; border-radius: 14px; border: 1px solid #E2E8F0; border-top: 3px solid #CBD5E1; display: flex; flex-direction: column; text-align: left; position: relative; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .t-card.border-t-green { border-top-color: #10B981; }
        .t-card.border-t-amber { border-top-color: #F59E0B; }
        .t-card.border-t-purple { border-top-color: #7C3AED; }
        .week-label { font-size: 9.5px; font-weight: 700; color: #94A3B8; margin-bottom: 4px; }
        .phase-title { font-size: 12px; font-weight: 800; color: #0F172A; line-height: 1.2; }
        .tech-stack-sub { font-size: 9.5px; color: #64748B; margin: 4px 0 10px 0; line-height: 1.2; }
        .status-badge { font-size: 9px; font-weight: 800; padding: 3px 8px; border-radius: 50px; display: inline-block; align-self: flex-start; text-transform: uppercase; letter-spacing: 0.3px; }
        .status-done { background: #ECFDF5; color: #059669; }
        .status-prog { background: #FFFBEB; color: #D97706; }
        .status-next { background: #F3E8FF; color: #7C3AED; }

        /* Dual Action Cards Row */
        .action-cards-row { display: flex; gap: 16px; }
        .action-card { flex: 1; padding: 20px; border-radius: 20px; border: 1px solid var(--border-color); background: var(--bg-card); display: flex; flex-direction: column; justify-content: space-between; }
        .action-lbl { font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .action-title { font-size: 14px; font-weight: 800; color: var(--text-primary); line-height: 1.3; }
        .action-meta { font-size: 11.5px; font-weight: 700; color: #7C3AED; margin: 8px 0 14px 0; }
        .pc-btn-purple-outline { padding: 8px 18px; border-radius: 50px; border: 1.5px solid #7C3AED; background: transparent; color: #7C3AED; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .pc-btn-purple-outline:hover { background: #7C3AED; color: #FFFFFF; }

        @media (max-width: 900px) {
          .what-is-grid { flex-direction: column; }
          .what-is-left, .what-is-right { flex: 0 0 100%; max-width: 100%; }
          .features-grid-2x3 { grid-template-columns: 1fr; }
          .timeline-cards { grid-template-columns: 1fr 1fr; }
          .action-cards-row { flex-direction: column; }
        }

        /* 4. HOW STUDENTS GAIN */
        .how-gain-section { background: var(--bg-secondary); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); }
        .section-title-lg { font-size: 32px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; }
        .gain-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 18px; margin-top: 40px; }
        .gain-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 24px 18px; text-align: center; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .gain-card:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(124, 58, 237, 0.12); border-color: rgba(124, 58, 237, 0.3); }
        .g-icon-illustration { margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; }
        .gain-card h3 { font-size: 14.5px; font-weight: 800; color: #0F172A; margin-bottom: 10px; line-height: 1.3; }
        .gain-card p { font-size: 11.5px; color: #64748B; line-height: 1.5; font-weight: 500; }
        @media (max-width: 1200px) { .gain-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .gain-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .gain-grid { grid-template-columns: 1fr; } }

        /* 5. AI ROADMAP EXPERIENCE */
        .roadmap-experience-grid { display: flex; gap: 32px; margin-top: 24px; align-items: stretch; }
        .re-left { flex: 0 0 36%; max-width: 36%; display: flex; flex-direction: column; }
        .re-right { flex: 0 0 64%; max-width: 64%; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 24px; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; overflow-x: auto; }
        
        .profile-and-analysis-box { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 24px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
        .profile-header { display: flex; gap: 14px; margin-bottom: 20px; align-items: flex-start; }
        .avatar-photo-circle { width: 56px; height: 56px; border-radius: 50%; background: #F3E8FF; border: 2px solid #7C3AED; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .avatar-emoji { font-size: 30px; }
        .info-lbl-sm { font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px; }
        .profile-name { font-size: 17px; font-weight: 800; color: #0F172A; line-height: 1.2; }
        .profile-sub { font-size: 11.5px; color: #64748B; font-weight: 600; margin-bottom: 6px; }
        .profile-meta { font-size: 11px; color: #334155; font-weight: 600; line-height: 1.4; }
        
        .ai-analysis-part { border-top: 1px dashed #E2E8F0; padding-top: 18px; margin-top: 12px; }
        .analytics-title { font-size: 13.5px; font-weight: 800; color: #7C3AED; margin-bottom: 12px; }
        .check-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .check-list li { font-size: 12px; font-weight: 600; color: #334155; display: flex; align-items: center; gap: 8px; }
        .check-icon { color: #10B981; font-weight: 900; }

        .rm-section-head { font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 24px; }
        .phases-timeline-row { display: flex; align-items: stretch; justify-content: space-between; gap: 8px; overflow-x: auto; padding-bottom: 8px; }
        .phase-card { flex: 1; min-width: 140px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; flex-shrink: 0; }
        .phase-num-tag { font-size: 10px; font-weight: 800; color: #7C3AED; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .phase-head { font-size: 14px; font-weight: 800; color: #0F172A; margin-bottom: 2px; }
        .phase-dur { font-size: 11px; color: #64748B; font-weight: 600; margin-bottom: 12px; }
        .phase-check-items { list-style: none; display: flex; flex-direction: column; gap: 6px; font-size: 11px; color: #334155; font-weight: 600; }
        .phase-check-items .chk { color: #10B981; font-weight: bold; }
        .phase-arrow-icon { color: #94A3B8; font-weight: bold; font-size: 16px; align-self: center; flex-shrink: 0; }
        .roadmap-footer-note { font-size: 11px; color: #64748B; font-style: italic; text-align: center; margin-top: 24px; }

        /* 6. CODE WARS */
        .code-wars-grid { display: flex; gap: 40px; align-items: flex-start; }
        .cw-left { flex: 0 0 45%; max-width: 45%; overflow: hidden; }
        .cw-right { flex: 0 0 55%; max-width: 55%; display: flex; flex-direction: column; gap: 20px; }
        
        .leaderboard-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.02); overflow-x: auto; }
        .lb-header-bar { font-size: 12px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
        .live-dot { color: #EF4444; font-size: 14px; }
        .lb-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
        .lb-table td { padding: 8px 10px; border-bottom: 1px solid #F1F5F9; white-space: nowrap; }
        .rank-col { font-weight: 800; color: #0F172A; width: 44px; }
        .user-col { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #334155; }
        .user-avatar-tiny { font-size: 16px; }
        .xp-col { text-align: right; font-family: var(--font-mono); font-weight: 800; color: #7C3AED; }
        .highlight-user-row { background: #F3E8FF; border-radius: 8px; }
        .pc-btn-wide { width: 100%; text-align: center; margin-bottom: 16px; }
        .cw-tags-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .cw-tag { background: #FFFFFF; border: 1px solid #E2E8F0; padding: 4px 10px; border-radius: 50px; font-size: 11px; font-weight: 700; color: #64748B; }

        @media (max-width: 900px) {
          .roadmap-experience-grid { flex-direction: column; }
          .re-left, .re-right { flex: 0 0 100%; max-width: 100%; }
          .code-wars-grid { flex-direction: column; }
          .cw-left, .cw-right { flex: 0 0 100%; max-width: 100%; }
          .hiring-flow-grid { flex-direction: column; gap: 16px; }
          .h-arrow-sep { transform: rotate(90deg); margin: 4px 0; }
        }

        /* Dual VS Graphic */
        .vs-illustration-box { position: relative; height: 180px; background: linear-gradient(135deg, #EEF2FF, #FAF5FF); border-radius: 24px; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-around; overflow: hidden; padding: 20px; }
        .coder-avatar-frame { font-size: 64px; filter: drop-shadow(0 8px 16px rgba(124, 58, 237, 0.2)); }
        .vs-badge-glow { background: linear-gradient(135deg, #EC4899, #8B5CF6); color: #FFFFFF; font-weight: 900; font-size: 22px; padding: 10px 20px; border-radius: 50px; box-shadow: 0 0 24px rgba(236, 72, 153, 0.5); font-family: var(--font-mono); letter-spacing: 1px; }

        .upcoming-events-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .events-head { font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 4px; }
        .event-row { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 12px; background: #F8FAFC; border: 1px solid #F1F5F9; }
        .event-icon-badge { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .bg-purple-light { background: #F3E8FF; }
        .bg-green-light { background: #ECFDF5; }
        .bg-blue-light { background: #EFF6FF; }
        .bg-amber-light { background: #FFFBEB; }
        .event-info { flex: 1; display: flex; flex-direction: column; }
        .event-info strong { font-size: 12.5px; color: #0F172A; }
        .event-info span { font-size: 10.5px; color: #64748B; }
        .btn-xs { padding: 4px 12px; font-size: 11px; }
        .view-events-footer { text-align: center; margin-top: 6px; }
        .view-all-link { font-size: 12px; font-weight: 800; color: #7C3AED; }

        /* 7. FOR COMPANIES */
        .tag-pill-sub { display: inline-block; background: #F3E8FF; color: #7C3AED; padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 800; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .company-checklist { list-style: none; display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px; font-weight: 700; color: #334155; }
        .company-checklist .chk { color: #10B981; font-weight: 900; }
        
        .hiring-flow-grid { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 24px; }
        .h-step-card { flex: 1; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; padding: 18px 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.02); }
        .h-step-title { font-size: 11px; font-weight: 800; color: #7C3AED; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 10px; }
        .h-card-inner { font-size: 11.5px; color: #334155; }
        .role-head { font-size: 13px; color: #0F172A; display: block; margin-bottom: 4px; }
        .req-skills { font-size: 10.5px; color: #64748B; margin-bottom: 4px; }
        .req-exp { font-size: 10.5px; color: #64748B; font-weight: 600; }
        .h-check-list { list-style: none; display: flex; flex-direction: column; gap: 4px; font-size: 11px; font-weight: 600; color: #334155; }
        .h-check-list .chk { color: #10B981; font-weight: bold; }
        .h-badge-list { list-style: none; display: flex; flex-direction: column; gap: 4px; font-size: 11px; font-weight: 700; color: #0F172A; }
        .b-icon { margin-right: 4px; }
        .shortlist-lbl { font-size: 11px; font-weight: 700; color: #0F172A; }
        .match-lbl { font-size: 10px; color: #64748B; margin-bottom: 8px; }
        .candidates-avatars-row { display: flex; align-items: center; gap: 6px; }
        .c-avatar { width: 26px; height: 26px; border-radius: 50%; background: #F1F5F9; border: 1px solid #CBD5E1; display: flex; align-items: center; justify-content: center; font-size: 12px; }
        .match-badge { background: #ECFDF5; color: #059669; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 50px; }
        .h-arrow-sep { color: #94A3B8; font-weight: bold; font-size: 16px; }

        .trust-companies-text { font-size: 12px; color: #64748B; font-weight: 600; margin-bottom: 12px; }
        .company-logos-row { display: flex; justify-content: center; gap: 32px; font-size: 18px; font-weight: 800; color: #475569; opacity: 0.75; }

        /* 8. STATS BAR */
        .stats-bar-section { background: linear-gradient(135deg, #7C3AED, #4F46E5); padding: 48px 0; color: #FFFFFF; }
        .stats-grid-6 { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; text-align: center; }
        .stat-card { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .stat-icon-badge { font-size: 28px; margin-bottom: 4px; }
        .stat-num { font-size: 32px; font-weight: 900; letter-spacing: -0.5px; }
        .stat-lbl { font-size: 12px; opacity: 0.85; font-weight: 600; }

        /* 9. FINAL CTA SECTION */
        .final-cta-section { background: #080A1A; color: #FFFFFF; padding: 80px 0; border-top: 1px solid rgba(255,255,255,0.08); }
        .final-cta-wrapper { display: flex; align-items: center; gap: 48px; max-width: 1000px; margin: 0 auto; }
        .cta-mascot-left { flex: 0 0 35%; display: flex; justify-content: center; }
        .student-mascot-illustration { width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%); display: flex; align-items: center; justify-content: center; border: 2px solid rgba(124,58,237,0.3); }
        .mascot-avatar-lg { font-size: 96px; filter: drop-shadow(0 12px 24px rgba(124, 58, 237, 0.4)); }
        .cta-content-right { flex: 1; display: flex; flex-direction: column; gap: 16px; }
        .cta-heading { font-size: 36px; font-weight: 900; line-height: 1.2; letter-spacing: -1px; color: #FFFFFF; }
        .cta-sub { font-size: 15px; color: #94A3B8; line-height: 1.6; max-width: 520px; }
        .cta-buttons-row { display: flex; gap: 16px; align-items: center; margin-top: 8px; }
        .pc-btn-glow-lg { padding: 14px 28px; font-size: 14px; font-weight: 800; border-radius: 50px; }
        .pc-btn-outline-lg { padding: 14px 28px; font-size: 14px; font-weight: 800; border-radius: 50px; background: transparent; border: 1.5px solid rgba(255,255,255,0.2); color: #FFFFFF; cursor: pointer; }
        .cta-guarantees-row { display: flex; gap: 20px; font-size: 12px; color: #64748B; font-weight: 700; }
        
        @media (max-width: 900px) {
          .roadmap-experience-grid { flex-direction: column; }
          .re-left, .re-right { flex: 0 0 100%; max-width: 100%; }
        }

        /* 6. CODE WARS */
        .code-wars-grid { display: flex; gap: 40px; align-items: center; }
        .cw-left, .cw-right { flex: 1; }
        
        .lb-header { padding: 16px 20px; font-weight: 800; font-size: 16px; border-bottom: 1px solid var(--border-color); background: rgba(0,0,0,0.2); border-radius: 20px 20px 0 0; }
        .lb-table { width: 100%; border-collapse: collapse; }
        .lb-table th { text-align: left; padding: 12px 20px; font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; }
        .lb-table td { padding: 14px 20px; font-size: 14px; font-weight: 600; border-top: 1px solid var(--border-color); }
        .highlight-row { background: rgba(124,58,237,0.1); color: var(--accent); }
        .cw-tags { font-size: 13px; color: var(--text-tertiary); line-height: 1.8; font-weight: 500; }

        .vs-battle-illustration { display: flex; align-items: center; justify-content: center; gap: 20px; background: var(--bg-card); padding: 40px; border-radius: 24px; border: 1px solid var(--border-color); }
        .vs-avatar { width: 80px; height: 80px; border-radius: 16px; background: var(--bg-card-solid); border: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; font-size: 40px; }
        .vs-badge { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #EC4899, #7C3AED); color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; box-shadow: 0 0 20px rgba(236,72,153,0.4); z-index: 2; }
        
        .upcoming-events h3 { margin-bottom: 16px; font-size: 18px; }
        .event-card { display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 12px; }
        .event-card strong { font-size: 14px; display: block; margin-bottom: 4px; }
        .event-card p { font-size: 12px; color: var(--text-secondary); }
        .view-all-link { display: block; text-align: right; font-size: 13px; color: var(--accent); font-weight: 600; margin-top: 16px; }

        @media (max-width: 900px) {
          .code-wars-grid { flex-direction: column; }
        }

        /* 7. FOR COMPANIES */
        .tag-pill { display: inline-block; background: var(--bg-card); border: 1px solid var(--border-color); padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); }
        .company-benefits { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 15px; font-weight: 500; }
        
        .hiring-flow { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .h-step { flex: 1; min-width: 200px; padding: 24px; text-align: center; }
        .h-step h4 { font-size: 15px; margin-bottom: 16px; color: var(--text-primary); }
        .h-items { display: flex; flex-direction: column; gap: 8px; }
        .h-items span { background: var(--bg-card-solid); padding: 8px; border-radius: 8px; font-size: 12px; color: var(--text-secondary); }
        .h-arrow { color: var(--text-tertiary); font-size: 24px; font-weight: bold; }
        .highlight-step { border-color: var(--accent); box-shadow: 0 0 20px var(--accent-glow); }
        .match-tag { background: rgba(16, 185, 129, 0.1) !important; color: var(--accent-green) !important; font-weight: 700; }
        
        .trust-bar-companies { text-align: center; border-top: 1px solid var(--border-color); padding-top: 32px; }
        .trust-bar-companies p { font-size: 14px; color: var(--text-tertiary); margin-bottom: 20px; font-weight: 600; }
        .trust-bar-companies .company-logos { justify-content: center; }

        /* 8. STATS BAR */
        .stats-bar-section { background: linear-gradient(135deg, #7C3AED, #4F46E5); padding: 50px 0; color: white; }
        .stats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; text-align: center; }
        .stat-num { font-size: 36px; font-weight: 900; margin-bottom: 8px; }
        .stat-lbl { font-size: 13px; opacity: 0.8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(3, 1fr); gap: 40px 20px; } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

        /* 9. FINAL CTA */
        .final-cta-section { background: radial-gradient(circle at center, rgba(124,58,237,0.15) 0%, transparent 60%); }
        .cta-title { font-size: 40px; margin-bottom: 16px; }
        .explore-link { color: var(--text-secondary); font-size: 14px; font-weight: 600; transition: color 0.2s; border-bottom: 1px solid transparent; }
        .explore-link:hover { color: var(--text-primary); border-bottom-color: var(--text-primary); }
        .fine-print { font-size: 12px; color: var(--text-tertiary); display: flex; justify-content: center; gap: 16px; }

        /* 10. FOOTER */
        .footer-section { background: #05060F; padding: 60px 0 20px; border-top: 1px solid rgba(255,255,255,0.05); color: #fff; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 60px; }
        .f-col h4 { font-size: 16px; margin-bottom: 20px; color: #fff; }
        .f-col ul { display: flex; flex-direction: column; gap: 12px; }
        .f-col a { color: #94A3B8; font-size: 14px; transition: color 0.2s; }
        .f-col a:hover { color: #7C3AED; }
        .f-desc { color: #94A3B8; font-size: 14px; line-height: 1.6; max-width: 300px; }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; font-size: 13px; color: #64748B; }
        .social-icons { display: flex; gap: 16px; }
        .social-icons span { width: 32px; height: 32px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; color: #fff; }
        .social-icons span:hover { background: #7C3AED; }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; } .brand-col { grid-column: span 2; } }

        /* FLOATING CHAT WIDGET & VOICE AI ENGINE */
        .floating-chat-wrapper { position: fixed; bottom: 24px; right: 24px; z-index: 999; display: flex; flex-direction: column; align-items: flex-end; gap: 16px; }
        .chat-toggle-btn { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #7C3AED, #A855F7); color: white; border: none; font-size: 24px; box-shadow: 0 4px 20px rgba(124,58,237,0.4); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; }
        .chat-toggle-btn:hover { transform: scale(1.05); }
        .chat-panel { width: 390px; height: 530px; display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 16px; background: rgba(0,0,0,0.2); border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
        .chat-h-left { display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .chat-bot-icon { background: var(--bg-card-solid); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .voice-active-badge { font-size: 10px; font-weight: 800; background: rgba(16,185,129,0.15); color: #10B981; border: 1px solid rgba(16,185,129,0.3); padding: 2px 8px; border-radius: 50px; }
        .close-chat-btn { background: none; border: none; color: var(--text-tertiary); font-size: 16px; }
        .chat-body { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
        .chat-msg { background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2); padding: 12px; border-radius: 12px; font-size: 13px; line-height: 1.5; align-self: flex-start; max-width: 85%; border-bottom-left-radius: 0; }
        .sandbox-queries { display: flex; flex-direction: column; gap: 8px; margin-top: auto; }
        .sq-btn { background: var(--bg-card-solid); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 10px 16px; border-radius: 20px; font-size: 12px; text-align: left; transition: all 0.2s; }
        .sq-btn:hover { background: rgba(124,58,237,0.1); color: var(--accent); border-color: rgba(124,58,237,0.3); }
        .chat-footer { padding: 16px; border-top: 1px solid var(--border-color); display: flex; gap: 8px; }
        .chat-input { flex: 1; background: var(--bg-card-solid); border: 1px solid var(--border-color); padding: 10px 16px; border-radius: 20px; color: var(--text-primary); font-size: 13px; outline: none; }
        .chat-input:focus { border-color: var(--accent); }
        .chat-send-btn { width: 40px; height: 40px; border-radius: 50%; background: var(--accent); color: white; border: none; font-size: 16px; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 480px) {
          .chat-panel { width: calc(100vw - 32px); height: 60vh; }
        }

        /* MODAL CLASSES & MORPH WIDGET STYLES (Provided in instructions) */
        .modal-mask-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; }
        .modal-body-container { background: #ffffff; border-radius: 24px; padding: 36px; max-width: 420px; width: 90%; position: relative; box-shadow: 0 24px 60px rgba(0,0,0,0.3); }
        .modal-dismiss-btn { position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 18px; cursor: pointer; color: #64748b; }
        .modal-header-title { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
        .modal-header-desc { font-size: 13px; color: #64748b; margin-bottom: 20px; }
        .input-group-vertical { display: flex; flex-direction: column; gap: 6px; }
        .input-label { font-size: 12px; font-weight: 700; color: #334155; }
        .input-textbox { padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 13px; outline: none; transition: border 0.2s; color: #0f172a; }
        .input-textbox:focus { border-color: #7C3AED; }
        .demo-shortcuts-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
        .demo-shortcuts-title { font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 8px; text-transform: uppercase; }
        .demo-buttons-layout { display: flex; flex-wrap: wrap; gap: 6px; }
        .demo-pill-btn { padding: 5px 12px; border-radius: 50px; border: 1px solid #e2e8f0; background: white; font-size: 11px; font-weight: 700; cursor: pointer; color: #334155; transition: all 0.2s; }
        .demo-pill-btn:hover { background: #7C3AED; color: white; border-color: #7C3AED; }
        .error-alert-banner { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 10px 14px; border-radius: 10px; font-size: 12px; font-weight: 600; }
        
        .morph-widget-container { animation: fadeInUp 0.3s ease; }
        .morph-widget-card { background: #ffffff; border-radius: 20px; padding: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.12); position: relative; text-align: center; border: 1px solid #e2e8f0; }
        .face-hud-circle { width: 100px; height: 100px; margin: 0 auto 12px; border-radius: 50%; border: 2px solid #e2e8f0; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; background: #f8fafc; }
        .face-hud-avatar { font-size: 36px; z-index: 2; }
        .hud-scan-laser { position: absolute; width: 100%; height: 3px; background: linear-gradient(90deg, transparent, #7C3AED, transparent); top: 0; animation: scan 1.5s infinite linear; z-index: 3; }
      `})]})}function h(){return(0,r.jsx)(i.Suspense,{fallback:(0,r.jsx)("div",{style:{height:"100vh",background:"#080A1A"}}),children:(0,r.jsx)(x,{})})}},35480:(e,s,a)=>{"use strict";a.r(s),a.d(s,{default:()=>r});let r=(0,a(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\page.tsx#default`)}};var s=require("../webpack-runtime.js");s.C(e);var a=e=>s(s.s=e),r=s.X(0,[9276,8042,9421,7439],()=>a(18377));module.exports=r})();