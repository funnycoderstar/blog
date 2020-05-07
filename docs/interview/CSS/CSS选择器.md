## CSS选择器
- 通用选择器(*)
- 标签选择器（div）
- class选择器(.wrap)
- id选择器（#wrap）
- 属性选择器(E[att], E[att=val], E[att~=val])
    - E[att]： 匹配所有具有att属性的E元素，不考虑它的值
    - E[att=val]：匹配所有att属性等于"val"的E元素
    - E[att~=val]：匹配所有att属性具有多个空格分隔的值、其中一个值等于"val"的E元素
- 相邻选择器(h1 + p)
- 子选择器（ul > li）
- 后代选择器（li a）
- 伪类选择器
   - E:first-child：匹配父元素的第一个子元素
   - E:link	匹配所有未被点击的链接
   - E:focus 匹配获得当前焦点的E元素
   - E:not(s) 反选伪类，匹配不符合当前选择器的任何元素

> 详细查看[CSS选择器笔记](http://www.ruanyifeng.com/blog/2009/03/css_selectors.html)

选择器的优先级（就近原则）：!important > [ id > class > tag ]