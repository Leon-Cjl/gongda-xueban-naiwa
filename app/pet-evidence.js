/* 保守读取学校已有响应：不发请求、不读账号凭据，不把预约时长当学习时长。 */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./core.js'):root.CampusCore);if(typeof module==='object'&&module.exports)module.exports=api;else root.NaiwaPetEvidence=api;})(typeof window==='object'?window:globalThis,function(C){
 'use strict';
 const bad=/取消|违约|未签到|未入馆|失效|撤销|爽约/;
 const good=/已签到|使用中|已入座|已入馆|已完成|已结束|已签退|已离馆|已履约|正常离馆|签到成功|入馆成功/;
 function collect(records=[],current=[],now=Date.now(),historyFresh=false){
  const map=new Map(),historyDays=[],day=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date(now));
  function add(r,isCurrent){
   if(!r||typeof r!=='object')return;const t=C.reservationTimes(r,day);if(!t||t.begin.ms>now)return;
   const when=t.begin.day,status=String(r.status_name||r.statusMsg||'');
   if(!isCurrent)historyDays.push(when);
   // flag_out / flag_leave 在学校“当前预约”中分别表示已入座与暂离，沿用正式版适配含义。
   const seated=isCurrent&&([1,'1'].includes(r.flag_out)||[1,'1'].includes(r.flag_leave)||r.canCheckout===true);
   const result=bad.test(status)?'negative':/待签到|待入馆|未开始/.test(status)?'pending':good.test(status)||seated?'verified':'pending';
   const no=String(r.no??r.name??''),key='r:'+t.begin.ms+'|'+no+'|'+String(r.nameMerge||r.areaName||'');
   map.set(key,{key,day:when,result});
  }
  (Array.isArray(records)?records:[]).forEach(r=>add(r,false));(Array.isArray(current)?current:[]).forEach(r=>add(r,true));
  return{items:[...map.values()],historyFresh:!!historyFresh,coverageFrom:historyDays.sort()[0]||''};
 }
 return{collect};
});
