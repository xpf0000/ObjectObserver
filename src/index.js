const watchSymbol = Symbol('watchSymbol')
import DeepProxy from "./DeepProxy"
export default function Watch(self, obj = {}) {
  obj[watchSymbol] = {}
  return DeepProxy(self, function () {
    let flag = arguments[0]
    let oldSelf = undefined
    let newSelf = undefined
    let uid = ''
    switch (flag) {
      case 'before-delete':
      case 'before-set':
        let paths = arguments[1]
        uid = arguments[2]
        obj[watchSymbol][uid] = {}
        let pathsStr = paths.join('.')
        for (let k in obj) {
          if (k === '*') {
            if (!oldSelf) {
              oldSelf = JSON.parse(JSON.stringify(self))
            }
            obj[watchSymbol][uid][k] = {
              old: oldSelf
            }
          } else if (k === pathsStr) {
            if (paths.length > 0 && !obj[watchSymbol][uid].hasOwnProperty(k)) {
              if (!oldSelf) {
                oldSelf = JSON.parse(JSON.stringify(self))
              }
              let data = oldSelf
              for(let p of paths) {
                data = data[p]
              }
              obj[watchSymbol][uid][k] = {
                old: data,
                paths: paths
              }
            }
          } else if (obj[k].deep) {
            if (paths.length > 0 && !obj[watchSymbol][uid].hasOwnProperty(k)) {
              let same = false
              let path = []
              for(let p of paths) {
                path.push(p)
                if (path.join('.') === k) {
                  same = true
                  break
                }
              }
              if (same) {
                let data = oldSelf
                for(let p of path) {
                  data = data[p]
                }
                obj[watchSymbol][uid][k] = {
                  old: data,
                  paths: path
                }
              }
            }
          }
        }
        break
      case 'after-delete':
      case 'after-set':
        uid = arguments[2]
        if (Object.keys(obj[watchSymbol][uid]).length > 0) {
          newSelf = JSON.parse(JSON.stringify(self))
          for (let k in obj[watchSymbol][uid]) {
            if (obj[watchSymbol][uid][k].paths) {
              let data = newSelf
              for(let p of obj[watchSymbol][uid][k].paths) {
                data = data[p]
              }
              obj[watchSymbol][uid][k].current = data
            } else {
              obj[watchSymbol][uid][k].current = newSelf
            }
            if (typeof obj[k] === 'function') {
              obj[k](obj[watchSymbol][uid][k].current, obj[watchSymbol][uid][k].old)
            } else {
              obj[k].handler && obj[k].handler(obj[watchSymbol][uid][k].current, obj[watchSymbol][uid][k].old)
            }
          }
        }
        delete obj[watchSymbol][uid]
        break
    }
  })
}
