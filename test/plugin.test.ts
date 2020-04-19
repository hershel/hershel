import { plugin } from '@hershel/plugin'
import test from 'ava'

import { Client } from '../src'
import { registeredPlugins, metadata } from '../src/lib/plugin'

test('require a plugin', (t) => {
  t.plan(2)
  const bot = new Client()

  bot.register(require('./plugin.helper').withSso)
  bot.register(require('./plugin.helper').withoutSso)

  return bot.ready().then(() => {
    t.is(bot.get('test-withSso'), 'test value')
    t.not(bot.get('test-withoutSso'), 'test value')
  })
})

test('registering with a plugin helper should not incapsulate its code', (t) => {
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

test('plugin name should be registered inside client instance', (t) => {
  const bot = new Client()

  function myAwesomePlugin(i, o, n) {
    n()
  }

  function shouldNotAppear(i, o, n) {
    n()
  }

  function shouldNotAppearAtAll(i, o, n) {
    n()
  }

  function withoutAnyMeta(i, o, n) {
    n()
  }

  withoutAnyMeta[metadata] = {}

  bot.register(withoutAnyMeta)
  bot.register(plugin(myAwesomePlugin))
  bot.register(plugin(shouldNotAppear, { name: 'shouldAppear' }))
  bot.register(shouldNotAppearAtAll)
  bot.register(
    plugin((i, o, n) => {
      n()
    })
  )

  return bot.ready().then(() => {
    const list = bot[registeredPlugins]

    t.true(Array.isArray(list))
    t.deepEqual(list, ['myAwesomePlugin', 'shouldAppear', 'anonymous'])
  })
})
