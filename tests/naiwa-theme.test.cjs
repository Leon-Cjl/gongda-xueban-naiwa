const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const theme = require('../app/naiwa-theme.js');

test('theme pages leave the code page and active seat grid clear', () => {
 assert.equal(theme.intro('pass', false), '');
 assert.equal(theme.intro('library', true), '');
 assert.equal(theme.intro('rooms', true), '');
 assert.match(theme.intro('library', false), /data-naiwa-poke/);
});
test('theme has no school commands, external resources or account access', () => {
 const src = fs.readFileSync(path.join(__dirname, '../app/naiwa-theme.js'), 'utf8');
 assert.doesNotMatch(src, /NativeHost|postMessage|fetch\s*\(|XMLHttpRequest|https?:\/\//);
 assert.doesNotMatch(src, /reserve|temporaryLeave|cancelBooking|password|cookie/);
});
test('both theme assets are packaged PNGs and identical to offline fallbacks', () => {
 const vm = require('node:vm'), context = {window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../app/naiwa-assets.js'), 'utf8'), context);
 for (const name of ['neutral', 'laugh']) {
  const bytes = fs.readFileSync(path.join(__dirname, '../app/assets/naiwa', name+'.png'));
  assert.equal(bytes.subarray(1,4).toString(), 'PNG');
  assert.equal(Buffer.compare(bytes, Buffer.from(context.window.NaiwaAssets[name].split(',')[1], 'base64')), 0);
 }
});
test('theme text, primary controls and seat text meet contrast of 4.5', () => {
 const lum = hex => {const rgb = hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
 const ratio = (a,b) => (Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 for (const palette of Object.values(theme.palettes)) for (const [a,b] of [['text','bg'],['muted','bg'],['primary','on-primary'],['seat','on-seat']]) assert.ok(ratio(palette[a],palette[b])>=4.5, a+' on '+b);
});
