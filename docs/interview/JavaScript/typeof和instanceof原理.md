## 目录
- JavaScript数据类型
- typeof
- instanceof 
- JavaScript原型链

## JavaScript数据类型
JavaScript有八种内置类型
- 空值（null)
- 未定义(undefined)
- 布尔值（boolean)
- 数字（number)
- 字符串（string)
- 对象 (object)
- 符号（symbol, ES6中新增)
- 大整数（BigInt, ES2020 引入）

> 除对象外，其他统称为“基本类型”。

```js
typeof null // 'object'
typeof undefined; // "undefined"
typeof false; // "boolean"
typeof 1; // "number"
typeof '1'; // "string"
typeof {}; // "object" 
typeof []; // "object" 
typeof new Date(); // "object"

typeof Symbol(); // "Symbol"
typeof 123n // 'bigint'
```
这里的类型值的是值，变量是没有类型的，变量可以随时持有任何类型的值。JavaScript中变量是“弱类型”的，一个变量可以现在被赋值为 字符串类型，随后又被赋值为数字类型。

`typeof`是一个操作符而不是函数，用来检测给定变量的数据类型。

> `Symbol` 是ES6中引入的一种`原始数据`类型，表示独一无二的值。BigInt（大整数）是 ES2020 引入的一种新的数据类型，用来解决 JavaScript中数字只能到 53 个二进制位（JavaScript 所有数字都保存成 64 位浮点数，大于这个范围的整数，无法精确表示的问题。(在平常的开发中，数据的id 一般用 string 表示的原因)。为了与 Number 类型区别，BigInt 类型的数据必须添加后缀n。 `1234`为普通整数，`1234n`为 `BigInt`。了解更多可以看 [《ES6 入门教程》](https://es6.ruanyifeng.com/#docs/number#BigInt-%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)

`typeof null` 为什么返回 `'object'`，稍后会从JavaScript数据底层存储机制来解释。

还有一种情况
```js
function foo() {};
typeof foo; // 'function'
```
这样看来，`function` 也是`JavaScript`的一个`内置类型`。然而查阅规范，就会知道，它实际上是 `object` 的一个"子类型"。具体来说，函数是“可调用对象”，它有一个内部属性`[[call]]`，该属性使其可以被调用。`typeof` 可以用来区分函数其他对象。

**但是使用 `typeof `不能 判断对象具体是哪种类型。所有` typeof` 返回值为 "object" 的对象（如数组，正则等）都包含一个内部属性 `[[class]]`(我们可以把它看做一个内部的分类)。这个属性无法直接访问，一般通过 `Object.prototype.toString(...)`来查看。**
```js
Object.prototype.toString.call(new Date); // "[object Date]"
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call(/reg/ig); // "[object RegExp]"
```
`instanceof` 运算符也常常用来判断对象类型。用法: 左边的运算数是一个`object`，右边运算数是对象类的名字或者构造函数; 返回`true`或`false`。
```js
[] instanceof Array; // true
[] instanceof Object; // true
[] instanceof RegExp; // false
new Date instanceof Date; // true
```
**`instanceof` 的内部机制是：检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。**下面会详解介绍该部分。

## typeof 原理

`typeof`原理： **不同的对象在底层都表示为二进制，在Javascript中二进制前（低）三位存储其类型信息**。
- 000: 对象
- 010: 浮点数
- 100：字符串
- 110： 布尔
- 1： 整数

typeof null 为"object", 原因是因为 不同的对象在底层都表示为二进制，在Javascript中二进制前（低）三位都为0的话会被判断为Object类型，null的二进制表示全为0，自然前三位也是0，所以执行typeof时会返回"object"。
一个不恰当的例子，假设所有的Javascript对象都是16位的，也就是有16个0或1组成的序列，猜想如下：
```js
Array: 1000100010001000
null:  0000000000000000

typeof []  // "object"
typeof null // "object"
```
因为Array和null的前三位都是000。为什么Array的前三位不是100?因为二进制中的“前”一般代表低位， 比如二进制00000011对应十进制数是3，它的前三位是011。


## instanceof
要想从根本上理解，需要从两个方面入手：
- 语言规范中是如何定义这个运算符的
- JavaScript原型继承机制

通俗一些讲，`instanceof` 用来比较一个对象是否为某一个构造函数的实例。注意，instanceof运算符只能用于对象，不适用原始类型的值。

1. 判断某个`实例`是否属于`某种类型`
```js
function Foo() {};
Foo.prototype.message = ...;
const a = new Foo();
```

2. 也可以判断一个实例是否是其父类型或者祖先类型的实例。
```js
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
const auto = new Car('Honda', 'Accord', 1998);

console.log(auto instanceof Car);
// expected output: true

console.log(auto instanceof Object);
// expected output: true
```

### JavaScript原型链

#### 理解原型
我们创建的每个函数都有一个 [[prototype]](原型))属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。那么 prototype 就是调用 `构造函数` 而创建的那个对象`实例`的`的原型对象`。使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法。
```js
function Person() {};
Person.prototype.name = 'kangkang';
Person.prototype.sayName = function() {
    console.log(this.name);
}

const person1 = new Person();
person1.sayName(); // 'kangkang'

const person2 = new Person();
person2.sayName(); // 'kangkang'

console.log(person1.sayName === person2.sayName);
// true
```

