<h1 align="center">Hershel</h1>

# Logging

The log system is powered by [Pino](http://getpino.io/), wich is a super fast Node.js logger. By default, the log system is disabled and you can activate it by passing `logger: true` or `logger: pinoOptions` in Hershel Client options.

```js
const { Client } = require('hershel')

const bot = new Client({
  logger: true
})

bot.use({ logger, id } => {
  logger.info(`Processing ${id}`)
})
```

You can interact on Pino by passing the appropriate options directly to the Client's builder.

```js
const { Client } = require('hershel')

const bot = new Client({
  logger: {
    level: 'info',
    stream: myStream
  }
})

bot.use({ logger, id } => {
  logger.info(`Processing ${id}`)
})
```

The default behavior of Hershel is to retrieve the ID of the message being processed and assigned to the context, so that it is accessible in middleware. You can change this behavior by passing a `genId` function in the constructor which will take the incoming Discord message as a parameter. The returned value must be a string.

```js
const { Client } = require('hershel')
const crypto = require('crypto')

var md5sum = crypto.createHash('md5')

const bot = new Client({
  logger: true,
  genId: (message) => md5sum.update(message.content).digest('hex')
})

bot.use({ logger, id, message } => {
  logger.info(`Processing ${id} with ${message.content}`)
})
```
