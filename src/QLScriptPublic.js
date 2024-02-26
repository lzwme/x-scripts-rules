/*
 * @Author: renxia
 * @Date: 2024-01-24 08:54:08
 * @LastEditors: renxia
 * @LastEditTime: 2024-02-27 10:18:16
 * @Description:
 */

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  {
    on: 'req-header',
    ruleId: 'hdl_data',
    method: '**',
    url: 'https://superapp-public.kiwa-tech.com/activity/wxapp/**',
    desc: '海底捞小程序签到 token',
    // getCacheUid: () => 'hdl',
    handler({ headers }) {
      // console.log('hdl', headers);
      if (headers['_haidilao_app_token']) {
        return { envConfig: { name: this.ruleId, value: headers['_haidilao_app_token'] } };
      }
    },
  },
  {
    on: 'res-body',
    ruleId: 'mxbc_data',
    desc: '蜜雪冰城小程序 Access-Token',
    method: 'get',
    url: 'https://mxsa.mxbc.net/api/v1/customer/info*',
    getCacheUid: ({ resBody }) => resBody?.data?.customerId,
    handler({ allCacheData }) {
      const value = allCacheData.map(d => d.headers['access-token']).join('@');
      if (value) return { envConfig: { name: this.ruleId, value } };
    },
  },
  {
    on: 'req-header',
    ruleId: 'zbsxcx',
    desc: '植白说小程序 x-dts-token',
    method: 'get',
    url: 'https://www.kozbs.com/demo/wx/**/*?userId=**',
    getCacheUid: ({ url }) => /userId=(\d{5,})/.exec(url)?.[1],
    handler({ allCacheData }) {
      const value = allCacheData.map(d => d.headers['x-dts-token']).join('&');
      if (value) return { envConfig: { name: this.ruleId, value } };
    },
  },
  {
    on: 'res-body',
    ruleId: 'ylnn',
    desc: '伊利牛奶小程序',
    method: 'get',
    url: 'https://msmarket.msx.digitalyili.com/gateway/api/auth/account/user/info',
    getCacheUid: ({ resBody }) => resBody?.data?.userId,
    handler({ allCacheData }) {
      const value = allCacheData.map(d => d.headers['access-token']).join('&');
      if (value) return { envConfig: { name: this.ruleId, value } };
    },
  },
  {
    on: 'res-body',
    ruleId: 'lbvip',
    desc: '立白小白白会员俱乐部',
    method: 'get',
    url: 'https://clubwx.hm.liby.com.cn/b2cMiniApi/me/getUserData.htm',
    getCacheUid: ({ resBody }) => resBody?.data?.userName,
    handler({ allCacheData }) {
      const value = allCacheData.map(d => `${d.headers['unionid']}#${d.headers['x-wxde54fd27cb59db51-token']}`).join('\n');
      if (value) return { envConfig: { name: this.ruleId, value } };
    },
  },
  {
    on: 'req-header',
    ruleId: 'ddsy_songyao',
    desc: '叮当快药APP',
    method: 'get',
    url: 'https://xapi.ddky.com/mcp/weixin/rest.htm?sign=*',
    getCacheUid: ({ url, X }) => {
      const query = X.FeUtils.getUrlParams(url);
      return query.loginToken && query.userId ? { uid: query.userId, data: `${query.loginToken}&${query.userId}&${query.uDate}` } : '';
    },
    handler({ allCacheData }) {
      const value = allCacheData.map(d => d.data).join('@');
      if (value) return { envConfig: { name: this.ruleId, value } };
    },
  },
  {
    on: 'res-body',
    ruleId: 'jsbaxfls',
    desc: '杰士邦安心福利社',
    method: 'get',
    url: 'https://m.jissbon.com/api/user/info',
    getCacheUid: ({ resBody }) => resBody?.data?.userInfo?.user_id,
    handler({ allCacheData }) {
      const value = allCacheData.map(d => d.headers['access-token']).join('&');
      if (value) return { envConfig: { name: this.ruleId, value } };
    },
  },
  {
    on: 'res-body',
    ruleId: 'hrjmwshg',
    desc: '好人家美味生活馆',
    method: 'post',
    url: 'https://xapi.weimob.com/api3/onecrm/user/center/usercenter/queryUserHeadElement',
    getCacheUid: ({ resBody }) => resBody?.data?.nickname,
    handler({ allCacheData }) {
      const value = allCacheData.map(d => d.headers['x-wx-token']).join('&');
      if (value) return { envConfig: { name: this.ruleId, value } };
    },
  },
  {
    on: 'req-body',
    ruleId: 'hxek',
    desc: '鸿星尔克签到',
    url: 'https://bury.demogic.com/api-bury-point/bury-point',
    getCacheUid: ({ reqBody, headers, req }) => {
      if (typeof reqBody?.userInfo === 'string') {
        const userInfo = JSON.parse(reqBody.userInfo);
        return { uid: userInfo.phoneNumber, data: userInfo.memberId };
      }
    },
    handler({ allCacheData }) {
      const value = allCacheData.map(d => d.data).join('@');
      if (value) return { envConfig: { name: this.ruleId, value } };
    },
  },
  {
    disabled: true,
    on: 'req-header',
    ruleId: 'wx_xlxyh_data',
    desc: '微信小程序_骁龙骁友会',
    url: 'https://qualcomm.growthideadata.com/qualcomm-app/**',
    getCacheUid: ({ headers }) => {
      return { uid: headers.userid, data: `${headers.sessionkey}&${headers.userid}` };
    },
    handler({ allCacheData }) {
      const value = allCacheData.map(d => d.data).join('@');
      if (value) return { envConfig: { name: this.ruleId, value } };
    },
  },
  {
    on: 'res-body',
    ruleId: 'ljfsjlbCookie',
    desc: '微信小程序_罗技粉丝俱乐部',
    url: 'https://api.wincheers.net/api/services/app/crmAccount/GetLGFanBuyerCenter',
    getCacheUid: ({ resBody, headers }) => {
      return { uid: resBody?.result?.buyerId, data: headers['authorization']?.replace('Bearer ', '') };
    },
    handler({ allCacheData }) {
      const value = allCacheData.map(d => d.data).join('&');
      if (value) return { envConfig: { name: this.ruleId, value } };
    },
  },
  {
    on: 'req-body',
    ruleId: 'ksd',
    desc: '卡萨帝-小程序',
    method: 'post',
    url: 'https://yx.jsh.com/customer/api/activityCenter/recordLog',
    getCacheUid: ({ reqBody, headers }) => ({ uid: reqBody?.userId, data: `${headers.authorization}#${reqBody.openId}` }),
    handler({ allCacheData }) {
      return { envConfig: { name: this.ruleId, value: allCacheData.map(d => d.data).join('&') } };
    },
  },
  {
    on: 'req-header',
    ruleId: 'smart_car_plus',
    desc: 'smart汽车+-小程序，签到抽盲盒',
    url: 'https://app-api.smart.cn/**',
    getCacheUid: ({ headers }) => ({ uid: headers['x-user-id'], data: headers['id-token'] }),
    handler: ({ allCacheData }) => ({ envConfig: { value: allCacheData.map(d => d.data).join('&') } }),
  },
  {
    on: 'req-header',
    ruleId: 'wx_gjjkpro_data',
    desc: '高济健康pro小程序签到',
    method: 'get',
    url: 'https://api.gaojihealth.cn/fund/api/**/*userId=*',
    getCacheUid: ({ headers, url }) => {
      const userId = /userId=(\d{10,})/.exec(url)?.[1];
      if (userId) return { uid: userId, data: `${userId}&${headers['authorization']}` };
    },
    handler: ({ allCacheData }) => ({ envConfig: { value: allCacheData.map(d => d.data).join('\n') } }),
  },
  {
    on: 'req-header',
    ruleId: 'gacmotorToken',
    desc: '广汽传祺',
    method: 'get',
    url: 'https://next.gacmotor.com/mall/**',
    getCacheUid: () => 'gacmotorToken',
    handler({ headers }) {
      if (headers.token) return { envConfig: { value: headers.token } };
    },
  },
  {
    on: 'res-body',
    ruleId: 'nzqc',
    desc: '哪吒汽车_微信小程序_refresh_token',
    url: 'https://www.hozonauto.com/{user/miniProgramLoginNew,api_lottery/user_login}',
    getCacheUid: ({ resBody }) => {
      if (!resBody) return;
      const info = resBody.data?.info || resBody.data;
      if (info) return { uid: info.uuid, data: info.refresh_token };
    },
    handler: ({ allCacheData }) => ({ envConfig: { value: allCacheData.map(d => d.data).join('\n') } }),
  },
  {
    on: 'res-body',
    ruleId: 'ruilanCar',
    desc: '睿蓝汽车_小程序_aid#rid',
    method: 'get',
    url: 'https://api-gateway.livanauto.com/app/v1.0/clientapi//common/user/info',
    getCacheUid: ({ resBody, headers }) => ({ uid: resBody?.data?.userId, data: `${headers.aid}#${headers.rid}` }),
    handler: ({ allCacheData }) => ({ envConfig: { value: allCacheData.map(d => d.data).join('\n') } }),
  },
  {
    on: 'res-body',
    ruleId: 'leidaCarCookie',
    desc: '雷达汽车_小程序_aid#rid',
    method: 'get',
    url: 'https://mp.radar-ev.com/clientapi/{common/user/info,radaruser/api/user/home}',
    getCacheUid: ({ resBody, headers }) => ({ uid: resBody?.data?.userId, data: `${headers.rid}#${headers.rid}#${resBody?.data?.userId}` }),
    handler: ({ allCacheData }) => ({ envConfig: { value: allCacheData.map(d => d.data).join('\n') } }),
  },
  {
    on: 'res-body',
    ruleId: 'kyqc',
    desc: '凯翼汽车_小程序',
    method: 'get',
    url: 'https://fdt-gateway-prod.dm.newcowin.com/customer/community-vip-user/exterior/user/getMe',
    getCacheUid: ({ resBody, headers }) => ({ uid: resBody?.data?.id, data: `${headers.devicesn}@@@${headers.cookie}` }),
    handler: ({ allCacheData }) => ({ envConfig: { value: allCacheData.map(d => d.data).join('\n') } }),
  },
  {
    on: 'res-body',
    ruleId: 'alyp',
    desc: '阿里云盘',
    url: 'https://auth.alipan.com/v2/account/token',
    getCacheUid: ({ resBody }) => ({ uid: resBody?.user_id, data: resBody?.refresh_token }),
    handler: ({ allCacheData }) => ({ envConfig: { value: allCacheData.map(d => d.data).join('@') } }),
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
      const value = allCacheData
        .map(d => d.data)
        .filter(Boolean)
        .join('\n');
      return { envConfig: { value } };
    },
  },
];
