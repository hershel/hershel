import * as discord from 'discord.js'
import * as pino from 'pino'

import { Logger } from '../types/Logger'

const serializers = {
  message: (msg: discord.Message) => ({
    id: msg.id,
    content: msg.content,
    author: msg.author.tag
  }),
  err: pino.stdSerializers.err
}

export function createLogger(options: Logger.options) {
  if (!options) return abstract()

  if (typeof options === 'boolean') return pino()

  const stream = options.stream
  delete options.stream

  options.serializers = { ...serializers, ...options.serializers }

  const prevLogger = options.logger

  let logger: Logger.logger
  if (prevLogger) {
    options.logger = null
    logger = prevLogger.child(options)
  } else {
    logger = pino(options, stream)
  }

  return logger
}

function abstract(): Logger.logger {
  let logger = Object.create(require('abstract-logging'))
  logger.child = () => logger
  logger.level = 'abstract'

  return logger
}
