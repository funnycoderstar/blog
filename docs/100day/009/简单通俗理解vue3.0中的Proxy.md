## 目录
- Proxy
- Vue 2.0 使用 `Object.defineProperty()`实现数据响应
- Vue 3.0 中的`Proxy`
- Proxy的其他应用

## Proxy

什么是代理呢，可以理解为在对象之前设置一个“拦截”，当该对象被访问的时候，都必须经过这层拦截。意味着你可以在这层拦截中进行各种操作。比如你可以在这层拦截中对原对象进行处理，返回你想返回的数据结构。

ES6 原生提供 Proxy 构造函数，MDN上的解释为：Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

我们先来看看怎么使用。
```js
const p = new Proxy(target, handler);
```
- `target`： 所要拦截的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）
- `handler`：一个对象，定义要拦截的行为

```js
const p = new Proxy({}, {
    get(target, propKey) {
        return '哈哈，你被我拦截了';
    }
});

console.log(p.name);
// 哈哈，你被我拦截了
```
注意Proxy是用来操作对象的。代理的目的是为了拓展对象的能力。

再看一个例子
我们可以实现一个功能：不允许外部修改对象的name属性。
```js
const p = new Proxy({}, {
    set(target, propKey, value) {
        if (propKey === 'name') {
            throw new TypeError('name属性不允许修改');
        }
        // 不是 name 属性，直接保存
        target[propKey] = value;
    }
});
p.name = 'proxy';
// TypeError: name属性不允许修改
p.a = 111;
console.log(p.a); // 111
```
> babel是用来转换语法的，像新增的API（比如Array.from， Array.prototype.includes ）我们需要安装额外的包来进行支持，比如 [core-js/stable]() 和 [regenerator-runtime/runtime]() （PS：babel 7.x 之后@babel/polyfill已不推荐使用），然后还有一些API（String#normalize、Proxy、fetch等） `core-js`中是暂时没有提供 polyfill，具体的可查看官方文档 [core-js#missing-polyfills](https://github.com/zloirock/core-js#missing-polyfills)。

`Proxy`支持的拦截操作一共 13 种，详细的可以查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler)。

