import DeepProxy, { callBackProxy, deepClone, watchConfigsSymbol, watch, unWatch, watchSymbol } from "./DeepProxy.js"
import {isEqual} from "./DeepProxy.js";
export { watch, unWatch }
export default function Watch(object, depth = 0) {
  let obj = DeepProxy(object, depth)
  if (!obj.hasOwnProperty(watch)) {
    Object.defineProperty(obj, watch, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: function (watch) {
        if (!obj[watchConfigsSymbol]) {
          obj[watchConfigsSymbol] = new WeakMap()
        }
        if (!obj[watchConfigsSymbol].has(watch)) {
          watch[watchSymbol] = {}
          let oldValue
          let befor = false
          let after = false
          let cb = function () {
            let flag = arguments[0]
            let uid = arguments[2]
            if (!befor || !after) {
              if (flag.indexOf('before') >= 0) {
                oldValue = deepClone(obj)
                befor = true
              }
              if (flag.indexOf('after') >= 0) {
                after = true
              }
              Promise.resolve().then(() => {
                switch (flag) {
                  case 'before-delete':
                  case 'before-set':
                    watch[watchSymbol][uid] = {}
                    for (let k in watch) {
                      if (watch[k].silence) {
                        watch[watchSymbol][uid][k] = {
                          old: undefined,
                        }
                        continue
                      }
                      if (k === '*') {
                        watch[watchSymbol][uid][k] = {
                          old: oldValue,
                        }
                      } else {
                        let paths = k.split('.')
                        let data = oldValue
                        for (let p of paths) {
                          if (typeof data != 'object') {
                            data = undefined
                            break
                          }
                          data = data[p]
                        }
                        watch[watchSymbol][uid][k] = {
                          old: data
                        }
                      }
                    }
                    break
                  case 'after-delete':
                  case 'after-set':
                    let newValue = deepClone(obj)
                    if (Object.keys(watch[watchSymbol][uid]).length > 0) {
                      for (let k in watch[watchSymbol][uid]) {
                        let current
                        if (watch[k].silence) {
                          current = undefined
                        } else {
                          if (k === '*') {
                            current = newValue
                          } else {
                            let paths = k.split('.')
                            let data = newValue
                            for (let p of paths) {
                              if (typeof data != 'object') {
                                data = undefined
                                break
                              }
                              data = data[p]
                            }
                            current = data
                          }
                        }
                        let old = watch[watchSymbol][uid][k].old
                        if (k === '*' || !isEqual(current, old)) {
                          let fun = typeof watch[k] === 'function' ? watch[k] : watch[k].handler
                          fun && fun(current, old)
                        }
                      }
                    }
                    delete watch[watchSymbol][uid]
                    befor = after = false
                    oldValue = null
                    break
                }
              })
            }
          }
          obj[watchConfigsSymbol].set(watch, cb)
          if (!obj[callBackProxy].includes(cb)) {
            obj[callBackProxy].push(cb)
          }
        }
      }
    })
    Object.defineProperty(obj, unWatch, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: function (config) {
        if (!config) {
          obj[watchConfigsSymbol] = new WeakMap()
          obj[callBackProxy].splice(0)
          return
        }
        if (obj[watchConfigsSymbol].has(config)) {
          let cb = obj[watchConfigsSymbol].get(config)
          if (obj[callBackProxy].includes(cb)) {
            obj[callBackProxy].splice(obj[callBackProxy].indexOf(cb), 1)
          }
          obj[watchConfigsSymbol].delete(config)
        }
      }
    })
  }
  return obj
}
