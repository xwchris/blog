---
title: "真正认识Generator"
date: "2020-04-01"
tags: js, 前端
author: xwchris
desc: "这篇文章旨在帮你真正了解Generator，文章较长，不过如果能花时间耐心看完，相信你已经能够完全理解generator"
---

## 为什么要用generator
在前端开发过程中我们经常需要先请求后端的数据，再用拿来的数据进行使用网页页面渲染等操作，然而请求数据是一个异步操作，而我们的页面渲染又是同步操作，这里ES6中的`generator`就能发挥它的作用，使用它可以像写同步代码一样写异步代码。下面是一个例子，先忽略下面的写法，后面会详细说明。如果你已经理解`generator`基础可以直接跳过这部分和语法部分，直接看深入理解的部分。
```javascript
function *foo() {
  // 请求数据
  var data = yield makeAjax('http://www.example.com');
  render(data);
}
```
在等待数据的过程中会继续执行其他部分的代码，直到数据返回才会继续执行`foo`中后面的代码，这是怎么实现的那？我们都知道js是单线程的，就是说我们不可能同时执行两段代码，要实现这种效果，我们先来猜想下，我们来假设有一个“王杖”（指代cpu的执行权），谁拿到这个“王杖”，谁就可以做自己想做的事，现在代码执行到`foo`我们现在拿着“王杖”然后向服务器请求数据，现在数据还没有返回，我们不能干等着。作为王我们有着高尚的马克思主义思想，我们先把自己的权利交出去，让下一个需要用的人先用着，当然前提是要他们约定好一会儿有需要，再把“王杖”还给我们。等数据返回之后，我们再把我们的“王杖”要回来，就可以继续做我们想做的事情了。
如果你理解了这个过程，那么恭喜你，你已经基本理解了`generator`的运行机制，我这么比喻虽然有些过程不是很贴切，但基本是这么个思路。更多的东西还是向下看吧。

## generator语法

### generator函数
在用`generator`之前，我们首先要了解它的语法。在上面也看到过，它跟函数声明很像，但后面有多了个`*`号，就是`function *foo() { }`，当然也可以这么写`function* foo() { }`。这里两种写法没有任何区别，全看个人习惯，这篇文章里我会用第一种语法。现在我们按这种语法声明一个`generator`函数，供后面使用。
```javascript
function *foo() {

}
```

### yield
到目前为止，我们还什么也干不了，因为我们还缺少了一个重要的老伙计`yield`。`yield`翻译成汉语是产生的意思。`yield`会让我们跟在后面的表达式执行，然后交出自己的控制权，停在这里，直到我们调用`next()`才会继续向下执行。这里新出现了`next`我们先跳过，先说说`generator`怎么执行。先看一个例子。

```javascript
function *foo() {
  var a = yield 1 + 1;
  var b = yield 2 + a;
  console.log(b);
}

var it = foo();
it.next();
it.next(2);
it.next(4);
```
下面我们来逐步分析，首先我们定义了一个`generator`函数`foo`，然后我们执行它`foo()`，这里跟普通函数不同的是，它执行完之后返回的是一个迭代器，等着我们自己却调用一个又一个的`yield`。怎么调用那，这就用到我们前面提到的`next`了，它能够让迭代器一个一个的执行。好，现在我们调用第一个`it.next()`，函数会从头开始执行，然后执行到了第一个`yield`，它首先计算了`1 + 1`，嗯，然后停了下来。然后我们调用第二个`it.next(2)`，注意我这里传入了一个`2`作为`next`函数的参数，这个`2`传给了`a`作为它的值，你可能还有很多其他的疑问，我们详细的后面再说。接着来，我们的`it.next(2)`执行到了第二个`yield`，并计算了`2 + a`由于`a`是`2`所以就变成了`2 + 2`。第三步我们再调用`it.next(4)`，过程跟上一步相同，我们把`b`赋值为`4`继续向下执行，执行到了最后打印出我们的`b`为`4`。这就是`generator`执行的全部的过程了。现在弄明白了`yield`跟`next`的作用，回到刚才的问题，你可能要问，为什么要在`next`中传入`2`和`4`，这里是为了方便理解，我手动计算了`1 + 1`和`2 + 2`的值，那么程序自己计算的值在哪里？是`next`函数的返回值吗，带着这个疑问，我们来看下面一部分。

### next

