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
    method: '*',
    url: 'https://msmarket.msx.digitalyili.com/gateway/api/auth/account/**',
    getCacheUid: ({ resBody, headers: H }) => {
      const uid = resBody?.data?.userId || resBody?.data?.userInfo?.userId;
      if (uid && H['access-token']) return uid;
    },
    handler({ cacheData: C }) {
      const value = C.map(d => d.headers['access-token']).join('\n');
      if (value)
        return {
          envConfig: [
            { name: this.ruleId, value },
            { name: 'YLXL', value: C.map(d => d.headers['access-token']).join('&'), sep: '&' }, // 伊利系列小程序
          ],
        };
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
    url: 'https://xh-vip-api.a-touchin.com/mp/user/info',
    getCacheUid: ({ resBody, headers }) => {
      const uid = resBody?.data?.userInfo?.user_id;
      if (uid) return { uid, data: `${headers['access-token']}##${uid}` };
    },
    handler({ allCacheData: D }) {
      return { envConfig: { value: D.map(d => d.data).join('\n') } };
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
    disabled: false,
    on: 'req-header',
    ruleId: 'wx_xlxyh',
    desc: '微信小程序_骁龙骁友会',
    url: 'https://qualcomm.growthideadata.com/qualcomm-app/**',
    getCacheUid: ({ headers }) => {
      return { uid: headers.userid, data: `${headers.sessionkey}#${headers.userid}` };
    },
    handler({ allCacheData }) {
      const value = allCacheData.map(d => d.data).join('&');
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
    desc: '广汽传祺 - 单账号',
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
    ruleId: 'xinxi',
    desc: '心喜_小程序',
    method: 'get',
    url: 'https://api.xinc818.com/mini/user',
    getCacheUid: ({ resBody, headers }) => ({ uid: resBody?.data?.id, data: `${headers.sso}##${resBody?.data?.id}` }),
    handler: ({ allCacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
  },
  {
    on: 'req-body',
    ruleId: 'didi',
    desc: '滴滴领券&果园 - 单账号',
    method: 'POST',
    url: 'https://api.didi.cn/**',
    getCacheUid: () => 'lzwme',
    handler({ reqBody }) {
      if (reqBody?.token) return { envConfig: { value: reqBody.token + '#3' } };
    },
  },
  {
    on: 'req-header',
    ruleId: 'heyeHealth',
    desc: '荷叶健康小程序-果园[免费领水果]',
    url: 'https://tuan.api.ybm100.com/miniapp/my/accountInfo',
    getCacheUid: ({ headers }) => ({ uid: headers.userid, data: `${headers.token}##${headers.userid}` }),
    handler: ({ allCacheData }) => ({ envConfig: { value: allCacheData.map(d => d.data).join('\n') } }),
  },
  {
    on: 'req-header',
    ruleId: 'yyq_new',
    desc: '悦野圈-小程序',
    url: 'https://customer.yueyequan.cn/**',
    method: 'GET',
    getCacheUid: ({ cookieObj: C }) => ({ uid: C.userid, data: `${C.usersig}#${C.userid}` }),
    handler: ({ allCacheData }) => ({ envConfig: { value: allCacheData.map(d => d.data).join('\n') } }),
    updateEnvValue: /#(\d+)/,
  },
  {
    on: 'res-body',
    ruleId: 'yuepaiToken',
    desc: '悦拜APP_小程序/app',
    method: 'POST',
    url: 'https://app.yuebuy.cn/api/user/{UserCenter,getUserInfo}',
    getCacheUid: ({ headers, resBody, url }) => {
      const uid = resBody?.data?.id || resBody?.data?.user?.id;
      if (uid) return { uid, data: `${resBody.data.token || resBody.data.user?.token || headers['x-auth-token']}##${uid}` };
    },
    handler: ({ allCacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
  },
  {
    on: 'res-body',
    ruleId: 'hlToken',
    desc: '哈啰签到',
    method: 'POST',
    url: 'https://*.hellobike.com/api?*',
    getCacheUid: ({ resBody, reqBody, url }) => {
      try {
        const uid = findKeyValue(resBody, 'userNewId');
        if (uid) {
          console.log('uid', uid, url);
          return { uid, data: `${reqBody.token}##${uid}` };
        }
      } catch (e) {
        console.log(e);
      }
    },
    handler: ({ allCacheData: D }) => ({ envConfig: { value: D.map(v => v.data).join('\n') } }),
  },
  {
    on: 'req-header',
    ruleId: 'dewuSK',
    desc: '得物-心愿森林-单用户',
    method: 'POST',
    url: 'https://app.dewu.com/**',
    getCacheUid: ({ headers: H, cookieObj: C }) => {
      const dutoken = C.duToken || H.dutoken || H.cookietoken;
      if (dutoken) {
        //  && H.sk
        const uid = dutoken.split('|')[1];
        if (uid) {
          return { uid, data: `${H['x-auth-token'].replace(/Bearer /, '')}#${dutoken}` };
        }
      }
    },
    handler: ({ url, headers: H, allCacheData: D }) => {
      const ua = H['user-agent'];
      if (ua?.includes('Mozilla'))
        return {
          envConfig: [
            { name: 'dewuCK', value: D.map(d => d.data).join('\n') },
            { name: 'dewuSK', value: H.sk },
            { name: 'dewuUA', value: ua },
          ],
        };
    },
  },
  {
    on: 'req-header',
    ruleId: 'tpyzkj',
    desc: '太平洋科技app签到',
    url: 'https://pccoin.pconline.com.cn/*/*',
    method: '*',
    getCacheUid: ({ headers: H, cookieObj: C }) => {
      if (!H.uid || !C.common_session_id) return;
      return {
        uid: H.uid,
        data: `${H.uid}#${H.appsession}#${H.cookie}#${H.version}#${H['pc-agent']}#${H.channel}#${H['user-agent']}`,
      };
    },
    handler: ({ allCacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
  },
  {
    on: 'req-header',
    ruleId: 'bnmdhg',
    desc: '巴奴毛肚火锅小程序签到',
    url: 'https://cloud.banu.cn/api/member/*?member_id=*',
    method: 'GET',
    getCacheUid: ({ url, X }) => {
      const query = X.FeUtils.getUrlParams('?' + url.split('?')[1]);
      return {
        uid: query.member_id,
        data: query.member_id,
      };
    },
    handler: ({ allCacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
  },
  {
    on: 'res-body',
    ruleId: 'qfxhd', // 请求头的x-ds-key&返回报文体中的id
    desc: '起飞线生活小程序',
    url: 'https://cluster.qifeixian.com/api/user/v1/center/info',
    getCacheUid: ({ resBody, headers }) => ({ uid: resBody?.data?.id, data: `${headers['x-ds-key']}&${resBody?.data?.id}` }),
    handler: ({ allCacheData: D }) => ({ envConfig: { value: D.map(d => d.data).join('\n') } }),
  },
  {
    on: 'req-header',
    ruleId: 'wx_midea',
    desc: '美的会员',
    url: 'https://mvip.midea.cn/next/*/*',
    method: 'GET',
    getCacheUid: ({ cookieObj }) => cookieObj.uid,
    handler: ({ allCacheData: D }) => ({ envConfig: { value: D.map(d => d.headers.cookie).join('\n') } }),
  },
];

function findKeyValue(obj, key) {
  let val;

  try {
    if (!obj || !key || typeof obj !== 'object') return;

    if (Buffer.isBuffer(obj)) obj = JSON.parse(obj.toString());

    if (Array.isArray(obj)) {
      for (const o of obj) {
        val = findKeyValue(o, key);
        if (val != null) break;
      }

      return val;
    }

    if (key in obj) return obj[key];

    for (let k in obj) {
      val = findKeyValue(obj[k], key);
      if (val != null) return val;
    }
  } catch (e) {
    console.log('[findKeyValue][error]', e);
  }

  return val;
}
