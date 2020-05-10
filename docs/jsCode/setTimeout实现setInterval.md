### 第一种
```js
setTimeout(function () {
 console.log('我被调用了');
 setTimeout(arguments.callee, 100);
}, 100);

```

callee 是 arguments 对象的一个属性。它可以用于引用该函数的函数体内当前正在执行的函数。在严格模式下，第5版 ECMAScript (ES5) 禁止使用arguments.callee()。当一个函数必须调用自身的时候, 避免使用 arguments.callee(), 通过要么给函数表达式一个名字,要么使用一个函数声明.

### 第二种
```js
setTimeout(function fn(){
    console.log('我被调用了');
    setTimeout(fn, 100);
},100);
```