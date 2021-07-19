---
title: "浏览器和Node的事件循环"
date: "2020-09-03"
tags: node,js,前端
author: xwchris
desc: "众所周知，js是单线程的，原因是因为它诞生之初就是作为浏览器的脚本。操作dom如果同时在多个线程中进行，会出现许多问题，为了减少复杂度，采用了单线程的方式。js的另一个特点是非阻塞，这是如何实现的那，这就要说到EventLoop（事件循环）了"
---

## 浏览器中的EventLoop
浏览器在执行代码的过程中，依次执行代码，将同步代码放入到执行栈中进行执行。当遇到异步代码的时候，暂时挂起。待异步代码执行完后，会将异步代码的处理事件（如回调函数）放入到任务队列中。当执行栈中为空时，主线程会检查任务队列，并按照次序执行（这里如果有setTimeout等没有到达指定时间则要延后执行）。

任务队列根据异步任务的不同分为宏任务（macro task）和微任务（micro task）。不同的任务会被放到不同的任务队列中去，每次执行栈为空后，主线程会先检查微任务队列，待微任务队列为空后，在检查宏任务队列。

当前执行栈执行完毕时会立刻先处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。同一次事件循环中，微任务永远在宏任务之前执行。

常见的微任务有：

- process.nextTick()
- Promise

常见的宏任务有：

- setInterval
- setTimeout
- setImmediate
- I/O tasks

## Node中的EventLoop
node中有自己的一套事件循环机制，js代码通过v8引擎进行分析后，调用node api，这些api最后由libv进行驱动。node中的事件循环存在于libv引擎中。
```
	 ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<──connections───     │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
        └───────────────────────┘
```

### poll阶段
外部数据输入后进入poll阶段，这个阶段会按照先后顺序处理poll queue中的事件。如果队列为空，则检查是否有`setImmediate`的回调，如果有就放入check queue，之后进入check阶段执行回调。同时也会检查是否有到期的timer，如果有就放入timer queue，之后进入timer阶段执行queue中的回调，这两者的顺序是不固定的，受到代码运行环境的影响。如果这两者都为空，那么loop会停留在poll阶段，直到一个I/O事件返回，循环立即进入I/O阶段，并执行I/O回调。poll阶段在执行poll queue中的回调时实际上不会无限的执行下去。有两种情况poll阶段会终止执行poll queue中的下一个回调：

1.所有回调执行完毕。
2.执行数超过了node的限制。

### check阶段
专门用来执行`setImmediate`的回调，如果poll阶段空闲，且check queue有事件，则进入该阶段执行。

### close阶段
当一个socket或者handle被突然关闭，close事件会被发送到这个阶段执行回调。否则会以process.nextTick()方法发出去。

### timer阶段
按照先进先出的顺序执行timer queue中的回调。一个timer callback是指由setTimeout或setInterval设置的回调函数。

### I/O callback阶段
该阶段执行大部分I/O操作的回调，包括操作系统的一些回调。

### process.nextTick、setTimeout和setInterval的区别

#### process.nextTick
使用`process.nextTick`执行的回调函数会进入到nextTick queue，虽然没有单独将这个作为一个阶段，但其会在每个阶段执行完，进入到下一个阶段时执行。与poll阶段不同的是，知道nextTick queue完全清空，才会继续向下执行。

#### setTimeout
使用setTimeout来设置定时执行时间，并不一定能在精准的时间间隔内执行，这收到其他代码和环境的执行的影响。

#### setImmediate
setImmediate看起来和setTimeout很像，但是它是在poll阶段进行执行的。就像如下代码所示，哪个会先执行，这个很难进行准确的判断
```js
setTimeout(() => {
    console.log('timeout');
}, 0);

setImmediate(() => {
    console.log('immediate');
});
```

唯一可以确定的是，在IO回调中，setImmediate总是在setTimeout之前进行执行的
```
const fs = require('fs');

fs.readFile(__filename, () => {
    setTimeout(() => {
        console.log('timeout');
    }, 0);
    setImmediate(() => {
        console.log('immediate');
    });
});

// 输出：
/// immediate
// timeout
```