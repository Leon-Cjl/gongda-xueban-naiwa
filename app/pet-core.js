/* 奶蛙宠物纯规则；北京时间、账号隔离由宿主调用方提供。 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NaiwaPetCore=api;})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const DAY=86400000,fmt=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'});
 const today=(now=Date.now())=>fmt.format(new Date(now));
 function dayNumber(day){if(!/^\d{4}-\d{2}-\d{2}$/.test(String(day)))return NaN;const n=Date.parse(day+'T00:00:00Z');return Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===day?n/DAY:NaN;}
 const valid=day=>Number.isFinite(dayNumber(day));
 const shift=(day,n)=>new Date((dayNumber(day)+n)*DAY).toISOString().slice(0,10);
 const weekDay=day=>new Date(dayNumber(day)*DAY).getUTCDay()||7;
 const cleanDays=days=>[...new Set((Array.isArray(days)?days:[]).map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=7))].sort((a,b)=>a-b);
 const clone=x=>JSON.parse(JSON.stringify(x));
 const cleanName=name=>Array.from(String(name||'奶蛙').replace(/[\u0000-\u001f\u007f]/g,'').trim()).slice(0,12).join('')||'奶蛙';
 function adopt(day,name='奶蛙',days=[1,3,5]){if(!valid(day))throw Error('日期无效');const schedule=cleanDays(days);if(!schedule.length)throw Error('至少选一个学习日');return{v:1,adoptedDay:day,name:cleanName(name),schedule:[{from:day,days:schedule}],pauses:[],observations:{},rewards:[],coverage:[],lastHistoryDay:'',lastHistoryAt:0,lastMisses:0,scene:'cream',decor:'none',theatrical:false};}
 function normalise(p){if(!p||p.v!==1||!valid(p.adoptedDay))return null;const out=clone(p);out.name=cleanName(p.name);out.observations=p.observations&&typeof p.observations==='object'&&!Array.isArray(p.observations)?clone(p.observations):{};out.rewards=[...new Set((p.rewards||[]).filter(valid))].sort();out.coverage=(p.coverage||[]).filter(x=>Array.isArray(x)&&valid(x[0])&&valid(x[1])&&x[0]<=x[1]);out.pauses=(p.pauses||[]).filter(x=>valid(x.from)&&(!x.to||valid(x.to)));out.schedule=(p.schedule||[]).filter(x=>valid(x.from)&&cleanDays(x.days).length).map(x=>({from:x.from,days:cleanDays(x.days)})).sort((a,b)=>a.from.localeCompare(b.from));if(!out.schedule.length)out.schedule=[{from:p.adoptedDay,days:[1,3,5]}];out.lastMisses=Math.max(0,Math.min(7,Number(p.lastMisses)||0));return out;}
 const scheduleAt=(p,day)=>[...p.schedule].reverse().find(x=>x.from<=day)?.days||p.schedule[0].days;
 const paused=(p,day)=>p.pauses.some(x=>x.from<=day&&(!x.to||day<=x.to));
 const covered=(p,day)=>p.coverage.some(([a,b])=>a<=day&&day<=b);
 function mergeCoverage(intervals,from,to){const all=[...intervals];if(valid(from)&&valid(to)&&from<=to)all.push([from,to]);all.sort((a,b)=>a[0].localeCompare(b[0]));const out=[];for(const x of all){const last=out[out.length-1];if(last&&dayNumber(x[0])<=dayNumber(last[1])+1)last[1]=x[1]>last[1]?x[1]:last[1];else out.push([...x]);}return out.slice(-64);}
 function verifiedDays(p){return [...new Set(Object.values(p.observations).filter(x=>x.result==='verified'&&valid(x.day)&&x.day>=p.adoptedDay).map(x=>x.day))].sort();}
 function missedDays(p,day){
  const visits=new Set(verifiedDays(p).filter(x=>x<=day));if(visits.has(day))return 0;
  let misses=0;const end=shift(day,-1),start=Math.max(dayNumber(p.adoptedDay),dayNumber(end)-3660),pending=new Set(Object.values(p.observations).filter(x=>x.result==='pending').map(x=>x.day));
  for(let n=start;n<=dayNumber(end);n++){const d=new Date(n*DAY).toISOString().slice(0,10);if(visits.has(d)){misses=0;continue;}if(paused(p,d)||!scheduleAt(p,d).includes(weekDay(d)))continue;if(!covered(p,d)||pending.has(d)){misses=0;continue;}misses++;}
  return Math.min(7,misses);
 }
 function reconcile(input,evidence,now=Date.now()){
  const p=normalise(input);if(!p)throw Error('宠物数据版本不兼容，请保留数据并更新应用');const day=today(now),newRewards=[];
  if(p.lastHistoryDay&&p.lastHistoryDay>day)return{pet:p,newRewards,changed:false};
  for(const row of evidence.items||[]){if(!row.key||!valid(row.day)||row.day<p.adoptedDay||row.day>day||!['verified','negative','pending'].includes(row.result))continue;p.observations[row.key]={day:row.day,result:row.result};}
  for(const d of verifiedDays(p)){if(d<=day&&!p.rewards.includes(d)){p.rewards.push(d);newRewards.push(d);}}
  p.rewards.sort();
  if(evidence.historyFresh&&valid(evidence.coverageFrom)&&evidence.coverageFrom<=shift(day,-1)){
   // 只结算已结束的完整日；今天的签到可能发生在本次同步之后。
   p.coverage=mergeCoverage(p.coverage,evidence.coverageFrom,shift(day,-1));p.lastHistoryDay=day;p.lastHistoryAt=now;p.lastMisses=missedDays(p,day);
  }else if(verifiedDays(p).includes(day)){p.lastMisses=0;}
  return{pet:p,newRewards,changed:JSON.stringify(p)!==JSON.stringify(input)};
 }
 const stages=['精神满满','打个小盹','有点想你','蔫蔫的','冬眠中'];
 function summary(input,now=Date.now(),online=true){const p=normalise(input);if(!p)return null;const day=today(now),days=verifiedDays(p),attendedToday=days.includes(day),isPaused=p.pauses.some(x=>x.from<=day&&(!x.to||day<=x.to)&&x.resumedOn!==day),misses=attendedToday?0:p.lastMisses,index=misses>=7?4:misses>=4?3:misses>=2?2:misses===1?1:0;return{day,days:days.length,rewardDays:p.rewards.length,xp:p.rewards.length*10,level:1+Math.floor(p.rewards.length/5),attendedToday,paused:isPaused,learningDay:scheduleAt(p,day).includes(weekDay(day)),misses,stage:isPaused?'休息中':stages[index],stageIndex:isPaused?1:index,waiting:!online||p.lastHistoryDay!==day,clockChanged:!!p.lastHistoryDay&&p.lastHistoryDay>day,schedule:scheduleAt(p,day),name:p.name};}
 function configure(input,{name,days,theatrical},day){const p=normalise(input);if(!p)throw Error('宠物数据版本不兼容');if(name!==undefined)p.name=cleanName(name);if(theatrical!==undefined)p.theatrical=!!theatrical;if(days!==undefined){const cleaned=cleanDays(days);if(!cleaned.length)throw Error('至少选一个学习日，也可以使用暂停');const from=shift(day,1);p.schedule=p.schedule.filter(x=>x.from!==from);p.schedule.push({from,days:cleaned});p.schedule.sort((a,b)=>a.from.localeCompare(b.from));}return p;}
 function pause(input,day,days=7){const p=normalise(input);if(!p)throw Error('宠物数据版本不兼容');p.pauses=p.pauses.filter(x=>x.to&&x.to<day);p.pauses.push({from:day,to:days?shift(day,Math.max(1,Math.min(365,days))-1):''});return p;}
 function resume(input,day){const p=normalise(input);if(!p)throw Error('宠物数据版本不兼容');for(const x of p.pauses)if(x.from<=day&&(!x.to||x.to>=day)){x.to=day;x.resumedOn=day;}return p;}
 const DECORS=[{id:'none',name:'清爽小屋',days:0},{id:'book',name:'小书本',days:3},{id:'desk',name:'小书桌',days:7},{id:'lamp',name:'小台灯',days:14},{id:'hat',name:'毕业帽',days:30}];
 const SCENES=[{id:'cream',name:'奶油小屋',days:0},{id:'rain',name:'雨天陪伴',days:0},{id:'clouds',name:'云海发呆',days:3},{id:'music',name:'云上听歌',days:7},{id:'fog',name:'雾中发呆',days:7},{id:'sea',name:'海边休息',days:14},{id:'bamboo',name:'竹影小屋',days:30}];
 const LOOKS=[{id:'auto',name:'每天换个样',days:0},{id:'neutral',name:'摸摸肚皮',days:0},{id:'laugh',name:'高兴模式',days:0},{id:'echo',name:'回响模式',days:0},{id:'stern',name:'蛙蛙督学',days:0},{id:'flower',name:'送你小花',days:0},{id:'hoodie',name:'神秘学霸',days:3}];
 function equip(input,type,id){const p=normalise(input);if(!p)throw Error('宠物数据版本不兼容');const list={scene:SCENES,decor:DECORS,look:LOOKS}[type],item=list?.find(x=>x.id===id);if(!item||p.rewards.length<item.days)throw Error('再积累几个入馆日，就能解锁啦');p[type]=id;return p;}
 return{today,dayNumber,shift,weekDay,valid,adopt,normalise,summary,reconcile,configure,pause,resume,equip,paused,covered,verifiedDays,missedDays,scheduleAt,DECORS,SCENES,LOOKS};
});
