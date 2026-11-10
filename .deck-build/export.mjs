import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from 'file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
import {finalizePresentation} from 'file:///C:/Users/user/.codex/plugins/cache/openai-primary-runtime/presentations/26.1025.11240/skills/presentations/container_tools/artifact_tool_utils.mjs';
const root='C:/Users/user/codex-for-pms-final';
const p=Presentation.create({slideSize:{width:1280,height:720}});
const records=JSON.parse(await fs.readFile(root+'/.deck-build/content.json','utf8'));
for(const r of records){
 const s=p.slides.add();s.background.fill='#F7F5EF';
 for(const e of r.elements){if(e.kind!=='textbox')continue;const a=s.shapes.add({geometry:'textbox',position:e.position,fill:'none',line:{fill:'none',width:0}});a.text=e.text;a.text.style={...e.style,fontFamily:'Aptos'};}
 s.speakerNotes.text=r.notes?.text??'';
}
const teal='#007D79',red='#B54536';
p.slides.items[2].charts.add('bar',{position:{left:64,top:185,width:770,height:395},categories:['Before 4.2','From 12 Aug'],series:[{name:'Taken',values:[76.6,64],fill:teal},{name:'Missed',values:[2.3,18],fill:red},{name:'Turned down',values:[21.1,18],fill:'#A8B4B9'}],hasLegend:true,legend:{position:'bottom'},barOptions:{direction:'column',grouping:'stacked'},yAxis:{min:0,max:100},dataLabels:{showValue:true}});
p.slides.items[3].charts.add('line',{position:{left:64,top:180,width:790,height:405},categories:['29 Jun','6 Jul','13 Jul','20 Jul','27 Jul','3 Aug','10 Aug','17 Aug','24 Aug','31 Aug'],series:[{name:'Vesper',values:[14,13,15,14,13,14,12,5,2,1],line:{fill:red,width:3}},{name:'Meteor Mite',values:[11,12,10,11,12,11,10,4,2,1],line:{fill:'#CA8D24',width:3}},{name:'The Gale',values:[13,12,13,14,13,13,15,17,20,21],line:{fill:teal,width:3}}],hasLegend:true,legend:{position:'bottom'},yAxis:{min:0,max:25}});
const candidate=root+'/.deck-build/candidate.pptx';
await(await PresentationFile.exportPptx(p)).save(candidate);
const skill='C:/Users/user/.codex/plugins/cache/openai-primary-runtime/presentations/26.1025.11240/skills/presentations';
const result=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:root+'/output/dispatch-briefing/Rook-Dispatch-Leadership-Briefing.pptx',pythonExecutable:'C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],fontPolicy:{basis:'design',families:['Aptos']},requiredNativeChartOwnerSlides:[3,4],materializeLiteralChartWorkbooks:true,verifyArtifactToolImport:true,receiptPath:root+'/.deck-build/validation.json'});
console.log(JSON.stringify(result));


