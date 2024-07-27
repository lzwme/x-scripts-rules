/*
 * @Author: renxia
 * @Date: 2024-07-22 10:49:34
 * @LastEditors: renxia
 * @LastEditTime: 2024-07-25 22:52:15
 * @Description:
 */

/**
 * yang7758258/ohhh_QL-Script
 * @type {import('@lzwme/whistle.x-scripts').RuleItem[]}
 */
module.exports = [
  {
    on: 'req-body',
    ruleId: 'chmlck',
    desc: '长虹美菱小程序签到',
    url: 'https://hongke.changhong.com/gw/burying/burying/report*',
    method: 'post',
    getCacheUid: ({ reqBody: R }) => R?.props?.wx_user?.phone_number,
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.token}##${d.uid}`).join('\n') } }),
  },
  {
    on: 'res-body',
    ruleId: 'qchyjlb',
    desc: '雀巢会员俱乐部-小程序签到',
    url: 'https://crm.nestlechinese.com/openapi/member/api/User/GetUserInfo',
    method: 'get',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.data?.mobile }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.authorization}&${d.uid}`).join('\n') } }),
    updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'fsdlb',
    desc: '逢三得利吧-小程序签到',
    url: 'https://xiaodian.miyatech.com/api/user/member/info',
    method: 'post',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.data?.memberId }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.authorization}&${d.uid}`).join('\n'), sep: '\n' } }),
    updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'ywxspc',
    desc: '义乌小商品城会员-小程序签到',
    url: 'https://apiserver.chinagoods.com/ums/authentication/v1/userauthinfo',
    method: 'get',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.data?.userinfo?.userId }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.authorization}&${d.uid}`).join('\n'), sep: '\n' } }),
    updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'zippo',
    desc: 'zippo会员中心-小程序签到',
    url: 'https://wx-center.zippo.com.cn/api/users/profile',
    method: 'get',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.phone }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.authorization}&${d.uid}`).join('\n'), sep: '\n' } }),
    updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'ydxq',
    desc: '雅迪星球-小程序',
    url: 'https://planet-api.op.yadea.com.cn/user-api/app/user/getUsertoken',
    method: 'post',
    getCacheUid: ({ resBody: R, headers }) => headers.authorization && { uid: R?.object?.userinfo?.userid },
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.authorization}&${d.uid}`).join('\n') } }),
    updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'xpnc',
    desc: '兴攀农场-小程序',
    url: 'https://p.xpfarm.cn/treemp/user.PersonalCenter/getInfo',
    method: 'post',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.data?.id }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.authorization}&${d.uid}`).join('\n') } }),
    updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'dfjsck',
    desc: '东方棘市-小程序',
    url: 'https://ys.shajixueyuan.com/api/user/info',
    method: 'GET',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.data?.id }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.token}#${d.uid}`).join('\n') } }),
    updateEnvValue: /#([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'rqtyg',
    desc: '日清体验馆-小程序',
    url: 'https://prod-api.nissinfoodium.com.cn/gw-shop/app/v1/user-center/detail?type=1',
    method: 'GET',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.data?.user_id }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.token}&${d.uid}`).join('\n') } }),
    updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'emsyhzx',
    desc: 'EMS邮惠中心-小程序签到得优惠券',
    url: 'https://ump.ems.com.cn/memberCenterApiV2/member/findByOpenIdAppId',
    method: 'post',
    getCacheUid: ({ reqBody: Q, resBody: R }) => ({ uid: R?.data?.user_id, data: `${Q.openId}&${R.data?.user_id}` }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
    updateEnvValue: /&([\da-z]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'tkzxbxCookie',
    desc: '泰康在线保险-小程序签到-单账号',
    url: 'https://m.tk.cn/member_api*',
    method: 'post',
    getCacheUid: ({ reqBody: Q, resBody: R, url }) => {
      if (typeof Q.params === 'string') Q = JSON.parse(Q.params);
      return { uid: Q.bindid, data: `${Q.bindid}` }; // &${R.data?.tkmid}
    },
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
    updateEnvValue: /&([\da-z]+)/,
  },

  {
    on: 'req-body',
    ruleId: 'chmlck',
    desc: '长虹美菱小程序签到',
    url: 'https://hongke.changhong.com/gw/burying/burying/report*',
    method: 'post',
    getCacheUid: ({ reqBody: R }) => R?.props?.wx_user?.phone_number,
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.token}##${d.uid}`).join('\n') } }),
  },
  {
    on: 'res-body',
    ruleId: 'yshyjlb',
    desc: '仰韶会员俱乐部-小程序',
    url: 'https://hy.51pt.top/app/ys/mine/getMemberInfo',
    method: 'get',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.data?.userId }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.authorization}&${d.uid}`).join('\n'), sep: '\n' } }),
    updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'mswefls',
    desc: '麦斯威尔福利社-小程序',
    url: 'https://jde.mtbcpt.com/api/JDEMaxwellApi/QueryHomeInfo',
    method: 'post',
    getCacheUid: ({ resBody: R, reqBody: Q }) => {
      const uid = R?.data?.user?.Id;
      if (uid) return { uid, data: `${Q.openId}&${uid}` };
    },
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n'), sep: '\n' } }),
    updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'hqcsh',
    desc: '好奇车生活-小程序',
    url: 'https://channel.cheryfs.cn',
    method: '*',
    getCacheUid: ({ resBody: R, reqBody: Q, headers }) => {
      if (headers.accountid) {
        console.log(url, R, Q);
      }
      // const uid = R?.data?.user?.Id;
      // if (uid) return { uid, data: `${Q.openId}&${uid}` };
    },
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.accountid}&${d.uid}`).join('\n'), sep: '\n' } }),
    updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'gljj',
    desc: '国乐酱酒-小程序签到得酒',
    url: 'https://member.guoyuejiu.com/api/user/info',
    method: 'get',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.data?.id }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.authorization}&${d.uid}`).join('\n'), sep: '\n' } }),
    updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'babaycare',
    desc: 'Babaycare-小程序签到',
    url: 'https://api.bckid.com.cn/lightpay/front/user/balance/info',
    method: 'post',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.body?.userId }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.authorization}&${d.uid}`).join('\n'), sep: '\n' } }),
    updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'mpcbh',
    desc: '毛铺草本荟-小程序签到',
    url: 'https://mpb.jingjiu.com/proxy-he/api/BlzAppletIndex/levelPowerList',
    method: 'post',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.data?.user?.user_id }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers.authorization}&${d.uid}`).join('\n'), sep: '\n' } }),
    updateEnvValue: /&([\d\*]+)/,
  },
  {
    on: 'res-body',
    ruleId: 'jdfls',
    desc: '健达福利社-小程序签到',
    url: 'https://mole.ferrero.com.cn/boss/boss/scrm/home/info/get',
    method: 'post',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.data?.memberDetail?.memberId }),
    handler: ({ cacheData: D }) => ({
      envConfig: { value: D.map(d => `${d.headers['kumi-token']}&${d.headers['project-id']}&${d.uid}`).join('\n'), sep: '\n' },
    }),
    updateEnvValue: /&([a-z\d]+)$/,
  },
  {
    on: 'res-body',
    ruleId: 'htmwg',
    desc: '海天美味馆-小程序签到',
    url: 'https://cmallapi.haday.cn/buyer-api/members',
    method: 'get',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.member_id }),
    handler: ({ cacheData: D }) => ({
      envConfig: { value: D.map(d => `${d.headers.authorization}&${d.headers.uuid}&${d.uid}`).join('\n'), sep: '\n' },
    }),
    updateEnvValue: /&(\d+)$/,
  },
  {
    on: 'res-body',
    ruleId: 'glg',
    desc: '格力高-小程序签到',
    url: 'https://crm.glico.cn/miniapp/member/profile',
    method: 'get',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.data?.id }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.headers['x-auth-token']}&${d.uid}`).join('\n'), sep: '\n' } }),
    updateEnvValue: /&(\d+)$/,
  },
  {
    on: 'res-body',
    ruleId: 'fsinstax',
    desc: '富士instax玩拍由我俱乐部-小程序签到',
    url: 'https://instax.app.xcxd.net.cn/api/me',
    method: 'get',
    getCacheUid: ({ resBody: R }) => ({ uid: R?.data?.user_id || R?.data?.user?.id }),
    handler: ({ cacheData: D }) => ({ envConfig: { value: D.map(d => `${d.uid}&${d.headers.authorization}`).join('\n'), sep: '\n' } }),
    updateEnvValue: /(\d+)&/,
  },
];
