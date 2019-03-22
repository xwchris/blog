![last commit](https://img.shields.io/github/last-commit/xwchris/collection.svg?style=flat)
![xwchris](https://img.shields.io/maintenance/xwchris/2019.svg?style=flat)
![issues](https://img.shields.io/github/issues/xwchris/collection.svg?style=flat)

# 前端常用知识梳理

本篇文章主要是对前端常用知识的简单梳理，方便查阅与学习。

更多详细的文章请移步本仓库的[issues](https://github.com/xwchris/blog/issues)

## 🍎BASIC

<details>
<summary>JS-核心部分</summary>
<p>


I. 对象

对象是js中最常见的也是最重要的部分。

js中对象创建除了使用字面量和`Object.create`，最常用的还是`new`。使用`new`创建对象的基本过程如下:

- 生成一个新对象
- 设置原型链
- 绑定this
- 返回该对象（如果构造函数本身有返回值，则返回那个值）

使用代码来模拟`new`
```javascript
function createObject(Con, ...args) {
 var t = {};
 t.__proto__ = Con.prototype;
 t.constructor = Con;
 Con.apply(t, args);
 return t;
}
```


II. 原型

js中的继承使用的是原型链的方式。js中所有对象都有原型，除了`Object.prototype`。

获取一个对象的原型对象可以使用：
- `Object.getPrototypeOf()`该方法只读
- 对象的`__proto__`属性（部分浏览器实现）

`a instanceOf b`的原理就是在a的原型链中寻找`b.prototype`。如果存在则返回`true`，否则返回`false`。
用代码来模拟`instanceOf`
```javascript
function customInstanceOf(ins, Con) {
 var target = Con.prototype;
 var proto = ins.__proto__;
 while(true) {
  if (proto === null) {
   return false;
  }

  if (proto === target) {
   return true;
  }

  proto = proto.__proto__;
 }
}
```


III. 执行上下文（Excution Context 简称 EC）

EC可以理解为js代码的执行环境，它主要分为：全局执行上下文，函数执行上下文，eval执行上下文。代码在执行过程中，每遇到一个EC就将其入栈，该栈称为EC栈。

EC栈如图所示：

![ec-stack](https://user-images.githubusercontent.com/13817144/53413640-7003f380-3a07-11e9-8837-cffb63a24351.png)

说完了执行上下文栈，我们来说下执行上下文，执行上下文由三部分组成：变量对象（Variable Object）、作用域和This。

执行上下文的执行过程分为两个阶段。首先是创建阶段，这个阶段会创建变量对象（并未赋值）、创建作用域和创建this。创建阶段完成后，进入到激活阶段，激活阶段会按顺序执行代码，为变量赋值并执行各种操作。

在说变量对象之前，先来说说什么是作用域。代码在执行的过程中的变量到底是如何寻找的？实际上这些值都是从作用域链中取出来的，作用域链是一种类似于链式的实现，我们说过每个执行上下文都有一个变量对象，变量对象实际上存储的就是各执行上下文中的变量。作用域链将这些变量对象以类似于`__parent__`之类的属性串起来，访问变量的过程就是在链上查找值的过程。

来看一个例子，对于下面的代码
```javascript
var x = 10;

(function foo() {
 var y = 20;

 (function bar() {
  var z = 30;

  console.log(x + y + z);
 })()
})()
```

它的作用域链类似于如下表示

![scope-chain](https://user-images.githubusercontent.com/13817144/53414899-c7579300-3a0a-11e9-8e1f-fbfe05bb2f7e.png)

变量对象包含了执行上下文中各变量声明（注意创建阶段是不为变量赋值的都为undefined）以及函数声明（注意不包括函数表达式）。这也能够解释hosting函数提升的现象。当一个函数被调用的时候，会创建一个特殊的变量对象，称之为活动对象（Activation Object），AO与VO不同的地方在于AO除了包含变量，函数声明，它同时还包括函数的各参数值以及`arguments`。

来看一个例子，对于如下代码
```javascript
function (x, y) {
 var z = 30;
 function bar() {}
 (function baz() {}); // 表达式 不出现在VO/AO中
}
```

它的AO对象如下表示

![activation-object](https://user-images.githubusercontent.com/13817144/53415167-74321000-3a0b-11e9-913c-254744c80a5d.png)


最后来说下This，`this`实际上是与执行上下文相关的一个属性，它不可以被赋值。它是由调用者提供，并与调用写法相关的。那么`this`的值到底是什么哪？在global中`this`就是global本身。当`This`在函数上下文中的时候，它的值取决于函数调用括号左边的值，有为几种情况。更详细解释参考这篇[文章](https://github.com/mqyqingfeng/Blog/issues/7)


1. 该值是Reference类型的时候，this就是base
2. 该值是其他类型的时候，this是null，自动转为global
3. 该值Refernce类型当时base是AO的时候，this也是null，自动转为global

Reference类型类似于下面的这种形式
```
'use strict';

// Access foo.
foo;

// Reference for `foo`.
const fooReference = {
  base: global,
  propertyName: 'foo',
  strict: true,
};
```

这部分更多详细解释请参考[这里](http://dmitrysoshnikov.com/ecmascript/chapter-3-this/#-reference-type)
<p>
</details>

<details>
<summary>JS-对象拷贝</summary>
<p>


I. 浅拷贝

对象的浅拷贝可以使用`Object.assign`方法和`扩展运算符...`来实现


II. 深拷贝

对象的深拷贝方法有

1. 使用`JSON.parse(JSON.stringify(obj))`的方式
2. 使用循环赋值的方法进行浅拷贝

第一种方法使用起来很简单，但它的缺点是对于无法JSON的属性如函数、Symbol等会被忽略，并且对于循环引用的对象会发生错误。

第二种方法的代码实现如下

```javascript
function deepCopy(p, c) {
  c = c || {};
  for (var i in p) {
    if (typeof p[i] === 'object') {
      c[i] = p[i].constructor === Array ? [] : {};
      deepCopy(p[i], c[i]);
    } else {
      c[i] = p[i];
    }
  }
  return c;
}
```
</p>
</details>


<details>
<summary>JS-继承</summary>
<p>


继承在javascript是利用原型链的方式实现的，在es6中加入了`class/extends`的方式也可以实现继承。除了es6中`class/extends`的方式我们来看下原型链的继承方式。

I. 构造函数继承

加入我们有`Animal`构造函数和`Dog`构造函数，现在来实现它们的继承

```javascript
function Animal() {
 this.type = 'animal';
}

function Dog(name) {
 this.name = name;
}
```

第一种方案利用`apply`进行构造函数绑定

```javascript
function Dog(name) {
 Animal.apply(this, arguments)
 //...
}

var dog = new Dog('hei');

console.log(dog.type); // output: animal
```

第二种方案利用`prototype`属性进行原型链的继承

```javascript
Dog.prototype = new Animal();
Dog.prototype.constuctor = Dog;

var dog = new Dog('hei');

console.log(dog.type); // output: animal
```

第三种方案利用中间空对象进行继承

```javascript
// 为了不构建对象直接进行继承，将属性写入prototype
function Animal() {}
Animal.prototype.type = 'animal'

function Dog(name) {
 this.name = name;
}

function extend(Parent, Child) {
 // 如果Child.prototype直接继承Parent.prototype两者指向同一个会有问题
 // 用一个空的中间对象解决同一个对象的问题，并且不会占用太多空间
 var F = function() {};
 F.prototype = Parent.prototype;
 Child.prototype = new F();
 Child.prototype.constructor = Child;
}

extend(Animal, Dog);
var dog = new Dog('hei');

console.log(dog.type); // output: animal
```

这部分更多详细解释请参考[这里](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html)

II. 非构造函数继承

对于两个对象字面量，没有构造函数它们实现继承可以有两种方案，例如现在有这两个对象

```javascript
var animal = {
 type: 'animal'
}

var dog = {
 name: 'hei'
}
```

第一种是利用`prototype`和中介对象

```javascript
function object(o) {
 function F() {}
 F.prototype = o;
 return new F();
}

var dog = object(animal);
dog.name = 'hei'
```

第二种就是将所有属性进行拷贝，拷贝分类浅拷贝和深拷贝，可以参考上面的拷贝部分

这部分更多详细解释请参考[这里](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance_continued.html)
</p>
</details>

<details>
<summary>JS-类型</summary>
<p>


I. 类型分类

基本类型

```javascript
// Null, Undefined, String, Number, Boolean, Symbol
```

引用类型为

```javascript
// Object
```

II. 类型判断

判断javascript中的基本类型除了`null`其他五种都可以使用`typeof`运算符。由于`typeof null === 'obejct'`，我们不能直接判断，对于null我们可以利用`String(null) === 'null'`来判断null

javascript中的内置类型如`Array`、`Date`、`Error`和`RegExp`都可以使用`Object.prototype.toString.call`来判断类型，该函数的返回值类似于`[object Array]`的形式

III. 类型转化

使用操作符操作不同类型的变量，两个变量会转换为同一个类型，基本原则如下

- 对于`\`、`*`、`%`、`-`等操作符，一律转为数字
- `Boolean/Null`类型转为相应的数字， `undefined`和对象会转为`NaN`，数组转数字会将第一项的值转换为数字，如果没有则为0
- 对于`+`操作符，有一个字符串都转为字符串
- 对象类型优先调用`valueOf`然后是`toString`
</p>
</details>

<details>
<summary>JS-模块化</summary>
<p>


javascript中常见的模块化方式有三种，分别是

- es modules
- commonjs
- amd

`es module`使用`import/export/export default`的语法，它是静态的

`commonjs`使用`require/module.exports`的语法，它是动态的，常用于同步加载（用于nodejs中）

`amd`使用`require/define`的语法，它是动态的，常用于异步加载（如requirejs）

这部分更多详细解释请参考[这里](https://medium.com/computed-comparisons/commonjs-vs-amd-vs-requirejs-vs-es6-modules-2e814b114a0b)
</p>
</details>


<details>
<summary>AST/BABEL</summary>
<p>


AST全称Abrstract Syntax Tree（虚拟语法树），是对代码语法分析后得出的一棵语法树。

生成它的主要过程包括分词和解析（词法分析和语法分析），最终生成语法树。可以用该语法树分析代码，来做成各种工具如代码提示，代码格式化、代码转换等等很多应用

Babel就是AST的一种应用，Babel的过程是`parse => transform => generate`，详细步骤：

1. 使用[babel-parser](https://github.com/babel/babel/tree/master/packages/babel-parser)将es6/es7等语法解析成AST
2. 使用[babel-traverse](https://github.com/babel/babel/tree/master/packages/babel-traverse)对AST进行遍历转义，形成新的AST
3. 使用[babel-generator](https://github.com/babel/babel/tree/master/packages/babel-generator)将新的AST生成代码
</p>
</details>

<details>
<summary>防抖/节流</summary>
<p>


防抖和节流一般用于频繁触发函数的优化，减少不必要的开销。

防抖是对于频繁触发的函数，合并成一次执行，常用于用户输入事件

```javascript
function debounce(fn, interval) {
  var timer = null;

  return function() {
    var context = this;
    var args = arguments;

    clearTimeout(timer);

    timer = setTimeout(function() {
      fn.apply(context, args);
    }, interval);
  }
}
```

节流是对于频繁触发的函数，控制函数以一定的速率执行，常用于控制滚动事件触发。下面是代码实现：

```javascript
function throttle(fn, interval) {
  var last = 0, timer = null;

  return function() {
    var context = this;
    var args = arguments;
    var now = Date.now();

    if (now - last < interval) {
      // 保证最后一次触发的也执行
      clearTimeout(timer);
      timer = setTimeout(function() {
      	fn.apply(context, args);
      }, interval)
    } else {
      last = now;
      fn.apply(context, args);
    }
  }
}
```
</p>
</details>


<details>
<summary>Map/Set</summary>
<p>


这里主要说下ES6中的`Map`、`WeakMap`、`Set`和`WeakSet`

I. Set和WeakSet

`Set`与数组相似，但是`Set`中不能有重复的数值，它的键与它的值相同。可以使用数组进行初始化，同时可以利用`Array.from`函数将`Set`转为数组。

它常用的方法和属性有：

```javascript
// 属性
size // 获取set长度

// 方法

// 操作方法
add() // 添加
delete() // 删除
clear() // 清空

// 遍历方法
keys() // 获取所有键值
values() // 获取所有值
entries() // 获取所有键值对
forEach() // 遍历

// 其他方法
has() // 判断是否有某个值
```

`WeakSet`相比于`Set`它的值只能是对象，并且是弱引用的（即没有其他对象引用，该对象就会被回收，不考虑是否在WeakSet中），同时不可遍历，因此它只有`add`,`delete`和`has`方法

II. Map和WeakMap

`Map`与对象相比它可以用对象作为键值，而对象只能用字符串做键值。它构造函数接收一个可遍历对象（如数组，`Set`等），该对象的成员是一个个表示键值对的数组（如`[['name': 'xiaowei],['age', 15]]`）。`Map`与`Set`方法大体相同，不同的是`Map`没有`add`方法，相应的它有`get`和`set`。

`WeakMap`与`WeakSet`概念类似，只有`get`,`set`，`delete`和`has`方法

ES6更多内容可以[这里](http://es6.ruanyifeng.com/)
</p>
</details>


<details>
<summary>CSS-盒模型</summary>
<p>


盒模型是html元素布局模型，盒模型由以下几部分组成

![css盒模型](https://user-images.githubusercontent.com/13817144/54353528-35e55380-468f-11e9-872a-18a5fa78bcd1.png)

盒模型分为两类：标准盒模型和IE盒模型，切换类别可以使用css属性`box-sizing`。默认为标准盒模型`content-box`，IE盒模型用`border-box`表示。
</p>
</details>


<details>
<summary>CSS-BFC</summary>
<p>


BFC全称Block Formating Context（块级格式化上下文），是页面中一块独立的渲染区域，并且有一套渲染规则，它决定了子元素如何定位，以及和其他元素的关系和相互作用。

形成BFC需要满足以下几个条件：

- 根元素html
- 绝对定位的元素（position absolute/fixed）
- display为`inline-block`、`flex`、`table-cell`的元素
- overflow不为`visible`

BFC的特点主要是独立，不影响其他区域，也不会被其他区域所影响。
</p>
</details>


<details>
<summary>CSS-层叠</summary>
<p>


层叠是HTML元素的三维概念，所有元素都在面朝屏幕的z轴上延伸。

要理解层叠，首先要理解层叠上下文，层叠上下文是一个独立的层叠区域，它比普通元素的层叠顺序高。

形成层叠上下文需要满足以下几个条件：

- 根元素html
- position为`absolute`或`fixed`并搭配z-index（值不能为auto）
- position为`fixed`或`sticky`
- opacity比1小
- 有`transform`、`perspective`、`filter`、`clip-path`等
- flex元素的子元素，并且子元素`z-index`值不为`auto`

元素层叠原则是（在同一个层叠上下文中）

1. 后面的元素高于前面的元素
2. z-index大的高于z-index低的（z-index只对形成层叠上下文的元素有效）

具体层叠规则看下图

![层叠规则](https://user-images.githubusercontent.com/13817144/54355034-033d5a00-4693-11e9-904c-94aa5c85beea.png)

</p>
</details>


<details>
<summary>CSS-选择器优先级</summary>
<p>


选择器的优先级如下：

```javascript
// !important > 内联样式 > ID原则器 > Class选择器 > 标签选择器 > 继承属性 > 浏览器默认属性
```

css中选择器的解析是从右向左的，同时要注意通配选择符`*`和关系选择符对优先级没有影响
</p>
</details>

<details>
<summary>CSS-动画</summary>
<p>


过渡`transition`的js钩子事件为`transitionend`。动画`animation`的js钩子事件为`animationend`


动画中常用的属性及属性值总结如下

```javascript
// eg:
// animation: duration timing-function delay count direction fill-mode play-state name;

// duration 单位s
// timing-function 常用值linear、ease、ease-in、ease-out、ease-in-out、cubic-bezier（贝塞尔曲线）、steps、step-start、step-end
// delay 单位s可以为负值（-1s代表从1s处开始）
// count 可以为infinite或者为数字
// direction 常用值normal、reverse、alternate、alternate-reverse
// fill-mode 常用值none、forwards（保持最后一帧）、backwards、both
// play-state 常用值paused、running

```
</p>
</details>


<details>
<summary>CSS-居中布局</summary>
<p>


居中布局包括垂直居中和水平居中，较难的是垂直居中，我们说下常用的水平垂直居中用到的方法

- absolute + transform
- line-height + vertical-align
- flex
- table
</p>
</details>


<details>
<summary>CSS-清除浮动</summary>
<p>


清除浮动更确切的说应该是清除浮动影响，常用的方式有两种：

- 利用BFC来消除浮动影响
- 使用`clear`属性来清除浮动影响
</p>
</details>

## 🍐BROWSER

<details>
<summary>浏览器组成部分</summary>
<p>


I. 基础

浏览器与我们前端息息相关，所以我们需要对浏览器架构有着基本的认识。浏览器基本结构见下图

![浏览器结构](https://user-images.githubusercontent.com/13817144/54362973-ed389500-46a4-11e9-813a-29cf82a08941.png)

从上到下，从左到右来解释这些部分

- 用户界面：除了主窗口呈现渲染内容外，其他可视部分都属于用户界面部分
- 浏览器引擎：用于在用户界面和渲染引擎间传递指令
- 渲染引擎：用于解析html和css，然后绘制呈现出来
- 网络：用于网络请求比如http请求
- js解释器：用于解释和执行js代码
- 用户界面后端：用于绘制基本的窗口小部件
- 数据存储：持久层，用于在硬盘或内存中存储各种数据


II. 渲染详解

下面详细说一下渲染引擎，渲染引擎在界面呈现的过程中扮演非常重要的角色，我们以最受欢迎的webkit的渲染流程作为展示，它的渲染图如下所示

![webkit渲染过程](https://user-images.githubusercontent.com/13817144/54363443-e9f1d900-46a5-11e9-8c21-14e5c42f816f.png)

简单来说渲染过程就是分别进行css解析和html解析，生成cssom树和dom树，两者结合生成渲染树。计算布局，最后绘制到屏幕上。说一下其中需要注意的点：

1. html解析是一个渐进的过程，为了尽快展现页面，浏览器会一边加载一边渲染
2. js的执行会阻塞css和html解析。渲染引擎与js解释器是相互独立的，在渲染过程中js解释器（或者说js引擎）可能会操作dom或css，这些都会影响最终生成的结果，这也是为什么js会阻塞dom执行的原因。因此一般讲js放在页面最后或者使用defer和async属性（async等js下载完后立即执行，defer是等html解析完后执行）
3. html解析的过程中遇到js会将控制权交给js解释器，等js执行完后，再由js解释器将控制权交给渲染引擎
4. 改变样式和dom结构会引起重绘或重排（回流）。改变布局属性如margin，padding等会让渲染引擎重新计算布局，改变background，color等属性会让渲染引擎进行重新绘制


III. 数据存储

最后正好在这里总结下数据存储，现代浏览器中的存储通常分为三类`cookie`，`localStorage/sessionStorage`和`indexDB`。

`cookie`通常用作存储用户信息，每次发送同源请求都会一同被发送。它的大小一般为4k，通常用作用户身份校验

`localStorage/sessionStorage`作为浏览器存储一般大小为5M-10M。用键值对进行存储，键与值都为字符串。`localStorage`与`sessionStorage`的区别是`localStorage`会永久储存，除非主动删除。而`sessionStorage`会在tab关闭后消失。

`indexDB`属于浏览器数据库级别，由于目前还没有遇到过使用的场景，故先不介绍。
</p>
</details>

<details>
<summary>浏览器核心机制</summary>
<p>


I. 事件循环

js代码执行依赖于事件循环机制，事件循环机制具体概念见下图：

![事件循环机制](https://user-images.githubusercontent.com/13817144/54365221-6afe9f80-46a9-11e9-8a2c-2dbde2c7022d.png)

1. 执行栈运行过程中，执行同步代码。如果遇到异步代码，开始执行异步代码（setTimeout和xhr等webapis会由浏览器执行，待完成后将回调函数放入任务队列）。将异步回调放入任务队列，微任务进微任务队列，宏任务进宏任务队列
2. 执行栈为空后，检查微任务队列，如果有任务，则逐个执行直到微任务队列为空
3. 然后检查宏任务队列，执行第一个宏任务，进入执行栈执行，如此循环

任务分为宏任务和微任务
微任务一般有：

- process.nextTick
- Promise

宏任务有：

- setTimeout/setInterval
- I/O task


II. v8垃圾回收机制

v8中的垃圾回收算法主要分为三种

- scavenge：一种复制算法， 主要处理生命周期短的对象。存在两个semispace空间，分别是from和to空间。每次内存分配都会从from中进行分配。进行回收时，遍历from空间，将存活对象从from空间移动到to空间。完成后进行from和to的角色交换
- mark-sweep：标记清除。将已存活对象进行标记，清除没有被标记的对象
- mark-compact：标记整理。将存活对象移动至一侧，然后清除边界外的内存

它们的特点如下表所示

| 回收算法 | 速度 | 空间开销 | 是否移动对象 | 是否有碎片 |
| ----| --- | --- | --- | --- |
| scavenge     | 快   | 大 | 否 | 无 |
| mark-sweep   | 中等 | 小 | 否 | 有 |
| mark-compact | 慢  | 小 | 是 | 无 |

这三种算法不存在绝对优劣，三种结合使用才能达到更优的回收效果。

v8分配内存分为新生代和老生代。生命周期短的在新生代中使用scavenge进行内存清理。当对象已使用scavenge清理过并且from的使用率超过25%的时候，将该对象放入老生代中，这个过程叫做晋升。老生代中使用mark-sweep和mark-compact算法，这两种算法是依据情况交替使用的。
</p>
</details>


<details>
<summary>CSSOM API</summary>
<p>
  
  
CSSOM是css对象模型，通过cssom api我们可以访问和修改css样式。它分为两部分分别是CSSOM API和CSSOM View Api。

### CSSOM API

我们先来说下CSSOM API。我们如果需要获取样式表，可以使用`document`上的`styleSheets`属性来获取，样式表中的规则则可以在StyleSheet上使用`cssRules`属性获取。cssRules返回的列表包括多个cssRule对象，最常用的对象是`CssStyleRule`对象，该对象有`selectorText`和`style`两个属性，可以分别用来获取渲染器和样式。（注：`selectorText`是字符串类型，`style`是对象），这些属性都可以直接进行修改，从而改变样式。

```javascript
document.styleSheets[0].cssRules[0]
```

另外cssdom api还提供一个获取计算后样式的api，它在`window`对象上，名为`getComputedStyle`

```javascript
window.getComputedStyle(elt, pseudoElt);
```

第一个参数是要查询的元素，第二个参数可选，用于选择伪元素。

### CSSOM View API

下面说下CSSOM View Api，这部分API可以视作DOM API的扩展，它在原本的Element元素上添加了显示相关的API，总的来说分为三类，窗口部分，滚动部分和显示部分。

#### 窗口部分

窗口部分API用于操作浏览器窗口的位置、大小等

- `moveTo(x, y)`，窗口移动到指定坐标
- `moveBy(x, y)`，窗口移动指定距离
- `resizeTo(x, y)`，窗口缩放到指定大小
- `resizeBy(x, y)`，窗口缩放指定尺寸

此外窗口API还规定了`window.open`的第三个参数

```javascript
window.open("about:blank", "_blank" ,"width=100,height=100,left=100,right=100" )
```

#### 滚动部分

滚动部分分为视口滚动和元素滚动，这两部的API是不同的

视口滚动的API在`window`对象上，这些API包括：

- `scrollX`，视口横向滚动距离（别名`pageXOffset`）
- `scrollY`，视口纵向滚动距离（别名`pageYOffset`）
- `scroll(x, y)`，视口滚动到指定位置（别名`scrollTo`）
- `scrollBy(x, y)`，视口滚动指定距离

元素滚动API包括：

- `scrollLeft`，元素横向滚动距离
- `scrollTop`，元素纵向滚动距离
- `scrollHeight`，元素滚动内容高度
- `scrollWidth`，元素滚动内容宽度
- `scroll(x, y)`，视口滚动到指定位置（别名`scrollTo`）
- `scrollBy(x, y)`，视口滚动指定距离
- `scrollIntoView(arg)`，滚动元素所在的父元素，使得元素滚动到可见区域，可以通过arg来指定滚动到中间、开始或最近

#### 布局部分

布局部分也分为全局API和元素API

全局布局API挂载在`window`对象上，全局API包括：

- `innerHeight`，视口高度
- `innerWidth`，视口宽度
- `devicePixelRatio`，用于表示物理像素和css像素的关系
- `outerHeight`，浏览器高度
- `outerWidth`，浏览器宽度
- `screen.height`，屏幕高度
- `screen.width`，屏幕宽度

元素布局API包括：

- `getClientRects(ele)`，返回一个列表，包含该元素内部所有盒的的信息
- `getBoundingClientRect`，返回元素所有盒包裹的矩形区域的信息

盒子的信息是一个对象，可以通过`top`、`left`、`right`、`bottom`、`width`、`height`、`x`、`y`来获取盒子的位置和大小信息

</p>
</details>


<details>
<summary>跨标签页通信</summary>
<p>


跨标签页通信这里主要介绍4种方法

### BroadcastChannel

BroadcaseChannel API允许同源脚本发送消息到其他的浏览器上下文（包括windows/tabs，iframes， workers）。

它的使用方法是：

1. 使用onmessage事件来接收消息，它接收一个event对象，数据存储在event.data中（data能够是字符串或者其他任何被结构化克隆算法支持的对象（Strings, Objects, Arrays, Blobs, ArrayBuffer, Map）
2. 使用postMessage来发送对象
3. 发送完毕后可以使用close方法来关闭通信管道

这种方法的缺点是兼容性不好，并且有同源限制

### ShareWorker

worker是一种运行在非主线程上的脚本，SharedWorker与普通worker的区别就是可以在同源上下文中（包括windows/tabs，iframes， workers）共享

它的使用方法是：

1. 通过new SharedWorker(workerpath)来创建一个SharedWorker对象
2. 通过worker.port来获取MessagePort对象（使用该对象进行通信）
3. port.onmessage可以用来监听接收事件，数据存储在event.data中（data的结构与BroadcastChannel中相同）（注意如果使用addEventListener来添加message监听事件，那么需要使用worker.start()来手动开启，直接使用onmessage属性监听会隐式调用该方法）
4. 使用postMessage来发送对象
5. 在worker中同样需要获取各个上下问的port来与之进行通信，port可以在onconnect事件触发的时候从e.ports[0]中进行获取

这种方法的缺点是兼容性一般，并且有同源限制

### postMessage

postMessage是window对象上的一个方法，可以突破同源限制来进行不同tab间的通信，只要正确使用这种方法很安全

它的使用方法是：

1. 获取window.open()对象返回的窗口获取iframe窗口
2. 在要接受数据的窗口进行window.onmessage的监听，参数为event（event包含origin，data等属性）
3. 在获取到的窗口对象instance上，调用instance.postMessage方法，第一个参数为要传输的data，第二个参数为targetOrigin，可以传入*表示所有域都允许，为了安全，最好传入目标域

这种方法的缺点是兼容性不好，但这是唯一不受同源限制的方法

### localStorage

localStorage是浏览器的存储对象，配合storage事件可以实现跨标签页通信。

它的使用方法是：

1. 利用同源上下文可以读取相同localStorage的特性来进行通信，使用localStorage.setItem设置数据，使用localStorage.getItem读取数据
2. 利用window.onstroage事件来监听存储事件，从而实现通信，storage事件的参数event（拥有属性oldValue，newValue，key， url等）在chrome中测试，sessionStroage并没有触发storage事件

这种方法的兼容性很好，这也有自己的缺点

1. 有同源限制
2. 存储相同的值无法触发storage事件
3. storage事件在chrome/firefox中不会在当前页面触发

</p>
</details>


<details>
<summary>内存泄漏</summary>
<p>


以下几种情况容易造成内存泄漏：

1. 意外的全局变量
2. 闭包
3. dom引用
4. 定时器
5. 事件监听

</p>
</details>

<details>
<summary>安全</summary>
<p>


### xss

xss全称Cross Site Script（跨站脚本攻击），利用客户端对服务端的信任，从服务器中读取的内容可能包含用户插入的恶意脚本

防护手段：

- 对用户内容进行过滤和转义
- 使用CSP进行脚本执行限制


### csrf

csrf全称Cross Site Request Frogrey（跨站请求伪造），利用服务器对客户端的信任，借用用户身份验证信息对服务器进行请求

防护手段：

- 对于可以修改的内容的接口使用Restful形式的接口
- cookie设置为secure和httpOnly
- 使用refer或者在客户端生成token每次用来校验请求是否合法
</p>
</details>

<details>
<summary>Service Worker</summary>
<p>


Service Worker是web worker的一种，主要用来构建PWA，目前主流浏览器都已支持。

它的生命周期如下图所示：

![sw-lifecycle](https://user-images.githubusercontent.com/13817144/54370160-1f042880-46b2-11e9-860d-e8b93aaa26b0.png)

更多详细内容可以看[这里](https://developers.google.com/web/fundamentals/primers/service-workers/?hl=zh-cn)

真实项目中更多的是使用[workbox](https://developers.google.com/web/tools/workbox/)来使用sw
</p>
</details>


## 🍑NETWORK

<details>
<summary>OSI网络模型</summary>
<p>


OSI网络模型分为7层，它们的顺序、主要功能和对应的协议见下图

![seven-layers-of-OSI-model](https://user-images.githubusercontent.com/13817144/54419012-638ad500-4741-11e9-816c-78c52b8766d6.png)
</p>
</details>

<details>
<summary>TCP</summary>
<p>


tcp主要需要了解连接建立和断开的过程，详细过程见下图

![TCP三次握手与四次挥手](https://user-images.githubusercontent.com/13817144/54419184-ced4a700-4741-11e9-97ff-7e3ccc0f73b5.png)
</p>
</details>

<details>
<summary>HTTP</summary>
<p>


I. 各http版本及功能

<table>
  <thead>
    <tr>
      <td>名称</td>
      <td>特点</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>http 0.9</td>
      <td>
        <ul>
          <li>只有GET方法</li>
          <li>没有版本号</li>
          <li>不支持请求头/响应头</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>http 1.0</td>
      <td>
        <ul>
          <li>加入了POST，HEAD等方法</li>
          <li>响应头第一行使用HTTP/1.0指定版本号</li>
          <li>支持请求头/响应头</li>
          <li>支持请求头/响应头</li>
          <li>加入响应码</li>
          <li>支持代理</li>
        </ul>
      </td>
    </tr>
     <tr>
      <td>http 1.1</td>
      <td>
        <ul>
          <li>加入OPTIONS等方法</li>
          <li>添加新的响应码</li>
          <li>加入持久化连接keep-alive</li>
          <li>缓存控制</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>http 2.0</td>
      <td>
        <ul>
          <li>分帧层。采用二进制进行编码。帧是HTTP2.0的最小通信单元，它包含帧头，至少标识了属于哪个数据流</li>
          <li>头部压缩。客户端和服务端同时维护和更新一个header fields表，来减少头部传输字节的大小</li>
          <li>多路复用。可以在http连接上同时进行多个请求，因为数据路可以交错传输，接收之后进行组合</li>
          <li>优先级。优先处理高优先级的请求/相应</li>
          <li>服务器推送。在客户端请求某个资源时，同时将未来可能要请求的资源推送给客户端</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>https</td>
      <td>
        通信过程
        <ul>
          <li>服务端将公钥加入数字证书中并返回给服务器</li>
          <li>客户端和服务端协商出通信密钥</li>
          <li>使用通信密钥加密信息，然后使用公钥加密通信密钥</li>
          <li>进行http通信</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

II. http常见状态码

| code | message |
| --- | --- |
| 100 | Continue |
| 101 | Switching Protocol |
| 200 | Ok |
| 206 | Partial Content |
| 304 | Not Modified |
| 307 | Temporary Redirect |
| 308 | Permanent Redirect |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |
| 502 | Bad Gateway |
| 504 | Gateway Timeout |


III. http缓存

| 分类 | http请求头/响应头 | 说明 |
| --- | --- | --- |
| 强缓存 | catch-control | 使用max-age相对时间控制缓存时间，值为no-cache的时候表示不使用客户端缓存，当值为no-store时，连服务器缓存也不使用，catch-control的优先级高于expires |
| 强缓存 | expires | 使用绝对过期时间控制过期时间 |
| 协商缓存 | last-modified/if-modified-since | last-modified是response字段，表示文件最后一次修改时间，对应request字段if-modified-since |
| 协商缓存 | etag/if-none-match | etag是由文件内容生成的唯一标识，是response字段。request字段对应if-none-match |
</p>
</details>


<details>
<summary>跨域</summary>
<p>

跨域常用的手段有CORS和JSONP

更多详细信息查看[这里](https://github.com/xwchris/blog/issues/30)

</p>
</details>


<details>
<summary>WEBSOCKET</summary>
<p>


Websocket相比于HTTP常用于保持长连接进行，客户端与服务端需要进行频繁通信的场景。

它的使用步骤为：

- 构造函数WebSocket接收一个字符传作为websocket作为路径
- 实例拥有onopen、onmessage、onerror、onclose等方法
- ws. readyState表示状态
- 使用send发送对象
</p>
</details>

## 🍉FRAME

<details>
 <summary>React-内部算法</summary>
 <p>
  
  React核心相关有Diff、Fiber、Virtual DOM。
  具体情况查看该[仓库](https://github.com/xwchris/react-core-implement)，包括原理解释和代码实现
 </p>
</details>

<details>
 <summary>React-生命周期</summary>
 <p>
  
  React16之前的生命周期与React16之后的不同，所以用两张图来记忆。

 ![lifecycle](https://user-images.githubusercontent.com/13817144/54815302-9e09ea00-4ccc-11e9-9eb7-f8dc3f3b2cfc.jpeg)
  
 ![lifecycle](https://user-images.githubusercontent.com/13817144/54815312-a6fabb80-4ccc-11e9-9955-5edd0c90cb23.png)
 </p>
</details>

## 🍌OTHER

<details>
<summary>观察者和发布订阅模式的区别</summary>
<p>
 
 
这两种模式都是发布订阅类型的模式，它们的不同是彼此否相互感知
 
 ![53536375-228ba180-3b41-11e9-9737-d71f85040cfc](https://user-images.githubusercontent.com/13817144/54796774-91fe3800-4c8c-11e9-8ae9-75e5aa60fad4.png)
</p>
</details>

## 🍒OPTIMIZATION

这部分详细内容点击[这里](https://github.com/xwchris/blog/issues/72)
