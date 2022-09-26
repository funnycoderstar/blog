## 概念

BFC 即 Block Formatting Contexts (块级格式化上下文)。独立的容器，在布局上不会影响 其外面的。
只要元素满足下面任一条件即可触发 BFC 特性：

-   html 根元素
-   浮动元素：float 除 none 以外的值
-   绝对定位元素：position (absolute、fixed)
-   display 为 inline-block、table-cells、flex
-   overflow 除了 visible 以外的值 (hidden、auto、scroll)

## BFC 特性与应用

1.  同一个 BFC 下外边距会发生折叠

```js
<head>
div{
    width: 100px;
    height: 100px;
    background: lightblue;
    margin: 100px;
}
</head>
<body>
    <div></div>
    <div></div>
</body>
```

因为两个 div 元素都处于同一个 BFC 容器下 (这里指 html 元素) 所以第一个 div 的下边距和第二个 div 的上边距发生了重叠，所以两个盒子之间距离只有 100px，而不是 200px。
首先这不是 CSS 的 bug，我们可以理解为一种规范，如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中。

```js
.container {
    overflow: hidden;
}
p {
    width: 100px;
    height: 100px;
    background: lightblue;
    margin: 100px;
}

<div class="container">
    <p></p>
</div>
<div class="container">
    <p></p>
</div>
```

2.  BFC 可以包含浮动的元素（清除浮动）

```js
<div style="border: 1px solid #000;">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

由于容器内元素浮动，脱离了文档流，所以容器只剩下 2px 的边距高度。如果使触发容器的 BFC，那么容器将会包裹着浮动元素。

给父元素添加 `overflow: hidden`

```js
<div style="border: 1px solid #000;overflow: hidden">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```

3.  BFC 可以阻止元素被浮动元素覆盖

文字环绕效果

```js
<div style="height: 100px;width: 100px;float: left;background: lightblue">我是一个左浮动的元素</div>
<div style="width: 200px; height: 200px;background: #eee">我是一个没有设置浮动,
也没有触发 BFC 元素, width: 200px; height:200px; background: #eee;</div>
```

这时候其实第二个元素有部分被浮动元素所覆盖，(但是文本信息不会被浮动元素所覆盖) 如果想避免元素被覆盖，可触第二个元素的 BFC 特性，在第二个元素中加入 overflow: hidden

```js
<div style="height: 100px;width: 100px;float: left;background: lightblue">我是一个左浮动的元素</div>
<div style="width: 200px; height: 200px;background: #eee; overflow: hidden">我是一个没有设置浮动,
也没有触发 BFC 元素, width: 200px; height:200px; background: #eee;</div>
```

    这个方法可以用来实现两列自适应布局，效果不错，这时候左边的宽度固定，右边的内容自适应宽度(去掉上面右边内容的宽度)。

## 参考

-   [10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)
-   [](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)
