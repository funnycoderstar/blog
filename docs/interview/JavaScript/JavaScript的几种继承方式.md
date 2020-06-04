这篇文章称为笔记更为合适一些，内容来源于 《JavaScript高级程序设计 (第三版)》第六章 6.3 继承

## JavaScript的几种继承方式
1. 原型链继承
2. 借助构造函数继承（经典继承）
3. 组合继承：原型链 + 借用构造函数（最常用）
4. 原型式继承 （Object.create）
5. 寄生式继承
6. 寄生组合式继承（最理想）
 7. ES6中的继承

## 1. 原型链继承
子类型的原型为父类型的一个实例对象

```js
function Parent() {
    this.name = 'bigStar';
    this.colors = ['red', 'blue', 'yellow'];
}
Parent.prototype.getName = function() {
    console.log(this.name)
}

function Child() {
    this.subName = 'litterStar';
}
// 核心代码: 子类型的原型为父类型的一个实例对象
Child.prototype = new Parent();

let child1 = new Child();
let child2 = new Child();
child1.getName(); // bigStar


child1.colors.push('pink');
// 修改 child1.colors 会影响 child2.colors
console.log(child1.colors); // [ 'red', 'blue', 'yellow', 'pink' ]
console.log(child2.colors); // [ 'red', 'blue', 'yellow', 'pink' ]

```
> 注意核心代码： `Child.prototype = new Parent();`

### 特点：
1. 父类新增在构造函数上面的方法，子类都能访问到

### 缺点：
1. 来自原型对象的所有属性被所有实例共享，child1修改 colors 会影响child2的 colors
2. 创建子类实例时，无法向父类的构造函数传参

## 2.借助构造函数继承（经典继承）

在子类的构造函数中使用 call()或者 apply() 调用父类型构造函数
 
```js
function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'yellow'];
}
Parent.prototype.getName = function() {
    console.log(this.name)
}

function Child(name, age) {
    // 核心代码：“借调”父类型的构造函数
    Parent.call(this, name);
    this.age = age;
}

let child1 = new Child('litterStar');
let child2 = new Child('luckyStar');
console.log(child1.name); // litterStar
console.log(child2.name); // luckyStar

// 这种方式只是实现部分的继承，如果父类的原型还有方法和属性，子类是拿不到这些方法和属性的。
child1.getName(); // TypeError: child1.getName is not a function
```
> 注意核心代码： `Parent.call(this, name);`

### 特点：
- 避免引用类型的属性被所有实例共享
- 创建子类实例时，可以向父类传递参数

### 缺点
- 实例并不是父类的实例，只是子类的实例
- 只能继承父类的实例属性和方法，不能继承原型属性和方法
- 无法实现函数复用，每次创建实例都会创建一遍方法，影响性能

## 3.组合继承：原型链 + 借用构造函数（最常用）
```js
function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'yellow'];
}
Parent.prototype.getName = function() {
    console.log(this.name)
}

function Child(name, age) {
    // 核心代码①
    Parent.call(this, name);

    this.age = age;
}
// 核心代码②: 子类型的原型为父类型的一个实例对象
Child.prototype = new Parent();
Child.prototype.constructor = Child;


// 可以通过子类给父类的构造函数传参
let child1 = new Child('litterStar');
let child2 = new Child('luckyStar');
child1.getName(); // litterStar
child2.getName(); // luckyStar

child1.colors.push('pink');
// 修改 child1.colors 不会影响 child2.colors
console.log(child1.colors); // [ 'red', 'blue', 'yellow', 'pink' ]
console.log(child2.colors); // [ 'red', 'blue', 'yellow' ]
```
> 注意核心代码： `Parent.call(this, name);`和 `Child.prototype = new Parent();`

### 特点
- 融合了原型链继承和借用构造函数的优点，称为JavaScript中最常用的继承模式。
### 缺点
- 调用了两次父类构造函数，生成了两份实例
  - 一次是设置子类型实例的原型的时候 `Child.prototype = new Parent();`
  - 一次是创建子类型实例的时候 `let child1 = new Child('litterStar');`, 调用 new 会执行 ` Parent.call(this, name);`,此时会再次调用一次  `Parent`构造函数

## 4. 原型式继承 （Object.create）

借助原型可以基于现有方法来创建对象，var B = Object.create(A) 以A对象为原型，生成A对象，B继承了A的所有属性和方法。

```js
const person = {
    name: 'star',
    colors: ['red', 'blue'],
}

// 核心代码：Object.create
const person1 = Object.create(person);
const person2= Object.create(person);

person1.name = 'litterstar';
person2.name = 'luckystar';

person1.colors.push('yellow');

console.log(person1.colors); // [ 'red', 'blue', 'yellow' ]
console.log(person2.colors); // [ 'red', 'blue', 'yellow' ]

```
> 注意核心代码： `const person1 = Object.create(person);`

### 特点
- 没有严格意义上的构造函数，借助原型可以基于已有对象创建新对象
### 缺点
- 来自原型对象的所有属性被所有实例共享，person1修改 colors 会影响person2的 colors，这点跟原型链继承一样。

## 5. 寄生式继承
创建一个用于封装继承过程的函数，该函数在内部以某种方式来增强对象
```js
function createObj (original) {
    // 通过调用函数创新一个新对象
    var clone = Object.create(original);
    // 以某种方式来增强这个对象
    clone.sayName = function () {
        console.log('hi');
    }
    // 返回这个对象
    return clone;
}
```
缺点： 每次创建对象都会创建一遍方法，跟借助构造函数模式一样

## 6.寄生组合式继承（最理想的）

我们可以先回忆一下JavaScript最常用的继承模式： 组合继承（原型链 + 借用构造函数），它的最大缺点是会调用两次父构造函数（`Child.prototype = new Parent();`和 `let child1 = new Child('litterStar');`）。

我们是否可以想办法是调用一次？可以让  Child.prototype 访问到 Parent.prototype。

我们不能直接使用 `Child.prototype = Parent.prototype`来实现，因为会出现一些副作用，你可能在修改 `Child.prototype` 的时候会修改`Parent.prototype`。

可以使用 `Object.create(...)`来实现

> `Object.create` MDN上的解释：它会创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`

```js
function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'yellow'];
}
Parent.prototype.getName = function() {
    console.log(this.name)
}

function Child(name, age) {
    // 核心代码①
    Parent.call(this, name);

    this.age = age;
}
// 核心代码②
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```
> 注意核心代码： `Parent.call(this, name);`和 `Child.prototype = Object.create(Parent.prototype);`

寄生组合式继承，集寄生式继承和组合式继承的优点，是引用类型最理想的继承范式。 

## 7. ES6 中class的继承
ES6中引入了class关键字，可以通过extends关键字实现继承。
```js
class Parent {}
class Child extends Parent {
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
class关键字只是原型的语法糖，JavaScript继承仍然是基于原型实现的。

## 参考
- [JavaScript常见的六种继承方式](https://segmentfault.com/a/1190000016708006)
- [JS继承的几种方式](https://juejin.im/post/5b654e88f265da0f4a4e914c)
- [JavaScript深入之继承的多种方式和优缺点](https://github.com/mqyqingfeng/Blog/issues/16)
- [ECMAScript6入门之 Class的继承](https://es6.ruanyifeng.com/#docs/class-extends)