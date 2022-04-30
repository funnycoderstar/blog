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

## 参考

-   [Koa 洋葱模型原理分析](https://lq782655835.github.io/blogs/node/koa-compose-modal.html)
-   [Koa2 洋葱模型 —— compose 串联中间件的四种实现](https://segmentfault.com/a/1190000016707187)
