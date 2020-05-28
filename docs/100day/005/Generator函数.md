## 目录

- `Generator`语法
  - `yield`
  - `yield *`表达式
  - `next`方法的参数
- `Generator`为什么是异步编程解决方案
- 异步应用
  - `Thunk`函数
  - `co`模块

JavaScript是单线程的，异步编程对于 JavaScript语言非常重要。如果没有异步编程，根本没法用，得卡死不可。

## Generator语法

JavaScript开发者在代码中几乎普遍依赖一个假定：一个函数一旦开始执行，就会运行结束，期间不会有其他代码打断它并插入其中。但是ES6引入了一种新的函数类型，它并不符合这种运行到结束的特征。这类新的函数被称为生成器。

> 更正一下上一篇文章对Iterator对象的翻译，翻译成中文应该为迭代器。遍历是一个动词， 迭代器是名词。

执行 Generator 函数返回一个迭代器对象。先来简单回顾一下什么是迭代器对象

```js
function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        { 
            value: array[nextIndex++],
            done: false
        } 
        :
        {
            value: undefined,
            done: true
        };
    }
  };
}
const it = makeIterator(['a', 'b']);

it.next() 
// { value: "a", done: false }
it.next() 
// { value: "b", done: false }
it.next() 
// { value: undefined, done: true }
```
`makeIterator`函数就是用于生成迭代器对象的。
`Generator` 函数返回的遍历其对象，可以依次遍历` Generator` 函数内部的每一个状态。

`Generator` 函数是一个普通函数，但是有两个特征。
- 1. `function` 关键字与函数名之前有个星号
- 2. 函数体内部使用`yield`表达式

```js
function *helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

const hw = helloWorldGenerator();
```
上面的 定义了一个`Generator` 函数 `helloWorldGenerator`，它的内部有两个`yield`表达式（`Hello`和`world`），即函数有三个状态： `Hello`,` world`和`return`语句。

`Generator` 函数的调用方式和普通函数一样，但是调用它并不执行，而是返回一个指向内部状态的指针对象（`Iterator对象`）

```js
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```
上面一共调用了`4`次next方法
1. ` Generator` 函数 开始执行，知道遇到第一个 `yield`表达式，`next()`方法返回一个对象，它的`done`属性就是当前`yield`表达式的值 `Hello`(这里注意是`yield`表达值的值，并不是`yield`表达式的返回值，yield表达式本身没有返回值)。

2. 下一次调用`next` 方法时，再继续往下执行，直到遇到下一个 `yield` 表达式。

3. 如果没有再遇到新的`yield`表达式，就一直运行到函数结束，直到`return`语句为止，并将`return`语句后面的表达式的值，作为返回的对象的`value`属性值。

4. 如果该函数没有`return`语句，则返回的对象的`value`属性值为`undefined`。


### yield
`yield`表达式是暂停标志。

迭代器对象的`next`方法的运行逻辑：

1. 遇到`yield`表达式，就暂停执行后面的操作，并将紧跟在`yield`后面的那个表达式的值，作为返回对象的` value `属性值。

2. 下一次调用 `next` 方法，再继续往下执行，直到遇到下一个`yield`表达式。

3. 如果没有再遇到新的 `yield` 表达式，就一直运行到函数结束，直到 `return`语句为止，并将 `return` 语句后面的表达式的值，作为返回值对象的`value`属性值。

4. 如果该函数没有`return`语句，则返回的对象的`value`属性值为`undefined`。


### yield和return的区别

相同点:

都能返回紧跟在语句后面的那个表达式的值。

不同点:
1. 每次遇到 `yield`，函数暂停执行，下一次再从该位置继续往后执行，而`return` 语句不具备位置记忆的能力。
2. 一个函数里面只有执行一次 `return` 语句, 但是可以执行多次 `yield` 表达式
3. 正常函数只能返回一个值，因为只能执行一次`return` ; `Generator`函数可以返回一系列的值，因为有任意多个`yield`。（`Generator` 函数生成了一系列的值，也就是它为什么叫生成器的来历）。

### yield *
如果在 `Generator`函数内部，调用另一个`Generator`函数，需要在前者的函数体内部，自己手动完成遍历。

