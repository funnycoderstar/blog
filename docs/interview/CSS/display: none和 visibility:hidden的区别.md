## display: none和 visibility:hidden的区别

1. 是否占据空间
   - display: none 不占据空间
   - visibility:hidden 占据空间
   
2. 是否渲染
    - display:none，会触发reflow（回流），进行渲染。
    - visibility:hidden，只会触发repaint（重绘），因为没有发现位置变化，不进行渲染。
  
3. 是否是继承属性(株连性)
    - display:none，display不是继承属性，元素及其子元素都会消失。
    - visibility:hidden，visibility是继承属性，若子元素使用了visibility:visible，则不继承，这个子孙元素又会显现出来。