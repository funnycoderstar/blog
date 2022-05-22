记录一些很难容易错误的点。

## 1.下面代码输出什么

```js
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');
async1();
console.log('script end');
```

代码输出顺序

```js
script start
async1 start
async2
script end
async1 end
```

比较容易出错的点是：
执行 async1()，输出 async1 start, 然后执行 async2(), 输出 async2，把 async2() 后面的代码 console.log('async1 end')放到微任务队列中。
await xxx，await 之前的代码都是同步执行的，await 之后的才会等待 await 之前的代码执行完。

## 2.输出以下代码运行结果，为什么？如果希望每隔 1s 输出一个结果，应该如何改造？注意不可改动 square 方法

```js
const list = [1, 2, 3];
const square = (num) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(num * num);
        }, 1000);
    });
};

function test() {
    list.forEach(async (x) => {
        const res = await square(x);
        console.log(res);
    });
}
test();
```

我的答案
1, 4, 9，1s 后输出 1，1s 后输出 4，1s 后输出 9

正确答案：
同时输出 1， 4， 9。forEach 是不能阻塞的，默认是请求并行发起，所以是同时输出 1， 4， 9。这里并行进行是因为 forEach 实现的问题。普通的 for 等于同一个块作用域连续 await，而 forEach 的回调是一个个单独的函数，跟其他回调同时执行，互不干扰。

```js
function test() {
    list.forEach(async (x) => {
        const res = await square(x);
        console.log(res);
    })(
        //forEach循环等于三个匿名函数;
        async (x) => {
            const res = await square(x);
            console.log(res);
        }
    )(1);
    (async (x) => {
        const res = await square(x);
        console.log(res);
    })(2);
    (async (x) => {
        const res = await square(x);
        console.log(res);
    })(3);

    // 上面的任务是同时进行
}

async function test() {
    for (let x of list) {
        const res = await square(x);
        console.log(res);
    }
}
//等价于

async function test() {
    const res = await square(1);
    console.log(res);
    const res2 = await square(2);
    console.log(res);
    const res3 = await square(3);
    console.log(res);
}
```

### 串行解决方案

1. 使用 for 循环

```js
async function test() {
    for (let i = 0; i < list.length; i++) {
        const res = await square(list[i]);
        console.log(res);
    }
}
```

2. for of

```js
async function test() {
    for (let x of list) {
        const res = await square(x);
        console.log(res);
    }
}
```

3. promise 串式调用

```js
let promise = Promise.resolve();
function test(i = 0) {
    if (i === list.length) return;
    promise = promise.then(() => square(list[i]));
    test(i + 1);
}
```

4. reduce

```js
async function test() {
    await list.reduce(async (_, x) => {
        await _;
        const res = await square(x); // 这里可以不用 return，因为没有用到累积变量。而且，每一轮 async 函数不管有没有 return，总是返回一个 Promise 对象
        console.log(res);
    }, undefined);
}
```

-   reduce()方法的第一个参数是 async 函数，导致该函数的第一个参数是前一步操作返回的 Promise 对象，所以必须使用 await 等待它操作结束
-   reduce()方法返回的是 list 数组最后一个成员的 async 函数的执行结果，也是一个 Promise 对象，导致在它前面也必须加上 await。

是因为 reduce 函数比较特殊，因为它是把上一次循环执行的 callback 的返回值作为参数传递为下一次循环执行的 callback 的.

### 问题：

下面几个例子来自 [ECMAScript 6 入门 async 函数注意点](https://es6.ruanyifeng.com/#docs/async#%E4%BD%BF%E7%94%A8%E6%B3%A8%E6%84%8F%E7%82%B9)。这里面提到的这几个例子非常值得花时间理解一下。

-   并发：同时开始执行，不用等待上一个结束才开始执行
-   继发：等待上一个结束再去执行下一个

1. 为什么 forEach， 这时三个 db.post()操作将是并发执行，也就是同时执行，而不是继发执行

```js
function dbFuc(db) {
    //这里不需要 async
    let docs = [{}, {}, {}];

    // 可能得到错误结果
    docs.forEach(async function(doc) {
        await db.post(doc);
    });
}
```

因为 `docs.forEach(callback)`, 这里的 callback 第二次循环执行并不用等待第一次循环执行的结果。所以他们都是并发执行的。

2. 为什么写法二是并发执行的

```js
let foo = await getFoo();
let bar = await getBar();
```

上面代码是继发执行的。如果想改成并发，就使用下面的写法。

```js
// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```

`getFoo()`开始执行后，`getBar()`不用等待`getFoo()`函数返回结果。如果改成下面这种，就是继发执行了。

```js
let fooPromise = getFoo();
let foo = await fooPromise;
let barPromise = getBar();
let bar = await barPromise;
```

总结：判断两个函数并发还是继发执行，就看后一个函数是否需要等待上一个执行完之后再执行。

### 类似的题目

-   第一个请求是续发，请求成功之后处理两个并发请求，之后在处理相关业务：https://www.jianshu.com/p/31d53d701171
-   实现一个批量请求函数 multiRequest(urls, maxNum)，要求最大并发数 maxNum
-   实现一个限制并发的 Promise.all
-   实现一个 repeat 函数
-   实现一个 lazyman
-   红绿灯
-   sleep

## 文档

-   [ECMAScript 6 入门 async 函数注意点](https://es6.ruanyifeng.com/#docs/async#%E4%BD%BF%E7%94%A8%E6%B3%A8%E6%84%8F%E7%82%B9)
-   [输出以下代码运行结果，为什么？如果希望每隔 1s 输出一个结果，应该如何改造？注意不可改动 square 方法](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/389)
