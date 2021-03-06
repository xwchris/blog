---
title: "Webkit浏览器基础知识"
date: "2019-07-10"
tags: 前端
author: xwchris
desc: "webkit浏览器的一些基础知识，用以记录、查阅和复习"
---

## 浏览器组成
![浏览器组成](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/layers.png)

浏览器主要由这其部分组成，从上到下，从左到右分别为：
- 用户界面：用来展示和交互
- 浏览器引擎：用来在用户界面和渲染引擎之间传递指令
- 渲染引擎：用来解析HTML和CSS等，然后将解析的内容在界面上显示
- 网络：用来下载各种网络资源
- js解释器：用来解释和执行Javascript
- 后端UI：用来绘制图形
- 数据存储：持久层，用来保存各种数据

## 浏览器渲染流程
在渲染引擎从网络请求号对应的html和css资源后，开始解析和渲染，步骤如下：
```js
构造出DOM树 => 构造出渲染树 => 计算布局 => 进行绘制
```

需要了解的是，这是一个渐进的过程，为了更好的用户体验，渲染引擎会尽快将内容显示在屏幕上。在不断接收和处理网络请求的同时，渲染引擎会渲染部分内容，不必等到整个html解析完毕。

## 构造渲染树
在解析html构造DOM树的过程中，渲染引擎会解析出DOM树节点对应的样式信息。然后在构造渲染树的时候，将相应的样式信息附加到DOM节点中。

渲染树与DOM有对应关系，但并不是一一对应的，例如`<head>`和`display: none`的dom节点不会出现在渲染树中，还有如select有节点可能有多个渲染对象。

有`float`和`position`的元素会调整自己在渲染树中的位置，每个渲染对象在计算完布局后都会有宽度，高度和位置等信息，这些对应的就是css中的盒模型。

计算布局的过程称为“重排”，布局完成后，最后需要调用后台UI进行绘制，这样就能够在用户界面展现页面了。

## 重排和重绘
当布局发生变化如插入了新的dom节点，会发生重排，重排分为全局重排和增量重排。全局重排即将所有元素重新进行布局，增量重排只重排那些需要重排的元素。同样的重绘发生在节点外观发生改变时，它也分为全局重绘和增量重绘。它与重排类似，如果只是局部变化，只是重绘变化的部分。

## 总结
浏览器渲染是一个很复杂的过程，大步骤就上面提到的那么四步。本文只是简单记录了下渲染过程，但其中网络请求，html解析，构建dom树，解析css，构建渲染树，布局，绘制都是有很多细节没有提到。可以看下参考文章原文，它说的较为详细。

## 参考文章
- [浏览器的工作原理：新式网络浏览器幕后揭秘](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/#The_browsers_we_will_talk_about)