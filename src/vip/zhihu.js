/*
 * @Author: renxia
 * @Date: 2024-02-28 10:08:29
 * @LastEditors: renxia
 * @LastEditTime: 2024-02-28 15:21:03
 * @Description: 待验证
 */

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  {
    on: 'res-body',
    ruleId: 'zhihuFilter',
    desc: '知乎去广告',
    method: '*',
    url: 'https://{api,www,m-cloud,appcloud2}.zhihu.com/**',
    handler({ resBody: body, headers, url, X }) {
      if (!X.isText(headers) || Buffer.isBuffer(body) || typeof body !== 'object') return;

      let hit = 0;
      if ('svip_privileges' in body) {
        hit = 1;
        body.svip_privileges = true;
      }

      if (body.right?.ownership === false) {
        hit = 1;
        Object.assign(body, {
          ownership: true,
          purchased: true,
          anonymous: true,
        });
      }

      if (!hit) {
        const regList = [
          /^https:\/\/api\.zhihu\.com\/commercial_api\/app_float_layer/,
          /^https:\/\/api\.zhihu\.com\/feed\/render\/tab\/config/,
          /^https:\/\/api\.zhihu\.com\/(moments_v3|topstory\/hot-lists\/total|topstory\/recommend)/,
          /^https:\/\/api\.zhihu\.com\/v2\/topstory\/hot-lists\/everyone-seeing/,
          /^https:\/\/api\.zhihu\.com\/next-(bff|data|render)/,
          /^https:\/\/api\.zhihu\.com\/questions\/\d+(\/answers|\/feeds|\?include=)/,
          /^https:\/\/www\.zhihu\.com\/api\/v4\/(articles|answers)\/\d+\/recommendations?/,
          /^https:\/\/appcloud2\.zhihu\.com\/v3\/config/,
          /^https:\/\/m-cloud\.zhihu\.com\/api\/cloud\/config\/all/,
          /sku\/reversion_sku_ext/,
          /people\/self/,
          /unlimited\/go\/my_card/,
          /\/books\/\d+/,
        ];
        if (!regList.some(reg => reg.test(url))) return;
      }

      const color = X.FeUtils.color;
      console.log(`[${this.desc}]`, color.gray(url));

      // 参考： https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/zhihu.js
      // 2023-11-17 11:30

      let obj = body;
      let bodyStr = JSON.stringify(body);

      if (body.vip_info && url.indexOf('people/self') != -1) {
        X.FeUtils.assgin(body, {
          vip_info: {
            is_vip: true,
            vip_type: 1,
          },
        });
        hit = 1;

        return { body };
      }

      if (url.indexOf('unlimited/go/my_card') != -1) {
        X.FeUtils.assgin(body, {
          button_text: '点击反馈',
          jump_url: 'https://github.com/lzwme/x-scripts-rules/issues',
          title: '2999-09-09到期',
          songNeedPay: 0,
        });

        return { body };
      }

      if (url.indexOf('sku/reversion_sku_ext') != -1) {
        body.data.center.buttons[1].sub_text = '无法观看？点击此处反馈！';
        body.data.center.buttons[1].link_url = 'https://github.com/lzwme/x-scripts-rules/issues';
        body.data.center.buttons[1].button_text = '已解锁该内容';
        body.data.bottom.buttons[1].button_text = '立即阅读';
        body.data.center.buttons[0].sub_text = '已解锁';
        return { body };
      }

      if (url.includes('/api/cloud/config/all')) {
        if (obj?.data?.configs) {
          obj.data.configs.forEach(i => {
            if (i.configKey === 'feed_gray_theme') {
              if (i.configValue) {
                i.configValue.start_time = '3818332800'; // Unix 时间戳 2090-12-31 00:00:00
                i.configValue.end_time = '3818419199'; // Unix 时间戳 2090-12-31 23:59:59
                i.status = false;
              }
            } else if (i.configKey === 'feed_top_res') {
              if (i.configValue) {
                i.configValue.start_time = '3818332800'; // Unix 时间戳 2090-12-31 00:00:00
                i.configValue.end_time = '3818419199'; // Unix 时间戳 2090-12-31 23:59:59
                i.status = false;
              }
            }
          });
        }
      } else if (url.includes('/api/v4/answers')) {
        if (obj?.data) {
          delete obj.data;
        }
        if (obj?.paging) {
          delete obj.paging;
        }
      } else if (url.includes('/api/v4/articles')) {
        const item = ['ad_info', 'paging', 'recommend_info'];
        item.forEach(i => {
          delete obj[i];
        });
      } else if (url.includes('.zhihu.com/v3/config')) {
        if (obj?.config) {
          if (obj.config?.homepage_feed_tab) {
            obj.config.homepage_feed_tab.tab_infos = obj.config.homepage_feed_tab.tab_infos.filter(i => {
              if (i.tab_type === 'activity_tab') {
                i.start_time = '3818332800'; // Unix 时间戳 2090-12-31 00:00:00
                i.end_time = '3818419199'; // Unix 时间戳 2090-12-31 23:59:59
                return true;
              } else {
                return false;
              }
            });
          }
          if (obj.config?.hp_channel_tab) {
            delete obj.config.hp_channel_tab;
          }
          if (obj.config?.zombie_conf) {
            obj.config.zombie_conf.zombieEnable = false;
          }
          if (obj.config?.gray_mode) {
            obj.config.gray_modeenable = false;
            obj.config.gray_mode.start_time = '3818332800'; // Unix 时间戳 2090-12-31 00:00:00
            obj.config.gray_mode.end_time = '3818419199'; // Unix 时间戳 2090-12-31 23:59:59
          }
          if (obj.config?.zhcnh_thread_sync) {
            obj.config.zhcnh_thread_sync.LocalDNSSetHostWhiteList = [];
            obj.config.zhcnh_thread_sync.isOpenLocalDNS = '0';
            obj.config.zhcnh_thread_sync.ZHBackUpIP_Switch_Open = '0';
            obj.config.zhcnh_thread_sync.dns_ip_detector_operation_lock = '1';
            obj.config.zhcnh_thread_sync.ZHHTTPSessionManager_setupZHHTTPHeaderField = '1';
          }
          obj.config.zvideo_max_number = 1;
          obj.config.is_show_followguide_alert = false;
        }
      } else if (url.includes('/commercial_api/app_float_layer')) {
        // 悬浮图标
        if ('feed_egg' in obj) {
          delete obj.feed_egg;
        }
      } else if (url.includes('/feed/render/tab/config')) {
        if (obj?.selected_sections?.length > 0) {
          // 首页顶部tab
          obj.selected_sections = obj.selected_sections.filter(i => !['activity', 'live']?.includes(i?.tab_type));
        }
      } else if (url.includes('/moments_v3')) {
        if (obj?.data?.length > 0) {
          obj.data = obj.data.filter(i => !i?.title?.includes('为您推荐'));
        }
      } else if (url.includes('/next-bff')) {
        if (obj?.data?.length > 0) {
          obj.data = obj.data.filter(
            i =>
              !(
                i?.origin_data?.type?.includes('ad') ||
                i?.origin_data?.resource_type?.includes('ad') ||
                i?.origin_data?.next_guide?.title?.includes('推荐')
              )
          );
        }
      } else if (url.includes('/next-data')) {
        if (obj?.data?.data?.length > 0) {
          obj.data.data = obj.data.data.filter(i => !(i?.type?.includes('ad') || i?.data?.answer_type?.includes('PAID')));
        }
      } else if (url.includes('/next-render')) {
        if (obj?.data?.length > 0) {
          obj.data = obj.data.filter(
            i =>
              !(
                i?.adjson ||
                i?.biz_type_list?.includes('article') ||
                i?.biz_type_list?.includes('content') ||
                i?.business_type?.includes('paid') ||
                i?.section_info ||
                i?.tips ||
                i?.type?.includes('ad')
              )
          );
        }
      } else if (url.includes('/questions/')) {
        // 问题回答列表
        if (obj?.data?.length > 0) {
          obj.data = obj.data.filter(i => !i?.target?.answer_type?.includes('paid'));
        }
        if (obj?.data?.ad_info) {
          delete obj.data.ad_info;
        }
        if (obj?.ad_info) {
          delete obj.ad_info;
        }
        if (obj?.query_info) {
          delete obj.query_info;
        }
      } else if (url.includes('/topstory/hot-lists/everyone-seeing')) {
        // 热榜信息流
        if (obj?.data?.data?.length > 0) {
          // 合作推广
          obj.data.data = obj.data.data.filter(i => !i.target?.metrics_area?.text?.includes('合作推广'));
        }
      } else if (url.includes('/topstory/hot-lists/total')) {
        // 热榜排行榜
        if (obj?.data?.length > 0) {
          // 品牌甄选
          obj.data = obj.data.filter(i => !i?.hasOwnProperty('ad'));
        }
      } else if (url.includes('/topstory/recommend')) {
        // 推荐信息流
        if (obj.data?.length > 0) {
          obj.data = obj.data.filter(i => {
            if (i.type === 'market_card' && i.fields?.header?.url && i.fields.body?.video?.id) {
              let videoID = getUrlParamValue(item.fields.header.url, 'videoID');
              if (videoID) {
                i.fields.body.video.id = videoID;
              }
            } else if (i.type === 'common_card') {
              if (i.extra?.type === 'drama') {
                // 直播内容
                return false;
              } else if (i.extra?.type === 'zvideo') {
                // 推广视频
                let videoUrl = i.common_card.feed_content.video.customized_page_url;
                let videoID = getUrlParamValue(videoUrl, 'videoID');
                if (videoID) {
                  i.common_card.feed_content.video.id = videoID;
                }
              } else if (i.common_card?.feed_content?.video?.id) {
                let search = '"feed_content":{"video":{"id":';
                let str = bodyStr.substring(bodyStr.indexOf(search) + search.length);
                let videoID = str.substring(0, str.indexOf(','));
                i.common_card.feed_content.video.id = videoID;
              } else if (i.common_card?.footline?.elements?.[0]?.text?.panel_text?.includes('广告')) {
                return false;
              } else if (i.common_card?.feed_content?.source_line?.elements?.[1]?.text?.panel_text?.includes('盐选')) {
                return false;
              } else if (i?.promotion_extra) {
                // 营销信息
                return false;
              }
              return true;
            } else if (i.type.includes('aggregation_card')) {
              // 横排卡片 知乎热榜
              return false;
            } else if (i.type === 'feed_advert') {
              // 伪装成正常内容的卡片
              return false;
            }
            return true;
          });
          fixPos(obj.data);
        }
      }

      return { body: obj };
    },
  },
];

// 修复offset
function fixPos(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].offset = i + 1;
  }
}

function getUrlParamValue(url, queryName) {
  return Object.fromEntries(
    url
      .substring(url.indexOf('?') + 1)
      .split('&')
      .map(pair => pair.split('='))
  )[queryName];
}
