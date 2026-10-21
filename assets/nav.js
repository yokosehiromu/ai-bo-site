/* ══════════════════════════════════════════════════════════════
   スマホのハンバーガーメニュー（2026-10-21 追加）

   ⚠ 元に戻したいとき は、各ページの <head> からこの1行を消し、
      ヘッダーの <button class="navtoggle"> を消すだけ。
      CSSは「@media (max-width:900px)」の中だけで効いているので、
      PCの見た目には一切影響しない。

   設計
   - 900px以下でだけ動く。それより広い画面では何もしない
   - JSが読まれなくても、メニューは「閉じた状態」で表示が壊れない
     （開けないだけ。PCでは元からボタンを出していない）
   - 閉じる操作は3つ: ボタンをもう一度／リンクを押す／Escキー
   - 画面を広げて900pxを超えたら自動で閉じる（開いたまま残らないように）
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var btn = document.querySelector('.navtoggle');
  var nav = document.getElementById('sitenav');
  if (!btn || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('open', open);
    btn.classList.toggle('on', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  }

  btn.addEventListener('click', function () {
    setOpen(!nav.classList.contains('open'));
  });

  // メニューの中のリンクを押したら閉じる（同じページ内の # 移動でも閉じる）
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  // 画面を広げたら閉じる。開いたまま残ると、PC表示で宙に浮いて見える
  var mq = window.matchMedia('(min-width:901px)');
  var onChange = function (e) { if (e.matches) setOpen(false); };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);   // 古いSafari向け
})();
