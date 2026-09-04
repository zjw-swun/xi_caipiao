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
  var BOOK_KEY = 'xifeng.book.v1';

  var el = {
    picker: document.getElementById('picker'),
    ticket: document.getElementById('ticket'),
    rackTitle: document.getElementById('rackTitle'),
    rackHint: document.getElementById('rackHint'),
    rackCount: document.getElementById('rackCount'),
    rackTrack: document.getElementById('rackTrack'),
    bookBar: document.getElementById('bookBar'),
    btnBuy: document.getElementById('btnBuy'),
    btnReveal: document.getElementById('btnReveal'),
    btnNewBook: document.getElementById('btnNewBook'),
    btnTopUp: document.getElementById('btnTopUp'),
    btnRules: document.getElementById('btnRules'),
    btnReset: document.getElementById('btnReset'),
    hudBalance: document.getElementById('hudBalance'),
    hudWin: document.getElementById('hudWin'),
    hudBookWin: document.getElementById('hudBookWin'),
    hudRtp: document.getElementById('hudRtp'),
    tabPrize: document.getElementById('tabPrize'),
    tabSim: document.getElementById('tabSim'),
    tabMine: document.getElementById('tabMine'),
    btnSim: document.getElementById('btnSim'),
    simTimes: document.getElementById('simTimes'),
    simHit: document.getElementById('simHit'),
    simRtp: document.getElementById('simRtp'),
    simTable: document.getElementById('simTable'),
    btnSimBooks: document.getElementById('btnSimBooks'),
    simBooksTimes: document.getElementById('simBooksTimes'),
    simBookQualify: document.getElementById('simBookQualify'),
    simBookRtp: document.getElementById('simBookRtp'),
    simBookHit: document.getElementById('simBookHit'),
    simBookAvg: document.getElementById('simBookAvg'),
    myBooks: document.getElementById('myBooks'),
    myBought: document.getElementById('myBought'),
    myCost: document.getElementById('myCost'),
    myWin: document.getElementById('myWin'),
    myBookWin: document.getElementById('myBookWin'),
    myBest: document.getElementById('myBest'),
    btnClearStats: document.getElementById('btnClearStats'),
    modal: document.getElementById('modal'),
    modalCard: document.getElementById('modalCard')
  };

  var state = {
    game: XF.getGame(localStorage.getItem(GAME_KEY) || 'xf10'),
    book: null,      // 当前一本（见 XF.generateBook）
    current: null,   // 当前手牌（book.tickets 中的一项；刮开结算后仍保留用于展示）
    balance: 0,
    stats: { bought: 0, cost: 0, win: 0, best: 0, hits: 0, books: 0, bookBest: 0 }
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
        state.stats.books = s.books || 0;
        state.stats.bookBest = s.bookBest || 0;
      }
    } catch (e) { /* ignore */ }
    if (!isFinite(state.balance) || state.balance < 0) state.balance = 200;
  }

  function saveState() {
    localStorage.setItem(BALANCE_KEY, String(state.balance));
    localStorage.setItem(STATS_KEY, JSON.stringify(state.stats));
  }

  function saveBook() {
    if (!state.book) return;
    localStorage.setItem(BOOK_KEY, JSON.stringify({
      seq: state.book.no,
      currentNo: state.current ? state.current.no : null,
      book: {
        gameId: state.book.gameId,
        no: state.book.no,
        baseNo: state.book.baseNo,
        price: state.book.price,
        bookSize: state.book.bookSize,
        sales: state.book.sales,
        guarantee: state.book.guarantee,
        attempts: state.book.attempts,
        tickets: state.book.tickets.map(function (t) {
          return {
            no: t.no, fullNo: t.fullNo, level: t.level, nominal: t.nominal, win: t.win,
            parts: t.parts, doubles: t.doubles,
            done: !!t.done, settled: !!t.settled,
            _revealed: t._revealed || 0,
            _openCells: (t._openCells || []).slice()
          };
        }),
        opened: state.book.opened,
        openedWin: state.book.openedWin,
        done: !!state.book.done
      }
    }));
  }

  function restoreBook() {
    try {
      var raw = JSON.parse(localStorage.getItem(BOOK_KEY));
      if (!raw || !raw.book) return null;
      var b = raw.book;
      if (!b || b.gameId !== state.game.id) return null;
      b.tickets.forEach(function (t) {
        t.done = !!t.done;
        t.settled = !!t.settled;
        t._revealed = t._revealed || 0;
        t._openCells = Array.isArray(t._openCells) ? t._openCells : [];
      });
      b.total = b.tickets.reduce(function (a, t) { return a + t.win; }, 0);
      b.qualified = b.total >= b.guarantee * 0.9;
      b.currentRef = null;
      if (raw.currentNo != null && !b.done) {
        var t = b.tickets.find(function (x) { return x.no === raw.currentNo && !x.done; });
        if (t) b.currentRef = t;
      }
      return b;
    } catch (e) {
      return null;
    }
  }

  /* ---------------- 本（一叠）与手牌状态 ---------------- */

  function bookSeq() {
    try {
      var raw = JSON.parse(localStorage.getItem(BOOK_KEY));
      return (raw && raw.seq) ? raw.seq : 0;
    } catch (e) { return 0; }
  }

  /** 可抽取的票（未刮开、非手牌、非 exclude） */
  function poolTickets(exclude) {
    var list = [];
    state.book.tickets.forEach(function (t) {
      if (!t.done && t !== state.current && t !== exclude) list.push(t);
    });
    return list;
  }

  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  /** 当前是否有一张「未刮开/未结算」的手牌 */
  function hasLiveHand() {
    return !!(state.current && !state.current.done && !state.current.settled);
  }

  /** 手牌已刮开的格数 */
  function handOpenCount() {
    return state.current ? (state.current._openCells || []).length : 0;
  }

  function handTotalCells() {
    if (!state.current) return 0;
    return XF.ticketCells(state.game, state.current).length;
  }

  function bookDoneCount() {
    return state.book.tickets.filter(function (t) { return !!t.done; }).length;
  }

  function bookLeftCount() {
    return state.book.tickets.filter(function (t) { return !t.done; }).length;
  }

  /** 开启一本新书：不自动发牌（空手空态），由玩家付费抽取 */
  function openNewBook() {
    var no = bookSeq() + 1;
    state.book = XF.generateBook(state.game.id, no);
    state.current = null;
    saveBook();
    syncUI();
  }

  /**
   * 从票架上取一张到手上。target 为 null 时随机取一张；pay=true 为付费抽取。
   * 只有付了钱，才能得到一张奖券（换票另走 swapTo，不额外扣费）。
   */
  function drawTicket(target, pay) {
    var g = state.game;
    if (!state.book || state.book.done) return false;
    var pool = poolTickets(null);
    if (!pool.length) {
      showBookDoneModal();
      return false;
    }
    var t = target || pickRandom(pool);
    if (!t || t.done || t.settled || t === state.current) return false;
    if (pay && state.balance < g.price) {
      showTopUpModal('抽取一张 ¥' + g.price + ' 奖券');
      return false;
    }
    if (pay) {
      state.balance -= g.price;
      state.stats.bought += 1;
      state.stats.cost += g.price;
    }
    state.current = t;
    t._revealed = 0;
    t._openCells = [];
    saveState();
    saveBook();
    syncUI();
    dealAnimation();
    return true;
  }

  /** 抽下一张（结算后的“再抽一张”入口，始终付费随机取） */
  function drawNext() {
    if (state.book && state.book.done) {
      openNewBook();
      showEmptyHint();
      return;
    }
    drawTicket(null, true);
  }

  /**
   * 免费换票：仅限未刮开的手牌。把当前这张放回票架（取消“手中”角色），
   * 拿起点击的那一张；不额外扣体验金。
   */
  function swapTo(target) {
    var cur = state.current;
    if (!hasLiveHand() || !target || target.done || target.settled) return;
    if (handOpenCount() > 0) { showDiscardModal(); return; } // 防御：已刮部分走放弃
    if (target === cur) return;
    state.current = target;
    target._revealed = 0;
    target._openCells = [];
    saveBook();
    syncUI();
    dealAnimation();
  }

  /** 把一张票的已开格奖金结算入账（全刮或放弃部分结算共用） */
  function creditTicket(t) {
    if (!t || t.settled) return 0;
    t.settled = true;
    t.done = true;
    state.book.opened += 1;
    var amt = t._revealed || 0;
    if (amt > 0) {
      state.balance += amt;
      state.stats.win += amt;
      state.stats.hits += 1;
      if (amt > state.stats.best) state.stats.best = amt;
    }
    state.book.openedWin += amt;
    if (bookDoneCount() >= state.book.bookSize && !state.book.done) {
      state.book.done = true;
      state.stats.books += 1;
      if (state.book.openedWin > state.stats.bookBest) state.stats.bookBest = state.book.openedWin;
    }
    saveState();
    saveBook();
    return amt;
  }

  /** 整张刮开后（所有格子已开）自动结算 */
  function settleScratchedTicket() {
    var t = state.current;
    if (!t || !hasLiveHand()) return;
    if (handOpenCount() < handTotalCells()) return; // 还有格没刮到，等最后一片触发
    var amt = creditTicket(t);
    var finished = !!state.book.done;
    partialSync(true); // 结算后整架重绘（槽置灰/剩余计数），不重建票面画布
    showTicketResult(t, finished, amt);
  }

  /** 放弃当前部分刮开的手牌：已开格奖金立即结算，未刮开区域作废 */
  function discardHand() {
    var t = state.current;
    if (!hasLiveHand()) return;
    var amt = creditTicket(t);
    state.current = null;
    syncUI();
    showDiscardResult(t, amt, !!state.book.done);
  }

  /* ---------------- 结算弹窗 ---------------- */

  function showTicketResult(t, finished, amt) {
    if (finished) {
      openModal(
        '<div class="modal-badge">本</div>' +
        '<h3 class="modal-title">第 ' + state.book.no + ' 本已全部刮完</h3>' +
        '<div class="modal-amount">¥ ' + XF.money(state.book.openedWin) + '</div>' +
        '<p class="modal-desc">本本共 ' + state.book.bookSize + ' 张，累计中奖 <b>¥' + XF.money(state.book.openedWin) + '</b>' +
        '，已计入战绩。拆开一本新奖券，再点上方票架中的一张抽取继续。</p>' +
        '<div class="modal-actions">' +
          '<button class="plain-btn" data-act="close" type="button" style="color:#7d1a12;background:#ffe9b3;border-color:#e5c266">收下</button>' +
          '<button class="primary-btn" data-act="doNewBook" type="button">再开一本</button>' +
        '</div>'
      );
      return;
    }
    if (amt > 0) {
      openModal(
        '<div class="modal-badge">囍</div>' +
        '<h3 class="modal-title">恭喜中奖 · ' + XF.levelName(t.level) + '</h3>' +
        '<div class="modal-amount">¥ ' + XF.money(amt) + '</div>' +
        '<p class="modal-desc">' +
          '本张（第 ' + t.no + '/' + state.book.bookSize + ' 张）中奖 ' + XF.money(amt) + ' 元，奖金已存入体验金。<br>' +
          '本累计中奖 ¥' + XF.money(state.book.openedWin) + '。' +
        '</p>' +
        '<div class="modal-actions">' +
          '<button class="plain-btn" data-act="close" type="button" style="color:#7d1a12;background:#ffe9b3;border-color:#e5c266">收下</button>' +
          '<button class="primary-btn" data-act="again" type="button">抽下一张 ¥' + state.game.price + '</button>' +
        '</div>'
      );
    } else {
      openModal(
        '<div class="modal-badge" style="color:#9a8b7a">喜</div>' +
        '<h3 class="modal-title">很遗憾，未中奖</h3>' +
        '<p class="modal-desc">本张（第 ' + t.no + '/' + state.book.bookSize + ' 张）未刮出「喜」或「囍」。<br>公益金 20% 已用于扶老、助残、救孤、济困（模拟示意）。</p>' +
        '<div class="modal-actions">' +
          '<button class="plain-btn" data-act="close" type="button" style="color:#7d1a12;background:#ffe9b3;border-color:#e5c266">知道了</button>' +
          '<button class="primary-btn" data-act="again" type="button">抽下一张 ¥' + state.game.price + '</button>' +
        '</div>'
      );
    }
  }

  function showDiscardResult(t, amt, finished) {
    openModal(
      '<div class="modal-badge" style="color:#9a8b7a">弃</div>' +
      '<h3 class="modal-title">' + (finished ? '这本已刮完' : '已放弃这张奖券') + '</h3>' +
      '<div class="modal-amount">¥ ' + XF.money(amt) + '</div>' +
      '<p class="modal-desc">' +
        '该张未刮开的区域已作废，仅发放已刮开格子的奖金 <b>¥' + XF.money(amt) + '</b>（已存入体验金）。' +
        (finished ? '本本累计中奖 ¥' + XF.money(state.book.openedWin) + '，已计入战绩。' : '想继续就从上方票架再抽取一张（¥' + state.game.price + '）。') +
      '</p>' +
      '<div class="modal-actions">' +
        '<button class="plain-btn" data-act="close" type="button" style="color:#7d1a12;background:#ffe9b3;border-color:#e5c266">知道了</button>' +
        (finished ? '<button class="primary-btn" data-act="doNewBook" type="button">再开一本</button>' : '') +
      '</div>'
    );
  }

  /* ---------------- 确认弹窗 ---------------- */

  function showDiscardModal() {
    var t = state.current;
    var open = handOpenCount();
    var total = handTotalCells();
    var cur = XF.money(t._revealed || 0);
    openModal(
      '<div class="modal-badge" style="color:#9a8b7a">弃</div>' +
      '<h3 class="modal-title">放弃这张并换新票？</h3>' +
      '<p class="modal-desc">本张已刮开 <b>' + open + ' / ' + total + '</b> 个玩法区。' +
        '放弃后：已刮开格子的奖金（当前 <b>¥' + cur + '</b>）立即结算入账，' +
        '<b>未刮开的区域不再兑奖</b>。<br>随后可从上方票架重新抽取一张（另付 ¥' + state.game.price + '）。</p>' +
      '<div class="modal-actions">' +
        '<button class="plain-btn" data-act="close" type="button" style="color:#7d1a12;background:#ffe9b3;border-color:#e5c266">再刮刮看</button>' +
        '<button class="primary-btn" data-act="discard" type="button">放弃并结算</button>' +
      '</div>'
    );
  }

  function showConfirmNewBook() {
    var b = state.book;
    var remain = b ? bookLeftCount() : 0;
    var handNote = '';
    if (hasLiveHand()) {
      handNote = handOpenCount() > 0
        ? '<br>当前手牌已刮开部分将按已开格结算；'
        : '<br>当前手牌未刮开，将直接作废；';
    }
    openModal(
      '<div class="modal-badge" style="color:#9a8b7a">本</div>' +
      '<h3 class="modal-title">确定换一本？</h3>' +
      '<p class="modal-desc">换本后，本中剩余 <b>' + remain + '</b> 张未刮奖券全部作废封存；' +
        '已结算的中奖与开本记录保留。' + handNote + '将拆开一本新的继续。</p>' +
      '<div class="modal-actions">' +
        '<button class="plain-btn" data-act="close" type="button" style="color:#7d1a12;background:#ffe9b3;border-color:#e5c266">再想想</button>' +
        '<button class="primary-btn" data-act="doNewBook" type="button">确定换一本</button>' +
      '</div>'
    );
  }

  function showBookDoneModal() {
    openModal(
      '<div class="modal-badge" style="color:#9a8b7a">本</div>' +
      '<h3 class="modal-title">这一本已经刮完</h3>' +
      '<p class="modal-desc">本中所有奖券均已结算。可以点「换一本」拆开一本新的继续。</p>' +
      '<div class="modal-actions">' +
        '<button class="plain-btn" data-act="close" type="button" style="color:#7d1a12;background:#ffe9b3;border-color:#e5c266">知道了</button>' +
        '<button class="primary-btn" data-act="doNewBook" type="button">换一本</button>' +
      '</div>'
    );
  }

  function showTopUpModal(reason) {
    openModal(
      '<div class="modal-badge" style="color:#9a8b7a">喜</div>' +
      '<h3 class="modal-title">体验金不足</h3>' +
      '<p class="modal-desc">当前体验金 ¥' + XF.money(state.balance) + '，不足以' + (reason || '抽取奖券') + '。<br>' +
        '本页不涉及任何真实资金，体验金仅供模拟玩法使用，点击下方按钮领取 ¥200。</p>' +
      '<div class="modal-actions">' +
        '<button class="primary-btn" data-act="topup" type="button">领取体验金 ¥200</button>' +
      '</div>'
    );
  }

  /** 执行换一本：手牌若有已刮格子先结算，然后开新本（空手） */
  function doNewBook() {
    if (hasLiveHand() && handOpenCount() > 0) {
      creditTicket(state.current); // 部分结算入账
    }
    state.current = null;
    openNewBook();
  }

  /* ---------------- 弹窗基础 ---------------- */

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
    if (act === 'close') { closeModal(); return; }
    if (act === 'topup') { topUp(); closeModal(); syncUI(); return; }
    if (act === 'again') { closeModal(); drawNext(); return; }
    if (act === 'discard') { closeModal(); discardHand(); return; }
    if (act === 'doNewBook') { closeModal(); doNewBook(); return; }
  });

  /* ---------------- 体验金 ---------------- */

  function topUp() {
    state.balance += 200;
    saveState();
    updateHudOnly();
  }

  /* ---------------- 票种卡片 ---------------- */

  function renderPicker() {
    el.picker.innerHTML = '';
    XF.games.forEach(function (g) {
      var div = document.createElement('div');
      div.className = 'tcard' + (g.id === state.game.id ? ' is-active' : '');
      div.innerHTML =
        '<div class="tcard-flower">囍</div>' +
        '<div class="tcard-price">¥' + g.price + '</div>' +
        '<div class="tcard-sub">' + g.bookSize + ' 张/本 · ' + g.chances + ' 次机会</div>' +
        '<div class="tcard-top">一本 ¥' + g.sales + '</div>';
      div.addEventListener('click', function () {
        if (state.game.id === g.id) return;
        state.game = g;
        localStorage.setItem(GAME_KEY, g.id);
        renderPicker();
        renderPrizeTable();
        openNewBook(); // 空手空态，等玩家付费抽取
      });
      el.picker.appendChild(div);
    });
  }

  /* ---------------- 整本票架（rack） ----------------
     一排展示当前本中的全部奖券：未刮可点（抽取/换票）、手中高亮、已刮置灰 */

  function rackHintText() {
    var b = state.book;
    var g = state.game;
    if (!b) return '先点「换一本」开启一本';
    if (hasLiveHand()) {
      return handOpenCount() > 0
        ? '本张已刮开部分：换票需先「放弃」（未刮开区域不兑奖）'
        : '手中有第 ' + state.current.no + ' 张（未刮）· 点架上其他张可免费换';
    }
    if (b.done) return '这本已全部刮完 · 点「换一本」再开一本';
    if (state.balance < g.price) return '体验金不足 · 先领取再抽取';
    return '点一张抽取（¥' + g.price + '/张）· 抽一张少一张';
  }

  function rackRefreshHead() {
    var b = state.book;
    if (!b) {
      el.rackTitle.textContent = '整本票架';
      el.rackHint.textContent = rackHintText();
      el.rackCount.textContent = '';
      return;
    }
    el.rackTitle.textContent = '整本票架 · 第 ' + b.no + ' 本';
    el.rackHint.textContent = rackHintText();
    el.rackCount.innerHTML = '剩 <b>' + Math.max(0, bookLeftCount()) + '</b> 张 · 已刮 <b>' + b.opened + '</b> 张';
  }

  /** 只重绘轨道内的票卡（保留标题行与横向滚动位置） */
  function renderRackTickets() {
    var b = state.book;
    var tr = el.rackTrack;
    if (!b) { tr.innerHTML = ''; return; }
    var g = state.game;
    var sl = tr.scrollLeft || 0;
    var html = '';
    b.tickets.forEach(function (t, i) {
      var gone = !!t.done;
      var hand = !gone && t === state.current;
      var cls = 'rt' + (gone ? ' is-gone' : '') + (hand ? ' is-hand' : '');
      var tip;
      if (gone) tip = '第 ' + t.no + ' 张 · 已结算 / 已放弃';
      else if (hand) tip = '第 ' + t.no + ' 张 · 正在你手中，在下方票面刮开';
      else if (b.done) tip = '第 ' + t.no + ' 张（本已刮完）';
      else if (state.balance < g.price) tip = '第 ' + t.no + ' 张 · 体验金不足';
      else tip = '第 ' + t.no + ' 张 · 点击抽取（¥' + g.price + '）';
      html += '<div class="' + cls + '" data-i="' + i + '" title="' + tip + '">' +
        '<span class="rt-no">' + t.no + '</span>' +
        (gone ? '' : (hand ? '<span class="rt-st">手中</span>' : '<span class="rt-xi">囍</span>')) +
        '<span class="rt-fv">¥' + g.price + '</span>' +
      '</div>';
    });
    tr.innerHTML = html;
    tr.scrollLeft = sl;
  }

  function renderRack() {
    rackRefreshHead();
    renderRackTickets();
  }

  /** 点击架上某张票：抽取（空手）/ 换票（手牌未刮）/ 放弃确认（手牌已刮） */
  function rackSlotClick(i) {
    var b = state.book;
    if (!b) { openNewBook(); return; }
    var t = b.tickets[i];
    if (!t || t.done || t.settled) return;    // 已结算槽不可点
    if (t === state.current) return;           // 手中这张（已在下方票面）
    if (hasLiveHand()) {
      if (handOpenCount() > 0) { showDiscardModal(); return; } // 已刮部分：先放弃
      swapTo(t);                                                // 未刮：免费换到这张
      return;
    }
    if (b.done) { showBookDoneModal(); return; }
    drawTicket(t, true); // 空手：付费抽取这张（不足时内部弹领取提示）
  }

  el.rackTrack.addEventListener('click', function (e) {
    var node = e.target.closest && e.target.closest('.rt[data-i]');
    if (!node) return;
    rackSlotClick(parseInt(node.getAttribute('data-i'), 10));
  });

  /* ---------------- 本信息栏 ---------------- */

  function renderBookBar() {
    var b = state.book;
    if (!b) { el.bookBar.innerHTML = ''; return; }
    var pct = Math.min(100, Math.round(b.opened / b.bookSize * 100));
    el.bookBar.innerHTML =
      '<div class="bb-top">' +
        '<div class="bb-title">第 <b>' + b.no + '</b> 本 · ¥' + b.price + '/张 × ' + b.bookSize + ' 张（一本 ¥' + b.sales + '）</div>' +
      '</div>' +
      '<div class="bb-progress"><i style="width:' + pct + '%"></i></div>' +
      '<div class="bb-meta">' +
        '<span>已刮 <b>' + b.opened + ' / ' + b.bookSize + '</b> 张</span>' +
        '<span>剩余 <b>' + Math.max(0, bookLeftCount()) + '</b> 张</span>' +
        '<span>本累计中奖 <b>¥' + XF.money(b.openedWin) + '</b></span>' +
      '</div>';
  }

  /* ---------------- 票面渲染 ---------------- */

  function ticketCode(t) {
    var g = state.game;
    function pad(n, len) {
      var s = String(n);
      while (s.length < len) s = '0' + s;
      return s;
    }
    return g.code + '-' + pad(state.book.baseNo, 6) + '-' + pad(t.no, 3) + '-3';
  }

  function emptyTicketHtml() {
    var g = state.game;
    var noBook = !state.book;
    var doneBook = state.book && state.book.done;
    var poor = state.balance < g.price;
    var mark, title, tip;
    if (noBook) {
      mark = '本'; title = '等待开本'; tip = '请先「换一本」开启一本新的奖券。';
    } else if (doneBook) {
      mark = '本'; title = '这一本已经刮完';
      tip = '累计中奖 ¥' + XF.money(state.book.openedWin) + ' 已计入战绩。点「换一本」开一本新的，再从上方票架点一张抽取。';
    } else if (poor) {
      mark = '喜'; title = '体验金不足';
      tip = '抽取一张 ¥' + g.price + ' 元奖券需要体验金 ¥' + g.price + '。点击「领取体验金」补足 ¥200 后，再点票架中的一张抽取。';
    } else {
      mark = '本'; title = '手中还没有奖券';
      tip = '点击上方<b>票架</b>中的一张或「抽一张」付费抽取（¥' + g.price + '/张）。' +
        '抽取后刮开玩法区：刮出「喜」得对应奖金，刮出「囍」得两倍。本内还剩 ' + bookLeftCount() + ' 张。';
    }
    return '<div class="tk tk-empty">' +
      '<div class="tk-empty-mark">' + mark + '</div>' +
      '<p>' + title + '</p>' +
      '<p class="tk-empty-tip">' + tip + '</p>' +
    '</div>';
  }

  function renderTicket() {
    var g = state.game;
    var t = state.current;
    el.ticket.style.setProperty('--accent', g.accent);

    if (!t) {
      el.ticket.innerHTML = emptyTicketHtml();
      state.cards = [];
      return;
    }

    var cells = XF.ticketCells(g, t);
    var openMap = {};
    (t._openCells || []).forEach(function (i) { openMap[i] = true; });

    var _pool = ICONS.slice();
    for (var _s = _pool.length - 1; _s > 0; _s--) { var _r = Math.floor(Math.random() * (_s + 1)); var _t2 = _pool[_s]; _pool[_s] = _pool[_r]; _pool[_r] = _t2; }
    var _pi = 0;
    function nextIcon() { var ic = _pool[_pi % _pool.length]; _pi++; return ic; }

    var cellsHtml = cells.map(function (c, i) {
      var cls = 'cell' + (c.type === 'xi' ? ' is-xi' : c.type === 'shuang' ? ' is-shuang' : '');
      if (openMap[i]) {
        cls += ' is-open' + (c.type !== 'none' ? ' is-hit' : '');
      }
      var sym = c.type === 'shuang' ? '囍' : c.type === 'xi' ? '喜' : '';
      // 面值显示“下方印制金额”print；「囷」的印制值为中奖金额的一半（兑奖按两倍）
      var faceInner = sym
        ? '<span class="cell-sym">' + sym + '</span>' +
          '<span class="cell-amt-in">¥' + XF.money(c.print) + '</span>' +
          '<span class="cell-pinyin-in">' + XF.numToPinyin(c.print) + '</span>'
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
        (c.type !== 'none'
          ? '<div class="cell-win">中 ¥' + XF.money(c.amount) + '</div>'
          : '<div class="cell-win is-zero">&nbsp;</div>') +
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
        '<p class="tk-rule">刮开覆盖膜，如果刮出「<em>喜</em>」图符，即可获得该图符下方所对应的奖金；如果刮出「<em>囍</em>」图符，即可获得该图符下方所对应奖金的<em>两倍</em>。中奖奖金兼中兼得。</p>' +
        '<div class="tk-chances">' + g.chances + '次中奖机会</div>' +
        '<div class="tk-banner is-footer"><span class="tk-banner-text">' + g.footerBanner + '</span></div>' +
        '<div class="tk-bottom">' +
          '<span class="tk-safe">保安区刮开无效</span>' +
          '<div class="barcode"></div>' +
          '<div class="tk-no">' + ticketCode(t) + '<br>第 ' + t.no + ' / ' + state.book.bookSize + ' 张 · 本中奖 <b id="ticketSum">¥0</b></div>' +
        '</div>' +
      '</div>';

    el.ticket.innerHTML = html;

    state.cards = [];
    var coverCanvas = el.ticket.querySelector('.ticket-cover');
    var cellsNodes = el.ticket.querySelectorAll('.cell');
    var cellsInfo = [];
    Array.prototype.forEach.call(cellsNodes, function (node, i) {
      if (openMap[i]) return; // 已刮开的格不再注册，避免重复结算
      cellsInfo.push({ node: node, onReveal: function () { onCellOpen(node, i); } });
    });
    state.cards = [new window.ScratchCard(coverCanvas, { cells: cellsInfo })];
  }

  function onCellOpen(node, i) {
    if (node.classList.contains('is-open')) return;
    node.classList.add('is-open');
    var t = state.current;
    if (!t) return;
    var cells = XF.ticketCells(state.game, t);
    var cell = cells[i];
    if (cell && cell.type !== 'none') {
      node.classList.add('is-hit');
      t._revealed = (t._revealed || 0) + cell.amount;
      var sum = el.ticket.querySelector('#ticketSum');
      if (sum) sum.textContent = '¥' + XF.money(t._revealed);
      updateHudOnly();
    }
    t._openCells = t._openCells || [];
    if (t._openCells.indexOf(i) < 0) t._openCells.push(i);
    if (t._openCells.length >= cells.length) {
      settleScratchedTicket();
    } else {
      partialSync(false);
    }
  }

  /** 轻量刷新（不动票面画布，刮一半时保持覆盖膜）。
      rebuildRack=true：整架重绘（结算后槽置灰/剩张变化）；false：只刷票架头部文字 */
  function partialSync(rebuildRack) {
    if (rebuildRack) renderRack();
    else rackRefreshHead();
    renderBookBar();
    updateHudOnly();
    updateControls();
  }

  /* ---------------- HUD / 按钮状态 ---------------- */

  function setHot(btn, on) {
    if (on) {
      btn.classList.remove('plain-btn');
      btn.classList.add('primary-btn');
    } else {
      btn.classList.add('plain-btn');
      btn.classList.remove('primary-btn');
    }
  }

  function updateHudOnly() {
    el.hudBalance.textContent = XF.money(state.balance);
    var showWin = (state.current && !state.current.done) ? (state.current._revealed || 0) : 0;
    el.hudWin.textContent = XF.money(showWin);
    var rtp = state.stats.cost ? (state.stats.win / state.stats.cost) : 0;
    el.hudRtp.textContent = (rtp * 100).toFixed(1) + '%';
    el.hudBookWin.textContent = XF.money(state.book ? state.book.openedWin : 0);
    el.myBooks.textContent = XF.money(state.stats.books);
    el.myBought.textContent = XF.money(state.stats.bought);
    el.myCost.textContent = XF.money(state.stats.cost);
    el.myWin.textContent = XF.money(state.stats.win);
    el.myBookWin.textContent = XF.money(state.stats.bookBest);
    el.myBest.textContent = XF.money(state.stats.best);
  }

  function updateControls() {
    var g = state.game;
    var live = hasLiveHand();
    var afford = state.balance >= g.price;
    var bookDead = !state.book || state.book.done || bookLeftCount() <= 0;

    // 抽一张：空手、本未刮完、钱够
    var buy = el.btnBuy;
    buy.disabled = live || bookDead || !afford;
    if (!state.book || bookDead) buy.textContent = '本已刮完';
    else if (!afford) buy.textContent = '体验金不足';
    else buy.textContent = '抽一张 ¥' + g.price;
    buy.title = '每张奖券需先付款体验金，才可获得';

    // 一键刮开：有未结算手牌
    var rev = el.btnReveal;
    rev.disabled = !live;
    rev.textContent = live && handOpenCount() > 0 ? '刮开剩余并结算' : '一键刮开';

    // 换一本：本未刮完且无体验金时不允许（规则）；整本刮完后始终允许开新本（取票时才收费）
    el.btnNewBook.disabled = !state.book || (bookLeftCount() > 0 && !afford);

    // 领取体验金：在没手牌又没钱时高亮为主操作
    setHot(el.btnTopUp, !live && !afford && !bookDead);
    el.btnTopUp.textContent = !afford && !live ? '领取体验金 ¥200' : '领取体验金 +200';
  }

  function syncUI() {
    renderRack();
    renderBookBar();
    renderTicket();
    updateHudOnly();
    updateControls();
  }

  function dealAnimation() {
    el.ticket.classList.remove('dealing');
    void el.ticket.offsetWidth;
    el.ticket.classList.add('dealing');
  }

  function revealAll() {
    if (!hasLiveHand()) return;
    if (state.cards.length) {
      state.cards.forEach(function (c) { c.clearAll(); });
    } else {
      settleScratchedTicket();
    }
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
        '整本玩法：一本 ' + g.bookSize + ' 张（总价 ¥' + g.sales + '），每次点上方票架中的一张付费抽取，' +
        '本实际中奖按整本奖池比例配额（可在「概率验证」中查看整本口径模拟）。<br>' +
        '奖级表为单张官方口径参考：中奖面 ' + (g.winRate * 100).toFixed(2) + '%、返奖率 ' + (g.rtp * 100).toFixed(0) +
        '%，各奖级中奖张数按每百万张设奖池反推。50 元档为演示构造设奖。' +
      '</p>';
  }

  /* ---------------- 概率验证 ---------------- */

  function runSimBooks() {
    var times = parseInt(el.simBooksTimes.value, 10) || 500;
    el.btnSimBooks.disabled = true;
    el.btnSimBooks.textContent = '模拟中…';
    setTimeout(function () {
      var r = XF.simulateBooks(state.game.id, times);
      el.simBookQualify.textContent = (r.qualifyRate * 100).toFixed(1) + '%';
      el.simBookRtp.textContent = (r.avgRtp * 100).toFixed(1) + '%';
      el.simBookHit.textContent = (r.avgHitRate * 100).toFixed(1) + '%';
      el.simBookAvg.textContent = XF.money(Math.round(r.avgBookWin));
      el.btnSimBooks.disabled = false;
      el.btnSimBooks.textContent = '开始模拟';
    }, 30);
  }

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
      '<h3 class="modal-title">囍相逢 · 整本玩法规则</h3>' +
      '<div class="modal-list">' +
        '<p>一、刮开覆盖膜，如果刮出「<b>喜</b>」图符，即可获得该图符下方所对应的奖金；' +
        '如果刮出「<b>囍</b>」图符，即可获得该图符下方所对应奖金的<b>两倍</b>；奖金兼中兼得。</p>' +
        '<p>二、<b>先付款，后取票</b>：体验金不足时无法抽奖。点击上方<b>票架</b>中的一张（或「抽一张」随机取一张）付费抽取，即可开始刮奖。</p>' +
        '<p>三、以「<b>本</b>」为单位：10 元票 50 张/本（总价 500 元）；20 元票 30 张/本；30 元票 20 张/本；50 元票 12 张/本（总价均 600 元）。' +
        '每本实际中奖按整本奖池随机配额，单本中奖情况不对外公布。</p>' +
        '<p>四、<b>只有未刮开的奖券可以免费更换</b>：点击票架中另一张未刮的票，手中这张即放回架上（不重复扣费）；' +
        '已刮开部分想换新票，需先「放弃」——已刮开格子的奖金立即结算，<b>未刮开区域不再兑奖</b>。</p>' +
        '<p>五、「换一本」将作废当前本剩余奖券并拆开一本新的；本页<b>不涉及真实资金、不可兑奖</b>，公益金 20% 为模拟示意。</p>' +
      '</div>' +
      '<div class="modal-actions">' +
        '<button class="primary-btn" data-act="close" type="button">开始刮奖</button>' +
      '</div>'
    );
  }

  /* ---------------- 事件绑定 ---------------- */

  el.btnBuy.addEventListener('click', function () {
    if (hasLiveHand()) {
      openModal(
        '<div class="modal-badge" style="color:#9a8b7a">喜</div>' +
        '<h3 class="modal-title">先处理手中这张</h3>' +
        '<p class="modal-desc">每人同时只能持有一张奖券。可「一键刮开」结算，' +
        '或点上方票架：未刮开点另一张即免费换，已刮开需先「放弃」再抽取新票。</p>' +
        '<div class="modal-actions"><button class="primary-btn" data-act="close" type="button">好的</button></div>'
      );
      return;
    }
    drawTicket(null, true);
  });
  el.btnReveal.addEventListener('click', revealAll);
  el.btnNewBook.addEventListener('click', function () {
    if (!affordableCheck()) return;
    showConfirmNewBook();
  });
  el.btnTopUp.addEventListener('click', function () {
    topUp();
    partialSync();
    openModal(
      '<div class="modal-badge" style="color:#9a8b7a">喜</div>' +
      '<h3 class="modal-title">体验金已到账</h3>' +
      '<p class="modal-desc">已领取 <b>¥200</b>，当前体验金 <b>¥' + XF.money(state.balance) + '</b>。<br>点上方票架中的一张开始抽取吧（¥' + state.game.price + '/张）。</p>' +
      '<div class="modal-actions"><button class="primary-btn" data-act="close" type="button">开始抽奖</button></div>'
    );
  });
  el.btnRules.addEventListener('click', showRules);

  function affordableCheck() {
    if (state.balance < state.game.price) {
      showTopUpModal('进行「换一本」');
      return false;
    }
    return true;
  }

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
  el.btnSimBooks.addEventListener('click', runSimBooks);

  el.btnReset.addEventListener('click', function () {
    var wasBoost = !!XF._boost;
    state.balance = 200;
    state.stats = { bought: 0, cost: 0, win: 0, best: 0, hits: 0, books: 0, bookBest: 0 };
    XF._boost = false;
    boostTap = 0;
    saveState();
    openNewBook();
    if (wasBoost) {
      openModal(
        '<div class="modal-badge" style="color:#9a8b7a">ℹ️</div>' +
        '<h3 class="modal-title">已恢复正常概率</h3>' +
        '<p class="modal-desc">中奖概率已恢复为官方默认值，并重新开启了一本（等待抽取）。</p>' +
        '<div class="modal-actions"><button class="primary-btn" data-act="close" type="button">好的</button></div>'
      );
    }
  });

  el.btnClearStats.addEventListener('click', function () {
    state.stats = { bought: 0, cost: 0, win: 0, best: 0, hits: 0, books: 0, bookBest: 0 };
    saveState();
    updateHudOnly();
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

  var saved = restoreBook();
  if (saved) {
    state.book = saved;
    state.current = saved.currentRef || null; // 恢复手牌（半刮格照常显示）
  } else {
    openNewBook();
  }
  syncUI();
})();