#### 构造函数，原型和实例的关系
- 每个`构造函数`都有一个`原型对象`
- `原型对象`都包含一个指向`构造函数`的`指针`
- 而`实例`都包含一个指向`原型对象`的`指针`

那么，假如我们让`原型对象`等于`另一个类型`的`实例`，结果会怎么样？
显然，此时的`原型对象`将包含一个指向`另一个原型`的`指针`，相应地，`另一个原型`中也包含着一个指向指向另一个`构造函数`的`指针`。假如`另一个原型`又是`另一个类型`的`实例`，那么上述关系依然成立，如此层层递进，就构成了实例与原型的链条。这就是所谓原型链的基本概念。

> 上面这段话有点绕，如果想不明白的话，这里可以停一下，读三篇，再结合我们平常写代码使用过程中的实际场景。

#### `[[prototype]]`机制

`[[prototype]]`机制就是存在与对象中的一个内部链接，它会引用其他对象。
通常来说，这个链接的作用是：**如果在对象上没有找到需要的属性或者方法引用，引擎就会继续在 `[[ptototype]]`关联的对象上进行查找，同理，如果在后者中也没有找到需要的引用就会继续查找它的[[prototype]],以此类推。这一系列对象的链接被称为“原型链”。**
#### 但是哪里是 [[prototype]]的 ”尽头“呢？

**所有普通的 [[prototype]]链最终都会执行内置的 `Object.prototype`。由于所有的"普通"(内置，不是特定主机的扩展)对象都”源于“(或者说把[[prototype]] 链顶端设置为)这个`Object.prototype`对象，所以说它包含JavaScript中许多通用的功能。比如说`.toString()`和 `.valueOf()`等等**。

`Object.ptototype`是js原型链的最顶端，它的`__proto__`是`null`(有__proto__属性，但值是 null，因为这是原型链的最顶端)；

#### 为什么要这么设计？
最主要的就是节省内存，如果属性和方法定义在原型上，那么所有的实例对象就能共享。

#### `__proto__`
绝大多数（不是所有）浏览器也支持一种非标准的方法来访问内部的 `[[prototype]]`属性。

```js
function Foo() {};
const a = new Foo();

a.__proto__ === Foo.prototype; // true
```
这个奇怪的`.__proto__`属性“神奇地”引用了内部的`[[prototype]]`对象。如果你想直接查找（甚至可以直接通过.__proto__.__proto__ ...来遍历）原型链的话，这个方法非常有用。

> 和`.construtor`一样，`__proto__`实际上并不存在于你正在使用的对象(本例中是`a`)。实际上，它和其他的常用函数（`.toString()、.isPrototypeOf(...)`，等等 一样，存在于内置的`Object.prototype`中。（它们是不可枚举的；

