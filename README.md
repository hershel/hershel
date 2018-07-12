<p align="center">
  <img src="https://raw.githubusercontent.com/hershel/hershel/master/media/hershel.png" />
</p>

<h2 align="center">Hershel</h2>

<p align="center">
  <em>A framework for modular and blazing fast Discord bots</em>
</p>

<p align="center">
  <a href="https://travis-ci.com/hershel/hershel">
    <img alt="Travis CI" 
    src="https://travis-ci.com/hershel/hershel.svg?branch=master">
  </a>
  <a href="https://coveralls.io/github/hershel/hershel">
    <img alt="Coveralls"
    src="https://coveralls.io/repos/github/hershel/hershel/badge.svg?branch=master">
  </a>
  <a href="https://github.com/prettier/prettier">
    <img alt="Prettier"
    src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg">
  </a>
  <a href="https://github.com/hershel/hershel/blob/master/LICENSE">
    <img alt="MIT License"
    src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

---

![demo](https://raw.githubusercontent.com/hershel/hershel/master/media/demo.png)

Hershel is a small, highly modular Discord bots framework based on the fact that you don't need to embed unnecessary features / code in your bot project. Hershel allows you to write your own message processing logic or to use the packages at your disposal to build an awesome Discord bot.

### Install

```
npm i hershel
```

### Exemple

Let's code a simple parrot bot:

```js
const { Client } = require('hershel')

// instanciate Hershel's client
const bot = new Client()

// each message will go through this function
bot.use(({ message, createReply }) => {
  if (message.author.bot) return

  // use Hershel's reply API
  const response = createReply()

  response
    // set the type of the reply. Can be string or embed (default)
    .setType('string')
    .setMessage(message.content)
    .send()
})

bot.login(process.env.TOKEN)
```

That is. Really.

You can chain middlewares this way:

```js
const { Client } = require('hershel')

const bot = new Client({
  logger: true // enable logger. Without this, logger is an abstraction-noop
})

bot.use(({ message, createReply, log }, next) => {
  log.info(message.content, 'new message')

  next() // call next middleware
})

bot.use(async ({ message, id }) => {
  // can be async too!
  myPrivacyFriendlyDataAnalysisService(message, { idOfTheProcess: id })
})

// Hershel use koa-compose for the middlewares
// learn more about it https://medium.com/netscape/mastering-koa-middleware-f0af6d327a69

bot.login(process.env.TOKEN)
```

Hershel was thought to be able to make your bot what you want by giving a solid base: you can create a bot streaming music, interactive or just displaying your latest git commits, and this simply, without magic or complexity.

### Features

- **Modular:** Hershel supports plugin and decorator to make it extremely modular and extensible.
- **Logging:** We all like clean and clear logs. We use [Pino](https://github.com/pinojs/pino), a super fast, json logger.
- **Fast:** No more useless feature loading you don't use.

### Thanks

Thanks to Algorythmis for his corrections of the code. Thanks also to Bit My Code for their support and their 💖.

Hershel uses part of [Fastify](https://github.com/fastify/fastify)'s theoretical logic, a fast and low overhead web framework, for Node.js.
