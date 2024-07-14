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
];
