/*
 * @Author: renxia
 * @Date: 2024-02-28 10:08:29
 * @LastEditors: renxia
 * @LastEditTime: 2024-03-04 16:37:08
 * @Description: 待验证
 */

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  {
    on: 'res-body',
    ruleId: 'xunleiVipCrack',
    desc: '迅雷 VIP',
    method: '*',
    mitm: 'xluser-ssl.zhihu.com',
    url: "https://xluser-ssl.xunlei.com/xluser.core.login/v3/getuserinfo",
    handler({ resBody: body, url, X }) {
      if (typeof body === 'object') {
        const color = X.FeUtils.color;
        console.log(`[${this.desc}]`, color.gray(url));

        body.vipList = [
          {
            expireDate: '20290609',
            isAutoDeduct: '0',
            isVip: '1',
            isYear: '1',
            payId: '0',
            payName: '---',
            register: '0',
            vasid: '2',
            vasType: '5',
            vipDayGrow: '20',
            vipGrow: '840',
            vipLevel: '7',
          },
        ];

        return { body };
      }
    },
  },
];
