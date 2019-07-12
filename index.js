'use strict'

var toH = require('hast-to-hyperscript')
var tableCellStyle = require('@mapbox/hast-util-table-cell-style')

module.exports = rehypeReact

var has = {}.hasOwnProperty

// Add a React compiler.
function rehypeReact(options) {
  var settings = options || {}
  var createElement = settings.createElement
  var Fragment = settings.Fragment
  var components = settings.components || {}

  this.Compiler = compiler

  function compiler(node) {
    var res = toH(h, tableCellStyle(node), settings.prefix)

    if (node.type === 'root') {
      // Invert <https://github.com/syntax-tree/hast-to-hyperscript/blob/d227372/index.js#L46-L56>.
      if (
        res.type === 'div' &&
        (node.children.length !== 1 || node.children[0].type !== 'element')
      ) {
        res = res.props.children
      } else {
        res = [res]
      }

      return createElement(Fragment || 'div', {}, res)
    }

    return res
  }

  // Wrap `createElement` to pass components in.
  function h(name, props, children) {
    var component = has.call(components, name) ? components[name] : name
    return createElement(component, props, children)
  }
}
