import * as compose from 'koa-compose'
import * as discord from 'discord.js'
import * as avvio from 'avvio'

import { skipOverride, displayName, meta } from '../lib/plugin'
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
    createReply: (override?: discord.RichEmbedOptions) => Reply
    /** allows context overloading */
    [key: string]: any
  }

  export interface Options {
    /** logger options */
    logger?: Logger.options
    /** reply base option */
    reply?: discord.RichEmbedOptions
  }

  export interface Plugin<O, I> extends avvio.Plugin<O, I> {
    [skipOverride]?: boolean
    [displayName]?: string
    [meta]?: string
  }
}
