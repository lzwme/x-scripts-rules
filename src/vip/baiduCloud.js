/*
 * @Author: renxia
 * @Date: 2024-02-28 10:08:29
 * @LastEditors: renxia
 * @LastEditTime: 2024-03-06 13:16:12
 * @Description: 待验证
 * @see https://github.com/Yu9191/Rewrite/blob/b96c7975b2afee78cb3e1e69888dfc988c20ba6f/yikexiangce.js
 * @see https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/Function/BaiduCloud.conf
 */

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  {
    on: 'res-body',
    ruleId: 'baiduCloudVip',
    desc: '百度网盘_解锁在线视频倍率/清晰度',
    method: '*',
    mitm: 'pan.zhihu.com',
    url: /^https?:\/\/pan\.baidu\.com\/(youai\/(user\/.+\/getminfo|membership\/.+\/adswitch)|(rest\/.+\/membership\/user|act\/.+\/(bchannel|welfare)\/list)|api\/usercfg|api\/getsyscfg)/,
    // url: 'https://pan.baidu.com/rest/*/membership/user',
    handler({ resBody: body, url, X }) {
      if (typeof body !== 'object') return;
      const color = X.FeUtils.color;

      const yike = '/youai/user/v1/getminfo';
      const ad = '/youai/membership/v1/adswitch';
      const list = '/bchannel/list';
      const hf = '/welfare/list';
      const usercfg = '/api/usercfg';
      let hit = 1;

      // 开屏广告过滤
      if (url.includes('api/getsyscfg')) {
        const propertiesToDelete = [
          'switch_config_area',
          'splash_advertise_fetch_config_area',
          'bdnc_commerce_video_ad_area_pad',
          'thrid_ad_funads_service',
          'my_person_service',
          'thrid_ad_buads_service',
          'splash_advertise_type_area',
          'business_ad_config_area',
          'new_user_card',
        ];
        for (const prop of propertiesToDelete) {
          if (body[prop]) body[prop].cfg_list = [];
        }
      }
      // 会员权益
      else if (url.includes('membership/user')) {
        if (body.product_infos) {
          X.FeUtils.assign(body, {
            // request_id: 269895149694452300,
            product_infos: [
              // {
              //   product_id: '5310897792128633390',
              //   start_time: 1617260485,
              //   end_time: 2147483648,
              //   buy_time: '1417260485',
              //   cluster: 'offlinedl',
              //   detail_cluster: 'offlinedl',
              //   product_name: 'gz_telecom_exp',
              // },
              {
                product_id: '5210897752128663390', // 5310897792128633390
                end_time: 4102415999,
                buy_time: '1384234467',
                cluster: 'offlinedl',
                status: '0',
                start_time: 1384234467,
                function_num: 2,
                buy_description: '离线下载套餐(永久)',
                product_description: '离线下载套餐(永久)',
                detail_cluster: 'offlinedl',
                product_name: 'offlinedl_permanent',
              },
              {
                cur_svip_type: 'month',
                product_name: 'svip2_nd',
                product_description: '超级会员',
                function_num: 0, // 510004015
                start_time: 1688356160,
                buy_description: '',
                buy_time: 0,
                product_id: '',
                auto_upgrade_to_svip: 0,
                end_time: 4102415999,
                cluster: 'vip',
                detail_cluster: 'svip',
                status: 0,
              },
              {
                product_name: 'contentvip_nd',
                product_description: '',
                function_num: 0,
                start_time: 1688356160,
                buy_description: '',
                buy_time: 0,
                product_id: '',
                auto_upgrade_to_svip: 0,
                end_time: 4102415999,
                cluster: 'contentvip',
                detail_cluster: 'contentvip',
                status: 0,
              },
            ],
            center_skip_config: {
              action_type: 0,
              action_url: 'https://pan.baidu.com/buy/center?tag=8',
            },
            last_privilege_card_v2: {},
            current_privilege_card: [],
            current_product_v2: {
              product_id: '12187135090581539740',
              detail_cluster: 'svip',
              cluster: 'vip',
              product_type: 'vip2_1y_auto',
            },
            current_privilege_card_v2: {},
            up_product_infos: [],
            last_privilege_card: [],
            level_info: {
              history_value: 3470,
              current_level: 10,
              last_manual_collection_time: 0,
              current_value: 970,
              history_level: 3,
              v10_id: '',
            },
            user_tag:
              '{\\"has_buy_record\\":1,\\"has_buy_vip_svip_record\\":1,\\"last_buy_record_creat_time\\":1688356106,\\"is_vip\\":0,\\"is_svip\\":1,\\"last_vip_type\\":1,\\"last_vip_svip_end_time\\":4102415999,\\"is_svip_sign\\":0,\\"notice_user_type\\":2,\\"notice_user_status\\":3,\\"is_first_act\\":0,\\"is_first_charge\\":0}',
            // currenttime: 1690687707,
            previous_product: [],
            current_mvip_v2: {},
            current_product: {
              product_id: '12187135090581539740',
              detail_cluster: 'svip',
              cluster: 'vip',
              product_type: 'vip2_1y_auto',
            },
            reminder: {
              reminderWithContent: {
                title: '已拥有超级会员',
                notice: '5T大空间、极速下载等特权已拥有~',
              },
              advertiseContent: {
                url: 'https://yun.baidu.com/buy/center?tag=8&from=reminderpush1',
                title: '您的超级会员将于2099-12-31到期',
                notice: '5T大空间、极速下载等特权已拥有~',
              },
              svip: {
                leftseconds: 390692,
                nextState: 'normal',
              },
            },
            current_mvip: [],
            previous_product_v2: {},
            guide_data: {
              title: '超级会员 SVIP-Baby',
              content: '已拥有极速下载+视频倍速特权',
              button: {
                text: '会员中心',
                action_url: 'https://pan.baidu.com/wap/vip/user?from=myvip2#svip',
              },
            },
          });
        }

        if (body.identity_icon) {
          X.FeUtils.assign(body, {
            vip: {
              emotional_tips_back: {
                first: '',
                daily: ['一起走过的每一天，我给了陪伴，而你给了我成长。'],
              },
              emotional_tip_front: '陪你走过的每一天',
              guide_tip: ['墨鱼提醒：已享会员权限！'],
              expired_tip: '不再享有视频备份、在线解压等特权',
              expire_remind_tip: '将不再享有视频备份、在线解压等特权',
              status: 0,
            },
            vipv2: {
              status: 1,
            },
            identity_icon: {
              vip: 'https://internal-amis-res.cdn.bcebos.com/images/2019-8/1566452237582/78b88bf113b7.png',
              common: 'https://internal-amis-res.cdn.bcebos.com/images/2019-8/1566452539056/bf72cf66fae1.png',
              svip: 'https://internal-amis-res.cdn.bcebos.com/images/2019-8/1566452115696/38c1d743bfe9.png',
              contentvip: '',
            },
            // request_id: 270055727479044860,
            svip: {
              emotional_tips_back: {
                first: '很高兴你在x年x月x日成为超级会员，愿美好时光与你相伴。',
                daily: ['据说超级会员，法力无边'],
              },
              expire_remind_tip: '将不再享有极速下载、5T空间等特权',
              emotional_tip_front: '陪你走过的每一天',
              identity_icon_list: ['https://internal-amis-res.cdn.bcebos.com/images/2019-8/1566452115696/38c1d743bfe9.png', ''],
              status: 2,
              expired_tip: '不再享有极速下载、5T空间等特权',
              guide_tip: ['超级会员尊享5T空间和极速下载特权'],
              is_sign_user: false,
            },
            error_code: 0,
          });
        }

        if (body.tips_data_list) {
          X.FeUtils.assign(body, {
            tips_data_list: [],
            status_data: '超级会员至：2099-12-31',
            guide_data: {
              action_url: '',
              title: '超级会员SVIP',
              title_action_url: '',
              content: '已拥有极速下载+视频倍速等54项特权',
              button: {
                text: '等级提升',
                action_url: 'https://github.com/lzwme/x-scripts-rules/',
              },
            },
            user_status: 2,
            tips_data: {},
            user_type: 'svip',
            request_id: 270614190566302800,
            level_info: {
              last_manual_collection_time: 0,
              current_max_points: 500,
              current_value: 1490,
              history_level: 3,
              accumulated_uncollected_points: 0,
              v10_id: '',
              daily_value: 0,
              accumulated_day: 0,
              history_value: 3470,
              current_level: 2,
              accumulated_lost_points: 0,
              default_daily_value: 5,
            },
            v10_guide: {
              get_next_value_gap: true,
              tips: '升级还需要1510成长值，可享更多权益',
              button: {
                text: '立即加速',
                action_url: 'https://github.com/lzwme/x-scripts-rules/',
              },
              ab_test: false,
            },
            status_data_arr: ['超级会员至：2099-12-31'],
            new_guide_data: {
              action_url: '',
              title: 'SVIP V2',
              title_action_url: '',
              button: {
                text: '等级提升',
                action_url: 'https://github.com/lzwme/x-scripts-rules/',
              },
              sub_card_list: [
                {
                  content: '已解锁倍速超清权益',
                  icon_url: 'https://staticsns.cdn.bcebos.com/amis/2022-3/1646383463592/%E5%8A%A0%E9%80%9F%E5%8D%87%E7%BA%A7.png',
                  action_url: 'https://github.com/lzwme/x-scripts-rules/',
                },
              ],
            },
          });
        }

        hit = 1;
      }

      // 一刻相册
      else if (url.includes(yike)) {
        Object.assign(body, {
          // request_id: 342581654394297772,
          errno: 0,
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
  {
    on: 'req-header',
    ruleId: 'baiduCloudReject200',
    desc: '百度网盘广告过滤',
    method: '*',
    url: url => {
      const list = [
        // # > 百度网盘_设置信息流
        /^https?:\/\/pan\.baidu\.com\/act\/v\d\/(bchannel|welfare)\/list/,
        // # > 百度网盘_通用广告
        /^https?:\/\/pan.baidu.com\/rest\/.*\/pcs\/ad/,
        // # > 百度网盘_活动推广
        /^https?:\/\/pan\.baidu\.com\/act\/api\/activityentry/,
      ];

      for (const re of list) if (re.test(url)) return true;
    },
    handler: () => ({ body: '' }),
  },
];
