<h1 align="center">Hershel</h1>

# Middleware

The middleware system is provided by [koa-compose](https://github.com/koajs/compose). I recommend reading [this article](https://medium.com/netscape/mastering-koa-middleware-f0af6d327a69) to learn about its extremely powerful middleware system.

```js
const { Client } = require('hershel')

const bot = new Client({
  logger: {
    level: 'info',
    stream: myStream,
  },
})

bot.use(({ id }, next) => {
  console.log(`#${id}`)

  next()
})

// assert.stricEqual(bot.middleware.length, 1)

await bot.login(TOKEN)

// assert.stricEqual(bot.started, true)

bot.use(({ message }, next) => {
  console.log(message.content)

  next()
})

// ERROR: Cannot add new middleware while client is already started
```

Once the client has started, the middleware stack is sealed and can no longer be modified.
