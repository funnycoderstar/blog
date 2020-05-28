## 目录
- class
- 静态方法
- 静态属性
- 继承
- super

## class

class是一个语法糖，其底层还是通过 `构造函数` 去创建的。所以它的绝大部分功能，ES5 都可以做到。新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.sayName = function() {
    return this.name;
}

const xiaoming = new Person('小明', 18);
console.log(xiaoming);
```

上面代码用` ES6`的`class`实现，就是下面这样

```js
class Person {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
  
    sayName() {
      return this.name;
    }
}
const xiaoming = new Person('小明', 18)
console.log(xiaoming);
// { name: '小明', age: 18 }

console.log((typeof Person));
// function
console.log(Person === Person.prototype.constructor);
// true
```
constructor方法，这就是构造方法，this关键字代表实例对象。
类的数据类型就是函数，类本身就指向构造函数。

> 定义类的时候，前面不需要加 function, 而且方法之间不需要逗号分隔，加了会报错。

类的所有方法都定义在类的prototype属性上面。
```js
class A {
    constructor() {}
    toString() {}
    toValue() {}
}
// 等同于

A.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```
在类的实例上面调用方法，其实就是调用原型上的方法。
```js
let a = new A();
a.constructor === A.prototype.constructor // true
```
### constructor 方法
constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。

```js
class A {
}

// 等同于
class A {
  constructor() {}
}
```
constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。
```js
class A {
  constructor() {
      return Object.create(null);
  }
}

console.log((new A()) instanceof A);
// false
```
### 类的实例
实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）。

### 注意：
1. class不存在变量提升
```js
new A(); // ReferenceError
class A {}
```
因为 ES6 不会把类的声明提升到代码头部。这种规定的原因与继承有关，必须保证子类在父类之后定义。
```js
{
  let A = class {};
  class B extends A {}
}
```
上面的代码不会报错，因为 B继承 A的时候，A已经有了定义。但是，如果存在 class提升，上面代码就会报错，因为 class 会被提升到代码头部，而let命令是不提升的，所以导致 B 继承 A 的时候，Foo还没有定义。

2. this的指向
类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。


## 静态方法

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。
如果在一个方法前，加上 static 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为"静态方法"。
```js
class A {
    static classMethod() {
        return 'hello';
    }
}
A.classMethod();
console.log(A.classMethod());
// 'hello'

const a = new A();
a.classMethod();
// TypeError: a.classMethod is not a function
```
`A` 类的`classMethod` 方法前有 `static`关键字，表明这是一个静态方法，可以在 `A` 类上直接调用，而不是在实例上调用
在实例`a`上调用静态方法，会抛出一个错误，表示不存在改方法。

如果静态方法包含this关键字，这个this指的是类，而不是实例。

```js

class A {
    static classMethod() {
      this.baz();
    }
    static baz() {
      console.log('hello');
    }
    baz() {
      console.log('world');
    }
}
A.classMethod();
// hello
```
静态方法`classMethod`调用了`this.baz`，这里的`this`指的是`A`类，而不是`A`的实例，等同于调用`A.baz`。另外，从这个例子还可以看出，静态方法可以与非静态方法重名。

父类的静态方法，可以被子类继承。
```js

class A {
    static classMethod() {
        console.log('hello');
    }
}

class B extends A {}

B.classMethod() // 'hello'
```

## 静态属性
静态属性指的是 Class 本身的属性，即Class.propName，而不是定义在实例对象（this）上的属性。
写法是在实例属性的前面，加上static关键字。

```js
class MyClass {
  static myStaticProp = 42;

  constructor() {
    console.log(MyClass.myStaticProp); // 42
  }
}
```
## 继承
Class 可以通过extends关键字实现继承
```js
class Animal {}
class Cat extends Animal { };
```
上面代码中 定义了一个 Cat 类，该类通过 `extends`关键字，继承了 Animal 类中所有的属性和方法。
但是由于没有部署任何代码，所以这两个类完全一样，等于复制了一个Animal类。
下面，我们在Cat内部加上代码。
```js
class Cat extends Animal {
    constructor(name, age, color) {
        // 调用父类的constructor(name, age)
        super(name, age);
        this.color = color;
    }
    toString() {
        return this.color + ' ' + super.toString(); // 调用父类的toString()
    }
}
```
constructor方法和toString方法之中，都出现了super关键字，它在这里表示父类的构造函数，用来新建父类的this对象。

子类必须在 constructor 方法中调用 super 方法，否则新建实例就会报错。
这是因为子类自己的this对象，必须先通过 父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。

```js
class Animal { /* ... */ }

class Cat extends Animal {
  constructor() {
  }
}

let cp = new Cat();
// ReferenceError
```
Cat 继承了父类 Animal，但是它的构造函数没有调用super方法，导致新建实例报错。

**ES5的继承，实质是先创建了子类的实例对象 this, 然后再将 父类的方法添加到 this上面。**

**ES6的继承机制完全不同，实质是先将 父类实例对象的属性和方法，加到 this 上面（所以必须先调用 super 方法），然后再用子类的构造函数修改 this。**
如果子类没有定义constructor方法，这个方法会被默认添加，代码如下。也就是说，不管有没有显式定义，任何一个子类都有constructor方法。

```js
class Cat extends Animal {

}
// 等同于

