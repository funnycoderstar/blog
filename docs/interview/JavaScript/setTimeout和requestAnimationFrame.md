## 下面代码输入什么
```js
setTimeout(() => {
    console.log(1);
}, 0)
console.log(2);
```
答案：输出 2 , 1。

## 目录
- 单线程模型
- 任务队列
- `setTimeout`
- `setTimeout`和`setInterval`
- `requestAnimationFrame`
- `requestidlecallback`


## 单线程模型

JavaScript语言的一大特点就是单线程，也就是说，同一时间只能做一件事，前面的任务没做完，后面的任务只能等着。

### 为什么JavaScript是单线程的呢?
这主要与JavaScript用途有关。它的主要用途是与用户互动，以及操作DOM。如果JavaScript是多线程的，会带来很多复杂的问题，假如 JavaScript有A和B两个线程，A线程在DOM节点上添加了内容，B线程删除了这个节点，应该是哪个为准呢? 所以，为了避免复杂性，所以设计成了单线程。

虽然 HTML5 提出了`Web Worker`标准。Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。但是子线程完全不受主线程控制，且不得操作DOM。所以这个并没有改变JavaScript单线程的本质。一般使用 Web Worker 的场景是代码中有很多计算密集型或高延迟的任务，可以考虑分配给 Worker 线程。

但是使用的时候一定要注意，worker 线程是为了让你的程序跑的更快，但是如果 worker 线程和主线程之间通信的时间大于了你不使用worker线程的时间，结果就得不偿失了。

### 浏览器下的JavaScript

#### 浏览器的内核是多进程的

- brower进程（主进程）
    - 负责浏览器的页面展示，与用户交互。如前进，后退
    - 页面的前进，后退
    - 负责页面的管理，创建和销毁其他进程
- GPU进程
    - 3D渲染
- 插件进程
    - 每种类型的插件对应一个进程，仅当使用该插件时才能创建
- 浏览器渲染进程（浏览器内核）
    - GUI渲染进程
        - DOM解析， CSS解析，生成渲染树
    - js引擎线程
        - 执行Js代码
    - 事件触发
        - 管理着一个任务队列
    - 异步HTTP请求线程
    - 定时触发器线程

可以看到 js引擎是浏览器渲染进程的一个线程。

#### 浏览器内核中线程之间的关系
- GUI渲染线程和JS引擎线程互斥
    - js是可以操作DOM的，如果在修改这些元素的同时渲染页面（js线程和ui线程同时运行），那么渲染线程前后获得的元素数据可能就不一致了。
- JS阻塞页面加载
   - js如果执行时间过长就会阻塞页面

#### 浏览器是多进程的优点
- 默认新开 一个 tab 页面 新建 一个进程,所以单个 tab 页面崩溃不会影响到整个浏览器。
- 第三方插件崩溃也不会影响到整个浏览器。
- 多进程可以充分利用现代 CPU 多核的优势。
- 方便使用沙盒模型隔离插件等进程,提高浏览器的稳定性。

#### 进程和线程又是什么呢

进程（process）和线程（thread）是操作系统的基本概念。
- 进程是 CPU 资源分配的最小单位（是能拥有资源和独立运行的最小单位）。
- 线程是 CPU 调度的最小单位（是建立在进程基础上的一次程序运行单位）。

由于每个进程至少要做一件事,所以一个进程至少有一个线程。系统会给每个进程分配独立的内存,因此进程有它独立的资源。同一进程内的各个线程之间共享该进程的内存空间（包括代码段,数据集,堆等）。
进程可以理解为一个工厂不不同车间，相互独立。线程是车间里的工人，可以自己做自己的事情,也可以相互配合做同一件事情。

> 如果你想知道更多，推荐看 《WebKit技术内幕》这本书。

## 任务队列

单线程就意味着，所有任务都要排队执行，前一个任务结束，才会执行后一个任务。

如果一个任务需要执行，但此时JavaScript引擎正在执行其他任务，那么这个任务就需要放到一个队列中进行等待。等到线程空闲时，就可以从这个队列中取出最早加入的任务进行执行（类似于我们去银行排队办理业务，单线程相当于说这家银行只有一个服务窗口，一次只能为一个人服务，后面到的就需要排队，而任务队列就是排队区，先到的就优先服务）

注意：如果当前线程空闲，并且队列为空，那每次加入队列的函数将立即执行。

>为什么会有任务队列？
由于 JS 是单线程的，同步执行任务会造成浏览器的阻塞，所以我们将 JS 分成一个又一个的任务，通过不停的循环来执行事件队列中的任务。

## setTimeout

setTimeout的运行机制：执行该语句时，是立即把当前定时器代码推入事件队列，当定时器在事件列表中满足设置的时间值时将传入的函数加入任务队列，之后的执行就交给任务队列负责。但是如果此时任务队列不为空，则需等待，所以执行定时器内代码的时间可能会大于设置的时间

现在我们回到最开始的一个例子
```js
setTimeout(() => {
    console.log(1);
}, 0)
console.log(2);
```
输出 2， 1；

