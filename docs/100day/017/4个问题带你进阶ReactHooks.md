## 前言
相信大部分人都已经在使用 React hooks 了，但是在开发过程中，我们要 知其然知其所以然。整理了一下最近使用 React hooks 遇到的一些问题，如果有问题或更好的答案，欢迎一起交流。

## 目录
- 为什么要在 React 中引入Hook ?  Hooks 解决了什么问题
- mixin、HOC 、render props、hooks
- React Hooks 原理
- Hooks 中闭包的坑

## 一、为什么要在React中引入Hook? Hooks解决了什么问题

### 1. 组件复用逻辑难
没有hooks之前使用 `render props`和 `高阶组件`。`render props`是接受一个组件作为`props`， `HOC`是一个函数，接受一个组件作为参数，返回另一个组件。使用这些开发的组件会形成“嵌套地狱”，调试困难。

### 2. 复杂组件状态逻辑多

很多组件在最开始写的时候都是很简单的，基本上就是只做一件事，当你的业务逻辑变得复杂之后，组件也会变得复杂起来。大多数情况下，我们不大可能把组件拆分的更小，因为可能有很多共用的状态逻辑，拆分后，组件之间的通信也会很复杂，甚至需要引用 Redux 来管理组件之间的状态。

### 3. class学习成本高
要想用好 class 组件，你必须了解 ES6 中的class，理解 JavaSript 中 `this`的工作方式，要注意绑定事件处理器，清楚当前this的指向。

