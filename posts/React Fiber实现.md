---
title: "React Fiber实现"
date: "2018-09-18"
tags: react,前端
author: xwchris
desc: "本文主要对React Fiber的原理进行简单介绍，解决什么是Fiber的疑问。阅读本节需要你对React有一定的了解"
---

React Fiber和React Hook简单实现 - [Redul](https://github.com/xwchris/redul)

## 知识准备
### 什么是React
React是用于构建用户界面的 JavaScript 库。同时React是一个pull类型的库，开发者只需要关注业务，不需要过多关注优化与调度等，这是与push类型的库不同的地方。

### 浏览器渲染
浏览器渲染主体流程如下，需要了解的是js与css都会阻塞浏览器的渲染

![浏览器渲染图片](https://api.xwchris.me/static/image/a55c1a2d183e6cc1b65f9c3d96d0ff5ab65d7738c63631a8b52cedcc79e58eed.png)

## 为什么需要Fiber
1. 每一个状态的改变不是都需要马上反应在UI界面上
2. 不同的状态改变应该有不同的优先级，如动画，输入等应该有更高的优先级
3. 对于大量状态的改变复杂操作应该进行更好的调度，避免UI页面卡顿

### Fiber vs Stack
[stack demo page](https://claudiopro.github.io/react-fiber-vs-stack-demo/stack.html)

[fiber demo page](https://claudiopro.github.io/react-fiber-vs-stack-demo/fiber.html)

## Fiber 原理
### Fiber 结构
我们知道代码执行是在栈中执行，栈中的代码会一直执行直到栈为空。
所以为了实现上述的目标我们需要一个能够打断，保存恢复状态和自由调度的栈。这就是Fiber
在之前的React16之前的版本中我们都知道virtual dom（存储了待渲染节点的信息），这个就很适合做为自定义栈的栈帧，而且我们需要在其中添加更多的信息，这就个就被称为fiber节点（虚拟栈帧）

![fiber结构](https://api.xwchris.me/static/image/7082fb1664ee00263833a66d725239ebfe7233df5e97bbd9e41823678e62b261.png)


fiber中除了要渲染的节点信息，还包括了节点间的关系的信息，以及其他一些额外的信息

```js
interface FiberNode<P = any> {
        tag: FiberNodeTag
        // element attrs
        // HOST_ROOT_NODE has node type
        type?: ElementType
        props?: PropsWithChildren<P>
        children: ElementChildren

        // fiber relations
        alternate?: FiberNode | null
        parent?: FiberNode | null
        child?: FiberNode | null
        sibling?: FiberNode | null

        // effect
        effectTag?: EffectTag | null
        effects: FiberNode[]

        // other
        statNode: HTMLElementOrText | RootHTMLElementWithFiberNode | null
        hooks?: Hook | null
        isPartialStateChanged?: boolean
        updateQueue?: HookEffect[]
        isMount?: boolean
    }
```

fiber树的整体结构是一个双向循环链表，这种结构能够更加快速的找到相对应的节点。

在Reconcile过程中为了能够知道之前节点的信息，需要将新的fiber节点与老fiber节点进行关联。

Fiber中会同时存在两种fiber tree，每次Reconcile的过程就是新fiber tree构建的过程，当commit之后新的fiber tree就变成了current fiber tree，如此循环往复。

[fiber简单实现](https://github.com/xwchris/redul/blob/master/src/reconcile.ts)
### Fiber Effect
在Reconcile的过程中，需要给节点设置状态，与旧节点相比需要达到的状态。每个fiber节点构建完成后（设置自己的effectTag状态），如果有effect则将自己以及其子孙元素放入父节点的effects中，这样层层构建，最终新的fiber tree的effects中存储的就是所有要处理的fiber node。然后进入到commit阶段，将所有的fiber node进行到dom的转换，进行UI页面的刷新。

```js
// fiber effect
export enum EffectTag {
    NOTHING,
    UPDATE,
    REPLACE,
    ADD,
    REMOVE
}
```
### Fiber 调度
Fiber既然是一个虚拟栈，那么就需要进行调度。为了实现更佳的UI体验，就需要在合适的时间执行我们的代码
这里介绍一个浏览器API
![idle period](https://api.xwchris.me/static/image/1cb846cfb73e4aa8769b91c33c3eeadf50710b774d8fe64e492bd969a2a3c132.png)

所以我们可以利用该函数在浏览器空闲的时候来执行我们的代码，这样可以达到不阻塞页面渲染的目的
```js
window.requestIdleCallback(callback[, options])
```
该函数会在浏览器空闲的时候调用，并传递一个[IdleDeadline](https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline)对象给`callback`，我们要用到`IdleDeadline.timeRemaining`函数，该函数会返回一个值，告诉我们浏览器的idle时间还有多久，如果已经结束则值是`0`

```js
export function render(element: ElementInput, containerDom: HTMLElement) {
    // clear all before render
    dispatcher.clearDomContent(containerDom)
    const rootFiberNode = createRootFiberNode(element, containerDom)
    taskQueue.push(rootFiberNode)

    requestIdleCallback(performWork)
    return containerDom
}

export function scheduleUpdate(fiberNode: FiberNode) {
    taskQueue.push(fiberNode)

    // when no work in progress, start immediately
    if (!nextUnitWork) {
        requestIdleCallback(performWork)
    }
}

function performWork(deadline: RequestIdleCallbackDeadline) {
    nextUnitWork = resolveNextUnitWork()
    if (!nextUnitWork) {
        commitAllWork()
        return
    }

    if (deadline.timeRemaining() > ENOUGH_TIME) {
        nextUnitWork = performUnitWork(nextUnitWork)
    }

    requestIdleCallback(performWork)
}
```

真正的React中使用的并不是RequestIdleCallback API，因为它有两个问题

1. 兼容性不好
2. 一秒钟仅能调用20次，对于UI任务来说基本没什么用

所以React中实际上是自己实现了一个requestIdleCallback，实现中要用的一个API
```js
window.requestAnimationFrame(callback)
```
用该函数作为定时器，其会在下一次页面重绘前进行调用，精度较高。但它也有一个缺点，就是在后台的时候不会执行，这个时候可以使用`setTimeout`做降级处理
```js
rAFID = requestAnimationFrame(function(timestamp) {
        // cancel the setTimeout
        localClearTimeout(rAFTimeoutID);
        callback(timestamp);
});
rAFTimeoutID = setTimeout(function() {
        // 定时 100 毫秒是算是一个最佳实践
        localCancelAnimationFrame(rAFID);
        callback(getCurrentTime());
}, 100);
```

有了定时器之后，我们根据当前时间`performance.now()`和每一帧的时间（假如是60fps则每一帧平均时间为16.6ms）算出下一帧的时间，执行的时候跟当前时间比对就可以知道是否还有空余时间

### Fiber 优先级
为了更好的用户体验，需要让优先级更高的任务优先执行，如动画，输入等。Fiber中分为五种优先级，每种优先级对应一个过期时间。

```js

// 5种优先级

// TODO: Use symbols?
var ImmediatePriority = 1;
var UserBlockingPriority = 2;
var NormalPriority = 3;
var LowPriority = 4;
var IdlePriority = 5;

// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
var maxSigned31BitInt = 1073741823;

// 5种优先级对应的5种过期时间

// Times out immediately
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
// Eventually times out
var USER_BLOCKING_PRIORITY = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
// Never times out
var IDLE_PRIORITY = maxSigned31BitInt;
```

每次循环，如果有过期的任务，那么无论如何要把过期的任务执行完毕，然后如果有剩余时间则按照到过期时间小的优先执行，以此类推。

## 参考资料&好文推荐
1. [react-fiber-architecture](https://github.com/acdlite/react-fiber-architecture)
2. [The how and why on React’s usage of linked list in Fiber to walk the component’s tree](https://medium.com/react-in-depth/the-how-and-why-on-reacts-usage-of-linked-list-in-fiber-67f1014d0eb7)
3. [Didact Fiber: Incremental reconciliation](https://engineering.hexacta.com/didact-fiber-incremental-reconciliation-b2fe028dcaec)
4. [learn-react-essence/调度原理](https://github.com/KieSun/learn-react-essence/blob/master/%E8%B0%83%E5%BA%A6%E5%8E%9F%E7%90%86.md)
