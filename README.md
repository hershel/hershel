<p align="center">
  <img src="https://raw.githubusercontent.com/hershel/hershel/master/media/hershel.png" />
</p>

<h2 align="center">Hershel</h2>

<p align="center">
  <em>A framework for modular and blazing fast Discord bots</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/hershel">
    <img alt="Hershel on npm" 
    src="https://img.shields.io/npm/v/hershel.svg">
  </a>
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

## Install

```
npm i hershel
```

## Example

```js
const { Client } = require('hershel')

// instanciate Hershel's client
const bot = new Client()

// each message will go through this function
bot.use(({ message, createReply }, next) => {
  if (message.author.bot) return

  // use Hershel's reply API
  const response = createReply()

  response
    .setType('string') // set the reply type, wich can be string or embed (default)
    .setMessage(message.content)
    .send()

  next() // call next middleware
})

// Middlewares can be async too
bot.use(async ({ message, id }) => {
  // assert.strictEqual(message.id, id)

  myPrivacyFriendlyDataAnalysisService(message, { idOfTheProcess: id })
})

// Hershel use koa-compose for the middlewares
// learn more about it https://medium.com/netscape/mastering-koa-middleware-f0af6d327a69

bot.login(process.env.TOKEN)
```

That is. Really.

Hershel was thought to be able to make your bot what you want by giving a solid base: you can create a bot streaming music, interactive or just displaying your latest git commits, and this simply, without magic or complexity.

## Features

- **Modular:** Hershel supports plugin and decorator to make it extremely modular and extensible.
- **Logging:** We all like clean and clear logs. We use [Pino](https://github.com/pinojs/pino), a super fast, json logger.
- **Fast:** No more useless feature loading you don't use.

## Related

- [hershel/dispatcher](https://github.com/hershel/dispatcher) - Command dispatcher for Hershel
- [hershel/examples](https://github.com/hershel/examples) - Example of integration with Hershel

## Thanks

Thanks to Algorythmis for his corrections of the code. Thanks also to Bit My Code for their support and their 💖.

Hershel uses part of [Fastify](https://github.com/fastify/fastify)'s theoretical logic, a fast and low overhead web framework for Node.js.

## License

MIT