## vue2.x 是怎么实现数据的响应的呢?
递归遍历data中的数据，使用 [Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)劫持 getter和setter，在getter中做数据依赖收集处理，在setter中 监听数据的变化，并通知订阅当前数据的地方。
[部分源码 src/core/observer/index.js#L156-L193](https://github.com/vuejs/vue/blob/dev/src/core/observer/index.js#L156-L193), 版本为 2.6.11 如下
```js
let childOb = !shallow && observe(val)
 // 对 data中的数据进行深度遍历，给对象的每个属性添加响应式
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
         // 进行依赖收集
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            // 是数组则需要对每一个成员都进行依赖收集，如果数组的成员还是数组，则递归。
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      // 新的值需要重新进行observe，保证数据响应式
      childOb = !shallow && observe(newVal)
      // 将数据变化通知所有的观察者
      dep.notify()
    }
  })
```
这么做有什么问题呢？
- 检测不到对象属性的添加和删除：当你在对象上新加了一个属性`newProperty`，当前新加的这个属性并没有加入vue检测数据更新的机制(因为是在初始化之后添加的)。`vue.$set`是能让vue知道你添加了属性, 它会给你做处理，`$set`内部也是通过调用`Object.defineProperty()`去处理的
- 无法监控到数组下标的变化，导致直接通过数组的下标给数组设置值，不能实时响应。
- 当data中数据比较多且层级很深的时候，会有性能问题，因为要遍历data中所有的数据并给其设置成响应式的。

以数组为例说明（PS: 数据的实时响应是指页面的渲染内容，而不是值vm.items本身的数据）：

```js
<ul id="example">
    <li v-for="item in items">
        {{ item }}
    </li>
</ul>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
const vm = new Vue({
    el: '#example',
    data: {
        items: ['a', 'b', 'c']
    },
})
// 直接使用下标修改数据不是实时响应
setTimeout(() => {
    vm.items[1] = 'x';
    vm.items[3] = 'd';
    console.log(vm.items);
    // 此时打印结果为 ['a', 'x', 'c', 'd']，但页面内容没有更新
}, 500);
// 使用 $set 修改数据是实时响应
setTimeout(() => {
    vm.$set(vm.items, 1, 'x1')
    vm.$set(vm.items, 3, 'd1')
    console.log(vm.items);
    // 此时打印结果为 ['a', 'x1', 'c', 'd1']，页面内容更新
}, 1000);
```
可以点击直接查看代码 [codepen](https://codepen.io/funnycoderstar/pen/zYGWJbK)

## vue3.0 使用了Proxy

vue3.0还未正式发布，不过[vue-next](https://github.com/vuejs/vue-next) 的相关代码已经开源出来了，目前处于Alpha版本。

为什么使用 Proxy 可以解决上面的问题呢？主要是因为Proxy是拦截对象，对`对象`进行一个"拦截"，外界对该对象的访问，都必须先通过这层拦截。无论访问对象的什么属性，之前定义的还是新增的，它都会走到拦截中，

## 举个简单的🌰
下面分别用`Object.defineProperty() `和 `Proxy`实现一个简单的数据响应

使用`Object.defineProperty()` 实现：
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

下面我们使用  `Proxy` 替代 `Object.defineProperty()`实现
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
p.a.d = '这是obj中a的属性';
console.log(p.a.d);
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

// 给obj的a属性(是个对象)设置属性d
你访问了a
你访问了a
这是obj中a的属性
// 备注：如果对象的属性是对象，需要返回一个新的Proxy
// 稍后会补充一下, 大家也可以先自己考虑一下, 欢迎讨论
```
> PS: 补充一个使用 Proxy处理多层级对象的例子：[How to create a Deep Proxy?](https://stackoverflow.com/a/43267247)

可以看到，新增的属性，并不需要重新添加响应式处理，因为 `Proxy` 是对对象的操作，只要你访问对象，就会走到 `Proxy` 的逻辑中。

> Reflect(ES6引入) 是一个内置的对象，它提供拦截 JavaScript 操作的方法。将Object对象一些明显属于语言内部方法（比如`Object.defineProperty()`）放到`Reflect`对象上。修改某些Object方法的返回结果，让其变得更合理。让Object操作都变成函数行为。具体内容查看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)


## Proxy的其他应用
除了即将发布的 `vue 3.0` 之外，还有哪些库使用了`Proxy`呢？

- [dobjs/dob](https://github.com/dobjs/dob) 就是用 proxy 重写 mobx 的一个方案。
- [immer](https://github.com/immerjs/immer) 实现不可变数据类型。immer 的做法就是维护一份 state 在内部，劫持所有操作，内部来判断是否有变化从而最终决定如何返回，具体内容可以看一下[immer.js 简介及源码简析](https://zhuanlan.zhihu.com/p/33507866) 这篇文章。

都是使用到了对对象进行读写拦截，在读写中做一些额外的判断和操作。

## 总结
- `Proxy`是用来操作对象的，`Object.defineProperty()` 是用来操作对象的属性的。
- `vue2.x`使用 `Object.defineProperty()`实现数据的响应式，但是由于 `Object.defineProperty()`是对对象属性的操作，所以需要对对象进行深度遍历去对属性进行操作。
- `vue3.0` 用 `Proxy` 是对对象进行拦截操作，无论是对对象做什么样的操作都会走到 Proxy 的处理逻辑中
- `vue3.0`、`dobjs/dob`、`immer`等库目前都使用到了 `Proxy`，对对象进行读写拦截，做一些额外的处理。
## 参考
- [深入响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)
- [列表渲染](https://cn.vuejs.org/v2/guide/list.html#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)
- [ECMAScript 6 入门-Proxy](https://es6.ruanyifeng.com/#docs/proxy)
- [MDN-proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [面试官: 实现双向绑定Proxy比defineproperty优劣如何?](https://juejin.im/post/5acd0c8a6fb9a028da7cdfaf)
- [抱歉，学会 Proxy 真的可以为所欲为](https://zhuanlan.zhihu.com/p/35080324)
- [immer.js 简介及源码简析](https://zhuanlan.zhihu.com/p/33507866)
