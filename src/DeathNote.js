/*
 * @Author: renxia
 * @Date: 2024-02-19 19:23:02
 * @LastEditors: renxia
 * @LastEditTime: 2024-05-23 09:21:41
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
    getCacheUid: ({ cookieObj }) => ({ uid: cookieObj.userId || '_', data: `${cookieObj.token}#${cookieObj.uuid}` }),
    handler: ({ cacheData }) => ({ envConfig: { value: cacheData.map(d => d.data).join('\n') } }),
  },
  {
    on: 'req-header',
    ruleId: 'TxStockCookie',
    desc: '腾讯自选股-单账号',
    tip: '先打开微信公众号，进福利中心，再打开APP，进个人中心',
    url: 'https://*.tenpay.com/cgi-bin/**',
    method: '*',
    data: {},
    handler({ url, cookieObj, X }) {
      const obj = Object.assign(X.FeUtils.getUrlParams(url), cookieObj);
      const keys = ['openid', 'fskey', 'wzq_qlskey', 'wzq_qluin'];
      keys.forEach(key => {
        if (obj[key]) {
          if (!this.data[key]) console.log(`【腾讯自选股】已获取${key}: ${obj[key]}`);
          this.data[key] = obj[key];
        }
      });
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
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
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

    handler: ({ cacheData: D }) => {
      const value = D.map(d => d.data).join('\n');
      return {
        envConfig: [
          { value, ruleId: 'SFSY' },
          { value, ruleId: 'sfsyUrl' },
        ],
      };
    },
  },
  {
    on: 'req-header',
    ruleId: 'xclxCookie',
    desc: '携程旅行',
    url: 'https://*m.ctrip.com/restapi/**',
    getCacheUid({ cookieObj: C }) {
      if (C.cticket) return { uid: C.login_uid, data: C.cticket };
    },
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
  },
  {
    on: 'res-body',
    ruleId: 'tyqhCookie',
    desc: '统一茄皇三期', // 微信小程序: 统一快乐星球 -> 活动 -> 统一茄皇三期，点进页面即可
    url: 'https://qiehuang-apig.xiaoyisz.com/qiehuangsecond/ga/**',
    method: '*',
    cache: {
      tmp: {}, // 临时缓存，获取到 userId 后合并
    },
    getCacheUid({ reqBody, resBody }) {
      if (reqBody?.thirdId && reqBody.wid) this.cache = reqBody;

      if (resBody?.data?.userId && this.cache.thirdId) {
        const D = this.cache;
        this.cache = {};
        return { uid: resBody.data.userId, data: `${D.thirdId}#${D.wid}#${resBody.data.userId}` };
      }
    },
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
    updateEnvValue: /#(\d+)$/,
  },
  {
    on: 'res-body',
    ruleId: 'bwcjCookie',
    desc: '霸王茶姬小程序签到',
    url: 'https://webapi.qmai.cn/web/seller/oauth/flash-sale-login',
    method: 'post',
    getCacheUid: ({ resBody }) => {
      const uid = resBody?.data?.user?.id;
      if (uid) return { uid, data: `${resBody.data.token}` }; // #${uid}
    },
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
  },
  {
    on: 'res-body',
    ruleId: 'blackJSON',
    desc: '全球购骑士特权签到',
    url: 'https://{vip-member,pyp-api}.chuxingyouhui.com/{api,vip-member}/**',
    method: 'get',
    getCacheUid: ({ resBody, headers: H }) => {
      const uid = resBody?.data?.userId || resBody?.data?.userPointsResp?.userId;
      if (uid && H['black-token']) {
        const data = { 'black-token': H['black-token'], token: H.token, 'User-Agent': H['user-agent'], userId: uid };
        return { uid, data: JSON.stringify(data) };
      }
    },
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
    updateEnvValue: /"userId":(\d+)/,
  },
  {
    on: 'res-body',
    ruleId: 'jlzx',
    desc: '江铃智行小程序签到',
    url: 'https://superapp.jmc.com.cn/jmc-zx-app-owner/v1/user/userCenter',
    method: 'get',
    getCacheUid: ({ resBody: B, headers: H }) => ({ uid: B?.data.nickName, data: H['access-token'] }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
  },
  {
    on: 'req-header',
    ruleId: 'paopaomate',
    desc: '微信小程序泡泡玛特',
    method: 'get',
    url: 'https://popvip.paquapp.com/miniapp/v2/wechat/getUserInfo/?user_id=*',
    getCacheUid({ url, X, headers }) {
      const p = X.FeUtils.getUrlParams(url);
      const uid = p.user_id;
      const openid = headers.identity_code || p.openid;
      if (uid && openid) return { uid, data: `${uid}#${openid}` };
    },
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
  },
  {
    on: 'req-header',
    ruleId: 'hqcsh',
    desc: '好汽车生活-微信小程序',
    method: '*',
    url: 'https://channel.cheryfs.cn/archer/activity-api/**',
    getCacheUid: ({ headers }) => headers.accountid,
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.uid).join('\n') } }),
  },
  {
    on: 'req-header',
    ruleId: 'fenxiang',
    desc: '粉象生活App',
    url: 'https://*api.fenxianglife.com/**',
    getCacheUid: ({ headers: H }) => ({ uid: H.finger, data: `${H.did}#${H.finger}#${H.token}#${H.oaid || ''}` }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
  },
  {
    on: 'req-header',
    ruleId: 'lenovoAccessToken',
    desc: '联想App',
    url: 'https://mmembership.lenovo.com.cn/member*/**',
    getCacheUid: ({ headers: H, url }) => {
      // console.log(H.lenovoid, url, H.accesstoken);
      return { uid: H.lenovoid, data: `${H.accesstoken}#${H.lenovoid}` };
    },
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
    updateEnvValue: /#(\d+)$/i,
  },
];
