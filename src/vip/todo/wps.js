/*
 * @Author: renxia
 * @Date: 2024-02-28 10:08:29
 * @LastEditors: renxia
 * @LastEditTime: 2024-02-28 10:28:18
 * @Description: 待验证
 */

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  {
    on: 'res-body',
    ruleId: 'wpsVipCrack',
    desc: 'WPS VIP',
    method: '*',
    mitm: /^https?:\/\/[a-z-]*account\.wps\.c(n|om)/,
    url: /^https?:\/\/[a-z-]*account\.wps\.c(n|om)(:\d+|)\/api\/users/,
    handler({ resBody : body, url, X }) {
      if (typeof body === 'object') {
        const color = X.FeUtils.color;
        console.log(`[${this.desc}]`, color.gray(url));

        const privilege = [
          { spid: "data_recover", times: 0, expire_time: 4133059437 },
          { spid: "ocr", times: 0, expire_time: 4133059437 },
          { spid: "pdf2doc", times: 0, expire_time: 4133059437 },
          { spid: "pdf_merge", times: 0, expire_time: 4133059437 },
          { spid: "pdf_sign", times: 0, expire_time: 4133059437 },
          { spid: "pdf_split", times: 0, expire_time: 4133059437 }
        ];
        const vip = {
          name: "超级会员",
          has_ad: 0,
          memberid: 40,
          expire_time: 4133059437,
          enabled: [
            { memberid: 40, name: "超级会员", expire_time: 4133059437 },
            { memberid: 20, name: "WPS会员", expire_time: 4133059437 },
            { memberid: 12, name: "稻壳会员", expire_time: 4133059437 }
          ]
        };

        Object.assign(body, {
          level: 5,
          exp: 999,
          privilege,
          vip,
          expire_time: 4133059437,
          total_cost: -30,
        });

        if (body.data) {
          Object.assign(body.data, {
            level: 5,
            exp: 999,
            privilege,
            vip,
            expire_time: 4133059437,
            total_cost: -30,
            spaces_info: {
              "used": "0.10",
              "total": "1000.21",
              "unit": "T"
            }
          });
        }

        return { body };
      }
    },
  },
];
