import * as discord from 'discord.js'
import { stub } from 'sinon'
import test from 'ava'

import { createReplyFactory } from '../src/lib/reply'
import { createMessage } from './discord.helper'
import { Client } from '../src'

test.cb('test adding base reply options in client constructor', (t) => {
  t.plan(5)

  const bot = new Client({
    reply: {
      title: 'custom',
      footer: { text: 'custom' },
    },
  })

  // @ts-ignore
  t.deepEqual(bot.config.reply, {
    title: 'custom',
    footer: { text: 'custom' },
  })

  bot.use(({ createReply }, next) => {
    const response = createReply()

    t.is(response.title, 'custom')
    t.is(response.footer.text, 'custom')

    const response2 = createReply({ title: 'overrided' })
    t.is(response2.title, 'overrided')
    t.is(response2.footer.text, 'custom')

    t.end()
  })

  bot.emit('ready')

  setImmediate(() => bot.emit('message', createMessage()))
})

test('should get correct reply payload for `embed` and `string` types', async (t) => {
  const message = createMessage()

  const createReply = createReplyFactory()(message)
  const response = createReply()

  response.setTitle('test title').setMessage('test message')

  {
    response.setShape('embed')
    t.is(response.shape, 'embed')
    let payload = response.payload() as discord.MessageEmbed

    t.true(payload instanceof discord.MessageEmbed)
    t.is(payload.title, 'test title')
    t.is(payload.description, 'test message')
  }

  {
    response.setShape('string')
    t.is(response.shape, 'string')
    let payload = response.payload() as string

    t.is(payload, 'test message')
  }
})

test('should get correct reply payload with type overload in createReply()', async (t) => {
  const message = createMessage()

  const createReply = createReplyFactory()(message)

  {
    const response = createReply({ shape: 'string' })
    t.is(response.shape, 'string')
    response.setShape('embed')
    t.is(response.shape, 'embed')
  }

  {
    const response = createReply({ shape: 'embed' })
    t.is(response.shape, 'embed')
    response.setShape('string')
    t.is(response.shape, 'string')
  }
})

test('should not update unsent message', async (t) => {
  const message = createMessage()

  const editStub = stub(message, 'edit')

  const createReply = createReplyFactory()(message)
  const response = createReply()

  await t.throwsAsync(response.update(), {
    message: 'Cannot update unsent message. Use `.send()`',
  })

  t.false(response.is_sent)
  t.false(editStub.called)
})

test('should get correct values for reply getter', async (t) => {
  const message = createMessage()

  const createReply = createReplyFactory()(message)
  const response = createReply()

  t.is(response.message, message)
  t.is(response.response, null)
  t.false(response.is_sent)
})

test('should not send nor update reply while its payload is empty', async (t) => {
  const message = createMessage()

  const createReply = createReplyFactory()(message)
  const response = createReply()

  response.setShape('string')

  await t.throwsAsync(response.send(), {
    message: 'Cannot send reply while its payload is empty',
  })

  t.false(response.is_sent)

  // @ts-ignore
  response._is_sent = true

  await t.throwsAsync(response.update(), {
    message: 'Cannot update reply while its payload is empty',
  })
})

test('`reset` should reset reply properties', async (t) => {
  const message = createMessage()

  const createReply = createReplyFactory()(message)
  const response = createReply()

  response.setTitle('test title').setDescription('test description')

  response.reset({ title: 'reseted title' })

  t.is(response.title, 'reseted title')
  t.is(response.description, undefined)

  response.reset()

  t.deepEqual(response.payload(), new discord.MessageEmbed())
})

test.serial('`send` should be called with a payload', async (t) => {
  const message = createMessage()

  const sendStub = stub(message.channel, 'send')

  const createReply = createReplyFactory()(message)
  const response = createReply()

  response.setTitle('hello')

  await response.send()

  t.true(sendStub.calledOnce)
  t.deepEqual(sendStub.firstCall.args[0], response.payload())

  sendStub.restore()
})

test.serial('should throw when trying to send a reply twice', async (t) => {
  const message = createMessage()

  const sendStub = stub(message.channel, 'send')

  const createReply = createReplyFactory()(message)
  const response = createReply()

  await response.send()

  t.true(response.is_sent)

  await t.throwsAsync(response.send(), {
    message: 'Cannot send reply twice. Use `update`',
  })

  t.true(sendStub.calledOnce)

  sendStub.restore()
})

test.serial('test sending a message with Discord options', async (t) => {
  const message = createMessage()

  const sendStub = stub(message.channel, 'send')

  const createReply = createReplyFactory()(message)
  const response = createReply()

  await response.send({ tts: true, disableMentions: 'all' })

  t.true(sendStub.calledOnce)
  t.deepEqual(sendStub.firstCall.args[1], { tts: true, disableMentions: 'all' })

  sendStub.restore()
})

test.serial('updating reply refresh only changed properties', async (t) => {
  const message = createMessage()

  const editStub = stub(message, 'edit')
  const sendStub = stub(message.channel, 'send').returns(message)

  const createReply = createReplyFactory()(message)
  const response = createReply()

  response
    .setTitle('test title')
    .setDescription('test description')
    .setFooter('test footer')

  await response.send()

  response.setTitle('updated title').setURL('https://example.com')

  await response.update()

  t.true(sendStub.calledOnce)
  t.deepEqual(
    sendStub.firstCall.args[0],
    new discord.MessageEmbed()
      .setTitle('test title')
      .setDescription('test description')
      .setFooter('test footer')
  )

  t.true(editStub.calledOnce)
  t.deepEqual(
    editStub.firstCall.args[0],
    new discord.MessageEmbed()
      .setTitle('updated title')
      .setURL('https://example.com')
      .setDescription('test description')
      .setFooter('test footer')
  )

  sendStub.restore()
  editStub.restore()
})
