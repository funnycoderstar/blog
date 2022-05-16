## 题目

```js
实现一个LazyMan，可以按照以下方式调用:
LazyMan("Hank")输出:
Hi! This is Hank!

LazyMan("Hank").sleep(10).eat("dinner") 输出
Hi! This is Hank!
//等待10秒..
Wake up after 10
Eat dinner~

LazyMan('Hank').eat('dinner').eat('supper') 输出
Hi This is Hank!
Eat dinner~
Eat supper~

LazyMan("Hank").sleepFirst(5).eat("supper")输出
//等待5秒
Wake up after 5
Hi This is Hank!
Eat supper
以此类推。
```

### 实现方法一：

```js
class LazyMan {
    constructor(name) {
        this.name = name;
        // 为什么要加 setTimeout({}, 0), 保证每轮的微任务执行后才执行，为了实现  sleepFirst 之后才执行这部分
        setTimeout(() => {
            console.log(`Hi! This is ${name}!`);
        }, 0);
    }
    eat(value) {
        // 为什么要加 setTimeout({}, 0), 保证每轮的微任务执行后才执行，为了实现  sleepFirst 之后才执行这部分
        setTimeout(() => {
            console.log(`eat ${value}`);
        }, 0);

        // 返回 this 实现链式调用
        return this;
    }

    sleep(ms) {
        const delay = ms * 1000;
        const time = Date.now();
        while (Date.now() - time < delay) {}
        // 为什么在setTimeout里返回this不行, 函数执行会先于setTimeout里面的函数执行
        setTimeout(() => {
            console.log('sleep wake up after ' + ms);
        }, 0);

        return this;
    }

    sleepFirst(ms) {
        new Promise((resolve, reject) => {
            const delay = ms * 1000;
            const time = Date.now();
            while (Date.now() - time < delay) {}
            resolve();
        }).then(() => {
            console.log('sleepFirst wake up after ' + ms);
        });
        return this;
    }
}
function lazyMan(name) {
    return new LazyMan(name);
}
```

1. 为什么必须用 setTimeout 包裹
   为了 保证每轮的微任务执行后才执行，为了实现 sleepFirst 之后才执行这部分的逻辑
2. 在 setTimeout 里返回 this

```js
sleep() {
const that = this;
    setTimeout(() => {
      console.log('sleep返回', that);
      return that;
    }, ms);
}

console.log('执行函数', lazyMan('Hank').sleep(10));
```

这种情况会出现的问题是，函数已经执行完了，才执行到 setTimeout。输出值如下

```js
执行函数 undefined
Hi! This is Hank!
sleep返回 LazyMan { name: 'Hank' }
```

### 实现方法二

```js
class _LazyMan {
    constructor(name) {
        this.taskQueue = [];
        this.name = name;
        this.timer = null;
        this.sayHi();
    }
    // 每次调用时清楚timer，上一次设置的执行taskQueue就不会运行。
    // 重新设置timer,会在下一次调用完后进入执行。
    // 当所有调用结束后，就会顺利执行taskQueue队列里的事件
    // 因为要收集好所有任务才开始执行，所以我们要用 setTimeout 构造一个异步的宏任务，确保任务的执行在同步代码后执行。
    next() {
        clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
            // 执行taskQueue队列里的事件
            for (let i = 0; i < this.taskQueue.length; i++) {
                await this.taskQueue[i]();
            }
        });
        return this;
    }
    sayHi() {
        this.taskQueue.push(() => {
            console.log('Hi! This is ' + this.name);
        });
        return this.next();
    }
    eat(str) {
        this.taskQueue.push(() => {
            console.log('Eat ' + str);
        });
        return this.next();
    }
    beforeSleep(time) {
        // unshift插入到事件的第一个
        this.taskQueue.unshift(() => this.sleepPromise(time));
        return this.next();
    }
    sleep(time) {
        this.taskQueue.push(() => this.sleepPromise(time));
        return this.next();
    }
    // sleep的Promise对象，用于给async/await来阻塞后续代码执行
    sleepPromise(time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('wake up after ' + time);
                resolve();
            }, time * 1000);
        });
    }
}

function LazyMan(name) {
    return new _LazyMan(name);
}
```

考察知识点：闭包，事件轮询机制，链式调用，队列

从题目可以看出：

1. 同步的代码调用，但是是异步的结果输出。
2. 没有结束时刻，怎么知道调用哪个函数的时候应该输出

### 思路分析

1. LazyMan(“Hank”)调用，而不是 new LazyMan(“Hank”)创建 => 工厂方法返回 new 对象
2. 链式调用实现 => 每次调用返回 this
3. sleep 需要等待 10s => setTimeout 实现 sleep
4. setTimeout 会放到事件列表中排队，继续执行后面的代码，但是题目中 sleep 需要阻塞后续操作。 => 考虑将 sleep 封装成 promise，使用 async/await 等待 sleep，实现阻塞。
5. sleepFirst 每次在最开始执行，考虑将 sleepFirst 插入到事件第一个执行。
6. 不到最后一刻，是不知道调用顺序是什么的，所以需要先是使用一个队列把时间收集起来，最后再统一执行


    因此，首先我们需要 taskQueue 记录事件列表，直到调用完成后再执行 taskQueue 里面的事件。怎么实现调用完成后才开始执行 taskQueue 的事件呢？
    答案：setTimeout 机制。setTimeout(function(){xxx},0)不是立马执行，这是因为 js 是单线程的，有一个事件队列机制，setTimeout 和 setInterval 的回调会插入到延迟时间塞入事件队列中，排队执行。

### 参考

-   [如何实现一个 LazyMan?](https://zhuanlan.zhihu.com/p/22387417)
-   [LazyMan 的 ES6 实现](https://segmentfault.com/a/1190000022958490)
-   [多种方式实现 LazyMan](https://xie.infoq.cn/article/818cefbaf4ec318dda0e8eb2a)
-   [编程题：实现一个 LazyMan 方法](https://developer.51cto.com/article/708855.html)
-   [字节跳动面试：实现一个 LazyMan 函数](https://blog.csdn.net/qq_39261142/article/details/110425286)
