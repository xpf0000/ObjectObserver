import { expect } from 'chai'
import Watch from "../src"

function test1 (info) {
  it(info, function (done) {
    let obj = Watch({
      a: 0
    })
    obj = Watch(obj, {
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
    })
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
    obj = Watch(obj, {
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
    obj = Watch(obj, {
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
    })
    obj.b = 0
    done()
  })
}

function test4 (info) {
  it(info, function (done) {
    let obj = [0, 1, 2]
    obj = Watch(obj, {
      '*': {
        handler(newVal, oldVal) {
          console.log('test4 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
          expect(oldVal).to.deep.equal([0, 1, 2])
          expect(newVal).to.deep.equal([0, 1, 2, 3])
        }
      }
    })
    obj.push(3)
    done()
  })
}

function test5 (info) {
  it(info, function (done) {
    let obj = Watch({ a: 0 })
    let obj1 = Watch(obj, {
      '*': {
        handler(newVal, oldVal) {
          console.log('test5-1 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
          expect(oldVal).to.deep.equal({ a: 0 })
          expect(newVal).to.deep.equal({ a: 2 })
        }
      }
    })
    let obj2 = Watch(obj, {
      '*': {
        handler(newVal, oldVal) {
          console.log('test5-2 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
          expect(oldVal).to.deep.equal({ a: 0 })
          expect(newVal).to.deep.equal({ a: 2 })
        }
      }
    })
    obj.a = 2
    console.log('test5 obj: ', JSON.parse(JSON.stringify(obj)))
    expect(obj).to.deep.equal({ a: 2 })
    done()
  })
}

function test6 (info) {
  it(info, function (done) {
    let obj = Watch([])
    let obj1 = Watch(obj, {
      '*': {
        handler(newVal, oldVal) {
          console.log('test6-1 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        }
      }
    })
    let obj2 = Watch(obj, {
      '*': {
        handler(newVal, oldVal) {
          console.log('test6-2 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        }
      }
    })
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
    let obj = Watch({ a: { b : 0 } }, {
      '*': function (newVal, oldVal) {
        console.log('test7 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        expect(oldVal).to.deep.equal({ a: { b: 1 } })
        expect(newVal).to.deep.equal({ a: { b: 1 }, c: 0 })
      }
    }, 1)
    obj.a.b = 1
    obj.c = 0
    done()
  })
}

function test8 (info) {
  it(info, function (done) {
    let obj = Watch({ a: { b : 0, c: { d: 0 } } }, {
      '*': function (newVal, oldVal) {
        console.log('test8 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        expect(oldVal).to.deep.equal({ a: { b : 0, c: { d: 1 } } })
        expect(newVal).to.deep.equal({ a: { b : 1, c: { d: 1 } } })
      }
    }, 2)
    obj.a.c.d = 1
    obj.a.b = 1
    done()
  })
}

function test9 (info) {
  it(info, function (done) {
    let obj = Watch({ a: { b : 0, c: { d: 0 } } }, {
      '*': {
        handler() {
          console.log('test9 watch *, obj current is: ', JSON.parse(JSON.stringify(obj)))
        },
        silence: true
      }
    })
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

    obj = Watch(obj, {
      '*': {
        handler(newVal, oldVal) {
          console.log('test10 watch *, newVal: ', newVal, ', oldVal: ', oldVal)
        },
      }
    })
    obj.a.b = 1
    done()
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
})
