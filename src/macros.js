const N=(c,t,h)=>`<div class="note ${c}"><b class="t">${t}</b>${h}</div>`;
const W=h=>N('why','Why this step',h),S=h=>N('save','Saves money',h),M=h=>N('trap','Beginner trap',h),V=h=>N('check','Verify before relying on this',h),T=h=>N('track','Numbers to track',h),F=h=>N('file','Deal File',h),I=h=>N('why','What investors learn late',h);
const Q=(q,o,e)=>({q,o,e});
const L=(title,min,body,quiz)=>({title,min,body,quiz});
const COURSE=[];
