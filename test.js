import { Watcher, watch, unWatch } from "./src/index.js";
import Vue from 'vue'

function test1() {
  let d = {
    a: {
    },
    b: {

    }
  }
  let obj = Watcher(d)
  watch(obj, {
    '*': function (n, o) {
      // console.log('obj watch !!!!!!', n, o)
      console.log('obj watch !!!!!!')
      // console.timeEnd('Watch')
    }
  })
  console.time('Time')
  // console.time('Watch')
  for (let i=0; i<100000; i++) {
    obj[`a${i}`] = {
      a: {
        value: i
      }
    }
  }
  console.timeEnd('Time')
  watch(obj.b, {
    'b0': function (n, o) {
      console.log('b0: ', n, o)
    }
  })
  setTimeout(() => {
    // obj.b.b0 = 1
    // obj.b.b0 = 2
    // obj.a0.a.value = 1
    Object.defineProperty(obj.a0.a, 'aaabbb', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1,
    })
  }, 300)

  setTimeout(() => {
   delete obj.a0.a
  }, 600)
}

function test2() {
  let d = {
    a: {
    }
  }
  let vm = new Vue({
    data: {
      obj: d
    },
    watch: {
      obj: {
        handler() {
          console.log('obj is changed !!!!!!')
          // console.timeEnd('Vue Watch')
        },
        deep: true
      }
    }
  })

  console.time('Time1')
  // console.time('Vue Watch')
  for (let i=0; i<100000; i++) {
    Vue.set(vm.obj, `a${i}`, {
      a: {
        value: i
      }
    })
  }
  console.timeEnd('Time1')
  setTimeout(() => {
    // vm.obj.a0.a.value = 1
    Object.defineProperty(vm.obj.a0.a, 'aaabbb', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1,
    })
    console.log(vm.obj.a0.a.aaabbb)
  }, 100)
}

function test3() {
  let obj = {
    a: {
      b: {}
    }
  }
  obj.c = obj
  obj = Watcher(obj)
  watch(obj, {
    '*': {
      handler(newVal, oldVal) {
        console.log('test14-watch obj watch *, newVal: ', newVal, ', oldVal: ', oldVal)
      },
    }
  })
  watch(obj.a, {
    '*': function (newVal, oldVal) {
      console.log('test14-watch obj.a watch *, newVal: ', newVal, ', oldVal: ', oldVal)
    }
  })
  watch(obj.a.b, {
    '*': function (newVal, oldVal) {
      console.log('test14-watch obj.a.b watch *, newVal: ', newVal, ', oldVal: ', oldVal)
    }
  })
  obj.a.b.b0 = 0
  // obj.a.c = 0
}

test1()
// test2()
// test3()

