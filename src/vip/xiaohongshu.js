/*
 * @Author: renxia
 * @Date: 2024-02-28 10:08:29
 * @LastEditors: renxia
 * @LastEditTime: 2024-03-04 16:26:10
 * @Description: 待验证
 */

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  {
    on: 'res-body',
    ruleId: 'xiaohongshuVip',
    desc: '小红书去广告、解除下载限制、画质增强等',
    method: '*',
    mitm: '*.xiaohongshu.com',
    url: 'https://*.xiaohongshu.com/v{1,2,3,4,6,10}/**',
    handler({ resBody: body, url, X }) {
      if (!body || typeof body !== 'object') return;
      const color = X.FeUtils.color;
      console.log(`[${this.desc}]`, color.gray(url));

      if (url.includes('/v1/search/banner_list')) {
        if (body.data) {
          body.data = {};
        }
      } else if (url.includes('/v1/search/hot_list')) {
        // 热搜列表
        if (body.data?.items?.length > 0) {
          body.data.items = [];
        }
      } else if (url.includes('/v1/system_service/config')) {
        // 整体配置
        const item = ['app_theme', 'loading_img', 'splash', 'store'];
        if (body.data) {
          for (let i of item) {
            delete body.data[i];
          }
        }
      } else if (url.includes('/v2/note/widgets')) {
        const item = ['generic'];
        if (body.data) {
          for (let i of item) {
            delete body.data[i];
          }
        }
      } else if (url.includes('/v2/note/feed')) {
        // 信息流 图片
        if (body.data?.length > 0) {
          let data0 = body.data[0];
          if (data0?.note_list?.length > 0) {
            for (let item of data0.note_list) {
              if (item?.media_save_config) {
                // 水印
                item.media_save_config.disable_save = false;
                item.media_save_config.disable_watermark = true;
                item.media_save_config.disable_weibo_cover = true;
              }
              if (item?.share_info?.function_entries?.length > 0) {
                // 下载限制
                const additem = { type: 'video_download' };
                let func = item.share_info.function_entries[0];
                if (func?.type !== 'video_download') {
                  // 向数组开头添加对象
                  item.share_info.function_entries.unshift(additem);
                }
              }
            }
          }
        }
        const images_list = body.data[0].note_list[0].images_list;
        body.data[0].note_list[0].images_list = imageEnhance(JSON.stringify(images_list));

        // 保存无水印信息
        this['fmz200.xiaohongshu.feed.rsp'] = images_list;
        console.log('已存储无水印信息♻️');
      } else if (url.includes('/v3/note/videofeed')) {
        // 信息流 视频
        if (body.data?.length > 0) {
          for (let item of body.data) {
            if (item?.media_save_config) {
              // 水印
              item.media_save_config.disable_save = false;
              item.media_save_config.disable_watermark = true;
              item.media_save_config.disable_weibo_cover = true;
            }
            if (item?.share_info?.function_entries?.length > 0) {
              // 下载限制
              const additem = { type: 'video_download' };
              let func = item.share_info.function_entries[0];
              if (func?.type !== 'video_download') {
                // 向数组开头添加对象
                item.share_info.function_entries.unshift(additem);
              }
            }
          }
        }
      } else if (url.includes('/v2/system_service/splash_config')) {
        // 开屏广告
        if (body.data?.ads_groups?.length > 0) {
          for (let i of body.data.ads_groups) {
            i.start_time = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
            i.end_time = 2209046399; // Unix 时间戳 2040-01-01 23:59:59
            if (i?.ads?.length > 0) {
              for (let ii of i.ads) {
                ii.start_time = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
                ii.end_time = 2209046399; // Unix 时间戳 2040-01-01 23:59:59
              }
            }
          }
        }
      } else if (url.includes('/v4/followfeed')) {
        // 关注列表
        if (body.data?.items?.length > 0) {
          // recommend_user 可能感兴趣的人
          body.data.items = body.data.items.filter(i => !['recommend_user'].includes(i.recommend_reason));
        }
      } else if (url.includes('/v4/search/trending')) {
        // 搜索栏
        if (body.data?.queries?.length > 0) {
          body.data.queries = [];
        }
        if (body.data?.hint_word) {
          body.data.hint_word = {};
        }
      } else if (url.includes('/v4/search/hint')) {
        // 搜索栏填充词
        if (body.data?.hint_words?.length > 0) {
          body.data.hint_words = [];
        }
      } else if (url.includes('/v6/homefeed')) {
        if (body.data?.length > 0) {
          // 信息流广告
          let newItems = [];
          for (let item of body.data) {
            if (item?.model_type === 'live_v2') {
              // 信息流-直播
            } else if (item?.hasOwnProperty('ads_info')) {
              // 信息流-赞助
            } else if (item?.hasOwnProperty('card_icon')) {
              // 信息流-带货
            } else if (item?.note_attributes?.includes('goods')) {
              // 信息流-商品
            } else {
              if (item?.related_ques) {
                delete item.related_ques;
              }
              newItems.push(item);
            }
          }
          body.data = newItems;
        }
      } else if (url.includes('/v10/search/notes')) {
        // 搜索结果
        if (body.data?.items?.length > 0) {
          body.data.items = body.data.items.filter(i => i.model_type === 'note');
        }
      } else if (url.includes('/v1/note/live_photo/save')) {
        console.log('原body：' + rsp_body);
        const rsp = this['fmz200.xiaohongshu.feed.rsp'];
        console.log('读取缓存key：fmz200.xiaohongshu.feed.rsp');
        // console.log("读取缓存val：" + rsp);
        if (rsp == null) {
          console.log('缓存无内容，返回原body');
          return;
        }

        const cache_body = rsp;
        let new_data = [];
        for (const images of cache_body) {
          if (images.live_photo_file_id) {
            const item = {
              file_id: images.live_photo_file_id,
              video_id: images.live_photo.media.video_id,
              url: images.live_photo.media.stream.h265[0].master_url,
            };
            new_data.push(item);
          }
        }
        if (body.data.datas) {
          replaceUrlContent(body.data.datas, new_data);
        } else {
          body = { code: 0, success: true, msg: '成功', data: { datas: new_data } };
        }
      }

      return { body };
    },
  },
  {
    on: 'res-body',
    ruleId: 'xiaohongshuVip',
    desc: '小红书去广告、解除下载限制、画质增强等',
    method: '*',
    mitm: '*.xiaohongshu.com',
    url: 'https://edith.xiaohongshu.com/api/sns/v*/{note,homefeed,system_service,search}**',
    handler({ resBody: body, url, X }) {
      // @see https://raw.githubusercontent.com/ddgksf2013/Scripts/master/redbook_json.js
      if (body) {
        switch (!0) {
          case /api\/sns\/v\d\/note\/widgets/.test(url):
            try {
              let e = body,
                t = ['goods_card_v2', 'note_next_step'];
              for (let a of t) e.data?.[a] && delete e.data[a];
            } catch (s) {
              console.log('widgets: ' + s);
            }
            break;
          case /api\/sns\/v\d\/note\/redtube/.test(url):
            try {
              let o = body;
              for (let d of o.data.items)
                d.related_goods_num && (d.related_goods_num = 0),
                  d.has_related_goods && (d.has_related_goods = !1),
                  d.media_save_config && (d.media_save_config = { disable_save: !1, disable_watermark: !0, disable_weibo_cover: !0 }),
                  d.share_info &&
                    (d.share_info.function_entries = [
                      { type: 'video_download' },
                      { type: 'generate_image' },
                      { type: 'copy_link' },
                      { type: 'native_voice' },
                      { type: 'video_speed' },
                      { type: 'dislike' },
                      { type: 'report' },
                      { type: 'video_feedback' },
                    ]);
            } catch (r) {
              console.log('redtube: ' + r);
            }
            break;
          case /api\/sns\/v\d\/note\/videofeed/.test(url):
            try {
              let i = body;
              for (let l of i.data)
                l.related_goods_num && (l.related_goods_num = 0),
                  l.has_related_goods && (l.has_related_goods = !1),
                  l.media_save_config && (l.media_save_config = { disable_save: !1, disable_watermark: !0, disable_weibo_cover: !0 }),
                  l.share_info &&
                    (l.share_info.function_entries = [
                      { type: 'video_download' },
                      { type: 'generate_image' },
                      { type: 'copy_link' },
                      { type: 'native_voice' },
                      { type: 'video_speed' },
                      { type: 'dislike' },
                      { type: 'report' },
                      { type: 'video_feedback' },
                    ]);
            } catch (n) {
              console.log('videofeed: ' + n);
            }
            break;
          case /api\/sns\/v\d\/note\/feed/.test(url):
            try {
              let c = body;
              for (let y of c.data)
                if ((y.related_goods_num && (y.related_goods_num = 0), y.has_related_goods && (y.has_related_goods = !1), y.note_list))
                  for (let g of y.note_list) g.media_save_config = { disable_save: !1, disable_watermark: !0, disable_weibo_cover: !0 };
            } catch (f) {
              console.log('feed: ' + f);
            }
            break;
          case /api\/sns\/v\d\/homefeed\/categories\?/.test(url):
            try {
              let b = body;
              b.data.categories = b.data.categories.filter(e => !('homefeed.shop' == e.oid || 'homefeed.live' == e.oid));
            } catch (p) {
              console.log('categories: ' + p);
            }
            break;
          case /api\/sns\/v\d\/search\/hint/.test(url):
            try {
              let h = body;
              h.data?.hint_words &&
                (h.data.hint_words = [{ title: '搜索笔记', type: 'firstEnterOther#itemCfRecWord#搜索笔记#1', search_word: '搜索笔记' }]);
            } catch (v) {
              console.log('hint: ' + v);
            }
            break;
          case /api\/sns\/v\d\/search\/hot_list/.test(url):
            try {
              let m = body;
              m.data = { scene: '', title: '', items: [], host: '', background_color: {}, word_request_id: '' };
            } catch (u) {
              console.log('hot_list: ' + u);
            }
            break;
          case /api\/sns\/v\d\/search\/trending/.test(url):
            try {
              let k = body;
              k.data = { title: '', queries: [], type: '', word_request_id: '' };
            } catch (e) {
              console.log('trending: ', e);
            }
            break;
          case /api\/sns\/v\d\/system_service\/splash_config/.test(url):
            try {
              let w = body;
              w.data.ads_groups.forEach(e => {
                (e.start_time = '2208963661'),
                  (e.end_time = '2209050061'),
                  e.ads &&
                    e.ads.forEach(e => {
                      (e.start_time = '2208963661'), (e.end_time = '2209050061');
                    });
              });
            } catch (_) {
              console.log('splash_config: ' + _);
            }
            break;
          case /api\/sns\/v\d\/homefeed\?/.test(url):
            try {
              let q = body;
              q.data = q.data.filter(e => !e.is_ads);
            } catch (E) {
              console.log('homefeed: ' + E);
            }
            break;
          case /api\/sns\/v\d\/system_service\/config\?/.test(url):
            try {
              let x = body,
                C = ['store', 'splash', 'loading_img', 'app_theme', 'cmt_words', 'highlight_tab'];
              for (let O of C) x.data?.[O] && delete x.data[O];
            } catch (R) {
              console.log('system_service: ' + R);
            }
            break;
          default:
            return;
        }
        return { body };
      }
    },
  },
];

// 小红书画质增强：加载2K分辨率的图片
function imageEnhance(jsonStr) {
  const regex1 = /imageView2\/2\/w\/\d+\/format/g;
  jsonStr = jsonStr.replace(regex1, `imageView2/2/w/2160/format`);

  const regex2 = /imageView2\/2\/h\/\d+\/format/g;
  jsonStr = jsonStr.replace(regex2, `imageView2/2/h/2160/format`);
  console.log('图片画质增强完成✅');
  return JSON.parse(jsonStr);
}

function replaceUrlContent(collectionA, collectionB) {
  console.log('替换无水印的URL');
  collectionA.forEach(itemA => {
    const matchingItemB = collectionB.find(itemB => itemB.file_id === itemA.file_id);
    if (matchingItemB) {
      itemA.url = itemA.url.replace(/(.*)\.mp4/, `${matchingItemB.url.match(/(.*)\.mp4/)[1]}.mp4`);
      itemA.author = '@renxia';
    }
  });
}
