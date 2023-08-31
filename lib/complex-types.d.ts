import type {ComponentType} from 'react'
import type {Element} from 'hast'

type WithNode = {
  node: Element
}

export type ComponentsWithNodeOptions = {
  /**
   * Expose hast elements as a `node` field in components
   */
  passNode: true
  /**
   * Override default elements (such as `<a>`, `<p>`, etcetera) by passing an
   * object mapping tag names to components.
   */
  components?: Partial<{
    [TagName in keyof JSX.IntrinsicElements]:
      | keyof JSX.IntrinsicElements
      | ComponentType<WithNode & JSX.IntrinsicElements[TagName]>
  }>
}

export type ComponentsWithoutNodeOptions = {
  /**
   * Expose hast elements as a `node` field in components.
   */
  passNode?: false | undefined

  /**
   * Override default elements (such as `<a>`, `<p>`, etcetera) by passing an
   * object mapping tag names to components.
   */
  components?: Partial<{
    [TagName in keyof JSX.IntrinsicElements]:
      | keyof JSX.IntrinsicElements
      | ComponentType<JSX.IntrinsicElements[TagName]>
  }>
}
