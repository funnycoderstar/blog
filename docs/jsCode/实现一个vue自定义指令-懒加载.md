## 什么是图片懒加载
当我们向下滚动的时候图片资源才被请求到，这也就是我们本次要实现的效果，这也就是懒加载。

比如我们加载一个页面，这个页面很长很长，长到我们的浏览器可视区域装不下，那么懒加载就是优先加载可视区域的内容，其他部分等进入了可视区域在加载。

## 为什么要做图片懒加载

懒加载是一种网页性能优化的方式，它能极大的提升用户体验。就比如说图片，图片一直是影响网页性能的主要元凶，现在一张图片超过几兆已经是很经常的事了。如果每次进入页面就请求所有的图片资源，那么可能等图片加载出来用户也早就走了。所以，我们需要懒加载，进入页面的时候，只请求可视区域的图片资源。

总结出来就两个点：

1.全部加载的话会影响用户体验

2.浪费用户的流量，有些用户并不像全部看完，全部加载会耗费大量流量。

## 懒加载原理


## 懒加载实现

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
        <img data-src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1825933799,1197547007&fm=26&gp=0.jpg">
        <img data-src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2731360590,3226816949&fm=26&gp=0.jpg">
        <img data-src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1825933799,1197547007&fm=26&gp=0.jpg">
        <img data-src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2731360590,3226816949&fm=26&gp=0.jpg">
        <img data-src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2731360590,3226816949&fm=26&gp=0.jpg">
    </div>
</body>

</html>
```
### 监听滚动根据offsetTop判断

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
 window.addEventListener('scroll', throttle(lazyload, 200));
 
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
```
可能会存在下面几个问题：

1. 每次滑动都要执行一次循环，如果有1000多个图片，性能会很差，
2. 每次读取 scrollTop 都会引入回流，
3. scrollTop跟DOM的嵌套关系有关，应该根据getboundingclientrect获取
4. 滑到最后的时候刷新，会看到所有的图片都加载了


### IntersectionObserver
```js
const imgs = [...document.getElementsByTagName('img')];
// 当监听的元素进入可视范围内的会触发回调
 if(IntersectionObserver) {
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
[codePen](https://codepen.io/funnycoderstar/pen/rNOdKGQ)
## vue自定义指令-懒加载

### Vue自定义指令

下面的api来自官网：



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
                    'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1825933799,1197547007&fm=26&gp=0.jpg',
                    'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2731360590,3226816949&fm=26&gp=0.jpg',
                    'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1825933799,1197547007&fm=26&gp=0.jpg',
                    'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2731360590,3226816949&fm=26&gp=0.jpg',
                    'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1825933799,1197547007&fm=26&gp=0.jpg',
                    'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2731360590,3226816949&fm=26&gp=0.jpg',
                    'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1825933799,1197547007&fm=26&gp=0.jpg',
                    'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2731360590,3226816949&fm=26&gp=0.jpg',
                ]
            },
        });
    </script>
</html>
```
[codePen](https://codepen.io/funnycoderstar/pen/OJyvEpW)