```js
function *foo() {
  yield 'a';
  yield 'b';
}

function *bar() {
  yield 'x';
  // 手动遍历 foo()
  for (let i of foo()) {
    console.log(i);
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// x
// a
// b
// y 
```
`foo`和`bar`都是 `Generator` 函数，在`bar`里面调用`foo`，就需要手动遍历`foo`。
`ES6` 提供了`yield*`表达式，作为解决办法，用来在一个 `Generator` 函数里面执行另一个` Generator` 函数。

```js
function *bar() {
  yield 'x';
  yield *foo();
  yield 'y';
}

// 等同于
function *bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

// 等同于
function *bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```

### next方法的参数

`next`方法可以带有一个参数，该参数会被当做上一个`yield`表达式的返回值。`yield`表达式没有返回值，或者说总返回 `undefined`。

记住，`next`方法带有的参数，会被当做上一个`yield`表达式的返回值，`yield`表达式没有返回值。

自己默念几遍。然后看看下面代码运行的输出是什么
```js
function *foo(x) {
    const y = 2 * (yield (x + 1));
    const z = yield (y / 3);
    return (x + y + z);
}

const  a = foo(5);
console.log(a.next());
console.log(a.next());
console.log(a.next());

const b = foo(5);
console.log(b.next());
console.log(b.next(12));
console.log(b.next(13));
```

上面的运行结果是什么

```js
// { value: 6, done: false }
// { value: NaN, done: false }
// { value: NaN, done: true }

// { value: 6, done: false }
// { value: 8, done: false }
// { value: 42, done: true }
```
如果你真正理解了**next方法带有的参数，会被当做上一个yield表达式的返回值，yield表达式没有返回值**。这句话，相信这个题你一定能回答出来。

我们来一起看一下它的完整运行过程。

先看使用Generator函数生成的迭代器`a`:
1. 第一次调用next方法，遇到 yield 停止，返回yield表达式的值，此时为 `5 + 1 = 6`;

