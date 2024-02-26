/*
 * @Author: renxia
 * @Date: 2024-02-28 10:08:29
 * @LastEditors: renxia
 * @LastEditTime: 2024-02-28 14:18:08
 * @Description: 待验证
 */

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  {
    // 参考： https://raw.githubusercontent.com/itcast-l/shadowrocket-module/main/js/BiliBiliHD.js
    on: 'res-body',
    ruleId: 'bilibiliHD',
    desc: 'B站高清解锁去广告',
    method: '*',
    url: 'https://*.bilibili.com/x/v2/**',
    cache: {
      bilibili_story_aid: '',
      bilibili_feed_black: '',
    },
    handler({ resBody: body, headers, url, X }) {
      if (!X.isText(headers) || Buffer.isBuffer(body) || typeof body !== 'object') return;

      // 更新时间：2023-01-29
      //Customize blacklist
      let blacklist = this.cache.bilibili_feed_black || [];
      let obj = body;
      let hit = 0;

      switch (true) {
        // 推荐去广告，最后问号不能去掉，以免匹配到story模式
        case /^https:\/\/app\.bilibili\.com\/x\/v2\/feed\/index\?/.test(url):
          try {
            let items = [];
            for (let item of obj['data']['items']) {
              if (item.hasOwnProperty('banner_item')) {
                let bannerItems = [];
                for (let banner of item['banner_item']) {
                  if (banner['type'] === 'ad') {
                    continue;
                  } else if (banner['static_banner'] && banner['static_banner']['is_ad_loc'] != true) {
                    bannerItems.push(banner);
                  }
                }
                // 去除广告后，如果banner大于等于1个才添加到响应体
                if (bannerItems.length >= 1) {
                  item['banner_item'] = bannerItems;
                  items.push(item);
                }
              } else if (
                !item.hasOwnProperty('ad_info') &&
                !blacklist.includes(item['args']['up_name']) &&
                item.card_goto.indexOf('ad') === -1 &&
                (item['card_type'] === 'small_cover_v2' ||
                  item['card_type'] === 'large_cover_v1' ||
                  item['card_type'] === 'large_cover_single_v9')
              ) {
                items.push(item);
              }
            }
            obj['data']['items'] = items;
            hit = 1;
          } catch (err) {
            console.error(`[${this.desc}]推荐去广告出现异常：`, err);
          }
          break;
        // 匹配story模式，用于记录Story的aid
        case /^https:\/\/app\.bilibili\.com\/x\/v2\/feed\/index\/story\?/.test(url):
          try {
            let items = [];
            for (let item of obj['data']['items']) {
              if (!item.hasOwnProperty('ad_info') && item.card_goto.indexOf('ad') === -1) {
                items.push(item);
              }
            }
            obj['data']['items'] = items;
            hit = 1;
          } catch (err) {
            console.error(`[${this.desc}]记录Story的aid出现异常：`, err);
          }
          break;

        // 标签页处理，如去除会员购等等
        case /^https?:\/\/app\.bilibili\.com\/x\/resource\/show\/tab/.test(url):
          try {
            const tabList = new Set([39, 40, 41, 774, 857, 545, 151, 442, 99, 100, 101, 554, 556]);

            const topList = new Set([176, 107]);

            const bottomList = new Set([177, 178, 179, 181, 102, 104, 106, 486, 488, 489]);

            if (obj['data']['tab']) {
              let tab = obj['data']['tab'].filter(e => {
                return tabList.has(e.id);
              });
              obj['data']['tab'] = tab;
            }
            // 将 id（222 & 107）调整为Story功能按钮
            let storyAid = this.cache.bilibili_story_aid || '246834163';

            if (obj['data']['top']) {
              let top = obj['data']['top'].filter(e => {
                if (e.id === 222 || e.id === 107) {
                  e.uri = `bilibili://story/${storyAid}`;
                  e.icon = 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/script/bilibili/bilibili_icon.png';
                  e.tab_id = 'Story_Top';
                  e.name = 'Story';
                }
                return topList.has(e.id);
              });
              obj['data']['top'] = top;
            }
            if (obj['data']['bottom']) {
              let bottom = obj['data']['bottom'].filter(e => {
                return bottomList.has(e.id);
              });
              obj['data']['bottom'] = bottom;
            }
            hit = 1;
          } catch (err) {
            console.error(`[${this.desc}]标签页处理出现异常：`, err);
          }
          break;
        // 我的页面处理，去除一些推广按钮
        case /^https?:\/\/app\.bilibili\.com\/x\/v2\/account\/mine/.test(url):
          try {
            const itemList = new Set([
              396, 397, 398, 399, 402, 404, 407, 410, 425, 426, 427, 428, 430, 432, 433, 434, 494, 495, 496, 497, 500, 501,
            ]);
            obj['data']['sections_v2'].forEach((element, index) => {
              element['items'].forEach(e => {
                if (e['id'] === 622) {
                  e['title'] = '会员购';
                  e['uri'] = 'bilibili://mall/home';
                }
              });
              let items = element['items'].filter(e => {
                return itemList.has(e.id);
              });
              obj['data']['sections_v2'][index].button = {};
              delete obj['data']['sections_v2'][index].be_up_title;
              delete obj['data']['sections_v2'][index].tip_icon;
              delete obj['data']['sections_v2'][index].tip_title;
              //2022-02-16 add by ddgksf2013
              for (let ii = 0; ii < obj['data']['sections_v2'].length; ii++) {
                if (obj.data.sections_v2[ii].title == '推荐服务' || obj.data.sections_v2[ii].title == '推薦服務') {
                  //obj.data.sections_v2[ii].items[0].title='\u516C\u773E\u865F';
                  //obj.data.sections_v2[ii].items[1].title='\u58A8\u9B5A\u624B\u8A18';
                }
                if (obj.data.sections_v2[ii].title == '更多服務' || obj.data.sections_v2[ii].title == '更多服务') {
                  if (obj.data.sections_v2[ii].items[0].id == 500) {
                    //obj.data.sections_v2[ii].items[0].title='\u516C\u773E\u865F';
                  }
                  if (obj.data.sections_v2[ii].items[1].id == 501) {
                    //obj.data.sections_v2[ii].items[1].title='\u58A8\u9B5A\u624B\u8A18';
                  }
                }
                if (obj.data.sections_v2[ii].title == '创作中心' || obj.data.sections_v2[ii].title == '創作中心') {
                  delete obj.data.sections_v2[ii].title;
                  delete obj.data.sections_v2[ii].type;
                }
              }
              delete obj.data.vip_section_v2;
              delete obj.data.vip_section;
              obj['data']['sections_v2'][index]['items'] = items;
              //2022-03-05 add by ddgksf2013
              if (obj.data.hasOwnProperty('live_tip')) {
                obj['data']['live_tip'] = {};
              }
              if (obj.data.hasOwnProperty('answer')) {
                obj['data']['answer'] = {};
              }
              obj['data']['vip_type'] = 2;
              obj['data']['vip']['type'] = 2;
              obj['data']['vip']['status'] = 1;
              obj['data']['vip']['vip_pay_type'] = 1;
              obj['data']['vip']['due_date'] = 4669824160;
            });
            hit = 1;
          } catch (err) {
            console.error(`[${this.desc}]我的页面处理出现异常：`, err);
          }
          break;
        // 直播去广告
        case /^https?:\/\/api\.live\.bilibili\.com\/xlive\/app-room\/v1\/index\/getInfoByRoom/.test(url):
          try {
            obj['data']['activity_banner_info'] = null;
            hit = 1;
          } catch (err) {
            console.error(`[${this.desc}]直播去广告出现异常：`, err);
          }
          break;
        //屏蔽热搜
        case /^https?:\/\/app\.bilibili\.com\/x\/v2\/search\/square/.test(url):
          try {
            obj.data = {
              type: 'history',
              title: '搜索历史',
              search_hotword_revision: 2,
            };
            hit = 1;
          } catch (err) {
            console.error(`[${this.desc}]热搜去广告出现异常：`, err);
          }
          break;
        //2022-03-05 add by ddgksf2013
        case /https?:\/\/app\.bilibili\.com\/x\/v2\/account\/myinfo\?/.test(url):
          try {
            //magicJS.logInfo(`公众号墨鱼手记`);
            obj['data']['vip']['type'] = 2;
            obj['data']['vip']['status'] = 1;
            obj['data']['vip']['vip_pay_type'] = 1;
            obj['data']['vip']['due_date'] = 4669824160;
            hit = 1;
          } catch (err) {
            console.error(`[${this.desc}]1080P出现异常：`, err);
          }
          break;
        // 追番去广告
        case /pgc\/page\/bangumi/.test(url):
          try {
            obj.result.modules.forEach(module => {
              // 头部banner
              if (module.style.startsWith('banner')) {
                //i.source_content && i.source_content.ad_content
                module.items = module.items.filter(i => !(i.link.indexOf('play') == -1));
              }
              if (module.style.startsWith('function')) {
                module.items = module.items.filter(i => i.blink.indexOf('www.bilibili.com') == -1);
              }
              if (module.style.startsWith('tip')) {
                module.items = null;
              }
            });
            hit = 1;
          } catch (err) {
            console.error(`[${this.desc}]追番去广告出现异常：`, err);
          }
          break;
        // 观影页去广告
        case /pgc\/page\/cinema\/tab\?/.test(url):
          try {
            obj.result.modules.forEach(module => {
              // 头部banner
              if (module.style.startsWith('banner')) {
                module.items = module.items.filter(i => !(i.link.indexOf('play') == -1));
              }
              if (module.style.startsWith('function')) {
                module.items = module.items.filter(i => i.blink.indexOf('www.bilibili.com') == -1);
              }
              if (module.style.startsWith('tip')) {
                module.items = null;
              }
            });
            hit = 1;
          } catch (err) {
            console.error(`[${this.desc}]观影页去广告出现异常：`, err);
          }
          break;
        // 动态去广告
        case /^https?:\/\/api\.vc\.bilibili\.com\/dynamic_svr\/v1\/dynamic_svr\/dynamic_(history|new)\?/.test(url):
          try {
            let cards = [];
            obj.data.cards.forEach(element => {
              if (element.hasOwnProperty('display') && element.card.indexOf('ad_ctx') <= 0) {
                // 解决number类型精度问题导致B站动态中图片无法打开的问题
                element['desc']['dynamic_id'] = element['desc']['dynamic_id_str'];
                element['desc']['pre_dy_id'] = element['desc']['pre_dy_id_str'];
                element['desc']['orig_dy_id'] = element['desc']['orig_dy_id_str'];
                element['desc']['rid'] = element['desc']['rid_str'];
                cards.push(element);
              }
            });
            obj.data.cards = cards;
            hit = 1;
          } catch (err) {
            console.error(`[${this.desc}]动态去广告出现异常：`, err);
          }
          break;
        // 去除统一设置的皮肤
        case /^https?:\/\/app\.bilibili\.com\/x\/resource\/show\/skin\?/.test(url):
          if (obj?.data?.common_equip?.package_url) {
            //obj["data"]["common_equip"]["package_url"] = "";
            // hit = 1;
          }
          break;
        // 开屏广告（预加载）如果粗暴地关掉，那么就使用预加载的数据，就会导致关不掉
        case /^https:\/\/app\.bilibili\.com\/x\/v2\/splash\/list/.test(url):
          try {
            if (obj.data) {
              for (let item of obj['data']['list']) {
                item['duration'] = 0; // 显示时间
                // 2040 年
                item['begin_time'] = 2240150400;
                item['end_time'] = 2240150400;
              }
            }
            hit = 1;
          } catch (err) {
            console.error(`[${this.desc}]开屏广告（预加载）出现异常：`, err);
          }
          break;
        default:
          // console.warn('触发意外的请求处理，请确认脚本或复写配置正常。', url);
          return;
      }

      if (hit) {
        const color = X.FeUtils.color;
        console.log(`[${color.cyan(this.desc)}]`, color.gray(url));
        return { body: obj };
      }
    },
  },
];
