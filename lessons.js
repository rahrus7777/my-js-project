// Programs are displayed from the same functions that the worker executes.
// Categories are teaching annotations, not automatic engine instrumentation.
export const lessons = [
 {id:'first',title:'Promises before timers',topic:'The basic checkpoint',summary:'A zero-delay timer and a fulfilled promise: which callback gets its turn first?',expected:['A','D','C','B'],why:'A and D run synchronously. The fulfilled promise queues C as a microtask. Once the current task ends, C runs before the timer B. A zero-millisecond delay does not mean immediate execution.',program:function(log){
  log('A', 'sync');
  setTimeout(() => log('B', 'task'), 0);
  Promise.resolve().then(() => log('C', 'microtask'));
  log('D', 'sync');
 }},
 {id:'nested',title:'Microtasks inside microtasks',topic:'Drain the whole queue',summary:'A microtask schedules another microtask while a timer is already waiting.',expected:['A','B','D','C','E'],why:'A is synchronous. B and D enter the microtask queue in that order. B appends C behind D. The queue drains completely (B, D, C) before the timer E runs.',program:function(log){
  log('A', 'sync');
  queueMicrotask(() => {
    log('B', 'microtask');
    queueMicrotask(() => log('C', 'microtask'));
  });
  Promise.resolve().then(() => log('D', 'microtask'));
  setTimeout(() => log('E', 'task'), 0);
 }},
 {id:'await',title:'Where await pauses',topic:'Async function continuation',summary:'An async function begins immediately, but its continuation waits for a microtask.',expected:['A','B','D','C','E'],why:'Calling work() runs B immediately. Awaiting an already fulfilled promise queues the continuation C. The caller logs D and queues E. At the checkpoint C runs before E because it was queued first.',program:function(log){
  async function work() {
    log('B', 'sync');
    await Promise.resolve();
    log('C', 'microtask');
  }
  log('A', 'sync');
  work();
  log('D', 'sync');
  queueMicrotask(() => log('E', 'microtask'));
 }},
 {id:'executor',title:'The promise executor',topic:'Creating is not reacting',summary:'The function passed to new Promise runs synchronously. Its reaction does not.',expected:['A','B','D','C'],why:'The Promise constructor calls its executor immediately, producing B between A and D. resolve() fulfills the promise, but the .then() handler C runs as a later microtask.',program:function(log){
  log('A', 'sync');
  new Promise(resolve => {
    log('B', 'sync');
    resolve();
  }).then(() => log('C', 'microtask'));
  log('D', 'sync');
 }},
 {id:'timers',title:'Between two timers',topic:'A checkpoint after each task',summary:'Two timers are scheduled in order. The first adds a promise reaction.',expected:['A','B','C','D'],why:'After synchronous A, the first timer logs B and queues C. Its task ends, so C runs at the microtask checkpoint before the second timer D. These timers use the same delay and task source; this is not a general ordering guarantee across different task sources.',program:function(log){
  log('A', 'sync');
  setTimeout(() => {
    log('B', 'task');
    Promise.resolve().then(() => log('C', 'microtask'));
  }, 0);
  setTimeout(() => log('D', 'task'), 0);
 }}
];
export const parsePrediction = value => value.trim().toUpperCase().split(/[\s,;→]+/u).filter(Boolean);
export function matchesPrediction(value, expected) { const p=parsePrediction(value); return p.length===expected.length && p.every((v,i)=>v===expected[i]); }
export const sourceOf = lesson => lesson.program.toString().split('\n').slice(1,-1).map(line=>line.replace(/^  /,'')).join('\n');
