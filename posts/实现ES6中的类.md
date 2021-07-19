---
title: "实现ES6中的类"
date: "2020-11-17"
tags: js
author: xwchris
desc: "为了真正理解ES6中类的概念，来学习类是如何实现的"
---

我们都知道在JS中，函数是“一等公民”，“类”的概念是在ES6中提出的，它好像跟我们自己写的函数构造器一样，但又有好像有些不一样的地方，那么它到底是如何实现的那？为了达到这个目的，我们利用babel来看下它编译后的代码。

## 不带继承的类
首先我们写一个简单的类，该类没有任何继承，只有一个简单的构造函数和`getName`函数
```js
class App {
	constructor(name) {
		this.name = name;
	}
	
	getName() {
		return this.name;
	}
}
```

然后babel一下，我们得到以下结果:
```js
"use strict";

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var App = function () {
  function App(name) {
    _classCallCheck(this, App);

    this.name = name;
  }

  _createClass(App, [{
    key: "getName",
    value: function getName() {
      return name;
    }
  }]);

  return App;
}();
```
东西还挺多，一眼并看不出来什么东西来，我们接下来一点点分析。我们先看最后一个函数：
```js
// 立即执行函数
var App = function () {

  // 构造函数变形成这样
  function App(name) {
	
    // 从这个函数的名字上看，好像是类调用检查，我们暂时先不看这个函数
    _classCallCheck(this, App);

    this.name = name;
  }

  // 调用了一个_createClass函数，应该是在给App附加一些值
  _createClass(App, [{
    key: "getName",
    value: function getName() {
      return name;
    }
  }]);

  // 返回一个名为App的函数
  return App;
}();
```

下面来看`_createClass`函数，该函数用来定义各个属性值：
```js
// 从返回值看，该函数是一个高阶函数
var _createClass = function () {

  // 为目标值添加多个属性
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {

      // 开始设定描述符对象
      var descriptor = props[i];

      // 默认不可枚举
      descriptor.enumerable = descriptor.enumerable || false;

      // 默认可配置
      descriptor.configurable = true;

      // 存在value值则默认可写
      if ("value" in descriptor) descriptor.writable = true;

      // 使用Object.defineProperty来设置属性
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  // 函数接收三个参数，分别是：构造函数，原型属性，静态属性
  return function (Constructor, protoProps, staticProps) {

    // 为构造函数prototype添加属性（即为用构造函数生成的实例原型添加属性，可以被实例通过原型链访问到）
    if (protoProps) defineProperties(Constructor.prototype, protoProps);

    // 为构造函数添加属性
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
```
好像很简单，跟我们平时使用函数实现差别不是很多，就相差了一个描述符的设定过程。最后看一下类调用检查函数`_classCallCheck`：
```js
// 类调用检查，不能像普通函数一样调用，需要使用new关键字
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
```
增加了错误处理，当我们调用方式不正确时，抛出错误。
## 模拟实践
我们简单实现以下没有继承的方式，来加深我们的印象，为了简化不添加错误处理和描述符的设定过程。
```js
var App = function(name) {
  this.name = name;
}

App.prototype.getName = function() {
  return this.name;
}

var app = new App('miniapp');

console.log(app.getName()); // 输出miniapp
```
这个很简单，就是我们平常模拟“类”所使用的方法，js所有对象都是通过原型链的方式“克隆”来的。注意我们这里的`App`不能叫做类，在js中没有类的概念。它是一个函数构造器，它可以被当做普通函数调用，也可以被当做函数构造器调用，调用函数构造器使用`new`关键字，函数构造器会克隆它的`prototype`对象，然后进行一些其他操作，如赋值操作，最后返回一个对象。

