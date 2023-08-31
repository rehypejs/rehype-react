import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import server from 'react-dom/server'
import {unified} from 'unified'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import rehypeReact from './index.js'

const options = {createElement: React.createElement}
const processor = unified().use(rehypeReact, options)

test('React ' + React.version, async function (t) {
  await t.test('should fail without `createElement`', async function () {
    assert.throws(function () {
      // @ts-expect-error: options missing.
      unified()
        .use(rehypeReact)
        .stringify(u('root', [h('p')]))
    }, /^TypeError: createElement is not a function$/)
  })

  await t.test('should transform a root', async function () {
    assert.deepEqual(
      processor.stringify(u('root', [h('p')])),
      React.createElement('div', {}, [
        React.createElement('p', {key: 'h-1'}, undefined)
      ])
    )
  })

  await t.test('should transform an element', async function () {
    assert.deepEqual(
      // To do: this should error, because it’s not a root.
      processor.stringify(h('p')),
      React.createElement('p', {key: 'h-1'}, undefined)
    )
  })

  await t.test(
    'should transform an element with properties',
    async function () {
      assert.deepEqual(
        processor.stringify(
          u('root', [h('h1.main-heading', {dataFoo: 'bar'})])
        ),
        React.createElement('div', {}, [
          React.createElement(
            'h1',
            {className: 'main-heading', 'data-foo': 'bar', key: 'h-1'},
            undefined
          )
        ])
      )
    }
  )

  await t.test(
    'should transform an element with a text node',
    async function () {
      assert.deepEqual(
        processor.stringify(u('root', [h('p', 'baz')])),
        React.createElement('div', {}, [
          React.createElement('p', {key: 'h-1'}, ['baz'])
        ])
      )
    }
  )

  await t.test(
    'should transform an element with a child element',
    async function () {
      assert.deepEqual(
        processor.stringify(u('root', [h('p', h('strong', 'qux'))])),
        React.createElement('div', {}, [
          React.createElement('p', {key: 'h-1'}, [
            React.createElement('strong', {key: 'h-2'}, ['qux'])
          ])
        ])
      )
    }
  )

  await t.test(
    'should transform an element with mixed contents',
    async function () {
      assert.deepEqual(
        processor.stringify(
          u('root', [h('p', [h('em', 'qux'), ' foo ', h('i', 'bar')])])
        ),
        React.createElement('div', {}, [
          React.createElement('p', {key: 'h-1'}, [
            React.createElement('em', {key: 'h-2'}, ['qux']),
            ' foo ',
            React.createElement('i', {key: 'h-3'}, ['bar'])
          ])
        ])
      )
    }
  )

  await t.test(
    'should transform `root` to a `div` by default',
    async function () {
      assert.deepEqual(
        processor.stringify(u('root', [h('p')])),
        React.createElement('div', {}, [
          React.createElement('p', {key: 'h-1'}, undefined)
        ])
      )
    }
  )

  await t.test(
    'should transform `root` to a `Fragment` if given',
    async function () {
      assert.deepEqual(
        unified()
          .use(rehypeReact, {
            createElement: React.createElement,
            Fragment: React.Fragment
          })
          .stringify(u('root', [h('h1'), h('p')])),
        React.createElement(React.Fragment, {}, [
          React.createElement('h1', {key: 'h-2'}, undefined),
          React.createElement('p', {key: 'h-3'}, undefined)
        ])
      )
    }
  )

  await t.test('should skip `doctype`s', async function () {
    assert.deepEqual(
      processor.stringify(u('root', [u('doctype', {name: 'html'})])),
      React.createElement('div', {}, undefined)
    )
  })

  await t.test('should transform trees', async function () {
    assert.deepEqual(
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
      ])
    )
  })

  await t.test('should support components', async function () {
    assert.deepEqual(
      server.renderToStaticMarkup(
        // @ts-expect-error: to do: figure out.
        unified()
          .use(rehypeReact, {
            createElement: React.createElement,
            components: {
              /** @param {object} props */
              h1(props) {
                return React.createElement('h2', props)
              }
            }
          })
          .stringify(u('root', [h('h1')]))
      ),
      server.renderToStaticMarkup(
        React.createElement('div', {}, [
          React.createElement('h2', {key: 'h-1'}, undefined)
        ])
      )
    )
  })

  await t.test(
    'should transform an element with align property',
    async function () {
      assert.deepEqual(
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
        ])
      )
    }
  )

  await t.test('should transform a table with whitespace', async function () {
    assert.deepEqual(
      processor.stringify(
        u('root', [
          h('table', {}, [
            '\n  ',
            h('tbody', {}, [
              '\n  ',
              h('tr', {}, [
                '\n  ',
                h('th', {}, ['\n  ']),
                h('td', {}, ['\n  '])
              ])
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
      ])
    )
  })

  await t.test('should expose node from node prop', async function () {
    const headingNode = h('h1')
    /** @param {object} props */
    const Heading1 = function (props) {
      return React.createElement('h1', props)
    }

    assert.deepEqual(
      unified()
        .use(rehypeReact, {
          createElement: React.createElement,
          passNode: true,
          components: {h1: Heading1}
        })
        .stringify(u('root', [headingNode, h('p')])),
      React.createElement('div', {}, [
        React.createElement(
          Heading1,
          // @ts-expect-error: yeah it’s not okay per react types, but it works fine.
          {key: 'h-2', node: headingNode},
          undefined
        ),
        React.createElement('p', {key: 'h-3'}, undefined)
      ])
    )
  })

  await t.test('should respect `fixTableCellAlign` option', async function () {
    assert.deepEqual(
      unified()
        .use(rehypeReact, {
          createElement: React.createElement,
          fixTableCellAlign: false
        })
        .stringify(
          u('root', [
            h('table', {align: 'top'}, [
              '\n  ',
              h('tbody', {}, [
                '\n  ',
                h('tr', {}, [
                  h('th', {}, ['\n  ']),
                  h('td', {align: 'center'}, ['\n  '])
                ])
              ])
            ])
          ])
        ),
      React.createElement('div', {}, [
        React.createElement('table', {key: 'h-1', align: 'top'}, [
          React.createElement('tbody', {key: 'h-2'}, [
            React.createElement('tr', {key: 'h-3'}, [
              React.createElement('th', {key: 'h-4'}, ['\n  ']),
              React.createElement('td', {key: 'h-5', align: 'center'}, ['\n  '])
            ])
          ])
        ])
      ])
    )
  })
})
