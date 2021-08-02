import type {Root} from 'hast'
import type {ReactElement} from 'react'
import type {Plugin} from 'unified'
import type {Options} from './lib/index.js'

/**
 * Plugin to compile to React
 *
 * @param options
 *   Configuration.
 */
// Note: defining all react nodes as result value seems to trip TS up.
const rehypeReact: Plugin<[Options], Root, ReactElement<unknown>>
export default rehypeReact
export type {Options}
