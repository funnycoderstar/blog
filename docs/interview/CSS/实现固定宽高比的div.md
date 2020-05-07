## 实现固定宽高比(width: height = 4: 3 )的div，怎么设置
利用css中 `padding`百分比的计算方法： `padding`设置为百分比，是以元素的宽度乘以`100%`从而得到的`padding`值的。

在`div`的`width`为固定的情况下，设置`height`为`0`，使内容自然溢出，再通过设置`padding-bottom`使元素有一定高度。
```css
.element {
    /* 16:9宽高比，则设padding-bottom:56.25% */
    /* height: 0px, 防止矩形被里面的内容撑出多余的高度*/
    width: 100vw; 
    height: 0px; 
    padding-bottom: 56.25%;
    background: pink;
}
```
利用将`padding-top`或`padding-bottom`设置成百分比，来实现高度满足宽度的某个比例。因为，当`margin/padding`取形式为百分比的值时，无论是`left/right`，还是`top/bottom`，都是以父元素的`width`为参照物的！

> [css实现宽高比](https://blog.csdn.net/Honeymao/article/details/77884744)