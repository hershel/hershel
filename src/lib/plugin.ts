import * as avvio from 'avvio'
import ow from 'ow'

import { Application } from '../types'
import { Client } from '../Client'

export const displayName = Symbol.for('hershel.display-name')
export const skipOverride = Symbol.for('skip-override')
export const meta = Symbol.for('plugin-metadata')

/**
 * Wrap client in avvio context
 * @param client client instance
 */
export function createPluginInstance(client: Client) {
  const app = avvio(client, { autostart: false, expose: { use: 'register' } })

  app.override = (old, fn: Application.Plugin<any, Client>) => {
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
