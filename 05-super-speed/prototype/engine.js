(function(root){
 'use strict';
 const scenarios={
 journey:['The recovery journey','Start with Linda. Review the history, request a review, then switch to Farlight to confirm readiness. The operator can preview and approve repair. Create a callout afterwards.'],
 competitor:['Someone else gets the job','Repair can help without guaranteeing work. Create a callout: Beacon, a simulated responder, is closer and ranks first. Let Beacon accept.'],
 decline:['A timely decline','Create a callout, switch to Farlight and decline. Routing immediately asks the next candidate; her score stays unchanged.'],
 misses:['Three confirmed misses','Create and expire three offers to Farlight. Each receipt leaves 55 seconds to reply. The third produces an advisory prompt without removing eligibility.'],
 receipt:['Delivery is uncertain','Choose missing, late or invalid receipt, create a callout and expire it. It does not count toward the prompt. Receipt settings affect new offers only.'],
 missing:['No stored score','Open the operator view and preview. Missing information must lead to review, never an invented repair. Routing is held for this demo until data is restored; production fallback needs a decision.'],
 high:['Already above neutral','The simulated score starts at 0.72. Previewing must leave it untouched; no recovery adjustment is needed.'],
 stale:['The preview became stale','Preview as the operator. Use “Concurrent acceptance” to add legitimate credit, then approve. The stale preview must be rejected. Refresh it before retrying.'],
 duplicate:['Repeated actions','Request the review twice, preview and use “Approve twice.” Only one adjustment and one audit entry should appear.'],
 failure:['A save fails','Preview as the operator. The first approval fails with no score change. Retry the same approval; it commits once.'],
 availability:['An old availability action','Farlight has an old confirmation open. Linda records a newer unavailable choice. Submit the old action: it must not overwrite Linda’s choice. Reload before confirming.'],
 promptFailure:['A prompt cannot be delivered','Expire three qualifying offers. The prompt queue fails, but the next candidate still gets an offer. Retry delivery with the same prompt ID.']
 };
 function initial(scenario='journey') {return {schema:1,scenario,actor:'linda',now:0,score:scenario==='missing'?null:scenario==='high'?.72:.2,sv:1,available:true,av:1,viewAv:1,confirmed:null,engaged:false,review:'none',preview:null,repair:null,audit:[],misses:[],cooldown:0,prompt:null,receipt:'confirmed',failSave:scenario==='failure',failPrompt:scenario==='promptFailure',call:null,calls:[],seq:0,message:'Explore Farlight’s recorded history, then begin her recovery review.',events:[]};}
 const round=n=>Math.round(n*1000000)/1000000;
 function rank(history,minutes,match=1){return round(.6*Math.max(0,1-minutes/45)+.25*history+.15*match);}
 function event(s,msg){s.message=msg;s.events.unshift({time:s.now,text:msg});}
 function clear(s){s.misses=[];s.cooldown=0;if(s.prompt)s.prompt.status='resolved';}
 function next(s){
  const c=s.call;c.index++;
  if(c.index>=c.candidates.length){c.status='unassigned';event(s,'No one took this callout. Escalation is needed; no scores were deducted.');return;}
  const person=c.candidates[c.index];
  c.status='offered'; c.offer={id:c.id+'-'+c.index,name:person.name,sent:s.now,deadline:s.now+60,receipt:s.receipt==='missing'?null:s.now+({confirmed:5,late:45,invalid:-1}[s.receipt]),outcome:null};
  event(s,'Offer sent to '+person.name+' · 60 seconds to reply.');
 }
 function expire(s){
  const c=s.call,o=c.offer; o.outcome='missed'; c.outcomes.push({...o});
  if(o.name==='Farlight'){
   if(o.receipt===null||o.receipt<o.sent||o.receipt>o.deadline-30){s.misses=[];event(s,'Delivery did not establish 30 seconds to respond. Miss streak cleared; score unchanged.');}
   else if(s.now>=s.cooldown){
    s.misses=s.misses.filter(t=>s.now-t<=3600);s.misses.push(s.now);
    if(s.misses.length>=3){s.misses=[];s.cooldown=s.now+3600;s.prompt={id:'prompt-'+(++s.seq),status:s.failPrompt?'failed':'delivered',attempts:1,av:s.av};event(s,s.failPrompt?'Prompt delivery failed. Routing continues; retry is available.':'Still available? Advisory prompt delivered. Eligibility is unchanged.');}
    else event(s,'Confirmed miss '+s.misses.length+' of 3. No history points deducted.');
   }else event(s,'Prompt cooldown active. Score and eligibility unchanged.');
  }
  next(s);
 }
 function step(state,a){
  const s=JSON.parse(JSON.stringify(state));const type=a.type;
  if(type==='RESET')return initial(a.scenario||s.scenario);
  if(type==='ACTOR'){s.actor=a.actor;s.viewAv=s.av;return s;}
  if(type==='RECEIPT'){s.receipt=a.value;return s;}
  if(type==='REQUEST'){
   if(s.actor!=='linda'){event(s,'Only Linda can request this review in this demo.');return s;}
   if(s.review!=='none'){event(s,'Review R-43-F already exists. No duplicate request created.');return s;}
   s.review='requested';event(s,'Review R-43-F requested through simulated support. No score has changed.');
  }
  if(type==='AVAILABLE'){
   if(!['linda','farlight'].includes(s.actor)){event(s,'This operator cannot change readiness.');return s;}
   if((a.version??s.viewAv)!==s.av){event(s,'Availability changed since this screen opened. Reload status and confirm your choice.');return s;}
   if(a.fail){event(s,'Availability could not be saved. Previous state retained. Try again.');return s;}
   s.available=a.value;s.av++;s.viewAv=s.av;s.confirmed=s.now;clear(s);event(s,a.value?'Availability confirmed. Linda and Farlight see the same saved timestamp.':'Marked unavailable. Future callouts will exclude Farlight.');
  }
  if(type==='RELOAD'){s.viewAv=s.av;event(s,'Latest availability loaded. Confirm your intended choice.');}
  if(type==='NEWER_UNAVAILABLE'){s.available=false;s.av++;event(s,'Simulated concurrent action: Linda saved “Unavailable.” The open phone action is now stale.');}
  if(type==='PREVIEW'){
   if(s.actor!=='operator'){event(s,'Only the recovery operator can preview scores.');return s;}
   if(s.repair){event(s,'Recovery adjustment already applied. No second repair permitted.');return s;}
   if(s.score===null){s.review='needed';s.preview=null;event(s,'Review needed: no verified stored score. Nothing changed.');return s;}
   if(s.score>=.5){s.review='not-needed';s.preview=null;event(s,'No adjustment needed. The score is already at or above neutral.');return s;}
   s.preview={score:s.score,version:s.sv,id:'repair-farlight-43'};s.review='preview';event(s,'Adjustment awaiting approval. Preview '+s.score.toFixed(2)+' → 0.50.');
  }
  if(type==='APPROVE'){
   if(s.actor!=='operator'){event(s,'Permission denied. Only the recovery operator can approve.');return s;}
   if(s.repair){event(s,'Already applied: returning the original result. No second adjustment.');return s;}
   if(!s.preview){event(s,'Review needed. Preview a verified score first.');return s;}
   if(s.preview.version!==s.sv||s.preview.score!==s.score){s.preview=null;s.review='needed';event(s,'Review needed: score changed since preview. Refresh preview; nothing was overwritten.');return s;}
   if(s.failSave){s.failSave=false;event(s,'Save failed before commit. Score and audit are unchanged. Retry approval.');return s;}
   s.repair={id:s.preview.id,before:s.score,after:.5,time:s.now,version:s.sv,actor:'Recovery operator',evidence:'Module 3 / tickets 3060, 3110, 3130'};s.score=.5;s.sv++;s.audit.push(s.repair);s.review='applied';s.preview=null;event(s,'Recovery adjustment applied. One committed score change and one audit entry.');
  }
  if(type==='CONCURRENT'){
   if(s.score===null){event(s,'No stored score: concurrent credit cannot be simulated.');return s;}
   s.score=round(Math.min(1,s.score+.08));s.sv++;clear(s);event(s,'Separate simulated acceptance added 0.08 credit. The score version changed; old previews are stale.');
  }
  if(type==='CALLOUT'){
   if(s.call?.status==='offered'){event(s,'Finish the active callout first.');return s;}
   if(s.engaged){event(s,'Farlight is engaged. Complete her demo job before creating another.');return s;}
   if(s.score===null){event(s,'Routing demonstration unavailable: score data is missing. No ranking has been invented.');return s;}
   if(s.call)s.calls.push(s.call);
   const competitor=s.scenario==='competitor';
   const candidates=[...(s.available?[{name:'Farlight',travel:8,history:s.score,match:1}]:[]),{name:'Beacon',travel:competitor?2:18,history:.7,match:1}].map(p=>({...p,total:rank(p.history,p.travel,p.match)})).sort((x,y)=>y.total-x.total);
   s.call={id:'SIM-'+(++s.seq),name:'Uptown • fallen masonry at Cedar Arcade',status:'new',index:-1,candidates,outcomes:[],started:s.now};next(s);
  }
  if(type==='ANSWER'){
   const c=s.call,o=c?.offer;
   if(!c||c.status!=='offered'){event(s,'No active offer. A completed response cannot be applied twice.');return s;}
   if(a.offerId&&a.offerId!==o.id){event(s,'That offer has already moved on. No changes made.');return s;}
   if(o.name==='Farlight'&&s.actor!=='farlight'){event(s,'Only Farlight can answer her phone offer.');return s;}
   if(o.name!=='Farlight'&&!a.demo){event(s,'This offer belongs to another responder.');return s;}
   if(s.now>=o.deadline){expire(s);return s;}
   o.outcome=a.value;c.outcomes.push({...o});if(o.name==='Farlight')clear(s);
   if(a.value==='taken'){
    c.status='assigned';c.assignee=o.name;c.assignedAt=s.now;
    if(o.name==='Farlight'){s.score=round(Math.min(1,s.score+.08));s.sv++;s.engaged=true;}
    event(s,'Assigned to '+o.name+'. '+(o.name==='Farlight'?'Acceptance credit saved once.':'Farlight was not pinged if the callout ended before her turn. Repair does not guarantee work.'));
   }else{event(s,o.name+' declined. Score unchanged; moving to the next candidate.');next(s);}
  }
  if(type==='TICK'){
   const end=s.now+a.seconds;
   while(s.call?.status==='offered'&&s.call.offer.deadline<=end){s.now=s.call.offer.deadline;expire(s);}s.now=end;
   s.misses=s.misses.filter(t=>s.now-t<=3600);
  }
  if(type==='RETRY_PROMPT'){
   if(s.prompt?.status!=='failed'){event(s,'No failed prompt to retry.');return s;}
   s.prompt.attempts++;s.prompt.status='delivered';s.failPrompt=false;event(s,'Prompt delivered on retry using the same ID. No duplicate prompt created.');
  }
  if(type==='COMPLETE'){s.engaged=false;event(s,'Simulated job completed. Farlight is no longer engaged. Stated availability is unchanged.');}
  return s;
 }
 const api={initial,step,rank,scenarios};if(typeof module!=='undefined')module.exports=api;else root.Rook=api;
})(typeof globalThis!=='undefined'?globalThis:this);
