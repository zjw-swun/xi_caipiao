/**
 * 囍相逢（趣味刮刮乐）票种数据模型
 * ------------------------------------------------------------------
 * 【奖级金额】参考公开票样资料（仅作数据来源标注，与发行机构无关）：
 *   10元票 https://www.cwl.gov.cn/c/2022/10/11/517465.shtml
 *   20元票 https://www.cwl.gov.cn/c/2022/10/11/517439.shtml
 *   30元票 https://www.cwl.gov.cn/c/2022/10/11/517468.shtml
 *
 * 【玩法】刮开覆盖膜，刮出「喜」图符即获得该图符下方对应奖金；
 *         刮出「囍」图符即获得该图符下方对应奖金的两倍；奖金兼中兼得。
 *
 * 【公开参数】返奖率 65%、公益金 20%、中奖面 31.91%、
 *            10元票 11 个奖级 / 10 次中奖机会、20元票 10 个奖级 / 25 次、
 *            30元票 12 个奖级 / 40 次。
 *
 * 【各奖级中奖张数】官方仅公布奖级金额与整体中奖面，未逐档公布中奖注数。
 *   此处按每 1,000,000 张设奖池，联立两个官方约束反推：
 *       Σ counts            = 中奖面 × 1,000,000
 *       Σ (counts × prize)  = 面值 × 1,000,000 × 65%
 *   高奖级张数参考同系列常见设奖结构，最低两档由方程精确求解，
 *   因此模拟结果与官方公布的「中奖面 31.91%」「返奖率 65%」完全一致。
 */
