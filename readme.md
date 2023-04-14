# rehype-react

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[rehype][]** plugin to compile HTML to React nodes.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(rehypeReact, options)`](#unifieduserehypereact-options)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([rehype][]) plugin that compiles HTML (hast) to
React nodes (the virtual DOM that React uses).

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**rehype** adds support for HTML to unified.
**hast** is the HTML AST that rehype uses.
This is a rehype plugin that adds a compiler to compile hast to React nodes.

## When should I use this?

This plugin adds a compiler for rehype, which means that it turns the final
HTML (hast) syntax tree into something else (in this case, a React node).
It’s useful when you’re already using unified (whether remark or rehype) or are
open to learning about ASTs (they’re powerful!) and want to render content in
your React app.

If you’re not familiar with unified, then [`react-markdown`][react-markdown]
might be a better fit.
You can also use [`react-remark`][react-remark] instead, which is somewhere
between `rehype-react` and `react-markdown`, as it does more that the former and
is more modern (such as supporting hooks) than the latter, and also a good
alternative.
If you want to use JavaScript and JSX *inside* markdown files, use [MDX][].

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install rehype-react
```

In Deno with [`esm.sh`][esmsh]:

```js
import rehypeReact from 'https://esm.sh/rehype-react@7'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import rehypeReact from 'https://esm.sh/rehype-react@7?bundle'
</script>
```

## Use

Say our React app module `example.js` looks as follows:

```js
import {createElement, Fragment, useEffect, useState} from 'react'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeReact from 'rehype-react'

const text = `<h2>Hello, world!</h2>
<p>Welcome to my page 👀</p>`

function useProcessor(text) {
  const [Content, setContent] = useState(Fragment)

  useEffect(() => {
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeReact, {createElement, Fragment})
      .process(text)
      .then((file) => {
        setContent(file.result)
      })
  }, [text])

  return Content
}

export default function App() {
  return useProcessor(text)
}
```

Assuming that runs in Next.js, Create React App (CRA), or similar, we’d get:

```html
<h2>Hello, world!</h2>
<p>Welcome to my page 👀</p>
```

## API

This package exports no identifiers.
The default export is `rehypeReact`.

### `unified().use(rehypeReact, options)`

Compile HTML to React nodes.

> 👉 **Note**: this compiler returns a React node where compilers typically
> return `string`.
> When using `.stringify`, the result is such a React node.
> When using `.process` (or `.processSync`), the result is available at
> `file.result`.

##### `options`

Configuration (optional).

###### `options.createElement`

How to create elements or components (`Function`, required).
You should typically pass `React.createElement`.

###### `options.Fragment`

Create fragments instead of an outer `<div>` if available (`symbol`).
You should typically pass `React.Fragment`.

###### `options.components`

Override default elements (such as `<a>`, `<p>`, etc.) by passing an object
mapping tag names to components (`Record<string, Component>`, default: `{}`).

For example, to use `<MyLink>` components instead of `<a>`, and `<MyParagraph>`
instead of `<p>`, so something like this:

```js
  // …
  .use(rehypeReact, {
    createElement: React.createElement,
    components: {
      a: MyLink,
      p: MyParagraph
    }
  })
  // …
```

###### `options.prefix`

React key prefix (`string`, default: `'h-'`).

###### `options.passNode`

Pass the original hast node as `props.node` to custom React components
(`boolean`, default: `false`).

###### `options.fixTableCellAlign`

Fix obsolete align attributes on table cells by turning them
into inline styles (`boolean`, default: `true`).
Keep it on when working with markdown, turn it off when working
with markup for emails.

## Types

This package is fully typed with [TypeScript][].
It exports an `Options` type, which specifies the interface of the accepted
options.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

This plugin works with `rehype-parse` version 3+, `rehype` version 4+, and
`unified` version 9+, and React 16+.

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

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-react.svg

[size]: https://bundlephobia.com/result?p=rehype-react

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[npm]: https://docs.npmjs.com/cli/install

[esmsh]: https://esm.sh

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/HEAD/contributing.md

[support]: https://github.com/rehypejs/.github/blob/HEAD/support.md

[coc]: https://github.com/rehypejs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[titus]: https://wooorm.com

[tom]: https://macwright.org

[mapbox]: https://www.mapbox.com

[rhysd]: https://rhysd.github.io

[typescript]: https://www.typescriptlang.org

[unified]: https://github.com/unifiedjs/unified

[rehype]: https://github.com/rehypejs/rehype

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[react-markdown]: https://github.com/remarkjs/react-markdown

[react-remark]: https://github.com/remarkjs/react-remark

[mdx]: https://github.com/mdx-js/mdx/
