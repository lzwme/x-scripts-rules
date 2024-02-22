/*
 * @Author: renxia
 * @Date: 2024-02-06 11:25:49
 * @LastEditors: renxia
 * @LastEditTime: 2024-02-23 11:52:29
 * @Description:
 */
/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  // https://raw.githubusercontent.com/leafTheFish/DeathNote/main/ddgy.js
  {
    on: 'res-body',
    ruleId: 'ddgyToken',
    desc: '滴滴果园',
    method: 'POST',
    url: 'https://game.xiaojukeji.com/api/game/plant/enter?*',
    getCacheUid: ({ reqBody, resBody }) => ({ uid: resBody?.data?.uid, data: { reqBody, uid: resBody?.data?.uid } }),
    handler({ allCacheData }) {
      const value = allCacheData.map(({ data: d }) => `${d.uid}&${d.reqBody.token}`).join('@');
      if (value)
        return {
          envConfig: [
            { name: this.ruleId, value },
            { name: 'ddgyck', value: allCacheData.map(({ data: d }) => JSON.stringify(d.reqBody)).join('\n') },
          ],
        };
    },
  },
];
