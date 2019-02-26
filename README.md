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


 - 变量对象
 - 作用域链
 - This


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
