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


最后来说下This，`this`实际上是与执行上下文相关的一个属性，它不可以被赋值。它是由调用者提供，并与调用写法相关的。那么`this`的值到底是什么哪？在global中`this`就是global本身。当`This`在函数上下文中的时候，分为几种情况。

#### 对象拷贝
#### 继承方式
#### 类型
#### 模块化
#### AS
#### BABEL编译过程
#### 防抖和节流
#### ES6/ES7

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
