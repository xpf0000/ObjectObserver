import DeepProxy, { callBackProxy, deepClone, watchConfigsSymbol, watch, unWatch, watchSymbol } from "./DeepProxy.js"
export { watch, unWatch }
export default function Watch(object, depth = 0) {
  let obj = DeepProxy(
    object,
    [],
    depth
  )
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
          let cb = function () {
            let flag = arguments[0]
            let oldSelf = undefined
            let newSelf = undefined
            let uid = ''
            switch (flag) {
              case 'before-delete':
              case 'before-set':
                let paths = arguments[1]
                uid = arguments[2]
                watch[watchSymbol][uid] = {}
                let pathsStr = paths.join('.')
                for (let k in watch) {
                  if (watch[k].silence) {
                    watch[watchSymbol][uid][k] = {
                      old: undefined,
                    }
                    continue
                  }
                  if (k === '*') {
                    if (!oldSelf) {
                      oldSelf = deepClone(object)
                    }
                    watch[watchSymbol][uid][k] = {
                      old: oldSelf,
                    }
                  } else if (k === pathsStr) {
                    if (
                      paths.length > 0 &&
                      !watch[watchSymbol][uid].hasOwnProperty(k)
                    ) {
                      if (!oldSelf) {
                        oldSelf = deepClone(object)
                      }
                      let data = oldSelf
                      for (let p of paths) {
                        data = data[p]
                      }
                      watch[watchSymbol][uid][k] = {
                        old: data,
                        paths: paths,
                      }
                    }
                  } else if (watch[k].deep) {
                    if (
                      paths.length > 0 &&
                      !watch[watchSymbol][uid].hasOwnProperty(k)
                    ) {
                      let same = false
                      let path = []
                      for (let p of paths) {
                        path.push(p)
                        if (path.join('.') === k) {
                          same = true
                          break
                        }
                      }
                      if (same) {
                        let data = oldSelf
                        for (let p of path) {
                          data = data[p]
                        }
                        watch[watchSymbol][uid][k] = {
                          old: data,
                          paths: path,
                        }
                      }
                    }
                  }
                }
                break
              case 'after-delete':
              case 'after-set':
                uid = arguments[2]
                if (Object.keys(watch[watchSymbol][uid]).length > 0) {
                  for (let k in watch[watchSymbol][uid]) {
                    if (watch[k].silence) {
                      watch[watchSymbol][uid][k].current = undefined
                    } else {
                      if (!newSelf) {
                        newSelf = deepClone(object)
                      }
                      if (watch[watchSymbol][uid][k].paths) {
                        let data = newSelf
                        for (let p of watch[watchSymbol][uid][k].paths) {
                          data = data[p]
                        }
                        watch[watchSymbol][uid][k].current = data
                      } else {
                        watch[watchSymbol][uid][k].current = newSelf
                      }
                    }
                    if (typeof watch[k] === 'function') {
                      watch[k](
                        watch[watchSymbol][uid][k].current,
                        watch[watchSymbol][uid][k].old
                      )
                    } else {
                      watch[k].handler &&
                      watch[k].handler(
                        watch[watchSymbol][uid][k].current,
                        watch[watchSymbol][uid][k].old
                      )
                    }
                  }
                }
                delete watch[watchSymbol][uid]
                break
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
