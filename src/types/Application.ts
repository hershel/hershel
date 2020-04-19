import * as compose from 'koa-compose'
import * as discord from 'discord.js'
import * as avvio from 'avvio'

import { skipOverride, displayName, metadata } from '../lib/plugin'
import { Reply } from '../lib/reply'
import { Client } from '../Client'
import { Logger } from './Logger'

export namespace Application {
  export type middleware = compose.Middleware<Context>

  export interface Context {
    /** the client instance */
    app: Client
    /** the request id */
    id: string
    /** current message */
    message: discord.Message
    /** pino logger instance */
    logger: Logger.logger
    /** namespace for passing info through middleware */
    state: Record<any, any>
    /** create reply function */
    createReply: (override?: discord.MessageEmbedOptions) => Reply
    /** allows context overloading */
    [key: string]: any
  }

  export interface Options {
    /** logger options */
    logger?: Logger.options
    /** reply base option */
    reply?: discord.MessageEmbedOptions
    /**
     * A synchronous function that will be used to generate identifiers.
     * Default ID is discord message ID.
     */
    genId?: (message: discord.Message) => string
  }

  export interface Plugin<O = {}, I = Client> extends avvio.Plugin<O, I> {
    [skipOverride]?: boolean
    [displayName]?: string
    [metadata]?: {
      name?: string
      [key: string]: any
    }
  }
}
