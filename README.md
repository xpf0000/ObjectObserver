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
import Watch from "@xpf0000/objectobserver"
let obj = { a: 0, b: { b0: 1 } }
obj = Watch(obj, {
      '*': {
        handler(newVal, oldVal) {}
      },
      a: function (newVal, oldVal) {},
      b: {
        handler(newVal, oldVal) {},
        deep: true
       },
       'b.b0': function(newVal, oldVal) {}
    })
obj.a = 1
obj.c = 0
obj.b.b0 = 2

let arr = Watch([])
let arr1 = Watch(arr, {
    '*': {
        handler(newVal, oldVal) {}
      },
    })
let arr2 = Watch(arr, {
    '*': {
        handler(newVal, oldVal) {}
      },
    })
arr.push(0)
arr1.push(1)
arr2.push(2)
```

### Watch options

#### depth

set watch depth, default whole object

```js
let obj = { a: 0, b: { b0: 1 } }
obj = Watch(obj, {
      '*': {
        handler(newVal, oldVal) {}
      },
    }, depth: 1)
obj.b.b0 = 2 //won't trigger
obj.a = 1 // trigger
obj.c = 0 // trigger
```

### Watch item options

#### deep

Only observe this level or observe this level and subordinate level

```js
let obj = { a: 0, b: { b0: 1 } }
obj = Watch(obj, {
      'b': {
        handler(newVal, oldVal) {},
        deep: false
      },
    })
obj.b = { c: 0 } // trigger
obj.b.c = 1 //won't trigger if deep is false
```

#### silence

Accurate new and old values are no longer returned, only get changed notice

```js
let obj = { a: 0, b: { b0: 1 } }
obj = Watch(obj, {
      '*': {
        handler(newVal, oldVal) {
        // newVal: undefined oldVal: undefined
            console.log(obj)
            console.log(obj.c)
        },
        silence: true
      },
    })
obj.c = 0 // trigger
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
