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
  <a href="https://greenkeeper.io/">
    <img alt="greenkeeper"
    src="https://badges.greenkeeper.io/hershel/hershel.svg">
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
// require Hershel's Client
const { Client } = require('hershel')

// instantiate it
const bot = new Client({
  logger: true
})

bot.use(({ message, state }, next) => {
  if (message.author.bot) return

  state.permission = getPermissionFor(message.author)

  next() // call next middleware
})

bot.use(({ message, createReply, state }, next) => {
  // use Hershel's reply API
  const response = createReply()

  response // response is an embed by default
    .setTitle('Echo... Echo... Echo...')
    .setAuthor(`${message.author} with perm ${state.permission.level}`)
    .setDescription(message.content)
    .setFooter('Powered by Hershel')
    .send()

  response.setTitle('Update embed title 🙈').update()
})

bot.login(process.env.DISCORD_TOKEN)
```

Do you want to know more? Head to the <code><b>Getting Started</b></code>.

## Features

- **Modular:** Hershel supports plugin and decorator to make it extremely modular and extensible.
- **Logging:** We all like clean and clear logs. We use [Pino](https://github.com/pinojs/pino), a super fast, json logger.
- **Fast:** No more useless feature loading you don't use.

## Documentation

- <code><b>Getting Started</b></code>
- <code><b>Plugin</b></code>
- <code><b>Middleware</b></code>
- <code><b>Reply</b></code>
- <code><b>Decorator</b></code>
- <code><b>Logging</b></code>
- <code><b>Error Handling</b></code>

## Related

- [hershel/dispatcher](https://github.com/hershel/dispatcher) - Command dispatcher for Hershel
- [hershel/plugin](https://github.com/hershel/plugin) - Plugin helper for Hershel
- [hershel/examples](https://github.com/hershel/examples) - Example of integration with Hershel

## Thanks

Thanks to Algorythmis for his corrections of the code. Thanks also to Bit My Code for their support and their 💖.

Hershel uses part of [Fastify](https://github.com/fastify/fastify)'s theoretical logic & documentation layout, a fast and low overhead web framework for Node.js.

## License

MIT