2. 第二次调用next方法，遇到 yield 停止，返回yield表达式的值，由于next方法没有带参数，上一个yield表达式返回值为`undefined`, 导致`y`的值等于`2*undefined`即(`NaN`），除以 `3` 以后还是`NaN`，因此返回对象的`value`属性也等于`NaN`。

3. 第三次调用next方法，执行的是 `return (x + y + z)`，此时`x`的值为 `5`， `y`的值为 `NaN`, 由于next方法没有带参数，上一个yield表达式返回值为`undefined`，导致z为 undefined，返回对象的 value属性等于`5 + NaN + undefined`,即 NaN


在来看看使用Generator函数生成的迭代器`b`:

1. 第一次调用next方法，遇到 yield 停止，返回yield表达式的值，此时为 `5 + 1 = 6`;

2. 第二次调用next方法，遇到 yield 停止，返回yield表达式的值，由于next方法带有参数`12`，所以上一个yield表达式返回值为`12`, 因此`y`的值等于`2*12`即(`24`），除以 `3` 是`8`，因此返回对象的`value`属性为`8`。

3. 第三次调用next方法，执行的是 `return (x + y + z)`，此时`x`的值为 `5`， `y`的值为 `24`, 由于next方法没有带参数`13`，因此z为`13`，返回对象的 value属性等于`5 + 24 + 13`,即 `42`


这个功能有很重要的语法意义。Generator函数从暂停状态到恢复运行，它的上下文状态是不变的，通过next方法的参数，就有办法在 Generator函数开始运行之后，继续想函数体内注入值。

> 由于 `next`方法的参数表示上一个`yield`表达式的返回值，所以在第一次使用 `next` 方法时，传递参数是无效的。V8引擎直接忽略第一次使用 `next`方法时的参数，只有从第二次使用` next `方法开始，参数才是有效的。从语义上讲，第一个 `next`方法用来启动迭代器对象，所以不用带有参数。

### 迭代消息传递
Generator 函数 通过 `yield` 和`next(...)`实现了内建消息输入输出能力。
```js
function *foo(x) {
    const y = x * (yield);
    return y;
}
// 启动foo(...)
const it = foo(6);
it.next();
const res = it.next(7);
console.log(res.value);
```
首先，传入6作为参数x。然后调用 it.next()，这会启动 `*foo(..)`。

在 `*foo(..)` 内部，开始执行语句 `const y = x ...`,但是就遇到了一个yield表达式。它就会在这一点上暂停 `*foo(..)`(在赋值语句中间！)，并在本质上要求调用代码为 yield 表达式提供一个结果值。

接下来，调用 `it.next(7)``，这一句把值7传回被暂停的` yield` 表达式的结果。

所以，这时赋值语句实际上就是 `const y = 6 * 7`。现在，return y 返回值42作为调用 `it.next(7)`的结果。

注意，这里有一点非常重要，`yield`和`next(..)`调用有一个不匹配。一般来说，需要的 `next(..)`调用要比 `yield`语句多一个，上面代码片段有一个`yield`和两个`next(..)`调用。

>为什么会有这个不匹配呢？
因为第一个 `next()`总是启动一个生成器，并运行到第一个 `yield`处。不过，是第二个 `next(...)`调用完第一个被暂定的`yield`表达式，第三个 `next()`调用完成第二个yield，以此类推。


### Generator.prototype.throw() 
Generator 函数返回的迭代器对象，都有一个throw方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。
```js
const g = function* () {
  try {
    yield;
  } catch (e) {
    console.log(e);
  }
};

const i = g();
i.next();
i.throw(new Error('出错了！'));
// Error: 出错了！(…)
```
### Generator.prototype.return() 
Generator 函数返回的迭代器对象，还有一个return方法，可以返回给定的值，并且终结遍历 Generator 函数。
```js
function *gen() {
  yield 1;
  yield 2;
  yield 3;
}

const g = gen();

g.next();
// { value: 1, done: false }
g.return('foo');
// { value: "foo", done: true }
g.next();
// { value: undefined, done: true }
```
迭代器对象g调用return方法后，返回值的value属性就是return方法的参数foo。并且，Generator 函数的遍历就终止了，返回值的done属性为true，以后再调用next方法，done属性总是返回true。
### next()、throw()、return()
next()、throw()、return()这三个方法本质上是同一件事，可以放在一起理解。它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换yield表达式。

next()是将yield表达式替换成一个值。
```js
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}

gen.next(1); // Object {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;
```

throw()是将yield表达式替换成一个throw语句。
```js
gen.throw(new Error('出错了')); // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));
```
return()是将yield表达式替换成一个return语句。
```js
gen.return(2); // Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;
```

### 多个迭代器
同一个 Generator函数的多个实例可以同时运行，他们甚至可以彼此交互
```js
let z = 1;
function *foo() {
    const x = yield 2;
    z++;
    const y = yield (x * z);
    console.log(x, y, z);
}
const a = foo();
const b = foo();

let val1 = a.next().value;
console.log(val1);
// 2 <--  yield 2;

let val2 = b.next().value;
console.log(val2);
// 2 <--  yield 2;

val1 = a.next(val2 * 10).value;
console.log(val1);
// 40 <--  x: 20，z:2

val2 = b.next(val1 * 5).value;
console.log(val2);
//  600 <--  x: 200，z:3

a.next(val2 / 2);
// 20, 300, 3 <-- y: 300

b.next(val1 / 4);
// 200, 10, 3 <-- y: 10
```
我们简单梳理一下执行流程

1. `*foo()`的两个实例同时启用，两个`next()` 分别从`yield 2` 语句得到`2`

2. `val2 * 10` 也就是`2 * 10`，发送到第一个生成器实例 `a`, 因为x得到的值`20`。`z`从`1`增加到`2`，然后 `20 * 2`通过 `yield`发出，将`val1`设置为`40`

3. `val1 * 5` 也就是 `40 * 5`，发送到第二个生成器实例 `b`，因此x得到的值`200`。`z`再从 `2`递增到`3`，然后 `200*3`通过 `yield` 发出，将`val2`设置为 `600`

4. `val2 / 2` 也就是 `600 / 2` 发动到第一个生成器实例 `a`, 因此 y得到值 `300`， 然后打印出 `x y z` 的值分别为 `20, 300, 3`。

5. `val1 / 4` 也就是 `40 / 4`, 发送到第二个生成器实例 `b`, 因此 `y`得到的值`10`， 然后打印出 `x y z`的值分别为 `200, 10, 3`。

### for...of
使用for...of语句时不需要使用next方法。因为它可以自动遍历 Generator 函数运行时生成的 Iterator对象。
```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  return 4;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```
为什么只显示3个yield表达式的值呢，

这是因为一旦 next方法的返回 对象的 done属性为 true，for...of 循环就停止，且不包含该返回对象，所以上面代码的return语句返回的`4`，不包括在`for...of`循环之中。

我们可以直观的来看一下 `Generator` 函数 `foo` 的遍历过程
```js
const it = foo();
console.log(it.next());
// { value: 1, done: false }
console.log(it.next());
// { value: 2, done: false }
console.log(it.next());
// { value: 3, done: false }
console.log(it.next());
// { value: 4, done: true }
console.log(it.next());
// { value: undefined, done: true }
```
可以看到第一次 `done`返回为true时，`value`为`4`，即执行到最后一个 `return` 语句。所以 `for...of` 循环中不包含 `4`;


## Generator为什么是异步编程解决方案

### 同步和异步

异步：一个任务不是连续完成的，可以理解为，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。
比如，你渴了要烧水（假如你的水壶可以响），第一段任务是你要把水壶放到火上，这个时候你可以先去干其他事情比如去看电视，过了一会，壶响了你听到了执行第二段任务去倒水喝。这个就叫异步。

同步：连续的执行就叫同步。比如上面的例子，你把水壶放到火上之后，就一直等着水烧开，再去看电视，这就叫同步。

### 传统解决异步的方法
##### 回调函数
JavaScript语言对于异步编程的实现，就是回调函数。

回调函数本身并没有问题，它的问题出现在多个回调函数嵌套。假定读取A文件之后，再读取B文件，
```js
fs.readFile(fileA, 'utf-8', function (err, data) {
  fs.readFile(fileB, 'utf-8', function (err, data) {
    // ...
  });
});
```
上面这种情况就称为"回调函数地狱"（callback hell）。代码不是纵向发展，而是横向发展，很快就会乱做一团，无法管理。因为多个异步操作形成了强耦合，只要有一个操作需要更改，它的上层回调函数和下层回调函数，可能都要跟着修改。

#####  Promise

```js
// fs-readfile-promise模块，它的作用就是返回一个 Promise 版本的readFile函数。
const readFile = require('fs-readfile-promise');

readFile(fileA)
.then(function (data) {
  console.log(data.toString());
})
.then(function () {
  return readFile(fileB);
})
.then(function (data) {
  console.log(data.toString());
})
.catch(function (err) {
  console.log(err);
});
```
Promise为了解决 "回调函数地狱"，它不是一种新语法，而是一种新写法，把嵌套改成了链式调用。而且代码也很冗余，一眼看上去一大堆`then`。


### 协程
传统的编程语言，早有异步编程的解决方案（其实是多任务的解决方案）。其中有一种叫做"协程"（coroutine），意思是多个线程互相协作，完成异步任务。协程并不是一个新的概念，其他语言中很早就又了。

它的运行流程大致如下：
- 第一步，协程A开始执行
- 第一步，协程A执行到一半，进入暂停，执行权转移到协程B。
- 第三步，（一段时间后）协程A恢复执行
- 上面流程的协程A，就是异步任务，因为它分成两段（或多段）执行。

协程既可以用单线程实现，也可以用多线程实现。

多个线程（单线程的情况下，即多个函数）可以并行执行，但是只有一个线程（或函数）处于正在运行的状态，其他线程（或函数）都处于暂停态，线程（或函数）之间可以交换执行权，也就是说，一个线程（或函数）执行到一半，可以暂停执行，将执行权交给另一个线程（或函数），等到稍后收回执行权的时候，再恢复执行。这种可以并行执行、交换执行权的线程（或函数），就称为协程。


### Generator 函数

#### 协程的 Generator 函数实现 
`Generator 函数`是协程在 `ES6` 的实现，`Generator` 函数是根据`JavaScript`单线程的特点实现的。
使用`Generator 函数`，完全可以将多个需要相互协作的任务写成 `Generator` 函数 ，它们之间使用`yield`表达式交换控制权。 

#### Generator 函数的上下文

JavaScript 代码运行时，会产生一个全局的上下文环境（context，又称运行环境），包含了当前所有的变量和对象。然后，执行函数（或块级代码）的时候，又会在当前上下文环境的上层，产生一个函数运行的上下文，变成当前（active）的上下文，由此形成一个上下文环境的堆栈。

这个堆栈是“后进先出”的数据结构，最后产生的上下文环境首先执行完成，退出堆栈，然后再执行完成它下层的上下文，直至所有代码执行完成，堆栈清空。

Generator 函数不是这样，它执行产生的上下文环境，一旦遇到yield命令，就会暂时退出堆栈，但是并不消失，里面的所有变量和对象会冻结在当前状态。等到对它执行next命令时，这个上下文环境又会重新加入调用栈，冻结的变量和对象恢复执行。

## 异步应用
```js
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}

