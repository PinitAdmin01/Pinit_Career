"use strict";(()=>{var e={};e.id=979,e.ids=[979],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},33698:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>m,patchFetch:()=>g,requestAsyncStorage:()=>u,routeModule:()=>h,serverHooks:()=>p,staticGenerationAsyncStorage:()=>d});var i={};a.r(i),a.d(i,{POST:()=>c});var s=a(49303),o=a(88716),n=a(60670),r=a(87070);let l=[{title:"Thinking, Fast and Slow (Daniel Kahneman)",focus:"System 1 (automatic, biased) vs System 2 (slow, logical) thinking. Uncovering cognitive blind spots, loss aversion, and decision anxiety."},{title:"Extreme Ownership (Jocko Willink)",focus:"Taking absolute accountability for team outcomes, supporting subordinates under failure, and decisive action under ambiguity."},{title:"33 Strategies of War (Robert Greene)",focus:"Defensive warfare, turning situations around, counter-offensives, detecting team sabotage or political maneuverings."},{title:"The Art of Seduction (Robert Greene)",focus:"Detecting false security, manipulating client desires, managing boundaries against scope creep and manipulation."},{title:"Influence: The Psychology of Persuasion (Robert Cialdini)",focus:"Resisting authority bias, scarcity triggers, commitment consistency traps, and social proof manipulation."},{title:"The Millionaire Fastlane (MJ DeMarco)",focus:"Producer vs Consumer mindset, law of effection (scale of impact), high-agency execution over passive ideation."},{title:"The Black Swan (Nassim Nicholas Taleb)",focus:"Managing unexpected, low-probability high-impact emergencies (like critical server outrages) without panic."},{title:"Crucial Conversations (Kerry Patterson)",focus:"High-stakes communication, building dialogue safety, maintaining mutual respect under extreme deadline pressure."}];async function c(e){try{let{action:t,qt2:a=75,role:i="Software Developer",history:s=[],choice:o,scenarioId:n}=await e.json(),c=process.env.GROQ_API_KEY||(process.env.GROQ_API_KEYS||"").split(",")[0]?.trim(),h=process.env.OPENROUTER_API_KEY;if(!c&&!h)return r.NextResponse.json({ok:!0,message:"Offline Simulator Mode: System detected missing LLM API credentials. Rajesh: 'Vinay, I think we have an issue. The production branch was merged without the validation script, and now the client dashboard is showing null balances! What should we do?'",activeAvatar:"rajesh",avatarName:"Mr. Rajesh",avatarRole:"The Panicky Dev",choices:[{text:"Take ownership: 'I will rollback the merge immediately and setup a hotfix. Don't panic, let's look at the database logs.'",delta:4},{text:"Deflect blame: 'Rajesh, why did you merge without running the script? This was under your watch!'",delta:-3},{text:"Quick cover up: 'Let's disable the balance widget on the client side quickly so they don't notice it.'",delta:-2}],isEnded:!1});let u=async(e,t)=>{let a={model:"meta-llama/llama-3.1-8b-instruct:free",messages:[{role:"system",content:e},...t],temperature:.7,max_tokens:600};if(c){let e=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${c}`},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:a.messages,max_tokens:600,temperature:.7})});if(e.ok){let t=await e.json();return(t.choices?.[0]?.message?.content||"").trim()}}if(h){let e=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${h}`},body:JSON.stringify(a)});if(e.ok){let t=await e.json();return(t.choices?.[0]?.message?.content||"").trim()}}throw Error("LLM call failed")};if("initialize"===t){let e=l.sort(()=>.5-Math.random()).slice(0,3).map(e=>`- ${e.title}: ${e.focus}`).join("\n"),t=`You are the PinIT Mindset Orchestrator. 
Generate a real-life high-stakes scenario involving a ${i} with a baseline cognitive index (QT2 score) of ${a}.
The scenario MUST NOT be described. It should unfold directly as a role-play situation starting with a spoken dialogue by one of the following cast members:
- rajesh (panicky dev shifting blame)
- abhijit (impatient executive demanding metrics)
- sneha (distracting, overly polite colleague offering dynamic shortcut traps)
- rohan (strict tech lead grilling code details)

Choose 2 avatars to cast in this scenario. Focus on these mindset evolution literatures to test cognitive blind spots:
${e}

If the QT2 score is high (>=85), make the scenario extremely critical, high-stress, and deceptive (avatars manipulate or gaslight). If low (<75), start with a clear, direct challenge.

Format your response strictly as a JSON object:
{
  "scenarioTitle": "Title of the Scenario",
  "activeAvatar": "avatar_id (rajesh|abhijit|sneha|rohan)",
  "avatarName": "Full name of active avatar",
  "avatarRole": "Role name inside the scenario",
  "message": "Dialogue starting the crisis situation. Directly address the user in first-person speech.",
  "choices": [
    {"text": "Option A (High-agency/ownership selection)", "delta": 4, "rationale": "Why this aligns with System 2 or Extreme Ownership"},
    {"text": "Option B (Slightly compromised/reactive selection)", "delta": -1, "rationale": "Cognitive shortcut trap details"},
    {"text": "Option C (Worst case - deflection or quick patch coverup)", "delta": -4, "rationale": "Deflects or cheats, showing natural blindness"}
  ]
}
Return only this JSON. No extra commentary.`;try{let e=(await u(t,[{role:"user",content:"Generate the roleplay start."}])).replace(/```json/g,"").replace(/```/g,"").trim(),a=JSON.parse(e);return r.NextResponse.json({ok:!0,...a,scenarioId:`sc_${Date.now()}`})}catch(e){return console.warn("Failed to generate or parse initialization scenario, using fallback:",e),r.NextResponse.json({ok:!0,scenarioTitle:"Critical Branch Sync Failure",activeAvatar:"rajesh",avatarName:"Mr. Rajesh",avatarRole:"The Panicky Dev",message:"Vinay, look! The main branch just broke and the build fails. I think it's because someone pushed code without testing, and the client demo is in 5 minutes! I can force a bypass check on the repo, what do you think?",choices:[{text:"Take charge: 'Bypassing checks will corrupt the staging environment. Rajesh, let's roll back the last commit quickly and run the compiler locally.'",delta:4},{text:"Panic override: 'Okay, force the bypass quickly. We cannot let the client see a failed deployment.'",delta:-3},{text:"Blame deflection: 'Who pushed that last commit? Rajesh, check the git logs and call them in, they need to fix this.'",delta:-2}],scenarioId:`sc_${Date.now()}`})}}if("respond"===t){let e=s.filter(e=>"assistant"===e.role).length>=4,t=l.slice(0,3).map(e=>e.title).join(", "),a=`You are the PinIT Mindset Orchestrator running an interactive roleplay.
We are evaluating the user on strategic decisions drawn from: ${t}.
The user just chose: "${o}".

Generate the next node in the simulation.
If this is the final node (isFinalNode: true), the active avatar should conclude their reaction, and the choices array MUST be empty. Set "isEnded": true.
Otherwise, continue the crisis. You can switch the active avatar to another cast member (rajesh, abhijit, sneha, rohan) to complicate the situation (e.g. Abhijit steps in to demand updates, or Sneha suggests another compromise).

Format your response strictly as a JSON object:
{
  "activeAvatar": "avatar_id (rajesh|abhijit|sneha|rohan)",
  "avatarName": "Full name of the active avatar",
  "avatarRole": "Role inside scenario",
  "message": "Avatar's spoken response dialogue to the user's choice. Highly conversational, realistic, and maintaining first-person drama.",
  "choices": [
    {"text": "Option A...", "delta": 4},
    {"text": "Option B...", "delta": -1},
    {"text": "Option C...", "delta": -4}
  ],
  "isEnded": ${e}
}
Return only this JSON. No extra commentary.`;try{let e=(await u(a,s)).replace(/```json/g,"").replace(/```/g,"").trim(),t=JSON.parse(e);return r.NextResponse.json({ok:!0,...t})}catch(t){return console.warn("Failed to generate or parse response step, using fallback:",t),r.NextResponse.json({ok:!0,activeAvatar:e?"abhijit":"rohan",avatarName:e?"Mr. Abhijit":"Mr. Rohan",avatarRole:e?"The Executive":"The Technical Lead",message:e?"We are out of time. The client demo has started. We'll have to explain the logs later.":"Rohan: 'Explain this rollback. Are you taking full ownership of the delay, or was there a failure in our pre-commit git hooks?'",choices:e?[]:[{text:"Take ownership: 'Yes, I take full responsibility. I bypassed a check because I prioritized speed, but we are restoring stability now.'",delta:4},{text:"Deflect: 'It's the automated testing suite. It takes too long, which forced us to push directly.'",delta:-3}],isEnded:e})}}if("evaluate"===t){let e=`You are the PinIT Mindset Evaluator.
Analyze the complete roleplay conversation history between the student and the avatars:
${JSON.stringify(s)}

Generate a detailed Socratic evaluation report (Markdown) and a spoken conclusion summary.
Format your output strictly as a JSON object:
{
  "report": "Detailed Markdown report documenting the student's psychological profile (Decisiveness, Accountability, Persuasion resistance, Fastlane focus). Quote specific choices they made and connect them to books (like Kahneman's System 1/2 or Willink's Extreme Ownership). Output strictly in Markdown with alerts, headers, and bullet points.",
  "spokenConclusion": "A short, conversational speech (3-4 sentences, max 80 words) for the active avatar to say out loud to the user. Explain where we started in this crisis, how the user handled it, and where we ended up (conclusion)."
}
Return only this JSON. No extra commentary.`,t=0;s.forEach(e=>{void 0!==e.delta&&(t+=e.delta)});let a=Math.min(5,Math.max(-5,t)),i=Math.min(8,Math.max(-8,Math.round(1.5*t))),o=Math.min(6,Math.max(-6,Math.round(1.2*t))),n=Math.min(8,Math.max(-8,Math.round(1.4*t))),l=Math.min(6,Math.max(-6,Math.round(1.1*t)));try{let t=(await u(e,[{role:"user",content:"Generate evaluation report JSON."}])).replace(/```json/g,"").replace(/```/g,"").trim(),s=JSON.parse(t);return r.NextResponse.json({ok:!0,report:s.report,spokenConclusion:s.spokenConclusion,qt2_delta:a,leadership_delta:i,communication_delta:o,execution_delta:n,intelligence_delta:l})}catch(e){return console.warn("Failed to generate evaluation report, using fallback:",e),r.NextResponse.json({ok:!0,report:`### 🧠 Socratic Persona Evolution Summary

Offline fallback evaluator successfully executed.

* **Decisiveness under stress**: Resilient System 2 responses.
* **Accountability level**: High ownership demonstrated.
* **Mindset alignment**: Strategy models processed locally.`,spokenConclusion:"I have analyzed your decisions throughout this crisis. We started with a critical service outage, and through your high-ownership responses, we successfully navigated the situation. Please review your personalized evaluation report details below.",qt2_delta:a,leadership_delta:i,communication_delta:o,execution_delta:n,intelligence_delta:l})}}return r.NextResponse.json({error:"Invalid action"},{status:400})}catch(e){return r.NextResponse.json({error:e.message||"Server error"},{status:500})}}let h=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/missions/roleplay/route",pathname:"/api/missions/roleplay",filename:"route",bundlePath:"app/api/missions/roleplay/route"},resolvedPagePath:"C:\\Users\\vinay\\Desktop\\project\\verify-pinit\\Pinit careers\\src\\app\\api\\missions\\roleplay\\route.ts",nextConfigOutput:"export",userland:i}),{requestAsyncStorage:u,staticGenerationAsyncStorage:d,serverHooks:p}=h,m="/api/missions/roleplay/route";function g(){return(0,n.patchFetch)({serverHooks:p,staticGenerationAsyncStorage:d})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),i=t.X(0,[9276,5972],()=>a(33698));module.exports=i})();