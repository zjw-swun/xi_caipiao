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
 *            10元票 11 个奖级 / 10 次中奖机会（2 行 5 列）、
 *            20元票 10 个奖级 / 25 次（5 行 5 列）、
 *            30元票 12 个奖级 / 40 次（8 行 5 列）、
 *            50元票 11 个奖级 / 55 次（玩法区 10 行 5 列 + 好运区 1 行 5 列）。
 *
 * 【各奖级中奖张数】官方仅公布奖级金额与整体中奖面，未逐档公布中奖注数。
 *   此处按每 1,000,000 张设奖池，联立两个官方约束反推：
 *       Σ counts            = 中奖面 × 1,000,000
 *       Σ (counts × prize)  = 面值 × 1,000,000 × 65%
 *   高奖级张数参考同系列常见设奖结构，最低两档由方程精确求解，
 *   因此模拟结果与官方公布的「中奖面 31.91%」「返奖率 65%」完全一致。
 *
 * 【整本（“本”的口径）】整本只是票的组织与派奖单位，不改变上述单张概率设定：
 *   每本返奖率 R = 本内实付 ÷ 一本总价，满足三条宏观/微观约束——
 *     1. 保底：R 恒 ≥ 50%（任何一本都不会低于半额）；
 *     2. 宏观：大基数下 E[R] = 65%（卖家留存 35%）；
 *     3. 微观：R 带右尾，约 5% 的本 > 100%（买家整本赚钱），
 *        并以官方头奖中奖面（每百万张 counts[0] 张）让极稀有的本开出满额大奖。
 *   中奖注数由官方平均单注奖金（奖池返奖 ÷ 中奖张数）自然推出，
 *   因此本内中奖面同样收敛到官方的 31.91%。
 */
