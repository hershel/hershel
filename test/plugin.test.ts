import { plugin } from '@hershel/plugin'
import test from 'ava'

import { Client } from '../src'

test('require a plugin', t => {
  t.plan(2)
  const bot = new Client()

  bot.register(require('./plugin.helper').withSso)
  bot.register(require('./plugin.helper').withoutSso)

  return bot.ready().then(() => {
    t.is(bot.get('test-withSso'), 'test value')
    t.not(bot.get('test-withoutSso'), 'test value')
  })
})

test('registering with a plugin helper should not incapsulate its code', t => {
  t.plan(4)

  const bot = new Client()

  bot.register((instance, options, next) => {
    instance.register(
      plugin((i, o, n) => {
        i.set('test', 'test value')
        t.is(i.get('test'), 'test value')
        n()
      })
    )

    t.not(instance.get('test'), 'test value')

    // the decoration is added at the end
    instance.after(() => {
      t.is(instance.get('test'), 'test value')
    })

    next()
  })

  return bot.ready().then(() => {
    t.not(bot.get('test'), 'test value')
  })
})
