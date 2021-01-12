export const isProxy = Symbol('isProxy')
const callBackProxy = Symbol('callBackProxy')
const pathProxy = Symbol('pathProxy')
const filterFn = function (arr) {
  return arr.filter(fn => {
    return fn && typeof fn === "function"
  })
}
const isArray = function (obj) {
  return toString.call(obj) === '[object Array]'
}
const isObject = function (obj) {
  return obj !== null && toString.call(obj) === '[object Object]'
}
const isEqual = function (a, b) {
  if (a === b) {
    return true;
  }
  if (isArray(a) && isArray(b)) {
    //Arrays comparison
    let len = a.length
    if (len !== b.length) {
      return false
    }
    return a.every((item, i) => {
      return isEqual(item, b[i])
    })
  } else if (isObject(a) && isObject(b)) {
    //Objects comparison
    let keysA = Object.keys(a),
        len = keysA.length;
    if (len !== Object.keys(b).length) {
      return false;
    }
    return keysA.every((k) => {
      return b.hasOwnProperty(k) && isEqual(a[k], b[k])
    })
  }
  return false;
}
const uuid = function (length = 32) {
  const num = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let str = ''
  for (let i = 0; i < length; i++) {
    str += num.charAt(Math.floor(Math.random() * num.length))
  }
  return str
}
export const deepClone = function (source) {
  // 声明cache变量，便于匹配是否有循环引用的情况
  let cache = []
  let str = JSON.stringify(source, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.includes(value)) {
        // 移除
        return
      }
      // 收集所有的值
      cache.push(value)
    }
    if (typeof value === 'function') {
      return
    }
    return value
  })
  cache = null // 清空变量，便于垃圾回收机制回收
  return JSON.parse(str)
}
const wm = new WeakMap()
export default function DeepProxy(obj, cb, path=[], depth = 0, currentDepth = 1) {
  if (!wm.has(obj)) {
    wm.set(obj, obj)
  }
  if (typeof obj === 'object') {
    for (let key of Object.keys(obj)) {
      if (typeof obj[key] === 'object' &&
        (depth === 0 || currentDepth < depth) &&
        !wm.has(obj[key]) &&
        Object.isExtensible(obj[key]) &&
        !Object.isFrozen(obj[key]) &&
        !Object.isSealed(obj[key])) {
        if (!obj[key][isProxy]) {
          let paths = JSON.parse(JSON.stringify(path))
          paths.push(key)
          obj[key] = DeepProxy(obj[key], cb, paths, depth, currentDepth + 1)
        }
      }
    }
  }
  if (obj[isProxy]) {
    if (typeof cb === 'function') {
      if (!obj[callBackProxy].includes(cb)) {
        obj[callBackProxy].push(cb)
      }
    } else {
      for (let fn of cb) {
        if (!obj[callBackProxy].includes(fn)) {
          obj[callBackProxy].push(fn)
        }
      }
    }
    return obj
  }
  obj[isProxy] = true
  if (typeof cb === 'function') {
    obj[callBackProxy] = [cb]
  } else {
    obj[callBackProxy] = [...cb]
  }
  obj[pathProxy] = path
  wm.set(obj, obj)
  return new Proxy(obj, {
    set: function (target, key, value, receiver) {
      if (key !== pathProxy && key !== callBackProxy && key !== isProxy) {
        let cbs = filterFn(obj[callBackProxy])
        let paths = JSON.parse(JSON.stringify(obj[pathProxy]))
        paths.push(key)
        if (typeof value === 'object' &&
          (depth === 0 || currentDepth < depth) &&
          !wm.has(value) &&
          Object.isExtensible(value) &&
          !Object.isFrozen(value) &&
          !Object.isSealed(value)) {
          value = DeepProxy(value, cbs, paths, depth, currentDepth + 1)
        }
        if (!isEqual(target[key], value)) {
          let uid = uuid(8)
          for (let fn of cbs) {
            fn && fn('before-set', paths, uid)
          }
          let flag = target.hasOwnProperty(key) ? 'modify' : 'add'
          Reflect.set(target, key, value, receiver)
          for (let fn of cbs) {
            fn && fn('after-set', paths, uid)
          }
          return true
        }
      }
      return Reflect.set(...arguments)
    },
    deleteProperty(target, key) {
      if (key !== pathProxy && key !== callBackProxy && key !== isProxy) {
        let cbs = filterFn(obj[callBackProxy])
        let paths = JSON.parse(JSON.stringify(obj[pathProxy]))
        paths.push(key)
        let uid = uuid(8)
        for (let fn of cbs) {
          fn && fn('before-delete', paths, uid)
        }
        Reflect.deleteProperty(...arguments)
        for (let fn of cbs) {
          fn && fn('after-delete', paths, uid)
        }
        return true
      }
      return Reflect.deleteProperty(...arguments)
    },
  })
}
