# rehype-react

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]

**[rehype][github-rehype]**
plugin to turn HTML into preact, react, solid, svelte, vue, etc.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(rehypeReact, options)`](#unifieduserehypereact-options)
  * [`Components`](#components)
  * [`Options`](#options)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Related](#related)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a [unified][github-unified]
([rehype][github-rehype])
plugin that compiles HTML (hast) to any JSX runtime
(preact, react, solid, svelte, vue, etc).

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**rehype** adds support for HTML to unified.
**hast** is the HTML AST that rehype uses.
This is a rehype plugin that adds a compiler to compile hast to a JSX runtime.

## When should I use this?

This plugin adds a compiler for rehype, which means that it turns the final
HTML (hast) syntax tree into something else (in this case, a `JSX.Element`).
It’s useful when you’re already using unified (whether remark or rehype) or are
open to learning about ASTs (they’re powerful!) and want to render content in
your app.

If you’re not familiar with unified,
then [`react-markdown`][github-react-markdown]
might be a better fit.
You can also use [`react-remark`][github-react-remark] instead,
which is somewhere between `rehype-react` and `react-markdown`,
as it does more that the former and is more modern (such as supporting hooks)
than the latter,
and also a good alternative.
If you want to use JavaScript and JSX *inside* markdown files,
use [MDX][github-mdx].

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+), install with [npm][npmjs-install]:

```sh
npm install rehype-react
```

In Deno with [`esm.sh`][esmsh]:

```js
import rehypeReact from 'https://esm.sh/rehype-react@8'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import rehypeReact from 'https://esm.sh/rehype-react@8?bundle'
</script>
```

## Use

Say our React app `example.js` looks as follows:

```js
import {Fragment, createElement, useEffect, useState} from 'react'
import * as prod from 'react/jsx-runtime'
import rehypeParse from 'rehype-parse'
import rehypeReact from 'rehype-react'
import {unified} from 'unified'

// @ts-expect-error: the react types are missing.
const production = {Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs}

const text = `<h2>Hello, world!</h2>
<p>Welcome to my page 👀</p>`

/**
 * @param {string} text
 * @returns {JSX.Element}
 */
function useProcessor(text) {
  const [Content, setContent] = useState(createElement(Fragment))

  useEffect(
    function () {
      ;(async function () {
        const file = await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeReact, production)
          .process(text)

        setContent(file.result)
      })()
    },
    [text]
  )

  return Content
}

