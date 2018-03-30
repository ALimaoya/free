'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://192.168.0.210:8087"',
  BASE_API: '"http://120.27.12.205:8005"',
  // BASE_API: '"http://sksj-api.yabei.shop"',
  IMAGE_DOMAIN : '"http://lgf8953.oss-cn-beijing.aliyuncs.com/"',
  // IMAGE_DOMAIN : '"http://yabei.oss-cn-beijing.aliyuncs.com/"',
  // BASE_API:'"http://rap2api.taobao.org/app/mock/3968"'

});

