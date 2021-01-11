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
export default function DeepProxy(obj, cb, path=[]) {
  if (typeof obj === 'object') {
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        if (!obj[key][isProxy]) {
          let paths = JSON.parse(JSON.stringify(path))
          paths.push(key)
          obj[key] = DeepProxy(obj[key], cb, paths)
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
  return new Proxy(obj, {
    get(target, p, receiver) {
      if (target.hasOwnProperty(p)) {
        for (let fn of filterFn(obj[callBackProxy])) {
          fn && fn('get', ...arguments)
        }
      }
      return Reflect.get(...arguments)
    },
    set: function (target, key, value, receiver) {
      if (key !== pathProxy && key !== callBackProxy && key !== isProxy) {
        let cbs = filterFn(obj[callBackProxy])
        let paths = JSON.parse(JSON.stringify(obj[pathProxy]))
        paths.push(key)
        if (typeof value === 'object') {
          value = DeepProxy(value, cbs, paths)
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
