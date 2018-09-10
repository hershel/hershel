import * as discord from 'discord.js'
import * as compose from 'koa-compose'
import * as avvio from 'avvio'
import * as pino from 'pino'
import ow from 'ow'

import { createLogger, createPluginInstance, createReplyFactory } from './lib'
import { registeredPlugins } from './lib/plugin'
import { Application as App } from './types'

export class Client extends discord.Client {
  private middleware: App.middleware[] = []
  private custom: Record<string, any> = {}
  private config: App.Options

  public logger: pino.Logger

  constructor(
    options: App.Options = {},
    clientOptions?: discord.ClientOptions
  ) {
    super(clientOptions)

    ow(options, ow.object.label('options'))

    this.config = options
    this.logger = createLogger(options.logger)

    createPluginInstance(this)

    // register discord events
    this.once('ready', this.onReadyEvent)
    this.on('error', this.logger.error)
  }

  /**
   * Add middleware
   * @param fn middleware function
   */
  public use(fn: App.middleware) {
    this.throwIfAlreadyStarted('Cannot add new middleware')

    ow(fn, ow.function.label('middleware'))
    this.middleware.push(fn)

    return this
  }

  /**
   * Decorate client with custom properties
   * @param key key to the custom property
   * @param value value of said property
   */
  public set(key: string, value: any) {
    if (this.has(key)) throw new Error(`\`${key}\` key already exists`)
    this.custom[key] = value
  }

  /**
   * Get custom property
   * @param key property key to get
   */
  public get<T = any>(key: string): T {
    if (this.has(key)) return this.custom[key]

    return null
  }

  /**
   * Check if client has specific key
   * @param key property key to check
   */
  public has(key: string) {
    return this.custom.hasOwnProperty(key)
  }

  /**
   * Set new error handler function
   * @param fn error handler function
   */
  public setErrorHandler(fn: (err: Error) => void) {
    this.throwIfAlreadyStarted('Cannot set error handler')

    ow(fn, ow.function.label('error handler'))
    this.handleError = fn
  }

  /**
   * Internal handler for the 'ready' event
   */
  private async onReadyEvent() {
    const name = this.user ? this.user.tag : 'TEST MODE'
    this.logger.info(`connected to Discord as ${name}`)

    await this.ready()

    const composed = await compose(this.middleware)

    this.started = true

    const createReply = createReplyFactory(this.config.reply)
    const genId = this.config.genId
      ? this.config.genId
      : (msg: discord.Message) => msg.id

    this.on('message', async message => {
      // @ts-ignore
      let ctx: App.Context = {}

      //#region create context
      ctx.id = genId(message)
      ctx.logger = this.logger.child({ id: ctx.id })
      ctx.message = message
      ctx.app = this
      ctx.state = {}

      ctx.createReply = createReply(message)
      //#endregion

      ctx.logger.trace({ message }, 'message incoming')

      composed(ctx)
        .then(() => this.middlewareCallback(ctx, null))
        .catch(err => this.middlewareCallback(ctx, err))
    })
  }

  /**
   * Middleware callback
   * @param err error
   */
  private middlewareCallback({ logger }: App.Context, err?: Error) {
    if (err) {
      logger.error({ err }, 'middleware process ended with an error')
      if (this.handleError) return this.handleError(err)
    }
  }

  /**
   * Custom error handler
   */
  private handleError: (err: Error) => void = null

  /**
   * Throw error if client is already started
   * @param msg error message to throw
   */
  private throwIfAlreadyStarted(msg: string) {
    if (this.started) throw new Error(`${msg} while client is already started`)
  }

  [registeredPlugins]: string[] = []
}

export interface Client {
  after: avvio.After<this>
  ready: avvio.Ready<this>
  close: avvio.Close<this>
  register: avvio.Use<this>
  onClose: avvio.OnClose<this>

  started: boolean
}
