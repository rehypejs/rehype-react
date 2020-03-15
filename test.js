'use strict'

var test = require('tape')
var React = require('react')
var server = require('react-dom/server')
var unified = require('unified')
var u = require('unist-builder')
var h = require('hastscript')
var rehype2react = require('.')

var options = {createElement: React.createElement}
var processor = unified().use(rehype2react, options)

test('React ' + React.version, function(t) {
  t.throws(
    function() {
      unified()
        .use(rehype2react)
        .stringify(h('p'))
    },
    /^TypeError: createElement is not a function$/,
    'should fail without `createElement`'
  )

  t.deepEqual(
    processor.stringify(h('p')),
    React.createElement('p', {key: 'h-1'}, undefined),
    'should transform an element'
  )

  t.deepEqual(
    processor.stringify(h('h1.main-heading', {dataFoo: 'bar'})),
    React.createElement(
      'h1',
      {className: 'main-heading', 'data-foo': 'bar', key: 'h-1'},
      undefined
    ),
    'should transform an element with properties'
  )

  t.deepEqual(
    processor.stringify(h('p', 'baz')),
    React.createElement('p', {key: 'h-1'}, ['baz']),
    'should transform an element with a text node'
  )

  t.deepEqual(
    processor.stringify(h('p', h('strong', 'qux'))),
    React.createElement('p', {key: 'h-1'}, [
      React.createElement('strong', {key: 'h-2'}, ['qux'])
    ]),
    'should transform an element with a child element'
  )

  t.deepEqual(
    processor.stringify(h('p', [h('em', 'qux'), ' foo ', h('i', 'bar')])),
    React.createElement('p', {key: 'h-1'}, [
      React.createElement('em', {key: 'h-2'}, ['qux']),
      ' foo ',
      React.createElement('i', {key: 'h-3'}, ['bar'])
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
      .use(rehype2react, {
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
      h('section', h('h1.main-heading', {dataFoo: 'bar'}, h('span', 'baz')))
    ),
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
    ]),
    'should transform trees'
  )

  t.deepEqual(
    server.renderToStaticMarkup(
      unified()
        .use(rehype2react, {
          createElement: React.createElement,
          components: {
            h1: function(props) {
              return React.createElement('h2', props)
            }
          }
        })
        .stringify(h('h1'))
    ),
    server.renderToStaticMarkup(
      React.createElement('h2', {key: 'h-1'}, undefined)
    ),
    'should support components'
  )

  t.deepEqual(
    processor.stringify(
      h('table', {}, [h('thead', h('th', {align: 'right'}))])
    ),
    React.createElement('table', {key: 'h-1'}, [
      React.createElement('thead', {key: 'h-2'}, [
        React.createElement(
          'th',
          {style: {textAlign: 'right'}, key: 'h-3'},
          undefined
        )
      ])
    ]),
    'should transform an element with align property'
  )

  t.end()
})
