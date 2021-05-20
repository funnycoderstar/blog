## 理解一些基础概念

原型链，类，实例， 类属性，类方法， 实例属性，实例方法

```js
class A {
    static b = '1';
    static classMethod() {
        return 'hello';
    }
}
const a = new A();
a.c = 5;
a.sayHello = function() {
    console.log('welcome');
};
```

A: 类
b: 类属性
classMethod: 类方法
a: 实例
a.c: 实例属性

### ES6 的类

static：静态属性指的是 Class 本身的属性，即 Class.propName，而不是定义在实例对象（this）上的属性。

## 实现一个 promise

### Promise 简介

要想自己实现一个 Promise，我们首先要对 Promise 的用法有所了解；

Promise 是一个构造函数，用来生成 Promise 实例，接受**一个函数**作为参数，这个函数有两个参数 resolve 和 reject，是两个函数。resolve 是异步操作成功时调用，并将异步操作的结果作为参数传递出去。reject 是异步操作失败时调用，并将异步操作报出的错误作为参数传递出去。

静态属性或方法：是存在类上的属性或方法，实例上无法访问，只用通过 Promise.xxx 访问

要实现 xxx，首先要明白这个函数是干什么的，那又从那个方面来分析么呢？

-   接收哪些参数
-   返回什么参数
-   如果 xxx，怎么处理

### Promise 的静态方法

-   Promise.resolve()
-   Promise.reject()

#### Promise.resolve()

-   参数：分为以下两种情况
    -   Promise 实例, 直接返回
    -   原始值，或者是一个不具有 then 方法的对象，返回一个新的 Promise 示例，状态为 resolved。
-   返回值：一个新的 Promise 实例

#### Promise.reject()

-   参数：分为以下两种情况
    -   Promise 实例, 直接返回
    -   原始值，或者是一个不具有 then 方法的对象，返回一个新的 Promise 示例，状态为 rejected。
-   返回值：一个新的 Promise 实例

以下方法都是接受数组作为参数，数组中的某项如果不是 Promise 实例，会先调用 Promise.resolve 方法，将参数转为 Promise 实例，再做处理

-   Promise.all()
-   Promise.race()
-   Promise.allSettled()
-   Promise.any()

#### Promise.all()

-   参数：数组，数组中的某项如果不是 Promise 实例，会先调用 Promise.resolve 方法，将参数转为 Promise 实例，再做处理
-   返回值：
    -   数组：都成功时，返回数组
    -   一个 promise 实例：只要有一个失败，返回值为第一个被 reject 的实例的返回值

#### Promise.race()

-   参数：数组，数组中的某项如果不是 Promise 实例，会先调用 Promise.resolve 方法，将参数转为 Promise 实例，再做处理
-   返回值：
    -   一个 promise 实例：返回那个率先改变的 Promise 实例的返回值

#### Promise.allSettled()

-   接收一组 Promise 实例作为参数，只有等到所有的参数实例都返回结果才会返回
-   场景：不关心异步操作的结果，只关心是否都结束了。比如多张图片选择后一起上传时，需要判断多张图片上传的结果，成功了几张，失败了几张

-   参数：数组，数组中的某项如果不是 Promise 实例，会先调用 Promise.resolve 方法，将参数转为 Promise 实例，再做处理
-   返回值：

    -   返回值：数组，数组的每一项都是一个对象具体的结构如下

    ```js
    [
        {
            status: 'fulfilled',
            value: 1,
        },
        {
            status: 'rejected',
            reason: 1,
        },
    ];
    ```

#### Promise.any()

接收一组 Promise 实例作为参数，只要有一个成功就返回成功的结果，如果所有结果都是失败的，就返回所有失败的结果

-   参数：**数组**，数组中的某项如果不是 Promise 实例，会先调用 Promise.resolve 方法，将参数转为 Promise 实例，再做处理
-   返回值：
    -   **一个 promise 实例**：只要有一个成功时返回一个 promise 实例的结果
    -   **数组**：所有都失败时，返回数组

### 代码实现