#### next的参数
`next`可以传入一个参数，来作为上一次`yield`的表达式的返回值，就像我们上面说的`it.next(2)`会让`a`等于`2`。当然第一次执行`next`也可以传入一个参数，但由于它没有上一次`yield`所以没有任何东西能够接受它，会被忽略掉，所以没有什么意义。

#### next的返回值
在这部分我们说说`next`返回值，废话不多说，我们先打印出来，看看它到底是什么，你可以自己执行一下，也可以直接看我执行的结果。

```javascript
function *foo() {
  var a = yield 1 + 1;
  var b = yield 2 + a;
  console.log(b);
}

var it = foo();
console.log(it.next());
console.log(it.next(2));
console.log(it.next(4));
```

执行结果：
```
{ value: 2, done: false }
{ value: 4, done: false }
4
{ value: undefined, done: true }
```

看到这里你会发现，`yield`后面的表达式执行的结果确实返回了，不过是在返回值的`value`字段中，那还有`done`字段使用来做什么用的那。其实这里的`done`是用来指示我们的迭代器，就是例子中的`it`是否执行完了，仔细观察你会发现最后一个`it.next(4)`返回值是`done: true`的，前面的都是`false`，那么最后一个打印值的`undefined`又是什么那，因为我们后面没有`yield`了，所以这里没有被计算出值，那么怎么让最后一个有值那，很简单加个`return`。我们改写下上面的例子。

```javascript
function *foo() {
  var a = yield 1 + 1;
  var b = yield 2 + a;
  return b + 1;
}

var it = foo();
console.log(it.next());
console.log(it.next(2));
console.log(it.next(4));
```

执行结果：
```
{ value: 2, done: false }
{ value: 4, done: false }
{ value: 5, done: true }
```

最后的`next`的`value`的值就是最终`return`返回的值。到这里我们就不再需要手动计算我们的值了，我们在改写下我们的例子。

```javascript
function *foo() {
  var a = yield 1 + 1;
  var b = yield 2 + a;
  return b + 1;
}

var it = foo();
var value1 = it.next().value;
var value2 = it.next(value1).value;
console.log(it.next(value2));
```
大功告成！这些基本上就完成了`generator`的基础部分。但是还有更多深入的东西需要我们进一步挖掘，看下去，相信你会有收获的。

## 深入理解
前两部分我们学习了为什么要用`generator`以及`generator`的语法，这些都是基础，下面我们来看点不一样的东西，老规矩先带着问题才能更有目的性的看，这里先提出几个问题：

- 怎样在异步代码中使用，上面的例子都是同步的啊
- 如果出现错误要怎么进行错误的处理
- 一个个调用next太麻烦了，能不能循环执行或者自动执行那

### 迭代器
进行下面所有的部分之前我们先说一说迭代器，看到现在，我们都知道`generator`函数执行完返回的是一个迭代器。在ES6中同样提供了一种新的迭代方式`for...of`，`for...of`可以帮助我们直接迭代出每个的值，在数组中它像这样。

```javascript
for (var i of ['a', 'b', 'c']) {
  console.log(i);
}

// 输出结果
// a
// b
// c
```

下面我们用我们的`generator`迭代器试试
```javascript
function *foo() {
  yield 1;
  yield 2;
  yield 3;
  return 4;
}

// 获取迭代器
var it = foo();

for(var i of it) {
  console.log(i);
}

// 输出结果
// 1
// 2
// 3
```
现在我们发现`for...of`会直接取出我们每一次计算返回的值，直到`done: true`。这里注意，我们的`4`没有打印出来，说明`for...of`迭代，是不包括`done`为`true`的时候的值的。

下面我们提一个新的问题，如果在`generator`中执行`generator`会怎么样？这里我们先认识一个新的语法`yield *`，这个语法可以让我们在`yield`跟一个`generator`执行器，当`yield`遇到一个新的`generator`需要执行，它会先将这个新的`generator`执行完，再继续执行我们当前的`generator`。这样说可能不太好理解，我们看代码。
```javascript
function *foo() {
  yield 2;
  yield 3;
  yield 4;
}

function * bar() {
  yield 1;
  yield *foo();
  yield 5;
}

for ( var v of bar()) {
  console.log(v);
}
```
这里有两个`generator`我们在`bar`中执行了`foo`，我们使用了`yield *`来执行`foo`，这里的执行顺序会是`yield 1`，然后遇到`foo`进入`foo`中，继续执行`foo`中的`yield 2`直到`foo`执行完毕。然后继续回到`bar`中执行`yield 5`所以最后的执行结果是：
```
1
2
3
4
5
```

