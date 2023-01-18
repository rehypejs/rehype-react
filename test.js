import test from 'tape'
import React from 'react'
import server from 'react-dom/server'
import {unified} from 'unified'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import rehypeReact from './index.js'

const options = {createElement: React.createElement}
const processor = unified().use(rehypeReact, options)

test('React ' + React.version, (t) => {
  t.throws(
    () => {
      // @ts-expect-error: options missing.
      unified()
        .use(rehypeReact)
        .stringify(u('root', [h('p')]))
    },
    /^TypeError: createElement is not a function$/,
    'should fail without `createElement`'
  )

  t.deepEqual(
    processor.stringify(u('root', [h('p')])),
    React.createElement('div', {}, [
      React.createElement('p', {key: 'h-1'}, undefined)
    ]),
    'should transform a root'
  )

  t.deepEqual(
    // @ts-expect-error: plugin is typed as only supporting roots.
    processor.stringify(h('p')),
    React.createElement('p', {key: 'h-1'}, undefined),
    'should transform an element'
  )

  t.deepEqual(
    processor.stringify(u('root', [h('h1.main-heading', {dataFoo: 'bar'})])),
    React.createElement('div', {}, [
      React.createElement(
        'h1',
        {className: 'main-heading', 'data-foo': 'bar', key: 'h-1'},
        undefined
      )
    ]),
    'should transform an element with properties'
  )

  t.deepEqual(
    processor.stringify(u('root', [h('p', 'baz')])),
    React.createElement('div', {}, [
      React.createElement('p', {key: 'h-1'}, ['baz'])
    ]),
    'should transform an element with a text node'
  )

  t.deepEqual(
    processor.stringify(u('root', [h('p', h('strong', 'qux'))])),
    React.createElement('div', {}, [
      React.createElement('p', {key: 'h-1'}, [
        React.createElement('strong', {key: 'h-2'}, ['qux'])
      ])
    ]),
    'should transform an element with a child element'
  )

  t.deepEqual(
    processor.stringify(
      u('root', [h('p', [h('em', 'qux'), ' foo ', h('i', 'bar')])])
    ),
    React.createElement('div', {}, [
      React.createElement('p', {key: 'h-1'}, [
        React.createElement('em', {key: 'h-2'}, ['qux']),
        ' foo ',
        React.createElement('i', {key: 'h-3'}, ['bar'])
      ])
    ]),
    'should transform an element with mixed contents'
  )

  t.deepEqual(
    processor.stringify(u('root', [h('p')])),
    React.createElement('div', {}, [
      React.createElement('p', {key: 'h-1'}, undefined)
    ]),
    'should transform `root` to a `div` by default'
  )

  t.deepEqual(
    unified()
      .use(rehypeReact, {
        createElement: React.createElement,
        Fragment: React.Fragment
      })
      .stringify(u('root', [h('h1'), h('p')])),
    React.createElement(React.Fragment, {}, [
      React.createElement('h1', {key: 'h-2'}, undefined),
      React.createElement('p', {key: 'h-3'}, undefined)
    ]),
    'should transform `root` to a `Fragment` if given'
  )

  t.deepEqual(
    processor.stringify(u('root', [u('doctype', {name: 'html'})])),
    React.createElement('div', {}, undefined),
    'should skip `doctype`s'
  )

  t.deepEqual(
    processor.stringify(
      u('root', [
        h('section', h('h1.main-heading', {dataFoo: 'bar'}, h('span', 'baz')))
      ])
    ),
    React.createElement('div', {}, [
      React.createElement('section', {key: 'h-1'}, [
        React.createElement(
          'h1',
          {
            key: 'h-2',
            className: 'main-heading',
            'data-foo': 'bar'
          },
          [React.createElement('span', {key: 'h-3'}, ['baz'])]
        )
      ])
    ]),
    'should transform trees'
  )

  t.deepEqual(
    server.renderToStaticMarkup(
      unified()
        .use(rehypeReact, {
          createElement: React.createElement,
          components: {
            /** @param {object} props */
            h1: (props) => React.createElement('h2', props)
          }
        })
        .stringify(u('root', [h('h1')]))
    ),
    server.renderToStaticMarkup(
      React.createElement('div', {}, [
        React.createElement('h2', {key: 'h-1'}, undefined)
      ])
    ),
    'should support components'
  )

  t.deepEqual(
    processor.stringify(
      u('root', [h('table', {}, [h('thead', h('th', {align: 'right'}))])])
    ),
    React.createElement('div', {}, [
      React.createElement('table', {key: 'h-1'}, [
        React.createElement('thead', {key: 'h-2'}, [
          React.createElement(
            'th',
            {style: {textAlign: 'right'}, key: 'h-3'},
            undefined
          )
        ])
      ])
    ]),
    'should transform an element with align property'
  )

  t.deepEqual(
    processor.stringify(
      u('root', [
        h('table', {}, [
          '\n  ',
          h('tbody', {}, [
            '\n  ',
            h('tr', {}, ['\n  ', h('th', {}, ['\n  ']), h('td', {}, ['\n  '])])
          ])
        ])
      ])
    ),
    React.createElement('div', {}, [
      React.createElement('table', {key: 'h-1'}, [
        React.createElement('tbody', {key: 'h-2'}, [
          React.createElement('tr', {key: 'h-3'}, [
            React.createElement('th', {key: 'h-4'}, ['\n  ']),
            React.createElement('td', {key: 'h-5'}, ['\n  '])
          ])
        ])
      ])
    ]),
    'should transform a table with whitespace'
  )

  const headingNode = h('h1')
  /** @param {object} props */
  const Heading1 = function (props) {
    return React.createElement('h1', props)
  }

  t.deepEqual(
    unified()
      .use(rehypeReact, {
        createElement: React.createElement,
        passNode: true,
        components: {h1: Heading1}
      })
      .stringify(u('root', [headingNode, h('p')])),
    React.createElement('div', {}, [
      // @ts-expect-error: yeah it’s not okay per react types, but it works fine.
      React.createElement(Heading1, {key: 'h-2', node: headingNode}, undefined),
      React.createElement('p', {key: 'h-3'}, undefined)
    ]),
    'should expose node from node prop'
  )

  t.end()
})