class Cat extends Animal {
    constructor(...args) {
        super(...args);
    }
}
```
另一个需要注意的地方是，在子类的构造函数中，只有调用`super`之后，才可以使用`this`关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有`super`方法才能调用父类实例。

```js
class A {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class B extends A {
  constructor(x, y, name) {
    this.name = name; // ReferenceError
    super(x, y);
    this.name = name; // 正确
  }
}
```
上面代码中，子类的constructor方法没有调用super之前，就使用this关键字，结果报错，而放在super方法之后就是正确的。

父类的静态方法，也会被子类继承。
```js
class A {
  static hello() {
    console.log('hello world');
  }
}

class B extends A {
}

B.hello()  // hello world
```

## super

super这个关键字，既可以当作函数使用，也可以当作对象使用

### super作为函数调用
super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super函数。
```js
class A {}

class B extends A {
  constructor() {
    super();
  }
}
```
子类B的构造函数之中的super()，代表调用父类的构造函数。这是必须的，否则 JavaScript 引擎会报错。

注意，super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B的实例，因此super()在这里相当于A.prototype.constructor.call(this)。

```js
class A {
  constructor() {
    // new.target 指向正在执行的函数
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B
```
在`super()`执行时，它指向的是子类`B`的构造函数，而不是父类A的构造函数。也就是说，`super()`内部的`this`指向的是`B`。

### super作为对象调用

**在普通方法中，指向父类的原型对象；**
**在静态方法中，指向父类**。

### super对象在普通函数中调用
```js
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
```
上面代码中，子类`B`当中的`super.p()`，就是将`super`当作一个对象使用。这时，`super`在普通方法之中，指向`A.prototype`，所以`super.p()`就相当于`A.prototype.p()`。

这里需要注意，由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。

```js
class A {
  constructor() {
    this.p = 2;
  }
}

class B extends A {
  get m() {
    return super.p;
  }
}

let b = new B();
b.m // undefined
```
上面代码中，p是父类A实例的属性，super.p就引用不到它。

如果属性定义在父类的原型对象上，`super`就可以取到。

```js
class A {}
A.prototype.x = 2;

class B extends A {
  constructor() {
    super();
    console.log(super.x) // 2
  }
}

let b = new B();
```
上面代码中，属性x是定义在`A.prototype`上面的，所以`super.x`可以取到它的值。

#### super对象在静态方法中调用

用在静态方法之中，这时super将指向父类，而不是父类的原型对象。
```js
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

const child = new Child();
child.myMethod(2); // instance 2
```
上面代码中，super在静态方法之中指向父类，在普通方法之中指向父类的原型对象。

另外，在子类的静态方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的子类，而不是子类的实例。
```js
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  static m() {
    super.print();
  }
}

B.x = 3;
B.m() // 3
```
上面代码中，静态方法`B.m`里面，`super.print`指向父类的静态方法。这个方法里面的`this`指向的是`B`，而不是`B`的实例。

## 总结
- class是一个语法糖，其底层还是通过 `构造函数` 去创建的。
- 类的所有方法都定义在类的prototype属性上面。
- 静态方法：在方法前加static，表示该方法不会被实例继承，而是直接通过类来调用。
- 静态属性：在属性前加static，指的是 Class 本身的属性，而不是定义在实例对象（this）上的属性。
- ES6的继承和ES5的继承区别在于：
    - ES5的继承，实质是先创建了子类的实例对象 this, 然后再将 父类的方法添加到 this上面
    - ES6的继承是先将父类实例对象的属性和方法，加到 this 上面（所以必须先调用 super 方法），然后再用子类的构造函数修改 this。
- super
    - 作为函数调用，代表父类的构造函数
    - 作为对象调用，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。

## 再来几道题检查一下

### 1. 下面代码输出什么
```js
class Person {
  constructor(name) {
    this.name = name
  }
}

const member = new Person("John")
console.log(typeof member)
```
答案：object
解析： 
类是构造函数的语法糖，如果用构造函数的方式来重写Person类则将是：
```js
function Person() {
  this.name = name
}
```
通过new来调用构造函数，将会生成构造函数Person的实例，对实例执行typeof关键字将返回"object"，上述情况打印出"object"。

### 2. 下面代码输出什么
```js
class Chameleon {
  static colorChange(newColor) {
    this.newColor = newColor
    return this.newColor
  }

  constructor({ newColor = 'green' } = {}) {
    this.newColor = newColor
  }
}

const freddie = new Chameleon({ newColor: 'purple' })
freddie.colorChange('orange')
```
答案：TypeError
解析：
colorChange 是一个静态方法。静态方法被设计为只能被创建它们的构造器使用（也就是 Chameleon），并且不能传递给实例。因为 freddie 是一个实例，静态方法不能被实例使用，因此抛出了 TypeError 错误。

### 3.下面代码输出什么
```js
class Person {
  constructor() {
    this.name = "Lydia"
  }
}

Person = class AnotherPerson {
  constructor() {
    this.name = "Sarah"
  }
}

const member = new Person()
console.log(member.name)
```

答案："Sarah"
我们可以将类设置为等于其他类/函数构造函数。 在这种情况下，我们将Person设置为AnotherPerson。 这个构造函数的名字是Sarah，所以新的Person实例member上的name属性是Sarah。

