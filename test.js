import Watch, {watch, unWatch} from "./src/index.js";
import Vue from 'vue'

function test1() {
  let d = {
    a: {
    }
  }
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
  console.timeEnd('Time')
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
}

test1()
test2()

