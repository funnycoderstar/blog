![导图](https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1584421171186.png?q/80)
## this
记得差不多在两年多之前写过一篇文章 [两句话理解js中的this](https://juejin.im/post/5a0d9ff4f265da432e5b91da)，当时总结的两句话原话是这样的：
1. 普通函数指向函数的调用者：有个简便的方法就是看函数前面有没有点，如果有点，那么就指向点前面的那个值;
2. 箭头函数指向函数所在的所用域： 注意理解作用域，只有函数的`{}`构成作用域，对象的`{}`以及 `if(){}`都不构成作用域;
当时对this的内部原理什么的都理解的不是很深刻，就只能凭借遇到很多坑之后，总结了出了那时候自己用来判断的标准。这里会再次略微深入的说一下。思路还是围绕上面总结的那两句话。

### 普通函数调用
1. 默认绑定
```js
var a = 'luckyStar';
function foo() {
    console.log(this.a);
}
foo();
// luckyStar
```
foo()直接调用非严格模式下是this是指向 window上的，严格模式 this 指向的是undefined;

2. 隐式绑定
```js
var a = 'luckyStar';
var obj = {
    a: 'litterStar',
    foo() {
        console.log(this.a);
    }
}
obj.foo(); // ①
// litterStar

var bar = obj.foo; 
bar(); // ②
// luckyStar 

setTimeout(obj.foo, 100); // ③
// luckyStar 
```
位置①，obj.foo()，是obj通过`.`运算符调用了 foo()，所以指向的值 obj。
位置②，是把 obj.foo赋值给了 bar，实际上是把 foo函数赋值给了bar, bar() 调用的时候，没有调用者，所以使用的是默认绑定规则。
位置③，是把 obj.foo赋值给了 setTimeout，实际上调用的还是 foo函数，调用的时候，没有调用者，所以使用的是默认绑定规则。

位置②和位置 位置③ 的一定要注意。

3. 显式绑定
```js
function foo() {
    console.log(this.name);
}
const obj = {
    name: 'litterStar'
}
const bar = function() {
    foo.call(obj);
}
bar();
// litterStar
```
使用 call，apply可以显式修改 this的指向，下面会详细介绍该部分。

4. new 绑定
```js
function Foo(name) {
    this.name = name;
}
var luckyStar = new Foo('luckyStar');
luckyStar.name; 
// luckyStar
```
要解释上面的结果就要从 new 的过程说起了

1. 创建一个新的空对象 obj
2. 将新对象的的原型指向当前函数的原型
3. 新创建的对象绑定到当前this上
4. 如果没有返回其他对象，就返回 obj，否则返回其他对象

```js
function _new(constructor, ...arg) {
    // ① 创建一个新的空对象 obj
    const obj = {};
    // ② 将新对象的的原型指向当前函数的原型
    obj.__proto__ = constructor.prototype;
    // ③ 新创建的对象绑定到当前this上
    const result = constructor.apply(obj, arg); 
    // ④ 如果没有返回其他对象，就返回 obj，否则返回其他对象
    return typeof result === 'object' ? result : obj;
}
function Foo(name) {
    this.name = name;
}
var luckyStar = _new(Foo, 'luckyStar');
luckyStar.name; //luckyStar
```

### 箭头函数调用
箭头函数中其实没有 this 绑定，因为箭头函数中this指向函数所在的所用域。箭头函数不能作为构造函数
```js
const obj = {
    name: 'litterStar',
    say() {
        console.log(this.name);
    },
    read: () => {
        console.log(this.name);
    }
}
obj.say(); // litterStar
obj.read(); // undefined
```

## call，apply，bind

call，apply，bind 这三个函数是 Function原型上的方法 `Function.prototype.call()`，`Function.prototype.apply`，`Function.prototype.bind()`，所有的函数都是 `Funciton` 的实例，因此所有的函数可以调用call，apply，bind 这三个方法。

### call，apply，bind 在用法上的异同

#### 相同点：
call，apply，bind 这三个方法的第一个参数，都是this。如果你使用的时候不关心 this是谁的话，可以直接设置为 null

#### 不同点：

- 函数调用 call，apply方法时，返回的是调用函数的返回值。
- 而bind是返回一个新的函数，你需要再加一个小括号来调用。
- call和apply的区别就是，call接受的是一系列参数，而apply接受的是一个数组。

但是有了 ES6引入的 `...`展开运算符，其实很多情况下使用 call和apply没有什么太大的区别。

举个例子，找到数组中最大的值
```js
const arr = [1, 2, 3, 5];
Math.max.call(null, ...arr);
Math.max.apply(null, arr);
```
`Math.max` 是数字的方法，数组上并没有，但是我们可以通过 call, apply 来使用 `Math.max` 方法来计算当前数组的最大值。


### 手写 call，apply，bind

实现一个call：
- 如果不指定this，则默认指向window
- 将函数设置为对象的属性
- 指定this到函数并传入给定参数执行函数
- 执行&删除这个函数，返回函数执行结果

```js
Function.prototype.myCall = function(thisArg = window) {
    // thisArg.fn 指向当前函数 fn (fn.myCall)
    thisArg.fn = this;
    // 第一个参数为 this，所以要取剩下的参数
    const args = [...arguments].slice(1);
    // 执行函数
    const result = thisArg.fn(...args);
    // thisArg上并不存在fn，所以需要移除
    delete thisArg.fn;
    return result;
}

function foo() {
    console.log(this.name);
}
const obj = {
    name: 'litterStar'
}
const bar = function() {
    foo.myCall(obj);
}
bar();
// litterStar
```
实现一个apply
过程很call类似，只是参数不同，不再赘述

```js
Function.prototype.myApply = function(thisArg = window) {
    thisArg.fn = this;
    let result;
    // 判断是否有第二个参数
    if(arguments[1]) {
        // apply方法调用的时候第二个参数是数组，所以要展开arguments[1]之后再传入函数
        result = thisArg.fn(...arguments[1]);
    } else {
        result = thisArg.fn();
    }
    delete thisArg.fn;
    return result;
}
```


实现一个bind

MDN上的解释：bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

```js
Function.prototype.myBind = function(thisArg) {
    // 保存当前函数的this
    const fn = this;
    // 保存原先的参数
    const args = [...arguments].slice(1);
    // 返回一个新的函数
    return function() {
        // 再次获取新的参数
        const newArgs = [...arguments];
        /**
         * 1.修改当前函数的this为thisArg
         * 2.将多次传入的参数一次性传入函数中
        */
        return fn.apply(thisArg, args.concat(newArgs))
    }
}

const obj1 = {
    name: 'litterStar',
    getName() {
        console.log(this.name)
    }
}
const obj2 = {
    name: 'luckyStar'
}

const fn = obj1.getName.myBind(obj2)
fn(); // luckyStar
```

> 手写部分的代码大部分参考了网上比较多的一些写法。手写代码的前提是一定要搞清楚这个函数是什么，怎么用，干了什么。

## 重要参考
- 你不知道的JavaScript（上卷）
- [不能使用call,apply,bind，如何用js实现call或者apply的功能？](https://www.zhihu.com/question/35787390)
- [JavaScript深入之bind的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)
- [「中高级前端面试」JavaScript手写代码无敌秘籍](https://juejin.im/post/5c9c3989e51d454e3a3902b6#heading-5)
- [22 道高频 JavaScript 手写面试题及答案](https://juejin.im/post/5d51e16d6fb9a06ae17d6bbc#heading-7)
- [MDN上bind函数的Polyfill](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
