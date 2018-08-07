import test from 'ava'

import { noop, noopAsync } from './middleware.helper'
import { createMessage } from './discord.helper'
import { Client } from '../src'

test('should add middleware correctly', async t => {
  const bot = new Client()

  t.notThrows(() => bot.use(noop))
  t.notThrows(() => bot.use(noopAsync))

  // @ts-ignore
  t.is(bot.middleware.length, 2)
})

test('should throw when middleware is not a function', async t => {
  const bot = new Client()

  // @ts-ignore
  t.throws(() => bot.use('Hello world'), {
    message:
      'Expected `middleware` to be of type `Function` but received type `string`'
  })
})

test.cb('should not register middleware when instance is started', t => {
  t.plan(1)

  const bot = new Client()

  bot.emit('ready')

  setImmediate(() => {
    t.throws(() => bot.use(() => {}), {
      message: 'Cannot add new middleware while client is already started'
    })

    t.end()
  })
})

test.cb('error inside middleware should not crash the client', t => {
  t.plan(1)

  const bot = new Client()

  bot.use(() => {
    throw new Error('middleware error')
  })

  bot.emit('ready')

  setImmediate(() => bot.emit('message', createMessage()))

  setImmediate(() => {
    t.pass()
    t.end()
  })
})

test.cb('should compose middleware set and run it for each message', t => {
  t.plan(1)

  const bot = new Client()

  bot.use(({ state }, next) => {
    state.middleware = 1

    next()
  })

  bot.use(({ state }) => {
    state.middleware++

    t.is(state.middleware, 2)

    t.end()
  })

  bot.emit('ready')

  setImmediate(() => bot.emit('message', createMessage()))
})

test.cb('check context that has been passed to middleware', t => {
  t.plan(6)

  // Use pino for this test
  const bot = new Client({
    logger: { level: 'silent' }
  })

  bot.use(ctx => {
    t.is(ctx.app, bot)
    t.is(typeof ctx.createReply, 'function')
    t.is(ctx.id, ctx.message.id)
    // (Keep context ID as message ID ?)
    t.truthy(ctx.logger.version)
    t.is(ctx.message.content, 'test message')
    t.deepEqual(ctx.state, {})

    t.end()
  })

  bot.emit('ready')

  setImmediate(() =>
    bot.emit('message', createMessage({ content: 'test message' }))
  )
})
