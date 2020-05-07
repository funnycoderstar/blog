## 1.

```js
var b = 10;
(function b(){
    b = 20;
    console.log(b); 
})();
```
结果为:
```js
ƒ b(){
    b = 20;
    console.log(b); 
}
```

## 2. https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/7
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
setTimeout(function () {
    console.log('setTimeout');
}, 0);
async1();
new Promise(function (resolve) {
    console.log('promise1');
    resolve();
}).then(function () {
    console.log('promise2');
});
console.log('script end');
```
2.2
```js
async function async1() {
    console.log('async1 start');
    await async2();
    //更改如下：
    setTimeout(function() {
        console.log('setTimeout1')
    },0)
}
async function async2() {
    //更改如下：
    setTimeout(function() {
        console.log('setTimeout2')
    },0)
}
console.log('script start');

setTimeout(function() {
    console.log('setTimeout3');
}, 0)
async1();

new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');

/**
 * script start
 * async1 start
 * promise1
 * script end
 * promise2
 * setTimeout3
 * setTimeout2
 * setTimeout1
 */

```
## promise
```js
const promise = new Promise((resolve, reject) => {
  console.log(1)
  resolve()
  console.log(2)
})

promise.then(() => {
  console.log(3)
})

console.log(4)

 // 1243
```
Promise的构造函数是同步执行的,then方法是异步的

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve(5);
  console.log(2);
}).then(val => {
  console.log(val);
});

promise.then(() => {
  console.log(3);
});

console.log(4);

setTimeout(function() {
  console.log(6);
});
// 1, 2, 4, 5, 3, 6
```
promise new的时候会立即执行里面的代码, then是微任务, 会在本次任务执行完的时候执行, setTimeout是宏任务, 会在下次任务执行的时候执行


