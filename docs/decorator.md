<h1 align="center">Hershel</h1>

# Decorator

If you need to add somes features to the Hershel instance, the `decorate` API is what you need.

The API allows you to add new properties to the Hershel instance. A value is not restricted to a function and can also be an object or a string, for example.

### Usage

**set**
Just call the `set` API and pass the name of the new property and its value.

```js
instance.set('utility', () => {
  // something very useful
})
```

As said above, you can also decorate the instance with non-function values:

```js
instance.set('conf', {
  db: 'some.db',
  port: 3000,
})
```

**get**
Once you decorate the instance, you can access the value by using the name you passed as a parameter:

```js
instance.get('utility')()

console.log(instance.get('db'))
```

**has**
You can also check if Hershel was decorated with a specific name:

```js
console.log(instance.has('db')) // true
```
