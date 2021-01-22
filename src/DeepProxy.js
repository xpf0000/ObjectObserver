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
export const deepClone =(source, hash = new WeakMap())=>{
  if(typeof source !== 'object') return source
  if(hash.has(source)) return hash.get(source)
  const target = Array.isArray(source) ? [] : {}
  hash.set(source, target)
  for(let key in source){
    if(Object.prototype.hasOwnProperty.call(source, key)){
      target[key] = deepClone(source[key], hash)
    }
  }
  return target
}
const running = new WeakSet()
function toProxy(obj, depth, currentDepth) {
  return new Proxy(obj, {
    defineProperty(target, key, attributes) {
      if (key !== callBackProxy &&
        key !== watch &&
        key !== unWatch &&
        key !== watchSymbol &&
        key !== watchConfigsSymbol) {
        if (typeof attributes.value === 'object' &&
          (depth === 0 || currentDepth < depth) &&
          Object.isExtensible(attributes.value)) {
          attributes.value[callBackProxy] = obj[callBackProxy]
          attributes.value = toProxy(attributes.value, depth, currentDepth + 1)
          DeepProxy(attributes.value, depth, currentDepth + 1)
        }
        if (!isEqual(target[key], attributes.value)) {
          if (!running.has(obj[callBackProxy])) {
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
      }
      return Reflect.defineProperty(...arguments)
    },
    set: function (target, key, value, receiver) {
      if (key !== callBackProxy &&
        key !== watch &&
        key !== unWatch &&
        key !== watchSymbol &&
        key !== watchConfigsSymbol) {
        if (typeof value === 'object' &&
          (depth === 0 || currentDepth < depth) &&
          Object.isExtensible(value)) {
          value[callBackProxy] = obj[callBackProxy]
          value = toProxy(value, depth, currentDepth + 1)
          DeepProxy(value, depth, currentDepth + 1)
        }
      }
      return Reflect.set(target, key, value, receiver)
    },
    deleteProperty(target, key) {
      if (key !== callBackProxy &&
        key !== watch &&
        key !== unWatch &&
        key !== watchSymbol &&
        key !== watchConfigsSymbol) {
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

export default function DeepProxy(obj=[], depth = 0, currentDepth = 1) {
  if (obj[callBackProxy]) {
    return obj
  }
  if (currentDepth === 1) {
    if (!obj[callBackProxy]) {
      obj[callBackProxy] = []
    }
  }
  for (let key of Object.keys(obj)) {
    if (typeof obj[key] === 'object' &&
      (depth === 0 || currentDepth < depth) &&
      Object.isExtensible(obj[key])) {
      if (!obj[key][callBackProxy]) {
        obj[key][callBackProxy] = obj[callBackProxy]
        obj[key] = toProxy(obj[key], depth, currentDepth + 1)
        DeepProxy(obj[key], depth, currentDepth + 1)
      }
    }
  }
  return toProxy(obj, depth, currentDepth)
}
