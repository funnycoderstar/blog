## 题目要求

是实现一个 `function repeat (func, times, wait) { }`函数，每隔 wait 毫秒执行 func 函数 times 次，调用过程如下：

```js
function repeat(func, times, wait) {
    // TODO
}
const repeatFunc = repeat(console.log, 4, 3000);
// 调用这个 repeatFunc ("hellworld")，会console.log,4次 helloworld, 每次间隔3秒
```

## 代码

实现一

```js
async function sleep(fn, wait, args) {
    return new Promise((resolve) => {
        setTimeout(() => {
            fn.apply(this, args);
            resolve();
        }, wait);
    });
}
function repeat(func, times, wait) {
    return async function() {
        for (let i = 0; i < times; i++) {
            await sleep(func, wait, arguments);
        }
    };
}
var repeatFunc = repeat(alert, 4, 3000);
repeatFunc('helloworld');
```

### 实现二：

通过调用方式 repeatFunc(“hellworld”);可以知道这个 repeatFunc 函数是可以传参的，说明 repeat 的返回值是一个函数。

```js
function repeat(func, times, wait) {
    return function(content) {};
}
```

每隔 wait 毫秒执行 func 函数 times 次：可以通过 setInterval，内含一个计数变量，当达到 times 时，clearInterval。（注意不能用 for+setTimeout，因为 for 是同步的，导致 setTimeout 全都放到队列里，没有了时间间隔）
完整代码：

```js
function repeat(func, times, wait) {
    return function(content) {
        var count = 0;
        var interval = setInterval(function() {
            count += 1;
            func(content);
            if (count === times) {
                clearInterval(interval);
            }
        }, wait);
    };
}
const repeatFunc = repeat(alert, 4, 3000);
repeatFunc('hellworld');
```

## 参考

-   [动手实现一个 repeat 方法](https://github.com/lgwebdream/FE-Interview/issues/148)
-   [前端面试题 每隔一段时间执行一个函数 执行次数一定 setInterval](https://blog.csdn.net/xy470346280/article/details/96100560)
