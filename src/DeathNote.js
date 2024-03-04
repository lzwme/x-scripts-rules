/*
 * @Author: renxia
 * @Date: 2024-02-19 19:23:02
 * @LastEditors: renxia
 * @LastEditTime: 2024-03-06 15:35:11
 * @Description: https://github.com/leafTheFish/DeathNote
 */

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  {
    on: 'req-header',
    ruleId: 'meituanCookie',
    desc: '美团V3',
    method: 'POST',
    url: 'https://*.meituan.com*',
    // url: 'https://msp.meituan.com/api/**',
    getCacheUid: ({ cookieObj }) => ({ uid: cookieObj.userId, data: `${cookieObj.token}#${cookieObj.uuid}` }),
    handler: ({ allCacheData }) => ({ envConfig: { value: allCacheData.map(d => d.data).join('\n') } }),
  },
  {
    on: 'req-header',
    ruleId: 'TxStockCookie',
    desc: '腾讯自选股',
    tip: '先打开微信公众号，进福利中心，再打开APP，进个人中心',
    url: 'https://*.tenpay.com/cgi-bin/**',
    method: '*',
    data: {},
    handler({ url, cookieObj, X }) {
      const obj = Object.assign(X.FeUtils.getUrlParams(url), cookieObj);
      const keys = ['openid', 'fskey', 'wzq_qlskey', 'wzq_qluin'];
      keys.forEach(key => obj[key] && (this.data[key] = obj[key]));
      // console.log(obj, this.data);
      if (keys.every(key => this.data[key])) return { envConfig: { value: keys.map(key => `${key}=${this.data[key]}`).join('&') } };
    },
  },
  {
    on: 'req-header',
    ruleId: 'elmCookie',
    desc: '饿了么',
    url: 'https://*.ele.me/h5/**',
    getCacheUid: ({ cookieObj: ck }) => ({ uid: ck.user_id, data: `SID=${ck.SID};cookie2=${ck.cookie2};grabCoupon=1` }),
    handler({ allCacheData }) {
      return { envConfig: { value: allCacheData.map(d => d.data).join('\n') } };
    }
  },
  {
    on: 'req-header',
    ruleId: 'sfsyUrl',
    desc: '顺丰速运',
    method: 'get',
    url: 'https://mcs-mimp-web.sf-express.com/mcs-mimp/share/weChat/shareGiftReceiveRedirect?**',
    getCacheUid({ url, X }) {
      const p = X.FeUtils.getUrlParams(url);
      return { uid: p.mobile, data: url };
    },
    handler({ allCacheData: data }) {
      return { envConfig: { value: data.map(d => d.data).join('\n') } };
    }
  }
];
