/*
 * @Author: renxia
 * @Date: 2024-02-28 10:08:29
 * @LastEditors: renxia
 * @LastEditTime: 2024-02-28 14:45:10
 * @Description: 待验证
 */

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  {
    // see https://github.com/Yu9191/Rewrite/blob/b96c7975b2afee78cb3e1e69888dfc988c20ba6f/yikexiangce.js
    on: 'res-body',
    ruleId: 'baiduCloudVip',
    desc: '百度网盘 解锁在线视频倍率/清晰度',
    method: '*',
    mitm: 'pan.zhihu.com',
    url: /^https?:\/\/pan\.baidu\.com\/(youai\/(user\/.+\/getminfo|membership\/.+\/adswitch)|(rest\/.+\/membership\/user|act\/.+\/(bchannel|welfare)\/list|api\/usercfg))/,
    // url: 'https://pan.baidu.com/rest/*/membership/user',
    handler({ resBody: body, url, X }) {
      if (typeof body !== 'object') return;
      const color = X.FeUtils.color;

      const yike = '/youai/user/v1/getminfo';
      const ad = '/youai/membership/v1/adswitch';
      const wangpan = '/youai/membership/user';
      const list = '/bchannel/list';
      const hf = '/welfare/list';
      const usercfg = '/api/usercfg';

      if (url.includes('membership/user')) {
        X.FeUtils.assign(body, {
          product_infos: [
            {
              product_id: '5310897792128633390',
              start_time: 1617260485,
              end_time: 2147483648,
              buy_time: '1417260485',
              cluster: 'offlinedl',
              detail_cluster: 'offlinedl',
              product_name: 'gz_telecom_exp',
            },
            {
              cur_svip_type: 'Crack',
              product_name: 'svip2_nd',
              // product_description: '解锁倍速+画质',
              product_description: '超级会员',
              function_num: 510004015,
              buy_description: '无下载加速',
              buy_time: 980784000,
              auto_upgrade_to_svip: 0,
              end_time: 4070880000,
              // function_num: 0,
              start_time: 1553702399,
              // buy_description: '',
              // buy_time: 0,
              product_id: '1',
              // auto_upgrade_to_svip: 0,
              // end_time: 1972502399,
              cluster: 'vip',
              detail_cluster: 'svip',
              status: 0,
            },
          ],
          reminder: {
            reminderWithContent: [],
            advertiseContent: [],
          },
          level_info: {
            current_level: 10,
          },
          // currenttime: Math.ceil(Date.now() / 1000),
          // request_id: `${Math.ceil(Math.random() * 10000)}${Date.now()}`,
        });
        hit = 1;
      }

      // 一刻相册
      else if (url.includes(yike)) {
        Object.assign(body, {
          errno: 0,
          request_id: 342581654394297772,
          has_purchased: 1,
          has_buy_1m_auto_first: 0,
          can_buy_1m_auto_first: 0,
          can_buy_1m_auto_first_6: 0,
          has_received_7dfree: 1,
          product_tag: 3,
          sign_status: 1,
          sign_infos: [
            {
              product_id: '12745849497343294855',
              order_no: '2203060931530010416',
              ctime: 1646537208,
              mtime: '2022-05-06 11:26:48',
              status: 1,
              sign_price: 1000,
              sign_channel: 0,
            },
          ],
          vip_tags: ['album_vip'],
          product_infos: [
            {
              product_id: '12745849497343294855',
              start_time: 1646534568,
              end_time: 4092599349,
              buy_time: 1649994533,
              tag: 'album_vip',
              order_no: '2203060931530010416',
            },
          ],
          vip_infos: [
            {
              tag: 'album_vip',
              start_time: 1646537208,
              end_time: 4092599349,
            },
          ],
          expire_time: 0,
        });
        hit = 1;
      } else if (url.includes(ad)) {
        body.switch = 'open';
        hit = 1;
      } else if (url.indexOf(wangpan) != -1) {
        body.product_infos = [
          {
            product_id: '5310897792128633390',
            end_time: 4092600296,
            buy_time: '1417260485',
            cluster: 'offlinedl',
            start_time: 1417260485,
            detail_cluster: 'offlinedl',
            product_name: 'gz_telecom_exp',
          },
          {
            product_name: 'svip2_nd',
            product_description: '超级会员',
            function_num: 0,
            start_time: 1417260485,
            buy_description: '',
            buy_time: 1417260485,
            product_id: '1',
            auto_upgrade_to_svip: 1,
            end_time: 4092600296,
            cluster: 'vip',
            detail_cluster: 'svip',
            status: 1,
          },
        ];
        body.guide_data = {
          title: '超级会员 SVIP-Baby',
          content: '已拥有极速下载+视频倍速特权',
          button: {
            text: '会员中心',
            action_url: 'https://pan.baidu.com/wap/vip/user?from=myvip2#svip',
          },
        };
        body.identity_icon = {
          vip: 'https://internal-amis-res.cdn.bcebos.com/images/2019-8/1566452237582/78b88bf113b7.png',
          common: 'https://internal-amis-res.cdn.bcebos.com/images/2019-8/1566452539056/bf72cf66fae1.png',
          svip: 'https://internal-amis-res.cdn.bcebos.com/images/2019-8/1566452115696/38c1d743bfe9.png',
          contentvip: '',
        };
        body.error_code = 1;
        delete body.tips_data_list;
        delete body.status_data_arr;
        delete body.sub_card_list;
        hit = 1;
      } else if (url.indexOf(list) != -1) {
        body.data = [
          {
            sub_title: '',
            id: 856,
            bg_icon: '',
            button_text: '',
            web_url: '',
            type: 3,
            name: '已解锁SVIP，未完整解锁',
          },
          {
            sub_title: '',
            id: 460,
            bg_icon: '',
            button_text: '',
            web_url: '',
            type: 3,
            name: '已拥有极速下载+视频倍速特权',
          },
        ];

        hit = 1;
      } else if (url.indexOf(hf) != -1) {
        delete body.data;

        hit = 1;
      } else if (url.indexOf(usercfg) != -1) {
        body.user_new_define_cards = [
          {
            card_id: '1',
            card_type: '4',
            card_area_name: '首页笔记-卡片',
          },
          {
            is_manager: 1,
            card_area_name: '最近',
            card_id: '1',
            card_type: '7',
          },
          {
            card_id: '1',
            card_type: '13',
            card_area_name: '卡片管理-卡片',
          },
        ];

        hit = 1;
      }

      if (hit) {
        console.log(`[${this.desc}]`, color.gray(url));
        return { body };
      } else {
        console.warn(`[${this.desc}][missed]`, color.gray(url));
      }
    },
  },
];
