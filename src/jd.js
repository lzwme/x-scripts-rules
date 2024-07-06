// @ts-check
const cache = {
  uid: '',
  wskey: '',
};

/**
 * 京东 cookie 自动获取上传至青龙面板
 * WAP登录： https://bean.m.jd.com/bean/signIndex.action
 * @type {import('@lzwme/whistle.x-scripts').RuleItem[]}
 */
module.exports = [
  {
    disabled: false,
    /** 保存缓存数据ID，应唯一 */
    ruleId: 'JD_COOKIE',
    desc: '京东 cookie 自动抓取并同步至青龙环境变量',
    /** url 匹配规则 */
    url: 'https://*.jd.com/**',
    /** 请求方法匹配 */
    method: '*',
    toQL: true,
    toEnvFile: true,
    mergeCache: true,
    /** 获取当前用户唯一性的 uid */
    getCacheUid({ cookieObj, url }) {
      if (cookieObj.wskey) {
        cache.wskey = cookieObj.wskey;
        console.log('wskey', cache);
      }

      const uid = cookieObj.pt_pin || cookieObj.pin;

      if (uid && !uid.startsWith('netdiag') && !uid.startsWith('***')) {
        if (cache.uid && cache.uid !== uid) cache.wskey = '';
        cache.uid = uid;
        if (cache.wskey) cookieObj.wskey = cache.wskey;

        return { uid, data: cookieObj };
      }
    },
    /** 规则处理并返回环境变量配置。可以数组的形式返回多个 */
    handler({ cacheData, cookieObj, X }) {
      // console.log('handler-1', cookieObj.pt_pin, cookieObj.pin, this.mergeCache);

      const sep = '&';
      // 生成环境变量配置
      const envConfig = [
        {
          name: 'JD_COOKIE',
          value: cacheData
            .filter(d => d.data.pt_pin)
            .map(d => X.cookieStringfiy(d.data, { onlyKeys: [/^pt_/] }) + ';')
            .join(sep),
          desc: '京东 cookie',
          sep,
        },
        {
          name: 'JD_WSCK',
          value: cacheData
            .filter(d => d.data.wskey)
            .map(d => `pin=${encodeURIComponent(d.uid)};wskey=${d.data.wskey}`)
            .join(sep),
          desc: '京东 wskey',
          sep,
        },
      ].filter(d => d.value);

      return { envConfig };
    },
    /** 更新处理已存在的环境变量，返回合并后的结果。若无需修改则可返回空 */
    updateEnvValue({ value, sep = '\n' }, oldValue = '', X) {
      if (!oldValue) console.trace('[JD][OLDVALUE为空!]', value, oldValue);

      oldValue.split(sep).forEach(cookie => {
        if (!cookie) return;
        const pin = cookie.match(/pin=[^;]+/)?.[0];
        if (!pin || !value.includes(pin)) value += `${sep}${cookie}`;
      });
      return value;
    },
  },
  {
    desc: '签到有礼超级无线-七天签到LZKJ_SEVENDAY',
    ruleId: 'LZKJ_SEVENDAY',
    method: 'get',
    url: 'https://lzkj-isv.isvjcloud.com/sign/sevenDay/signActivity?activityId=*',
    getCacheUid: ({ url }) => new URL(url).searchParams.get('activityId'),
    handler({ cacheData }) {
      return { envConfig: { value: cacheData.map(d => d.uid).join(','), name: 'LZKJ_SEVENDAY' } };
    },
  },
  {
    desc: '签到有礼超级无线-CJHY_SEVENDAY',
    ruleId: 'CJHY_SEVENDAY',
    method: 'get',
    url: 'https://cjhy-isv.isvjcloud.com/sign/sevenDay/signActivity?activityId=*',
    getCacheUid: ({ url }) => new URL(url).searchParams.get('activityId'),
    handler: ({ cacheData: A }) => ({ value: A.map(d => d.uid).join(','), name: 'CJHY_SEVENDAY' }), // 可以直接返回 envConfig
  },
  {
    desc: 'lzkj签到有礼-activityId',
    ruleId: 'jd_lzkj_signActivity2_ids',
    url: 'https://lzkj-isv.isvjcloud.com/sign/signActivity2?activityId=*',
    getCacheUid: ({ url }) => new URL(url).searchParams.get('activityId'),
    handler({ cacheData }) {
      return [
        { value: cacheData.map(d => d.uid).join('&'), name: 'jd_lzkj_signActivity2_ids', desc: 'lzkj签到有礼' },
        { value: cacheData.map(d => d.uid).join(','), name: 'LZKJ_SIGN', desc: '签到有礼超级无线-LZKJ_SIGN' },
      ];
    },
  },
  {
    desc: 'cjhy签到有礼-activityId',
    ruleId: 'jd_cjhy_signActivity_ids',
    url: 'https://cjhy-isv.isvjcloud.com/wxActionCommon/getUserInfo',
    method: 'post',
    getCacheUid: ({ headers }) => {
      if (headers.referer) return new URL(headers.referer).searchParams.get('activityId');
    },
    handler({ cacheData }) {
      return [
        { value: cacheData.map(d => d.uid).join('&'), name: 'jd_cjhy_signActivity_ids', desc: 'cjhy签到有礼' },
        { value: cacheData.map(d => d.uid).join(','), name: 'CJHY_SIGN', desc: '签到有礼超级无线-CJHY_SIGN' },
      ];
    },
  },
];
