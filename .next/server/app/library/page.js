(()=>{var e={};e.id=9103,e.ids=[9103],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},31324:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>s.a,__next_app__:()=>x,originalPathname:()=>p,pages:()=>c,routeModule:()=>b,tree:()=>d}),r(77016),r(27479),r(35866);var i=r(23191),o=r(88716),a=r(37922),s=r.n(a),n=r(95231),l={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);r.d(t,l);let d=["",{children:["library",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,77016)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\library\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,27479)),"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,35866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\library\\page.tsx"],p="/library/page",x={require:r,loadChunk:()=>Promise.resolve()},b=new i.AppPageRouteModule({definition:{kind:o.x.APP_PAGE,page:"/library/page",pathname:"/library",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},6511:(e,t,r)=>{Promise.resolve().then(r.bind(r,50621))},50621:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});var i=r(10326),o=r(17577),a=r(65309);function s(){let[e,t]=(0,o.useState)([]),[r,s]=(0,o.useState)([]),[n,l]=(0,o.useState)([]),[d,c]=(0,o.useState)(""),[p,x]=(0,o.useState)(""),[b,f]=(0,o.useState)("all"),[u,g]=(0,o.useState)(null),h=async()=>{try{let e=await a.api.get("/api/library/books");t(e.books||[]),s(e.borrowed||[]),l(e.reserves||[])}catch{}},m=async e=>{try{let t=await a.api.post("/api/library/borrow",{isbn:e});t&&t.ok?(alert("Book borrowed successfully! Dynamic due date set for 14 days from today."),h()):alert(t.message||"Borrow failed.")}catch{alert("Network error borrowing book.")}},y=async e=>{try{let t=await a.api.post("/api/library/return",{borrowId:e});t&&t.ok&&(t.fine>0?alert(`Book returned successfully! A late penalty fine of ₹${t.fine} has been added to your finance dues ledger.`):alert("Book returned successfully with zero penalty fines."),h())}catch{alert("Return failed.")}},v=async e=>{try{let t=await a.api.post("/api/library/reserve",{isbn:e});t&&t.ok&&(alert(`Reservation placed! You are at position #${t.reserve.position} in the waitlist queue.`),h())}catch{alert("Reservation failed.")}},j=e.filter(e=>{let t=(e.title||"").toLowerCase().includes(d.toLowerCase())||(e.author||"").toLowerCase().includes(d.toLowerCase())||(e.isbn||"").includes(d),r=!p||e.genre===p,i="all"===b||("ebook"===b?e.isEbook:!e.isEbook);return t&&r&&i}),k=Array.from(new Set(e.map(e=>e.genre)));return(0,i.jsxs)("div",{style:{minHeight:"100vh",background:"#f8fafc",color:"#0f172a",padding:"30px 20px",fontFamily:"var(--font-body), sans-serif"},children:[(0,i.jsx)("style",{children:`
        .lib-wrapper {
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
        .search-bar-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .search-bar-row {
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
        .grid-books {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .book-card {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 16px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          transition: all 0.2s;
        }
        .book-card:hover {
          border-color: #2563eb;
          box-shadow: 0 10px 30px rgba(37, 99, 235, 0.04);
        }
        .book-title {
          font-size: 14.5px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.3;
        }
        .book-author {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }
        .book-meta {
          font-size: 11px;
          color: #94a3b8;
          font-family: var(--font-mono);
          margin-top: 8px;
        }
        .book-genre-tag {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          background: #f1f5f9;
          color: #475569;
          padding: 3px 8px;
          border-radius: 6px;
          width: fit-content;
          margin-top: 8px;
        }
        .book-footer {
          border-top: 1px solid #e2e8f0;
          margin-top: 16px;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .availability-lbl {
          font-size: 11px;
          font-weight: 700;
        }
        .layout-split {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 24px;
          margin-top: 24px;
        }
        @media (max-width: 900px) {
          .layout-split {
            grid-template-columns: 1fr;
          }
        }
        .tbl-borrows {
          width: 100%;
          border-collapse: collapse;
        }
        .tbl-borrows th {
          text-align: left;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          padding-bottom: 12px;
          border-bottom: 1px solid #cbd5e1;
        }
        .tbl-borrows td {
          padding: 12px 0;
          font-size: 13px;
          border-bottom: 1px solid #f1f5f9;
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
        .reader-modal {
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 640px;
          padding: 30px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
        }
        .reader-content-box {
          background: #fafafa;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 24px;
          font-size: 14.5px;
          line-height: 1.6;
          color: #334155;
          max-height: 380px;
          overflow-y: auto;
          margin-top: 16px;
          white-space: pre-wrap;
        }
      `}),(0,i.jsxs)("div",{className:"lib-wrapper",children:[(0,i.jsx)("h1",{className:"page-title",children:"\uD83D\uDCDA Library Center"}),(0,i.jsxs)("div",{className:"search-bar-row",children:[(0,i.jsx)("input",{type:"text",className:"form-input",placeholder:"Search books by title, author, or ISBN...",value:d,onChange:e=>c(e.target.value)}),(0,i.jsxs)("select",{value:p,onChange:e=>x(e.target.value),className:"form-input",children:[(0,i.jsx)("option",{value:"",children:"All Genres / Subjects"}),k.map(e=>(0,i.jsx)("option",{value:e,children:e},e))]}),(0,i.jsxs)("select",{value:b,onChange:e=>f(e.target.value),className:"form-input",children:[(0,i.jsx)("option",{value:"all",children:"Format: All"}),(0,i.jsx)("option",{value:"physical",children:"Format: Physical Copies"}),(0,i.jsx)("option",{value:"ebook",children:"Format: E-Books"})]})]}),(0,i.jsxs)("div",{className:"card-box",children:[(0,i.jsxs)("h3",{className:"card-title",children:["\uD83D\uDCD6 Textbook Catalog (",j.length," entries)"]}),0===j.length?(0,i.jsx)("div",{style:{textAlign:"center",padding:"40px 0",color:"#64748b"},children:"No books matching your query criteria."}):(0,i.jsx)("div",{className:"grid-books",children:j.map(e=>{let t=r.find(t=>t.isbn===e.isbn&&!t.returned);return(0,i.jsxs)("div",{className:"book-card",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{className:"book-title",children:e.title}),(0,i.jsxs)("div",{className:"book-author",children:["by ",e.author]}),(0,i.jsxs)("div",{className:"book-meta",children:["ISBN: ",e.isbn]}),(0,i.jsx)("div",{className:"book-genre-tag",children:e.genre})]}),(0,i.jsxs)("div",{className:"book-footer",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{className:"availability-lbl",style:{color:e.available>0?"#059669":"#dc2626"},children:e.available>0?`${e.available} of ${e.copies} available`:"Out of stock"}),e.isEbook&&(0,i.jsx)("div",{style:{fontSize:10,color:"#2563eb",marginTop:2,fontWeight:700},children:"⚡ Digital E-Book Available"})]}),(0,i.jsxs)("div",{style:{display:"flex",gap:6},children:[e.isEbook&&(0,i.jsx)("button",{onClick:()=>g(e),className:"btn-ghost btn-sm",style:{border:"1.5px solid #2563eb",color:"#2563eb",padding:"6px 10px",fontSize:11},children:"\uD83D\uDCD6 Read"}),e.available>0?(0,i.jsx)("button",{onClick:()=>m(e.isbn),disabled:!!t,className:"btn-primary",style:{fontSize:11,padding:"6px 12px",background:t?"#cbd5e1":"#2563eb",borderColor:t?"#cbd5e1":"#2563eb"},children:t?"Borrowed":"Borrow"}):(0,i.jsx)("button",{onClick:()=>v(e.isbn),className:"btn-ghost btn-sm",style:{border:"1.5px solid #dc2626",color:"#dc2626",fontSize:11},children:"Reserve"})]})]})]},e.isbn)})})]}),(0,i.jsxs)("div",{className:"layout-split",children:[(0,i.jsxs)("div",{className:"card-block",style:{background:"#fff",borderRadius:20,padding:24,border:"1px solid rgba(15,23,42,0.06)"},children:[(0,i.jsx)("h3",{className:"card-title",children:"\uD83D\uDCCB Active borrowed Registers"}),0===r.length?(0,i.jsx)("div",{style:{padding:"30px 0",textAlign:"center",color:"#64748b",fontSize:13},children:"No active borrowings recorded in register."}):(0,i.jsxs)("table",{className:"tbl-borrows",children:[(0,i.jsx)("thead",{children:(0,i.jsxs)("tr",{children:[(0,i.jsx)("th",{children:"Ref ID"}),(0,i.jsx)("th",{children:"Book Title"}),(0,i.jsx)("th",{children:"Borrowed Date"}),(0,i.jsx)("th",{children:"Due Date"}),(0,i.jsx)("th",{children:"Status"}),(0,i.jsx)("th",{children:"Action"})]})}),(0,i.jsx)("tbody",{children:r.map(e=>{let t=new Date().getTime()>new Date(e.dueOn).getTime()&&!e.returned;return(0,i.jsxs)("tr",{children:[(0,i.jsx)("td",{style:{fontFamily:"var(--font-mono)",fontSize:11,fontWeight:700},children:e.id}),(0,i.jsx)("td",{style:{fontWeight:600},children:e.title}),(0,i.jsx)("td",{style:{color:"#64748b"},children:new Date(e.borrowedOn).toLocaleDateString()}),(0,i.jsx)("td",{style:{color:t?"#dc2626":"#64748b",fontWeight:t?700:400},children:new Date(e.dueOn).toLocaleDateString()}),(0,i.jsx)("td",{children:(0,i.jsx)("span",{className:`badge-status ${e.returned?"badge-paid":t?"badge-unpaid":"badge-gray"}`,style:{background:e.returned?"#ecfdf5":t?"#fef2f2":"#f1f5f9",color:e.returned?"#059669":t?"#ef4444":"#475569"},children:e.returned?"Returned":t?"Overdue":"Active"})}),(0,i.jsx)("td",{children:!e.returned&&(0,i.jsx)("button",{onClick:()=>y(e.id),className:"btn-ghost btn-sm",style:{border:"1px solid #cbd5e1",fontSize:11,padding:"4px 8px"},children:"Return"})})]},e.id)})})]})]}),(0,i.jsxs)("div",{className:"card-block",style:{background:"#fff",borderRadius:20,padding:24,border:"1px solid rgba(15,23,42,0.06)"},children:[(0,i.jsx)("h3",{className:"card-title",children:"⏳ Waitlist Reserves"}),0===n.length?(0,i.jsx)("div",{style:{padding:"30px 0",textAlign:"center",color:"#64748b",fontSize:13},children:"No active reservations placed."}):(0,i.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:10},children:n.map(e=>(0,i.jsxs)("div",{style:{background:"#f8fafc",padding:12,borderRadius:10,border:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{style:{fontSize:13,fontWeight:700},children:e.title}),(0,i.jsxs)("div",{style:{fontSize:11,color:"#64748b",marginTop:2},children:["Queue pos: ",(0,i.jsxs)("strong",{children:["#",e.position]})]})]}),(0,i.jsx)("span",{style:{fontSize:11,fontWeight:700,color:"#2563eb",background:"#eff6ff",padding:"3px 8px",borderRadius:20},children:"Reserved"})]},e.id))})]})]})]}),u&&(0,i.jsx)("div",{className:"overlay",children:(0,i.jsxs)("div",{className:"reader-modal",children:[(0,i.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #e2e8f0",paddingBottom:12},children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("h4",{style:{fontFamily:"var(--font-display)",fontSize:15,fontWeight:900,color:"#2563eb"},children:"⚡ BGS Digital Library E-Reader"}),(0,i.jsx)("div",{style:{fontSize:12,color:"#0f172a",fontWeight:800,marginTop:2},children:u.title})]}),(0,i.jsx)("button",{onClick:()=>g(null),style:{border:"none",background:"none",fontSize:18,cursor:"pointer",color:"#64748b"},children:"✕"})]}),(0,i.jsx)("div",{className:"reader-content-box",children:u.ebookContent}),(0,i.jsx)("div",{style:{marginTop:20,display:"flex",justifyContent:"flex-end"},children:(0,i.jsx)("button",{onClick:()=>g(null),className:"btn-primary",style:{background:"#2563eb"},children:"Close Reader Drawer"})})]})})]})}},77016:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>i});let i=(0,r(68570).createProxy)(String.raw`C:\Users\vinay\Desktop\project\verify-pinit\Pinit careers\src\app\library\page.tsx#default`)}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[9276,8042,9421],()=>r(31324));module.exports=i})();