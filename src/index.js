import DeepProxy, {
  callBackProxy,
  deepClone,
  isEqual,
  watchConfigsSymbol,
  watchDepthSymbol,
} from './DeepProxy.js'

export function Watcher(object, depth = 0) {
  object[watchDepthSymbol] = depth
  return DeepProxy(object, depth)
}
export function watch(obj, config, env) {
  if (!obj.hasOwnProperty(callBackProxy)) {
    obj = Watcher(obj)
  }
  let depth = obj[watchDepthSymbol] || 0
  if (!obj[watchConfigsSymbol]) {
    obj[watchConfigsSymbol] = new WeakMap()
  }
  if (!obj[watchConfigsSymbol].has(config)) {
    let cb = {
      dict: {},
      before(uid) {
        let oldValue = deepClone(obj, depth)
        this.dict[uid] = {}
        for (let k in config) {
          if (k === '*') {
            this.dict[uid][k] = {
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
            this.dict[uid][k] = {
              old: data,
            }
          }
        }
      },
      after(uid){
        let newValue = deepClone(obj, depth)
        if (!this.dict[uid]) {
          return
        }
        if (Object.keys(this.dict[uid]).length > 0) {
          for (let k in this.dict[uid]) {
            let current
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
            let old = this.dict[uid][k].old
            if (!isEqual(current, old)) {
              let fun =
                typeof config[k] === 'function'
                  ? config[k]
                  : config[k].handler
              fun && fun.call(env, current, old, obj)
            }
          }
        }
        delete this.dict[uid]
      }
    }
    obj[watchConfigsSymbol].set(config, cb)
    if (!obj[callBackProxy].includes(cb)) {
      obj[callBackProxy].push(cb)
    }
  }
}

export function unWatch(obj, config) {
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