var g = gen();
var result = g.next();

result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});
```

可以看到，虽然 Generator 函数将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）。

它不能自动执行，如果每次使用它都要自己手动写一个执行函数的话，也使用起来其实反而更加麻烦了。相信你一定也想到了，我们可以实现一个自动执行的功能，自动控制 Generator函数的流程，接收和交换程序的执行权。

### Thunk函数

JavaScript 语言的 Thunk 函数是将多参数函数，替换成一个只接受回调函数作为参数的单参数函数。

任何函数，只要参数有回调函数，就能写成 Thunk 函数的形式
```js
const Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  };
};
```
使用上面的转换器，生成`fs.readFile`的 `Thunk` 函数。
```js
const readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);
```

Thunk 函数用于 Generator 函数的自动流程管理

```js
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

function* g() {
  // ...
}

run(g);
```
### co模块
Generator 函数只要传入co函数，就会自动执行。


co模块的源码
首先，co 函数接受 Generator 函数作为参数，返回一个 Promise 对象。
```js
function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
  });
}
```
在返回的 Promise 对象里面，co 先检查参数gen是否为 Generator 函数。如果是，就执行该函数，得到一个内部指针对象；如果不是就返回，并将 Promise 对象的状态改为resolved。
```js
function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.call(ctx);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);
  });
}
```
接着，`co` 将 `Generator` 函数的内部指针对象的next方法，包装成`onFulfilled`函数。这主要是为了能够捕捉抛出的错误。
```js
function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.call(ctx);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();
    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }
  });
}
```
最后，就是关键的next函数，它会反复调用自身。
```js
function next(ret) {
  if (ret.done) return resolve(ret.value);
  var value = toPromise.call(ctx, ret.value);
  if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
  return onRejected(
    new TypeError(
      'You may only yield a function, promise, generator, array, or object, '
      + 'but the following object was passed: "'
      + String(ret.value)
      + '"'
    )
  );
}
```
上面代码中，`next`函数的内部代码，一共只有`四行`命令。

第一行，检查当前是否为 `Generator` 函数的最后一步，如果是就返回。

第二行，确保每一步的返回值，是` Promise` 对象。

第三行，使用`then`方法，为返回值加上回调函数，然后通过`onFulfilled`函数再次调用`next`函数。

第四行，在参数不符合要求的情况下（参数非 `Thunk` 函数和 `Promise` 对象），将 `Promise` 对象的状态改为`rejected`，从而终止执行。


为什么 Thunk 函数和 co 模块可以自定执行 Generator函数？
Generator函数的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。两种方法可以做到
- 回调函数。将异步操作包装成 Thunk函数，在回调函数里面交回执行权
- Promise 对象。将异步操作包装成 Promise 对象，用`then`方法交回执行权。

co 模块其实就是将两种自动执行器（Thunk 函数和 Promise 对象），包装成一个模块。使用 co 的前提条件是，Generator 函数的yield命令后面，只能是 Thunk 函数或 Promise 对象。


## 总结
- **Generator(生成器) 函数 是ES6的一个新的函数类型，它并不像普通函数那样总是运行到结束。Generator(生成器) 函数可以在运行当中暂停，并且将来再从暂定的地方恢复运行**

- **可以`暂停执行（yield）`和`恢复执行(next)`是`Generator` 函数能封装异步任务的根本原因。**

- **`函数体内外的数据交换`(`next`返回值的`value`，是`向外输出`数据，`next`方法的`参数`，是`向内输入`数据)和`错误处理机制`(Generator 函数内部还可以部署错误处理代码，捕获函数体外抛出的错误。)是它可以成为异步编程的完整解决方案。**

-  **Generator 就是一个异步操作的容器。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。所以需要自动化异步任务的流程管理。Thunk 函数是自动执行 Generator 函数的一种方法。co模块也是用于 Generator 函数的自行执行。**

