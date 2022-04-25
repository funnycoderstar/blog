## 轮播图核心

假设一共 4 张图

-   图片移动
-   无缝轮播: 开头多放一张（最后一张图），末尾多放一张（第一张图），第 4 张轮播完，下一张就切换到了第一张图片，即末尾放的一张，切换完毕，再趁机切换到 4 张图片的第一张图片，这次是无过渡效果的。这样图片又从第一张图片开始。这就像魔术一样，只要够快，完全能够掩人耳目，骗过观众智慧的双眼，而这完全可以实现。
    （在轮播图的前面和后面放置“跳板图片”，供我们跳转到正确的图片使用）
    https://segmentfault.com/a/1190000039947732

## immer 原理

解决的问题

1. react setState 要求每次返回新的 state，如果碰到嵌套很深的数据，但是只修改其中一个值时，就需要使用...运算符，写起来很麻烦
2. 使用深拷贝可以解决上面但是，但是又引入了新的问题，1 性能问题，2.导致不需要修改的值进行了不必要的拷贝，比如这个值是个对象，则深拷贝之后是两个完全不一样的对象（内存地址发生了变化），就会重新渲染
3. immer 可以解决上述提到的问题

[immer 原理解析](https://juejin.cn/post/6926099651510665230#heading-6)
[immer](http://www.ayqy.net/blog/immer/)

-   copy on write：写入时复制。
-   proxy：通过`var proxyObj = new Proxy(target, handler);`生成 target 的代理对象 proxyObj，对代理对象 proxyObj 进行操作时，会进入到 handler 的 get 和 set 等方法中，从而实现对对象的劫持。

需要我们自己之前处理的代码逻辑，通过 proxy 封装实现了。
看完感觉跟 vue3.x 中使用 proxy 的实现真的好像呀：https://juejin.cn/post/6844904088119853063#heading-5

```js
const state = {
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets',
    },
};

const copy = { ...state };
copy.website = 'www.google.com';

console.log(copy.company === state.company); // true
```

```js
const state = {
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets',
    },
};

let copy = {};
const handler = {
    set(target, prop, value) {
        copy = { ...target }; // 浅拷贝
        copy[prop] = value; // 给拷贝对象赋值
    },
};

const proxy = new Proxy(state, handler);
proxy.website = 'www.google.com';

console.log(copy.website); // 'www.google.com'
console.log(copy.company === state.company); // true
```

在写操作的时候（set）进行浅拷贝，然后写入属性，这个时候，copy 与原来的对象共享了除写属性之前的属性

实现一个 tiny-immer

```js
function immer(state, thunk) {
    let copy = {};
    const handler = {
        set(target, prop, value) {
            copy = { ...target }; // 浅拷贝
            copy[prop] = value; // 给拷贝对象赋值
        },
    };

    const proxy = new Proxy(state, handler);
    thunk(proxy);
    return copy;
}

const state = {
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets',
    },
};

const copy = immer(state, (draft) => {
    draft.website = 'www.google.com';
});

console.log(copy.website); // 'www.google.com'
console.log(copy.company === state.company); // true
```

## JS 沙箱(沙盒)

为什么需要，哪些场景需要

1. 微前端需要，不然多个应用共享一些全局变量，很容易冲突
2. 在线编辑器，在这里面的操作不能影响到其他的，而且这个里面的一些操作很容易有问题

浏览器的每个 tab 都运行在一个单独的沙箱中

需要补充的知识和概念理解

-   虚拟机，docker,
-   iframe
-   webComponent
-   单实例，多实例
-   快照沙箱(snapshotSandbox)
-   proxy(proxySandBox)
-   with, eval, new Function

### iframe 沙箱

### proxy 沙箱

qiankun 里面用到的：

1. 快照沙箱：在应用沙箱挂载或卸载时记录快照，在切换时依据快照恢复环境（无法支持多实例）
2. proxy 代理沙箱可以实现多应用沙箱，把不同的应用用不同的代理来处理

自己实现一个快照沙箱：1 年前拍一张，再拍一张，将区别保存起来，再回到一年前，多个子应用就不能使用这种方式了，可以使用 ES6 的 proxy

```js
class SnapshotSandbox {
    constructor() {
        this.proxy = window;
        this.sandboxSnapshot = {}; // 记录在沙箱上的所有属性快照
        this.windowSnapshot = {}; // 存储window上的所有属性快照
        this.active();
    }
    // 激活沙箱，在沙箱里进行操作
    active() {
        for (const prop in window) {
            if (window.hasOwnProperty(prop)) {
                // 激活时，先把window上的属性保存在 windowSnapshot
                this.windowSnapshot[prop] = window[prop];
            }
        }
        // 再把沙箱之前的属性重新赋值给 window
        Object.keys(this.sandboxSnapshot).forEach((p) => {
            window[p] = this.sandboxSnapshot[p];
        });
    }
    //失活
    inActive() {
        for (const prop in window) {
            if (window.hasOwnProperty(prop)) {
                // 比较现在的window 和之前的 window对比有啥区别
                if (window[prop] !== this.windowSnapshot[prop]) {
                    // 如果不一样，就说明有变化，需要保存变化
                    // 把沙箱的属性保存在sandboxSnapshot
                    this.sandboxSnapshot[prop] = window[prop];
                    // 需要将window上之间的属性 windowSnapshot 再赋值给window
                    window[prop] = this.windowSnapshot[prop];
                }
            }
        }
    }
}

let sandBox = new SnapshotSandbox();
// 应用的运行从开始到结束，切换后不会影响全局
((window) => {
    window.a = 1;
    window.b = 2;
    console.log(window.a, window.b); // 1, 2
    // 失活
    sandBox.inActive();
    console.log(window.a, window.b); // undefined undefined
    // 激活还原
    sandBox.active();
    console.log(window.a, window.b); // 1, 2
})(sandBox.proxy); // sandBox.proxy就是window
```

window 环境和沙箱环境，其实都是在 window 上进行操作，所以刚开始的时候有点分不清，其实就是要理解沙箱环境和 window 环境。在这两个环境来回切换的时候，需要对应环境原来的改动找回来，就需要两个变量来存储，一个 windowSnapshot 来存储 window 上的属性，一个 sandboxSnapshot 来存储沙箱上的属性

-   从 window 切换到沙箱环境的时候（激活沙箱），需要把 window 上当前的属性保存到一个地方，windowSnapshot 就是用来保存 window 上的属性的，然后之后再把原来沙箱上的属性再还原回来（即把沙箱上之前的属性 sandboxSnapshot 再赋值到 window 上）
-   从沙箱环境切换到 window 的时候（失活沙箱），需要把沙箱的改动保存到一个地方，sandboxSnapshot 就会用来保存沙箱上的属性的，然后之后再把原来 window 上的属性还原回来（即把 window 上之前的属性 windowSnapshot 再赋值到 window 上）

```js
```

## redux 中间件

解决异步操作的问题，因为触发 action, reducer 立即计算出 State，叫做同步。触发 action，过一段再执行 reducer，这就是异步。
reducer 在异步操作后自动执行，需要用到中间件。

中间件：是一个函数，对 store.dispatch 方法进行改造，在发出 action 和执行 reducer 这两步中间，添加了其他功能。

使用，放在 redux 提供的 applyMiddleware 方法中，要注意次序，有的中间件有要求

applyMiddleware 方法将所有中间件组成一个数组，依次执行。

如果解决异步操作问题?
触发三种 action，开始，成功，失败
至少发出两个

-   开始 action
-   结束 action(成功或失败)

### redux-thunk 中间件

### redux-saga 中间件

## react hooks

**做笔记：只记录日后用于提取记忆的关键词，而且记录的这些词语要不断反复地来回琢磨思考**

类组件和函数组件

### 类组件：是面向对象编程

-   封装：将一类属性和方法，”聚拢“到一个 class 中。
-   继承：新的 class 可以通过继承现有的 class，实现对某一类属性和方法的复用
    特点：
-   React class 组件内置了很多”现成的东西“，比如 state，生命周期，只要你继承 React.Component 就可以直接使用这些。提供足够多东西，多就是好么，其实未必。
-   React 类组件提供了多少东西，你就要学习多少东西，大而全的背后是学习成本。
-   复杂逻辑难以拆分复用，逻辑封装和组件是在一起的，要想拆分复用，需要使用高阶组件，Render Props 等更加复杂的设计模式

### 函数组件

特点：

-   轻量，灵活，易于组织和维护，学习成本低。
-   函数组件最大的不同：会捕获 render 内部的状态。利用的是 JS 闭包机制。

但是这两个的区别其实是心智模型的层面的差异，是面向对象和函数式编程这两个不同设计思想之间的差异。

声明式和命令式？

-   声明式：只管结果，不管怎么做
-   命令式：需要关心每步怎么实现

React 贯穿了声明式变成思想

> [从年会看声明式编程(Declarative Programming)](https://zhuanlan.zhihu.com/p/26085755)

## React 虚拟 DOM

是什么：

-   是 JS 对象
-   是对真实 DOM 的描述

React 组件的挂载阶段：根据 JSX 构建虚拟 DOM, ReactDOM.render 实现虚拟 DOM 到真实 DOM 的映射
React 组件的挂载阶段：页面变化，体现在虚拟 DOM 上，然后变化前后的虚拟 DOM 对比，将变化的部分作用于真实的 DOM。

虚拟 DOM 在 react 的工作流中起的作用？

-   初始化时，执行 render，构建虚拟 DOM， ReactDOM.render 将虚拟 DOM 渲染为真实 DOM。
-   更新时，执行 render，构建虚拟 DOM，通过 diff 算法得出更新前后的差异，ReactDOM.render 将计算得到的差异的虚拟 DOM 渲染为真实 DOM。

虚拟 DOM 解决了什么问题

-   研发体验/研发效率
-   跨平台

关键词：batch, diff, patch，批量更新，差量更新

## diff 算法

    基于经典的 Diff 算法，做出了 3 个策略（舍弃部分场景），将时间复杂度从 O(n^3)减小到 O(n)。
    1. tree diff, 分层对比
    2. element diff, 同类型的才做 diff，不同类型的话直接按照新建删除处理
    3. 节点 diff, 通过 key 来判断，如果 key 相同就不重新渲染

## React Stack Reconciler（栈调和）

调和过程和 diff 算法：
调和：使一致，通过 ReactDOM 等类库使虚拟 DOM 与”真实的“DOM 同步。即将虚拟 DOM 映射到真实 DOM 的过程。
diff 是”使一致“过程中的一个环节。

关键词：diff

## react setState

isBatchingUpdates 变量，是一个全局变量，表示是否要批量更新
isBatchingUpdates 变量，react 生命周期和合成事件执行前，修改为 true，然后我们执行的一些操作不会理解生效。函数执行完毕后，事务的 close 方法，再修改为 false。

setState 不是单纯的同步/异步，在不同的调用场景下表现不同

-   react 钩子函数和合成事件中，表现为异步
-   setTimeout，setInterval 函数中，DOM 原生事件，表现为同步
    本质是 React 事务机制和批量更新机制的工作方式来决定的

React 事务机制? 批量更新机制?

## react fiber

单线程 JS 和多线程浏览器

JS 线程和渲染线程是互斥的。
具有相似特征的事件线程。浏览器的 Event-Loop 机制。

JS 线程长时间占用主线程，渲染线程更新需要等待，意味着界面不更新，用户感觉卡顿。会不停点击，事件线程也在等待 JS，所以点击无法响应。

Stack Reconciler 是一个同步的递归过程。会对主线程超时占用。

fiber 会是同步渲染过程变成异步。
fiber 之前，React 会构建虚拟 DOM，通过与上次虚拟 DOM 进行 diff，实现 DOM 的差量更新。这个过程是递归的。同步渲染的递归调用栈很深，渲染一旦开始，只能等着结束。会占用主线程。
fiber 将一个更新的大任务拆解为许多小任务。每执行完一个小任务，渲染进程会把主线程交出去，看看有没有优先级更高的任务要执行。这就是所谓的异步渲染

关键词：同步渲染，fiber 异步渲染，任务拆解,可打断

## react 生命周期 16.x 版本之前和之后的对比

虚拟 DOM:

组件化的开放，封闭
封闭：如果组件间未通信，则从数据改变到组件更新都是组件内部的行为
开发：如果组件间通信，则通信数据的改变会影响到通信双方的组件或者一方的组件。

render 是 react 的灵魂，注意区分这里的 render 和 ReactDOM.render 方法
一个 react 组件中，生命周期可以省略，但是 render 方法不能省，还有生命周期的渲染最终都是作用 render。

初始化挂载: contrutor, componentWillMount render componentDidMount
更新阶段：componentWillReciveProps, shouldComponentUpdate, componentWillUpdate, render componentDidMount。

render()是将要渲染的内容返回，最终渲染到真实 DOM 上，是通过 ReactDOM.render 方法。

挂载，更新，卸载，三个阶段来看。
react 16 之后的
挂载：contructor -> getDerivedStateFromProps -> render -> componentDidMounnt

getDerivedStateFromProps: 使用 props 派生/更新 state

-   静态方法，this 指的是类，而不是实例，所以内部调用 this.props 会报错
-   两个参数，来自父组件的 props，和自己本身的 state
-   返回值，一个对象。React 用这个返回值来更新 state。非覆盖式更新，只针对一个具体的属性

确保在这个函数里只做一件事，完成 props 到 state 的映射，确保行为可控可预测，避免不合理的开发方式。

更新阶段：getDerivedStateFromProps -> render -> getSnapshotBeforeUpdate -> componnentDidUpdate

getSnapshotBeforeUpdate，触发时机,render 之后，真实 DOM 更新之前。意味着可以同时获得更新前的真实 DOM 和更新前后的 state&props 信息
getSnapshotBeforeUpdate 和 componnentDidUpdate 通信的过程。getSnapshotBeforeUpdate 的返回值会作为 componnentDidUpdate 的第三个参数,

-   componentDidUpdate(prevProps, prevState, valueFromSnapshot)
    getSnapshotBeforeUpdate 要想发挥作用，离不开 componentDidUpdate 的配合

总结：为什么 React16 要修改生命周期呢，因为它们挡了 fiber 的路

### 从 fiber 角度看 React 生命周期工作流

Fiber 架构的重要特征就是可以被打断的异步渲染模式。根据“能否被打断”，生命周期被分为 render 和 commit 两个阶段。而 commit 阶段又被细分为了 pre-commit 和 commit。

-   render 阶段：没有副作用，可以被 React 暂停，终止或重新启动
-   pre-commit 阶段：可以读取 DOM
-   commit 阶段：可以使用 DOM，运行副作用，安排更新。

render 阶段是允许暂停、终止和重启的。任务被打断后，再次启动执行时，会从头开始执行。所以在 Render 阶段的生命周期可能会被重复执行。
废弃的以下生命周期都有可能重复执行，但是这些 API 经常被滥用，在重复执行中会存在很多问题。

-   componentWillMount；
-   componentWillUpdate；
-   componentWillReceiveProps

这些操作的问题（或不必要性）包括但不限于以下 3 点：

1. 完全可以转移到其他生命周期，尤其是 componentDidxxx
   比如在 componentWillMount 中发起异步请求，以为可以早点渲染，但是 React15 的同步的生命周期执行很快的，componentWillMount 结束后，render 会迅速地被触发，首次渲染依然会在数据返回之前执行
2. 在 fiber 的机制下，会带来很多 bug
   比如一个付款接口调用了多次，
3. 即使没有开启异步，一些骚操作也会带来很多问题
   componentWillReceiveProps   和 componentWillUpdate 里滥用 setState 导致重复渲染死循环的
   React16 改造生命周期主要是为了配合 fiber 架构带来的异步渲染机制，同时也确保了生命周期方法的行为更加纯粹、可控、可预测（针对生命周期中长期被滥用的部分推行了具有强制性的最佳实践）

问题：

1. react15 之前和 React16 的生命周期对比
2. React 生命周期的一系列的变化以及其背后的原因？
3. 一个组件的一生如何度过？

## JSX 如何变成 DOM 的

1. JSX 的本质是什么，它和 JS 之间到底是什么关系？
   本质是 JS 的语法拓展。通过 babel，jsx 会被编译为 React.createElement(),React.createElement()返回一个“React Element”的 JS 对象。
   JSX 的本质是 React.createElement 这个 JavaScript 调用的语法糖。
2. 为什么要用 JSX, 不用会有什么后果
   允许使用类 HTML 标签语法来创建虚拟 DOM，降低学习成本，提升开发体验和效率。
3. JSX 背后的功能模块是什么，这个功能模块都做了哪些事情？
   React.createElement，里面都是在格式化数据，最后会返回 ReactElement 的调用。ReactElement 方法把传入的参数进行规范并放进一个 element 对象中并返回该对象。
   ReactElement 对象以 JS 对象形式存在的对 DOM 的描述，就是虚拟 DOM 中的一个节点。
   虚拟 DOM 到渲染到页面的真实 DOM 是通过调用 ReactDOM.render 方法来实现的。

总结：JSX 是 React.createElement（）的语法糖 2. ReactElement 即是虚拟 DOM 节点，是 React.createElement（）的参数进行格式化的一个对象 3. ReactDOM.render 方法将所有 ReactElement 挂载到真实的 DOM 上。

## ReactDOM.render 如何串联渲染链路的

以首次渲染为切入点分析，分为初始化，render，commit 等过程

### 初始化：完成 Fiber 树中基本实体的创建。

-   `fiberRoot`，是一个 FiberRootNode 对象，有一个 current 属性。current 对象，是一个 FiberNode（fiber 节点的对象类型） 的实例，即 current 对象是一个 fiber 节点。
    fiberRoot 关联对象是真实 DOM 的容器节点。
-   `rootFiber` 是虚拟 DOM 的根节点所在。
    这两个节点是后序整颗 Fiber 树的起点。

React 都有以下 3 种启动方式

1. legacy 模式：`ReactDOM.render(<App />, rootNode)`，当前 React App 使用的方式
2. blocking 模式：`ReactDOM.createBlockingRoot(rootNode).render(<App />`，在实验中，作为迁移到 concurrent 模式的第一个步骤
3. concurrent 模式：`ReactDOM.createRoot(rootNode).render(<App />)`，目前在实验中，未来稳定之后，打算作为 React 的默认开发模式，这个模式开启了所有的新功能
   目前常用的还是 legacy 模式，实际触发的仍是同步渲染链路。
   `ReactDOM.createRoot`和`ReactDOM.render`的不同，主要区别在于`scheduleUpdateOnFiber`这个判断，在异步渲染模式下，由于请求到的 lane 不再是 SyncLane（同步优先级)。fiber 节点上的 mode 属性表示处于当前的那个模式

React 16 如果没有开启 Concurrent 模式，那它还能叫 Fiber 架构吗？
不管是否是 concurrent 模式，整个数据层面的设计，包括贯穿整个渲染链路的梳理逻辑，已经完全用 Fiber 重构了一遍。Fiber 架构在 React 中并不能够和异步渲染画严格的等号，它是一种同时兼容了同步渲染与异步渲染的设计。

### render 阶段： Fiber 树的构建过程

React15 的调和过程是递归，fiber 架构的调和过程不是依赖递归实现的，但是在同步模式下，是一个深度优先搜索的过程。
`beginWork` 是创建新的 fiber 节点，`completeWork` 是将 fiber 节点映射为 DOM 节点。

fiber 节点(workInProgress 节点)的创建

-   performSyncWorkOnRoot 是 render 阶段的起点，调用了 renderRootSync
-   createWorkInProgress 调用了 `createFiber`，createFiber 返回值为 workInProgress，
-   workInProgress 的 alternate 将指向 current；current 的 alternate 将反过来指向 workInProgress。

`workInProgress 节点`其实就是 current 节点（即 rootFiber）的副本。

`workLoopSync 函数`，通过循环反复判断 workInProgress 节点是否为空，如果不为空，就执行 `performUnitOfWork 函数`。
`performUnitOfWork 函数`触发对`beginWork`的调用，创建新的 fiber 节点。通过循环调用，就会不断创建新的 fiber 节点。而新创建的 fiber 节点，会挂载到 workInProgress 节点的后代节点。

fiber 树的创建：
Fiber 节点间是如何连接的呢：
不同的 Fiber 节点之间，将通过 child、return、sibling 这 3 个属性建立关系，其中 child、return 记录的是父子节点关系，而 sibling 记录的则是兄弟节点关系。
workInProgress Fiber 树的最终形态，其实已经从树变成了链表。

一棵 current 树，一棵 workInProgress 树，这样的设计目的是什么？

关键词：Fiber 节点的创建链路与 Fiber 树的构建链路

### Fiber 树和 DOM 树之间的关联

performUnitOfWork -> completeUnitOfWork -> completeWork
performUnitOfWork 中调用了 completeUnitOfWork，completeUnitOfWork 调用了 completeWork

completeWork

1. completeWork 的工作内容： 负责 fiber 节点到 DOM 节点的映射逻辑
2. completeWork 内部有 3 个关键动作：

（1）创建 DOM 节点（createInstance 方法）。
（2）将 DOM 节点插入到 DOM 树中（appendAllChildren 方法）
(3) 为 DOM 节点设置属性（FinalizeInitialChildren）

3. 创建好的 DOM 节点赋值为 workInProgress 节点的 stateNode 属性
4. 将 DOM 节点插入到 DOM 树的操作是通过 appendAllChildren 函数来完成的。

completeUnitOfWork：开启收集 EffectList 的“大循环”

1. 对传入当前的节点，调用 completeWork
2. 将当前节点的副作用链（EffectList）插入到其父节点对应的副作用链（EffectList）中
3. 开启下一轮循环的原则：严格自底向上的，子节点的 completeWork 总会先于父节点执行。先检查兄弟节点是否存在，若存在则优先处理兄弟节点；确认没有待处理的兄弟节点后，才转而处理父节点

疑问，performUnitOfWork 里面即有 beginwork 的调用也有 completeWork 的调用，分别什么时候调用他们呢，
先执行 beginwork 生成 fiber 节点，然后再掉用哪个 completeWork，完成 fiber 节点到 DOM 节点的映射

递归的目的是什么？render 的目标是什么

更新时，渲染器如何更快地定位到需要更新的节点。

副作用链：每个 fiber 节点都维护着一个属于它自己的 effectList,effectList 以链表形式存在，每个元素都是一个 fiber 节点。这些 fiber 节点需要满足两个条件

1. 都是当前 fiber 节点的后代节点
2. 都有待处理的副作用

Fiber 节点的 effectList 里记录的并非自身的更新，而且其需要更新的后代节点。
这个 effectList 链表在 Fiber 节点中是通过 firstEffect 和 lastEffect 来维护的

副作用收集过程：把需要更新的 fiber 节点单独串联成一串链表，方便后续有针对性地对它们进行更新。

```js
import React from 'react';
import ReactDOM from 'react-dom';

function App() {
    return (
        <div className="App">
            <div className="container">
                <h1>我是标题</h1>
                <p>我是第一段话</p>
                <p>我是第二段话</p>
            </div>
        </div>
    );
}
const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
```

以 app 节点为例。effectList 的创建过程

1. App FiberNode 判断 flags 属性大于 PerformedWork，因此会进入 effectList 的创建逻辑
2. 创建 effectList 时，不是为当前节点创建的，而是为父节点创建的，App 节点的父节点是 rootFiber(`rootFiber` 是虚拟 DOM 的根节点所在)，rootFiber 的 effectList 此时为空；
3. rootFiber 的 firstEffect 和 lastEffect 指针都会指向 App 节点，App 节点由此成为 effectList 中的唯一一个 FiberNode

commit 只负责渲染更新，而不负责查看更新
疑问：将当前节点的副作用链（EffectList）插入到其父节点对应的副作用链（EffectList）中，这句话是什么含义？每个父节点都存在其子节点的副作用链么。

总结：“根节点（rootFiber）上的 effectList 信息，是 commit 阶段的更新线索”这个结论，就足以将 render 阶段和 commit 阶段串联起来。

### commmit 阶段

commitRoot（是真实 DOM 的渲染过程），入参 root 并不是 rootFiber，而是 fiberRoot（FiberRootNode）实例。
分为三个阶段

1. before mutation 阶段，DOM 节点还未渲染到界面上，会触发 getSnapshotBeforeUpdate，也会处理 useEffect 钩子相关的调度逻辑。
2. mutation： 这个阶段负责 DOM 节点的渲染。在渲染过程中，会遍历 effectList，根据 flags（effectTag）的不同，执行不同的 DOM 操作
3. layout，这个阶段处理 DOM 渲染完毕之后的收尾逻辑。比如调用 componentDidMount/componentDidUpdate，调用 useLayoutEffect 钩子函数的回调等。除了这些之外，它还会把 fiberRoot 的 current 指针指向 workInProgress Fiber 树

render 阶段可以同步也可以异步，但 commit 一定是同步的。

## Fiber 架构的 concurrent 模式

以下函数的作用

-   performSyncWorkOnRoot：render 阶段的起点
-   workLoopSync：通过循环反复判断 workInProgress 节点是否为空，如果不为空，就执行 `performUnitOfWork 函数`。
-   performUnitOfWork：触发对`beginWork`的调用，创建新的 fiber 节点
-   beginWork：是创建新的 fiber 节点
-   completeWork：负责 fiber 节点到 DOM 节点的映射逻辑
-   completeUnitOfWork：开启收集 EffectList 的“大循环”
-   reconcileChildFibers： ChildReconciler 的返回值是一个名为 reconcileChildFibers 的函数，这个函数是一个逻辑分发器，它将根据入参的不同，执行不同的 Fiber 节点操作，最终返回不同的目标 Fiber 节点

时间切片和优先级的实现

异步渲染模式下，循环创建 fiber 节点 workLoopConcurrent

Scheduler.unstable_shouldYield 判断是否到了切片到期时间
