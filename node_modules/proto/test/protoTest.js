"use strict";

var Unit = require('deadunit')
var proto = require('../proto')

require("../build") // build every you test so you don't forget to update the bundle

Unit.test("Testing proto", function() {
	var Person = proto(function() {
        this.heads = 1              // static properties and inherited (prototype) properties are unified ..
                                    // .. properties can be accessed on the factory just like from the instance

        // constructor
        this.init = function(legs, arms) {
            this.legs = legs
            this.arms = arms
        }

        this.getCaughtInBearTrap = function() {
            this.legs = this.legs-1
        }
        this.numberLimbs = function() {
            return this.arms + this.legs
        }
    })

    this.ok(Person.parent instanceof Object)
    this.ok(Person.parent.parent === undefined)
    this.ok(Person.name !== 'undefined') // testing for former bug

    var testPerson = function(me, p) {
        me.ok(p.legs === 2)
        p.getCaughtInBearTrap()
        me.ok(p.legs === 1)

        me.ok(p.numberLimbs() === 3)
    }

    this.test("Simple factory creation", function() {
        this.test("static access", function() {
            this.ok(Person.heads === 1)
        })
        this.test("instance", function() {
            var p = Person(2, 2)
            testPerson(this, p)
        })

    })

    this.test("Inheriting", function() {
        var Girl = proto(Person, function() {
            this.init = function(legs, arms) {
                Person.init.call(this, legs, arms) // test super-method calls
            }

            this.haveBaby = function() {
                return Person(2,2)
            }
        })

        this.ok(Girl.parent === Person)

        var g = Girl(2, 2)
        testPerson(this, g)

        var baby = g.haveBaby()
        testPerson(this, baby)
    })

    this.test("Inheriting native objects", function() {
        var UberObject1 = proto(function() {
            this.x = 5
        })
        var UberObject2 = proto(Object, function() {
            this.x = 5
        })

        Object.prototype.moo = "testing"
        Object.moo = "testing"

        var x = UberObject1()
        this.ok(x.x === 5)
        this.ok(x.moo === "testing")

        x = UberObject2()
        this.equal(x.x,5)
        this.ok(x.moo === "testing")

        var BuberObject = proto(UberObject1, function() {

        })

        x = BuberObject()
        this.ok(x.x === 5)
        this.ok(x.moo === "testing")
    })

    this.test("Constructor can return anything", function() {
        var UndefinedObject = proto(function() {
            this.init = function() {
				return proto.undefined
			}
        })
        var FalseObject = proto(function() {
            this.init = function() {
				return false
			}
        })
        var NumberObject = proto(function() {
            this.init = function() {
				return 0
			}
        })
        var StringObject = proto(function() {
            this.init = function() {
				return ''
			}
        })

		var x = UndefinedObject()
		this.equal(x, undefined)
		var x = FalseObject()
		this.equal(x, false)
		var x = NumberObject()
		this.equal(x, 0)
		var x = StringObject()
		this.equal(x, '')
    })

    this.test('testing with defineProperty', function() {
        var x = 1

        var A = proto(function() {
            Object.defineProperty(this, 'moose', {
                enumerable: true,
                get: function() {
                    return x
                }
            })
        })

        var B = proto(A, function() {

        })

        var c = B()

        x = 5

        this.ok(A.moose === 5, A.moose)
        this.ok(B.moose === 5, B.moose)
        this.ok(c.moose === 5)
    })
    
    this.test('tests ported from jayferd/pjs', function() {
		
		this.test('creating idiomatic classes', function() {
			var MyClass = proto(function() {
                this.name = "MyClassYo"
			    this.foo = 1
			})
			
			this.equal('function', typeof MyClass) // creates functions
			this.equal(1, MyClass.prototype.foo) 	// uses the prototype
					
			this.ok(new MyClass instanceof MyClass) // respects `instanceof`
			this.ok(MyClass() instanceof MyClass)
			
			this.test('respects `.constructor`', function() {
                  var o = MyClass()
                  this.ok(o.constructor === MyClass)
                  this.ok(o.constructor.name === 'MyClassYo', o.constructor.name) // constructor is named properly

                  var o2 = o.constructor()
                  this.ok(o2 instanceof MyClass)
                  this.ok(o2.foo === 1)
			})
		})
		
		this.test('init', function() {
		    var MyClass = proto(function() {
		      this.init = function() {
		        this.initCalled = true
		        this.initArgs = arguments
		      }
		
		      this.initCalled = false
		    })
		
		    this.test('is called when the class is called plainly', function() {
		      this.ok(MyClass().initCalled)
		      this.equal(3, MyClass(1,2,3).initArgs[2])
		      this.equal(2, MyClass.apply(null, [1, 2, 3]).initArgs[1])
		    })
		
		    this.test('is called when the class is called with `new`', function() {
		      this.ok((new MyClass).initCalled)
		      this.equal(3, (new MyClass(1,2,3)).initArgs[2])
		    })
		
		    /*this.test('is not called when the Bare class is called with `new`', function() {
		      this.ok(!(new MyClass.Bare).initCalled)
		    })
		
		    this.test('maintains instanceof when instantiated with Bare', function() {
		      this.ok(new MyClass.Bare instanceof MyClass)
		    })*/
		})
		
		this.test('inheritance', function() {
		    // see examples/ninja.js
		    var Person = proto(function() {
		      this.init = function(isDancing) { this.dancing = isDancing }
		      this.dance = function() { return this.dancing }
		    })
		
		    var Ninja = proto(Person, function() {
		      this.init = function() { Person.init.call(this, false) }
		      this.swingSword = function() { return 'swinging sword!' }
		    })
		
		    var ninja = Ninja()
		
		    this.test('respects instanceof', function() {
		      this.ok(ninja instanceof Person)
		    })
		
		    this.test('inherits methods (also super)', function() {
		      this.equal(false, ninja.dance())
		    })
		})
		
		this.test('inheriting non-pjs classes', function() {
		    function IdiomaticClass() {
		      this.initialized = true
		    }
		
		    IdiomaticClass.prototype.initialized = false
		
		    this.test('inherits without calling the constructor', function() {
		      var MySubclass = proto(IdiomaticClass, function(){})
		      this.equal(false, MySubclass.prototype.initialized)
		      this.equal(true, MySubclass().initialized)
		    })
		})
		
		this.test('inheriting builtins', function() {
		    this.test('Error', function() {
                var that = this
                ;[Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError].forEach(function(ErrorObject) {
                    var MyError = proto(ErrorObject, function() {})
                    testError(MyError, ErrorObject, ErrorObject.name)
                })

                var MyError = proto(Error, function(sclass) {
                    this.name = 'MyError'

                    this.init = function() {
                        sclass.apply(this,arguments)
                    }
                })

                testError(MyError, Error, "MyError")

                function testError(ErrorObject, OriginalError, NewErrorName) {
                    try {
                        throw ErrorObject('o noes')
                    } catch(e) {
                        that.log(e.toString())
                        that.ok(e instanceof ErrorObject)
                        that.ok(e instanceof OriginalError)

                        that.equal(e.message, 'o noes')
                        that.equal(e.toString(), NewErrorName+': o noes')
                        that.ok(e.stack.indexOf('protoTest.js') !== -1) // has a stacktrace
                        that.ok(e.stack.indexOf(NewErrorName) !== -1) // stacktrace has correct name

                        Object.defineProperty(e,'stack', {
                            get: function() {
                                return "meow"
                            }
                        })

                        that.ok(e.stack === 'meow') // stack should be changeable
                    }
                }
            })
		
		    this.test('RegExp', function() {
		      var MyRegExp = proto(RegExp, function(){})
		        , re = MyRegExp('a(b+)c')

		
		      this.ok(re instanceof RegExp)
		      // todo: doesn't work yet
		      // this.ok(MyRegExp('a(b+)c').test('abbbbc'))
		    })
		
		    this.test('String', function() {
		      var MyString = proto(String, function() {})
		      var str = MyString('foo')
		
		      this.ok(str instanceof String)

		      // this.equal('foo', str.toString()) // todo: doesn't work yet
		    })
		
		    this.test('Array', function() {
		      var MyArray = proto(Array, function() {})
		        , ary = MyArray(1,2,3)
		
		      this.ok(ary instanceof Array)
		      // apparently the Array constructor isn't destructive :(
		      // when you `apply` it to an instance of Array, it just creates
		      // a new one for you.  Bah.
		
		      // this.equal(3, ary.length)
		      // this.equal(1, ary[0])
		    })
		})
		
		this.test('definition', function() {
		    this.test('passes the superclass prototype as the first arg', function() {
		      var superclass
		      var MyClass = proto(function() { superclass = this })
		
		      this.equal(superclass, MyClass.prototype)
		    })
		})
		
	})


}).writeConsole()

