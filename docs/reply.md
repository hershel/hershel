<h1 align="center">Hershel</h1>

# Reply

A reply is an object that will be created in intern by Hershel and will allow you to send a reply message in the same channel as the received message.

Reply inherits all the properties of [`discord.RichEmbed`](https://discord.js.org/#/docs/main/stable/class/RichEmbed).

- `.message` - Message for which the response was created.
- `.sent` - A boolean value that you can use if you need to know if `send` has already been called.
- `.payload` - Reply payload to be sent to Discord.
- `.response` - Response message.
- `.type` - Reply type, wich can be string or embed (default to embed).
- `.setMessage(message)` - Alias for `.setDescription`.
- `.send(options)` - Send the payload to the Discord channel concerned.
- `.reset(data)` - Reset reply.
- `.setType(type)` - Set Reply type.
- `.update(options)` - Update the reply with the modified data.

```js
const reply = createReply()

await reply
  .setType('embed')
  .setAuthor('Elon Musk')
  .setDescription('i🖤anime')
  .send()

await reply
  .setUrl('https://twitter.com/elonmusk')
  .setDescription('And I own a chibi Wolverine')
  .update()
```

Additionally, `createReply` can take an override of some properties as a parameter.

```js
const reply = createReply({ type: 'string', title: 'Hello World!' })

// it's equal to
// reply
//   .setType('string')
//   .setTitle('Hello World')
```

---

### `.message`

Each Reply is linked to a single message, the one with which it was created. `.message` is the discord.js object of the latter and cannot be null nor undefined.

### `.sent`

A boolean that indicates if the response has already been sent via `.send`.

```js
// assert(reply.sent, false)

reply.send()

// assert(reply.sent, true)
```

### `.payload`

The payload is what will be sent as a message to Discord. This payload depends directly on `.type`.

#### `string`

If the type is a string, then the reply will be a common character string, and properties that you might have set like .setAuthor, .setTitle etc will not be included in the response and sent. Only .description will be sent as response message content (which can be set via .setDescription or .setMessage).

#### `embed`

If the type is `embed`, the reply will be a RichEmbed with all its features.

### `.response`

Response is the answer linked to the reply and therefore allows to keep it in memory for later modification.

### `.type`

Reply type wich is a string that can be `string` or `embed` (default to `embed`).

### `.setMessage(message)`

Alias for `.setDescription`.

### `.send(options)`

Send the payload of the Reply and can take as options the standard [message options](https://discord.js.org/#/docs/main/stable/typedef/MessageOptions) to send a message.

> A reply can only be sent **once**, otherwise an error will be thrown. See `.update` for more information.

### `.reset(data)`

Reset reply and applies the properties given as options.

```js
reply
  .setTitle('hello')
  .setFooter('world')
  .setDescription('-')

// Reply {
//   title: 'hello'
//   footer: { text: 'world' }
//   description: '-'
// }

reply.clear()

// Reply {
//   title: undefined
//   footer: { text: undefined }
//   description: undefined
// }

reply.setTitle('test ?').clear({ title: 'override title' })

// Reply {
//   title: 'override title
//   footer: { text: undefined }
//   description: undefined
// }
```

### `.setType(type)`

Set reply type between `string` and `embed`.

### `.update(options)`

Allows you to update a response with the new payload.

```js
await reply
  .setTitle('hello')
  .setDescription('world')
  .setColor(2067276)
  .send()

// Reply {
//   title: 'hello'
//   description: 'world'
//   color: 2067276
// } -> sent to Discord

await reply
  .setTitle('world')
  .setDescription('hello')
  .update()

// Reply {
//   title: 'world'
//   description: 'hello'
//   color: 2067276
// } -> Updated on Discord
```