export default function App() {
  return useProcessor(text)
}
```

…running that in Next.js or similar, we’d get:

```html
<h2>Hello, world!</h2>
<p>Welcome to my page 👀</p>
```

## API

This package exports no identifiers.
The default export is [`rehypeReact`][api-rehype-react].

### `unified().use(rehypeReact, options)`

Turn HTML into preact, react, solid, svelte, vue, etc.

###### Parameters

* `options` ([`Options`][api-options], required)
  — configuration

###### Returns

Nothing (`undefined`).

###### Result

This plugin registers a compiler that returns a `JSX.Element` where compilers
typically return `string`.
When using `.stringify` on `unified`, the result is such a `JSX.Element`.
When using `.process` (or `.processSync`), the result is available at
`file.result`.

###### Frameworks

There are differences between what JSX frameworks accept, such as whether they
accept `class` or `className`, or `background-color` or `backgroundColor`.

For hast elements transformed by this project, this is be handled through
options:

| Framework | `elementAttributeNameCase` | `stylePropertyNameCase` |
| --------- | -------------------------- | ----------------------- |
| Preact    | `'html'`                   | `'dom'`                 |
| React     | `'react'`                  | `'dom'`                 |
| Solid     | `'html'`                   | `'css'`                 |
| Vue       | `'html'`                   | `'dom'`                 |

### `Components`

Possible components to use (TypeScript type).

See [`Components` from
`hast-util-to-jsx-runtime`](https://github.com/syntax-tree/hast-util-to-jsx-runtime#components)
for more info.

### `Options`

Configuration (TypeScript type).

###### Fields

* `Fragment` ([`Fragment` from
  `hast-util-to-jsx-runtime`][github-hast-util-to-jsx-runtime-fragment],
  required)
  — fragment
* `jsx` ([`Jsx` from
  `hast-util-to-jsx-runtime`][github-hast-util-to-jsx-runtime-jsx],
  required in production)
  — dynamic JSX
* `jsxs` ([`Jsx` from
  `hast-util-to-jsx-runtime`][github-hast-util-to-jsx-runtime-jsx],
  required in production)
  — static JSX
* `jsxDEV` ([`JsxDev` from
  `hast-util-to-jsx-runtime`](https://github.com/syntax-tree/hast-util-to-jsx-runtime#jsxdev),
  required in development)
  — development JSX
* `components` ([`Partial<Components>`][api-components], optional)
  — components to use
* `development` (`boolean`, default: `false`)
  — whether to use `jsxDEV` when on or `jsx` and `jsxs` when off
* `elementAttributeNameCase` (`'html'` or `'react'`, default: `'react'`)
  — specify casing to use for attribute names
* `passNode` (`boolean`, default: `false`)
  — pass the hast element node to components
* `space` (`'html'` or `'svg'`, default: `'html'`)
  — whether `tree` is in the `'html'` or `'svg'` space, when an `<svg>`
  element is found in the HTML space, this package already automatically
  switches to and from the SVG space when entering and exiting it
* `stylePropertyNameCase`
  (`'css'` or `'dom'`, default: `'dom'`)
  — specify casing to use for property names in `style` objects
* `tableCellAlignToStyle`
  (`boolean`, default: `true`)
  — turn obsolete `align` props on `td` and `th` into CSS `style` props

## Types

This package is fully typed with [TypeScript][].
It exports the additional types [`Components`][api-components] and
[`Options`][api-options].
More advanced types are exposed from
[`hast-util-to-jsx-runtime`][github-hast-util-to-jsx-runtime].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `rehype-react@^8`,
compatible with Node.js 17.

This plugin works with `rehype-parse` version 3+, `rehype` version 4+, and
`unified` version 9+, and React 18+.

## Security

Use of `rehype-react` can open you up to a
[cross-site scripting (XSS)][wikipedia-xss]
attack if the tree is unsafe.
Use [`rehype-sanitize`][github-rehype-sanitize] to make the tree safe.

## Related

* [`remark-rehype`](https://github.com/remarkjs/remark-rehype)
  — turn markdown into HTML to support rehype
* [`rehype-remark`](https://github.com/rehypejs/rehype-remark)
  — turn HTML into markdown to support remark
* [`rehype-retext`](https://github.com/rehypejs/rehype-retext)
  — rehype plugin to support retext
* [`rehype-sanitize`][github-rehype-sanitize]
  — sanitize HTML

## Contribute

See [`contributing.md`][health-contributing]
in
[`rehypejs/.github`][health]
for ways to get started.
See
[`support.md`][health-support]
for ways to get help.

This project has a [code of conduct][health-coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][file-license] © [Titus Wormer][wooorm],
modified by [Tom MacWright][macwright],
[Mapbox][], and [rhysd][].

<!-- Definitions -->

[api-components]: #components

[api-options]: #options

[api-rehype-react]: #unifieduserehypereact-options

[badge-build-image]: https://github.com/rehypejs/rehype-react/workflows/main/badge.svg

[badge-build-url]: https://github.com/rehypejs/rehype-react/actions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/rehypejs/rehype-react.svg

[badge-coverage-url]: https://codecov.io/github/rehypejs/rehype-react

[badge-downloads-image]: https://img.shields.io/npm/dm/rehype-react.svg

[badge-downloads-url]: https://www.npmjs.com/package/rehype-react

[badge-size-image]: https://img.shields.io/bundlejs/size/rehype-react

[badge-size-url]: https://bundlejs.com/?q=rehype-react

[esmsh]: https://esm.sh

[file-license]: license

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-hast-util-to-jsx-runtime]: https://github.com/syntax-tree/hast-util-to-jsx-runtime

[github-hast-util-to-jsx-runtime-fragment]: https://github.com/syntax-tree/hast-util-to-jsx-runtime#fragment

[github-hast-util-to-jsx-runtime-jsx]: https://github.com/syntax-tree/hast-util-to-jsx-runtime#jsx

[github-mdx]: https://github.com/mdx-js/mdx/

[github-react-markdown]: https://github.com/remarkjs/react-markdown

[github-react-remark]: https://github.com/remarkjs/react-remark

[github-rehype]: https://github.com/rehypejs/rehype

[github-rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[github-unified]: https://github.com/unifiedjs/unified

[health]: https://github.com/rehypejs/.github

[health-coc]: https://github.com/rehypejs/.github/blob/main/code-of-conduct.md

[health-contributing]: https://github.com/rehypejs/.github/blob/main/contributing.md

[health-support]: https://github.com/rehypejs/.github/blob/main/support.md

[macwright]: https://macwright.org

[mapbox]: https://www.mapbox.com

[npmjs-install]: https://docs.npmjs.com/cli/install

[rhysd]: https://rhysd.github.io

[typescript]: https://www.typescriptlang.org

[wikipedia-xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[wooorm]: https://wooorm.com
