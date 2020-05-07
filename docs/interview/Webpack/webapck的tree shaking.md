
# ES6模块的语法
## 下面比较一下默认输出和正常输出

默认输出：export default & import

```js
// a.js
function a1() {
    console.log('a1');
}

function a2() {
    console.log('a2');
}

export default {
    a1,
    a2,
}

// 引用a.js的地方
import apiA from './a.js'; // 其他模块加载该模块时，import命令可以为该匿名函数指定任意名字。

apiA.a1();
```
正常输出： export & import
```js
// a.js
export function a1() {
    console.log('a1');
}
export function a2() {
    console.log('a2');
}

// 引用a.js文件的地方
import { a1 } from 'a.js';
a1();
```

上面代码的两组写法：
- 第一组使用`export default`时，对应的`import`语句不需要使用大括号
- 第二组不使用`export default`时，对应的`import`语句需要使用大括号

export default命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此export default命令

## webpack的tree shaking

移除JavaScript上下文中未引用的代码（dead-code）,依赖ES6的模板语法，import export， 比如一个引用了一个文件index.js import { a } from index.js, index.js中有两个函数 a, b, 只用到了a，则只打包index.js中的函数a；

上面两组写法中，第一组默认输出，是不能做到tree shaking
第二组的正常输出是可以做tree shaking

我们来看一个实际的例子
```js
// a.js
function a1() {
    console.log('a1');
}

function a2() {
    console.log('a2');
}

export default {
    a1,
    a2,
}

// b.js
export function b1() {
    console.log('b1');
}
export function b2() {
    console.log('b2');
}
```
```js
// main.js
import apiA from './a.js';
import { b1 } from './b.js';
apiA.a1();
b1();
```
我们先来分析一下，如果上述我们说的是正确的，那么 引用 a.js, 其实我们只用到了 a.js中的函数 a1，没用到 a2，如果可以做tree shaking的话，打包完之后应该只有a1, 没有a2, b.js中只用到了函数b1， 没有用到函数b2，如果可以做tree shaking的话，打包完之后应该只有b1, 没有b2。

```js

const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, '../src/main.js'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'my-first-webpack.bundle.js'
    },
    mode: 'production',
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                }
            }
        }, ]
    },
}

```

```js
// 打包完之后的文件
! function(e) {
    var t = {};

    function n(r) {
        if (t[r]) return t[r].exports;
        var o = t[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    n.m = e, n.c = t, n.d = function(e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: r
        })
    }, n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function(e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (n.r(r), Object.defineProperty(r, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var o in e) n.d(r, o, function(t) {
                return e[t]
            }.bind(null, o));
        return r
    }, n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 0)
}([function(e, t, n) {
    "use strict";
    n.r(t), {
        a1: function() {
            console.log("a1")
        },
        a2: function() {
            console.log("a2")
        }
    }.a1(), console.log("b1")
}]);

```
我们主要关注最后的这几行代码，可以看到, 使用默认输出（export default & import）的 a.js文件中，函数a1和函数a2都被打包进去了，使用正常输出（export & import）的b.js文件中，只有用到的函数b1被打包进去了。

为什么默认输出不能做tree shaking呢，是因为js无法做静态语法分析，比如 动态调用，比如对象的中括号语法，属性可以是任意对象，无法准确识别。

## 其他
只有在webapck4.x的“production”模式才有tree shaking，具体原因引用文档：
> 运行 tree shaking 需要 [ModuleConcatenationPlugin](https://webpack.docschina.org/plugins/module-concatenation-plugin)。通过 mode: "production" 可以添加此插件。如果你没有使用 mode 设置，记得手动添加 ModuleConcatenationPlugin。




