import type {ComponentType} from 'react'
import type {Element} from 'hast'

interface WithNode {
  node: Element
}

export interface ComponentsWithNodeOptions {
  /**
   * Expose hast elements as a `node` field in components
   */
  passNode: true
  /**
   * Override default elements (such as `<a>`, `<p>`, etcetera) by passing an
   * object mapping tag names to components.
   */
  components?: Partial<
    {
      [TagName in keyof JSX.IntrinsicElements]:
        | keyof JSX.IntrinsicElements
        | ComponentType<WithNode & JSX.IntrinsicElements[TagName]>
    }
  >
}

export interface ComponentsWithoutNodeOptions {
  /**
   * Expose hast elements as a `node` field in components.
   */
  passNode?: false | undefined

  /**
   * Override default elements (such as `<a>`, `<p>`, etcetera) by passing an
   * object mapping tag names to components.
   */
  components?: Partial<
    {
      [TagName in keyof JSX.IntrinsicElements]:
        | keyof JSX.IntrinsicElements
        | ComponentType<JSX.IntrinsicElements[TagName]>
    }
  >
}
