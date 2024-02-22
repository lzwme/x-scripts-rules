/*
 * @Author: renxia
 * @Date: 2024-02-22 19:46:56
 * @LastEditors: renxia
 * @LastEditTime: 2024-02-22 21:43:58
 * @Description:
 */

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  // https://github.com/zqzess/rule_for_quantumultX/raw/master/js/debug/aDriveCrack/aDriveCrack_test.js
  {
    on: 'res-body',
    ruleId: 'alipanVip',
    desc: '阿里云盘解锁vip',
    method: '*',
    url: /^https:\/\/(api|member)\.alipan\.com\/(adrive|v1|v2|business|databox)\/.+\/(me|vip|feature|info|get_personal_info|driveCapacityDetails|getUserCapacityInfo)/,
    handler({ resBody, url, X }) {
      if (typeof resBody === 'object') {
        const color = X.FeUtils.color;
        let modified = resBody;
        url = color.gray(url);

        if (modified.rightButtonText) {
          // body2
          console.log('修改会员有效期', url);
          modified = {
            ...resBody,
            rightButtonText: '立即续费',
            identity: 'svip',
            level: '8t',
            titleNotice: null,
            titleImage: 'https://gw.alicdn.com/imgextra/i1/O1CN01Z2Yv4u1jrJ5S5TYpo_!!6000000004601-2-tps-216-60.png',
            description: '有效期至2034-01-30',
          };
        } else if (modified.dayDiscPrice) {
          // body6
          console.log('修改会员功能', url);
          modified.identity = 'svip';
          let features = modified.features;
          features.forEach(function (i) {
            i.name === '限免' ? (i.name = 'VIP') : i.name;
            if (i.intercept) i.intercept = false;
            i.name === '会员' ? (i.name = 'VIP') : i.name;
            if (i.backgroundImage)
              i.backgroundImage = 'https://gw.alicdn.com/imgextra/i3/O1CN01E7Gm7E1ZHRsDrNlLa_!!6000000003169-2-tps-84-42.png';
            if (i.features) {
              i.features.forEach(function (m) {
                m.intercept = false;
              });
            }
          });
        } else if (modified.personal_rights_info) {
          // body4
          console.log('修改用户账户信息和限制权限', url);
          modified.personal_rights_info.spu_id = 'vip';
          modified.personal_rights_info.name = 'SVIP';
          modified.personal_space_info.total_size = 43980465111040; // 40Tb
        }  else if (modified.drive_capacity_details) {
          console.log('修改容量管理详情', url);

          // modified.capacity_level_info = {
          //   capacity_type: 'svip',
          // };
          modified.drive_capacity_details.drive_total_size = 43980465111040; // 40Tb
        } else if (modified.drive_total_size && modified.default_drive_used_size) {
          // body5
          console.log('修改容量管理总容量', url);
          modified.drive_total_size = 43980465111040; // 40Tb
        } else if (modified.membershipIdentity && modified.userId) {
          // body7
          console.log('修改用户基础信息', url);
          modified.membershipIdentity = 'svip';
          modified.membershipIcon = 'https://gw.alicdn.com//imgextra//i3//O1CN01iPKCuZ1urjDgiry5c_!!6000000006091-2-tps-60-60.png';
        } else {
          // body1
          console.log('修改会员状态', url);
          modified = {
            ...modified,
            identity: 'svip',
            level: '8t',
            icon: 'https://gw.alicdn.com/imgextra/i3/O1CN01iPKCuZ1urjDgiry5c_!!6000000006091-2-tps-60-60.png',
            mediumIcon: 'https://gw.alicdn.com/imgextra/i4/O1CN01Mk916Y1c99aVBrgxM_!!6000000003557-2-tps-222-60.png',
            status: 'normal',
            vipList: [
              {
                name: '8TB超级会员',
                code: 'svip.8t',
                promotedAt: 1675599847,
                expire: 1806600189,
              },
            ],
          };
        }

        return { body: modified };
      }
    },
  },
];
