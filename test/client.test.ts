import test from 'ava'

import { createMessage } from './discord.helper'
import { Client } from '../src'

test('`new client` should throw when instanciated with wrong options', async (t) => {
  // @ts-ignore
  t.throws(() => new Client('lol'), {
    message:
      'Expected `options` to be of type `object` but received type `string`',
  })
})

test.cb('close client instance', (t) => {
  t.plan(1)

  const bot = new Client()

  bot.close((err) => {
    if (err) t.fail(err.message)

    t.false(bot.started, 'should destroy Discord client')

    t.end()
  })
})

test.cb('set custom error handler', (t) => {
  t.plan(1)

  const bot = new Client()

  // @ts-ignore
  bot.user = { tag: 'TEST MODE' }

  bot.setErrorHandler((err) => {
    t.is(err.message, 'middleware error')

    t.end()
  })

  bot.use(() => {
    throw new Error('middleware error')
  })

  bot.emit('ready')

  setImmediate(() => bot.emit('message', createMessage()))
})

test.cb('test custom id generation with genId', (t) => {
  t.plan(1)

  const bot = new Client({
    genId: (msg) => `hello+${msg.id}`,
  })

  bot.use((ctx) => {
    t.is(ctx.id, 'hello+world')
    t.end()
  })

  bot.emit('ready')

  setImmediate(() => bot.emit('message', createMessage({ id: 'world' })))
})
