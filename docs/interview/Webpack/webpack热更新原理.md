## webpack 模块热替换（HMR - hot module Repacement）

在应用程序运行过程中，替换，添加或删除模块，而无需重新加载整个页面。

-   保留在完全重新加载页面期间丢失的应用程序状态
-   只更新变更内容，以节省宝贵时间
-   在源代码中对 CSS/JS，会立刻在浏览器中进行更新。这几乎相当于浏览器 devtools 直接更改样式。

webpack-dev-server 在编译之后不会写到任何输入文件，而是将 bundle 文件保存在内存中，然后将它们 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样。
webpack-dev-server 中调用了 webpack-dev-middleware 和 webpack-hot-middleware
webpack-dev-middleware:是一个封装器（wrapper）,它可以把 webpack 处理过得文件发送到一个 server。webpack-dev-server 在内部使用了它，它也可以作为独立的 package 来使用
webpack-hot-middleware: 在运行时更新所有类型的模块，而无需完全刷新。webpack-dev-server 在内部使用了它，只需要配置一下就可以，它也可以作为独立的 package 来使用。

增量编译：只编译修改的部分，没修改的部分不重新编译
热更新：处理的是编译完成后的页面刷新部分，只刷新修改的内容，而无需重新刷新

### 为什么需要 HMR

当你对代码进行修改保存后，webpack 将对代码重新打包，并将新的模块发送到浏览器，浏览器通过新的模块替换老的模块，这样在不刷新浏览器的前提下能对应用进行更新。

**要区分两个概念， 浏览器刷新(location.reload)和 HMR 是两个概念**
已经有很多 live reload 的工具或库, 这些库监控文件的变化，然后通知浏览器端刷新页面。

-   live reload 工具并不能够保存应用的状态(states)，当页面刷新后，应用之前的状态消息，还是上文中的例子，点击按钮出现弹窗，当浏览器刷新后，弹窗也随即消失，要恢复到之前状态，还需要再次点击按钮。而 Webpack HMR 则不会刷新浏览器，而是运行时对模块进行热替换，保证了应用状态不会丢失，提升了开发效率。

### HMR 原理

在应用中置换模块

## vue-loader 的 热重载（hot reload）

热重载
不只是当你修改文件的时候简单重新加载页面

## [react-hot-loader](https://github.com/gaearon/react-hot-loader)

## 参考

-   [Webpack Hot Module Replacement 的原理解析](https://github.com/Jocs/jocs.github.io/issues/15)

通过以下方式显著提升开发速度 1.保留页面的状态 2.只更新变更内容
