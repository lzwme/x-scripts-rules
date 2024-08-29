/**
 * 用于临时测试的一些例子
 * @type {import('@lzwme/whistle.x-scripts').RuleItem[]}
 */
module.exports = [
  {
    on: 'req-header',
    ruleId: 'LSXDS',
    desc: '乐事心动社-小程序',
    url: 'https://campuscrm.pepsico.com.cn/web/**/*memberId=*',
    method: 'get',
    getCacheUid: ({ headers, X, url }) => {
      if (headers.authorization) {
        const q = X.FeUtils.getUrlParams(url);
        return { uid: q.memberId };
      }
    },
    handler: ({ cacheData: D }) => ({
      envConfig: { value: D.map(d => `${d.headers.authorization.replace(/bearer /i, '')}@UID_${d.uid}`).join('&'), sep: '&' },
    }),
    updateEnvValue: /@UID_(\d+)/,
  },
  {
    on: 'res-body',
    ruleId: 'TBHYZX',
    desc: '特步会员中心-小程序',
    url: 'https://wxa-tp.ezrpro.com/myvip/Base/User/WxAppOnLoginNew',
    getCacheUid: ({ resBody: B }) => {
      if (B?.Result?.Fields) {
        const uid = B.Result.VipId;
        return { uid, data: `${B.Result.Fields}@UID_${uid}` };
      }
    },
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('&'), sep: '&' } }),
    updateEnvValue: /@UID_(\d+)/,
  },
  {
    on: 'res-body',
    ruleId: 'AMX',
    desc: '安慕希-小程序',
    url: 'https://wx-amxshop.msxapi.digitalyili.com/api/user/getUser',
    method: 'get',
    getCacheUid: ({ headers, resBody: B }) => {
      if (headers.accesstoken) {
        const uid = B?.data?.user?.id;
        return { uid, data: `${headers.accesstoken}@UID_${uid}` };
      }
    },
    handler: ({ cacheData: D }) => ({
      envConfig: { value: D.map(v => v.data).join('&'), sep: '&' },
    }),
    updateEnvValue: /@UID_(\d+)/,
  },
];
