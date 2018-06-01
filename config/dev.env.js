'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
   // BASE_API: '"http://192.168.0.205:8087"',
  // BASE_API: '"https://sksj-api.yabei.shop"',
  BASE_API: '"http://120.27.12.205:8005"',
  // BASE_API:'"http://rap2api.taobao.org/app/mock/3968"'
  IMAGE_DOMAIN : '"https://lgf8953.oss-cn-beijing.aliyuncs.com/"',//测试
  //  IMAGE_DOMAIN : '"http://yabei.oss-cn-beijing.aliyuncs.com/"',//正式


});

