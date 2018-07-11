import * as stream from 'stream'
import * as pino from 'pino'

export namespace Logger {
  export type logger = pino.Logger
  export type options = LoggerOption | boolean

  export interface LoggerOption extends pino.LoggerOptions {
    /** a writable stream where the logs will be written */
    stream?: stream.Duplex | stream.Writable | stream.Transform
    /** reuses a pino logger instance */
    logger?: pino.Logger
  }
}
