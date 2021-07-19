---
title: "Redux原理与实现"
date: "2018-09-18"
tags: react,前端,js
author: xwchris
desc: "这篇文章要介绍的是redux，这里不会讲解redux的用法，我们的主要目标是理解redux的思想，并看看redux是如何实现的"
---

redux作为一个如此受欢迎的状态管理框架，当看到他的源码缩减起来只有区区几十行时，真的是惊呆了我。我们在实现一个redux的过程中理解redux的思想。为了简便，这里我们忽略错误处理（值为空等情况）

## redux的目标
实现redux的第一步，我们要先了解我们的目标。在redux中，使用一个单一的`store`来管理状态，所有的数据操作操作都不能直接进行操作，需要使用`dispatch`来触发特定的动作，并结合先前定义的`reducer`来生成新的状态。

## createStore
创建store需要使用createStore函数，它的参数分别是`reducer`、`initState`和`enhancer`，如果第二个参数是函数时，则将第二个参数作为enhancer。下面我们来创建这个函数
```js
function createStore(reducer, initState, enhancer) {
  // 如果第二个参数是函数则将该值赋给enhancer
  if (typeof initState === "function") {
    enhancer = initState;
  }

  // 这里处理中间件的情况，我们稍后处理
  if (enhancer && typeof enhancer === 'function') {
    return enhancer(createStore)(reducer, initState);
  }

  function dispatch() {}

  function getState() {}

  function subscribe() {}

  // 返回
  return {
    dispatch,
    getState,
    subscribe
  };
}
```

我们已经将基本的结构写完了，接下来分别实现我们要返回的三个函数`dispatch`、`getState`和`subscribe`。

### getState
`getState`函数返回当前的state的值，这个函数利用闭包特性访问到当前state，并返回该值。
```js
/* ... other code */
const currentState = reducer(initState, {});

function getState() {
	return currentState;
}
/* ... other code */
```

### subscribe
`subscribe`函数用来进行事件的订阅，每次发生新的动作时，都要通知订阅者。为了保证新加入的订阅，不影响当前的动作，我们将新的订阅加入一个临时监听器列表中`nextListeners`。下次调用的时候再更新监听器列表。
```js
let currentListeners = [];
let nextListeners = [];

/* ... other code */
function subscribe(func) {
	ensureCanMuteNextListeners();

	nextListeners.push(func);

	let isSubscribe = true;

 // 返回取消订阅函数
	return function unsubscribe() {
		if (!isSubscribe) {
			return;
		}

		ensureCanMuteNextListeners();

		const index = nextListeners.indexOf(func);
		nextListeners.splice(index, 1);
	}
}

function ensureCanMuteNextListeners() {
	if (currentListeners === nextListeners) {
		nextListeners = currentListeners.slice();
	}
}
/* ...other code */
```

这里的`ensureCanMuteNextListeners`保证改变`nextListeners`能够不影响`currentListeners`。

### dispatch
剩下的`dispatch`函数就很简单了，该函数接收一个`action`参数，返回一个新的状态，并通知所有订阅者。
```js
let currentState = initState;
let currentListeners = [];
let nextListeners = [];

function dispatch(action) {
	if (action && action.type) {
		currentState = reducer(currentState, action);

		const listeners = currentListeners = nextListeners;
		listeners.forEach(listener => listener());
	}
}
```

## 中间件
redux强大的地方在于，它对中间件的支持，我们刚才的`createStore`函数参数中有`enhancer`函数，这个就是中间用来处理中间件的情况的。

在redux中使用`applyMiddleware`处理中间件，它接收一个中间件数组，下面我们来实现它吧！

## applyMiddleware
先说说applyMiddleware怎么来处理中间件。

所谓中间件，就是一种中间处理的函数，它接受一个输入，在处理输入后，再进行输出。由于中间件可能是一系列的列表所以我们要，将这些中间件做成一条链的形式。即每个中间件接受下一个中间件的输出作为输入来进行处理。

中间件函数的形式一般都是
```js
const middleware = ({ dispatch, getState }) => next => action => {
  /* code */ const val = next(action);
  /* code */ return val;
};
```

下面是我们`applyMiddleware`函数。因为我们要处理的是`action`，所以加入中间件的本质操作就是改写我们的`dispatch`函数，做一个增强版的`dispatch`。

```js
function applyMiddleware(...middlewares) {
  // 我们需要先来创建store实例，利用createStore函数和reducer & initState
  return createStore => (reducer, initState) => {
    const store = createStore(reducer, initState);

		// 默认的dispatch函数
    let dispatch = () => {};

    // 中间件函数的形式我们上面提到过
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    };

    const chains = middlewares.map(middleware => middleware(middlewareAPI));

    function compose(...funcs) {
      if (funcs.length <= 1) {
        return funcs[0] || (() => {});
      }

      // compose函数，如[a,b,c,d]最终组合成的函数形式是(..args) => a(b(c(d(..args))))
      return funcs.reduce((a, b) => (...args) => a(b(...args)));
    }

		// 重写dispatch
    dispatch = compose(chains)(store.dispatch);

		// 返回store
    return {
      ...store,
      dispatch,
    }
  }
}
```

## 最后
写到这里redux的核心功能我们已经完成了，这些都是实际上redux的实现方式，只不过我们少了一些边界条件的处理和一些特殊情况的判定。在学习redux核心的时候真正明白了，优秀的思想才是一个开源库成功最大的助推因素。同时对于我自己也学到了一些例如闭包的实用性和compose函数等等。总之，还要多多加油，革命尚未成功，同志仍需努力。

最后附上github上的原文链接：[原文链接](https://github.com/xwchris/blog/issues/67)，之后我会在github上稳定更新，希望能和大家多多交流~。