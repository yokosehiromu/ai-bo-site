/* ══════════════════════════════════════════════════════════════
   イメージイラストの動き（2026-10-10 追加）／ motion.css と対になる

   ⚠ 元に戻したいとき は motion.css の冒頭を参照。
      HTMLから2行消すだけで完全に元どおり。

   やっていること
   1. <html> に data-motion="on" を付ける（motion.css はこれが無いと一切効かない）
   2. IntersectionObserver で、画面に入ったイラストに .in を付ける

   ★ 1 を「同期的に」やっているのが重要。
     defer や DOMContentLoaded 待ちにすると、
     「画像が見えている → 急に消える → 浮き上がる」というチラつきが出る。
     そのため <head> で素直に読み込むこと（ファイルは1KB未満）。
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // 「視差効果を減らす」設定の方、古いブラウザには何もしない。
  // data-motion が付かない＝motion.css が効かない＝画像は最初から見える。
  try {
    if (window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  } catch (e) { return; }
  if (!('IntersectionObserver' in window)) return;

  var doc = document;
  doc.documentElement.setAttribute('data-motion', 'on');

  // 対象はイラストだけ。ヒーローのコラージュ（.collage）は含めない。
  var TARGETS = '.fig, .pt .shot';

  function start() {
    var nodes = doc.querySelectorAll(TARGETS);
    if (!nodes.length) return;

    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('in');
          io.unobserve(entries[i].target);   // 一度出したら終わり。往復させない
        }
      }
    }, {
      rootMargin: '0px 0px -10% 0px',  // 少し手前で出す
      threshold: 0.12
    });

    for (var j = 0; j < nodes.length; j++) io.observe(nodes[j]);

    // 保険：何かの理由で発火しなかったときのために、5秒後に全部出す
    setTimeout(function () {
      var rest = doc.querySelectorAll(TARGETS);
      for (var k = 0; k < rest.length; k++) rest[k].classList.add('in');
    }, 5000);
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
