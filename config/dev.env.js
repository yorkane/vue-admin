var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"/static/vue-admin"',
  // BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  // SYS_API: '"http://rapapi.org/mockjsdata/26979/"'
  SYS_API: '"/"',
  MOCK_API: '"/static/data.json"',
  IS_MOCK: false
})