setTimeout的第二个参数表示在执行代码前等待的毫秒数。上面代码中，设置为0，表面意思为 执行代码前等待的毫秒数为0，即立即执行。但实际上的运行结果我们也看到了，并不是表面上看起来的样子，千万不要被欺骗了。

实际上，上面的代码并不是立即执行的，这是因为setTimeout有一个最小执行时间，HTML5标准规定了setTimeout()的第二个参数的最小值（最短间隔）不得低于4毫秒。 当指定的时间低于该时间时，浏览器会用最小允许的时间作为setTimeout的时间间隔，也就是说即使我们把setTimeout的延迟时间设置为0，实际上可能为 4毫秒后才事件推入任务队列。

> 定时器代码在被推送到任务队列前，会先被推入到事件列表中，当定时器在事件列表中满足设置的时间值时会被推到任务队列，但是如果此时任务队列不为空，则需等待，所以执行定时器内代码的时间可能会大于设置的时间

```js
setTimeout(() => {
    console.log(111);
}, 100);
```
上面代码表示100ms后执行`console.log(111)`，但实际上实行的时间肯定是大于100ms后的， 100ms 只是表示 100ms 后将任务加入到"任务队列"中，必须等到当前代码（执行栈）执行完，主线程才会去执行它指定的回调函数。要是当前代码耗时很长，有可能要等很久，所以并没有办法保证，回调函数一定会在`setTimeout()`指定的时间执行。


## setTimeout 和 setInterval区别
- setTimeout: 指定延期后调用函数，每次setTimeout计时到后就会去执行，然后执行一段时间后才继续setTimeout,中间就多了误差，（误差多少与代码的执行时间有关）。
- setInterval：以指定周期调用函数，而setInterval则是每次都精确的隔一段时间推入一个事件（但是，事件的执行时间不一定就不准确，还有可能是这个事件还没执行完毕，下一个事件就来了）.

