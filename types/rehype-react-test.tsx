import * as unified from 'unified'
import * as rehypeToReact from 'rehype-react'
import * as React from 'react'
import {h as virtualDomCreateElement} from 'virtual-dom'
import * as hyperscriptCreateElement from 'hyperscript'
import Vue from 'vue'

// Create element must be provided
unified().use(rehypeToReact) // $ExpectError
unified().use(rehypeToReact, {}) // $ExpectError

// multiple frameworks providing createElement can be used
unified().use(rehypeToReact, {createElement: React.createElement})
unified().use(rehypeToReact, {createElement: virtualDomCreateElement})
unified().use(rehypeToReact, {createElement: hyperscriptCreateElement})
unified().use(rehypeToReact, {createElement: new Vue().$createElement})
unified().use(rehypeToReact, {
  createElement: (name: number) => name // $ExpectError
})

// Prefix, fragment, and components are optional
unified().use(rehypeToReact, {
  createElement: React.createElement,
  prefix: 'h'
})

unified().use(rehypeToReact, {
  createElement: React.createElement,
  Fragment: React.Fragment
})

unified().use(rehypeToReact, {
  createElement: React.createElement,
  components: {
    a: () => <a>example</a>
  }
})

unified().use(rehypeToReact, {
  createElement: React.createElement,
  components: {
    div: () => <>example</>
  }
})

// Mismatch between framework of createElement and components or Fragment should fail
unified().use(rehypeToReact, {
  createElement: virtualDomCreateElement,
  // prettier-ignore typescript versions can disagree where error happens, squish statement so they agree
  components: {a: () => <a>example</a>} // $ExpectError
})
unified().use(rehypeToReact, {
  createElement: virtualDomCreateElement,
  Fragment: () => <a>example</a> // $ExpectError
})
