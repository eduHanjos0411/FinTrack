import type { CSSProperties } from 'react'

/** Define uma custom property CSS inline (ex.: `--chip`, `--accent`). */
export function cssVar(name: `--${string}`, value: string): CSSProperties {
  return { [name]: value } as CSSProperties
}
