import Watch, {watch, unWatch} from "./src/index.js";
import Vue from 'vue'
let d = {
  a: {
  }
}
d.a = d
let obj = Watch(d)
obj[watch]({
  '*': function (n, o) {
    // console.log('obj watch !!!!!!', n, o)
    console.log('obj watch !!!!!!')
    console.timeEnd('Watch')
  }
})
console.time('Time')
console.time('Watch')
for (let i=0; i<100000; i++) {
  obj[`a${i}`] = {
    a: {
      value: i
    }
  }
}
// setTimeout(() => {
//   obj['b'] = 0
// }, 10)
console.timeEnd('Time')
let ddd = {
  b: {
  }
}
ddd.b = ddd
let vm = new Vue({
  data: {
    obj: ddd
  },
  watch: {
    obj: {
      handler() {
        console.log('obj is changed !!!!!!')
        console.timeEnd('Vue Watch')
      },
      deep: true
    }
  }
})

console.time('Time1')
console.time('Vue Watch')
for (let i=0; i<100000; i++) {
  Vue.set(vm.obj, `a${i}`, {
    a: {
      value: i
    }
  })
}
console.timeEnd('Time1')


// let obj = {}
// let send = false
// for (let i=0; i<3; i++) {
//   console.log('i: ', i)
//   obj[`a${i}`] = {
//     a: {
//       value: i
//     }
//   }
//   if (!send) {
//     send = true
//     Promise.resolve().then(() => {
//       send = false
//       console.log('i1: ', i)
//     })
//   }
// }