(function (global) {
  'use strict';

  var POOL_SIZE = 1000000;

  var GAMES = [
    {
      id: 'xf10',
      name: '喜相逢10元',
      price: 10,
      chances: 10,
      cols: 5,
      code: 'J0790',
      accent: '#14418c',
      banner: '心想事成',
      coupletL: '一帆风顺',
      coupletR: '万事顺遂',
      footerBanner: '吉祥如意',
      prizes: [300000, 10000, 1000, 500, 200, 100, 50, 40, 30, 20, 10],
      counts: [1, 30, 400, 800, 2000, 4000, 8000, 10000, 13000, 30131, 250738],
      winRate: 0.3191,
      rtp: 0.65,
      // 整本玩法：一本 N 张、总价 N×面值，每本保底中奖区间（元）
      bookSize: 50,
      guaranteeLow: 150,
      guaranteeHigh: 240
    },
    {
      id: 'xf20',
      name: '喜相逢20元',
      price: 20,
      chances: 25,
      cols: 5,
      code: 'J0791',
      accent: '#a3122b',
      banner: '财运亨通',
      coupletL: '鹏程万里',
      coupletR: '鸿运千秋',
      footerBanner: '金玉满堂',
      prizes: [800000, 5000, 1000, 500, 200, 100, 50, 40, 30, 20],
      counts: [1, 300, 1200, 2400, 3600, 5000, 6000, 8000, 60802, 231797],
      winRate: 0.3191,
      rtp: 0.65,
      bookSize: 30,
      guaranteeLow: 200,
      guaranteeHigh: 260
    },
    {
      id: 'xf30',
      name: '喜相逢30元',
      price: 30,
      chances: 40,
      cols: 8,
      code: 'J0802',
      accent: '#8c1020',
      banner: '喜事连连',
      coupletL: '年年有余',
      coupletR: '和顺安康',
      footerBanner: '阖家团圆',
      prizes: [1000000, 200000, 10000, 900, 600, 300, 100, 80, 60, 50, 40, 30],
      counts: [1, 8, 200, 1000, 1500, 3000, 9000, 12000, 16000, 20000, 68827, 187564],
      winRate: 0.3191,
      rtp: 0.65,
      bookSize: 20,
      guaranteeLow: 200,
      guaranteeHigh: 260
    },
    {
      id: 'xf50',
      name: '喜相逢50元',
      price: 50,
      chances: 40,
      cols: 8,
      code: 'J0803',
      accent: '#4a2a8f',
      banner: '福星高照',
      coupletL: '财源广进',
      coupletR: '万事如意',
      footerBanner: '百福具臻',
      // 演示构造票种：官方 50 元「喜相逢」为双玩法区（55 次机会），本演示未收录官方设奖；
      // 此处按与 30 元票相近的比例关系构造 11 个奖级，仍满足 Σcounts=319,100、Σcounts×prize=50×650,000。
      prizes: [1000000, 100000, 30000, 10000, 2000, 1000, 500, 300, 200, 100, 50],
      counts: [1, 8, 20, 200, 500, 800, 1200, 2000, 4000, 175629, 134742],
      winRate: 0.3191,
      rtp: 0.65,
      bookSize: 12,
      guaranteeLow: 200,
      guaranteeHigh: 260
    }
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /** 金额中文读法拼音（票面印制用），如 200 -> ERBAI、300000 -> SANSHIWAN */
  function numToPinyin(n) {
    var D = ['', 'YI', 'ER', 'SAN', 'SI', 'WU', 'LIU', 'QI', 'BA', 'JIU'];
    n = Math.floor(Math.abs(n));
    if (n === 0) return 'LING';
    if (n >= 100000000) return String(n);
    if (n >= 10000) {
      var w = Math.floor(n / 10000), r = n % 10000;
      return numToPinyin(w) + 'WAN' + (r ? (r < 1000 ? 'LING' : '') + numToPinyin(r) : '');
    }
    if (n >= 1000) {
      var th = Math.floor(n / 1000), r3 = n % 1000;
      return D[th] + 'QIAN' + (r3 ? (r3 < 100 ? 'LING' : '') + numToPinyin(r3) : '');
    }
    if (n >= 100) {
      var h = Math.floor(n / 100), r2 = n % 100;
      return D[h] + 'BAI' + (r2 ? (r2 < 10 ? 'LING' : '') + numToPinyin(r2) : '');
    }
    if (n >= 10) {
      var t = Math.floor(n / 10), o = n % 10;
      return (t === 1 ? '' : D[t]) + 'SHI' + (o ? D[o] : '');
    }
    return D[n];
  }

  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function buildIndex(game) {
    var cum = [];
    var sum = 0;
    for (var i = 0; i < game.counts.length; i++) {
      sum += game.counts[i];
      cum.push(sum);
    }
    game._cum = cum;
    game._totalWinners = sum;
    game._prizeSum = game.prizes.reduce(function (a, p, i) {
      return a + p * game.counts[i];
    }, 0);
    // 票面可印刷的金额档位（用于未中奖格与拆分）
    game._minPrint = Math.min.apply(null, game.prizes);
    game._splitPool = game.prizes.filter(function (v) { return v >= game._minPrint; });
    game._lowPool = game.prizes.filter(function (v) { return v <= game.price * 10; });
    // 低面额判定线：单张奖额 ≤ 面值×3 视为“低面额奖级”（本保底调节的目标档）
    game._lowCap = game.price * 3;
    // 整本玩法派生值：一本总价
    game.sales = game.price * game.bookSize;
    return game;
  }

  GAMES.forEach(buildIndex);

  /**
   * 按奖级权重抽奖（支持两档调节）：
   *  boost    = true 时放大一/二等奖权重（隐藏的“概率提升”演示模式）
   *  lowBoost = 低面额奖级（≤ 面值×3）的权重放大倍数，≥1；用于整本保底生成时把
   *             单张奖金往低面额档收，避免为凑保底而抬出过多大奖。
   */
  function pickLevelW(game, boost, lowBoost) {
    var cs = game.counts, i, w;
    var total = 0;
    var wcum = [];
    for (i = 0; i < cs.length; i++) {
      w = cs[i];
      if (boost && i < 2) w *= 30;
      if (lowBoost > 1.0001 && game.prizes[i] <= game._lowCap) w *= lowBoost;
      total += w;
      wcum.push(total);
    }
    var r = Math.random() * total;
    for (i = 0; i < wcum.length; i++) {
      if (r < wcum[i]) return i;
    }
    return wcum.length - 1;
  }

  /** 按权重抽出一个奖级下标（兼容旧调用，等同 pickLevelW(game, boost, 1)） */
  function pickLevel(game, boost) {
    return pickLevelW(game, !!boost, 1);
  }

  /**
   * 把总奖金拆成 1~3 份（每份对应一个刮开区的中奖金额）。
   * 每一份都必须是奖级金额档位之一（票面上只印这些金额，拼音才能对应）。
   */
  function splitPrize(game, total) {
    var min = game._minPrint;
    var inPool = function (v) { return game.prizes.indexOf(v) >= 0 && v >= min; };

    // 2 份：直接配对
    var pairs = game.prizes.filter(function (v) { return v < total && inPool(total - v); });
    if (pairs.length && Math.random() < 0.6) {
      var a = pick(pairs);
      return shuffled([a, total - a]);
    }

    // 3 份
    var heads = shuffled(game.prizes.filter(function (v) { return v < total - min; }));
    for (var i = 0; i < heads.length; i++) {
      var rest = total - heads[i];
      var mids = game.prizes.filter(function (v) { return v < rest && inPool(rest - v); });
      if (mids.length) {
        var b = pick(mids);
        return shuffled([heads[i], b, rest - b]);
      }
    }
    return [total];
  }

  /** 从 0..n-1 中随机取 k 个不重复位置 */
  function samplePositions(n, k) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(i);
    for (var j = arr.length - 1; j > 0; j--) {
      var t = Math.floor(Math.random() * (j + 1));
      var tmp = arr[j]; arr[j] = arr[t]; arr[t] = tmp;
    }
    return arr.slice(0, k).sort(function (a, b) { return a - b; });
  }

  /**
   * 生成一张票
   * 返回 { win, total, level, cells: [{ type:'xi'|'shuang'|'none', print, amount }] }
   *   type  : 刮开后的图符（喜 / 囍 / 空）
   *   print : 该格下方印制的金额
   *   amount: 该格实得奖金（喜=print，囍=print×2，空=0）
   */
  /**
   * 抽一张票的“数值计划”（不含票面布格）：
   * 返回 { win, level, nominal, total, parts:[], doubles:[] }
   *   nominal : 命中的奖级金额（票面印制合计）
   *   total   : 实得奖金（存在「囍」格时为 nominal 上浮）
   *   parts   : 中奖格拆分出的印制金额
   *   doubles : parts 中哪些格以「囍」呈现（金额翻倍）
   * opt.lowBoost：低面额奖级（≤ 面值×3）权重放大倍数，整本保底生成使用；
   * opt.hitBoost：额外的命中率加成（保底进度落后时小幅提高中奖面）。
   */
  function makeTicketPlan(game, opt) {
    opt = opt || {};
    var useBoost = !!global.XIFENG._boost;
    var lowBoost = opt.lowBoost || 1;
    var hitP = Math.min(0.92, game.winRate + (opt.hitBoost || 0));

    if (Math.random() >= hitP) {
      return { win: false, level: -1, nominal: 0, total: 0, parts: [], doubles: [] };
    }

    var level = pickLevelW(game, useBoost, lowBoost);
    var nominal = game.prizes[level];
    var parts = splitPrize(game, nominal);
    var totalAmount = 0;
    var doubles = parts.map(function (v) {
      if (v >= 10 && Math.random() < 0.3) { totalAmount += v * 2; return true; }
      totalAmount += v;
      return false;
    });
    return { win: true, level: level, nominal: nominal, total: totalAmount, parts: parts, doubles: doubles };
  }

  /**
   * 把一张票的“数值计划”铺到票面刮开区（中奖格随机散落 + 空位底纹金额）。
   */
  function buildTicketCells(game, plan) {
    var cells = [];
    var i, p = 0, pos;

    if (!plan || !plan.win) {
      for (i = 0; i < game.chances; i++) {
        cells.push({ type: 'none', print: pick(game._lowPool), amount: 0 });
      }
      return cells;
    }

    pos = samplePositions(game.chances, plan.parts.length);
    var winCells = plan.parts.map(function (v, k) {
      if (plan.doubles && plan.doubles[k]) {
        return { type: 'shuang', print: v, amount: v * 2 };
      }
      return { type: 'xi', print: v, amount: v };
    });

    for (i = 0; i < game.chances; i++) {
      if (p < pos.length && pos[p] === i) {
        cells.push(winCells[p]);
        p++;
      } else {
        cells.push({ type: 'none', print: pick(game._lowPool), amount: 0 });
      }
    }
    return cells;
  }

  /**
   * 生成一张票（兼容旧调用）。返回 drawTicket 结构：{ win, total, level, nominal, cells }。
   * opt.lowBoost / opt.hitBoost 同 makeTicketPlan。
   */
  function drawTicket(game, opt) {
    var plan = makeTicketPlan(game, opt);
    var cells = buildTicketCells(game, plan);
    return { win: plan.win, total: plan.total, level: plan.level, nominal: plan.nominal, cells: cells };
  }

  function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }

  function getGameById(id) {
    for (var i = 0; i < GAMES.length; i++) if (GAMES[i].id === id) return GAMES[i];
    return GAMES[0];
  }

  /**
   * 生成一“本”奖券（本玩法口径）。
   * ------------------------------------------------------------------
   * 1. 每本随机取一个内部基准 G（即本内实付奖金总额，约为一本总价的 30%～48%，
   *    平均约 40%，对应保底区间的整数向下取整到 10 元），全程不向玩家展示；
   * 2. 把 G 按“现有标准奖级权重”拆成若干注：
   *    - 注数 M 由 G 与官方平均单注奖金（奖池返奖 ÷ 中奖张数）推导；
   *    - 逐注从表内金额中按官方权重配额抽取，并预留尾部注额 ≥ 面值，
   *      使 Σ注额 = G 精确成立；
   * 3. 注随机落到编号连续的一本中（票号顺序不变，中奖位置乱序），其余票为未中奖票；
   * 4. 中奖票把注额按奖级表金额拆成 1~3 个刮开区；「囷」格的印制值为该格金额的一半
   *    （兑奖按该图符下方奖金的两倍，即与印制拆分自洽）。
   * 整本实付总额 = G，恒 ≥ 保底基准 × 90%，故天然合格；
   * 单本返奖率 = G / 一本总价 ∈ 约 [30%, 48%]，均值约 40%。
   * （若配额意外异常则整体重新生成，最多 24 次——防御分支。）
   * 返回 book：{ gameId, no, baseNo, price, bookSize, sales, guarantee,
   *             tickets, total, qualified, attempts, opened, openedWin }
   */
  function generateBook(gameId, no) {
    var game = getGameById(gameId);
    var guarantee = 10 * randInt(Math.floor(game.guaranteeLow / 10), Math.floor(game.guaranteeHigh / 10));
    var baseNo = randInt(100000, 999999);
    var attempts = 0;
    var res = null;

    for (; attempts <= 24; attempts++) {
      res = buildQuotaBook(game, guarantee, baseNo);
      if (res.notes > 0 && res.notes <= game.bookSize && res.total >= guarantee * 0.9) break;
    }

    var openedWin = 0;
    var opened = 0;
    res.tickets.forEach(function (t) { if (t.done) { opened++; openedWin += t.win; } });
    return {
      gameId: game.id,
      no: no || 1,
      baseNo: baseNo,
      price: game.price,
      bookSize: game.bookSize,
      sales: game.sales,
      guarantee: guarantee,
      tickets: res.tickets,
      total: res.total,
      qualified: res.total >= guarantee * 0.9,
      attempts: attempts,
      opened: opened,
      openedWin: openedWin
    };
  }

  /**
   * 把本配额 G 拆成若干注金额：
   * M ≈ G ÷ 官方平均单注奖金；每步在表内金额 [面值, remaining-尾部预留] 中按官方权重抽，
   * 保证“注数 = M、每注 ≥ 面值、Σ注额 = G”。
   */
  function allocateNotes(game, guarantee) {
    var price = game.price;
    var avgCond = game._prizeSum / game._totalWinners; // 官方平均单注奖金（口径：池返奖 ÷ 中奖张数）
    var M = Math.min(Math.floor(guarantee / price), Math.max(1, Math.round(guarantee / avgCond)));
    var notes = [];
    var remaining = guarantee;
    for (var k = 0; k < M; k++) {
      var stepsLeft = M - k;
      if (stepsLeft === 1) { notes.push(remaining); remaining = 0; break; }
      var aMax = remaining - (stepsLeft - 1) * price; // 尾部每注至少留一个面值
      var cand = [];
      var wsum = 0;
      for (var i = 0; i < game.prizes.length; i++) {
        var v = game.prizes[i];
        if (v >= price && v <= aMax) {
          cand.push({ v: v, w: game.counts[i] });
          wsum += game.counts[i];
        }
      }
      if (!cand.length) { notes.push(remaining); remaining = 0; break; }
      var r = Math.random() * wsum;
      var acc = 0;
      var chosen = cand[0].v;
      for (i = 0; i < cand.length; i++) {
        acc += cand[i].w;
        if (r < acc) { chosen = cand[i].v; break; }
      }
      notes.push(chosen);
      remaining -= chosen;
    }
    return notes;
  }

  function levelIndexAtMost(game, amount) {
    for (var i = game.prizes.length - 1; i >= 0; i--) {
      if (game.prizes[i] <= amount) return i;
    }
    return game.prizes.length - 1;
  }

  /**
   * 按配额构造一本（票号连续、中奖位置乱序）。
   * parts 为“实付拆分”（Σ parts = win）；doubles[k]=true 表示该格以「囷」呈现，
   * 其印制值 = parts[k]/2（兑奖按两倍，与规则文案自洽）。
   */
  function buildQuotaBook(game, guarantee, baseNo) {
    var notes = allocateNotes(game, guarantee);
    var winPos = samplePositions(game.bookSize, notes.length);
    var tickets = [];
    for (var i = 0; i < game.bookSize; i++) {
      var posIdx = winPos.indexOf(i);
      var note = posIdx >= 0 ? notes[posIdx] : 0;
      var ticket;
      if (note > 0) {
        var parts = splitPrize(game, note);
        var nominal = 0;
        var doubles = parts.map(function (p) {
          var dbl = p % 2 === 0 && game.prizes.indexOf(p / 2) >= 0 && Math.random() < 0.35;
          nominal += dbl ? p / 2 : p;
          return dbl;
        });
        ticket = {
          no: i + 1,
          fullNo: baseNo + i + 1,
          level: levelIndexAtMost(game, note),
          nominal: nominal,
          win: note,
          parts: parts,
          doubles: doubles,
          done: false
        };
      } else {
        ticket = {
          no: i + 1,
          fullNo: baseNo + i + 1,
          level: -1,
          nominal: 0,
          win: 0,
          parts: [],
          doubles: [],
          done: false
        };
      }
      tickets.push(ticket);
    }
    return { tickets: tickets, total: guarantee, notes: notes.length };
  }

  /**
   * 从整本票记录重建票面刮开区（渲染/恢复时使用，结果确定）。
   * 语义：xi 格 print=amount=part；shuang 格 print=part/2、amount=part（两倍兑付）。
   */
  function ticketCells(game, t) {
    var cells = [];
    var parts = (t && t.parts) || [];
    var doubles = (t && t.doubles) || [];
    var i, p = 0;
    if (!parts.length) {
      for (i = 0; i < game.chances; i++) {
        cells.push({ type: 'none', print: pick(game._lowPool), amount: 0 });
      }
      return cells;
    }
    var pos = samplePositions(game.chances, parts.length);
    for (i = 0; i < game.chances; i++) {
      if (p < pos.length && pos[p] === i) {
        var v = parts[p];
        var dbl = doubles[p];
        cells.push(dbl
          ? { type: 'shuang', print: v / 2, amount: v }
          : { type: 'xi', print: v, amount: v });
        p++;
      } else {
        cells.push({ type: 'none', print: pick(game._lowPool), amount: 0 });
      }
    }
    return cells;
  }

  /** 整本模拟：统计“整本达标率 / 平均返奖 / 单张中奖面”，用于概率验证面板 */
  function simulateBooks(gameId, times) {
    var qualified = 0;
    var totalWin = 0;
    var hits = 0;
    var regen = 0;
    var maxTotal = 0;
    var book = null;
    for (var i = 0; i < times; i++) {
      book = generateBook(gameId, i + 1);
      totalWin += book.total;
      book.tickets.forEach(function (t) { if (t.win > 0) hits++; });
      if (book.qualified) qualified++;
      regen += book.attempts;
      if (book.total > maxTotal) maxTotal = book.total;
    }
    var bookSales = book.sales;
    return {
      times: times,
      qualified: qualified,
      qualifyRate: qualified / times,
      avgBookWin: totalWin / times,
      // 整本玩法口径：实付返奖率（平均约一本总价 40%，即保底配额）
      avgRtp: totalWin / (times * bookSales),
      // 单张中奖面：本内实际有奖张数占比
      avgHitRate: hits / (times * book.bookSize),
      avgRegen: regen / times,
      maxBookWin: maxTotal
    };
  }

  /**
   * 纯概率模拟：不做票面拆分，用于验证中奖面与返奖率
   * 返回 { times, hits, hitRate, prize, rtp, levelHits }
   */
  function simulate(game, times) {
    var hits = 0;
    var prize = 0;
    var levelHits = new Array(game.prizes.length).fill(0);
    for (var i = 0; i < times; i++) {
      if (Math.random() < game.winRate) {
        var lv = pickLevel(game, false);
        hits++;
        prize += game.prizes[lv];
        levelHits[lv]++;
      }
    }
    return {
      times: times,
      hits: hits,
      hitRate: hits / times,
      prize: prize,
      rtp: prize / (times * game.price),
      levelHits: levelHits
    };
  }

  var CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  function levelName(i) {
    return (CN[i] || (i + 1)) + '等奖';
  }

  function money(n) {
    return n.toLocaleString('zh-CN');
  }

  function ratioText(count) {
    if (!count) return '—';
    var r = POOL_SIZE / count;
    if (r >= 10000) return '1 / ' + (Math.round(r / 1000) / 10) + ' 万';
    if (r >= 100) return '1 / ' + Math.round(r);
    return '1 / ' + r.toFixed(1);
  }

  global.XIFENG = {
    POOL_SIZE: POOL_SIZE,
    games: GAMES,
    _boost: false,
    getGame: function (id) {
      for (var i = 0; i < GAMES.length; i++) if (GAMES[i].id === id) return GAMES[i];
      return GAMES[0];
    },
    drawTicket: drawTicket,
    simulate: simulate,
    generateBook: generateBook,
    simulateBooks: simulateBooks,
    ticketCells: ticketCells,
    levelName: levelName,
    money: money,
    ratioText: ratioText,
    numToPinyin: numToPinyin
  };
})(window);
