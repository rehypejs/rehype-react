import {toH} from 'hast-to-hyperscript'
import tableCellStyle from '@mapbox/hast-util-table-cell-style'

const own = {}.hasOwnProperty
const tableElements = new Set([
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td'
])

// Add a React compiler.
export default function rehypeReact(options = {}) {
  const createElement = options.createElement

  this.Compiler = compiler

  function compiler(node) {
    let result = toH(h, tableCellStyle(node), options.prefix)

    if (node.type === 'root') {
      // Invert <https://github.com/syntax-tree/hast-to-hyperscript/blob/d227372/index.js#L46-L56>.
      result =
        result.type === 'div' &&
        (node.children.length !== 1 || node.children[0].type !== 'element')
          ? result.props.children
          : [result]

      return createElement(options.Fragment || 'div', {}, result)
    }

    return result
  }

  // Wrap `createElement` to pass components in.
  function h(name, props, children) {
    let component = name

    // Currently, a warning is triggered by react for *any* white space in
    // tables.
    // So we remove the pretty lines for now.
    // See: <https://github.com/facebook/react/pull/7081>.
    // See: <https://github.com/facebook/react/pull/7515>.
    // See: <https://github.com/remarkjs/remark-react/issues/64>.
    if (children && tableElements.has(name)) {
      children = children.filter((child) => {
        return child !== '\n'
      })
    }

    if (options.components && own.call(options.components, name)) {
      component = options.components[name]

      if (options.passNode) {
        props.node = this
      }
    }

    return createElement(component, props, children)
  }
}
