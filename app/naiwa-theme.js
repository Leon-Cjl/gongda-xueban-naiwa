/* 奶蛙外观层：不读取账号、预约或入馆码，不发起网络请求。 */
(function (root, factory) {
 const api = factory();
 if (typeof module === 'object' && module.exports) module.exports = api;
 else root.NaiwaTheme = api;
})(typeof window === 'object' ? window : globalThis, function () {
 'use strict';
 const light = {bg:'#fffaf0',surface:'#ffffff','surface-2':'#f6efdf','surface-3':'#e9dfc9',text:'#30291f',muted:'#756951',line:'#eee4cf',outline:'#d9c9ab',primary:'#795617','on-primary':'#ffffff','primary-soft':'#ffedab','on-primary-soft':'#604400',seat:'#fff0b9','on-seat':'#604400',bar:'#fffaf0'};
 const dark = {bg:'#17150f',surface:'#232018','surface-2':'#302c21','surface-3':'#443e2d',text:'#f6efdd',muted:'#bbb09a',line:'#393325',outline:'#665b42',primary:'#f5d373','on-primary':'#362800','primary-soft':'#463a15','on-primary-soft':'#f5d373',seat:'#463a15','on-seat':'#ffe6a0',bar:'#17150f'};
 const keys = Object.keys(light);
 const pages = {
  library: ['neutral', '奶蛙就位，今天坐哪？', '先找座位，再安心学习。'],
  rooms: ['neutral', '找间教室，安静待会儿', '查空闲，也能点进教室看当天安排。'],
  me: ['laugh', '学习这事儿，慢慢来', '记得及时签到，也记得歇口气。']
 };
 const greetings = ['好，今天也有劲儿了。', '不催你，咱们一点点来。', '先学一会儿，等下再歇。', '奶蛙在这儿，开工吧。'];
 let taps = 0;
 const normalize = value => value === 'classic' ? 'classic' : 'naiwa';
 function apply(preferences, isDark) {
  if (typeof document === 'undefined') return null;
  const doc = document.documentElement, enabled = normalize(preferences.mascotTheme) === 'naiwa';
  doc.dataset.mascotTheme = enabled ? 'naiwa' : 'classic';
  doc.dataset.naiwaDark = String(!!isDark);
  // 清除上一次外观变量，让经典主题及用户选色完整恢复。
  keys.forEach(key => doc.style.removeProperty('--' + key));
  if (!enabled) return null;
  const palette = isDark ? dark : light;
  keys.forEach(key => doc.style.setProperty('--' + key, palette[key]));
  return palette.primary;
 }
 function image(name, alt) {
  return '<img src="assets/naiwa/' + name + '.png" data-naiwa-image="' + name + '" alt="' + alt + '" width="160" height="160" decoding="async">';
 }
 function intro(page, compact) {
  const item = pages[page];
  if (!item || compact) return '';
  return '<section class="naiwa-intro" aria-label="奶蛙陪你"><div class="naiwa-copy"><span class="naiwa-kicker">NAIWA · 奶蛙陪学</span><h2 data-naiwa-line>' + item[1] + '</h2><p>' + item[2] + '</p><button type="button" class="naiwa-poke" data-naiwa-poke>戳戳奶蛙 <span aria-hidden="true">↗</span></button></div><button type="button" class="naiwa-figure" data-naiwa-poke aria-label="戳戳奶蛙，换句鼓励">' + image(item[0], item[0] === 'laugh' ? '奶蛙捧腹大笑' : '奶蛙呆呆地摸着肚皮') + '</button></section>';
 }
 function syncSettings() {
  if (typeof document === 'undefined') return;
  const enabled = document.documentElement.dataset.mascotTheme === 'naiwa';
  const colors = document.querySelector('[data-naiwa-accents]');
  if (colors) colors.disabled = enabled;
  const hint = document.querySelector('[data-naiwa-hint]');
  if (hint) hint.hidden = !enabled;
 }
 function install() {
  if (typeof document === 'undefined') return;
  document.addEventListener('error', event => {
   const img = event.target;
   if (!img?.matches?.('img[data-naiwa-image]')) return;
   const backup = window.NaiwaAssets?.[img.dataset.naiwaImage];
   if (!img.dataset.naiwaRetried && backup) {
    img.dataset.naiwaRetried = '1'; img.src = backup;
   } else {
    img.hidden = true;
    img.closest('.naiwa-figure')?.classList.add('naiwa-image-unavailable');
   }
  }, true);
  document.addEventListener('click', event => {
   const button = event.target.closest?.('[data-naiwa-poke]');
   if (!button) return;
   event.preventDefault();
   const panel = button.closest('.naiwa-intro');
   if (!panel) return;
   const line = panel.querySelector('[data-naiwa-line]');
   line.textContent = greetings[taps++ % greetings.length];
   line.setAttribute('aria-live', 'polite');
   const figure = panel.querySelector('.naiwa-figure');
   figure.innerHTML = image(taps % 2 ? 'laugh' : 'neutral', taps % 2 ? '奶蛙捧腹大笑' : '奶蛙呆呆地摸着肚皮');
   figure.classList.remove('naiwa-pop');
   void figure.offsetWidth;
   figure.classList.add('naiwa-pop');
  });
 }
 return {normalize, apply, intro, syncSettings, install, palettes: {light, dark}};
});
