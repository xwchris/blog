---
title: "Web Workers"
date: "2019-06-07"
tags: js,前端
author: xwchris
desc: " Web Workers允许Web应用程序在一个与主线程分离的后台线程中运行脚本。这样的好处是，可以让一些费时的任务在worker中处理而不阻塞或放慢主线程"
---

> 该文参考[MDN Web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)

## Web Workers
可以使用Worker函数来创建一个worker对象，它接收一个js文件路径，该js文件中包括了要在worker中执行的代码。

在worker中，全局上下文不是window，而是一个[DedicatedWorkerGlobalScope](https://developer.mozilla.org/zh-CN/docs/Web/API/DedicatedWorkerGlobalScope)对象

```js
// 创建worker
const worker = new Worker('test.js');
```

worker和主线程以及其他worker之间可以使用`postMessage`方法进行通信。使用`onmessage`来监听接收的消息。

##### main.js
```js
if (window.Worker) {
	const worker = new Worker('worker.js');
	worker.postMessage({ name: 'xxx' });
}
```

##### worker.js
```js
this.onmessage = function (e) {
	console.log(e.data);
}

// output: {name: 'xxx'}
```

除了该标准worker，还有其他特殊的worker，以下部分都是介绍这些特殊的worker。

## Shared Workers
不同于上面介绍的专用worker，shared workers可以在多个浏览上下文中共享，如多个页面、多个worker之间共享。它的全局对象是`SharedWorkerGlobalScope`的实例。

与专用worker不同，shared worker需要通过其返回的`MessagePort`的对象进行通信和控制。获取该对象需要使用`port`属性。

如果使用addEventListener进行了事件绑定，需要使用`port.start()`方法进行激活。

shared worker代码内部，需要使用`onconnect`事件来监听连接事件。

##### index.js
```js
var worker = new SharedWorker("worker.js");
worker.port.addEventListener("message", function(e) {
		console.log("Got message: " + e.data);
}, false);
worker.port.start();
worker.port.postMessage("start");
```

##### worker.js
```js
var connections = 0;

self.addEventListener("connect", function(e) {
    var port = e.ports[0];
    connections ++;
    port.addEventListener("message", function(e) {
        if (e.data === "start") {
            var ws = new WebSocket("ws://localhost:6080");
            port.postMessage("started connection: " + connections);
        }
    }, false);
    port.start();
}, false);
```

## Service Workers
service worker有着自己独特的功能，虽然它也是一个worker。引用MDN上对Service Worker的介绍，它能够拦截网络请求，本质上充当Web应用程序和浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。目的是为了能够在浏览器上创建有效的离线体验。此外，他们还允许访问推送通知和后台同步API。

出于安全考量，Service Worker只能由HTTPS承载，毕竟修改网络请求能力暴露给中间人会非常危险。Service Worker能细致的控制每一件事情。它被设计为完全异步，同步API（如果XHR和localStorage）不能再service worker中使用。

Service Worker生效的步骤是：注册 -> 安装 -> 激活。激活后的service worker就可以托管web app了。

## 其他Workers
其他特殊的workers还包括[Chrome Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/ChromeWorker)和[Audio Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#Audio_Workers)，由于它们的常用性和兼容性，这里不再介绍。
