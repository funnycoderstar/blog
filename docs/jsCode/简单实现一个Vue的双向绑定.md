## 下面分别用`Object.defineProperty() `和 `Proxy`实现一个简单的数据响应

### 使用`Object.defineProperty()` 实现：
```js
class Observer {
    constructor(data) {
        // 遍历参数data的属性,给添加到this上
        for(let key of Object.keys(data)) {
            if(typeof data[key] === 'object') {
                data[key] = new Observer(data[key]);
            }
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    console.log('你访问了' + key);
                    return data[key]; // 中括号法可以用变量作为属性名,而点方法不可以;
                },
                set(newVal) {
                    console.log('你设置了' + key);
                    console.log('新的' + key + '=' + newVal);
                    if(newVal === data[key]) {
                        return;
                    }
                    data[key] = newVal;
                }
            })
        }
    }
}

const obj = {
    name: 'app',
    age: '18',
    a: {
        b: 1,
        c: 2,
    },
}
const app = new Observer(obj);
app.age = 20;
console.log(app.age);
app.newPropKey = '新属性';
console.log(app.newPropKey);
```
上面代码的执行结果为
```js
// 修改 obj原有的属性 age的输出
你设置了age
新的age=20
你访问了age
20
// 设置新属性的输出
新属性
```
可以看到，给对象新增一个属性，内部并没有监听到，新增的属性需要手动再次使用`Object.defineProperty()`进行监听。
这就是为什么 `vue 2.x`中 检测不到对象属性的添加和删除的原因，内部提供的`$set`就是通过调用`Object.defineProperty()`去处理的。

### 下面我们使用  `Proxy` 替代 `Object.defineProperty()`实现
```js
const obj = {
    name: 'app',
    age: '18',
    a: {
        b: 1,
        c: 2,
    },
}
const p = new Proxy(obj, {
    get(target, propKey, receiver) {
        console.log('你访问了' + propKey);
        return Reflect.get(target, propKey, receiver);
    },
    set(target, propKey, value, receiver) {
        console.log('你设置了' + propKey);
        console.log('新的' + propKey + '=' + value);
        Reflect.set(target, propKey, value, receiver);
    }
});
p.age = '20';
console.log(p.age);
p.newPropKey = '新属性';
console.log(p.newPropKey);
```
可以看到下面输出
```js
// 修改原对象的age属性
你设置了age
新的age=20
你访问了age
20

// 设置新的属性
你设置了newPropKey
新的newPropKey=新属性
你访问了newPropKey
新属性
```
可以看到，新增的属性，并不需要重新添加响应式处理，因为 `Proxy` 是对对象的操作，只要你访问对象，就会走到 `Proxy` 的逻辑中。

> Reflect(ES6引入) 是一个内置的对象，它提供拦截 JavaScript 操作的方法。将Object对象一些明显属于语言内部方法（比如`Object.defineProperty()`）放到`Reflect`对象上。修改某些Object方法的返回结果，让其变得更合理。让Object操作都变成函数行为。具体内容查看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)