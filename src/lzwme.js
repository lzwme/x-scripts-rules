/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  // https://raw.githubusercontent.com/leafTheFish/DeathNote/main/ddgy.js
  {
    on: 'res-body',
    ruleId: 'ylhyencryptsessionid',
    desc: '伊利会员福利社',
    method: '*',
    url: 'https://wx-fulishe.msx.digitalyili.com/brandwxa/api/vip/getinfo*',
    getCacheUid: ({ reqBody, resBody }) => {
      // console.log('reqBody', reqBody);
      const uid = resBody?.data?.uid || (reqBody?.encryptsessionid ? resBody?.result?.vipcode : '');
      if (uid) return { uid, data: `${reqBody.encryptsessionid}##${uid}` };
    },
    handler: ({ cacheData }) => ({
      envConfig: {
        value: cacheData
          .filter(d => typeof d.data === 'string')
          .map(d => `${d.data}`)
          .join('\n'),
      },
    }),
  },
  {
    on: 'res-body',
    ruleId: 'sysxc',
    desc: '书亦烧仙草',
    method: '*',
    url: 'https://scrm-prod.shuyi.org.cn/saas-gateway/api/mini-app/v1/{member/mine,account/login}**',
    getCacheUid: ({ resBody, headers, url }) => {
      const data = {
        uid: resBody?.data?.user?.uid || resBody?.data?.member?.uid,
        data: headers.auth || resBody?.data?.auth,
      };
      return data;
    },
    handler({ cacheData }) {
      const value = cacheData.filter(d => d.data).map(d => `${d.data}##${d.uid}`);
      return { envConfig: { value: value.join('\n') } };
    },
  },
  {
    on: 'res-body',
    ruleId: 'alyp',
    desc: '阿里云盘',
    url: 'https://auth.alipan.com/v2/account/token',
    getCacheUid: ({ resBody }) => ({ uid: resBody?.user_id, data: resBody?.refresh_token }),
    handler: ({ cacheData }) => ({ envConfig: { value: cacheData.map(d => `${d.data}##${d.uid}`).join('\n') } }),
  },
  {
    on: 'req-header',
    ruleId: 'IQIYI_COOKIE',
    desc: '爱奇艺签到',
    url: 'https://*.iqiyi.com/*/api/**',
    method: '*',
    getCacheUid: ({ cookieObj: ck }) => ({ uid: ck.P00003, data: `P00003=${ck.P00003};P00001=${ck.P00001}` }),
    handler: ({ cacheData }) => ({ envConfig: { value: cacheData.map(d => `${d.data}`).join('\n') } }),
    updateEnvValue: /P00003=[^;]+/,
  },
  {
    on: 'res-body',
    ruleId: 'xmly_cookie',
    desc: '喜马拉雅签到 cookie 获取',
    url: 'https://m.ximalaya.com/starwar/task/listen/serverTime',
    method: '*',
    getCacheUid: ({ headers, resBody }) => {
      const uid = resBody?.context?.currentUser.id;
      if (uid) return { uid, data: `${headers.cookie.replace(/ XD=[^;]+;/, '')}##${uid}` };
    },
    handler: ({ cacheData: d }) => ({ envConfig: { value: d.map(d => `${d.data}`).join('\n'), sep: '\n' } }),
    updateEnvValue: /##(\d+)/,
  },
  {
    disabled: true, // 脚本已废弃
    on: 'req-header',
    ruleId: 'dkl_token',
    desc: '迪卡侬签到-单账号',
    url: 'https://api-cn.decathlon.com.cn/**',
    method: '*',
    getCacheUid: () => 'default',
    handler: ({ headers }) => headers.authorization && { envConfig: { value: headers.authorization } },
  },
  {
    // 开代理时云闪付签到页面进不去；可以先关闭代理进入签到页面，再开代理后，随意点击签到页面的任意链接
    on: 'req-header',
    ruleId: 'ysfqd_data',
    desc: '云闪付签到-单账号',
    url: 'https://youhui.95516.com/newsign/**',
    method: '*',
    getCacheUid: () => 'default',
    handler: ({ headers }) => headers.authorization && { envConfig: { value: headers.authorization } },
  },
  {
    on: 'req-header',
    ruleId: 'ths_cookie',
    desc: '同花顺签到',
    url: 'https://eq.10jqka.com.cn/**',
    method: 'get',
    // getCacheUid: ({ cookieObj: C }) => C.userid,
    getCacheUid: ({ cookieObj: C }) => ({ uid: C.userid, data: `ticket=${C.ticket}; userid=${C.userid}; user=${C.user}` }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.data || d.headers.cookie}`).join('\n') } }),
  },
  {
    on: 'res-body',
    ruleId: 'JJCookie',
    desc: '掘金签到',
    url: 'https://api.juejin.cn/user_api/v1/user/get**',
    method: 'get',
    getCacheUid({ headers, resBody: B }) {
      const uid = B?.data?.user_id || B?.data?.user_basic?.user_id;
      if (uid && headers.cookie) return { uid };
    },
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.cookie}##${d.uid}`).join('\n') } }),
  },
  {
    ruleId: 'gujing',
    desc: '古井贡酒会员中心小程序',
    method: 'post',
    url: 'https://scrm.gujing.com/gujing_scrm/wxclient/login/info',
    on: 'req-body',
    getCacheUid: ({ reqBody: R }) => R?.memberId,
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers['access-token']}##${d.uid}`).join('\n') } }),
  },
  {
    on: 'res-body',
    ruleId: 'aima',
    desc: '爱玛会员俱乐部-小程序',
    url: 'https://scrm.aimatech.com/aima/wxclient/member/IndexInfo',
    method: 'get',
    getCacheUid: ({ resBody: R, headers }) => (headers['access-token'] ? { uid: R?.content?.id } : nulll),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers['access-token']}##${d.uid}`).join('\n') } }),
    // updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'mypd',
    desc: '漫游胖达-小程序',
    url: 'https://pw.gzych.vip/ykb_huiyuan/api/v2/MemberMine/BasicInfo',
    method: 'get',
    getCacheUid: ({ resBody: R, headers }) => (headers['authorization'] ? { uid: R?.Data?.CardNo } : nulll),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers['authorization']}##${d.uid}`).join('\n') } }),
    // updateEnvValue: /&([\d\*]+)/,
  },
];
