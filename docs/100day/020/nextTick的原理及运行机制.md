## JS运行机制

JS执行是单线程的，它是基于事件循环的。事件循环大致分为以下几个部分：
1. 所有同步任务在主线程上执行，形成一个执行栈。
2. 主线程之外，还存在一个“任务队列”。只要异步有了运行结果。就在"任务队列"中放置一个事件。
3. 一旦"执行栈"中所有的同步任务执行完毕，系统就会读取“任务队列”，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
4. 主线程不断重复上面的第三步。

主线程的执行过程就是一个tick，而所有的异步结果都是通过 "任务队列" 来调度。消息队列中存放的是一个个 macro task 结束后，都要清空 所有的 micro task。

```js
for (macroTask of macroTaskQueue) {
    // 1. Handle current MACRO-TASK
    handleMacroTask();
      
    // 2. Handle all MICRO-TASK
    for (microTask of microTaskQueue) {
        handleMicroTask(microTask);
    }
}
```
在浏览器环境中，常见的 macro task 有setTimeout、postMessage、setImmediate； 常见的 micro task有 Promise.then和[MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)（html5新特性，会在指定的DOM发生变化时被调用）

## Vue是异步更新DOM的

vue 是异步驱动视图更新的，即当我们在事件中修改数据时，视图并不会即时的更新， 而是在等同一事件循环的所有数据变化完成后，再进行事件更新;

[vue文档中的介绍](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97): 

Vue 在更新 DOM 时是异步执行的，只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次，这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。然后，在下一个的事件循环tick中， Vue 刷新队列并执行实际(已去重)的工作。Vue 在内部尝试对异步队列使用原生Promise.then和 MutationObserver以及setImmediate, 如果执行环境不支持，会采用setTimeout(fn, 0)代替；

```html
<div id="app">
    <p ref="message">{{ message }}</p>
    <button @click="handleClick">updateMessage</button>
</div>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
    var vm = new Vue({
        el: '#app',
        data: {
            message: '未更新'
        },
        methods: {
            handleClick () {
                vm.message = '已更新';
                console.log(111, vm.$refs.message.innerText); // => 111 "未更新"
                vm.$nextTick(() => {
                    console.log(222, vm.$refs.message.innerText); // => 222 "已更新"
                })
            }
        }
    })
</script>
```
上面这个例子中，我们可以看到，更新`message`后，立刻打印DOM的内容，它并没有更新，在 `$nextTick`中执行，我们可以得到更新后的值。
这也验证了上面提到的 Vue在更新DOM时是异步更新的。

为什么需要异步更新呢，我们可以想一下，如果只要每次数据改变，视图就进行更新，会有很多不必要的渲染，比如一段时间内，你无意中修改了 message修改了很多次，其实只要最后一次修改后的值更新到DOM就可以了，假如是同步更新的，每次 message 值发生变化，那么都要触发 `setter->Dep->Watcher->update->patch` ，这个过程非常消耗性能。

## nextTick的原理及运行机制
我们可以从源码入手进行分析，基于vue 2.6.11 版本, 源码位置[src/core/util/next-tick.js](https://github.com/vuejs/vue/blob/dev/src/core/util/next-tick.js)
```js
/* @flow */
/* globals MutationObserver */

import { noop } from 'shared/util'
import { handleError } from './error'
import { isIE, isIOS, isNative } from './env'

export let isUsingMicroTask = false

const callbacks = []
let pending = false

/**
 * 对所有callback进行遍历，然后指向响应的回调函数
 * 使用 callbacks 保证了可以在同一个tick内执行多次 nextTick，不会开启多个异步任务，而把这些异步任务都压成一个同步任务，在下一个 tick 执行完毕。
*/

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).

let timerFunc

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
/**
* timerFunc 实现的就是根据当前环境判断使用哪种方式实现
* 就是按照 Promise.then和 MutationObserver以及setImmediate的优先级来判断，支持哪个就用哪个，如果执行环境不支持，会采用setTimeout(fn, 0)代替；
*/

// 判断是否支持原生 Promise
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
  // 不支持 Promise的话，再判断是否原生支持 MutationObserver
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  // 新建一个 textNode的DOM对象，使用 MutationObserver 绑定该DOM并传入回调函数，在DOM发生变化的时候会触发回调，该回调会进入主线程（比任务队列优先执行）
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    // 此时便会触发回调
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
  // 不支持的 MutationObserver 的话，再去判断是否原生支持 setImmediate
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // Promise，MutationObserver, setImmediate 都不支持的话，最后使用 setTimeout(fun, 0)
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

// 还函数的作用就是延迟 cb 到当前调用栈执行完成之后执行
export function nextTick (cb?: Function, ctx?: Object) {
  // 传入的回调函数会在callbacks中存起来
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  // pending是一个状态标记，保证timerFunc在下一个tick之前只执行一次
  if (!pending) {
    pending = true
    /**
    * timerFunc 实现的就是根据当前环境判断使用哪种方式实现
    * 就是按照 Promise.then和 MutationObserver以及setImmediate的优先级来判断，支持哪个就用哪个，如果执行环境不支持，会采用setTimeout(fn, 0)代替；
    */
    timerFunc()
  }
  // 当nextTick不传参数的时候，提供一个Promise化的调用
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```
大致说一下整个过程

1. nextTick接受一个回调函数时（当不传参数的时候，提供一个Promise化的调用），传入的回调函数会在callbacks中存起来，根据一个状态标记 pending 来判断当前是否要执行 timerFunc()

2. timerFunc() 是根据当前环境判断使用哪种方式实现，按照 Promise.then和 MutationObserver以及setImmediate的优先级来判断，支持哪个就用哪个，如果执行环境不支持，会采用setTimeout(fn, 0)代替

3. timerFunc() 函数中会执行 flushCallbacks函数，flushCallbacks函数的作用就是对所有callback进行遍历，然后指向响应的回调函数

## 总结
Vue是异步更新DOM的，在平常的开发过程中，我们可能会需要基于更新后的 DOM 状态来做点什么，比如后端接口数据发生了变化，某些方法是依赖于更新后的DOM变化，这时我们就可以使用 Vue.nextTick(callback)方法。


## 重要参考
- [vue文档-异步更新队列](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97)
- [Vue.js 技术揭秘之nextTick](https://ustbhuangyi.github.io/vue-analysis/v2/reactive/next-tick.html#vue-%E7%9A%84%E5%AE%9E%E7%8E%B0)
- [Vue.js异步更新DOM策略及nextTick.](https://github.com/answershuto/learnVue/blob/master/docs/Vue.js%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0DOM%E7%AD%96%E7%95%A5%E5%8F%8AnextTick.MarkDown)
- [Vue 中如何使用 MutationObserver 做批量处理？](https://www.zhihu.com/question/55364497/answer/144215284)
- [Vue nextTick 机制](https://juejin.im/post/5ae3f0956fb9a07ac90cf43e)
- [JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)