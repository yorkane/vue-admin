module.exports = (file) => {
  return callback => {
    return require.ensure([], () => {
      return callback(require('@/views/' + file + '.vue'))
    }, 'views')
  }
}
// return import('@/views/' + file + '.vue')

