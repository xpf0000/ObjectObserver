export const callBackProxy = Symbol('callBackProxy')
export const watchConfigsSymbol = Symbol('watchConfigsSymbol')
export const watchDepthSymbol = Symbol('watchDepthSymbol')

const isArray = function (obj) {
  return toString.call(obj) === '[object Array]'
}
const isObject = function (obj) {
  return obj !== null && toString.call(obj) === '[object Object]'
}
export const isEqual = function (a, b) {
  if (a === b) {
    return true
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
      len = keysA.length
    if (len !== Object.keys(b).length) {
      return false
    }
    return keysA.every((k) => {
      return b.hasOwnProperty && b.hasOwnProperty(k) && isEqual(a[k], b[k])
    })
  }
  return false
}
const uuid = function (length = 32) {
  let rnd = ''
  for (let i = 0; i < length; i++) rnd += Math.floor(Math.random() * 10)
  return rnd
}
export const deepClone = (
  source,
  depth = 0,
  currentDepth = 1,
  hash = new WeakMap()
) => {
  if (typeof source !== 'object' || source === null) return source
  if (depth > 0 && currentDepth > depth) {
    return Array.isArray(source) ? [] : {}
  }
  if (hash.has(source)) return hash.get(source)
  const target = Array.isArray(source) ? [] : {}
  hash.set(source, target)
  for (let key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = deepClone(source[key], depth, currentDepth + 1, hash)
    }
  }
  return target
}
const running = new WeakSet()
const postNotice = (fns, oldV, newV, handle) => {
  if (!running.has(fns) && !isEqual(oldV, newV)) {
    running.add(fns)
    let uid = uuid(8)
    for (let fn of fns) {
      fn && fn.before && fn.before(uid)
    }
    handle(newV)
    Promise.resolve().then(() => {
      for (let fn of fns) {
        fn && fn.after && fn.after(uid)
      }
      running.delete(fns)
    })
    return true
  }
  return false
}
const deleteHandler = (target, key) => {
  if (
    key !== callBackProxy &&
    key !== watchDepthSymbol &&
    key !== watchConfigsSymbol
  ) {
    if (
      postNotice(target[callBackProxy], 0, 1, () => {
        Reflect.deleteProperty(target, key)
      })
    ) {
      return true
    }
  }
  return Reflect.deleteProperty(...arguments)
}
const setHandler = (target, key, value, handle, depth, currentDepth) => {
  if (
    key !== callBackProxy &&
    key !== watchConfigsSymbol
  ) {
    if (
      typeof value === 'object' &&
      !value[callBackProxy] &&
      (depth === 0 || currentDepth < depth) &&
      Object.isExtensible(value)
    ) {
      value[callBackProxy] = target[callBackProxy]
      value = toProxy(value, depth, currentDepth + 1)
      DeepProxy(value, depth, currentDepth + 1)
    }
    if (postNotice(target[callBackProxy], target[key], value, handle)) {
      return true
    }
  }
  handle(value)
  return true
}
const toProxy = (obj, depth = 0, currentDepth) => {
  return new Proxy(obj, {
    defineProperty(target, key, attributes) {
      if (!attributes.hasOwnProperty('value')) {
        return Reflect.defineProperty(...arguments)
      }
      return setHandler(
        target,
        key,
        attributes.value,
        (value) => {
          attributes.value = value
          Reflect.defineProperty(target, key, attributes)
        },
        depth,
        currentDepth
      )
    },
    set: function (target, key, value, receiver) {
      return setHandler(
        target,
        key,
        value,
        (value) => {
          Reflect.set(target, key, value)
        },
        depth,
        currentDepth
      )
    },
    deleteProperty: deleteHandler,
  })
}

export default function DeepProxy(obj = [], depth = 0, currentDepth = 1) {
  if (currentDepth === 1) {
    if (!obj[callBackProxy]) {
      obj[callBackProxy] = []
    } else {
      return obj
    }
  }
  for (let key of Object.keys(obj)) {
    if (
      typeof obj[key] === 'object' &&
      !obj[key][callBackProxy] &&
      (depth === 0 || currentDepth < depth) &&
      Object.isExtensible(obj[key])
    ) {
      obj[key][callBackProxy] = obj[callBackProxy]
      obj[key] = toProxy(obj[key], depth, currentDepth + 1)
      DeepProxy(obj[key], depth, currentDepth + 1)
    }
  }
  if (currentDepth > 1) {
    return
  }
  return toProxy(obj, depth, currentDepth)
}