下面的例子引用 [深入理解定时器系列第一篇——理解setTimeout和setInterval](https://www.cnblogs.com/xiaohuochai/p/5773183.html) 这篇文章的例子

```js
btn.onclick = function(){
    setTimeout(function(){
        console.log(1);
    },250);
}
```
点击该按钮后，首先将onclick事件处理程序加入队列。该程序执行后才设置定时器，再有250ms后，指定的代码才被添加到队列中等待执行。
如果上面代码中的onclick事件处理程序执行了300ms，那么定时器的代码至少要在定时器设置之后的300ms后才会被执行。队列中所有的代码都要等到javascript进程空闲之后才能执行，而不管它们是如何添加到队列中的。

![](https://user-gold-cdn.xitu.io/2020/3/4/170a3d79c3fdc249?w=746&h=332&f=png&s=73571)

如图所示，尽管在255ms处添加了定时器代码，但这时候还不能执行，因为onclick事件处理程序仍在运行。定时器代码最早能执行的时机是在300ms处，即onclick事件处理程序结束之后。


### setInterval存在的一些问题：

JavaScript中使用 setInterval 开启轮询。定时器代码可能在代码再次被添加到队列之前还没有完成执行，结果导致定时器代码连续运行好几次，而之间没有任何停顿。而javascript引擎对这个问题的解决是：当使用setInterval()时，仅当没有该定时器的任何其他代码实例时，才将定时器代码添加到队列中。这确保了定时器代码加入到队列中的最小时间间隔为指定间隔。

但是，这样会导致两个问题：
- 1、某些间隔被跳过；
- 2、多个定时器的代码执行之间的间隔可能比预期的小

假设，某个onclick事件处理程序使用setInterval()设置了200ms间隔的定时器。如果事件处理程序花了300ms多一点时间完成，同时定时器代码也花了差不多的时间，就会同时出现跳过某间隔的情况
![](https://user-gold-cdn.xitu.io/2020/3/4/170a3d7a5ca2ced8?w=796&h=352&f=png&s=92975)

例子中的第一个定时器是在`205ms`处添加到队列中的，但是直到过了`300ms`处才能执行。当执行这个定时器代码时，在405ms处又给队列添加了另一个副本。在下一个间隔，即605ms处，第一个定时器代码仍在运行，同时在队列中已经有了一个定时器代码的实例。结果是，在这个时间点上的定时器代码不会被添加到队列中


使用setTimeout构造轮询能保证每次轮询的间隔。
```js
setTimeout(function () {
 console.log('我被调用了');
 setTimeout(arguments.callee, 100);
}, 100);

```
> callee 是 arguments 对象的一个属性。它可以用于引用该函数的函数体内当前正在执行的函数。在严格模式下，第5版 ECMAScript (ES5) 禁止使用` arguments.callee()`。当一个函数必须调用自身的时候, 避免使用 arguments.callee(), 通过要么给函数表达式一个名字,要么使用一个函数声明.

```js
setTimeout(function fn(){
    console.log('我被调用了');
    setTimeout(fn, 100);
},100);
```
这个模式链式调用了`setTimeout()`，每次函数执行的时候都会创建一个新的定时器。第二个`setTimeout()`调用当前执行的函数，并为其设置另外一个定时器。这样做的好处是，在前一个定时器代码执行完之前，不会向队列插入新的定时器代码，确保不会有任何缺失的间隔。而且，它可以保证在下一次定时器代码执行之前，至少要等待指定的间隔，避免了连续的运行。

## requestAnimationFrame

### `60fps`与设备刷新率

目前大多数设备的屏幕刷新率为`60次/秒`，如果在页面中有一个动画或者渐变效果，或者用户正在滚动页面，那么浏览器渲染动画或页面的每一帧的速率也需要跟设备屏幕的刷新率保持一致。

卡顿：其中每个帧的预算时间仅比`16毫秒`多一点（`1秒/ 60 = 16.6毫秒`）。但实际上，浏览器有整理工作要做，因此您的所有工作是需要在`10毫秒`内完成。如果无法符合此预算，帧率将下降，并且内容会在屏幕上抖动。此现象通常称为卡顿，会对用户体验产生负面影响。

跳帧: 假如动画切换在 16ms, 32ms, 48ms时分别切换，跳帧就是假如到了32ms，其他任务还未执行完成，没有去执行动画切帧，等到开始进行动画的切帧，已经到了该执行48ms的切帧。就好比你玩游戏的时候卡了，过了一会，你再看画面，它不会停留你卡的地方，或者这时你的角色已经挂掉了。必须在下一帧开始之前就已经绘制完毕;

> Chrome devtool 查看实时 FPS, 打开 More tools => Rendering, 勾选 FPS meter

### `requestAnimationFrame`实现动画
`requestAnimationFrame`是浏览器用于定时循环操作的一个接口，类似于setTimeout，主要用途是按帧对网页进行重绘。

在 `requestAnimationFrame` 之前，主要借助 setTimeout/ setInterval 来编写 JS 动画，而动画的关键在于动画帧之间的时间间隔设置，这个时间间隔的设置有讲究，一方面要足够小，这样动画帧之间才有连贯性，动画效果才显得平滑流畅；另一方面要足够大，确保浏览器有足够的时间及时完成渲染。

显示器有固定的刷新频率（60Hz或75Hz），也就是说，每秒最多只能重绘60次或75次，`requestAnimationFrame`的基本思想就是与这个刷新频率保持同步，利用这个刷新频率进行页面重绘。此外，使用这个API，一旦页面不处于浏览器的当前标签，就会自动停止刷新。这就节省了CPU、GPU和电力。

`requestAnimationFrame`是在主线程上完成。这意味着，如果主线程非常繁忙，`requestAnimationFrame`的动画效果会大打折扣。

`requestAnimationFrame`使用一个回调函数作为参数。这个回调函数会在浏览器重绘之前调用。

```js
requestID = window.requestAnimationFrame(callback); 
```

```js
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();
```
上面的代码按照1秒钟60次（大约每16.7毫秒一次），来模拟`requestAnimationFrame`。

## requestIdleCallback()

> MDN上的解释：`requestIdleCallback()`方法将在浏览器的空闲时段内调用的函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间timeout，则有可能为了在超时前执行函数而打乱执行顺序。

`requestAnimationFrame`会在每次屏幕刷新的时候被调用，而`requestIdleCallback`则会在每次屏幕刷新时，判断当前帧是否还有多余的时间，如果有，则会调用`requestAnimationFrame`的回调函数，

![](https://user-gold-cdn.xitu.io/2020/3/4/170a3d79621bf689?w=737&h=139&f=png&s=23325)

图片中是两个连续的执行帧，大致可以理解为两个帧的持续时间大概为16.67，图中黄色部分就是空闲时间。所以，`requestIdleCallback`中的回调函数仅会在每次屏幕刷新并且有空闲时间时才会被调用.

利用这个特性，我们可以在动画执行的期间，利用每帧的空闲时间来进行数据发送的操作，或者一些优先级比较低的操作，此时不会使影响到动画的性能，或者和requestAnimationFrame搭配，可以实现一些页面性能方面的的优化，

> react 的 `fiber` 架构也是基于 `requestIdleCallback` 实现的, 并且在不支持的浏览器中提供了 polyfill

## 总结
- 从单线程模型和任务队列出发理解 `setTimeout(fn, 0)`，并不是立即执行。
- JS 动画, 用`requestAnimationFrame` 会比 `setInterval` 效果更好
- `requestIdleCallback()`常用来切割长任务，利用空闲时间执行，避免主线程长时间阻塞。

## 参考
- [深入理解定时器系列第一篇——理解setTimeout和setInterval](https://www.cnblogs.com/xiaohuochai/p/5773183.html)
- [js中setTimeout，requestAnimationFrame，requestIdleCallback的区别和应用](https://blog.csdn.net/handsomexiaominge/article/details/89057456)
- [【译】使用requestIdleCallback](https://www.cnblogs.com/galenyip/p/4856996.html)
