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
      rtp: 0.65
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
      rtp: 0.65
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
      rtp: 0.65
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
    // 概率提升模式：放大一等奖、二等奖中奖张数（仅影响 drawTicket 抽奖级）
    var bc = game.counts.slice();
    if (bc.length > 1) { bc[0] *= 30; bc[1] *= 30; }
    var bsum = 0, bcum = [];
    for (var j = 0; j < bc.length; j++) { bsum += bc[j]; bcum.push(bsum); }
    game._boostCum = bcum;
    game._boostTotal = bsum;
    return game;
  }

  GAMES.forEach(buildIndex);

  /** 按权重抽出一个奖级下标（boost=true 时使用放大后的一/二等奖权重） */
  function pickLevel(game, boost) {
    var cum = boost ? game._boostCum : game._cum;
    var total = boost ? game._boostTotal : game._totalWinners;
    var r = Math.random() * total;
    for (var i = 0; i < cum.length; i++) {
      if (r < cum[i]) return i;
    }
    return cum.length - 1;
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
  function drawTicket(game) {
    var cells = [];
    var i;
    var useBoost = !!global.XIFENG._boost;

    if (Math.random() >= game.winRate) {
      for (i = 0; i < game.chances; i++) {
        cells.push({ type: 'none', print: pick(game._lowPool), amount: 0 });
      }
      return { win: false, total: 0, level: -1, cells: cells };
    }

    var level = pickLevel(game, useBoost);
    var total = game.prizes[level];
    var parts = splitPrize(game, total);
    var pos = samplePositions(game.chances, parts.length);

    // 「囍」= 印制金额翻倍：实得为该格印制金额的 2 倍（修复原未翻倍问题）
    var totalAmount = 0;
    var winCells = parts.map(function (v) {
      if (v >= 10 && Math.random() < 0.3) {
        totalAmount += v * 2;
        return { type: 'shuang', print: v, amount: v * 2 };
      }
      totalAmount += v;
      return { type: 'xi', print: v, amount: v };
    });

    var p = 0;
    for (i = 0; i < game.chances; i++) {
      if (p < pos.length && pos[p] === i) {
        cells.push(winCells[p]);
        p++;
      } else {
        cells.push({ type: 'none', print: pick(game._lowPool), amount: 0 });
      }
    }

    return { win: true, total: totalAmount, level: level, cells: cells };
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
    levelName: levelName,
    money: money,
    ratioText: ratioText,
    numToPinyin: numToPinyin
  };
})(window);
