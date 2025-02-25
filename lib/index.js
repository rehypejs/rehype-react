/**
 * @import {Options} from 'hast-util-to-jsx-runtime'
 * @import {Root} from 'hast'
 * @import {Compiler, Processor} from 'unified'
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
  // eslint-disable-next-line unicorn/no-this-assignment
  const self = /** @type {Processor<undefined, undefined, undefined, Root>} */ (
    // @ts-expect-error: TypeScript doesn’t handle `this` well.
    this
  )

  self.compiler = compiler

  /** @type {Compiler<Root>} */
  function compiler(tree, file) {
    return toJsxRuntime(tree, {filePath: file.path, ...options})
  }
}
