/*
 * @Author: renxia
 * @Date: 2024-02-06 11:25:49
 * @LastEditors: renxia
 * @LastEditTime: 2024-04-09 09:16:31
 * @Description:
 */

const pd_map = {
  8: '韩都严选',
  17: '极客农场与胡子叔的餐盘',
  47: '植观微信旗舰店',
  102: '榴芒一刻',
  347: '乒乓生活商城',
  379: '燕之坊五谷为养官方商城',
  816: '名后官方旗舰店',
  1220: '良品铺子官方商城', // 连续签到领优惠券
  1380: '幸福西饼',
  1579: '等蜂来天然蜂蜜旗舰店',
  1612: '新疆万科广场店',
  1631: '云南白药',
  1700: '中粮-健康生活甄选',
  2042: '物道生活',
  2426: '钟薛高旗舰店',
  2527: '米卡米卡蛋糕旗舰店',
  2728: '小香真精油旗舰店',
  2729: '相逢幸福 生日蛋糕 下午茶',
  3124: '东鹏特饮微店',
  3262: 'TOIs朵茜情调生活馆',
  3821: '乐汁商城-素食更健康',
  4345: '悦上美妆',
  4744: '环球嗨购精选',
  5054: '自然兰官方旗舰店',
  5998: '森马集团官方商城',
  7302: '暖家好物',
  8249: '贝因美贝家商城',
  8353: '润百颜护肤品商城',
  8449: '中国原产递优选',
  8887: '印趣严选',
  9332: '三只松鼠旗舰店',
  12307: 'colorkey珂拉琪旗舰店',
  13546: '广缘唐海曹妃甸店',
  13891: '潘达微信旗舰店',
  13904: '小茶婆婆旗舰店',
  13968: '圣牧有机官方商城',
  16453: 'PMPM',
  17273: '香气优选',
  17666: '爱依服商城-总店',
  18415: '得宝Tempo',
  22432: '一封情酥',
  1465878: '隅田川旗舰店',
  1479428: 'ffit8',
  1595664: '参半口腔护理',
  1597464: 'Xbox俱乐部',
  1876007: 'FLORTTE花洛莉亚',
  1903120: 'KIMTRUE且初',
  1985507: '肤漾FORYON',
  2050884: '伯喜线上商城',
  2081204: '果壳市集',
  2176467: 'chillmore且悠',
  2187565: '蜜蜂惊喜社',
  2299510: '燕京啤酒电商旗舰店',
  2386563: 'HBN品牌店',
  2646845: '海贽医疗科技',
  2692852: '老爹果园',
  2713880: '莱克旗舰店',
  2905214: '百事可乐',
  2910869: 'ficcecode菲诗蔻官方旗舰店',
  2923467: '红之旗舰店',
  3010256: '燕子约官方旗舰店',
  3014060: 'LAN蘭',
  3347128: '松鲜鲜官方旗舰店',
  3805112: '广州日报电商',
};

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  {
    on: 'res-body',
    ruleId: 'youzan_le_data',
    desc: '有赞小程序签到',
    url: ['https://h5.youzan.com/wscump/checkin/*', 'https://h5.youzan.com/{wscuser,wscdeco}/**'],
    method: '*',
    cache: {}, // app_id: { checkinId, uid }
    getCacheUid({ url, X, headers, resBody }) {
      let { app_id, checkinId, buyerId } = X.FeUtils.getUrlParams('?' + url.split('?')[1]);
      if (!app_id) app_id = /\/(wx.+)\//.exec(headers['referer'])?.[1];
      if (!app_id) return;

      const shopName = resBody?.data?.shopName || pd_map[checkinId] || '';
      if (!this.cache[app_id]) this.cache[app_id] = {};
      if (checkinId) this.cache[app_id].checkinId = checkinId;
      if (+buyerId) this.cache[app_id].uid = buyerId;
      if (shopName) this.cache[app_id].shopName = shopName;

      if (headers['extra-data']?.startsWith('{')) {
        const { checkinId, uid, shopName = '' } = this.cache[app_id];
        if (checkinId && uid) {
          const edata = JSON.parse(headers['extra-data']);
          const sessionId = edata.sid;
          console.log(`'${checkinId}': '${shopName}',`, uid, sessionId);

          if (shopName && !pd_map[checkinId]) {
            pd_map[checkinId] = shopName;
            console.log(pd_map);
          }

          if (sessionId) {
            return { uid: `${checkinId}_${uid}`, data: `${checkinId}:${sessionId}##${uid}_${checkinId}${shopName ? `_${shopName}` : ''}` };
          }
        }
      }
    },
    handler: ({ allCacheData: d }) => ({ envConfig: { value: d.map(d => `${d.data}`).join('\n') } }),
    updateEnvValue: /##\d+_\d+/,
  },
];
