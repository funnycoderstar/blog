## 手写 call，apply，bind

### 实现一个call：
- 如果不指定this，则默认指向window
- 将函数设置为对象的属性
- 指定this到函数并传入给定参数执行函数
- 执行&删除这个函数，返回函数执行结果

```js
Function.prototype.myCall = function(thisArg = window) {
    // thisArg.fn 指向当前函数 fn (fn.myCall)
    thisArg.fn = this;
    // 第一个参数为 this，所以要取剩下的参数
    const args = [...arguments].slice(1);
    // 执行函数
    const result = thisArg.fn(...args);
    // thisArg上并不存在fn，所以需要移除
    delete thisArg.fn;
    return result;
}

function foo() {
    console.log(this.name);
}
const obj = {
    name: 'litterStar'
}
const bar = function() {
    foo.myCall(obj);
}
bar();
// litterStar
```
### 实现一个apply
过程很call类似，只是参数不同，不再赘述

```js
Function.prototype.myApply = function(thisArg = window) {
    thisArg.fn = this;
    let result;
    // 判断是否有第二个参数
    if(arguments[1]) {
        // apply方法调用的时候第二个参数是数组，所以要展开arguments[1]之后再传入函数
        result = thisArg.fn(...arguments[1]);
    } else {
        result = thisArg.fn();
    }
    delete thisArg.fn;
    return result;
}
```


### 实现一个bind

MDN上的解释：bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

```js
Function.prototype.myBind = function(thisArg) {
    // 保存当前函数的this
    const fn = this;
    // 保存原先的参数
    const args = [...arguments].slice(1);
    // 返回一个新的函数
    return function() {
        // 再次获取新的参数
        const newArgs = [...arguments];
        /**
         * 1.修改当前函数的this为thisArg
         * 2.将多次传入的参数一次性传入函数中
        */
        return fn.apply(thisArg, args.concat(newArgs))
    }
}

const obj1 = {
    name: 'litterStar',
    getName() {
        console.log(this.name)
    }
}
const obj2 = {
    name: 'luckyStar'
}

const fn = obj1.getName.myBind(obj2)
fn(); // luckyStar
```