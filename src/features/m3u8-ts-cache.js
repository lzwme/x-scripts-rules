const fs = require('node:fs');
const { resolve } = require('node:path');

const cache = {
  /** ts 文件缓存的路径 */
  cacheDir: process.env.M3U8_TS_CACHE_DIR || 'cache/ts',
  /** ts 文件最大缓存数量 */
  maxSize: Math.max(process.env.M3U8_TS_CACHE_MAX_SIZE || 5000, 1000),
  FeUtils: null,
  lru: null,
  /** 最近一次请求的 m3u8 文件 url */
  currentM3u8Url: '',
  tsDownloading: new Map(),
  clear(clearAll = false) {
    if (clearAll) return fs.rmSync(cache.cacheDir, { recursive: true });
  },
  init() {
    if (!fs.existsSync(cache.cacheDir)) {
      fs.mkdirSync(cache.cacheDir, { recursive: true });
    } else {
      fs.readdirSync(cache.cacheDir)
        .filter(d => d.length >= 32)
        .map(filename => [filename, fs.statSync(resolve(this.cacheDir, filename)).atimeMs])
        .sort(([a, b]) => b[1] - a[1])
        .forEach(([filename], atimeMs) => cache.lru.set(filename, atimeMs));
    }

    console.log('cache inited. ', cache.lru.info());
  },
};

/**
 * 用法：设置环境变量：
 * process.env.M3U8_CACHE_ENABLE = '1'; // 开启 m3u8 文件解析缓存规则
 * process.env.M3U8_TS_CACHE_ENABLE = '1'; // 开启 ts 缓存下载规则
 * process.env.M3U8_TS_CACHE_DIR = 'cache/ts'; // 自定义缓存目录
 * process.env.M3U8_TS_CACHE_MAX_SIZE = 5000; // 自定义缓存文件最大数量
 *
 * @type {import('@lzwme/whistle.x-scripts').RuleItem[]}
 */
module.exports = [
  {
    on: 'res-body',
    ruleId: 'm3u8-preload-cache',
    desc: '根据 m3u8 文件内容缓存TS',
    method: 'get',
    url: (process.env.M3U8_CACHE_URL || '**.m3u8').split(','),
    disabled: process.env.M3U8_CACHE_ENABLE != '1',
    handler: async ({ url, resBody, X: { FeUtils } }) => {
      if (!url.endsWith('.m3u8')) return;

      if (!cache.FeUtils) {
        cache.FeUtils = FeUtils;
        cache.logger = logger;
      }

      try {
        cache.currentM3u8Url = url;

        const color = FeUtils.color;
        const baseUrl = url.slice(0, url.lastIndexOf('/'));
        const tasks = resBody
          .toString('utf-8')
          .split('\n')
          .filter(line => line.includes('.ts'))
          .map(tsurl => {
            if (!tsurl.startsWith('http')) tsurl = new URL(tsurl, baseUrl).toString();
            return () => cache.currentM3u8Url === url && downloadTs(tsurl);
          });

        console.log(color.cyan(`> 获取 ts 文件 ${tasks.length} 个:`), color.gray(url));
        FeUtils.concurrency(tasks, 8).then(d => console.log(color.green('[TS缓存下载完毕]'), d.length, color.gray(url)));
      } catch (e) {
        console.log(e);
      }
    },
  },
  {
    on: 'req-header',
    ruleId: 'm3u8-ts-cache',
    desc: 'm3u8 媒体的 ts 文件缓存',
    method: 'get',
    url: (process.env.M3U8_TS_CACHE_URL || '**.ts').split(','),
    disabled: process.env.M3U8_TS_CACHE_ENABLE != '1' && process.env.M3U8_CACHE_ENABLE != '1',
    handler: async ({ url, X: { FeUtils, logger } }) => {
      if (!cache.FeUtils) {
        cache.FeUtils = FeUtils;
        cache.logger = logger;
      }

      const filepath = await downloadTs(url);
      if (filepath) return { body: fs.readFileSync(filepath) };
    },
  },
];

async function downloadTs(url) {
  if (!url.includes('.ts')) return;

  const FeUtils = cache.FeUtils;
  const color = FeUtils.color;
  const filename = FeUtils.md5(url);
  const filepath = resolve(cache.cacheDir, filename);

  if (!cache.lru) {
    cache.lru = new FeUtils.LRUCache({
      max: cache.maxSize,
      updateAgeOnGet: true,
      dispose(_val, key, reason) {
        if (reason !== 'set') {
          FeUtils.rmrf(resolve(cache.cacheDir, key));
        }
      },
    });

    cache.init();
  }

  let barrier = cache.tsDownloading.get(filename);
  if (barrier) await barrier.wait();

  if (!fs.existsSync(filepath)) {
    try {
      const timeKey = color.gray(filename);
      console.time(timeKey);
      console.log(color.cyanBright('- 开始缓存文件'), color.magenta(url));

      barrier = new FeUtils.Barrier();
      cache.tsDownloading.set(filename, barrier);
      setTimeout(() => barrier.open(), 60_000); // 超时 60s
      const r = await FeUtils.download({ url, filepath });
      barrier.open();
      cache.tsDownloading.delete(filename);

      console.log(color.green('[TS 已缓存]'), r.size / 1024, color.gray(filepath));
      console.timeEnd(timeKey);
    } catch (error) {
      console.error('下载失败！', color.red(url), error);
      return;
    }
  } else {
    console.log(color.green('[取缓存]'), color.gray(url));
  }

  if (fs.existsSync(filepath)) {
    cache.lru.set(filename, Date.now());
    return filepath;
  }
}

// console.log(module.exports);
