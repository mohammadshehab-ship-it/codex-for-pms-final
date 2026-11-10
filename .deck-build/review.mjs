import fs from 'node:fs/promises';
import {PresentationFile,FileBlob} from 'file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
const r='C:/Users/user/codex-for-pms-final';
const p=await PresentationFile.importPptx(await FileBlob.load(r+'/output/dispatch-briefing/Rook-Dispatch-Leadership-Briefing.pptx'));
for(let i=0;i<p.slides.items.length;i++){const b=await p.export({slide:p.slides.items[i],format:'png',scale:1});await fs.writeFile(r+'/.deck-build/final-'+(i+1)+'.png',new Uint8Array(await b.arrayBuffer()));}
console.log('Rendered eight final slides');
