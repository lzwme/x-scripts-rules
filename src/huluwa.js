const apps = {
  wxded2e7e6d60ac09d: { key: 'XLHG', channelId: '8', desc: '偲源惠购' },
  wx61549642d715f361: { key: 'GLYP', channelId: '7', desc: '贵旅优品' },
  wx613ba8ea6a002aa8: { key: 'KGLG', channelId: '2', desc: '空港乐购' },
  wx936aa5357931e226: { key: 'HLQG', channelId: '6', desc: '航旅黔购' },
  wx624149b74233c99a: { key: 'ZXCS', channelId: '5', desc: '遵航出山' },
  wx5508e31ffe9366b8: { key: 'GYQP', channelId: '3', desc: '贵盐黔品' },
  wx821fb4d8604ed4d6: { key: 'LLSC', channelId: '1', desc: '乐旅商城' },
  wxee0ce83ab4b26f9c: { key: 'YLQX', channelId: '9', desc: '驿路黔寻' },
};

// <token, { appid, phone, }>
const tokenCache = new Map();

/**
 * 葫芦娃 token 自动提取保存或上传至青龙
 * @type {import('@lzwme/whistle.x-scripts').RuleItem}
 */
module.exports = {
  on: 'res-body',
  ruleId: 'huluwa',
  desc: '葫芦娃 x-access-token 获取',
  url: 'https://gw.huiqunchina.com/front-manager/api/**',
  getCacheUid: ({ headers, reqBody, resBody }) => {
    const token = headers['x-access-token'];
    if (!token) return;

    const info = tokenCache.get(token) || { appid: '', uid: '', token };
    if (resBody?.data?.phone) info.uid = resBody?.data?.phone;
    if (!info.appid) info.appid = /miniProgram\/(wx\w+)/.exec(headers['user-agent'])?.[1] || reqBody?.appId;
    tokenCache.set(token, info);

    if (info.uid && info.appid) return { uid: `${info.appid}_${info.uid}`, data: { token, appid: info.appid, uid: info.uid } };
  },
  handler: ({ allCacheData, headers, reqBody }) => {
    const info = tokenCache.get(headers['x-access-token']);
    if (!info) return;

    const allUserData = allCacheData.filter(d => d.data.appid === info.appid);

    if (allUserData.length) {
      const value = allUserData.map(d => `${d.data.token}##${d.data.uid || d.uid}`).join('\n');
      const envConfig = { name: `${apps[info.appid].key}_COOKIE`, value, desc: apps[info.appid].desc + '-huluwa' };
      return { envConfig };
    }
  },
};
