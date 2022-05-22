## koa 的洋葱模型

```js
app.use((next) => {
    console.log(1);
    next();
    console.log(4);
});
app.use((next) => {
    console.log(2);
    next();
    console.log(5);
});
app.use((next) => {
    console.log(3);
    next();
    console.log(6);
});
app.compose();
// 输出是123654;
```

当程序运行到 next()的时候就会暂停当前程序，进入下一个中间件，处理完之后才会回过头来继续处理。

核心：中间件管理和 next 实现，其中 next 是巧妙的使用了 Promise 特性。洋葱模型，本质上是 Promise.resolve()的递归。

实现一

```js
function compose(middleware) {
    return function(context, next) {
        // last called middleware #
        let index = -1;
        return dispatch(0);

        function dispatch(i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'));
            index = i;
            let fn = middleware[i];
            if (i === middleware.length) fn = next;
            if (!fn) return Promise.resolve();
            try {
                // 核心代码：返回Promise
                // next时，交给下一个dispatch（下一个中间件方法）
                // 同时，当前同步代码挂起，直到中间件全部完成后继续
                return Promise.resolve(
                    fn(context, function next() {
                        return dispatch(i + 1);
                    })
                );
            } catch (err) {
                return Promise.reject(err);
            }
        }
    };
}
```

实现二

```js
// 文件：app.js
app.compose = function() {
    // 自执行 async 函数返回 Promise
    return (async function() {
        // 定义默认的 next，最后一个中间件内执行的 next
        let next = async () => Promise.resolve();

        // middleware 为每一个中间件函数，oldNext 为每个中间件函数中的 next
        // 函数返回一个 async 作为新的 next，async 执行返回 Promise，解决异步问题
        function createNext(middleware, oldNext) {
            return async () => {
                await middleware(oldNext);
            };
        }

        // 反向遍历中间件数组，先把 next 传给最后一个中间件函数
        // 将新的中间件函数存入 next 变量
        // 调用下一个中间件函数，将新生成的 next 传入
        for (let i = app.middlewares.length - 1; i >= 0; i--) {
            next = createNext(app.middlewares[i], next);
        }

        await next();
    })();
};
```

## 实现三

```js
const app = {
    _middlewares: [],
    use(fn) {
        this._middlewares.push(fn);
    },
    compose() {
        let dispatch = (index) => {
            console.log('index', index, this._middlewares);
            if (index === this._middlewares.length) {
                return Promise.resolve();
            }
            const middle = this._middlewares[index];
            return Promise.resolve(middle(() => dispatch(index + 1)));
        };
        dispatch(0);
    },
    run() {
        this.compose();
    },
};
app.use((next) => {
    console.log(1);
    next();
    console.log(2);
});
app.use((next) => {
    console.log(3);
    next();
    console.log(4);
});

app.run();
```

`compose`函数 中将 `() => dispatch(index + 1)` 作为 函数的参数 next 函数传进入

## 参考

-   [Koa 洋葱模型原理分析](https://lq782655835.github.io/blogs/node/koa-compose-modal.html)
-   [Koa2 洋葱模型 —— compose 串联中间件的四种实现](https://segmentfault.com/a/1190000016707187)
