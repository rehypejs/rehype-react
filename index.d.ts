import type {Root} from 'hast'
import type {Plugin} from 'unified'
import type {Options} from './lib/index.js'

export type {Components, Options} from 'hast-util-to-jsx-runtime'

/**
 * Turn HTML into preact, react, solid, svelte, vue, etc.
 *
 * ###### Result
 *
 * This plugin registers a compiler that returns a `JSX.Element` where
 * compilers typically return `string`.
 * When using `.stringify` on `unified`, the result is such a `JSX.Element`.
 * When using `.process` (or `.processSync`), the result is available at
 * `file.result`.
 *
 * ###### Frameworks
 *
 * There are differences between what JSX frameworks accept, such as whether
 * they accept `class` or `className`, or `background-color` or
 * `backgroundColor`.
 *
 * For hast elements transformed by this project, this is be handled through
 * options:
 *
 * | Framework | `elementAttributeNameCase` | `stylePropertyNameCase` |
 * | --------- | -------------------------- | ----------------------- |
 * | Preact    | `'html'`                   | `'dom'`                 |
 * | React     | `'react'`                  | `'dom'`                 |
 * | Solid     | `'html'`                   | `'css'`                 |
 * | Vue       | `'html'`                   | `'dom'`                 |
 *
 * @param options
 *   Configuration (required).
 * @returns
 *   Nothing.
 */
declare const rehypeReact: Plugin<[Options], Root, JSX.Element>
export default rehypeReact

// Register the result type.
declare module 'unified' {
  interface CompileResultMap {
    JsxElement: JSX.Element
  }
}
