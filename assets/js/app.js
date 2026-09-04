(function () {
  'use strict';

  var XF = window.XIFENG;

  /* ---------------- 未中奖格图符（模拟实体票底纹图案） ---------------- */
  var ICONS = [
    {html:'<circle cx="16" cy="16" r="3.5"/><ellipse cx="16" cy="9" rx="3" ry="5"/><ellipse cx="16" cy="23" rx="3" ry="5"/><ellipse cx="9" cy="16" rx="5" ry="3"/><ellipse cx="23" cy="16" rx="5" ry="3"/>'},
    {html:'<path d="M8 18Q12 12 18 14Q22 15 24 12L22 18Q24 22 18 22Q12 22 8 18ZM20 12L18 9"/>'},
    {html:'<circle cx="16" cy="16" r="8"/><rect x="13" y="13" width="6" height="6"/>'},
    {html:'<circle cx="16" cy="16" r="5"/><path d="M16 6V9M16 23V26M6 16H9M23 16H26M9 9L11 11M21 21L23 23M9 23L11 21M21 11L23 9"/>'},
    {html:'<path d="M16 9C12 9 10 13 10 17C10 22 13 25 16 25C19 25 22 22 22 17C22 13 20 9 16 9ZM16 9Q16 6 14 6"/>'},
    {html:'<path d="M10 10H22V14Q22 20 16 22Q10 20 10 14ZM8 10H24M10 22H22M13 24H19"/>'},
    {html:'<ellipse cx="16" cy="16" rx="9" ry="6"/><path d="M9 14Q16 22 23 14"/>'},
    {html:'<path d="M12 10C8 10 7 14 7 16C7 18 8 22 12 22C14 22 16 18 16 16C16 18 18 22 20 22C24 22 25 18 25 16C25 14 24 10 20 10C18 10 16 14 16 16C16 14 14 10 12 10ZM16 12V20"/>'},
    {html:'<rect x="13" y="8" width="6" height="14" rx="1"/><path d="M16 6V8M14 22L12 25M18 22L20 25M16 22V25"/>'},
    {html:'<circle cx="16" cy="17" r="7"/><path d="M16 10V7M13 7H19"/>'},
    {html:'<path d="M8 18Q10 14 14 16Q16 12 20 14Q24 12 24 16Q24 20 20 20H10Q8 20 8 18Z"/>'},
    {html:'<path d="M8 20Q12 14 18 14L24 10L22 16Q24 22 16 22Q10 22 8 20ZM20 12L18 9"/>'},
    {html:'<circle cx="12" cy="14" r="3"/><circle cx="18" cy="14" r="3"/><circle cx="15" cy="19" r="3"/><circle cx="21" cy="19" r="3"/><circle cx="18" cy="24" r="3"/><path d="M15 11V7M15 11L18 8"/>'},
    {html:'<rect x="8" y="10" width="16" height="16" rx="1"/><path d="M10 10V6M22 10V6M8 14H24"/>'},
    {html:'<path d="M16 22C12 20 10 16 10 12C14 14 18 14 22 12C22 16 20 20 16 22ZM16 22V26"/>'},
    {html:'<path d="M10 12H22L20 22Q16 25 12 22ZM12 12V9H20V12"/><circle cx="16" cy="17" r="2.5"/>'},
    {html:'<path d="M10 8H22M10 12H22M13 8V16M19 8V16M10 16H22M12 16V24H14V20H18V24H20V16M10 24H22"/>'},
    {html:'<path d="M8 12H12L20 8V24L12 20H8Z"/><circle cx="20" cy="16" r="3"/>'},
    {html:'<path d="M8 16Q12 10 18 12Q22 13 22 16Q22 19 18 20Q12 22 8 16ZM22 14L26 10V22L22 18M14 14A1 1 0 1 0 14 18"/>'},
    {html:'<circle cx="16" cy="18" r="6"/><ellipse cx="16" cy="11" rx="5" ry="4"/><path d="M13 11L16 14L19 11"/>'},
    {html:'<circle cx="16" cy="17" r="7"/><path d="M12 14H20M12 18H20M16 14V22M10 11L12 14M22 11L20 14"/>'},
    {html:'<path d="M11 12H21L16 24ZM11 12L13 9H19L21 12M13 9L16 12L19 9"/>'},
    {html:'<path d="M10 12H22L20 22H12Z"/><path d="M10 12L12 22M22 12L20 22"/>'},
    {html:'<ellipse cx="16" cy="14" rx="7" ry="9"/><rect x="13" y="5" width="6" height="2"/><path d="M14 23V27M18 23V27M12 27H20"/>'},
    {html:'<rect x="8" y="8" width="16" height="20" rx="1"/><circle cx="16" cy="18" r="3"/><path d="M10 10L16 16L22 10"/>'},
    {html:'<circle cx="14" cy="22" r="3"/><path d="M17 22V8H25V18Q25 20 22 20Q19 20 19 18Q19 16 22 16Q24 16 24 18V10H17"/>'},
    {html:'<circle cx="16" cy="12" r="6"/><path d="M16 18V26M13 26H19"/><polygon points="14,18 18,18 16,22"/>'},
    {html:'<circle cx="16" cy="14" r="8"/><rect x="10" y="14" width="12" height="8" rx="1"/><path d="M8 14H24M10 22H22"/>'},
    {html:'<rect x="8" y="12" width="16" height="14" rx="1"/><path d="M8 18H24M16 12V26"/><rect x="13" y="8" width="6" height="4" rx="1"/>'},
    {html:'<path d="M8 12Q16 8 24 12L20 26H12Z"/><path d="M10 14Q16 24 22 14"/>'},
    {html:'<path d="M16 8V13M10 11L14 14M22 11L18 14M10 17L14 16M22 17L18 16M11 21L15 18M21 21L17 18"/><circle cx="16" cy="16" r="3"/>'}
  ];
  function randomIcon() { return ICONS[Math.floor(Math.random() * ICONS.length)]; }
  var BALANCE_KEY = 'xifeng.balance.v1';
  var STATS_KEY = 'xifeng.stats.v1';
  var GAME_KEY = 'xifeng.game.v1';

  var el = {
    picker: document.getElementById('picker'),
    ticket: document.getElementById('ticket'),
    btnBuy: document.getElementById('btnBuy'),
    btnReveal: document.getElementById('btnReveal'),
    btnNext: document.getElementById('btnNext'),
    btnTopUp: document.getElementById('btnTopUp'),
    btnRules: document.getElementById('btnRules'),
    btnReset: document.getElementById('btnReset'),
    hudBalance: document.getElementById('hudBalance'),
    hudWin: document.getElementById('hudWin'),
    hudBought: document.getElementById('hudBought'),
    hudRtp: document.getElementById('hudRtp'),
    tabPrize: document.getElementById('tabPrize'),
    tabSim: document.getElementById('tabSim'),
    tabMine: document.getElementById('tabMine'),
    btnSim: document.getElementById('btnSim'),
    simTimes: document.getElementById('simTimes'),
    simHit: document.getElementById('simHit'),
    simRtp: document.getElementById('simRtp'),
    simTable: document.getElementById('simTable'),
    myBought: document.getElementById('myBought'),
    myCost: document.getElementById('myCost'),
    myWin: document.getElementById('myWin'),
    myBest: document.getElementById('myBest'),
    btnClearStats: document.getElementById('btnClearStats'),
    modal: document.getElementById('modal'),
    modalCard: document.getElementById('modalCard')
  };

  var state = {
    game: XF.getGame(localStorage.getItem(GAME_KEY) || 'xf10'),
    ticket: null,
    cards: [],
    opened: 0,
    balance: 0,
    stats: { bought: 0, cost: 0, win: 0, best: 0, hits: 0 }
  };

  /* ---------------- 存储 ---------------- */

  function loadNum(key, def) {
    var v = parseFloat(localStorage.getItem(key));
    return isNaN(v) ? def : v;
  }

  function loadState() {
    state.balance = loadNum(BALANCE_KEY, 200);
    try {
      var s = JSON.parse(localStorage.getItem(STATS_KEY));
      if (s && typeof s === 'object') {
        state.stats.bought = s.bought || 0;
        state.stats.cost = s.cost || 0;
        state.stats.win = s.win || 0;
        state.stats.best = s.best || 0;
        state.stats.hits = s.hits || 0;
      }
    } catch (e) { /* ignore */ }
    if (!isFinite(state.balance) || state.balance < 0) state.balance = 200;
  }

  function saveState() {
    localStorage.setItem(BALANCE_KEY, String(state.balance));
    localStorage.setItem(STATS_KEY, JSON.stringify(state.stats));
  }

  /* ---------------- 弹窗 ---------------- */

  function openModal(html) {
    el.modalCard.innerHTML = html;
    el.modal.hidden = false;
  }

  function closeModal() {
    el.modal.hidden = true;
  }

  el.modal.addEventListener('click', function (e) {
    if (e.target === el.modal) closeModal();
  });

  el.modalCard.addEventListener('click', function (e) {
    var act = e.target.getAttribute && e.target.getAttribute('data-act');
    if (act === 'close') closeModal();
    if (act === 'again') { closeModal(); buy(); }
  });

  /* ---------------- 票种卡片 ---------------- */

  function renderPicker() {
    el.picker.innerHTML = '';
    XF.games.forEach(function (g) {
      var div = document.createElement('div');
      div.className = 'tcard' + (g.id === state.game.id ? ' is-active' : '');
      div.innerHTML =
        '<div class="tcard-flower">囍</div>' +
        '<div class="tcard-price">¥' + g.price + '</div>' +
        '<div class="tcard-sub">' + g.chances + ' 次中奖机会</div>' +
        '<div class="tcard-top">最高 ' + XF.money(g.prizes[0]) + ' 元</div>';
      div.addEventListener('click', function () {
        if (state.game.id === g.id) return;
        state.game = g;
        localStorage.setItem(GAME_KEY, g.id);
        renderPicker();
        renderPrizeTable();
        newTicket();
        updateHud();
      });
      el.picker.appendChild(div);
    });
  }

  /* ---------------- 票面渲染 ---------------- */

  function ticketNo(g) {
    function pad(n, len) {
      var s = String(n);
      while (s.length < len) s = '0' + s;
      return s;
    }
    return g.code + '-' +
      pad(Math.floor(Math.random() * 100000), 5) + '-' +
      pad(Math.floor(Math.random() * 1000000), 6) + '-' +
      pad(Math.floor(Math.random() * 1000), 3) + '-3';
  }

  function renderTicket() {
    var g = state.game;
    var t = state.ticket;

    var _pool = ICONS.slice();
    for (var _s = _pool.length - 1; _s > 0; _s--) { var _r = Math.floor(Math.random() * (_s + 1)); var _t = _pool[_s]; _pool[_s] = _pool[_r]; _pool[_r] = _t; }
    var _pi = 0;
    function nextIcon() { var ic = _pool[_pi % _pool.length]; _pi++; return ic; }

    var cellsHtml = t.cells.map(function (c, i) {
      var cls = 'cell' + (c.type === 'xi' ? ' is-xi' : c.type === 'shuang' ? ' is-shuang' : '');
      var sym = c.type === 'shuang' ? '囍' : c.type === 'xi' ? '喜' : '';
      var faceInner = sym
        ? '<span class="cell-sym">' + sym + '</span>' +
          '<span class="cell-amt-in">¥' + XF.money(c.amount) + '</span>' +
          '<span class="cell-pinyin-in">' + XF.numToPinyin(c.amount) + '</span>'
        : (function () {
            var ic = nextIcon();
            return '<svg class="cell-icon" viewBox="0 0 32 32">' + (ic.html || ('<path d="' + ic.path + '"/>')) + '</svg>';
          })() +
          '<span class="cell-amt-in">¥' + XF.money(c.print) + '</span>' +
          '<span class="cell-pinyin-in">' + XF.numToPinyin(c.print) + '</span>';
      return '<div class="' + cls + '" data-i="' + i + '">' +
        '<div class="cell-circle">' +
          '<div class="cell-face">' + faceInner + '</div>' +
        '</div>' +
        '<div class="cell-win">中 ¥' + XF.money(c.amount) + '</div>' +
      '</div>';
    }).join('');

    var html =
      '<div class="tk">' +
        '<div class="tk-top">' +
          '<div class="tk-logo">' +
            '<span class="tk-logo-mark">囍</span>' +
            '<span class="tk-logo-text">趣味刮刮乐</span>' +
            '<span class="tk-logo-sub">刮刮乐</span>' +
          '</div>' +
          '<div class="tk-face">面值 <b>' + g.price + '</b> 元</div>' +
        '</div>' +
        '<h2 class="tk-title">囍相逢</h2>' +
        '<div class="tk-banner"><span class="tk-banner-text">' + g.banner + '</span></div>' +
        '<div class="tk-jackpot">最高奖金<b>' + (g.prizes[0] >= 10000 ? (g.prizes[0] / 10000) + '万元' : g.prizes[0] + '元') + '</b></div>' +
        '<div class="tk-zonetip">▼ 玩法区</div>' +
        '<div class="tk-play">' +
          '<div class="tk-couplet">' + g.coupletL + '</div>' +
          '<div class="grid' + (g.cols >= 8 ? ' is-dense' : '') + '" style="grid-template-columns:repeat(' + g.cols + ',1fr)">' + cellsHtml + '<canvas class="ticket-cover"></canvas>' + '</div>' +
          '<div class="tk-couplet">' + g.coupletR + '</div>' +
        '</div>' +
        '<p class="tk-rule">刮开覆盖膜，如果刮出「<em>喜</em>」图符，即可获得该图符下方所对应的奖金；如果刮出「<em>囍</em>」图符，即可获得该图符下方所对应奖金的<em>两倍</em>。中奖奖金兼中兼得。(1-1)</p>' +
        '<div class="tk-chances">' + g.chances + '次中奖机会</div>' +
        '<div class="tk-banner is-footer"><span class="tk-banner-text">' + g.footerBanner + '</span></div>' +
        '<div class="tk-bottom">' +
          '<span class="tk-safe">保安区刮开无效</span>' +
          '<div class="barcode"></div>' +
          '<div class="tk-no">' + ticketNo(g) + '<br>本张中奖 <b id="ticketSum">¥0</b></div>' +
        '</div>' +
      '</div>';

    el.ticket.innerHTML = html;
    el.ticket.style.setProperty('--accent', g.accent);

    state.cards = [];
    state.opened = 0;
    var coverCanvas = el.ticket.querySelector('.ticket-cover');
    var cellsNodes = el.ticket.querySelectorAll('.cell');
    var cellsInfo = [];
    Array.prototype.forEach.call(cellsNodes, function (node, i) {
      cellsInfo.push({ node: node, onReveal: function () { onCellOpen(node, i); } });
    });
    state.cards = [new window.ScratchCard(coverCanvas, { cells: cellsInfo })];

    el.btnReveal.disabled = false;
  }

  function onCellOpen(node, i) {
    if (node.classList.contains('is-open')) return;
    node.classList.add('is-open');
    var cell = state.ticket.cells[i];
    if (cell.type !== 'none') {
      node.classList.add('is-hit');
      state.ticket._revealed = (state.ticket._revealed || 0) + cell.amount;
      var sum = el.ticket.querySelector('#ticketSum');
      if (sum) sum.textContent = '¥' + XF.money(state.ticket._revealed);
      el.hudWin.textContent = XF.money(state.ticket._revealed);
    }
    state.opened++;
    if (state.opened >= state.ticket.cells.length) finishTicket();
  }

  function finishTicket() {
    var t = state.ticket;
    el.btnReveal.disabled = true;

    if (t.win) {
      state.balance += t.total;
      state.stats.win += t.total;
      state.stats.hits += 1;
      if (t.total > state.stats.best) state.stats.best = t.total;
      saveState();
      updateHud();
      var big = t.total >= state.game.price * 100;
      openModal(
        '<div class="modal-badge">囍</div>' +
        '<h3 class="modal-title">恭喜中奖 · ' + XF.levelName(t.level) + '</h3>' +
        '<div class="modal-amount">¥ ' + XF.money(t.total) + '</div>' +
        '<p class="modal-desc">' +
          '票面 ' + state.ticket.cells.filter(function (c) { return c.type !== 'none'; }).length + ' 处中奖，奖金兼中兼得。<br>' +
          (big ? '奖金已存入体验金，可在网点（模拟）兑付。' : '奖金已存入体验金。') +
        '</p>' +
        '<div class="modal-actions">' +
          '<button class="plain-btn" data-act="close" type="button" style="color:#7d1a12;background:#ffe9b3;border-color:#e5c266">收下</button>' +
          '<button class="primary-btn" data-act="again" type="button">再来一张</button>' +
        '</div>'
      );
    } else {
      openModal(
        '<div class="modal-badge" style="color:#9a8b7a">喜</div>' +
        '<h3 class="modal-title">很遗憾，未中奖</h3>' +
        '<p class="modal-desc">本张未刮出「喜」或「囍」。<br>公益金 20% 已用于扶老、助残、救孤、济困（模拟示意）。</p>' +
        '<div class="modal-actions">' +
          '<button class="plain-btn" data-act="close" type="button" style="color:#7d1a12;background:#ffe9b3;border-color:#e5c266">知道了</button>' +
          '<button class="primary-btn" data-act="again" type="button">再来一张</button>' +
        '</div>'
      );
    }
  }

  /* ---------------- 买票 ---------------- */

  function newTicket() {
    dealAnimation();
    state.ticket = XF.drawTicket(state.game);
    state.ticket._revealed = 0;
    el.hudWin.textContent = '0';
    renderTicket();
  }

  function dealAnimation() {
    var deck = document.getElementById('deck');
    el.ticket.classList.remove('dealing');
    void el.ticket.offsetWidth;
    if (deck) {
      deck.classList.remove('shake');
      void deck.offsetWidth;
      deck.classList.add('shake');
    }
    el.ticket.classList.add('dealing');
  }

  function buy() {
    var g = state.game;
    if (state.balance < g.price) {
      openModal(
        '<div class="modal-badge" style="color:#9a8b7a">喜</div>' +
        '<h3 class="modal-title">体验金不足</h3>' +
        '<p class="modal-desc">本页不涉及任何真实资金，体验金仅供模拟玩法使用。</p>' +
        '<div class="modal-actions">' +
          '<button class="primary-btn" data-act="close" type="button">好的</button>' +
        '</div>'
      );
      return;
    }
    state.balance -= g.price;
    state.stats.bought += 1;
    state.stats.cost += g.price;
    saveState();
    updateHud();
    newTicket();
  }

  function revealAll() {
    state.cards.forEach(function (c) { c.clearAll(); });
  }

  /* ---------------- HUD ---------------- */

  function updateHud() {
    el.hudBalance.textContent = XF.money(state.balance);
    el.hudBought.textContent = XF.money(state.stats.bought);
    var rtp = state.stats.cost ? (state.stats.win / state.stats.cost) : 0;
    el.hudRtp.textContent = (rtp * 100).toFixed(1) + '%';
    el.myBought.textContent = XF.money(state.stats.bought);
    el.myCost.textContent = XF.money(state.stats.cost);
    el.myWin.textContent = XF.money(state.stats.win);
    el.myBest.textContent = XF.money(state.stats.best);
    el.btnBuy.textContent = '买一张（¥' + state.game.price + '）';
  }

  /* ---------------- 奖级表 ---------------- */

  function renderPrizeTable() {
    var g = state.game;
    var rows = g.prizes.map(function (p, i) {
      return '<tr class="' + (i === 0 ? 'is-top' : '') + '">' +
        '<td>' + XF.levelName(i) + '</td>' +
        '<td class="amt">¥' + XF.money(p) + '</td>' +
        '<td>' + XF.money(g.counts[i]) + '</td>' +
        '<td>' + XF.ratioText(g.counts[i]) + '</td>' +
        '</tr>';
    }).join('');

    el.tabPrize.innerHTML =
      '<table class="prize">' +
        '<thead><tr><th>奖级</th><th>中奖金额</th><th>每百万张<br>中奖张数</th><th>中奖概率</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
      '<p class="note">' +
        '奖级金额取自公开票样资料（' + g.gameCode + '），共 ' + g.prizes.length + ' 个奖级、' + g.chances + ' 次中奖机会。<br>' +
        '中奖面 ' + (g.winRate * 100).toFixed(2) + '%、返奖率 ' + (g.rtp * 100).toFixed(0) + '%、公益金 20% 为官方公布数据；' +
        '各奖级中奖张数按每百万张设奖池反推，低奖档由中奖面与返奖率联立求解。' +
      '</p>';
  }

  /* ---------------- 概率验证 ---------------- */

  function runSim() {
    var times = parseInt(el.simTimes.value, 10) || 100000;
    el.btnSim.disabled = true;
    el.btnSim.textContent = '模拟中…';
    setTimeout(function () {
      var r = XF.simulate(state.game, times);
      el.simHit.textContent = (r.hitRate * 100).toFixed(2) + '%';
      el.simRtp.textContent = (r.rtp * 100).toFixed(2) + '%';
      var rows = state.game.prizes.map(function (p, i) {
        return '<tr class="' + (i === 0 ? 'is-top' : '') + '">' +
          '<td>' + XF.levelName(i) + '</td>' +
          '<td class="amt">¥' + XF.money(p) + '</td>' +
          '<td>' + XF.money(r.levelHits[i]) + '</td>' +
          '<td>' + XF.money(state.game.counts[i] * times / XF.POOL_SIZE) + '</td>' +
          '</tr>';
      }).join('');
      el.simTable.innerHTML =
        '<table class="prize" style="margin-top:12px">' +
          '<thead><tr><th>奖级</th><th>金额</th><th>实际中出</th><th>理论中出</th></tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>';
      el.btnSim.disabled = false;
      el.btnSim.textContent = '开始模拟';
    }, 30);
  }

  /* ---------------- 规则弹窗 ---------------- */

  function showRules() {
    openModal(
      '<div class="modal-badge">囍</div>' +
      '<h3 class="modal-title">囍相逢 · 玩法规则</h3>' +
      '<div class="modal-list">' +
        '<p>一、刮开覆盖膜，如果刮出「<b>喜</b>」图符，即可获得该图符下方所对应的奖金；' +
        '如果刮出「<b>囍</b>」图符，即可获得该图符下方所对应奖金的<b>两倍</b>。</p>' +
        '<p>二、中奖奖金<b>兼中兼得</b>（一张票上多处中奖，奖金累加）。</p>' +
        '<p>三、本系列共 ' + XF.games.length + ' 个面值：' +
          XF.games.map(function (g) { return g.price + '元（' + g.chances + ' 次机会 / 最高 ' + XF.money(g.prizes[0]) + '）'; }).join('、') + '。</p>' +
        '<p>四、返奖率 65%，销售额的 20% 作为公益金（模拟示意）。</p>' +
        '<p>五、本页为技术还原与概率演示，<b>不涉及真实资金、不可兑奖</b>。</p>' +
      '</div>' +
      '<div class="modal-actions">' +
        '<button class="primary-btn" data-act="close" type="button">开始刮奖</button>' +
      '</div>'
    );
  }

  /* ---------------- 事件绑定 ---------------- */

  el.btnBuy.addEventListener('click', buy);
  el.btnReveal.addEventListener('click', revealAll);
  el.btnNext.addEventListener('click', newTicket);
  el.btnRules.addEventListener('click', showRules);

  /* 连点提示文案区域 6 下：开启「提高一/二等奖概率」模式 */
  var boostTap = 0;
  document.addEventListener('click', function (e) {
    if (XF._boost) return;
    var t = e.target.closest && e.target.closest('.disclaimer, .tk-rule');
    if (!t) return;
    boostTap++;
    if (boostTap >= 6) {
      boostTap = 0;
      XF._boost = true;
      openModal(
        '<div class="modal-badge" style="color:#9a8b7a">🎯</div>' +
        '<h3 class="modal-title">中奖概率已提高</h3>' +
        '<p class="modal-desc">已开启概率提升模式：<b>一等奖、二等奖</b>中奖概率显著提高！<br>点击「重置」可恢复正常中奖概率。</p>' +
        '<div class="modal-actions"><button class="primary-btn" data-act="close" type="button">知道了</button></div>'
      );
    }
  });

  el.btnSim.addEventListener('click', runSim);

  el.btnTopUp.addEventListener('click', function () {
    state.balance += 200;
    saveState();
    updateHud();
  });

  el.btnReset.addEventListener('click', function () {
    var wasBoost = !!XF._boost;
    state.balance = 200;
    state.stats = { bought: 0, cost: 0, win: 0, best: 0, hits: 0 };
    XF._boost = false;
    boostTap = 0;
    saveState();
    updateHud();
    newTicket();
    if (wasBoost) {
      openModal(
        '<div class="modal-badge" style="color:#9a8b7a">ℹ️</div>' +
        '<h3 class="modal-title">已恢复正常概率</h3>' +
        '<p class="modal-desc">中奖概率已恢复为官方默认值（中奖面 31.91%、返奖率 65%）。</p>' +
        '<div class="modal-actions"><button class="primary-btn" data-act="close" type="button">好的</button></div>'
      );
    }
  });

  el.btnClearStats.addEventListener('click', function () {
    state.stats = { bought: 0, cost: 0, win: 0, best: 0, hits: 0 };
    saveState();
    updateHud();
  });

  Array.prototype.forEach.call(document.querySelectorAll('.panel-tab'), function (tab) {
    tab.addEventListener('click', function () {
      Array.prototype.forEach.call(document.querySelectorAll('.panel-tab'), function (t) {
        t.classList.toggle('is-active', t === tab);
      });
      el.tabPrize.hidden = tab.dataset.tab !== 'prize';
      el.tabSim.hidden = tab.dataset.tab !== 'sim';
      el.tabMine.hidden = tab.dataset.tab !== 'mine';
    });
  });

  window.addEventListener('resize', function () {
    state.cards.forEach(function (c) { c.resize(); });
  });

  /* ---------------- 启动 ---------------- */

  loadState();
  XF._boost = false;
  renderPicker();
  renderPrizeTable();
  newTicket();
  updateHud();
})();
