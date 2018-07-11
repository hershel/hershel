import { sink } from 'pino/test/helper'
import * as pino from 'pino'
import test from 'ava'

import { Client } from '../src'
import { createMessage } from './discord.helper'

test('the logger defaults to an abstraction', async t => {
  const bot = new Client()

  t.is(bot.logger.level, 'abstract')

  t.is(typeof bot.logger.trace, 'function')
  t.is(typeof bot.logger.debug, 'function')
  t.is(typeof bot.logger.info, 'function')
  t.is(typeof bot.logger.warn, 'function')
  t.is(typeof bot.logger.error, 'function')
  t.is(typeof bot.logger.fatal, 'function')
  t.is(typeof bot.logger.child, 'function')
})

test('when `logger` is false, an abstraction is provided as a logger', async t => {
  const bot = new Client({
    logger: false
  })

  t.is(bot.logger.level, 'abstract')
})

test('using pino as the logger', async t => {
  const bot = new Client({
    logger: true
  })

  t.is(bot.logger.pino, require('pino/package.json').version)
  t.is(bot.logger.level, 'info')
})

test('provide custom options to pino', async t => {
  const bot = new Client({
    logger: {
      level: 'error',
      name: 'test-logger-03'
    }
  })

  t.is(bot.logger.level, 'error')
})

test.cb('test custom serializers', t => {
  t.plan(3)

  const bot = new Client({
    logger: {
      stream: sink(chunk => {
        const { message } = chunk

        t.is(typeof message.id, 'string')
        t.is(message.content, 'hello world')
        t.is(message.author, 'HelloWorld#0001')

        t.end()
      })
    }
  })

  const message = createMessage()

  bot.logger.info({ message })
})

test.cb('test logger inheritance', t => {
  t.plan(2)

  const logger = pino(
    { base: { hello: 'world' } },
    sink(chunk => {
      t.is(chunk.hello, 'world')
      t.is(chunk.world, 'hello')

      t.end()
    })
  )

  const bot = new Client({
    logger: {
      logger
    }
  })

  bot.logger.info({ world: 'hello' })
})
