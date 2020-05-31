## 什么是图片懒加载
当我们向下滚动的时候图片资源才被请求到，这也就是我们本次要实现的效果，进入页面的时候，只请求可视区域的图片资源这也就是懒加载。

比如我们加载一个页面，这个页面很长很长，长到我们的浏览器可视区域装不下，那么懒加载就是优先加载可视区域的内容，其他部分等进入了可视区域在加载。

这个功能非常常见，你打开淘宝的首页，向下滚动，就会看到会有图片不断的加载；你在百度中搜索图片，结果肯定成千上万条，不可能所有的都一下子加载出来的，很重要的原因就是会有性能问题。你可以在Network中查看，在页面滚动的时候，会看到图片一张张加载出来。


![lazyLoad](https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590656760156.gif)

## 为什么要做图片懒加载

懒加载是一种网页性能优化的方式，它能极大的提升用户体验。就比如说图片，图片一直是影响网页性能的主要元凶，现在一张图片超过几兆已经是很经常的事了。如果每次进入页面就请求所有的图片资源，那么可能等图片加载出来用户也早就走了。所以，我们需要懒加载，进入页面的时候，只请求可视区域的图片资源。

总结出来就两个点：

1.全部加载的话会影响用户体验

2.浪费用户的流量，有些用户并不像全部看完，全部加载会耗费大量流量。

## 懒加载原理

图片的标签是 `img`标签，图片的来源主要是 src属性，浏览器是否发起加载图片的请求是根据是否有src属性决定的。

所以可以从 `img`标签的 src属性入手，在没进到可视区域的时候，就先不给 img 标签的 src属性赋值。

## 懒加载实现

实现效果图：

![imgLazyLoad](https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590659217316.gif)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        div {
            display: flex;
            flex-direction: column;
        }
        img {
            width: 100%;
            height: 300px;
        }
    </style>
</head>
<body>
    <div>
        <img data-src="https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657907683.jpeg">
        <img data-src="https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657913523.jpeg">
        <img data-src="https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657925550.jpeg">
        <img data-src="https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657930289.jpeg">
        <img data-src="https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657934750.jpeg">
        <img data-src="https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657918315.jpeg">
    </div>
</body>

</html>
```
### 监听 scroll 事件判断元素是否进入视口

```js
const imgs = [...document.getElementsByTagName('img')];
 let n = 0;

 lazyload();

 function throttle(fn, wait) {
    let timer = null;
    return function(...args) {
        if(!timer) {
            timer = setTimeout(() => {
                timer = null;
                fn.apply(this, args)
            }, wait)
        }
    }
 }
  
 function lazyload() {
    var innerHeight = window.innerHeight; 
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    for(let i = n; i < imgs.length; i++) {
        if(imgs[i].offsetTop < innerHeight + scrollTop) {
            imgs[i].src = imgs[i].getAttribute("data-src");
            n = i + 1;
        }
        
    }
 }
 window.addEventListener('scroll', throttle(lazyload, 200));

```
可能会存在下面几个问题：

1. 每次滑动都要执行一次循环，如果有1000多个图片，性能会很差
2. 每次读取 scrollTop 都会引起回流
3. scrollTop跟DOM的嵌套关系有关，应该根据`getboundingclientrect`获取
4. 滑到最后的时候刷新，会看到所有的图片都加载了


### IntersectionObserver

Intersection Observer API提供了一种异步观察目标元素与祖先元素或顶级文档viewport的交集中的变化的方法。

创建一个 IntersectionObserver对象，并传入相应参数和回调用函数，该回调函数将会在目标(target)元素和根(root)元素的交集大小超过阈值(threshold)规定的大小时候被执行。

```js
var observer = new IntersectionObserver(callback, options);
```
IntersectionObserver是浏览器原生提供的构造函数，接受两个参数：callback是可见性变化时的回调函数（即目标元素出现在root选项指定的元素中可见时，回调函数将会被执行），option是配置对象（该参数可选）。

返回的 `observer`是一个观察器实例。实例的 observe 方法可以指定观察哪个DOM节点。

具体的用法可以 查看 [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)

```js
const imgs = [...document.getElementsByTagName('img')];
// 当监听的元素进入可视范围内的会触发回调
 if(IntersectionObserver) {
     // 创建一个 intersection observer
     let lazyImageObserver = new IntersectionObserver((entries, observer) => {
         entries.forEach((entry, index) => {
             let lazyImage = entry.target;
             // 相交率，默认是相对于浏览器视窗
             if(entry.intersectionRatio > 0) {
                lazyImage.src = lazyImage.getAttribute('data-src');
                // 当前图片加载完之后需要去掉监听
                 lazyImageObserver.unobserve(lazyImage);
             }

         })
     })
     for(let i = 0; i < imgs.length; i++) {
        lazyImageObserver.observe(imgs[i]);
     }
 }
```


- [codePen](https://codepen.io/funnycoderstar/pen/rNOdKGQ)


## vue自定义指令-懒加载

### Vue自定义指令

下面的api来自官网[自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html)：

#### 钩子函数
- bind: 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- inserted: 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- update: 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新
- componentUpdated: 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- unbind: 只调用一次，指令与元素解绑时调用。


#### 钩子函数参数
指令钩子函数会被传入以下参数：
- el：指令所绑定的元素，可以用来直接操作 DOM。
- binding：一个对象，包含以下 property：
    - name：指令名，不包括 v- 前缀。
    - value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
    - oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
    - expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
    - arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
    - modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
- vnode：Vue 编译生成的虚拟节点。
- oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。


### 实现 v-lazyload 指令

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
            img {
                width: 100%;
                height: 300px;
            }
        </style>
    </head>
    <body>
        <div id="app">
            <p v-for="item in imgs" :key="item">
                <img v-lazyload="item">
            </p>
        </div>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script>
        Vue.directive("lazyload", {
            // 指令的定义
            bind: function(el, binding) {
                let lazyImageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry, index) => {
                        let lazyImage = entry.target;
                        // 相交率，默认是相对于浏览器视窗
                        if(entry.intersectionRatio > 0) {
                            lazyImage.src = binding.value;
                            // 当前图片加载完之后需要去掉监听
                            lazyImageObserver.unobserve(lazyImage);
                        }

                    })
                })
                lazyImageObserver.observe(el);
            },
        });
        var app = new Vue({
            el: "#app",
            data: {
                imgs: [
                    'https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657907683.jpeg',
                    'https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657913523.jpeg',
                    'https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657925550.jpeg',
                    'https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657930289.jpeg',
                    'https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657934750.jpeg',
                    'https://cdn.suisuijiang.com/ImageMessage/5adad39555703565e79040fa_1590657918315.jpeg',
                ]
            },
        });
    </script>
</html>
```
- [codePen](https://codepen.io/funnycoderstar/pen/OJyvEpW)

## 参考

- [延迟加载(Lazyload)三种实现方式](https://zhuanlan.zhihu.com/p/25455672)
- [原生js实现图片懒加载（lazyLoad）](https://zhuanlan.zhihu.com/p/55311726)
- [IntersectionObserver API 使用教程](http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)
- [MDN: Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)