## React hooks 使用原则

1. 只在 React 函数中调用 hook
2. 不要在循环、条件或嵌套函数中调用 Hook

## 原因

1. React hooks 本身就是 React 组件的钩子
2. 要确保 hooks 每次渲染时都保证同样的执行顺序。
   hooks 在底层依赖于顺序链表。
    - mountState(首次渲染)： 构建链表并渲染
    - updateState: 依次遍历链表并渲染
      hooks 的渲染时通过“依次遍历”来定位每个 hooks 内容的，如果前后两次读到的链表在顺序上存在差异，然后渲染的结果自然是不可控的。
