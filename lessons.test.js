import test from 'node:test';
import assert from 'node:assert/strict';
import {Worker} from 'node:worker_threads';
import {lessons,matchesPrediction,sourceOf} from './lessons.js';
for(const lesson of lessons){test(`execution order: ${lesson.id}`,async()=>{
 const url=new URL('./runner.js',import.meta.url).href;
 const source=`import {parentPort} from 'node:worker_threads';globalThis.self={postMessage:msg=>parentPort.postMessage(msg)};await import(${JSON.stringify(url)});self.onmessage({data:{id:${JSON.stringify(lesson.id)}}});`;
 const worker=new Worker(new URL('data:text/javascript,'+encodeURIComponent(source)));const output=[];
 try{await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Runner timed out')),4000);worker.on('error',e=>{clearTimeout(timer);reject(e);});worker.on('message',m=>{if(m.type==='log')output.push(m);if(m.type==='error'){clearTimeout(timer);reject(new Error(m.message));}if(m.type==='complete'){clearTimeout(timer);resolve();}});});
 assert.deepEqual(output.map(x=>x.label),lesson.expected);assert.ok(output.every(x=>['sync','task','microtask'].includes(x.category)));assert.ok(output.every(x=>Number.isFinite(x.elapsed)&&x.elapsed>=0));assert.ok(sourceOf(lesson).includes("log('A'"));
 }finally{await worker.terminate();}
});}
test('prediction normalization and invalid input',()=>{assert.ok(matchesPrediction('a, d c → b',['A','D','C','B']));for(const v of ['', 'A B','A D C B B','<script>','A C D B'])assert.equal(matchesPrediction(v,['A','D','C','B']),false);});
test('unique lesson identifiers',()=>assert.equal(new Set(lessons.map(x=>x.id)).size,lessons.length));
