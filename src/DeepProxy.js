export const isProxy = Symbol('isProxy')
export const callBackProxy = Symbol('callBackProxy')
export const watchConfigsSymbol = Symbol('watchConfigsSymbol')
export const watch = Symbol('watchFnSymbol')
export const unWatch = Symbol('unWatchFnSymbol')
export const watchSymbol = Symbol('watchSymbol')
const isArray = function (obj) {
  return toString.call(obj) === '[object Array]'
}
const isObject = function (obj) {
  return obj !== null && toString.call(obj) === '[object Object]'
}
export const isEqual = function (a, b) {
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
  if (typeof source === 'function') {
    return null
  }
  if (typeof source !== 'object') {
    return source
  }
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
export default function DeepProxy(obj=[], depth = 0, currentDepth = 1) {
  if (!wm.has(obj)) {
    wm.set(obj, obj)
  }
  if (currentDepth === 1) {
    if (!obj[callBackProxy]) {
      obj[callBackProxy] = []
    }
  }
  for (let key of Object.keys(obj)) {
    if (typeof obj[key] === 'object' &&
      (depth === 0 || currentDepth < depth) &&
      !wm.has(obj[key]) &&
      Object.isExtensible(obj[key]) &&
      !Object.isFrozen(obj[key]) &&
      !Object.isSealed(obj[key])) {
      if (!obj[key][isProxy]) {
        obj[key][callBackProxy] = obj[callBackProxy]
        obj[key] = DeepProxy(obj[key], depth, currentDepth + 1)
      }
    }
  }
  if (obj[isProxy]) {
    return obj
  }
  obj[isProxy] = true
  return new Proxy(obj, {
    defineProperty(target, key, attributes) {
      if (key !== callBackProxy &&
        key !== watch &&
        key !== unWatch &&
        key !== isProxy &&
        key !== watchSymbol &&
        key !== watchConfigsSymbol) {
        if (typeof attributes.value === 'object' &&
          (depth === 0 || currentDepth < depth) &&
          !wm.has(attributes.value) &&
          attributes.configurable !== false &&
          Object.isExtensible(attributes.value) &&
          !Object.isFrozen(attributes.value) &&
          !Object.isSealed(attributes.value)) {
          attributes.value[callBackProxy] = obj[callBackProxy]
          attributes.value = DeepProxy(attributes.value, depth, currentDepth + 1)
        }
        if (!isEqual(target[key], attributes.value)) {
          let uid = uuid(8)
          for (let fn of obj[callBackProxy]) {
            fn && fn('before-set', uid)
          }
          Reflect.defineProperty(...arguments)
          for (let fn of obj[callBackProxy]) {
            fn && fn('after-set', uid)
          }
          return true
        }
      }
      return Reflect.defineProperty(...arguments)
    },
    set: function (target, key, value, receiver) {
      if (key !== callBackProxy &&
        key !== watch &&
        key !== unWatch &&
        key !== isProxy &&
        key !== watchSymbol &&
        key !== watchConfigsSymbol) {
        if (typeof value === 'object' &&
          (depth === 0 || currentDepth < depth) &&
          !wm.has(value) &&
          Object.isExtensible(value) &&
          !Object.isFrozen(value) &&
          !Object.isSealed(value)) {
          value[callBackProxy] = obj[callBackProxy]
          value = DeepProxy(value, depth, currentDepth + 1)
        }
      }
      return Reflect.set(target, key, value, receiver)
    },
    deleteProperty(target, key) {
      if (key !== callBackProxy &&
        key !== watch &&
        key !== unWatch &&
        key !== isProxy &&
        key !== watchSymbol &&
        key !== watchConfigsSymbol) {
        let uid = uuid(8)
        for (let fn of obj[callBackProxy]) {
          fn && fn('before-delete', uid)
        }
        Reflect.deleteProperty(...arguments)
        for (let fn of obj[callBackProxy]) {
          fn && fn('after-delete', uid)
        }
        return true
      }
      return Reflect.deleteProperty(...arguments)
    },
  })
}
