/*
 * @Author: renxia
 * @Date: 2024-02-06 11:25:49
 * @LastEditors: renxia
 * @LastEditTime: 2024-02-26 17:06:23
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
      const value = allCacheData.map(({ data: d }) => d.reqBody.encryptsessionid).join('\n');
      if (value) return { envConfig: [ { name: this.ruleId, value }, ], };
    },
  },
];
