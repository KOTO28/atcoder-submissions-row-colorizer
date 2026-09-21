// ==UserScript==
// @name        AtCoder Submissions Row Colorizer
// @description Colorizes AtCoder submission rows based on their judging status.
// @description:ja AtCoderの提出結果の行にジャッジのステータスに応じた色を付けます。
// @version     1.0.0
// @author      KOTO28
// @namespace   https://github.com/KOTO28
// @match       https://atcoder.jp/contests/*/submissions*
// @grant       GM_addStyle
// @homepageURL https://github.com/KOTO28/atcoder-submissions-row-colorizer/
// @downloadURL https://raw.githubusercontent.com/KOTO28/atcoder-submissions-row-colorizer/main/atcoder-submissions-row-colorizer.user.js
// ==/UserScript==

GM_addStyle(`
  .table > tbody > tr[data-tint] { --tint-alpha: 12%; }
  .table > tbody > tr[data-tint]:hover { --tint-alpha: 20%; }
  .table > tbody > tr[data-tint] > td {
    background-color: color-mix(in srgb, var(--row-tint) var(--tint-alpha), transparent);
  }
  `);

(function () {
  "use strict";

  const JUDGING_STATUSES = ["AC", "WA", "CE", "MLE", "TLE", "RE", "OLE", "IE"];

  console.info("AtCoder Error Row Colorizer loaded");

  function setTint(tr, color) {
    if (tr.dataset.tint === color) return;
    tr.dataset.tint = color;
    tr.style.setProperty("--row-tint", color);
  }

  function applyTint() {
    document.querySelectorAll(".table > tbody > tr").forEach((tr) => {
      const labels = tr.getElementsByClassName("label");
      if (labels.length === 0) {
        console.error("No label found in row", tr);
        return;
      } else if (labels.length > 1) {
        console.error("Multiple labels found in row", tr);
        return;
      } else {
        const label = labels[0];
        if (JUDGING_STATUSES.includes(label.textContent.trim())) {
          const labelColor = getComputedStyle(label).backgroundColor;
          setTint(tr, labelColor);
        }
      }
    });
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      applyTint();
    });
  }

  applyTint();
  schedule();
  window.addEventListener("load", schedule);

  new MutationObserver(schedule).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
})();
