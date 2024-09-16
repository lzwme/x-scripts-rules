const cache = {
  userId: '',
  token: '',
  tokenWap: '',
  lng: '',
  lat: '',
  deviceId: '',
};

/** @type {import('@lzwme/whistle.x-scripts').RuleItem} */
module.exports = {
  on: 'res-body',
  ruleId: 'imaotai',
  desc: 'imaotai预约 token 获取',
  /** url 匹配规则 */
  url: 'https://{h5,app}.moutai519.com.cn/**',
  /** 方法匹配 */
  method: '**',
  /** 是否上传至 青龙 环境变量配置 */
  toQL: true,
  /** 是否写入到环境变量配置文件中 */
  toEnvFile: true,
  /** 是否合并不同请求的缓存数据。默认为覆盖 */
  mergeCache: true,
  /** 获取当前用户唯一性的 uuid */
  getCacheUid: ({ headers, cookieObj, resBody }) => {
    if (/^\d+$/.test(resBody?.data?.userId)) cache.userId = resBody.data.userId;
    if (!cache.userId) return;

    const deviceId = headers['mt-device-id'] || cookieObj['MT-Device-ID-Wap'];
    if (deviceId) cache.deviceId = deviceId;
    if (cookieObj['MT-Token-Wap']) cache.tokenWap = cookieObj['MT-Token-Wap'];
    if (headers['mt-lng']) cache.lng = headers['mt-lng'];
    if (headers['mt-lat']) cache.lat = headers['mt-lat'];
    if (headers['mt-token']) cache.token = headers['mt-token'];

    Object.entries(cache).forEach(([key, val]) => {
      if (val === 'undifined') cache[key] = '';
    });

    console.log('geuid:', cache)
    return {
      /** user 唯一性标记 */
      uid: cache.userId,
      /** 保存至缓存中的自定义数据。是可选的，主要用于需组合多个请求数据的复杂场景 */
      data: { ...cache },
    };
  },
  handler: ({ allCacheData }) => {
    const allUserData = allCacheData.map(d => d.data).filter(d => d.token);
    if (allCacheData.length === 0) return;
    console.log('imaotai allUserData:', JSON.stringify(allUserData, null, 2));
    // const value = allUserData.map(d => `deviceId=${d.deviceId};token=${d.token};tokenWap=${d.tokenWap};city=x市;province=x省`).join('&');
    const value = allUserData.map(d => `userId=${d.userId};deviceId=${d.deviceId};token=${d.token};tokenWap=${d.tokenWap}`).join('\n');

    return { envConfig: { name: 'QL_IMAOTAI', value, desc: 'imaotai cookie' } };
  },
  updateEnvValue: /userId=([^;]+)/,
};
