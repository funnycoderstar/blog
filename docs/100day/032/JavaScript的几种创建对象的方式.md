这篇文章称为笔记更为合适一些，内容来源于 《JavaScript高级程序设计 (第三版)》第六章 6.2 创建对象。

## JavaScript的几种创建对象的方式
1. 工厂模式
2. 构造函数模式
3. 原型模式
4. 组合使用构造函数模式和原型模式（最常见）
5. 动态原型模式
6. 寄生构造函数模式
7. 稳妥构造函数模式

## 1. 工厂模式
```js
function createPerson(name, age) {
    // 显示创建对象
    const obj = new Object();
    // 直接给对象进行赋值
    obj.name = name;
    obj.age = age;
    obj.sayName = function() {
        console.log(obj.name);
    }
    // 最后 return 该对象
    return obj;
}

const person1 = createPerson('litterstar', 18);
console.log(person1);
```
### 特点：
解决创建多个相似对象的问题

### 缺点：
1. 无法使用 constructor 或 instanceof 识别对象实例的类型，以为都是来自 Object
2. 通过createPerson 创建的对象，所有的 sayName方法都是一样的，但是却创建了多次，浪费资源

## 2. 构造函数模式
```js
function Person(name, age) {
    // 和工厂模式区别
    // ① 没有显式创建对象
    // ② 直接将属性和方法赋给了this对象
    // ③ 没有return 语句
    this.name = name;
    this.age = age;
    this.sayName = function() {
        console.log(obj.name);
    }
}

const person1 = new Person('litterstar', 18);
console.log(person1);
```
### 特点：

1. 可以使用 constructor 或 instanceof识别对象实例的类型
2. 使用 new 来创建实例

### 缺点：
1. 每次创建实例时，每个方法都要被创建一次

## 3. 原型模式
```js
function Person() {}

Person.prototype.name = 'litterstar';
Person.prototype.age = 18;
Person.prototype.sayName = function () {
    console.log(this.name);
}
const person1 = new Person();
```
### 特点：
方法不会被重复创建

### 缺点：
1. 不能初始化实例参数
2. 所有的属性和方法都被实例共享

## 4. 组合使用构造函数模式和原型模式 （最常见）
```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.sayName = function () {
    console.log(this.name);
}
const person1 = new Person('littlerstar', 18);
console.log(person1);
```
### 特点:
1. 解决了方法会被重复创建的问题, 所有实例的 sayName指向的都是同一个；该私有的私有，该公有的公有


## 5.动态原型模式

```js
function Person(name, age) {
    // 属性
    this.name = name;
    this.age = age;
    // 方法
    // 只有 sayName() 方法不存在的情况下，才会将它添加到原型中
    if(typeof this.sayName !== 'function') {
        Person.prototype.sayName = function () {
            console.log(this.name);
        }
    }
}
const person1 = new Person('littlerstar', 18);
console.log(person1.constructor); // [Function: Person]
```
### 特点
把所有信息封装在构造函数中。
### 

## 6. 寄生构造函数模式

```js
function Person(name, age) {
    // 显式创建对象
    const obj = new Object();
    // 直接给对象进行赋值
    obj.name = name;
    obj.age = age;
    obj.sayName = function() {
        console.log(obj.name);
    }
    // 最后 return 该对象
    return obj;
}

const person1 = new Person('litterstar', 18);
console.log(person1.constructor); // [Function: Object]
```
### 特点:
除了使用 new 操作符并把 使用的包装函数叫做构造函数之外，这个模式跟工厂模式其实是一模一样的。

### 缺点：
1. 无法使用 constructor 或 instanceof识别对象实例的类型，以为都是来自 Object

## 7. 稳妥构造函数模式

```js
function Person(name, age) {
    // 显式创建对象
    const obj = new Object();
    // 直接给对象进行赋值
    obj.name = name;
    obj.age = age;
    obj.sayName = function() {
        console.log(obj.name);
    }
    // 最后 return 该对象
    return obj;
}
// 变量 person1中保存的是一个稳妥对象，除了调用 sayName()方法外，没有别的方法访问其数据成员
const person1 = Person('litterstar', 18);
console.log(person1.constructor); // [Function: Object]
```
稳妥构造函数模式和寄生构造函数模式有一下两点不同
1. 新创建对象的实例方法不引用 this
2. 不使用 new 操作符调用否早函数


### 优点：
1. 安全，将所有变量私有化。比如上面例子中的变量 person1 除了调用 sayName()方法外，没有别的方法访问其数据成员

### 缺点：
1. 无法使用 constructor 或 instanceof识别对象实例的类型，以为都是来自 Object

## 参考
- [JavaScript 创建对象的 7 种方法](https://juejin.im/entry/58291447128fe1005cd41c52)
- [JavaScript深入之创建对象的多种方式以及优缺点](https://github.com/mqyqingfeng/Blog/issues/15)