下面想一个问题，实现继承我们一般都是利用原型链的方式，像下面这样：
```js
var dog = {
  name: 'goudan'
};

var animal = {
	getName: function() {
    return this.name;
  }
}

// 对象的原型通过`__proto__`暴露出来（tip: 实际中不要这么写）
dog.__proto__ = animal;
console.log(dog.getName()); // 输出goudan
```
我们如何在两个类之间继承那？在ES6中实现很简单
```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

class Dog extends Animal{
  constructor(name) {
    super(name);
    this.name = name;
  }
}
```
如果我们自己实现一个要怎么实现，我们先写一个：
```js
var Animal = function(name) {
  this.name = name;
}

Animal.prototype.getName = function() {
  return this.name;
}

var Dog = function(name) {
	Animal.call(this, name);
  this.name = name;
}

Dog.prototype = Animal.prototype;

var dog = new Dog('goudan');
console.log(dog.getName()); // 输出goudan
```
但这种方式总感觉不太好，那么ES6中的的继承是如何实现的？下面我们看看继承的实现方式

## 继承的实现
还是用这个继承的例子：
```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

class Dog extends Animal{
  constructor(name) {
    super(name);
    this.name = name;
  }
}
```
我们babel一下，得到如下代码：
```js
"use strict";

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Animal = function () {
  function Animal(name) {
    _classCallCheck(this, Animal);

    this.name = name;
  }

  _createClass(Animal, [{
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }]);

  return Animal;
}();

var Dog = function (_Animal) {

  _inherits(Dog, _Animal);

  function Dog(name) {
    _classCallCheck(this, Dog);

    var _this = _possibleConstructorReturn(this, (Dog.__proto__ || Object.getPrototypeOf(Dog)).call(this, name));

    _this.name = name;
    return _this;
  }

  return Dog;
}(Animal);
```

`Animal`的代码与上节非继承的方式一致，直接跳过，来看下最后一部分`Dog`的代码：
```js
// 这还是一个高阶函数，与没有继承的对象相比，这里多出了两个函数_inherits和_possibleConstructorReturn
var Dog = function (_Animal) {

  // 继承函数，继承Animal的属性
  _inherits(Dog, _Animal);

  function Dog(name) {
    _classCallCheck(this, Dog);

    // 获取this
    var _this = _possibleConstructorReturn(this, (Dog.__proto__ || Object.getPrototypeOf(Dog)).call(this, name));

    _this.name = name;
    return _this;
  }

  return Dog;
}(Animal);
```
在来看`_inherits`如何实现的：
```js
// 继承函数
function _inherits(subClass, superClass) {

  // 异常情况处理
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  // 将父函数构造器的prototype“拷贝”（使用原型链的方式并不是真正的赋值）一份给子函数构造器的prototype
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  // 设定子函数构造器的原型为父函数构造器
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
```
这里面涉及到了`subClass.__proto__`和`subClass.prototype`，那么`__proto__`和`prototype`的区别是什么？

实际上`__proto__`是真正查找时所用的对象，而`prototype`是当你用`new`关键在来构建对象时被用来建造`__proto__`的，`Object.getPrototypeof(dog) === dog.__proto__ === Dog.prototype`。

函数`__possibleConstructorReturn`处理了构造函数有返回值的情况。这种情况下，需要改变`this`使用该返回值作为`this`。
```js
// 构造函数有返回值的情况
function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
```

## 实际模拟
看了上面的实现，我们模拟这个步骤，为了简化我们省去错误处理和特殊情况。
```js
var Animal = function(name) {
  this.name = name;
}

Animal.prototype.getName = function() {
  return this.name;
}

var Dog = function(name) {

  Animal.call(this.name);
  _this.name = name;
}

Dog.prototype = Animal.prototype;
```
实现完成后发现，跟我们[上一篇](https://xwchris.me/article/62760050-8a99-11e8-959e-f10086e564b5)文章结尾，猜想实现的一样，这就很尴尬，本来觉得这种写法不太顺眼，看官方的支持，现在看起来就顺眼多了-_-。与完整实现相比我们缺少了一些原型赋值的步骤`Dog.__proto__ = Animal`，但总体来说原理是一样的。