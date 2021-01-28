export const callBackProxy = Symbol('callBackProxy')
export const watchConfigsSymbol = Symbol('watchConfigsSymbol')
export const watchSymbol = Symbol('watchSymbol')
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
      fn && fn('before-set', uid)
    }
    handle()
    Promise.resolve().then(() => {
      for (let fn of fns) {
        fn && fn('after-set', uid)
      }
      running.delete(fns)
    })
    return true
  }
  return false
}
function toProxy(obj, depth, currentDepth) {
  return new Proxy(obj, {
    get(target, p, receiver) {
      let value = Reflect.get(...arguments)
      return typeof value == 'function' ? value.bind(target) : value
    },
    defineProperty(target, key, attributes) {
      if (
        key !== callBackProxy &&
        key !== watchDepthSymbol &&
        key !== watchConfigsSymbol
      ) {
        if (
          typeof attributes.value === 'object' &&
          (depth === 0 || currentDepth < depth) &&
          Object.isExtensible(attributes.value)
        ) {
          attributes.value[callBackProxy] = obj[callBackProxy]
          attributes.value = toProxy(attributes.value, depth, currentDepth + 1)
          DeepProxy(attributes.value, depth, currentDepth + 1)
        }
        if (
          postNotice(obj[callBackProxy], target[key], attributes.value, () => {
            Reflect.defineProperty(...arguments)
          })
        ) {
          return true
        }
      }
      return Reflect.defineProperty(...arguments)
    },
    set: function (target, key, value, receiver) {
      if (
        key !== callBackProxy &&
        key !== watchSymbol &&
        key !== watchConfigsSymbol
      ) {
        if (
          typeof value === 'object' &&
          (depth === 0 || currentDepth < depth) &&
          Object.isExtensible(value)
        ) {
          value[callBackProxy] = obj[callBackProxy]
          value = toProxy(value, depth, currentDepth + 1)
          DeepProxy(value, depth, currentDepth + 1)
        }
        if (
          postNotice(obj[callBackProxy], target[key], value, () => {
            Reflect.set(target, key, value)
          })
        ) {
          return true
        }
      }
      return Reflect.set(target, key, value)
    },
    deleteProperty(target, key) {
      if (
        key !== callBackProxy &&
        key !== watchDepthSymbol &&
        key !== watchConfigsSymbol
      ) {
        if (
          postNotice(obj[callBackProxy], 0, 1, () => {
            Reflect.deleteProperty(...arguments)
          })
        ) {
          return true
        }
      }
      return Reflect.deleteProperty(...arguments)
    },
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
      (depth === 0 || currentDepth < depth) &&
      Object.isExtensible(obj[key])
    ) {
      if (!obj[key][callBackProxy]) {
        obj[key][callBackProxy] = obj[callBackProxy]
        obj[key] = toProxy(obj[key], depth, currentDepth + 1)
        DeepProxy(obj[key], depth, currentDepth + 1)
      }
    }
  }
  if (currentDepth > 1) {
    return
  }
  return toProxy(obj, depth, currentDepth)
}
