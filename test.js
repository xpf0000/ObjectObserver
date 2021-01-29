import { Watcher, watch, unWatch } from "./src/index.js";
import Vue from 'vue'

function test1() {
  let a = new Proxy({ddd: 0}, {
    defineProperty(target, prop, descriptor) {
      console.log(descriptor);
      Reflect.defineProperty(...arguments);
      return true
    },
  })
  let b = new Proxy({fff: 0}, {
    defineProperty(target, prop, descriptor) {
      console.log(descriptor);
      Reflect.defineProperty(...arguments);
      return true
    },
  });
  let c = new Proxy({eee: 0}, {
    defineProperty(target, prop, descriptor) {
      console.log(descriptor);
      Reflect.defineProperty(...arguments);
      return true
    },
  });
  // a.b = b
  // a.b.c = c
  //
  // Object.defineProperty(a.b.c, 'name', {
  //   enumerable: true,
  //   configurable: true,
  //   writable: true,
  //   value: 'proxy'
  // });  // { value: 'proxy' }

  let d = {
    a: {
      b: {
        c: {

        }
      }
    },
  }
  let obj = Watcher(d)
  watch(obj, {
    '*': function (n, o) {
      // console.log('obj watch !!!!!!', JSON.stringify(n), o)
      console.log('obj watch !!!!!!')
      // console.timeEnd('Watch')
    }
  })
  console.time('Time')
  console.time('Watch')
  for (let i=0; i<100000; i++) {
    obj[`a${i}`] = {
      a: {
        value: i,
        ddd: {}
      }
    }
  }
  console.timeEnd('Time')
  // watch(obj.b, {
  //   'b0': function (n, o) {
  //     console.log('b0: ', n, o)
  //   }
  // })
  // Object.defineProperty(obj, 'aaabbb', {
  //   enumerable: true,
  //   configurable: true,
  //   writable: true,
  //   value: 1,
  // })
  Object.defineProperty(obj.a.b.c, 'aaabbb', {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {},
  })
  // console.log(obj)
  // setTimeout(() => {
  //   // obj.b.b0 = 1
  //   // obj.b.b0 = 2
  //   obj.a0.a.value = 1
  //   // Object.defineProperty(obj.a0.a.ddd, 'aaabbb', {
  //   //   enumerable: true,
  //   //   configurable: true,
  //   //   writable: true,
  //   //   value: 1,
  //   // })
  // }, 300)

  setTimeout(() => {
   delete obj.a0.a
  }, 400)
  setTimeout(() => {
     obj.a.b.c.aaabbb.fff = { eee: 0 }
  }, 500)
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

function test4() {
  let obj = Watcher([])
  let config = {
    '*': {
      handler(newVal, oldVal) {
        console.log('test6-1 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
      }
    }
  }
  let config1 = {
    '*': {
      handler(newVal, oldVal) {
        console.log('test6-2 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
      }
    }
  }
  // let obj1 = Watcher(obj)
  // let obj2 = Watcher(obj)
  console.log(obj)
  // console.log(obj1)
  // console.log(obj2)
  watch(obj, config)
  // watch(obj1, config)
  // watch(obj2, config1)
  obj.push(0)
  // obj1.push(1)
  // obj2.push(2)
}
function test5() {
  let obj = Watcher({})
  let config = {
    '*': {
      handler(newVal, oldVal) {
        console.log('test6-1 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
      }
    }
  }
  watch(obj, config)
  let value = {};
  Object.defineProperty(obj, "num", {
    get : function(){
      return value;
    },
    set : function(newValue){
      value = newValue;
    },
    enumerable : true,
    configurable : true
  });
  obj.num.a = 0
  console.log(obj)
}
function test6() {
  let a = Watcher({
    b: {
      height: 0
    },
    c: {
      width: 0
    }
  })

  let config = {
    '*': function (n, o) {
      console.log('a *: ', n, o)
    },
    'height': function (n, o) {
      console.log('a.b height: ', n, o)
    },
    'width': function (n, o) {
      console.log('a.c width: ', n, o)
    }
  }

  watch(a, config)
  watch(a.b, config)
  watch(a.c, config)
  a.b.height = 10
  a.c.width = 10
}

test1()
// test2()
// test3()
// test4()
// test5()
// test6()
