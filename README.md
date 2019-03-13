![last commit](https://img.shields.io/github/last-commit/xwchris/collection.svg?style=flat)
![xwchris](https://img.shields.io/maintenance/xwchris/2019.svg?style=flat)
![issues](https://img.shields.io/github/issues/xwchris/collection.svg?style=flat)

# Blog
本blog主要用于记录和总结前端常用知识和相关内容的深入理解，帮助自己进行前端知识体系的构建，形成技术沉淀。也方便今后查询。如果很幸运的对你有一点帮助，那我真的很开心😊。

## 🍎BASIC

### JAVACRIPT

#### 核心
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


最后来说下This，`this`实际上是与执行上下文相关的一个属性，它不可以被赋值。它是由调用者提供，并与调用写法相关的。那么`this`的值到底是什么哪？在global中`this`就是global本身。当`This`在函数上下文中的时候，它的值取决于函数调用括号左边的值，有为几种情况。


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


#### 对象拷贝

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


#### 继承方式

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

```
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


#### 类型

I. 类型分类

Javascript六大基本类型
```javascript
Null, Undefined, String, Number, Boolean, Symbol
```

引用类型为`Object`

II. 类型判断

判断javascript中的基本类型除了`null`其他五种都可以使用`typeof`运算符。由于`typeof null === 'obejct'`，我们不能直接判断，对于null我们可以利用`String(null) === 'null'`来判断null

javascript中的内置类型如`Array`、`Date`、`Error`和`RegExp`都可以使用`Object.prototype.toString.call`来判断类型，该函数的返回值类似于`[object Array]`的形式

III. 类型转化

使用操作符操作不同类型的变量，两个变量会转换为同一个类型，基本原则如下

- 对于`\`、`*`、`%`、`-`等操作符，一律转为数字
- `Boolean/Null`类型转为相应的数字， `undefined`和对象会转为`NaN`，数组转数字会将第一项的值转换为数字，如果没有则为0
- 对于`+`操作符，有一个字符串都转为字符串
- 对象类型优先调用`valueOf`然后是`toString`


#### 模块化

javascript中常见的模块化方式有三种，分别是

- es modules
- commonjs
- amd

`es module`使用`import/export/export default`的语法，它是静态的

`commonjs`使用`require/module.exports`的语法，它是动态的，常用于同步加载（用于nodejs中）

`amd`使用`require/define`的语法，它是动态的，常用于异步加载（如requirejs）

这部分更多详细解释请参考[这里](https://medium.com/computed-comparisons/commonjs-vs-amd-vs-requirejs-vs-es6-modules-2e814b114a0b)


#### AST和Babel

AST全称Abrstract Syntax Tree（虚拟语法树），是对代码语法分析后得出的一棵语法树。

生成它的主要过程包括分词和解析（词法分析和语法分析），最终生成语法树。可以用该语法树分析代码，来做成各种工具如代码提示，代码格式化、代码转换等等很多应用

Babel就是AST的一种应用，Babel的过程是`parse => transform => generate`，详细步骤：

1. 使用[babel-parser](https://github.com/babel/babel/tree/master/packages/babel-parser)将es6/es7等语法解析成AST
2. 使用[babel-traverse](https://github.com/babel/babel/tree/master/packages/babel-traverse)对AST进行遍历转义，形成新的AST
3. 使用[babel-generator](https://github.com/babel/babel/tree/master/packages/babel-generator)将新的AST生成代码



#### 防抖和节流

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

#### ES6

ES6更多内容可以[这里](http://es6.ruanyifeng.com/)
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

### CSS
#### 基础知识
#### 技巧方面

## 🍐BROWSER
### 组成部分
### 渲染
### 核心机制
### 跨标签页通信
### 内存泄漏
### 安全

## 🍑NETWORK
### HTTP
#### 分类
#### 常见状态码
#### HTTP缓存

### 跨域
#### CORS
#### JSONP

### WEBSOCKET

## 🍒OPTIMIZATION
