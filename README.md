# 单选select控件

文件路径: /src/components 

> option文字过长时， 一般采取溢出隐藏 展示'...'， hover时展示tooltip 展示全部  
这里突然想到一种交互方式，过长也可以让文字像做滚动，这里用的是这种方法，实现了效果，代码待优化

### input输入优化

- 使用了防抖函数
- 监听input [compositionend](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event)事件

### select下拉支持键盘

- 为每个`div`增加[tabIndex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)属性，Element.focus() 可以触发聚焦
