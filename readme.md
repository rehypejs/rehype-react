# rehype-react

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[rehype][]** plugin to turn HTML into preact, react, solid, svelte, vue, etc.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(rehypeReact, options)`](#unifieduserehypereact-options)
    *   [`Components`](#components)
    *   [`Options`](#options)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([rehype][]) plugin that compiles HTML (hast) to
any JSX runtime (preact, react, solid, svelte, vue, etc).

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

If you’re not familiar with unified, then [`react-markdown`][react-markdown]
might be a better fit.
You can also use [`react-remark`][react-remark] instead, which is somewhere
between `rehype-react` and `react-markdown`, as it does more that the former and
is more modern (such as supporting hooks) than the latter, and also a good
alternative.
If you want to use JavaScript and JSX *inside* markdown files, use [MDX][].

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

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

*   `options` ([`Options`][api-options], required)
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

*   `Fragment` ([`Fragment` from
    `hast-util-to-jsx-runtime`](https://github.com/syntax-tree/hast-util-to-jsx-runtime#fragment),
    required)
    — fragment
*   `jsx` ([`Jsx` from
    `hast-util-to-jsx-runtime`](https://github.com/syntax-tree/hast-util-to-jsx-runtime#jsx),
    required in production)
    — dynamic JSX
*   `jsxs` ([`Jsx` from
    `hast-util-to-jsx-runtime`](https://github.com/syntax-tree/hast-util-to-jsx-runtime#jsx),
    required in production)
    — static JSX
*   `jsxDEV` ([`JsxDev` from
    `hast-util-to-jsx-runtime`](https://github.com/syntax-tree/hast-util-to-jsx-runtime#jsxdev),
    required in development)
    — development JSX
*   `components` ([`Partial<Components>`][api-components], optional)
    — components to use
*   `development` (`boolean`, default: `false`)
    — whether to use `jsxDEV` when on or `jsx` and `jsxs` when off
*   `elementAttributeNameCase` (`'html'` or `'react'`, default: `'react'`)
    — specify casing to use for attribute names
*   `passNode` (`boolean`, default: `false`)
    — pass the hast element node to components
*   `space` (`'html'` or `'svg'`, default: `'html'`)
    — whether `tree` is in the `'html'` or `'svg'` space, when an `<svg>`
    element is found in the HTML space, this package already automatically
    switches to and from the SVG space when entering and exiting it
*   `stylePropertyNameCase`
    (`'css'` or `'dom'`, default: `'dom'`)
    — specify casing to use for property names in `style` objects
*   `tableCellAlignToStyle`
    (`boolean`, default: `true`)
    — turn obsolete `align` props on `td` and `th` into CSS `style` props

## Types

This package is fully typed with [TypeScript][].
It exports the additional types [`Components`][api-components] and
[`Options`][api-options].
More advanced types are exposed from
[`hast-util-to-jsx-runtime`][hast-util-to-jsx-runtime].

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

Use of `rehype-react` can open you up to a [cross-site scripting (XSS)][xss]
attack if the tree is unsafe.
Use [`rehype-sanitize`][rehype-sanitize] to make the tree safe.

## Related

*   [`remark-rehype`](https://github.com/remarkjs/remark-rehype)
    — turn markdown into HTML to support rehype
*   [`rehype-remark`](https://github.com/rehypejs/rehype-remark)
    — turn HTML into markdown to support remark
*   [`rehype-retext`](https://github.com/rehypejs/rehype-retext)
    — rehype plugin to support retext
*   [`rehype-sanitize`][rehype-sanitize]
    — sanitize HTML

## Contribute

See [`contributing.md`][contributing] in [`rehypejs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][titus], modified by [Tom MacWright][tom],
[Mapbox][], and [rhysd][].

<!-- Definitions -->

[build-badge]: https://github.com/rehypejs/rehype-react/workflows/main/badge.svg

[build]: https://github.com/rehypejs/rehype-react/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-react.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-react

[downloads-badge]: https://img.shields.io/npm/dm/rehype-react.svg

[downloads]: https://www.npmjs.com/package/rehype-react

[size-badge]: https://img.shields.io/bundlejs/size/rehype-react

[size]: https://bundlejs.com/?q=rehype-react

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/main/contributing.md

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[coc]: https://github.com/rehypejs/.github/blob/main/code-of-conduct.md

[license]: license

[titus]: https://wooorm.com

[tom]: https://macwright.org

[mapbox]: https://www.mapbox.com

[rhysd]: https://rhysd.github.io

[hast-util-to-jsx-runtime]: https://github.com/syntax-tree/hast-util-to-jsx-runtime

[mdx]: https://github.com/mdx-js/mdx/

[react-markdown]: https://github.com/remarkjs/react-markdown

[react-remark]: https://github.com/remarkjs/react-remark

[rehype]: https://github.com/rehypejs/rehype

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[typescript]: https://www.typescriptlang.org

[unified]: https://github.com/unifiedjs/unified

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[api-components]: #components

[api-options]: #options

[api-rehype-react]: #unifieduserehypereact-options
