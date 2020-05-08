## 懒加载


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