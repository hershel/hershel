import * as avvio from 'avvio'
import ow from 'ow'

import { Application } from '../types'
import { Client } from '../Client'

export const registeredPlugins = Symbol.for('registered-plugin')
export const displayName = Symbol.for('hershel.display-name')
export const skipOverride = Symbol.for('skip-override')
export const metadata = Symbol.for('plugin-metadata')

/**
 * Wrap client in avvio context
 * @param client client instance
 */
export function createPluginInstance(client: Client) {
  const app = avvio(client, { autostart: false, expose: { use: 'register' } })

  app.override = (old, fn: Application.Plugin) => {
    registerPluginName(old, fn)

    if (!!fn[skipOverride]) return old

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

/**
 * Register plugins name inside client instance
 * @param client client instance
 * @param fn plugin function
 */
function registerPluginName(client: Client, fn: Application.Plugin) {
  const meta = fn[metadata]
  if (!meta) return

  const name = meta.name
  if (!name) return
  client[registeredPlugins].push(name)
}
