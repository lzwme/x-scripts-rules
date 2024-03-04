/*
 * @Author: renxia
 * @Date: 2024-03-17 14:12:30
 * @LastEditors: renxia
 * @LastEditTime: 2024-03-17 15:17:13
 * @Description:
 */

// process.env.JS_HOOK_URL = 'qhres2.com,aigc.360.com,www.sou.com,qhimg.com';

/** @type {import('@lzwme/whistle.x-scripts').RuleItem[]} */
module.exports = [
  {
    disabled: !process.env.JS_HOOK_URL,
    on: 'res-body',
    ruleId: 'js-hook',
    desc: 'js-hook',
    method: '*',
    // mitm: 'game.xiaojukeji.com',
    url: process.env.JS_HOOK_URL?.split(','),
    handler({ resBody, headers, resHeaders, X, url }) {
      if (!resBody) return;

      const type = headers['content-type'] || '';
      const rtype = resHeaders['content-type'] || '';

      const isHtml = type.includes('html') || rtype.includes('html');
      const isJs = type.includes('javascript') || rtype.includes('javascript') || url.includes('.js');

      if (isHtml || isJs) {
        if (Buffer.isBuffer(resBody)) resBody = resBody.toString('utf8');
        let hookCode = Object.values(jsHookList).join('\n');
        if (isHtml) hookCode = `<script>${hookCode}</script>`;
        console.log('hook injected', X.FeUtils.color.gray(url));
        if (resBody.includes('<head>')) resBody = resBody.replace('<head>', `<head>\n${hookCode}`);
        else resBody = `${resBody}\n${hookCode}`;

        return { body: resBody };
      }
    },
  },
];

const jsHookList = {
  json: `(function () {
    var my_stringify = JSON.stringify;
    JSON.stringify = function (params) {
      console.log('HOOK stringify', params);
      debugger;
      return my_stringify(params);
    };
    var my_parse = JSON.parse;
    JSON.parse = function (params) {
      console.log('HOOK parse', params);
      debugger;
      return my_parse(params);
    };
  })();`,
  cookie: `(function () {
    'use strict';
    let cookie_cache = '';
    Object.defineProperty(document, 'cookie', {
      get: function () {
        //debugger;
        return cookie_cache;
      },
      set: function (value) {
        console.log('Set cookie', value);
        debugger;
        cookie_cache = value;
        return value;
      },
    });
  })();`,
  searchDecode: `(function () {
    setTimeout(function () {
      for (var p in window) {
        var s = p.toLowerCase();
        if (s.indexOf('encode') != -1 || s.indexOf('encry') != -1) {
          console.log('encode function.', window[p]);
          debugger;
        }
        if (s.indexOf('decode') != -1 || s.indexOf('decry') != -1) {
          console.log('decode function.', window[p]);
          debugger;
        }
      }
    }, 3000);
  })();`,
  debuggerFunc: `(() => {
    Function.prototype.__constructor = Function.prototype.constructor;
    Function.prototype.constructor = function() {
        if(arguments && typeof arguments[0]==='string') {
            if ("debugger"===arguments[0]) {
              console.trace('[Function]debugger 拦截');
              return () => () => {};
            }
            return Function.prototype.__constructor.apply(this,arguments);
        }
    }
  })();`,
  debuggerSetInterval: `(function() {
    globalThis._setInterval_ = globalThis.setInterval;
    globalThis.setInterval = function(a,b) {
        if (a.includes("debugger")) {
          console.trace('[setInterval] debugger 拦截')
        } else {
          return globalThis._setInterval_(a,b);
        }
    }
  });`,
  eval: `(function () {
    if (window.__cr_eval) return;
    window.__cr_eval = window.eval;
    var myeval = function (src) {
      console.log('==== eval begin: length=' + src.length + ',caller=' + (myeval.caller && myeval.caller.name) + ' ====');
      console.log(src);
      console.log('==== eval end ====');
      return window.__cr_eval(src);
    };
    var _myeval = myeval.bind(null);
    _myeval.toString = window.__cr_eval.toString;
    Object.defineProperty(window, 'eval', { value: _myeval });
    console.log('>>>> eval injected: ' + document.location + ' <<<<');
  })();`
};
