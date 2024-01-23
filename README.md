@lzwme/x-scripts-rules
========

[![node version][node-badge]][node-url]
[![GitHub issues][issues-badge]][issues-url]
[![GitHub forks][forks-badge]][forks-url]
[![GitHub stars][stars-badge]][stars-url]
![license MIT](https://img.shields.io/github/license/lzwme/whistle.x-scripts)
<!-- [![minzipped size][bundlephobia-badge]][bundlephobia-url] -->

基于 [@lzwme/whistle.x-scripts](https://github.com/lzwme/whistle.x-scripts) 插件规范开发的规则脚本库。

## 快速开始

```bash
npm i -g whistle @lzwme/whistle.x-scripts
git clone https://mirror.ghporxy.com/github.com/lzwme/x-scripts-rules.git
w2 ca
w2 proxy
w2 run
```

## 安装与使用

请先了解 [@lzwme/whistle.x-scripts](https://github.com/lzwme/whistle.x-scripts) 项目的功能，并进行基本安装与配置。

应先全局安装 `whistle` 和 `@lzwme/whistle.x-scripts`：

```bash
npm i -g whistle @lzwme/whistle.x-scripts
```

然后拉取本仓库代码到本地路径（如：`/Users/lzwme/coding/x-scripts-rules`）：

```bash
git clone https://github.com/lzwme/x-scripts-rules.git
```

接着在配置文件 `~/w2.x-scripts.config.js` 中的 `ruleDirs` 字段添加该仓库所在路径即可。示例：

```js
module.exports = {
  ruleDirs: [
    '/Users/lzwme/coding/x-scripts-rules/', // 按目录：加载全部规则
    '/Users/lzwme/coding/x-scripts-rules/src/jd.js', // 按文件：加载部分规则
  ],
};
```

最后启动 `whistle`：

```bash
# 安装根证书
w2 ca
# 开启全局代理模式(关闭： w2 proxy off)
w2 proxy
# 调试模式启动
w2 run
```

## 免责说明

- 本项目仅用于个人对 web 程序逆向的兴趣研究学习，请勿用于商业用途、任何恶意目的，否则后果自负。请在学习研究完毕24小时内删除。
- 请自行评估使用本项目脚本可能产生的安全风险。本人对使用本项目涉及的任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失或损害。

## License

`@lzwme/x-scripts-rules` is released under the MIT license.

该插件由[志文工作室](https://lzw.me)开发和维护。


[stars-badge]: https://img.shields.io/github/stars/lzwme/whistle.x-scripts.svg
[stars-url]: https://github.com/lzwme/whistle.x-scripts/stargazers
[forks-badge]: https://img.shields.io/github/forks/lzwme/whistle.x-scripts.svg
[forks-url]: https://github.com/lzwme/whistle.x-scripts/network
[issues-badge]: https://img.shields.io/github/issues/lzwme/whistle.x-scripts.svg
[issues-url]: https://github.com/lzwme/whistle.x-scripts/issues
[npm-badge]: https://img.shields.io/npm/v/@lzwme/x-scripts-rules.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@lzwme/x-scripts-rules
[node-badge]: https://img.shields.io/badge/node.js-%3E=_16.15.0-green.svg?style=flat-square
[node-url]: https://nodejs.org/download/
[download-badge]: https://img.shields.io/npm/dm/@lzwme/x-scripts-rules.svg?style=flat-square
[download-url]: https://npmjs.org/package/@lzwme/x-scripts-rules
[bundlephobia-url]: https://bundlephobia.com/result?p=@lzwme/x-scripts-rules@latest
[bundlephobia-badge]: https://badgen.net/bundlephobia/minzip/@lzwme/x-scripts-rules@latest
