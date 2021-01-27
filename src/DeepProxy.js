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
      return b.hasOwnProperty(k) && isEqual(a[k], b[k])
    })
  }
  return false
}
const uuid = function (length = 32) {
  let rnd = ''
  for(let i=0; i<length; i++)
    rnd += Math.floor(Math.random()*10)
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
function toProxy(obj, depth, currentDepth) {
  return new Proxy(obj, {
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
        if (!running.has(obj[callBackProxy]) && !isEqual(target[key], attributes.value)) {
          running.add(obj[callBackProxy])
          let uid = uuid(8)
          for (let fn of obj[callBackProxy]) {
            fn && fn('before-set', uid)
          }
          Reflect.defineProperty(...arguments)
          Promise.resolve().then(() => {
            for (let fn of obj[callBackProxy]) {
              fn && fn('after-set', uid)
            }
            running.delete(obj[callBackProxy])
          })
          return true
        }
      }
      return Reflect.defineProperty(...arguments)
    },
    deleteProperty(target, key) {
      if (
        key !== callBackProxy &&
        key !== watchDepthSymbol &&
        key !== watchConfigsSymbol
      ) {
        if (!running.has(obj[callBackProxy])) {
          running.add(obj[callBackProxy])
          let uid = uuid(8)
          for (let fn of obj[callBackProxy]) {
            fn && fn('before-delete', uid)
          }
          Reflect.deleteProperty(...arguments)
          Promise.resolve().then(() => {
            for (let fn of obj[callBackProxy]) {
              fn && fn('after-delete', uid)
            }
            running.delete(obj[callBackProxy])
          })
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