> 详细查看react 官方文档 [Hook 简介](https://zh-hans.reactjs.org/docs/hooks-intro.html)


## 二、mixin、HOC 、render props、hooks
我们在平常开发中经常会遇到很多的页面有一些公共的逻辑，我们不能每次遇到的时候都直接把原来的代码 copy 过来改扒改扒，改的时候又要全局搜索改掉（很难保证没有漏的，费时费力）所以要想办法去复用，`mixin`、`HOC` , `render props`等都是实现逻辑复用的方式。

### mixin

vue和react中都曾用过mixin（react目前已经抛弃）
mixin(混入)本质上就是将对象复制到另一个对象上。
```js
const mixin = function (obj, mixins) {
    const newObj = obj;
    newObj.prototype = Object.create(obj.prototype);
    
    for(let prop in mixins) {
        if(mixins.hasOwnProperty(prop)) {
            newObj.prototype[prop] = mixins[prop];
        }
    }
    return newObj;
}

const obj = {
    sayHello() {
        console.log('hello');
    }
};
const otherObj = function() {
    console.log('otherObj');
}
const Obj = mixin(otherObj, obj);

const a = new Obj(); // otherObj
a.sayHello(); //  hello
```

mixin存在的几个问题：
- 相关依赖：mixin有可能去依赖其他的mixin，当我们修改其中一个的时候，可能会影响到其他的mixin
- 命名冲突：不同的人在写的时候很有可能会有命名冲突，比如像 handleChange等类似常见的名字
- 增加复杂性：当我们一个组件引入过多的mixin时，代码逻辑将会非常复杂，因为在不停的引入状态，和我们最初想的每个组件只做单一的功能背道而驰。

### HOC

HOC是React社区提出的新的方式用来取代mixin的。
高阶函数是函数式编程中一个基本的概念，它描述了一种这样的函数：接受函数作为输入，或是返回一个函数，比如 map, reduce等都是高阶函数。
高阶组件（ higher-order component），类似于高阶组件接受一个组件作为参数，返回另一个组件。
```js
function getComponent(WrappedComponent) {
  return class extends React.Component {
    render() {
      return <WrappedComponent {...this.props}/>;
    }
  };
}
```

HOC的优点为：
- 不会影响组件内部的状态

HOC的问题是：
- 需要在原组件上进行包裹和嵌套，如果大量使用 HOC，将会产生非常多的嵌套，这让调试变得非常困难
- HOC可以劫持props，在不遵守约定的情况下也可能造成冲突

### Render Props
[render props](https://react.docschina.org/docs/render-props.html): 通过props接受一个返回react element 的函数，来动态决定自己要渲染的结果
```js
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```
[React Router](https://reacttraining.com/react-router/web/api/Route/render-func)中就用到了  Render Props 
```js
<Router>
  <Route path="/home" render={() => <div>Home</div>} />
</Router>,
```
它有哪些问题呢
- 很容易造成“嵌套地狱”

### 使用 hooks
具体实现就是通过一个函数来封装跟状态有关的逻辑，将这些逻辑从组件中抽取出来。而这个函数中我们可以使用其他的Hooks，也可以单独进行测试，甚至将它贡献给社区。
```js
import { useState, useEffect } from 'react';

function useCount() {
  const [count, setCount] = useState(0);
  useEffect(() = {
    document.title = `You clicked ${count} times`;
  });
  
  return count
}
```
hooks的引入就是为了解决上面提到的这么问题，因为 使用函数式组件，我们在开发组件的时候，可以当做平常写函数一样自由。

函数复用是比较容易的，直接传不同的参数就可以渲染不同的组件，复杂组件实现，我们完全可以多封装几个函数，每个函数只单纯的负责一件事。而且很多公用的代码逻辑和一些场景我们可以抽出来，封装成自定义hooks使用，比如 [Umi Hooks](https://github.com/umijs/hooks)库封装了很多共用的逻辑，比如 useSearch，封装了异步搜索场景的逻辑；比如 useVirtualList，就封装了虚拟列表的逻辑。

 
## 三、React Hooks原理

在使用hooks的时候，你可能会对它的规则有很多疑问，比如：
1. 只在最顶层使用 Hook，不能在循环、条件判断或嵌套函数中调用hook。
2. 只在 React 函数中调用 Hook，不能再普通函数中调用hook
3. React怎么知道哪个state对应哪个useState
...

我们先来看一下[官方文档](https://zh-hans.reactjs.org/docs/hooks-faq.html#under-the-hood)给出的解释

> 每个组件内部都有一个「记忆单元格」列表。它们只不过是我们用来存储一些数据的 JavaScript 对象。当你用 useState() 调用一个 Hook 的时候，它会读取当前的单元格（或在首次渲染时将其初始化），然后把指针移动到下一个。这就是多个 useState() 调用会得到各自独立的本地 state 的原因。

React中是通过类似单链表的形式来实现的，通过 next 按顺序串联所有的 hook。可以看下 [源码部分](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/ReactFiberHooks.js#L175)

```js
export type Hook = {|
  memoizedState: any,
  baseState: any,
  baseQueue: Update<any, any> | null,
  queue: UpdateQueue<any, any> | null,
  next: Hook | null, 
|};

export type Effect = {|
  tag: HookEffectTag,
  create: () => (() => void) | void,
  destroy: (() => void) | void,
  deps: Array<mixed> | null,
  next: Effect,
|};
```

> 更详细的推荐查看  [React Hooks 原理](https://github.com/brickspert/blog/issues/26) 和 [Under the hood of React’s hooks system](https://medium.com/the-guild/under-the-hood-of-reacts-hooks-system-eb59638c9dba)。

## 四、Hooks中闭包的坑

我们先来看一下使用 setState 的更新机制：

在`React`的`setState`函数实现中，会根据一个变量`isBatchingUpdates` 判断是直接更新`this.state`还是放到 队列中回头再说。而`isBatchingUpdates` 默认是`false`,也就表示`setState`会同步更新`this.state`。但是，有一个函数 `batchedUpdates`， 这个函数会把`isBatchingUpdates`修改为`true`，而当`React`在调用事件处理函数之前就会调用这个`batchedUpdates`，造成的后果，就是由React控制的事件处理程序过程`setState`不会同步更新`this.state`。

知道这些，我们下面来看两个例子。

下面的代码输出什么？
```js
class Example extends React.Component {
   constructor() {
     super();
     this.state = {
       val: 0
     };
   }
   
   componentDidMount() {
     this.setState({val: this.state.val + 1});
     console.log(this.state.val);    // 第 1 次 log
 
     this.setState({val: this.state.val + 1});
     console.log(this.state.val);    // 第 2 次 log
 
     setTimeout(() => {
       this.setState({val: this.state.val + 1});
       console.log(this.state.val);  // 第 3 次 log 1 
 
       this.setState({val: this.state.val + 1});
       console.log(this.state.val);  // 第 4 次 log 2
     }, 0);
   }
 
   render() {
     return null;
   }
 };
```
打印结果是： 0, 0, 2, 3。

1. 第一次和第二次都是在react自身生命周期内，触发 isBatchingUpdates 为true， 所以并不会直接执行更新state, 而是加入了 `dirtyComponents`，所以打印时获取的都是更新前的状态 0
2. 两次setState时，获取到 `this.state.val` 都是 0，所以执行时都是将0设置为1，在react内部会被合并掉，只执行一次。设置完成后 `state.val`值为1。
3. setTimeout中的代码，触发时 `isBatchingUpdates为false`，所以能够直接进行更新，所以连着输出 2, 3

上面代码改用react hooks的话
```js
import React, { useEffect, useState } from 'react';

const MyComponent = () => {
    const [val, setVal] = useState(0);

    useEffect(() => {
        setVal(val+1);
        console.log(val);

        setVal(val+1);
        console.log(val);

        setTimeout(() => {
            setVal(val+1);
            console.log(val);

            setVal(val+1);
            console.log(val);
        }, 0)
    }, []);
    return null
};

export default MyComponent;
```

打印输出: 0, 0, 0, 0。

更新的方式没有改变。首先是因为 `useEffect` 函数只运行一次，其次`setTimeout`是个闭包，内部获取到值val一直都是 初始化声明的那个值，所以访问到的值一直是0。以例子来看的话，并没有执行更新的操作。

在这种情况下，需要使用一个容器，你可以将更新后的状态值写入其中，并在以后的 `setTimeout`中访问它，这是`useRef`的一种用例。可以将状态值与`ref`的`current`属性同步，并在`setTimeout`中读取当前值。

> 关于这部分详细内容可以查看 [React useEffect的陷阱](https://zhuanlan.zhihu.com/p/84697185)

## 参考

- [2019年17道高频React面试题及详解](https://juejin.im/post/5d5f44dae51d4561df7805b4)
- [Umi Hooks - 助力拥抱 React Hooks](https://zhuanlan.zhihu.com/p/103150605)
- [React Hooks 原理](https://github.com/brickspert/blog/issues/26)
- [9102，作为前端必须知道 hook 怎么玩了](https://juejin.im/post/5d00a67cf265da1b8a4f156f)
- [React useEffect的陷阱](https://zhuanlan.zhihu.com/p/84697185)
- [【React深入】从Mixin到HOC再到Hook](https://juejin.im/post/5cad39b3f265da03502b1c0a)
