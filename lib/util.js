/**
 * @file ライブラリ関数をまとめたファイル
 * @namespace lib
 */

const { Roarr } = require('roarr')

/**
 * ロガーを作成、または子ロガーを作成する
 *
 * @memberof lib
 * @param {object} ctx
 * @param {Roarr} logger
 */
const getLogger = (ctx, logger) => {
  let parentLogger = logger
  if (!parentLogger) {
    parentLogger = Roarr
  }
  return parentLogger.child(ctx)
}

module.exports = {
  getLogger,
}

