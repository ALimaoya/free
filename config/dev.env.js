'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //  BASE_API: '"http://192.168.0.210:8087/tryout"',

   BASE_API: '"http://192.168.0.205:8087/tryout"',
  // BASE_API: '"http://192.168.0.80:8087/tryout"',
  // BASE_API: '"https://sksj-api.yabei.shop/tryout"',
  // BASE_API: '"http://120.27.12.205:8005/tryout"',
  // BASE_API:'"http://192.168.0.122:8087/tryout"',
  IMAGE_DOMAIN : '"https://lgf8953.oss-cn-beijing.aliyuncs.com/"',//测试
  //  IMAGE_DOMAIN : '"http://yabei.oss-cn-beijing.aliyuncs.com/"',//正式


});

