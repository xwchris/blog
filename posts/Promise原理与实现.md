---
title: "Promise原理与实现"
date: "2019-07-10"
tags: js,前端
author: xwchris
desc: "Promise到底是什么，具体是如何工作的，如何处理错误的，这篇文章从零实现一个Promise，来帮助理解这些问题"
---

## 简单介绍
Promise是什么，相信不用说了，写过js的人或多或少都，接触过。刚开始用Promise的时候，总感觉这种写法非常的怪异，但是当慢慢熟悉的时候，发现一切都是那么和谐。

我自己理解的Promise用来解决异步回调嵌套的问题，它代表了异步操作的一种结果。它是一种状态机，从实现上来说一种回调包装器。

当真正看了下[Promise/A+](https://promisesaplus.com/)规范和看了别人的实现代码后，发现Promise的原理和实现也不是很难，所以就有了这篇文章，旨在自我学习，可能也能顺手帮到一些人。这是最后实现的[Promise完整代码](https://github.com/xwchris/simple-promise)和[github原文地址](https://github.com/xwchris/blog/issues/60)。我会频繁更新学习深入现代js框架的文章， 欢迎star。

## Promise规范
Promise在ES6出现之前，就已经有了各个版本的"Promise"，但是当这些用在一起的时候，如果没有一个统一的实现标准，那将是灾难性的。所以就有了规范，Promise/A+就是Promise目前最新的规范。规范旨在帮助实现者指定要达到的目标，并不是规定如何实现。当写完自己的Promise后，要确定是否符合Promise/A+规范，可以使用[promises-tests](https://github.com/promises-aplus/promises-tests)来进行测试。

## 原理和实现
先来想想Promise的实现应该是个什么样的过程。Promise把我们异步的回调函数进行了封装隐藏，让我们可以在then函数以链式的写法在里面写回调和错误处理，所以按照正常思路就是我们应该将then里的回调函数进行存储，然后等异步执行完后，我们由Promise自行调用。

首先是Promise的构造函数
```js
function Promise (executor) {
  // 为了方面后面函数调用，防止this被破坏
  var self = this;
  this.status = 'pending';
  this.value = null;
  this.reason = null;
  // resolve的回调队列
  this.resolveCbs = [];
  // reject的回调队列
  this.rejectCbs = [];

  // resolve的时候改变状态，保存好传入的值，并调用相应的回调队列
  function resolve(value) {
    if (self.status === 'pending') {
      // 由于promise需要异步执行，这里使用setTimeout来延迟执行
      setTimeout(function() {
        self.status = 'fulfilled';
        self.value = value;
        self.resolveCbs.forEach(function (cb) {
          cb(value);
        });
      });
    }
  }

  /// 与resolve相似，不过这里保存的是原因，改变状态为rejected
  function reject(reason) {
    if (self.status = 'pending') {
      setTimeout(function() {
        self.status = 'rejected';
        self.reason = reason;
        self.rejectCbs.forEach(function (cb) {
          cb(reason);
        });
      });
    }
  }

  executor(resolve, reject);
}
```

Promise有三种状态，分别是`pending`，`fulfilled`和`rejected`。它的状态可以由`pending`转为`fulfilled`，由`pending`转为`rejected`，状态一旦确定将无法更改。

有了构造器，下面我们来实现Promise中的关键函数，then函数。为了实现链式调用，我们需要返回一个Promise对象，但是我们不能返回自己，因为Promise的状态不可更改，我们需要返回一个新的Promise对象。基本解释都包含在了注释中

```js
Promise.prototype.then = function (onResolved, onRejected) {
  var self = this;
  var promise = null;

  // onResolved是可选的，当其不存在或不是函数时，将其接受到的值一次往后透传
  onResolved = typeof onResolved === 'function' ? onResolved : function (value) { return value; };
  // onRejected是可选的，当其不存在或不是函数时，将其错误继续向后抛
  onRejected = typeof onRejected === 'function' ? onRejected : function (error) { throw error; };

  // 新的promise状态需要根据x的具体情况来确定
  function resolvePromise(promise, x, resolve, reject) {
    // 这一部分属于Promise/A+规范的Resolution Procedure部分

    // 2.3.1: 如果promise对象和x引用的是同一个对象，那么应该用一个TypeError的错误来reject掉promise
    // 如果两个对象是同一个对象，那么会无限循环调用，会出现错误
    if (promise === x) {
      return reject(new TypeError('Chaining cycle detected for promise!'));
    }

    // 2.3.2: 如果x是一个promise，应该用以下这些来决定它的状态
    if (x instanceof Promise) {
      // 2.3.2.1: 如果x是pending状态，那么promise必须是pending状态，直到x是fulfillded或rejected状态
      // 2.3.2.2: 如果x是fulfilled状态，那么promise需要用相同的值来resolve
      // 2.3.2.3: 如果x是rejected状态，那么promise需要用相同的原因来reject
      if (x.status === 'pending') {
        x.then(function(value) {
          // 由于x可能还是一个promise，所以这里递归调用
          resolvePromise(promise, value, resolve, reject);
        }, reject);
      } else {
        x.then(resolve, reject);
      }
      return;
    }

    // 2.3.3: 如果x是一个对象或者函数，这里是出里thenable的情况，thenable是指具有then函数的对象或函数
    // 2.3.4: 如果x既不是对象也不是函数，那么直接使用x来resolve promise
    if ((x !== null && typeof x === 'object') || typeof x === 'function') {
      var isCalled = false;

      try {
        // 2.3.3.1: 将x.then赋值为then
        var then = x.then;
        // 2.3.3.2: 如果检索到x.then的结果抛出了错误，那么直接reject掉
        // 2.3.3.3: 如果then是一个函数，那么用x作为this，第一个参数是resolvePromise，第二个参数是rejectPromise
        if (typeof then === 'function') {
          // 2.3.3.3.1: 如果resolvePromise被使用一个参数值y调用，执行[[Resolve]](promise, y)
          // 2.3.3.3.2: 如果rejectPromise被使用一个原因r调用，使用r来reject promise
          then.call(x, function (y) {
            // 2.3.3.3.3: 如果resolvePromise和rejectPromise同时被调用，或者这两个函数被使用相同的参数多次调用，那么只执行最开始的，其他的全部忽略
            if (isCalled) return;
            isCalled = true;
            return resolvePromise(promise, y, resolve, reject);
          }, function (r) {
            if (isCalled) return;
            isCalled = true;
            return reject(r);
          });
        } else {
          // 2.3.3.4: 如果then不是函数，用x来resolve promise
          resolve(x);
        }
      } catch(err) {
        // 2.3.3.3.4: 如果调用then的时候抛出错误
        // 2.3.3.3.4.1: 如果resolvePromise和rejectPromise已经被调用了，那么直接忽略掉
        // 2.3.3.3.4.2: 否则使用err来reject promise
        if (isCalled) return;
        isCalled = true;
        reject(err);
      }
    } else {
      resolve(x);
    }
  }

  function handlePromise(modifier, resolve, reject) {
    return function (value) {
      setTimeout(function() {
        try {
          var x = modifier(value);
          resolvePromise(promise, x, resolve, reject);
        } catch(err) {
          reject(err)
        }
      });
    }
  }

  if (self.status === 'fulfilled') {
    promise = new Promise(function (resolve, reject) {
      handlePromise(onResolved, resolve, reject)(self.value);
    });
  } else if (self.status === 'rejected') {
    promise = new Promise(function (resolve, reject) {
      handlePromise(onRejected, resolve, reject)(self.reason);
    });
  } else {
    promise = new Promise(function (resolve, reject) {
      self.resolveCbs.push(handlePromise(onResolved, resolve, reject));
      self.rejectCbs.push(handlePromise(onRejected, resolve, reject));
    });
  }

  return promise;
}
```
到了这里我们的Promise基本已经实现完成。下面让我们来测试我们的Promise是否符合Promise/A+规范。
## 测试
这里我们使用[promises-tests](https://github.com/promises-aplus/promises-tests)进行测试，用它进行测试要先实现一个适配器。下面我们按照它的要求来实现一个
```js
Promise.deferred = function () {
  var global = {};

  var promise = new Promise(function (onResolve, onReject) {
    global.onResolve = onResolve;
    global.onReject = onReject;
  });

  var resolve = function (value) {
    global.onResolve(value);
  };

  var reject = function (reason) {
    global.onReject(reason);
  }

  return {
    promise,
    resolve,
    reject
  }
}
```

然后导出我们的Promise
```js
module.exports = Promise;
```

调用我们的Promise进行测试
```js
var promisesAplusTests = require('promises-aplus-tests');
var adapter = require('./promise');

promisesAplusTests(adapter);
```

最后不考虑性能问题，我们的Promise全部通过Promise/A+测试。