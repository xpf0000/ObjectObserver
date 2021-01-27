import DeepProxy, {
  callBackProxy,
  deepClone,
  isEqual,
  watchConfigsSymbol,
  watchDepthSymbol,
  watchSymbol
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
    config[watchSymbol] = {}
    let oldValue
    let cb = function () {
      let flag = arguments[0]
      let uid = arguments[1]
      switch (flag) {
        case 'before-delete':
        case 'before-set':
          oldValue = deepClone(obj, depth)
          config[watchSymbol][uid] = {}
          for (let k in config) {
            if (k === '*') {
              config[watchSymbol][uid][k] = {
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
              config[watchSymbol][uid][k] = {
                old: data,
              }
            }
          }
          break
        case 'after-delete':
        case 'after-set':
          let newValue = deepClone(obj, depth)
          if (!config[watchSymbol][uid]) {
            return
          }
          if (Object.keys(config[watchSymbol][uid]).length > 0) {
            for (let k in config[watchSymbol][uid]) {
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
              let old = config[watchSymbol][uid][k].old
              if (k === '*' || !isEqual(current, old)) {
                let fun =
                  typeof config[k] === 'function'
                    ? config[k]
                    : config[k].handler
                fun && fun.call(env, current, old)
              }
            }
          }
          delete config[watchSymbol][uid]
          oldValue = null
          break
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