此外，`.__proto__`看起来很像一个属性，但是实际上它更像一个 `getter/setter`。
`.__proto__`的实现大致是这样的
```js
Object.defineProperty(Object.prototype, "__proto__", {
    get: function() {
        return Object.getPrototypeOf(this);
    },
    // ES6中的Object.setPrototypeOf
    set: function(o) {
        Object.setPrototypeOf(this, o);
        return o;
    }
})
```
因此，访问（获取值） `a.__proto__`时，实际上是调用了 `a.__proto__()(调用getter函数)`。虽然`getter`函数存在于`Object.prototype`对象中，但是 它的 this 指向对象` a`，所以和`object.getPrototypeOf(a)`结果相同。

`.__proto__`是可设置属性，之前的代码中使用ES6的`Object.getPrototypeOf(...)`进行设置。然而，通常来说你不需要修改已有对象的`[[prototype]]`。

#### 原型链
![JavaScript原型链](https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1568723939170.png)
- 1. `function Foo` 就是一个方法，比如内置的 Array，String，或者自定义方法。
- 2. `function Object`就是 `Object`
- 3. `function Function`就是 `Function`
- 4. 以上三个其实都是 function，所以他们的 `__proto__`都是 `Function.prototype`
- 5. 记住 `String`, `Array`, `Number`,` Object`, `Function`这些其实都是 function

```js
function Foo() {};

console.log(Object instanceof Object); // true
console.log(Function instanceof Function); // true
console.log(Function instanceof Object); // true

console.log(Foo instanceof Foo); // false
console.log(Foo instanceof Object); // true
console.log(Foo instanceof Function); // true
```
大家可以在控制台输出，可以直观的看到每个步骤的输出，结合instanceof 的规范跟js原型链 加深理解。

回过头来再看`instanceof`。
 
`instanceof`的语法：
```js
object instanceof constructor
// 等同于
constructor.prototype.isPrototypeOf(object)
```
- object： 要检测的对象
- constructor：某个构造函数

`instanceof`的代码实现。
```js
function instanceof(L, R) { //L是表达式左边，R是表达式右边
    const O = R.prototype;
    L = L.__proto__;
    while(true) {
        if (L === null)
            return false;
        if (L === O) // 这里重点：当 L 严格等于 0 时，返回 true 
            return true;
        L = L.__proto__;
    }
}
```

`instanceof`原理： 检测 `constructor.prototype`是否存在于参数 object的 原型链上。`instanceof` 查找的过程中会遍历`object `的原型链，直到找到 `constructor` 的 `prototype` ,如果查找失败，则会返回`false`，告诉我们，`object` 并非是 `constructor` 的实例。

> 原型链这部分很不好理解，我基本上都是看完过几天就忘，所以要多看几遍多理解，花些时间搞明白，搞明白这部分。之后再看相关的东西，就很简单易懂。这部分是JavaScript很重要的核心。花几天时间反复看，弄明白了，以后理解很多问题都是简单的多。如果你发现我上面哪部分表述的不太准确，记得给我指出来，互相学习。这部分推荐好好看看 `《JavaScript高级程序设计（第3版）》第六章`的这部分，还有 `《你不知道的JavaScript（上卷)》第五章`关于这部分内容的讲解。


### Symbol.hasInstance
对象的`Symbol.hasInstance`属性，指向一个内部方法。当其他对象使用`instanceof`运算符，判断是否为该对象的实例时，会调用这个方法。比如，`foo instanceof Foo`在语言内部，实际调用的是Foo[Symbol.hasInstance](foo)。

```js
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

[1, 2, 3] instanceof new MyClass() // true
```

## 总结
看完之后，脑子里可以把上面的内容串一下；看看下面的几个问题你是否可以立刻想出来

- `JavaScript`有哪几种数据类型，都有哪些判断数据类型的操作，返回值是什么，原理是什么
- `typeof null` 为什么是 `”object“`
-  什么是`原型`，哪里是 `[[prototype]]`的 ”尽头“，为什么要这么设计
-  `JavaScript`原型链的核心是什么
-  `instanceof`的原理是什么
-  `Symbol.hasInstance`又是什么（或者你自己实现一个`instanceof`）

