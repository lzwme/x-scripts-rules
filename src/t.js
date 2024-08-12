/**
 * 用于临时测试的一些例子
 * @type {import('@lzwme/whistle.x-scripts').RuleItem[]}
 */
module.exports = [
  {
    on: 'req-header',
    ruleId: 'CITIC_COOKIE',
    desc: '中信银行签到',
    url: 'https://thbank.tianhongjijin.com.cn/api/hy/signArea/*',
    method: '*',
    getCacheUid: ({ cookieObj: C }) => C.current_user,
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.cookie}##${d.uid}`).join('\n') } }),
  },
  {
    on: 'res-body',
    ruleId: 'huangzuan_WX',
    desc: '媓钻_小程序签到',
    url: 'https://api.hzyxhfp.com/api/userRight/getUserRightDetail',
    method: 'post',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.data?.phone }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.filter(d => d.headers.authorization).map(d => `${d.headers.authorization.replace('Bearer ', '')}`).join('\n') } }),
    // updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'gmjkck',
    desc: '敢迈健康+_小程序签到',
    url: 'https://api.digital4danone.com.cn/healthyaging/danone/wx/ha/haUser/info',
    method: 'get',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.result?.userId }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers['x-access-token']}`).join('\n') } }),
    // updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'this',
    desc: 'this官方商城-小程序签到',
    url: 'https://xcx.this.cn/api/user',
    method: 'get',
    getCacheUid: ({ resBody: R, headers }) => headers['authori-zation'] && ({ uid: R?.data?.uid }),
    handler: ({ cacheData: D }) => ({
      envConfig: { value: D.map(d => `${d.headers['authori-zation'].replace('Bearer ', '')}`).join('\n'), sep: '\n' },
    }),
  },
  {
    on: 'req-body',
    ruleId: 'JDD',
    desc: '金杜丹-小程序签到-单账号',
    url: 'https://tianxin.jmd724.com/**',
    method: 'get',
    getCacheUid: ({ url, X }) => {
      const query = X.FeUtils.getUrlParams(url);
      if (query.access_token) return { uid: '_', data: query.access_token };
    },
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('@'), sep: '@' } }),
  },
  {
    on: 'res-body',
    ruleId: 'dqdd',
    desc: 'DQ点单-小程序签到-单账号',
    url: 'https://wechat.dairyqueen.com.cn/**',
    method: 'post',
    getCacheUid: ({ resBody: R }) => '_', // ({ uid: R?.data?.uid }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.headers.cookie).join('\n'), sep: '\n' } }),
  },
  {
    on: 'res-body',
    ruleId: 'LBDQ',
    desc: '老板电器服务微商城-小程序签到',
    url: 'https://vip.foxech.com/index.php/api/member/get_member_info',
    method: 'post',
    getCacheUid: ({ reqBody: Q, resBody: R }) => Q.openid && ({ uid: R?.data?.info?.nickname, data: `${Q.openid}@UID_${R?.data?.info?.nickname}` }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
    updateEnvValue: /@([\da-z]+)/i,
  },
];

