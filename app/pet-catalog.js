/* Local artwork metadata only. No network, account data or reward writes. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NaiwaPetCatalog=api;})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const items=[
  {id:'neutral',name:'摸摸肚皮',src:'assets/naiwa/neutral.png',kind:'look',days:0,caption:'不急，先坐下来，再翻开第一页。'},
  {id:'laugh',name:'高兴模式',src:'assets/naiwa/laugh.png',kind:'look',days:0,caption:'快乐可以很小，比如今天又懂了一点。'},
  {id:'echo',name:'回响模式',src:'assets/pet/echo.webp',kind:'look',days:0,caption:'你说慢慢来，我说慢慢来——收到，收到。'},
  {id:'stern',name:'蛙蛙督学',src:'assets/pet/stern.webp',kind:'look',days:0,caption:'指指点点：先把最小的一件事做完。'},
  {id:'flower',name:'送你小花',src:'assets/pet/flower.webp',kind:'look',days:0,caption:'花给你，今天也对自己好一点。'},
  {id:'hoodie',name:'神秘学霸',src:'assets/pet/hoodie.webp',kind:'look',days:3,caption:'今天低调一点，认真一点。'},
  {id:'sleep',name:'打个小盹',src:'assets/pet/sleep.png',kind:'mood',days:0,caption:'睡好再出发，奶蛙不会把休息算成失败。'},
  {id:'lonely',name:'撑伞等你',src:'assets/pet/lonely.png',kind:'mood',days:0,caption:'有点想你，下次出门记得带上我。'},
  {id:'wallet',name:'知识存款',src:'assets/pet/wallet.webp',kind:'photo',days:0,caption:'今天存一点知识，慢慢也会很富有。'},
  {id:'muscle',name:'学力觉醒',src:'assets/pet/muscle.webp',kind:'photo',days:14,caption:'每次认真坐下，都在给自己攒一点力量。'},
  {id:'fist',name:'给你打气',src:'assets/pet/fist.webp',kind:'photo',days:3,caption:'别急着一下子做到最好，先往前挪一点。'},
  {id:'rain',name:'雨天陪伴',src:'assets/pet/rain.webp',kind:'scene',days:0,caption:'今天有雨也没关系，我陪你等天晴。'},
  {id:'clouds',name:'云海发呆',src:'assets/pet/clouds.webp',kind:'scene',days:3,caption:'看一会儿云，把心里的噪声放轻一点。'},
  {id:'music',name:'云上听歌',src:'assets/pet/music.webp',kind:'scene',days:7,caption:'耳机戴好，留一首歌的时间给自己。'},
  {id:'fog',name:'雾中发呆',src:'assets/pet/fog.webp',kind:'scene',days:7,caption:'看不清远处时，先走好眼前的一小步。'},
  {id:'sea',name:'海边休息',src:'assets/pet/sea.webp',kind:'scene',days:14,caption:'偶尔放空，明天再继续充电。'},
  {id:'bamboo',name:'竹影小屋',src:'assets/pet/bamboo.webp',kind:'scene',days:30,caption:'今天的安静，是给自己的一个小礼物。'}
 ];
 const get=id=>items.find(x=>x.id===id);
 return {items,get};
});
