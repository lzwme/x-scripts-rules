/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  // https://raw.githubusercontent.com/leafTheFish/DeathNote/main/ddgy.js
  {
    on: 'res-body',
    ruleId: 'ddgyToken',
    desc: '滴滴果园',
    method: 'POST',
    url: 'https://game.xiaojukeji.com/api/game/plant/enter?*',
    getCacheUid: ({ reqBody, resBody }) => ({ uid: resBody?.data?.uid, data: `${resBody?.data?.uid}&${reqBody.token}` }),
    handler({ allCacheData }) {
      const value = allCacheData.map(d => d.data).join('@');
      if (value) return { envConfig: { name: this.ruleId, value } };
    },
  },
];
