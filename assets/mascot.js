/* ══════════════════════════════════════════════════════════════
   ついてくる ai-bo（2026-10-21 追加・試作）

   ⚠ 元に戻したいとき は、各ページの <head> からこの1行を消すだけ。
      HTMLには何も書いていない（この中で組み立てている）ので、
      消せば跡形もなく消える。

   やっていること
   - ヒーローを過ぎたあたりで、右下にふわっと出てくる
   - ゆっくり上下に揺れる（歩いている感じ）
   - スクロールの向きに合わせて、少しだけ身体を傾ける
   - 押すと「相談する」へ移動
   - × で閉じられる。閉じたことはそのタブのあいだだけ覚える

   やらないこと
   - 「視差効果を減らす」設定の方には揺らさない（出しはする）
   - 画面の高さが足りないとき（横向きのスマホ等）は出さない
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (sessionStorage.getItem('aibo-mascot-off') === '1') return;

  var SHOW_AFTER = 420;          // これだけ縦に進んだら出す
  var reduce = false;
  try {
    reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* 古いブラウザは揺らす側で問題ない */ }

  // 行き先。#contact が無いページ（理念・公式LINEデモ）は、締めの導線に id を付けて送る
  var closing = document.querySelector('.closing');
  if (!document.getElementById('contact') && closing) closing.id = 'contact';
  var target = document.getElementById('contact') ? '#contact' : 'index.html#contact';

  var wrap = document.createElement('div');
  wrap.className = 'mascot';
  wrap.innerHTML =
    '<a class="mascot-go" href="' + target + '" aria-label="ai-boに相談する">' +
      '<img src="images/mascot.webp" width="206" height="360" alt="" loading="lazy" decoding="async">' +
    '</a>' +
    '<button class="mascot-close" type="button" aria-label="ai-boを隠す">✕</button>';
  document.body.appendChild(wrap);

  if (reduce) wrap.classList.add('still');

  var last = window.pageYOffset;
  var ticking = false;

  function update() {
    var y = window.pageYOffset;
    wrap.classList.toggle('in', y > SHOW_AFTER && window.innerHeight > 480);
    // 進む向きにすこし傾ける。止まればまっすぐ戻る
    if (!reduce) {
      var d = y - last;
      wrap.style.setProperty('--tilt', (d > 2 ? 5 : d < -2 ? -5 : 0) + 'deg');
    }
    last = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });

  window.addEventListener('resize', update, { passive: true });

  wrap.querySelector('.mascot-close').addEventListener('click', function () {
    wrap.classList.remove('in');
    sessionStorage.setItem('aibo-mascot-off', '1');
    setTimeout(function () { wrap.remove(); }, 400);
  });

  update();
})();
