'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.0.82:8087"',
  //BASE_API: '"http://192.168.0.210:8087"',
  // BASE_API:'"http://rap2api.taobao.org/app/mock/3968"'

});
