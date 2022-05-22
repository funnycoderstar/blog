## compose 函数

将嵌套执行的函数平铺，嵌套执行就是一个函数的返回值作为另一个函数的返回值。
函数式编程：将复杂的几个步骤拆成几个简单的可复用的简单步骤。

```js
// 参数从右往左执行，所以multiply在前，add在后
let res = compose(multiply, add)(10);
```

-   Array.prototype.reduce(), 接受两个参数，一个是累加器函数，一个是初始值，累加器函数有四个参数，第一个是上一次计算的结果，第二个是当前值，第三个是当前 index，第四个是当前迭代的数组。是从左向右迭代。
-   Array.prototype.reduceRight：从右往左迭代

利用 reduceRight 函数实现

```js
const compose = function() {
    const args = [].slice.apply(arguments);
    return function(x) {
        return args.reduceRight((res, cb) => cb(res), x);
    };
};
const add = (x) => x + 10;
const multiply = (x) => x * 10;
const calculate = compose(multiply, add);

const res = calculate(10);
console.log(res);
```

使用 ES6 语法

```js
const compose = (...args) => (x) => args.reduceRight((res, cb) => cb(res), x);
```

redux 的中间件就是用 compose 函数实现的，webpack 中 loader 的顺序也是从右向左的，这是因为它也是 compose 函数实现的。

## pipe 函数

跟 compose 函数的作用是一样的，也是将参数平铺，只不过它的顺序是从左往右。只要把 compose 实现使用的 reduceRight 改为 reduce 即可

```js
const pipe = function() {
    const args = [].slice.apply(arguments);
    return function(x) {
        return args.reduce((res, cb) => cb(res), x);
    };
};

// 参数顺序改为从左往右
let calculate = pipe(add, multiply);
let res = calculate(10);
console.log(res); // 结果还是200
```

```js
const pipe = (...args) => (x) => args.reduce((res, cb) => cb(res), x);
```

## 参考

-   [compose 函数和 pipe 函数](http://dennisgo.cn/Articles/JavaScript/ComposePipe.html)
