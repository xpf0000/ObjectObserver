<h1 align="center">ObjectObserver</h1>

[![Latest Version on NPM](https://img.shields.io/npm/v/@xpf0000/objectobserver.svg?style=flat-square)](https://npmjs.com/package/@xpf0000/objectobserver)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![npm](https://img.shields.io/npm/dt/@xpf0000/objectobserver.svg?style=flat-square)](https://www.npmjs.com/package/@xpf0000/objectobserver)

> JS Object Observer, Build on the basis of ES6 proxy, use like vue's watch
>
>Support circular reference
>
>Can set watch depth and silence watch


## Table of Contents

* [Install and basic usage](#install-and-basic-usage)
* [Contributing](#contributing)
* [License](#license)


## Install and basic usage

```bash
$ npm install --save @xpf0000/objectobserver
```

```js
import Watch, { watch, unWatch } from "@xpf0000/objectobserver"
let obj = { a: 0, b: { b0: 1 } }
obj = Watch(obj)
let config = {
    '*': {
        handler(newVal, oldVal) {}
     },
     a: function (newVal, oldVal) {},
     b: {
        handler(newVal, oldVal) {},
        deep: true
     },
     'b.b0': function(newVal, oldVal) {}
}
obj[watch](config)
obj.a = 1
obj.c = 0
obj.b.b0 = 2

let arr = Watch([])
let arr1 = Watch(arr)
let arr2 = Watch(arr)
let config1 = {
    '*': {
        handler(newVal, oldVal) {}
    },
}
let config2 = {
    '*': {
        handler(newVal, oldVal) {}
    },
}
arr1[watch](config1)
arr2[watch](config2)
arr.push(0)
arr1.push(1)
arr2.push(2)
arr2[unWatch](config2)
```

### Watch options

#### depth

set watch depth, default whole object

```js
import Watch, { watch, unWatch } from "@xpf0000/objectobserver"
let obj = { a: 0, b: { b0: 1 } }
obj = Watch(obj, 1)
let config = {
    '*': {
        handler(newVal, oldVal) {}
    },
}
obj[watch](config)
obj.b.b0 = 2 //won't trigger
obj.a = 1 // trigger
obj.c = 0 // trigger
```

### Watch item options

#### deep

Only observe this level or observe this level and subordinate level

```js
import Watch, { watch, unWatch } from "@xpf0000/objectobserver"
let obj = { a: 0, b: { b0: 1 } }
obj = Watch(obj)
let config = {
    'b': {
        handler(newVal, oldVal) {},
        deep: false
    },
}
obj[watch](config)
obj.b = { c: 0 } // trigger
obj.b.c = 1 //won't trigger if deep is false
```

#### silence

Accurate new and old values are no longer returned, only get changed notice

```js
import Watch, { watch, unWatch } from "@xpf0000/objectobserver"
let obj = { a: 0, b: { b0: 1 } }
obj = Watch(obj)
let config = {
    '*': {
        handler(newVal, oldVal) {
        // newVal: undefined oldVal: undefined
        console.log(obj)
        console.log(obj.c)
        },
        silence: true
    },
}
obj[watch](config)
obj.c = 0 // trigger
```

### Methods

#### watch

watch is a Symbol, so no need to worry about the conflict between the original data and the watch method

```js
import Watch, { watch, unWatch } from "@xpf0000/objectobserver"
let obj = { a: 0, b: { b0: 1 } }
obj = Watch(obj)
obj[watch]({...})
```

#### unWatch

unWatch is a Symbol, so no need to worry about the conflict between the original data and the unWatch method

```js
import Watch, { watch, unWatch } from "@xpf0000/objectobserver"
let obj = { a: 0, b: { b0: 1 } }
obj = Watch(obj)
obj[unWatch]({...}) // only clean this watcher
obj[unWatch]() // clean all watcher
```

## Contributing

Any contribution to the code or any part of the documentation and any idea and/or suggestion are very welcome.

``` bash
# serve with hot reload at localhost:8080
npm run serve

# run test
npm run test

# distribution build-bundle
npm run build
```

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
