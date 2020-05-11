## CSS盒模型
每个盒子由四个部分（或称区域）组成:
 - 内容边界 Content edge、
 - 内边距边界 Padding Edge、
 - 边框边界 Border Edge、
 - 外边框边界 Margin Edge
 
![img](https://www.runoob.com/images/box-model.gif)

box-sizing 属性定义了 user agent 应该如何计算一个元素的总宽度和总高度。
- content-box  是默认值(标准盒子模型)
    - width = 内容的宽度
    - height = 内容的高度
    - .box {width: 350px; border: 10px solid black;} 在浏览器中的渲染的实际宽度将是 370px。
- border-box 告诉浏览器：你想要设置的边框和内边距的值是包含在width内的,
    - width = border + padding + 内容的宽度
    - height = border + padding + 内容的高度
    - .box {width: 350px; border: 10px solid black;} 导致在浏览器中呈现的宽度为350px的盒子。

## 行内元素和块级元素的区别:
行内元素（display:block）：
- 只占据它对应标签的边框所包含的空间。
- 行内元素不能包含块级元素，只能包含文本或者其它行内元素。
- 盒模型的属性方面：
    - 行内元素设置width无效，height无效(可以设置line-height)，margin上下无效，padding上下无效

块级元素(display:inline; )：
   -  独占一行，垂直方向排列，块级元素占据其父元素（容器）的整个空间，
   -  块级元素可以包含行内元素和块级元素

行内块元素(dispaly: inline-block):
 - 如input、img)既具有 block 元素可以设置宽高的特性，同时又具有 inline 元素默认不换行的特性。
 - inline-block 元素也可以设置 vertical-align（因为这个垂直对齐属性只对设置了inline-block的元素有效） 属性。

 ## position有哪些值，分别是什么含义

 CSS position属性用于指定一个元素在文档中的定位方式。
 - static
    - 默认，即元素在文档常规流中当前的布局位置
 - relative
    - 未脱离文档流

 - absolute
    - 相对定位的元素并未脱离文档流，而绝对定位的元素则脱离了文档流。在布置文档流中其它元素时，绝对定位元素不占据空间。绝对定位元素相对于最近的非 static 祖先元素定位。

 - fixed
    - 脱离文档流
    - 过指定元素相对于屏幕视口（viewport）的位置来指定元素位置
    - fixed 属性会创建新的层叠上下文。当元素祖先的 transform, perspective 或 filter 属性非 none 时，容器由视口改为该祖先。
 - sticky
    - 该值总是创建一个新的层叠上下文（stacking context）, 一个sticky元素会“固定”在离它最近的一个拥有“滚动机制”的祖先上（当该祖先的overflow 是 hidden, scroll, auto, 或 overlay时），即便这个祖先不是真的滚动祖先。