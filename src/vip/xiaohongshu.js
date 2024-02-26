/*
 * @Author: renxia
 * @Date: 2024-02-28 10:08:29
 * @LastEditors: renxia
 * @LastEditTime: 2024-02-28 11:43:56
 * @Description: 待验证
 */

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  {
    on: 'res-body',
    ruleId: 'xiaohongshuVip',
    desc: '小红书去广告、解除下载限制、画质增强等',
    method: '*',
    url: 'https://*.xiaohongshu.com/v{1,2,3,4,6,10}/**',
    handler({ resBody: body, url, X }) {
      if (typeof body !== 'object') return;
      const color = X.FeUtils.color;
      console.log(`[${this.desc}]`, color.gray(url));

      let obj = body;

      if (url.includes('/v1/search/banner_list')) {
        if (obj?.data) {
          obj.data = {};
        }
      } else if (url.includes('/v1/search/hot_list')) {
        // 热搜列表
        if (obj?.data?.items?.length > 0) {
          obj.data.items = [];
        }
      } else if (url.includes('/v1/system_service/config')) {
        // 整体配置
        const item = ['app_theme', 'loading_img', 'splash', 'store'];
        if (obj?.data) {
          for (let i of item) {
            delete obj.data[i];
          }
        }
      } else if (url.includes('/v2/note/widgets')) {
        const item = ['generic'];
        if (obj?.data) {
          for (let i of item) {
            delete obj.data[i];
          }
        }
      } else if (url.includes('/v2/note/feed')) {
        // 信息流 图片
        if (obj?.data?.length > 0) {
          let data0 = obj.data[0];
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
        const images_list = obj.data[0].note_list[0].images_list;
        obj.data[0].note_list[0].images_list = imageEnhance(JSON.stringify(images_list));

        // 保存无水印信息
        this['fmz200.xiaohongshu.feed.rsp'] = images_list;
        console.log('已存储无水印信息♻️');
      } else if (url.includes('/v3/note/videofeed')) {
        // 信息流 视频
        if (obj?.data?.length > 0) {
          for (let item of obj.data) {
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
        if (obj?.data?.ads_groups?.length > 0) {
          for (let i of obj.data.ads_groups) {
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
        if (obj?.data?.items?.length > 0) {
          // recommend_user 可能感兴趣的人
          obj.data.items = obj.data.items.filter(i => !['recommend_user'].includes(i.recommend_reason));
        }
      } else if (url.includes('/v4/search/trending')) {
        // 搜索栏
        if (obj?.data?.queries?.length > 0) {
          obj.data.queries = [];
        }
        if (obj?.data?.hint_word) {
          obj.data.hint_word = {};
        }
      } else if (url.includes('/v4/search/hint')) {
        // 搜索栏填充词
        if (obj?.data?.hint_words?.length > 0) {
          obj.data.hint_words = [];
        }
      } else if (url.includes('/v6/homefeed')) {
        if (obj?.data?.length > 0) {
          // 信息流广告
          let newItems = [];
          for (let item of obj.data) {
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
          obj.data = newItems;
        }
      } else if (url.includes('/v10/search/notes')) {
        // 搜索结果
        if (obj?.data?.items?.length > 0) {
          obj.data.items = obj.data.items.filter(i => i.model_type === 'note');
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
        if (obj.data.datas) {
          replaceUrlContent(obj.data.datas, new_data);
        } else {
          obj = { code: 0, success: true, msg: '成功', data: { datas: new_data } };
        }
        console.log('新body：' + JSON.stringify(obj));
      }

      return { body };
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
