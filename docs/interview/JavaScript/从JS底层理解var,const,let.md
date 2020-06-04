## 目录
- 基本数据类型和引用数据类型
- 声明提升
- var，let，const

## 基本数据类型和引用数据类型
基本数据类型是按值访问的，因为可以操作保存在变量中的实际的值。
引用数据类型的值是保存在内存中的对象，JS不允许直接访问内存中的位置，所以在操作的时候操作的是对象的引用；因此是引用数据类型是按照引用访问的。

### 复制变量值
复制基本类型的值
```js
var num1 = 5;
var num2 = num1;
```
num1和num2中的5是完全独立的，互不影响
![基本类型复制](https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1584099024105.png)

复制引用类型
```js
var obj1 = new Object();
var obj2 = obj1;
obj1.name = 'lucyStar';
console.log(obj2.name);
// lucyStar
```
我们可以看到，obj1保存了一个对象的实例，这个值被复制到 Obj2中。复制操作完成后，两个变量实际引用的是同一个对象，改变了其中一个，会影响另外一个值
![引用类型复制](https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1584099553883.png?imageView2/1/q/80/)

### 传递参数
参数传递就跟把函数外部的值复制给函数内部的参数；

基本类型传参
```js
function addTen(num) {
    num+=10;
    return num;
}
const count = 20;
const result = addTen(count);
console.log(count);
// 20，没有变化

console.log(result);
// 30
```
引用类型传参
```js
function setName(obj) {
    obj.name = 'luckyStar';
    obj = new Object();
    obj.name = 'litterStar'
}
const person = new Object();
setName(person);
console.log(person.name);
// luckyStar
```
在函数内部修改了参数的值，但是原始的引用仍然保持未变。
实际上，在函数内部重写 obj时，这个变量引用的就是一个局部对象了。而这个局部对象会在函数执行完毕之后立即销毁。

## 变量提升(hoisting)

> 为了更好地解释声明提升，下面例子中使用 var 而不是使用 ES6新增的let和const（它们不存在声明提升）

1. 下面的代码输出什么
```js
a = 2;
var a;
console.log(a);
// 2
```
可能有人会认为是 undefined, 因为 var a 声明在 a = 2之后，会被重新赋值为 undefined。但他实际上的输出结果是 2

2. 下面的代码输出什么
```js
console.log(a);
var a = 2;
```

可能有人会认为，由于变量 a 在使用前没有先进行声明，因此会抛出 ReferenceError异常。但实际它的输出是 `undefined`。


引擎会在解释JavaScript代码之前首先会对其进行编译。编译阶段中一部分工作就是找到所有的声明，并用合适的作用域将他们关联起来。

所以正确的思考思路是：包含变量和函数在内的所有声明都会在任何代码被执行前首先被处理。

当你看到 `var a = 2`时，可能会被认为这是一个声明。但是 JavaScript实际上会将其看成两个声明：`var a` 和 `a = 2`; 第一个声明是在编译阶段进行的。第二个声明会被留在原地等待执行阶段。

所以第一个例子中的代码会以如下的形式进行处理
```js
var a;

a = 2;
console.log(a);
```
其中第一部分是编译，第二部分是执行。

第二个例子会按照以下流程进行处理
```js
var a;

console.log(a);
a = 2;
```
> 注意：只有声明本身会被提升，而赋值或其他运行逻辑会留在原地。

函数声明和变量声明都会被提升，但是函数会首先被提升，然后才是变量
```js
foo(); // 1

var foo;
function foo(){
    console.log(1);
}
foo = function() {
    console.log(2);
}

// 上面代码会按照以下流程进行处理

// 函数声明会提升到变量前面
function foo(){
    console.log(1);
}
var foo;

foo(); // 1
foo = function() {
    console.log(2);
}
```
虽然重复的 var声明会被忽略掉，但是出现在后面的函数声明还是会覆盖之前的
```js

foo(); // 3

function foo(){
    console.log(1);
}
var foo = function() {
    console.log(2);
}
function foo() {
    console.log(3);
}
```

思考一下下面的代码输出什么
```js
var name = 'Tom';
(function() {
    if (typeof name == 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```
答案是 `Goodbye Jack`。

改成下面这样应该会更容易理解一些
```js

// 去掉下面这行也是一样的，因为会优先访问函数作用域内部的变量
// var name = 'Tom';
(function() {
    var name; // 注意这行
    if (typeof name == 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```
立即执行函数的中的变量 name 的定义被提升到了顶部，并在初始化赋值之前是 `undefined`，所以` typeof name == 'undefined'`


## var，let，const
我们先来看看，var，let，const 声明变量的位置
![变量位置](https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1584110453596.png?imageView2/1/q/80)
可以看到 let和const声明的变量在块级作用域中，不存在变量提升。
```js
// var 的情况
console.log(a); // 输出undefined
var a = 2;

// let 的情况
console.log(b); // 报错ReferenceError
let b = 2;
```

### let
1. 声明的变量可以被修改。
2. 要注意暂时性死区(TDZ)
总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）
```js
function foo(x = y, y = 2) {
  return [x, y];
}

foo(); // 报错
```
因为参数x默认值等于另一个参数y，而此时y还没有声明，属于“死区”。

### const
声明的变量是常量;

`const` 实际保证的，并不是变量的值不变，而是变量指向的那个内存地址所保存的数据不得改动。

对于基本数据类型（数值。字符串。布尔值）。值就保存在变量指向的那个内存地址，因此等同于常量。
但对于引用数据类型主要是对象和数组）。变量指向的内存地址，保存的只是一个指向实际数据的指针。

const 只能保证这个指针是固定的（即使总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，那就完全不能控制了。因此，将一个对象声明为常量必须非常小心。

```js
const foo = {};
// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
```

## 参考
- JavaScript高级程序设计(第三版)
- 你不知道的JavaScript(上)
- [ECMAScript 6 入门 - let 和 const 命令](https://es6.ruanyifeng.com/#docs/let)