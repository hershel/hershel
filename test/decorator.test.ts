import test from 'ava'

import { Client } from '../src'

test('decorator methods should exist', t => {
  const bot = new Client()

  t.truthy(bot.has)
  t.truthy(bot.get)
  t.truthy(bot.set)
})

test('`set` and `get` should set and get the specified values', async t => {
  const bot = new Client()

  const testValue = Math.random()

  bot.set('test', testValue)

  // @ts-ignore
  t.is(bot.custom.test, testValue)
  t.is(bot.get('test'), testValue)
})

test('`has` should check if the given method already exists', async t => {
  t.plan(2)
  const bot = new Client()

  const testValue = Math.random()

  bot.register((instance, opts, next) => {
    instance.set('test', testValue)
    t.true(instance.has('test'))
    next()
  })

  return bot.ready().then(() => {
    t.not(bot.get('test'), 'test value')
  })
})

test('`set` should throw if trying to redeclare a property', async t => {
  const bot = new Client()

  const testValue = Math.random()

  bot.set('test', testValue)
  t.throws(() => bot.set('test', testValue), {
    message: '`test` key already exists'
  })
})

test('server custom properties should be incapsulated with .register', t => {
  t.plan(4)
  const bot = new Client()

  const testValue = Math.random()

  bot.register((instance, opts, next) => {
    instance.set('test', testValue)
    // @ts-ignore
    t.is(instance.custom.test, testValue)
    t.is(instance.get('test'), testValue)

    next()
  })

  return bot.ready().then(() => {
    // @ts-ignore
    t.not(bot.custom.test, testValue)
    t.not(bot.get('test'), testValue)
  })
})

test('different instances should mean different decorations', async t => {
  t.plan(1)

  const bot1 = new Client()
  const bot2 = new Client()

  bot1.set('test', 'foo')
  bot2.set('test', 'foo')

  t.pass()
})
