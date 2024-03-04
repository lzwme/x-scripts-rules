/*
 * @Author: renxia
 * @Date: 2024-02-06 11:25:49
 * @LastEditors: renxia
 * @LastEditTime: 2024-03-18 09:45:24
 * @Description:
 */
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
      return { uid: reqBody?.encryptsessionid && resBody?.result?.vipcode, data: { reqBody, uid: resBody?.data?.uid } };
    },
    handler({ allCacheData }) {
      const value = allCacheData.map(({ data: d }) => `${d.reqBody.encryptsessionid}##${d.uid}`).join('\n');
      if (value) return { envConfig: [{ name: this.ruleId, value }] };
    },
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
    handler({ allCacheData }) {
      const value = allCacheData.filter(d => d.data).map(d => `${d.data}##${d.uid}`);
      return { envConfig: { value: value.join('\n') } };
    },
  },
  {
    on: 'res-body',
    ruleId: 'alyp',
    desc: '阿里云盘',
    url: 'https://auth.alipan.com/v2/account/token',
    getCacheUid: ({ resBody }) => ({ uid: resBody?.user_id, data: resBody?.refresh_token }),
    handler: ({ allCacheData }) => ({ envConfig: { value: allCacheData.map(d => `${d.data}##${d.uid}`).join('\n') } }),
  },
  {
    on: 'req-header',
    ruleId: 'IQIYI_COOKIE',
    desc: '爱奇艺签到',
    url: 'https://*.iqiyi.com/*/api/**',
    method: '*',
    getCacheUid: ({ cookieObj: ck }) => ({ uid: ck.P00003, data: `P00003=${ck.P00003};P00001=${ck.P00001}` }),
    handler: ({ allCacheData }) => ({ envConfig: { value: allCacheData.map(d => `${d.data}`).join('\n') } }),
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
      if (uid) return ({ uid, data: `${headers.cookie.replace(/ XD=[^;]+;/, '')}##${uid}` });
    },
    handler: ({ allCacheData: d }) => ({ envConfig: { value: d.map(d => `${d.data}`).join('\n') } }),
    updateEnvValue: /##\d+/,
  },
];
