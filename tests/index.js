import { expect } from 'chai'
import { Watcher, watch, unWatch } from "../src"

function test1 (info) {
  it(info, function (done) {
    let obj = { a: 0 }
    obj = Watcher(obj)
    watch(obj,
      {
        '*': {
          handler(newVal, oldVal) {
            console.log('test1 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
            expect(oldVal).to.deep.equal({ a: 0 })
            expect(newVal).to.deep.equal({ a: 1 })
          }
        },
        a: function (newVal, oldVal) {
          console.log('test1 watch a, newVal: ', newVal, ', oldVal: ', oldVal)
          expect(oldVal).to.equal(0)
          expect(newVal).to.equal(1)
        }
      }
    )
    obj.a = 1
    done()
  })
}

function test2 (info) {
  it(info, function (done) {
    let obj = {
      a: {
        b: 0
      }
    }
    obj = Watcher(obj)
    watch(obj, {
      '*': {
        handler(newVal, oldVal) {
          console.log('test2 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
          expect(oldVal).to.deep.equal({
            a: {
              b: 0
            }
          })
          expect(newVal).to.deep.equal({
            a: {
              b: 1
            }
          })
        }
      },
      a: {
        handler(newVal, oldVal) {
          console.log('test2 watch a, newVal: ', newVal, ', oldVal: ', oldVal)
          expect(oldVal).to.deep.equal({
            b: 0
          })
          expect(newVal).to.deep.equal({
            b: 1
          })
        },
        deep: true
      },
      'a.b': function(newVal, oldVal) {
        console.log('test2 watch a.b, newVal: ', newVal, ', oldVal: ', oldVal)
        expect(oldVal).to.equal(0)
        expect(newVal).to.equal(1)
      }
    })
    obj.a.b = 1
    done()
  })
}

function test3 (info) {
  it(info, function (done) {
    let obj = { a: 0 }
    let config = {
      '*': {
        handler(newVal, oldVal) {
          console.log('test3 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
          expect(oldVal).to.deep.equal({ a: 0 })
          expect(newVal).to.deep.equal({ a: 0, b: 0 })
        }
      },
      b: function(newVal, oldVal) {
        console.log('test3 watch b, newVal: ', newVal, ', oldVal: ', oldVal)
        expect(oldVal).to.equal(undefined)
        expect(newVal).to.equal(0)
      }
    }
    obj = Watcher(obj)
    watch(obj, config)
    obj.b = 0
    done()
  })
}

function test4 (info) {
  it(info, function (done) {
    let obj = [0, 1, 2]
    let config = {
      '*': {
        handler(newVal, oldVal) {
          console.log('test4 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
          expect(oldVal).to.deep.equal([0, 1, 2])
          expect(newVal).to.deep.equal([0, 1, 2, 3])
        }
      }
    }
    obj = Watcher(obj)
    watch(obj, config)
    obj.push(3)
    done()
  })
}

function test5 (info) {
  it(info, function (done) {
    let obj = Watcher({ a: 0 })
    let config = {
      '*': {
        handler(newVal, oldVal) {
          console.log('test5-1 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
          expect(oldVal).to.deep.equal({ a: 0 })
          expect(newVal).to.deep.equal({ a: 2 })
        }
      }
    }
    let config1 = {
      '*': {
        handler(newVal, oldVal) {
          console.log('test5-2 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
          expect(oldVal).to.deep.equal({ a: 0 })
          expect(newVal).to.deep.equal({ a: 2 })
        }
      }
    }
    watch(obj, config)
    watch(obj, config1)
    obj.a = 2
    console.log('test5 obj: ', JSON.parse(JSON.stringify(obj)))
    expect(obj).to.deep.equal({ a: 2 })
    done()
  })
}

function test6 (info) {
  it(info, function (done) {
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
    let obj1 = Watcher(obj)
    let obj2 = Watcher(obj)
    watch(obj1, config)
    watch(obj2, config1)
    obj.push(0)
    obj1.push(1)
    obj2.push(2)
    console.log('test6 obj: ', JSON.parse(JSON.stringify(obj)))
    expect(obj).to.deep.equal([0, 1, 2])
    expect(obj1).to.deep.equal([0, 1, 2])
    expect(obj2).to.deep.equal([0, 1, 2])
    done()
  })
}

function test7 (info) {
  it(info, function (done) {
    let obj = Watcher({ a: { b : 0 } }, 1)
    let config = {
      '*': function (newVal, oldVal) {
        console.log('test7 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        expect(oldVal).to.deep.equal({ a: {} })
        expect(newVal).to.deep.equal({ a: {}, c: 0 })
      }
    }
    watch(obj, config)
    obj.a.b = 1
    obj.c = 0
    done()
  })
}

function test8 (info) {
  it(info, function (done) {
    let obj = Watcher({ a: { b : 0, c: { d: 0 } } }, 2)
    let config = {
      '*': function (newVal, oldVal) {
        console.log('test8 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        expect(oldVal).to.deep.equal({ a: { b : 0, c: {} } })
        expect(newVal).to.deep.equal({ a: { b : 1, c: {} } })
      }
    }
    watch(obj, config)
    obj.a.c.d = 1
    obj.a.b = 1
    done()
  })
}

function test9 (info) {
  it(info, function (done) {
    let obj = Watcher({ a: { b : 0, c: { d: 0 } } })
    let config = {
      '*': {
        handler(newVal, oldVal) {
          console.log('test9 watch *, obj current is: ', JSON.parse(JSON.stringify(obj)))
        },
        silence: true
      }
    }
    watch(obj, config)
    obj.a.c.d = 1
    obj.a.b = 1
    done()
  })
}

function test10 (info) {
  it(info, function (done) {
    let obj = {
      a: {
        b: 0,
        f: 0
      }
    }
    obj.a.b = obj
    obj.c = obj.a
    obj.a.d = obj.a
    console.log('test10 original obj: ', obj)

    obj = Watcher(obj)
    let config = {
      '*': {
        handler(newVal, oldVal) {
          console.log('test10 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        },
      }
    }
    watch(obj, config)
    obj.a.b = 1
    done()
  })
}

function test11 (info) {
  it(info, function (done) {
    let obj = {
      a: {
        b: 0,
        f: 0
      }
    }
    obj = Watcher(obj)
    let config = {
      '*': {
        handler(newVal, oldVal) {
          console.log('test11 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        },
      }
    }
    watch(obj, config)
    obj.a.b = 1
    setTimeout(() => {
      unWatch(obj, config)
      obj.a.b = 2
      console.log('test11 finial: ', JSON.parse(JSON.stringify(obj)))
      done()
    }, 300)
  })
}

function test12 (info) {
  it(info, function (done) {
    let obj = {
      a: {
        b: 0,
        f: 0
      }
    }
    obj = Watcher(obj)
    let config = {
      '*': {
        handler(newVal, oldVal) {
          console.log('test12-watch1 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        },
      }
    }
    let config1 = {
      '*': {
        handler(newVal, oldVal) {
          console.log('test12-watch2 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
          done()
        },
      }
    }
    watch(obj, config)
    watch(obj, config1)
    obj.a.b = 1
    setTimeout(() => {
      unWatch(obj, config)
      obj.a.b = 2
      console.log('test12 finial: ', JSON.parse(JSON.stringify(obj)))
    }, 300)
  })
}

function test13 (info) {
  it(info, function (done) {
    let obj = {
      a: {
        b: 0,
        f: 0
      }
    }
    obj = Watcher(obj)
    let config = {
      '*': {
        handler(newVal, oldVal) {
          console.log('test13-watch1 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        },
      }
    }
    let config1 = {
      '*': {
        handler(newVal, oldVal) {
          console.log('test13-watch2 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        },
      }
    }
    watch(obj, config)
    watch(obj, config1)
    obj.a.b = 1
    setTimeout(() => {
      unWatch(obj)
      obj.a.b = 2
      console.log('test13 finial: ', JSON.parse(JSON.stringify(obj)))
      done()
    })
  })
}

function test14 (info) {
  it(info, function (done) {
    let obj = {
      a: {
        b: {}
      }
    }
    obj = Watcher(obj)
    watch(obj, {
      '*': {
        handler(newVal, oldVal) {
          console.log('test14-watch obj watch *, newVal: ', newVal, ', oldVal: ', oldVal)
          expect(oldVal).to.deep.equal({ a: { b: {} } })
          expect(newVal).to.deep.equal({ a: { b: { b0: 0 } } })
        },
      }
    })
    watch(obj.a, {
      '*': function (newVal, oldVal) {
        console.log('test14-watch obj.a watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        expect(oldVal).to.deep.equal({ b: {} })
        expect(newVal).to.deep.equal({ b: { b0: 0 } })
      }
    })
    watch(obj.a.b, {
      '*': function (newVal, oldVal) {
        console.log('test14-watch obj.a.b watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        expect(oldVal).to.deep.equal({})
        expect(newVal).to.deep.equal({ b0: 0 })
        done()
      }
    })
    obj.a.b.b0 = 0
  })
}

function test15 (info) {
  it(info, function (done) {
    let obj = {}
    obj = Watcher(obj)
    watch(obj, {
      '*': {
        handler(newVal, oldVal) {
          console.log('test15 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
          expect(oldVal).to.deep.equal({})
          expect(newVal).to.deep.equal({ a: 0 })
          done()
        },
      }
    })
    Object.defineProperty(obj, 'a', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0,
    })
  })
}

function test16 (info) {
  it(info, function (done) {
    let obj = {}
    obj = Watcher(obj)
    watch(obj, {
      '*': {
        handler(newVal, oldVal) {
          console.log('test16 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
          console.log('test16 this.testVal: ', this.testVal)
          expect(oldVal).to.deep.equal({})
          expect(newVal).to.deep.equal({ a: 0 })
          expect(this.testVal).to.deep.equal(45)
          done()
        },
      }
    }, this)
    this.testVal = 45
    Object.defineProperty(obj, 'a', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0,
    })
  })
}

describe('TEST', function () {
  test1('{ a: 0 } => { a: 1 }, watch *, a')
  test2('{ a: { b: 0 } } => { a: { b: 1 } }, watch *, a deep, a.b')
  test3('{ a: 0 } => { a: 0, b: 0 }, watch *, b')
  test4('[0, 1, 2] => [0, 1, 2, 3], watch *')
  test5('{ a: 0 } => { a: 2 }, two watch *')
  test6('[] => [0, 1, 2], three watch *')
  test7('{ a: { b : 0 } } => { a: { b: 1 }, c: 0 }, watch * with deep 1')
  test8('{ a: { b : 0, c: { d: 0 } } } => { a: { b : 1, c: { d: 1 } } }, watch * with deep 2')
  test9('{ a: { b : 0, c: { d: 0 } } } => { a: { b : 1, c: { d: 1 } } }, watch * with silence')
  test10('Test loop reference, watch *')
  test11('Test unWatch')
  test12('Test watch more and unWatch some one')
  test13('Test unWatch all')
  test14('Test watch sub object')
  test15('Test Object.defineProperty')
  test16('Test watch items function env')
})
