/**
 * @typedef {import('hast-util-to-jsx-runtime').Fragment} Fragment
 * @typedef {import('hast-util-to-jsx-runtime').Jsx} Jsx
 * @typedef {import('hast-util-to-jsx-runtime').JsxDev} JsxDev
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'
import React from 'react'
import * as dev from 'react/jsx-dev-runtime'
import * as prod from 'react/jsx-runtime'
import server from 'react-dom/server'
import {unified} from 'unified'
import rehypeReact from './index.js'

/** @type {{Fragment: Fragment, jsx: Jsx, jsxs: Jsx}} */
// @ts-expect-error: the react types are missing.
const production = {Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs}

/** @type {{Fragment: Fragment, jsxDEV: JsxDev}} */
// @ts-expect-error: the react types are missing.
const development = {Fragment: dev.Fragment, jsxDEV: dev.jsxDEV}

test('React ' + React.version, async function (t) {
  await t.test(
    'should fail without `Fragment`, `jsx`, `jsxs`',
    async function () {
      assert.throws(function () {
        // @ts-expect-error: options missing.
        unified()
          .use(rehypeReact)
          .stringify(h(undefined, [h('p')]))
      }, /Expected `Fragment` in options/)
    }
  )

  await t.test('should transform a root', async function () {
    assert.deepEqual(
      unified()
        .use(rehypeReact, production)
        .stringify(h(undefined, [h('p')])),
      React.createElement(
        React.Fragment,
        {},
        React.createElement('p', {key: 'p-0'})
      )
    )
  })

  await t.test('should transform an element', async function () {
    assert.deepEqual(
      unified()
        .use(rehypeReact, production)
        // @ts-expect-error typed to only support roots.
        .stringify(h('p')),
      React.createElement('p')
    )
  })

  await t.test(
    'should transform an element with properties',
    async function () {
      assert.deepEqual(
        unified()
          .use(rehypeReact, production)
          .stringify(h(undefined, [h('h1.main-heading', {dataFoo: 'bar'})])),
        React.createElement(
          React.Fragment,
          {},
          React.createElement('h1', {
            className: 'main-heading',
            'data-foo': 'bar',
            key: 'h1-0'
          })
        )
      )
    }
  )

  await t.test(
    'should transform an element with a text node',
    async function () {
      assert.deepEqual(
        unified()
          .use(rehypeReact, production)
          .stringify(h(undefined, [h('p', 'baz')])),
        React.createElement(
          React.Fragment,
          {},
          React.createElement('p', {key: 'p-0'}, 'baz')
        )
      )
    }
  )

  await t.test(
    'should transform an element with a child element',
    async function () {
      assert.deepEqual(
        unified()
          .use(rehypeReact, production)
          .stringify(h(undefined, [h('p', h('strong', 'qux'))])),
        React.createElement(
          React.Fragment,
          {},
          React.createElement(
            'p',
            {key: 'p-0'},
            React.createElement('strong', {key: 'strong-0'}, 'qux')
          )
        )
      )
    }
  )

  await t.test(
    'should transform an element with mixed contents',
    async function () {
      assert.deepEqual(
        unified()
          .use(rehypeReact, production)
          .stringify(
            h(undefined, [h('p', [h('em', 'qux'), ' foo ', h('i', 'bar')])])
          ),
        React.createElement(
          React.Fragment,
          {},
          React.createElement('p', {key: 'p-0'}, [
            React.createElement('em', {key: 'em-0'}, 'qux'),
            ' foo ',
            React.createElement('i', {key: 'i-0'}, 'bar')
          ])
        )
      )
    }
  )

  await t.test('should skip `doctype`s', async function () {
    assert.deepEqual(
      unified()
        .use(rehypeReact, production)
        .stringify(h(undefined, [{type: 'doctype'}])),
      React.createElement(React.Fragment, {})
    )
  })

  await t.test('should transform trees', async function () {
    assert.deepEqual(
      unified()
        .use(rehypeReact, production)
        .stringify(
          h(undefined, [
            h('section', [
              h('h1.main-heading', {dataFoo: 'bar'}, [h('span', 'baz')])
            ])
          ])
        ),
      React.createElement(
        React.Fragment,
        {},
        React.createElement(
          'section',
          {key: 'section-0'},
          React.createElement(
            'h1',
            {
              key: 'h1-0',
              className: 'main-heading',
              'data-foo': 'bar'
            },
            React.createElement('span', {key: 'span-0'}, 'baz')
          )
        )
      )
    )
  })

  await t.test('should support components', async function () {
    assert.deepEqual(
      server.renderToStaticMarkup(
        unified()
          .use(rehypeReact, {
            ...production,
            components: {
              h1(props) {
                return React.createElement('h2', props)
              }
            }
          })
          .stringify(h(undefined, [h('h1')]))
      ),
      '<h2></h2>'
    )
  })

  await t.test('should support `development: true`', async function () {
    assert.deepEqual(
      unified()
        .use(rehypeReact, {...development, development: true})
        .stringify(h(undefined, [h('h1')])),
      React.createElement(
        React.Fragment,
        {},
        React.createElement('h1', {key: 'h1-0'})
      )
    )
  })

  await t.test(
    'should transform an element with align property',
    async function () {
      assert.deepEqual(
        unified()
          .use(rehypeReact, production)
          .stringify(
            h(undefined, [
              h('table', {}, [h('thead', h('th', {align: 'right'}))])
            ])
          ),
        React.createElement(
          React.Fragment,
          {},
          React.createElement(
            'table',
            {key: 'table-0'},
            React.createElement(
              'thead',
              {key: 'thead-0'},
              React.createElement('th', {
                style: {textAlign: 'right'},
                key: 'th-0'
              })
            )
          )
        )
      )
    }
  )

  await t.test('should transform a table with whitespace', async function () {
    assert.deepEqual(
      unified()
        .use(rehypeReact, production)
        .stringify(
          h(undefined, [
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
      React.createElement(
        React.Fragment,
        {},
        React.createElement(
          'table',
          {key: 'table-0'},
          React.createElement(
            'tbody',
            {key: 'tbody-0'},
            React.createElement('tr', {key: 'tr-0'}, [
              React.createElement('th', {key: 'th-0'}, '\n  '),
              React.createElement('td', {key: 'td-0'}, '\n  ')
            ])
          )
        )
      )
    )
  })

  await t.test('should expose node from node prop', async function () {
    const headingNode = h('h1')

    const Component = function () {
      return 'x'
    }

    assert.deepEqual(
      unified()
        .use(rehypeReact, {
          ...production,
          components: {h1: Component},
          passNode: true
        })
        .stringify(h(undefined, [headingNode, h('p')])),
      React.createElement(React.Fragment, {}, [
        React.createElement(Component, {key: 'h1-0', node: headingNode}),
        React.createElement('p', {key: 'p-0'})
      ])
    )
  })

  await t.test(
    'should respect `tableCellAlignToStyle: false`',
    async function () {
      assert.deepEqual(
        unified()
          .use(rehypeReact, {...production, tableCellAlignToStyle: false})
          .stringify(
            h(undefined, [h('tr', {}, [h('th'), h('td', {align: 'center'})])])
          ),
        React.createElement(
          React.Fragment,
          {},
          React.createElement('tr', {key: 'tr-0'}, [
            React.createElement('th', {key: 'th-0'}),
            React.createElement('td', {key: 'td-0', align: 'center'})
          ])
        )
      )
    }
  )
})
