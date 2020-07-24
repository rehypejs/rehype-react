// Minimum TypeScript Version: 3.4

import {Transformer} from 'unified'
import {Prefix, CreateElementLike} from 'hast-to-hyperscript'
import {Node} from 'unist'

declare namespace rehypeReact {
  type FragmentLike<T> = (props: any) => T | null

  interface ComponentProps {
    [prop: string]: unknown
    node?: Node
  }

  type ComponentLike<T> = (props: ComponentProps) => T | null

  interface Options<H extends CreateElementLike> {
    /**
     * How to create elements or components.
     * You should typically pass `React.createElement`
     */
    createElement: H

    /**
     * Create fragments instead of an outer `<div>` if available
     * You should typically pass `React.Fragment`
     */
    Fragment?: FragmentLike<ReturnType<H>>

    /**
     * Override default elements (such as `<a>`, `<p>`, etcetera) by passing an object mapping tag names to components
     */
    components?: {
      [element: string]: ComponentLike<ReturnType<H>>
    }

    /**
     * React key prefix
     *
     * @defaultValue 'h-'
     */
    prefix?: Prefix

    /**
     * Expose HAST Node objects to `node` prop of react components
     *
     * @defaultValue false
     */
    passNode?: boolean
  }
}

/**
 * Rehype plugin to transform to React
 */
declare function rehypeReact<H extends CreateElementLike>(
  options: rehypeReact.Options<H>
): Transformer

export = rehypeReact
