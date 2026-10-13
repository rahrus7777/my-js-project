import {lessons} from './lessons.js';
self.onmessage = ({data}) => {
 const lesson=lessons.find(item=>item.id===data.id);
 if(!lesson){self.postMessage({type:'error',message:'Unknown experiment.'});return;}
 const start=performance.now(); let count=0;
 try { lesson.program((label,category)=>{
  self.postMessage({type:'log',label,category,elapsed:performance.now()-start});
  if(++count===lesson.expected.length) self.postMessage({type:'complete'});
 }); } catch(error){self.postMessage({type:'error',message:error.message});}
};
