<h1 align="center">Hershel</h1>

# Getting Started

Thank you for taking a look at Hershel!

This document is intended to introduce you to the functionalities of Hershel.

## Install

Typecript definitions are included in the basic Hershel package.

With npm...

```bash
npm install hershel
```

...or yarn

```bash
yarn add hershel
```

## Write your first bot

To develop a Discord bot, you will need a unique Discord bot token. Go to [Discord Dev](https://discordapp.com/developers/applications/) and generate a new application. We will use the token of the latter through the examples.

Let's write our first bot.

```js
// require Hershel's Client
const { Client } = require('hershel')

// instantiate it
const bot = new Client({
  logger: true
})

bot.use(({ createReply, message }) => {
  const reply = createReply()

  reply
    .setType('string')
    .setMessage(`Hello world in response to ${message.content}`)
    .send()
})

bot.login(process.env.DISCORD_TOKEN)
```

You can learn more about the <code><b>Reply</b></code> API.

And _voilà_, your first bot that will answer Hello World in response to all messages is done. Easy, isn't it?

A basic problem would be to respond to specific commands such as `!joke` or `!help`. Hershel is a platform for easily solving this type of problem, especially with specific packages such as [`@hershel/dispatcher`](https://github.com/hershel/dispatcher) or [`@hershel/plugin`](https://github.com/hershel/plugin), which we will see later on.

## Plugin

Sometimes you will need to change the behavior of your bot or program when it starts, like adding features (database), event handlers etc... This is where the plugins come in.

Let's rewrite our first code by adding the support of [`mongo DB`](https://www.mongodb.com).

### server.js

```js
const { Client } = require('hershel')

const bot = new Client({
  logger: true
})

bot.register(require('our-db-connector'), {
  url: 'mongodb://localhost:27017/'
})

bot.register(require('./our-bot'))

bot.login(process.env.DISCORD_TOKEN)
```

### our-db-connector.js

```js
const { MongoClient } = require('mongodb')
const plugin = require('@hershel/plugin')

async function mongoPlugin(instance, options) {
  const url = options.url
  delete options.url

  const db = await MongoClient.connect(
    url,
    options
  )

  instance.set('db', db)
}

// Wrapping a plugin function with @hershel/plugin exposes the decorators
// (via set, get and has) & middlewares inside the plugin to the parent scope.
module.exports = plugin(dbConnector, {
  shouldSkipOverride: true,
  name: 'mongodb'
})
```

### our-bot.js

```js
async function bot(instance) {
  const db = instance.get('db')
  const collection = db.collection('test')

  bot.use(async ({ createReply, message }, next) => {
    const result = await collection.findOne({ id: message.author.id })
    const reply = createReply({ type: 'string' })

    if (result.name === null) {
      reply.setMessage('I dont know you >.>')
    } else {
      reply.setMessage(`Hello ${result.name} <3`)
    }

    reply.send()

    next()
  })
}

module.exports = bot
```

This is a simple example of what we call "modular". You can do absolutely everything by following this example. Unlike many frameworks for discord.js, Hershel does not embed an abstraction layer for databases and lets you integrate your favorite ORM / Database simply as shown in this example.

Let's recap our code.
You can see that we have used `register` twice, for the db and then for the bot. It will load your plugins in the same order you declare them, and it will load the next plugin only once the current one has been loaded. In this way, we can register the database connector in the first plugin and use it in the second. Plugin loading starts when you call `.login()`. From that moment, you will no longer be able to add a plugin.

We have used the `Decorator` API. The purpose of this API is to globalize and share values between code pieces, which adds custom objects to the Hershel namespace so that they can be used everywhere via `.get(key)`. Read more about <code><b>Decorator</b></code>.

To dig deeper into how plugins work, read the <code><b>Plugin</b></code> section.

## Middleware

Middleware is the most powerful system we have found to adapt to all the situations that bots could face. Each message will be passed to the middlewares functions in the same way as the middlewares declarations (first recorded, first executed). However, a `state` will be shared between them, allowing the different middleware to work on data shared between the different elements of your bot.

```js
// require Hershel's Client
const { Client } = require('hershel')

// instantiate it
const bot = new Client({
  logger: true
})

bot.use(({ message, state }, next) => {
  state.size = message.content

  next()
})

bot.use(async ({ state, createReply }) => {
  await createReply()
    .setDescription(`the previous message is ${state.size} characters long`)
    .send()
})

bot.login(process.env.DISCORD_TOKEN)
```

To learn more about, a section is dedicated to the <code><b>Middleware</b></code>.
