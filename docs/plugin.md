<h1 align="center">Hershel</h1>

# Plugin

Hershel allows the user to extend its features with plugins.

By default, `.register` creates a new scope, this means that if you do some changes to the Hershel instance (via decorate), these changes will not be reflected in the current context ancestors, but only to its descendents. This feature allows to achieve plugin encapsulation and inheritance.

```js
bot.register(plugin, [options])
```

### Create a plugin

Creating a plugin is very easy, you just need to create a function that takes three parameters: the fastify instance, an options object and the done callback.
Example:

```js
module.exports = function(instance, opts, done) {
  instance.set('utility', () => {})

  done()
}
```

or if you prefer ES6 with async/await:

```js
module.exports = async function(instance, opts) {
  instance.set('utility', () => {})
}
```

### Handle the scope

If you are using register only for extending the functionality of the server with decorate, it is your responsibility to tell Hershel not to create a new scope, otherwise your changes will not be accessible by the user in the upper scope.

You have two ways to tell Fastify to avoid the creation of a new context:

- Use the fastify-plugin module
- Use the 'skip-override' hidden property

We recommend using the <a href="https://github.com/hershel/plugin">`@hershel/plugin`</a> module, because it solves this problem for you.

In addition if you use this module when creating new plugins, you can declare the expected Hershel version that your plugin needs and the plugin name. Check the documentation to learn more about how to use `@hershel/plugin`.

If you don't use the module, you can use the 'skip-override' hidden property, but it is not recommended.

```js
function yourPlugin(instance, opts, done) {
  instance.set('utility', () => {})
  done()
}
yourPlugin[Symbol.for('skip-override')] = true
module.exports = yourPlugin
```