### 异步请求
我们上面的例子一直都是同步的，但实际上我们的应用是在异步中，我们现在来看看异步中怎么应用。

```javascript
function request(url) {
  makeAjaxCall(url, function(response) {
    it.next(response);
  })
}

function *foo() {
  var data = yield request('http://api.example.com');
  console.log(JSON.parse(data));
}

var it = foo();
it.next();
```
这里又回到一开头说的那个例子，异步请求在执行到`yield`的时候交出控制权，然后等数据回调成功后在回调中交回控制权。所以像同步一样写异步代码并不是说真的变同步了，只是异步回调的过程被封装了，从外面看不到而已。

### 错误处理
我们都知道在js中我们使用`try...catch`来处理错误，在generator中类似，如果在`generator`内发生错误，如果内部能处理，就在内部处理，不能处理就继续向外冒泡，直到能够处理错误或最后一层。

内部处理错误：
```javascript
// 内部处理
function *foo() {
  try {
    yield Number(4).toUpperCase();
  } catch(e) {
    console.log('error in');
  }
}

var it = foo();
it.next();

// 运行结果：error in
```

外部处理错误：
```javascript
// 外部处理
function *foo() {
  yield Number(4).toUpperCase();
}

var it = foo();
try {
  it.next();
} catch(e) {
  console.log('error out');
}

// 运行结果：error out
```

在`generator`的错误处理中还有一个特殊的地方，它的迭代器有一个`throw`方法，能够将错误丢回`generator`中，在它暂停的地方报错，再往后就跟上面一样了，如果内部能处理则内部处理，不能内部处理则继续冒泡。

内部处理结果：
```javascript
function *foo() {
  try {
    yield 1;
  } catch(e) {
    console.log('error', e);
  }
  yield 2;
  yield 3;
}

var it = foo();
it.next();
it.throw('oh no!');

// 运行结果：error oh no!
```

外部处理结果：
```javascript
function *foo() {
  yield 1;
  yield 2;
  yield 3;
}

var it = foo();
it.next();
try {
  it.throw('oh no!');
} catch (e) {
  console.log('error', e);
}

// 运行结果：error oh no!
```

根据测试，发现迭代器的`throw`也算作一次迭代，测试代码如下：
```javascript
function *foo() {
  try {
    yield 1;
    yield 2;
  } catch (e) {
    console.log('error', e);
  }
  yield 3;
}

var it = foo();
console.log(it.next());
it.throw('oh no!');
console.log(it.next());

// 运行结果
// { value: 1, done: false }
// error oh no!
// { value: undefined, done: true }
```
当用`throw`丢回错误的时候，除了`try`中的语句，迭代器迭代掉了`yield 3`下次再迭代就是，就是最后结束的值了。错误处理到这里就没有了，就这么点东西^_^。

### 自动运行
`generator`能不能自动运行？当然能，并且有很多这样的库，这里我们先自己实现一个简单的。

```javascript
function run(g) {
  var it = g();

  // 利用递归进行迭代
  (function iterator(val) {
    var ret = it.next(val);

    // 如果没有结束
    if(!ret.done) {
      // 判断promise
      if(typeof ret.value === 'object' && 'then' in ret.value) {
        ret.value.then(iterator);
      } else {
        iterator(ret.value);
      }
    }
  })();
}
```
这样我们就能自动处理运行我们的`generator`了，当然我们这个很简单，没有任何错误处理，如何让多个`generator`同时运行，这其中涉及到如何进行控制权的转换问题。我写了一个简单的执行器`Fo`，其中包含了Kyle Simpson大神的一个[ping-pong](http://jsbin.com/qutabu/1/edit?js,output)的例子，感兴趣的可以看下这里是[传送门](https://github.com/xwchris/fo)，当然能顺手star一下就更好了，see you next article ~O(∩_∩)O~。

## 参考链接
- [The Basics Of ES6 Generators](https://davidwalsh.name/es6-generators)
- [Diving Deeper With ES6 Generators](https://davidwalsh.name/es6-generators-dive)
- [Going Async With ES6 Generators](https://davidwalsh.name/async-generators)
- [Getting Concurrent With ES6 Generators](https://davidwalsh.name/concurrent-generators)




