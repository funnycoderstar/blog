## 前言
`async`其实就是 `Generator`的语法糖，看本篇文章之前可以先看一下上一篇文章 [Generator函数](https://github.com/funnycoderstar/blog/issues/104)。理解 `Generator`就容易理解为什么说`async`是异步编程的完美解决方案了。

## 目录
- async函数
- async函数原理
- 常见的关于`async`的笔试题

## async函数
```js
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error){
          return reject(error);
        } 
        resolve(data);
    });
  });
};

const foo = function* () {
  const f1 = yield readFile('/src/lib');
  const f2 = yield readFile('/src/utils');

  console.log(f1.toString());
  console.log(f2.toString());
};
```
把上面代码的`Generator`函数 `foo` 可以写成 `async` 函数，就是这样：
```js
  const asyncReadFile = async function () {
  const f1 = yield readFile('/src/lib');
  const f2 = yield readFile('/src/utils');

  console.log(f1.toString());
  console.log(f2.toString());
};
```
可以发现，` async`函数就是将`Generator`函数的星号(`*`)替换成`async`，将 `yield`替换成 `await`，仅此而已。

`async`函数是基于 `Generator`的改进，体现在以下4点
1. 内置执行器。
` Generator`函数的执行必须靠执行器。所以才有了 `Thunk`函数和`co`模块，而 `async`函数自带执行器。`async`函数的执行和普通函数一样。
```js
asyncReadFile();
```
 
2. 更好的语义。
`async`和`awai`t，比起星号和`yield`，语义更清楚了。
`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果。

3. 更广的适应性。
即使 `Generator`函数可以借助`co`模块自动执行，但是`co`模块后面只能是` Thunk`函数或`Promise`对象，而`async`函数的`await`命令后面，可以是 Promise对象和原始类型的值（数值、字符串和布尔值，但这是会自动转成立即 `resolved`的 `Promise对象`）

4. 返回值是 `Promise`。
aysnc函数返回值为 `Promise`，这比`Generator`函数的返回值是`Iterator`对象方便多了。

`async`函数完全可以看作多个异步操作，包装成的一个` Promise` 对象，而await命令就是内部`then`命令的语法糖。

> 总之就是 `Generator` 函数虽然是JS借鉴其他语言，根据JS本身单线程的特点实现的协程，但是使用起来会麻烦很多，每次都要自己去写执行器，而 `async`函数就是为了解决这些重复的工作而生的。其实  `async`函数就是将`Generaor`函数和自动执行器完美地封装在了一起。


## async函数的实现原理
就是将Generator函数和自动执行器，包装在一个函数里。

```js
async function fn(args) {
    // ...
}
function fn(args) {
    return spawn(function* () {
        // ...
    })
}
```
所有的 `async` 函数都可以写成上面的第二种形式，其中 spawn 函数就是自动执行器。
```js
// 接受 Generator 函数作为参数，返回一个 Promise 对象
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    // 执行genF，得到一个内部指针对象
    const gen = genF();

    function step(nextF) {
      let next;

      // 进行错误处理
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }

      // 将 next.value 转成 Promise对象
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }

    // 会反复调用 step
    step(function() { return gen.next(undefined); });

  });
}
```

可以看到，其实是 Generator函数和Promise的组合，实现了一个自动执行器，返回 Promise对象


## 常见的关于`async`的笔试题
- 实现一个`sleep`：
- 实现一个红绿灯： 红灯2秒，黄灯1秒，绿灯3秒
- 使用 `async` 实现` Promise.all()`的效果

## 实现一个 sleep 
每隔1秒输出 1， 2， 3， 4， 5
```js
function sleep(interval) {
    return new Promise(resolve => {
        setTimeout(resolve, interval);
    })
}

// 用法
async function one2FiveInAsync() {
    for (let i = 1; i <= 5; i++) {
        console.log(i);
        await sleep(1000);
    }
}
one2FiveInAsync();

```
### 实现一个红绿灯

红灯2秒，黄灯1秒，绿灯3秒

```js
function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    })
}
async function changeColor(color, duration) {
    console.log('当前颜色', color);
    await sleep(duration);
}
async function main() {
    await changeColor('红色', 2000);
    await changeColor('黄色', 1000);
    await changeColor('绿色', 3000);
}
main();
```
### 使用 async 实现 Promise.all()的效果

假设 `getFoo`和`getBar`是两个用于发起`ajax`请求的函数。

```js
// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();

let foo = await fooPromise;
let bar = await barPromise;
```

上面两种写法，getFoo 和 getBar 都是同时触发，这样就会缩短程序的执行时间。

> 上面只是简单示例，思考一下，写出完整代码。


## 总结

- `async` 函数原理就是 `Generator`函数 和 自动执行器包装了一下。
- `Generator`就是可以暂定执行和在之前停下的位置接着执行。比如发送一个接口请求，发出之后，JS可以去干其他的事儿，接口请求回来之后（数据通过next传入），会接着继续执行。但是它不能自动执行，所以需要自动执行器， `thunk`函数和`co`模块都是，但是async给我们封装得更加完美。