(function (global) {
  'use strict';

  var POOL_SIZE = 1000000;

  // 整本返奖率 R = 一本实付 ÷ 一本总价的分布参数（宏观卖家收益 35%，个别买家仍能赚到钱）
  var BOOK_RTP_FLOOR = 0.5;    // 每本保底：任何一本都 ≥ 50%
  var BOOK_RTP_TARGET = 0.65;  // 大基数下的整体平均返奖率（= 官方返奖率口径）
  // 非头奖本的超额部分（R - 50%）分段均匀分布：主体落在 50%~62%，右尾可超 100%
  var BOOK_TAIL = [
    { p: 0.80, lo: 0.00, hi: 0.12 },   // 常态本：50% ~ 62%
    { p: 0.15, lo: 0.12, hi: 0.40 },   // 偏旺本：62% ~ 90%
    { p: 0.04, lo: 0.40, hi: 0.95 },   // 旺本：90% ~ 145%（部分超过 100%）
    { p: 0.01, lo: 0.95, hi: 1.90 }    // 大奖本：145% ~ 240%
  ];
  var BOOK_TAIL_EXCESS = BOOK_TAIL.reduce(function (a, s) {
    return a + s.p * (s.lo + s.hi) / 2;
  }, 0);

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
      // 整本玩法：一本 N 张、总价 N×面值；每本配额 = 一本总价 × [50%, 80%] 随机
      bookSize: 50,
      bookRtpFloor: BOOK_RTP_FLOOR,
      bookRtpTarget: BOOK_RTP_TARGET
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
      bookRtpFloor: BOOK_RTP_FLOOR,
      bookRtpTarget: BOOK_RTP_TARGET
    },
    {
      id: 'xf30',
      name: '喜相逢30元',
      price: 30,
      chances: 40,   // 8 行 5 列
      cols: 5,
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
      bookRtpFloor: BOOK_RTP_FLOOR,
      bookRtpTarget: BOOK_RTP_TARGET
    },
    {
      id: 'xf50',
      name: '喜相逢50元',
      price: 50,
      chances: 50,   // 玩法区 10 行 5 列
      cols: 5,
      // 玩法区二（好运区）：顶部 1 行 5 列，五个单元固定为「吉祥 / 快乐 / 如意 / 幸运 / 平安」，
      // 刮出奖金金额即中奖（与玩法区奖金兼中兼得），合计 55 次中奖机会。
      bonus: {
        cols: 5,
        labels: ['吉祥', '快乐', '如意', '幸运', '平安']
      },
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
      bookSize: 20,
      bookRtpFloor: BOOK_RTP_FLOOR,
      bookRtpTarget: BOOK_RTP_TARGET
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
    // 票面结构派生值：主玩法区行数、好运区格数、总中奖机会次数
    game.rows = Math.max(1, Math.round(game.chances / game.cols));
    game.bonusCells = game.bonus ? game.bonus.cols : 0;
    game.totalChances = game.chances + game.bonusCells;
    // 整本玩法派生值：一本总价 + 整本返奖分布（保底 50%，均值 65%，右尾含大奖）
    game.sales = game.price * game.bookSize;
    game.bookRtpFloor = game.bookRtpFloor || BOOK_RTP_FLOOR;
    game.bookRtpTarget = game.bookRtpTarget || BOOK_RTP_TARGET;
    game.guaranteeLow = Math.round(game.sales * game.bookRtpFloor / 10) * 10;
    // 一本开出满额大奖的概率：沿用官方头奖中奖面（每百万张 counts[0] 张）
    game.jackpotP = Math.min(0.002, game.bookSize * game.counts[0] / POOL_SIZE);
    game.jackpotRtp = game.bookRtpFloor + game.prizes[0] / game.sales;
    // 非头奖本以 65% 为均值（右尾折算成缩放系数）；头奖本为稀有附加，整体均值略高于 65%，
    // 卖家整体仍留存约 34% 收益，同时个别买家可中得满额大奖。
    game.tailScale = Math.max(0.05, (game.bookRtpTarget - game.bookRtpFloor) / BOOK_TAIL_EXCESS);
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
    var zones = [];
    var doubles = parts.map(function (v) {
      var toBonus = !!(game.bonus && Math.random() < 0.25);
      var dbl = !toBonus && v >= 10 && Math.random() < 0.3;
      zones.push(toBonus ? 'bonus' : 'main');
      if (dbl) totalAmount += v * 2;
      else totalAmount += v;
      return dbl;
    });
    return {
      win: true, level: level, nominal: nominal, total: totalAmount,
      parts: parts, zones: zones, doubles: doubles
    };
  }

  /**
   * 把一张票的“数值计划”铺到票面刮开区（中奖格随机散落 + 空位底纹金额）。
   */
  function buildTicketCells(game, plan) {
    if (!plan || !plan.win) {
      var blank = [];
      for (var i = 0; i < game.chances; i++) {
        blank.push({ type: 'none', print: pick(game._lowPool), amount: 0 });
      }
      return blank;
    }
    var t = {
      parts: plan.parts,
      zones: plan.zones || plan.parts.map(function () { return 'main'; }),
      doubles: plan.doubles
    };
    layoutTicket(game, t);
    return ticketCells(game, t);
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
   * 抽一本的返奖率 R（= 本内实付 ÷ 一本总价）。
   *   · 保底：R ≥ 50%
   *   · 宏观：E[R] = 65%（右尾的期望由 tailScale 精确折算）
   *   · 微观：约 5% 的本 R > 100%；以官方头奖中奖面落本的，该本含满额大奖
   */
  function drawBookRtp(game) {
    if (Math.random() < game.jackpotP) {
      return { rtp: game.jackpotRtp, jackpot: true };
    }
    var r = Math.random(), acc = 0, i, s;
    for (i = 0; i < BOOK_TAIL.length; i++) {
      s = BOOK_TAIL[i];
      acc += s.p;
      if (r < acc) {
        return { rtp: game.bookRtpFloor + (s.lo + Math.random() * (s.hi - s.lo)) * game.tailScale, jackpot: false };
      }
    }
    s = BOOK_TAIL[BOOK_TAIL.length - 1];
    return { rtp: game.bookRtpFloor + s.hi * game.tailScale, jackpot: false };
  }

  /**
   * 生成一“本”奖券（本玩法口径）。
   * ------------------------------------------------------------------
   * 0. 「本」不改变单张概率设定：返奖率 65%、中奖面 31.91% 仍由上面的奖级表确定，
   *    整本只是把这套设定按“本”组织与派奖。
   * 1. 每本先抽返奖率 R（见 drawBookRtp），得到内部配额 G = R × 一本总价（取整到 10 元），
   *    并恒不低于保底额（一本总价 × 50%），全程不向玩家展示；
   * 2. 把 G 按“现有标准奖级权重”拆成若干注：
   *    - 注数 M 由 G 与官方平均单注奖金（奖池返奖 ÷ 中奖张数）推导，且不超过一本张数，
   *      因此本内中奖面自然收敛到官方的 31.91%（返奖越高的本，中奖张数越多）；
   *    - 逐注从表内金额中按官方权重配额抽取，并预留尾部注额 ≥ 面值，使 Σ注额 = G 精确成立；
   *    - 含满额大奖的本：头奖独占一注，其余按保底配额拆到剩余票上。
   * 3. 注随机落到编号连续的一本中（票号顺序不变，中奖位置乱序），其余票为未中奖票；
   * 4. 中奖票把注额按奖级表金额拆成 1~3 个刮开区；「囷」格的印制值为该格金额的一半
   *    （兑奖按该图符下方奖金的两倍，即与印制拆分自洽）；
   *    50 元票的注额还可能落到顶部「好运区」（刮出金额即中奖，无翻倍）。
   * 整本实付总额 = G，恒 ≥ 一本总价 × 50%，故天然合格；
   * （若配额意外异常则整体重新生成，最多 24 次——防御分支。）
   * 返回 book：{ gameId, no, baseNo, price, bookSize, sales, guarantee, floor,
   *             jackpot, tickets, total, qualified, attempts, opened, openedWin }
   */
  function generateBook(gameId, no) {
    var game = getGameById(gameId);
    var baseNo = randInt(100000, 999999);
    var attempts = 0;
    var res = null;
    var draw = null;
    var guarantee = 0;

    for (; attempts <= 24; attempts++) {
      draw = drawBookRtp(game);
      guarantee = Math.max(game.guaranteeLow, Math.round(draw.rtp * game.sales / 10) * 10);
      res = buildQuotaBook(game, guarantee, draw.jackpot, baseNo);
      if (res.notes > 0 && res.notes <= game.bookSize && res.total >= game.guaranteeLow) break;
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
      // 每本保底（一本总价 × 50%）：整本实付恒不低于此值
      floor: game.guaranteeLow,
      jackpot: !!(draw && draw.jackpot),
      tickets: res.tickets,
      total: res.total,
      qualified: res.total >= game.guaranteeLow,
      attempts: attempts,
      opened: opened,
      openedWin: openedWin
    };
  }

  /**
   * 把本配额 G 拆成若干注金额：
   * M ≈ G ÷ 官方平均单注奖金，且不超过 maxNotes（一本张数）；
   * 每步在表内金额 [面值, remaining-尾部预留] 中按官方权重抽，
   * 保证“注数 = M、每注 ≥ 面值、Σ注额 = G”。
   * jackpot=true 时头奖独占一注，其余配额拆到剩余票上。
   */
  function allocateNotes(game, guarantee, maxNotes, jackpot) {
    if (jackpot) {
      var top = game.prizes[0];
      var rest = Math.max(game.price, guarantee - top);
      return [top].concat(allocateNotes(game, rest, Math.max(1, maxNotes - 1), false));
    }
    var price = game.price;
    var avgCond = game._prizeSum / game._totalWinners; // 官方平均单注奖金（口径：池返奖 ÷ 中奖张数）
    var M = Math.max(1, Math.round(guarantee / avgCond));
    M = Math.min(M, Math.floor(guarantee / price), maxNotes);
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
   * 构造一本中的一张票（含票面格位布局）。
   *   win    : 该张实付奖金（Σ parts）
   *   parts  : 每注拆成的刮开区金额，Σ parts = win
   *   zones  : 与 parts 一一对应，'main' 落玩法区、'bonus' 落好运区（仅 50 元票）
   *   doubles: 该格是否以「囷」呈现（印制值 = part/2，兑奖按两倍）
   *   pos/bpos/prints：格位布局（生成时固定，刷新页面后重绘结果一致）
   */
  function makeBookTicket(game, no, fullNo, note) {
    var t = {
      no: no,
      fullNo: fullNo,
      level: -1,
      nominal: 0,
      win: 0,
      parts: [],
      zones: [],
      doubles: [],
      done: false
    };
    if (note > 0) {
      var parts = splitPrize(game, note);
      var nominal = 0;
      var zones = [];
      var doubles = parts.map(function (p) {
        // 好运区（50 元票顶部 1×5）：刮出金额即中奖，不参与「囷」翻倍
        var toBonus = !!(game.bonus && Math.random() < 0.25);
        var dbl = !toBonus && p % 2 === 0 && game.prizes.indexOf(p / 2) >= 0 && Math.random() < 0.35;
        zones.push(toBonus ? 'bonus' : 'main');
        nominal += dbl ? p / 2 : p;
        return dbl;
      });
      t.level = levelIndexAtMost(game, note);
      t.nominal = nominal;
      t.win = note;
      t.parts = parts;
      t.zones = zones;
      t.doubles = doubles;
    }
    layoutTicket(game, t);
    return t;
  }

  /**
   * 生成并固化一张票的格位布局：中奖格位置与空白格的底纹金额。
   * 布局写入票对象，因此同一张票反复渲染（含刷新页面后恢复）结果完全一致。
   */
  function layoutTicket(game, t) {
    var zones = t.zones || [];
    var mainK = [], bonusK = [], k;
    for (k = 0; k < zones.length; k++) {
      (zones[k] === 'bonus' ? bonusK : mainK).push(k);
    }
    t.pos = samplePositions(game.chances, mainK.length);
    t.bpos = game.bonusCells ? samplePositions(game.bonusCells, bonusK.length) : [];
    t.prints = [];
    for (var i = 0; i < game.chances; i++) t.prints.push(pick(game._lowPool));
    return t;
  }

  /** 兼容旧数据：缺布局字段时补齐（不改变奖金，只补格位） */
  function ensureLayout(game, t) {
    if (!t.zones) {
      t.zones = (t.parts || []).map(function () { return 'main'; });
    }
    var mainK = [], bonusK = [], k;
    for (k = 0; k < t.zones.length; k++) {
      (t.zones[k] === 'bonus' ? bonusK : mainK).push(k);
    }
    if (!Array.isArray(t.pos) || t.pos.length !== mainK.length || t.pos.some(function (v) { return v >= game.chances; })) {
      t.pos = samplePositions(game.chances, mainK.length);
    }
    if (!Array.isArray(t.bpos) || t.bpos.length !== bonusK.length ||
        (game.bonusCells && t.bpos.some(function (v) { return v >= game.bonusCells; }))) {
      t.bpos = game.bonusCells ? samplePositions(game.bonusCells, bonusK.length) : [];
    }
    if (!Array.isArray(t.prints) || t.prints.length !== game.chances) {
      t.prints = [];
      for (var i = 0; i < game.chances; i++) t.prints.push(pick(game._lowPool));
    }
  }

  /**
   * 按配额构造一本（票号连续、中奖位置乱序）。
   * 整本实付总额 = guarantee（保底 50%，大基数均值 65%，右尾可超 100%）。
   */
  function buildQuotaBook(game, guarantee, jackpot, baseNo) {
    var notes = allocateNotes(game, guarantee, game.bookSize, jackpot);
    var winPos = samplePositions(game.bookSize, notes.length);
    var tickets = [];
    for (var i = 0; i < game.bookSize; i++) {
      var posIdx = winPos.indexOf(i);
      var note = posIdx >= 0 ? notes[posIdx] : 0;
      tickets.push(makeBookTicket(game, i + 1, baseNo + i + 1, note));
    }
    return { tickets: tickets, total: guarantee, notes: notes.length };
  }

  /**
   * 从整本票记录重建票面刮开区（渲染/恢复时使用，结果确定）。
   * 返回扁平数组：先玩法区（game.chances 格），再好运区（game.bonusCells 格，仅 50 元票）。
   * 语义：xi 格 print=amount=part；shuang 格 print=part/2、amount=part（按印制金额两倍兑付）。
   */
  function ticketCells(game, t) {
    if (!t) return [];
    if (!t.zones || !t.pos || !t.prints) ensureLayout(game, t);

    var parts = t.parts || [];
    var doubles = t.doubles || [];
    var mainK = [], bonusK = [], k;
    for (k = 0; k < parts.length; k++) {
      ((t.zones[k] === 'bonus') ? bonusK : mainK).push(k);
    }
    var cells = [];
    var i, mi, bi, kk;

    for (i = 0; i < game.chances; i++) {
      mi = t.pos.indexOf(i);
      if (mi >= 0) {
        kk = mainK[mi];
        var v = parts[kk];
        cells.push(doubles[kk]
          ? { type: 'shuang', print: v / 2, amount: v }
          : { type: 'xi', print: v, amount: v });
      } else {
        cells.push({ type: 'none', print: t.prints[i], amount: 0 });
      }
    }

    if (game.bonus) {
      for (i = 0; i < game.bonusCells; i++) {
        bi = t.bpos.indexOf(i);
        var label = game.bonus.labels[i];
        if (bi >= 0) {
          kk = bonusK[bi];
          cells.push({
            type: 'xi', print: parts[kk], amount: parts[kk],
            bonus: true, label: label
          });
        } else {
          cells.push({ type: 'none', print: 0, amount: 0, bonus: true, label: label });
        }
      }
    }
    return cells;
  }

  /**
   * 整本模拟：统计“整本保底达标率 / 平均返奖 / 单张中奖面 / 右尾分布”，用于概率验证面板。
   * 由于分布带重尾（含满额大奖本），均值需要较大基数才稳定，因此同时给出中位数与分位信息。
   */
  function simulateBooks(gameId, times) {
    var qualified = 0;
    var totalWin = 0;
    var hits = 0;
    var regen = 0;
    var over100 = 0;
    var jackpotBooks = 0;
    var maxTotal = 0;
    var minTotal = Infinity;
    var rtps = [];
    var book = null;
    for (var i = 0; i < times; i++) {
      book = generateBook(gameId, i + 1);
      totalWin += book.total;
      book.tickets.forEach(function (t) { if (t.win > 0) hits++; });
      if (book.qualified) qualified++;
      if (book.jackpot) jackpotBooks++;
      regen += book.attempts;
      if (book.total > maxTotal) maxTotal = book.total;
      if (book.total < minTotal) minTotal = book.total;
      rtps.push(book.total / book.sales);
    }
    rtps.sort(function (a, b) { return a - b; });
    var bookSales = book.sales;
    for (i = 0; i < rtps.length; i++) if (rtps[i] > 1) over100++;
    return {
      times: times,
      qualified: qualified,
      qualifyRate: qualified / times,
      avgBookWin: totalWin / times,
      // 整本玩法口径：实付返奖率（每本 ≥ 50% 保底，大基数均值 ≈ 65%）
      avgRtp: totalWin / (times * bookSales),
      minRtp: minTotal / bookSales,
      maxRtp: maxTotal / bookSales,
      medianRtp: rtps[Math.floor(rtps.length / 2)],
      over100Rate: over100 / times,
      jackpotBooks: jackpotBooks,
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
    BOOK_RTP_FLOOR: BOOK_RTP_FLOOR,
    BOOK_RTP_TARGET: BOOK_RTP_TARGET,
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
