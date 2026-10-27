(function(){
 'use strict';
 const P=window.NaiwaPetCore,E=window.NaiwaPetEvidence,C=window.NaiwaPetCatalog;
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const labels=['一','二','三','四','五','六','日'];
 const art=Object.fromEntries(C.items.map(x=>[x.id,x.src]));
 const icon={book:'<path d="M3 5c4-1 6 0 9 2 3-2 5-3 9-2v14c-4-1-6 0-9 2-3-2-5-3-9-2zM12 7v14"/>',desk:'<path d="M2 8h20M5 8v13M19 8v13M6 3h8v5M6 4h8"/>',lamp:'<path d="m8 3-5 8h14l-4-8zM10 11v9M5 21h12"/>',hat:'<path d="m2 8 10-5 10 5-10 5zM6 11v6c4 3 8 3 12 0v-6M22 8v9"/>'};
 const svg=id=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(icon[id]||icon.book)+'</svg>';
 const image=(id,cls='')=>'<img class="'+cls+'" src="'+art[id]+'" data-pet-image="'+id+'" alt="奶蛙 · '+esc(C.get(id)?.name||'陪着你')+'" width="200" height="220" decoding="async">';
 function create(adapter){
  let busy=false,quoteIndex=0,savingIssue=false,queuedObserve=false,queuedFresh=false;
  const visitLook=Math.floor(Math.random()*5);
  const state=()=>adapter.getState(),id=()=>String(state().activeAccountId||'default');
  function pet(){const all=state().preferences.naiwaPets;return all&&Object.hasOwn(all,id())?all[id()]:null;}
  function put(value){state().preferences.naiwaPets={...(state().preferences.naiwaPets||{}),[id()]:value};}
  const info=()=>P.summary(pet(),Date.now(),state().libraryConnected);
  const moodImage=s=>{if(s.stageIndex>=4||s.stageIndex===1)return'sleep';if(s.stageIndex>=2)return'lonely';if(s.attendedToday)return'laugh';const look=P.LOOKS.find(x=>x.id===pet()?.look&&x.days<=s.rewardDays);return look&&look.id!=='auto'?look.id:['neutral','echo','laugh','stern','flower'][visitLook];};
  function line(s,p){if(s.clockChanged)return'时间有点不对，等同步好再结算。';if(s.paused)return'休息也算生活的一部分，我陪你放松。';if(s.attendedToday)return'今天一起来图书馆了，奶蛙又有劲儿了！';if(s.waiting)return'等记录同步好，奶蛙先不挨饿。';return['奶蛙就位，今天坐哪？','歇一下，下个学习日继续。','你不在，书都快长蘑菇了。','下次去图书馆，也带上我呗。',p.theatrical?'蛙蛙已掉线，等你开机。':'先睡一觉，等你带我去图书馆。'][s.stageIndex];}
  function home(){
   const p=pet(),s=info();if(p&&!s)return '<section class="card"><h2>奶蛙数据需要新版应用</h2><p class="muted small">数据已保留，先不要清除。</p></section>';
   if(!p)return'<section class="pet-home"><div><span class="pet-eyebrow">NAIWA · 陪学宠物</span><h2>领养你的学习搭子</h2><p>去图书馆一起成长，偶尔休息也没关系。</p><button type="button" class="btn filled sm" data-pet-action="open">带奶蛙回家</button></div><button type="button" class="pet-home-art" data-pet-action="open" aria-label="领养奶蛙">'+image('neutral')+'</button></section>';
   const note=s.attendedToday?'今日入馆已确认':s.paused?'学习约定已暂停':s.waiting?'等待学校记录同步':s.learningDay?'今天是约定学习日':'今天可以歇口气';
   return'<section class="pet-home"><div><span class="pet-eyebrow">'+esc(p.name)+' · LV '+s.level+' <span class="pet-state">'+esc(s.stage)+'</span></span><h2>'+esc(line(s,p))+'</h2><p>'+note+' · 累计 '+s.rewardDays+' 个入馆日</p><div class="actions"><button type="button" class="btn tonal sm" data-pet-action="open">奶蛙小屋</button><button type="button" class="btn text sm" data-pet-action="find">去找座位 ↗</button></div></div><button type="button" class="pet-home-art" data-pet-action="open" aria-label="进入奶蛙小屋">'+image(moodImage(s))+'</button></section>';
  }
  function daysField(days){return'<div class="pet-week" role="group" aria-label="约定学习日">'+labels.map((label,i)=>'<label><input type="checkbox" name="petDay" value="'+(i+1)+'"'+(days.includes(i+1)?' checked':'')+'><span>周'+label+'</span></label>').join('')+'</div>';}
  function adoptView(){return'<div class="pet-intro-title"><span class="pet-eyebrow">一个可以慢慢养的学习搭子</span><h2>把奶蛙带回家</h2></div><div class="pet-adopt-art">'+image('neutral')+'</div><form id="petAdoptForm"><label class="field"><span>给它取个名字</span><input id="petName" name="petName" value="奶蛙" maxlength="12" autocomplete="off" required></label><fieldset class="seg-group"><legend>每周想去哪几天？</legend>'+daysField([1,3,5])+'</fieldset><p class="muted small">只有错过已结束的约定学习日，奶蛙才会慢慢犯困。休息日不扣状态；假期可以暂停。今天领养，从今天开始。</p><div class="dialog-actions"><button class="btn filled" type="submit">领养奶蛙</button></div></form>';}
  function room(){
   const p=pet(),s=info();if(!p)return adoptView();if(!s)return'<h2>数据已保留</h2><p>这份宠物数据由更新的应用创建，请使用新版打开。</p>';
   const scene=P.SCENES.find(x=>x.id===p.scene&&x.days<=s.rewardDays)?.id||'cream',decor=P.DECORS.find(x=>x.id===p.decor&&x.days<=s.rewardDays)?.id||'none';
   const stage='<section class="pet-stage pet-scene-'+scene+(scene!=='cream'?' has-photo':'')+'"><span class="pet-stage-label">'+esc(s.stage)+'</span>'+image(moodImage(s),'pet-main-figure')+(decor!=='none'?'<span class="pet-decor pet-decor-'+decor+'">'+svg(decor)+'</span>':'')+'</section>';
   const cards=(list,type)=>'<div class="pet-collection">'+list.map(item=>{const locked=s.rewardDays<item.days,on=p[type]===item.id||item.id==='none'&&!p.decor;return'<button type="button" class="pet-item'+(on?' selected':'')+'" data-pet-action="equip" data-pet-type="'+type+'" data-pet-id="'+item.id+'"'+(locked?' disabled':'')+' aria-pressed="'+on+'">'+(type==='scene'&&item.id!=='cream'?'<img src="assets/pet/'+item.id+'.webp" alt="" width="90" height="70" loading="lazy">':type==='decor'&&item.id!=='none'?svg(item.id):'<span class="pet-item-circle" aria-hidden="true"></span>')+'<b>'+item.name+'</b><small>'+ (locked?'累计入馆 '+item.days+' 天':on?'正在使用':'已解锁')+'</small></button>';}).join('')+'</div>';
   return'<div class="pet-room-heading"><div><span class="pet-eyebrow">NAIWA · 学习搭子</span><h2>'+esc(p.name)+'的小屋</h2></div><button type="button" class="btn text sm" data-pet-action="config">学习约定</button></div>'+stage+'<p class="pet-quote" data-pet-quote role="status" aria-live="polite">'+esc(line(s,p))+'</p>'
    +(savingIssue?'<p class="pet-sync-note" role="alert">刚才没保存成功，请点“同步入馆记录”重试后再退出。</p>':'')
    +'<div class="pet-metrics"><span><b>'+s.rewardDays+'</b>累计入馆日</span><span><b>'+s.xp+'</b>成长经验</span><span><b>LV '+s.level+'</b>奶蛙等级</span></div><div class="pet-level-track" role="progressbar" aria-label="下一等级进度" aria-valuenow="'+(s.rewardDays%5)+'" aria-valuemin="0" aria-valuemax="5"><span class="pet-level-'+s.rewardDays%5+'"></span></div><p class="muted small pet-progress-copy">再入馆 '+(5-s.rewardDays%5)+' 天升到下一级；每日首次核验入馆 +10 经验。</p>'
    +'<div class="pet-room-actions"><button type="button" class="btn filled" data-pet-action="find">带奶蛙去学习</button><button type="button" class="btn tonal" data-pet-action="stroke">'+(s.attendedToday?'喂份小点心':'摸摸肚皮')+'</button></div>'
    +'<p class="pet-sync-note">'+(s.attendedToday?'今天的入馆已核验，别忘了好好休息。':s.waiting?'学校记录待同步，精神状态暂时保留。':'已核对学校记录；还没入馆的话，今天仍来得及。')+'</p><button type="button" class="btn text sm" data-pet-action="refresh">同步入馆记录</button>'
    +'<div class="pet-play-actions" role="group" aria-label="和奶蛙互动"><button type="button" class="btn tonal sm" data-pet-action="cheer">给我打气</button><button type="button" class="btn tonal sm" data-pet-action="flower">送朵小花</button><button type="button" class="btn tonal sm" data-pet-action="echo">回响模式</button><button type="button" class="btn text sm" data-pet-action="resetArt">恢复状态形象</button></div>'
    +'<button type="button" class="pet-album-entry" data-pet-action="album"><span><b>奶蛙图鉴 · '+C.items.length+' 个模样</b><small>表情、装扮和风景，点开慢慢看</small></span><span aria-hidden="true">↗</span></button>'
    +'<div class="section-head"><h3>精神满满时的模样</h3><span class="muted small">不改变入馆状态</span></div>'+lookCards(s,p)
    +'<div class="section-head"><h3>小屋装饰</h3><span class="muted small">累计入馆解锁，不要求连续</span></div>'+cards(P.DECORS,'decor')+'<div class="section-head"><h3>奶蛙的风景</h3><span class="muted small">你带它走过的日常</span></div>'+cards(P.SCENES,'scene')
    +'<p class="muted small pet-footnote">奖励认学校明确的签到、完成等入馆状态；预约成功和打开入馆码不计入馆。学校记录不是实际专注时长。'+(s.misses?'目前错过 '+s.misses+' 个已核实的约定学习日。':'')+'</p>';
  }
  function lookCards(s,p){return'<div class="pet-collection">'+P.LOOKS.map(x=>'<button type="button" class="pet-item pet-look-item'+((p.look||'auto')===x.id?' selected':'')+'" data-pet-action="equip" data-pet-type="look" data-pet-id="'+x.id+'" aria-pressed="'+((p.look||'auto')===x.id)+'"'+(x.days>s.rewardDays?' disabled':'')+'>'+image(x.id==='auto'?'echo':x.id)+'<b>'+x.name+'</b><small>'+(x.days>s.rewardDays?'累计入馆 '+x.days+' 天':(p.look||'auto')===x.id?'正在使用':'已解锁')+'</small></button>').join('')+'</div>';}
  function album(){const s=info();adapter.showDialog('<div class="pet-room-heading"><div><span class="pet-eyebrow">NAIWA · '+C.items.length+' 个模样</span><h2>奶蛙图鉴</h2></div><button type="button" class="btn text sm" data-pet-action="open">返回小屋</button></div><p class="muted small">每张都能放大欣赏；入馆积累后解锁更多装扮和风景。</p><div class="pet-album-grid">'+C.items.map(x=>'<button type="button" class="pet-album-card '+(x.kind==='look'||x.kind==='mood'?'is-cutout':'')+'" data-pet-action="photo" data-pet-id="'+x.id+'"><img src="'+x.src+'" alt="'+x.name+'" data-pet-image="'+x.id+'" loading="lazy" decoding="async" width="140" height="140"><b>'+x.name+'</b><small>'+(x.days>s.rewardDays?'入馆 '+x.days+' 天可解锁':x.kind==='look'?'形象 · 已解锁':x.kind==='scene'?'风景 · 已解锁':x.kind==='mood'?'心情形象':'收藏画片')+'</small></button>').join('')+'</div>','pet-album');}
  function photo(key){const x=C.get(key);if(!x)return;const s=info(),usable=['look','scene'].includes(x.kind),locked=x.days>s.rewardDays;
   adapter.showDialog('<div class="pet-room-heading"><h2>'+x.name+'</h2><button type="button" class="btn text sm" data-pet-action="album">返回图鉴</button></div><div class="pet-photo '+(['look','mood'].includes(x.kind)?'is-cutout':'')+'">'+image(x.id)+'</div><p class="pet-quote">'+x.caption+'</p><div class="dialog-actions">'+(usable?'<button type="button" class="btn filled" data-pet-action="equip" data-pet-type="'+x.kind+'" data-pet-id="'+x.id+'"'+(locked?' disabled':'')+'>'+(locked?'累计入馆 '+x.days+' 天解锁':'用在我的小屋')+'</button>':'<button type="button" class="btn tonal" data-pet-action="open">回小屋陪奶蛙</button>')+'</div>','pet-photo');
  }
  function react(key,text){const figure=document.querySelector('#dialog[open] .pet-stage .pet-main-figure'),quote=document.querySelector('#dialog[open] [data-pet-quote]');if(!figure||!quote)return;figure.src=art[key];figure.dataset.petImage=key;delete figure.dataset.petRetried;figure.alt='奶蛙 · '+C.get(key).name;figure.hidden=false;figure.classList.remove('pet-bounce');void figure.offsetWidth;figure.classList.add('pet-bounce');quote.textContent=text;adapter.haptic('tick');}
  function configView(){const p=pet(),s=info();return'<h2>和'+esc(p.name)+'的学习约定</h2><form id="petConfigForm"><label class="field"><span>名字</span><input id="petName" name="petName" value="'+esc(p.name)+'" maxlength="12" autocomplete="off" required></label><fieldset class="seg-group"><legend>约定学习日</legend>'+daysField(P.scheduleAt(p,P.shift(P.today(),1)))+'</fieldset><p class="muted small">修改学习日从明天生效；过去的入馆和成长不清零。</p><label class="switch-row"><span><b>戏精模式</b><span class="muted small">冬眠时显示“蛙蛙已掉线”，仍可唤醒</span></span><input type="checkbox" class="switch" name="petTheatrical"'+(p.theatrical?' checked':'')+'></label><div class="dialog-actions"><button type="button" class="btn text" data-pet-action="open">返回小屋</button><button type="submit" class="btn filled">保存约定</button></div></form><hr><div class="pet-pause-actions">'+(s.paused?'<p class="muted small">已暂停，不累计缺席。</p><button type="button" class="btn tonal" data-pet-action="resume">恢复学习约定</button>':'<p class="muted small">放假、生病或主要在别处学习时，可以让奶蛙休息。</p><button type="button" class="btn tonal" data-pet-action="pause7">休息 7 天</button><button type="button" class="btn text" data-pet-action="pauseLong">暂停到手动恢复</button>')+'</div>';}
  function open(){adapter.showDialog(room(),'pet');}
  function repaint(){adapter.render();if(document.querySelector('#dialog')?.open&&document.querySelector('#dialog').dataset.kind==='pet')open();}
  function observe(historyFresh=false){
   if(busy){queuedObserve=true;queuedFresh=queuedFresh||historyFresh;return;}
   const p=pet();if(!p||!P.normalise(p))return;
   const st=state(),evidence=E.collect(st.records,st.current,Date.now(),historyFresh),result=P.reconcile(p,evidence);
   if(!result.changed)return;
   put(result.pet);
   adapter.save().then(()=>{savingIssue=false;}).catch(()=>{savingIssue=true;adapter.toast('奶蛙状态暂未保存，请稍后重试');});
   if(result.newRewards.length&&result.newRewards.includes(P.today())){adapter.toast('今日入馆已确认，'+result.pet.name+'恢复精神 · +10 经验');}
  }
  async function change(next,after=open){
   if(busy)return false;busy=true;let committed=false;const previous=pet();put(next);document.querySelectorAll('[data-pet-action],#petAdoptForm button,#petConfigForm button').forEach(x=>{if(!x.disabled){x.dataset.petWorking='1';x.disabled=true;}});
   try{await adapter.save();committed=true;savingIssue=false;adapter.haptic('confirm');adapter.render();after();return true;}
   catch(e){put(previous);adapter.render();adapter.toast('保存失败，刚才的修改没有生效');return false;}
   finally{busy=false;document.querySelectorAll('[data-pet-working="1"]').forEach(x=>{x.disabled=false;delete x.dataset.petWorking;});if(queuedObserve){const fresh=queuedFresh;queuedObserve=false;queuedFresh=false;observe(fresh);adapter.render();if(committed&&document.querySelector('#dialog')?.dataset.kind==='pet')open();}}
  }
  document.addEventListener('click',async event=>{
   const el=event.target.closest?.('[data-pet-action]');if(!el||el.disabled)return;
   event.preventDefault();const action=el.dataset.petAction;
   try{
    if(action==='open'){adapter.haptic('tick');open();}
    else if(action==='config')adapter.showDialog(configView(),'pet-config');
    else if(action==='find'){adapter.closeDialog();adapter.go('library');}
    else if(action==='refresh'){await adapter.refresh();savingIssue=false;repaint();}
    else if(action==='album')album();
    else if(action==='photo')photo(el.dataset.petId);
    else if(action==='resetArt')react(moodImage(info()),line(info(),pet()));
    else if(action==='flower')react('flower',['花给你，今天也对自己温柔一点。','不管今天学了多少，努力的你值得一朵小花。','这朵花送给愿意重新开始的你。'][quoteIndex++%3]);
    else if(action==='echo')react('echo',['慢慢来，慢慢来——奶蛙收到。','今天先学一点，先学一点。回响模式已开启。','累了就歇会儿，歇会儿。奶蛙陪着。'][quoteIndex++%3]);
    else if(action==='cheer'){const n=quoteIndex++%3;react(n===2&&info().rewardDays>=3?'hoodie':n===1?'laugh':'stern',['指指点点：先做最小的一件，十分钟也算开头。','书可以一点点读，笑也可以大声一点。','今天低调认真，未来的你会记得这一点努力。'][n]);}
    else if(action==='stroke'){
     const s=info(),p=pet(),quotes=s.attendedToday?['点心收下，学习的快乐也收下。','今天有认真来图书馆，给你比个小拇指。','书读一点，肚皮摸一下。']:['奶蛙在这儿，咱们慢慢来。','摸摸肚皮，也给自己一点耐心。','下次去图书馆，也带我一起。'];
     const n=quoteIndex++%quotes.length;react(['laugh','neutral','echo'][n],quotes[n]);
    }else if(action==='equip')await change(P.equip(pet(),el.dataset.petType,el.dataset.petId));
    else if(action==='pause7'||action==='pauseLong')await change(P.pause(pet(),P.today(),action==='pause7'?7:0));
    else if(action==='resume')await change(P.resume(pet(),P.today()));
   }catch(e){adapter.toast(e.message||'刚才的操作没完成');}
  });
  document.addEventListener('submit',async event=>{
   const form=event.target;if(!['petAdoptForm','petConfigForm'].includes(form.id))return;event.preventDefault();
   try{const days=[...form.querySelectorAll('[name="petDay"]:checked')].map(x=>Number(x.value)),name=form.querySelector('[name="petName"]').value;
    if(form.id==='petAdoptForm'){const adopted=await change(P.adopt(P.today(),name,days));if(adopted&&state().recordsLoaded){observe(!!state().libraryConnected&&Date.now()-Number(state().petRecordsAt||0)<300000);repaint();}}
    else await change(P.configure(pet(),{name,days,theatrical:form.querySelector('[name="petTheatrical"]').checked},P.today()));
   }catch(e){adapter.toast(e.message||'保存没有完成');}
  });
  document.addEventListener('error',event=>{const img=event.target;if(!img?.matches?.('[data-pet-image]'))return;if(!img.dataset.petRetried){img.dataset.petRetried='1';img.src=window.NaiwaAssets?.neutral||art.neutral;}else img.hidden=true;},true);
  return{home,open,observe,hasPet:()=>!!pet(),entry:()=>'<button type="button" class="btn tonal" data-pet-action="open">奶蛙小屋 ↗</button>'};
 }
 window.NaiwaPetUI={create};
})();
