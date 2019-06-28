'use strict'

var toH = require('hast-to-hyperscript')
var tableCellStyle = require('@mapbox/hast-util-table-cell-style')

module.exports = rehypeReact

var has = {}.hasOwnProperty

// Add a React compiler.
function rehypeReact(options) {
  var settings = options || {}
  var createElement = settings.createElement
  var components = settings.components || {}

  this.Compiler = compiler

  function compiler(node) {
    if (node.type === 'root') {
      if (node.children.length === 1 && node.children[0].type === 'element') {
        node = node.children[0]
      } else {
        node = {
          type: 'element',
          tagName: 'div',
          properties: node.properties || {},
          children: node.children
        }
      }
    }

    return toH(h, tableCellStyle(node), settings.prefix)
  }

  // Wrap `createElement` to pass components in.
  function h(name, props, children) {
    var component = has.call(components, name) ? components[name] : name
    return createElement(component, props, children)
  }
}
