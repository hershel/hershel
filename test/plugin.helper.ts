import { plugin } from '../src'

export const withSso = plugin((i, o, n) => {
  i.set('test-withSso', 'test value')
  n()
})

export const withoutSso = plugin(
  (i, o, n) => {
    i.set('test-withoutSso', 'test value')
    n()
  },
  { shouldSkipOverride: false }
)
