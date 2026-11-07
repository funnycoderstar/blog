## 实现一个简版 Redux

Redux 的三大核心原则：
1. 单一数据源：整个应用的 state 存储在一棵 object tree 中，且这个 object tree 只存在于唯一一个 store 中
2. State 是只读的：唯一改变 state 的方法就是触发 action
3. 使用纯函数来执行修改：reducer 是纯函数，接收旧 state 和 action，返回新 state

### 核心实现

```js
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);
    // 返回取消订阅的函数
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  // 初始化，触发一次以填充默认 state
  dispatch({ type: '@@REDUX/INIT' });

  return { getState, dispatch, subscribe };
}
```

### combineReducers

将多个 reducer 合并为一个：

```js
function combineReducers(reducers) {
  return function combination(state = {}, action) {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
}
```

### applyMiddleware

支持中间件（如 redux-thunk）：

```js
function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, initialState) => {
    const store = createStore(reducer, initialState);
    let dispatch = store.dispatch;

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action),
    };

    const chain = middlewares.map((middleware) => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return { ...store, dispatch };
  };
}

function compose(...fns) {
  if (fns.length === 0) return (x) => x;
  if (fns.length === 1) return fns[0];
  return fns.reduce((a, b) => (...args) => a(b(...args)));
}
```

### Usage

```js
// reducer
function counter(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const store = createStore(counter);

const unsubscribe = store.subscribe(() => {
  console.log('state:', store.getState());
});

store.dispatch({ type: 'INCREMENT' }); // state: { count: 1 }
store.dispatch({ type: 'INCREMENT' }); // state: { count: 2 }
store.dispatch({ type: 'DECREMENT' }); // state: { count: 1 }

unsubscribe();
store.dispatch({ type: 'INCREMENT' }); // 不再触发 listener
```
