import * as avvio from 'avvio'
import ow from 'ow'

import { Application } from '../types'
import { Client } from '../Client'

export const skipOverride = Symbol.for('skip-override')

/**
 * Wrap client in avvio context
 * @param client client instance
 */
export function createPluginInstance(client: Client) {
  const app = avvio(client, { autostart: false, expose: { use: 'register' } })

  app.override = (old, fn: Application.Plugin<any, Client>) => {
    if (fn[skipOverride]) return old

    const instance: typeof old = Object.create(old)
    // @ts-ignore
    instance.middleware = old.middleware.slice()
    // @ts-ignore
    instance.custom = Object.create(old.custom)

    return instance
  }

  client.started = false

  app.onClose(async () => {
    app.started = false
    await client.destroy()
  })
}

interface PluginHelperOptions {
  shouldSkipOverride?: boolean
}

/**
 * Plugin helper
 * @param fn plugin function
 */
export function plugin(
  fn: Application.Plugin<any, Client>,
  options: PluginHelperOptions = {}
) {
  ow(fn, ow.function.label('plugin'))

  if (options.shouldSkipOverride === false) return fn
  else fn[skipOverride] = true

  return fn
}
