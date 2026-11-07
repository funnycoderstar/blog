## 三个 Input 的经典闭包问题

### 题目

页面有三个 input，点击每个 input 时弹出对应的序号（0、1、2）。

```html
<input type="button" value="btn" />
<input type="button" value="btn" />
<input type="button" value="btn" />
```

### 问题代码

```js
var inputs = document.querySelectorAll('input');

for (var i = 0; i < inputs.length; i++) {
  inputs[i].onclick = function () {
    alert(i);
  };
}

// 点击任意 input，弹出的都是 3，而不是 0、1、2
```

**原因：** `var` 声明的 `i` 是函数作用域（全局），循环结束后 `i === 3`，所有闭包共享同一个 `i`。

---

### 解决方案

#### 方案一：用 `let` 替代 `var`（推荐）

`let` 具有块级作用域，每次循环都会创建一个新的 `i` 绑定。

```js
const inputs = document.querySelectorAll('input');

for (let i = 0; i < inputs.length; i++) {
  inputs[i].onclick = function () {
    alert(i); // 0、1、2
  };
}
```

#### 方案二：IIFE（立即执行函数）

通过 IIFE 创建独立作用域，将当前 `i` 值传入：

```js
var inputs = document.querySelectorAll('input');

for (var i = 0; i < inputs.length; i++) {
  (function (index) {
    inputs[index].onclick = function () {
      alert(index); // 0、1、2
    };
  })(i);
}
```

#### 方案三：使用 `forEach`

`forEach` 的回调每次调用都是独立的函数作用域：

```js
var inputs = document.querySelectorAll('input');

Array.from(inputs).forEach(function (input, index) {
  input.onclick = function () {
    alert(index); // 0、1、2
  };
});
```

#### 方案四：使用 `dataset` 存储下标

不依赖闭包，将数据挂载到 DOM 上：

```js
var inputs = document.querySelectorAll('input');

for (var i = 0; i < inputs.length; i++) {
  inputs[i].dataset.index = i;
  inputs[i].onclick = function () {
    alert(this.dataset.index); // 0、1、2
  };
}
```

---

### 核心知识点

| | `var` | `let` |
|---|---|---|
| 作用域 | 函数作用域 | 块级作用域 |
| 循环中 | 所有迭代共享同一变量 | 每次迭代创建独立绑定 |
| 闭包捕获 | 捕获同一引用，循环后值已变 | 捕获各自独立的值 |
