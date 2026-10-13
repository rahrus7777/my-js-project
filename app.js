import {lessons,matchesPrediction,parsePrediction,sourceOf} from './lessons.js';
const $=id=>document.getElementById(id);
let current=lessons[0], worker, timeout, trace=[], generation=0;
const buttons=new Map();
function stop(){generation++;worker?.terminate();worker=undefined;clearTimeout(timeout);$('run').disabled=false;}
function reset(){stop();trace=[];$('trace').replaceChildren();$('empty').hidden=false;$('status').textContent='Ready to run';$('download').disabled=true;$('feedback').textContent='';$('explanation').open=false;}
function select(lesson){current=lesson;reset();for(const [id,button] of buttons)button.setAttribute('aria-pressed',String(id===lesson.id));for(const key of ['title','topic','summary','why'])$(key).textContent=lesson[key];$('source').textContent=sourceOf(lesson);$('expected').textContent=lesson.expected.join(' → ');$('prediction').value='';}
for(const lesson of lessons){const b=document.createElement('button');b.textContent=lesson.title;const hint=document.createElement('small');hint.textContent=lesson.topic;b.append(hint);b.onclick=()=>{select(lesson);history.replaceState(null,'',`#${lesson.id}`);};buttons.set(lesson.id,b);$('lessons').append(b);}
$('reset').onclick=reset;
$('run').onclick=()=>{
 reset();$('run').disabled=true;$('status').textContent='Running in your browser…';const token=generation;
 const fail=message=>{stop();$('status').textContent=message;};
 try{worker=new Worker(new URL('./runner.js',import.meta.url),{type:'module'});
 worker.onmessage=({data})=>{if(token!==generation)return;
  if(data.type==='log'){trace.push({label:data.label,category:data.category,elapsed:data.elapsed});$('empty').hidden=true;const row=document.createElement('li');row.className=data.category;const order=document.createElement('span');order.textContent=String(trace.length).padStart(2,'0');const label=document.createElement('strong');label.textContent=data.label;const meta=document.createElement('small');meta.textContent=`${data.category} / ${data.elapsed.toFixed(2)} ms`;row.append(order,label,meta);$('trace').append(row);}
  else if(data.type==='complete'){stop();$('status').textContent=`${trace.length} logs captured`;$('download').disabled=false;}
  else if(data.type==='error')fail(data.message);
 };
 worker.onerror=()=>fail('Experiment could not start. Use a current browser and an HTTP(S) URL.');
 timeout=setTimeout(()=>fail('Experiment timed out. Try running it again.'),5000);worker.postMessage({id:current.id});
 }catch{fail('Web Workers are unavailable. Try a current browser.');}
};
$('prediction-form').onsubmit=event=>{event.preventDefault();const value=$('prediction').value;if(!parsePrediction(value).length){$('feedback').textContent='Enter a prediction first, for example A, D, C, B.';return;}$('feedback').textContent=matchesPrediction(value,current.expected)?'Correct! Run the experiment to verify it in your browser.':'Not quite. Run the experiment, then open “Why this order?” to compare.';};
$('download').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({experiment:current.id,title:current.title,trace},null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=`js-queue-lab-${current.id}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
select(lessons.find(item=>`#${item.id}`===location.hash)||lessons[0]);
window.addEventListener('pagehide',stop);
