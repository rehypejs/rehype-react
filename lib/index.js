/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast-util-to-jsx-runtime').Options} Options
 * @typedef {import('unified').Compiler<Root, JSX.Element>} Compiler
 * @typedef {import('unified').Processor<undefined, undefined, undefined, Root, JSX.Element>} Processor
 */

import {toJsxRuntime} from 'hast-util-to-jsx-runtime'

/**
 * Turn HTML into preact, react, solid, svelte, vue, etc.
 *
 * @param {Options} options
 *   Configuration (required).
 * @returns {undefined}
 *   Nothing.
 */
export default function rehypeReact(options) {
  // @ts-expect-error: TypeScript doesn’t handle `this` well.
  // eslint-disable-next-line unicorn/no-this-assignment
  const self = /** @type {Processor} */ (this)

  self.compiler = compiler

  /** @type {Compiler} */
  function compiler(tree, file) {
    return toJsxRuntime(tree, {filePath: file.path, ...options})
  }
}