```js
class Promise {
    constructor(fn) {
        /**
         *  三种状态
         *  pending：进行中
         *  fulfilled：已成功
         *  rejected: 已失败
         */
        this.status = 'pending';
        this.resoveList = []; // 成功后回调函数
        this.rejectList = []; // 失败后的回调函数

        fn(this.resolve.bind(this), this.reject.bind(this));
    }
    then(scb, fcb) {
        if (scb) {
            this.resoveList.push(scb);
        }
        if (fcb) {
            this.rejectList.push(fcb);
        }
        return this;
    }
    catch(cb) {
        if (cb) {
            this.rejectList.push(cb);
        }
        return this;
    }
    resolve(data) {
        if (this.status !== 'pending') return;
        this.status = 'fulfilled';
        setTimeout(() => {
            this.resoveList.forEach((s) => {
                data = s(data);
            });
        });
    }
    reject(err) {
        if (this.status !== 'pending') return;
        this.status = 'rejected';
        setTimeout(() => {
            this.rejectList.forEach((f) => {
                err = f(err);
            });
        });
    }
    /**
     * 实现Promise.resolve
     * 1.参数是一个 Promise 实例, 那么Promise.resolve将不做任何修改、原封不动地返回这个实例。
     * 2.如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。
     */

    static resolve(data) {
        if (data instanceof Promise) {
            return data;
        } else {
            return new Promise((resolve, reject) => {
                resolve(data);
            });
        }
    }
    // 实现Promise.reject
    static reject(err) {
        if (err instanceof Promise) {
            return err;
        } else {
            return new Promise((resolve, reject) => {
                reject(err);
            });
        }
    }
    /**
     * 实现Promise.all
     * 1. Promise.all方法接受一个数组作为参数，p1、p2、p3都是 Promise 实例，如果不是，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。
     * 2. 返回值组成一个数组
     */
    static all(promises) {
        return new Promise((resolve, reject) => {
            let promiseCount = 0;
            let promisesLength = promises.length;
            let result = [];
            for (let i = 0; i < promises.length; i++) {
                // promises[i]可能不是Promise类型，可能不存在then方法，中间如果出错,直接返回错误
                Promise.resolve(promises[i]).then(
                    (res) => {
                        promiseCount++;
                        // 注意这是赋值应该用下标去赋值而不是用push，因为毕竟是异步的，哪个promise先完成还不一定
                        result[i] = res;
                        if (promiseCount === promisesLength) {
                            return resolve(result);
                        }
                    },
                    (err) => {
                        return reject(err);
                    }
                );
            }
        });
    }
    /**
     * 实现Promise.race
     * 1. Promise.race方法的参数与Promise.all方法一样，如果不是 Promise 实例，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。
     * 2. 返回那个率先改变的 Promise 实例的返回值
     */
    static race(promises) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then(
                    (res) => {
                        return resolve(res);
                    },
                    (err) => {
                        return reject(err);
                    }
                );
            }
        });
    }
    /**
    * Promise.any()
    * - 参数：数组，数组中的某项如果不是Promise实例，会先调用Promise.resolve方法，将参数转为 Promise实例，再做处理
      - 返回值：
        - 一个promise实例：只要有一个成功时返回一个 promise 实例的结果
        - 数组：所有都失败时，返回数组
    */
    static any(promises) {
        return new Promise((resolve, reject) => {
            const promisesLen = promises.length;
            let promiseCount = 0;
            let errorResult = [];
            for (let i = 0; i < promisesLen; i++) {
                Promise.resolve(promises[i]).then(
                    (value) => {
                        return resolve(value);
                    },
                    (err) => {
                        promiseCount++;
                        errorResult[i] = err;
                        if (promiseCount === promisesLen) {
                            return reject(errorResult);
                        }
                    }
                );
            }
        });
    }
    /**
     * Promise.allSettled()
     * - 参数：数组，数组中的某项如果不是Promise实例，会先调用Promise.resolve方法，将参数转为 Promise实例，再做处理
     * - 返回值：数组
     */
    static allSettled(promises) {
        return new Promise((resolve, reject) => {
            const promisesLen = promises.length;
            let promiseCount = 0;
            const result = [];
            for (let i = 0; i < promisesLen; i++) {
                Promise.resolve(promises[i]).then(
                    (value) => {
                        promiseCount++;
                        result[i] = {
                            status: 'fulfilled',
                            value,
                        };
                        if (promiseCount === promisesLen) {
                            return resolve(result);
                        }
                    },
                    (err) => {
                        promiseCount++;
                        result[i] = {
                            status: 'rejected',
                            reason: err,
                        };
                        if (promiseCount === promisesLen) {
                            return resolve(result);
                        }
                    }
                );
            }
        });
    }
}
```

### 测试用例

#### 1. Promise.then

```js
const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('resolve');
        resolve(222);
    }, 1000);
});

p.then((data) => {
    setTimeout(() => {
        console.log('data', data);
    });
    return 3333;
})
    .then((data2) => {
        console.log('data2', data2);
    })
    .catch((err) => {
        console.error('err', err);
    });
```

#### 2. Promise.reject

```js
const p1 = Promise.reject('出错了');
p1.then(null, function(s) {
    console.log(s); // 出错了
});
```

#### 3. Promise.all && Promise.race && Promise.any && Promise.allSettled

```js
const q1 = new Promise((resolve, reject) => {
    resolve('hello');
});

const q2 = new Promise((resolve, reject) => {
    reject('world');
});

Promise.all([q1, q2]).then(
    (res) => {
        console.log(res);
    },
    (err) => {
        console.log(err); // world
    }
);

Promise.race([q1, q2]).then((res) => {
    console.log(res); // hello
});

Promise.any([q1, q2]).then((res) => {
    console.log(res); // hello
});

Promise.allSettled([q1, q2]).then((res) => {
    console.log(res);
    /**
      [
        { status: 'fulfilled', value: 'hello' },
        { status: 'rejected', reason: 'world' }
        ]
    */
});
```
