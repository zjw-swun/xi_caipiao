/**
 * 整票单 Canvas 刮开覆盖膜组件（多格共享一张画布）
 * 膜按每格画成纯圆（圆外透明），但同在一张画布上，可一笔连续划过多格，
 * 圆与圆之间的间隙（cell 四角、cell 间 gap）落在同一张连续画布上，也能刮到相邻圆。
 */
(function (global) {
  'use strict';

  function ScratchCard(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    var dpr = Math.min(global.devicePixelRatio || 1, 3);
    var w = 0, h = 0;
    var last = null;
    var drawing = false;
    var counter = 0;
    var lineW = 12;
    var scratched = false;
    var cells = (opts.cells || []).map(function (c) {
      return { node: c.node, onReveal: c.onReveal, cx: 0, cy: 0, rad: 0, revealed: false };
    });

    this.canvas = canvas;

    function computeCells() {
      var crect = canvas.getBoundingClientRect();
      cells.forEach(function (c) {
        var circle = c.node.querySelector ? c.node.querySelector('.cell-circle') : null;
        var r = (circle || c.node).getBoundingClientRect();
        c.cx = r.left - crect.left + r.width / 2;
        c.cy = r.top - crect.top + r.height / 2;
        c.rad = Math.max(0, Math.min(r.width, r.height) / 2 * 1.0);
      });
    }

    function paintCell(c) {
      if (c.revealed) return;
      var cx = c.cx, cy = c.cy, rad = c.rad;
      if (!isFinite(cx) || !isFinite(cy) || !isFinite(rad) || rad <= 0.5) return;

      // 红色圆形覆盖膜（圆外保持透明 → 外观纯圆）
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.clip();
      var g = ctx.createRadialGradient(cx, cy - rad * 0.12, rad * 0.1, cx, cy, rad * 1.05);
      g.addColorStop(0, '#e64a33');
      g.addColorStop(0.65, '#c8202f');
      g.addColorStop(1, '#9d1020');
      ctx.fillStyle = g;
      ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
      ctx.restore();

      // 金色圆边
      ctx.strokeStyle = 'rgba(248,220,150,0.95)';
      ctx.lineWidth = Math.max(1.5, rad * 0.06);
      ctx.beginPath();
      ctx.arc(cx, cy, rad - ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.stroke();

      // 中央纹样：好运区画灯笼，其余画「喜」
      var isBonus = !!(c.node && c.node.classList && c.node.classList.contains('is-bonus'));
      ctx.fillStyle = 'rgba(248,220,150,0.95)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (isBonus) {
        paintLantern(cx, cy, rad);
      } else {
        ctx.font = 'bold ' + Math.round(rad * 0.95) + 'px "STKaiti","KaiTi","SimSun",serif';
        ctx.fillText('喜', cx, cy);
      }
    }

    function paintLantern(cx, cy, rad) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = 'rgba(248,220,150,0.95)';
      ctx.fillStyle = 'rgba(248,220,150,0.95)';
      ctx.lineWidth = Math.max(1, rad * 0.05);
      var bw = rad * 0.52, bh = rad * 0.66;
      // 顶绳
      ctx.beginPath();
      ctx.moveTo(0, -bh - rad * 0.2);
      ctx.lineTo(0, -bh);
      ctx.stroke();
      // 顶盖 / 底盖
      ctx.fillRect(-bw * 0.5, -bh - rad * 0.1, bw, rad * 0.1);
      ctx.fillRect(-bw * 0.5, bh, bw, rad * 0.1);
      // 灯笼腹
      ctx.beginPath();
      ctx.ellipse(0, 0, bw, bh, 0, 0, Math.PI * 2);
      ctx.stroke();
      // 竖向骨架
      ctx.beginPath();
      ctx.ellipse(0, 0, bw * 0.5, bh, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, bw * 0.18, bh, 0, 0, Math.PI * 2);
      ctx.stroke();
      // 底穗
      ctx.beginPath();
      ctx.moveTo(0, bh + rad * 0.1);
      ctx.lineTo(0, bh + rad * 0.36);
      ctx.moveTo(-bw * 0.18, bh + rad * 0.36);
      ctx.lineTo(-bw * 0.1, bh + rad * 0.2);
      ctx.moveTo(0, bh + rad * 0.36);
      ctx.lineTo(0, bh + rad * 0.2);
      ctx.moveTo(bw * 0.18, bh + rad * 0.36);
      ctx.lineTo(bw * 0.1, bh + rad * 0.2);
      ctx.stroke();
      ctx.restore();
    }

    function paint() {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);
      cells.forEach(paintCell);
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      computeCells();
      var sum = 0;
      cells.forEach(function (c) { sum += c.rad; });
      var avgRad = cells.length ? sum / cells.length : Math.min(w, h) / 2;
      lineW = Math.max(11, avgRad * 0.58);
      paint();
    }

    function pointAt(e) {
      var rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function scratchTo(p) {
      scratched = true;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      if (last) {
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(p.x, p.y);
      } else {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 0.01, p.y);
      }
      ctx.stroke();
      last = p;
    }

    function allRevealed() {
      for (var i = 0; i < cells.length; i++) if (!cells[i].revealed) return false;
      return true;
    }

    function checkProgress() {
      if (allRevealed()) return;
      var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      var W = canvas.width, H = canvas.height;
      cells.forEach(function (c, i) {
        if (c.revealed) return;
        var cx = Math.round(c.cx * dpr), cy = Math.round(c.cy * dpr), rad = Math.round(c.rad * dpr);
        var x0 = Math.max(0, cx - rad), x1 = Math.min(W - 1, cx + rad);
        var y0 = Math.max(0, cy - rad), y1 = Math.min(H - 1, cy + rad);
        var cleared = 0, total = 0, step = 5;
        for (var y = y0; y <= y1; y += step) {
          for (var x = x0; x <= x1; x += step) {
            var dx = x - cx, dy = y - cy;
            if (dx * dx + dy * dy <= rad * rad) {
              total++;
              if (data[(y * W + x) * 4 + 3] < 40) cleared++;
            }
          }
        }
        if (total && cleared / total > 0.55) finishCell(i, true);
      });
    }

    function finishCell(i, byUser) {
      var c = cells[i];
      if (c.revealed) return;
      c.revealed = true;
      // 确保该圆区完全透明，露出底层中奖图符
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(c.cx - c.rad - 2, c.cy - c.rad - 2, (c.rad + 2) * 2, (c.rad + 2) * 2);
      ctx.restore();
      if (allRevealed()) canvas.style.pointerEvents = 'none';
      if (c.onReveal) c.onReveal(byUser);
    }

    function onDown(e) {
      if (allRevealed()) return;
      drawing = true;
      last = null;
      if (e.cancelable) e.preventDefault();
    }

    function onMove(e) {
      if (!drawing) return;
      if (e.cancelable) e.preventDefault();
      scratchTo(pointAt(e));
      if (++counter % 6 === 0) checkProgress();
    }

    function onUp() {
      if (!drawing) return;
      drawing = false;
      checkProgress();
      last = null;
    }

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onUp);

    resize();

    this.clearAll = function () {
      cells.forEach(function (c, i) { if (!c.revealed) finishCell(i, false); });
    };
    this.hasScratched = function () { return scratched; };
    this.resize = function () { resize(); };
  }

  global.ScratchCard = ScratchCard;
})(window);
