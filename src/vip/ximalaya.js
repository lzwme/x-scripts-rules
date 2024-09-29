/*
 * @Author: renxia
 * @Date: 2024-02-28 10:08:29
 * @LastEditors: renxia
 * @LastEditTime: 2024-09-30 11:27:14
 * @Description: 待验证
 */

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  {
    // @see https://github.com/ddgksf2013/Scripts/raw/master/ximalaya_json.js
    on: 'res-body',
    ruleId: 'ximalayaADBlock',
    desc: '喜马拉雅去广告',
    method: '*',
    url: 'https://*.ximalaya.com/{focus-mobile,discovery-feed,discovery-category,mobile-user,mobile-playpage,starwar,mobile,product}/**',
    handler({ resBody: body, url, X }) {
      if (!body || Buffer.isBuffer(body)) return;
      if (typeof body === 'string') return;

      const color = X.FeUtils.color;
      console.log(`[${this.desc}]`, color.gray(url));
      let hit = commModify(body);

      switch (!0) {
        case /discovery-category\/customCategories/.test(url):
          try {
            let e = body;
            if (e.customCategoryList) {
              e.customCategoryList = e.customCategoryList.filter(
                e =>
                  ('recommend' == e.itemType || 'template_category' == e.itemType || 'single_category' == e.itemType) &&
                  1005 !== e.categoryId
              );
              hit++;
            }
            if (e.defaultTabList) {
              e.defaultTabList = e.defaultTabList.filter(
                e =>
                  ('recommend' == e.itemType || 'template_category' == e.itemType || 'single_category' == e.itemType) &&
                  1005 !== e.categoryId
              );
              hit++;
            }
          } catch (t) {
            console.log('customCategories: ' + t);
          }
          break;
        case /discovery-category\/v\d\/category/.test(url):
          try {
            let a = body;
            if (a.focusImages && a.focusImages.data) {
              a.focusImages.data = a.focusImages.data.filter(e => -1 != e.realLink.indexOf('open') && !e.isAd);
              hit++;
            }
          } catch (r) {
            console.log('categories: ' + r);
          }
          break;
        case /focus-mobile\/focusPic/.test(url):
          try {
            let s = body;
            if (s.header && s.header.length <= 1) {
              s.header[0].item.list[0].data = s.header[0].item.list[0].data.filter(e => -1 != e.realLink.indexOf('open') && !e.isAd);
              hit++;
            }
          } catch (i) {
            console.log('discovery-feed' + i);
          }
          break;
        case /discovery-feed\/v\d\/mix/.test(url):
          try {
            if (body.header?.length == 2) {
              delete body.header[0];
              body.body = body.body.filter(e => !(e.item?.adInfo || e.item?.moduleType == 'mix_ad' || 'bigCard' == e.displayClass));
              hit++;
            }
          } catch (d) {
            console.log('discovery-feed:' + d);
          }
          break;
        case /mobile-user\/v\d\/homePage/.test(url):
          try {
            let c = new Set([210, 213, 215]),
              y = body;
            if (y.data.serviceModule.entrances) {
              let l = y.data.serviceModule.entrances.filter(e => c.has(e.id));
              y.data.serviceModule.entrances = l;
              hit = 1;
            }
          } catch (g) {
            console.log('mobile-user:' + g);
          }
          break;
        default:
          break;
      }

      if (hit) {
        console.log(` - [updated][${color.green(this.desc)}]`, color.gray(url));
        return { body };
      }
    },
  },
];

function commModify(body) {
  let hit = 0;

  if (Array.isArray(body)) {
    body.forEach(item => commModify(item) && (hit = 1));
    return hit;
  }

  if (!body || typeof body !== 'object') return hit;

  for (const [key, val] of Object.entries(body)) {
    switch (key) {
      case 'trackInfo':
        if (val && val.trackId) {
          Object.assign(val, {
            authorizedType: 0,
            permissionSource: '108',
            permissionExpireTime: 253402271999000,
            isVip: false,
            isVipFree: true,
          });
          hit = 1;
          continue;
        }
      case 'picbook':
        continue;
      case 'expireTime':
        body[key] = 4073558400000;
        hit = 1;
        continue;
      case 'isFree':
      case 'isVip':
      case 'isEnglishVip':
      case 'isXiaoyaUser':
      case 'isVipFree':
      case 'isAuthorized':
      case 'isXimiUhqAuthorized':
      case 'hasShqAuthorized':
      case 'inThreeMonth':
      case 'canFreeListen':
      case 'havePurchased':
      case 'isShowEntrance':
      case 'isVerified':
      case 'isXimiUhqTrack':
      case 'currentUserIsCopyright':
      case 'hasCart':
        body[key] = true;
        hit = 1;
        continue;
      case 'hqNeedVip':
        body[key] = false;
        hit = 1;
        continue;
      case 'ximiFirstStatus':
      case 'vipFirstStatus':
      case 'paidType':
      case 'tailSkip':
      case 'childAlbumInWhiteList':
      case 'freeListenStatus':
        body[key] = 1;
        hit = 1;
        continue;
      case 'sampleDuration':
        body[key] = 1000000;
        hit = 1;
      default:
        if (commModify(val)) hit = 1;
    }
  }

  return hit;
}
