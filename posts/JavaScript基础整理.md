---
title: "JavaScript基础整理"
date: "2017-08-04"
tags: js
author: xwchris
desc: "Javascript权威指南知识点提取与整理，待以后方便查阅，回忆，学习"
---

## 类型、值和变量
javascript中的算术运算在溢出或被零整除时不会报错。会用`Infinity`或`-Infinity`来表示。`0/0`会输出`NaN`。

javascript中的非数字值和任何值都不相等。包括它自身，也就是说判断非数字值应该用`x !== NaN`来判断。函数`isNaN()`也是用来判断数字是否为`NaN`。含有函数`isFinite()`，在参数不是`NaN`、`Infinity`或`-Infinity`的时候返回`true`。

负零值和正零值相等（甚至使用javscript的严格相等测试来判断）。这意味着这两个值一模一样，除非作为除数以外。

javascript采用了IEEE-754浮点数表示法，这种二进制浮点数表示法并不能精确的表示类似0.1着那样的数字。例如`(.3-.2) == (.2  - .1)`的结果是`false`，所以一般要采用整数来进行比较。

日期的月份是从0开始的，星期也是从0开始，0表示周末。

包装对象，在读取字符串、数字和布尔值的时候，表现的像对象一样。如果试图给其属性赋值，则会忽略这个操作，修改只是发生在临时对象上，而这个临时对象并未保存下来。如
```javacript
var s = "test";
s.len = 4;
var t = s.len; 
// t为undefined
```

javascript对象到字符串的转换会首先尝试`toString()`，然后尝试`valueOf()`否则抛出错误。对象到数字的转换会首先尝试`valueOf`，然后尝试`toString()`，否则抛出错误。
## 表达式和运算符
属性检测，检测一个对象是否有魔属性可以使用`in`，左侧是属性名，右侧是对象。也可以使用`!== undefined`来判断，但当属性存在，且值为`undefined`的时候，只能使用`in`。对象的`hasOwnProperty()`方法来检测既定的名字是否是对象的自有属性。对于继承属性它将返回`false`。

加法操作符的行为表现为：如果其中一个操作符是对象，则对象会遵循对象到原始值的转换规则转换为原始类值，日期对象通过`toString`方法来执行转换，其他对象则通过`valueOf()`方法执行转换（如果`valueOf()`方法返回一个原始值的话）。由于多数对象多不具备可用的`valueOf()`方法，因此他们会通过`toSting()`方法来执行转换。
在进行了对象到原始值的转换后，如果其中一个操作数是字符串的话，另一个操作数也会转换为字符串，然后进行字符串连接。否则，两个操作数都将转换为数字（或者NaN），然后进行加法操作。`null`转为数字会转换为0，`undefined`会转换为`NaN`。

`in`运算符希望它的左操作数是一个字符串或可以转换为字符串的值，希望它的右操作数是一个对象。如果右侧的对象拥有属性名为左操作数值的属性，该表达式返回`true`。

`instanceOf`运算符希望左操作数是一个对象，右操作数标识对象的类。如果左侧的对象是右侧类的实例，则表达式返回`true`，否则返回`false`。

`typeof`是一元操作符，放在单个操作数前面，操作数可以是任何类型。返回值为表示操作数类型的一个字符串。以下是`typeof`转换表。

x | typeof x
---|----
 undefined | "undefined"
 null | "object"
 true/false | "boolean"
 任意数字或NaN | "number"
 任意字符串 | "string"
 任意函数 | "function"
 任意内置对象（非函数）| "object"
 任意数组 | "object"
 
 `delete`是一元操作符，它用来删除对象属性或数组元素，`delete`希望它的操作数是一个左值，如果它不是左值，那么`delete`将不会进行任何操作，同时返回`true`。如果该属性不存在也会返回`true`。一些内置核心和客户端属性是不能删除的。当用`var`声明一个全局变量时，实际上是定义了全局对象的一个属性，创建这个属性是不可配置的，在非严格模式下，给一个未声明的变量赋值的话，javascript会自动创建一个全局变量，以这种方式常见的变量时全局对象的正常可配置属性，并且可以删除它们。
 
 ```js
 var trueval = 1; // 声明一个不可删除的全局变量
 fakeval = 2;
 delete trueval; // false 变量并没有被删除
 delete fakeval; // true 变量被删除
 
 o = {x:1}
 delete o.x // true
 delete o.x // true 什么也没做
 
delete o.toString // true 什么也没做，继承的属性不能删除
delete 1 // true 无意义

delete Object.property // false 不能删除，属性是不可配置的
function f() {}
delete this.f; // 不能删除全局函数
```

`void`是一元运算符，它出现在操作数之前，操作数可以是任意类型，操作数会照常计算，但忽略计算结果并返回`undefined`。

逗号运算符是二元运算符，它的操作数可以是任意类型。它首先计算左操作数，然后计算右操作数，最后返回右操作数的值。

## 语句
`with`用来临时扩展作用域链，它的语法如下
```js
with(object){
    // statement
}
```

严格模式使用`"use strict"`指令来声明，严格模式和非严格模式的区别如下：
1. 在严格模式中禁止使用`with`语句。
2. 在严格模式中，所有变量都要先声明，不能给未声明的变量、函数、函数参数、catch从句参数后去全局对象的属性赋值，这将会抛出一个错误。
3. 在严格模式中，调用函数（不是方法）中的一个`this`值是`undefined`。
4. 同样，在严格模式中，当通过`call()`或`apply()`来调用函数的时候，`this`的值就是通过`call()`或`apply()`传入的第一个参数（在非严格模式中，`null`和`undefined`值被全局对象和转换为对象的非对象值所代替）

## 对象
`Object.create()`用来创建一个继承另一个对象的新对象，第一个参数是对象是这个对象的原型，可以通过传入参数`null`来创建一个没有原型的新对象，但通过这种方式创建的对象不会继承任何东西，甚至不包括基础方法，比如`toString()`，通过原型继承创建一个新对象。
```js
// 通过原型继承创建一个新对象
function inherit(p) {
    if(p == null) throw TypeError(); 
    if(Object.create) {
        return Object.create(p);
    }
    var t = typeof p;
    if(t!=="object" && t!="function") throw TypeError();
    function f() {}
    f.prototype = p;
    return new f();
}
```

如果`o`中的属性`p`是继承属性，且它是只读的则，不能通过同名自有属性覆盖该继承属性。

`for/in`可以列出所有可枚举属性，EMCAScript5定义了两个用以枚举属性名称的函数，`Object.keys()`返回一个数组，包括所有的可枚举属性，`Object.getOwnPropertyNames()`，它与`Object.keys()`的区别是它返回所有自有属性，同时`for/in`与它们不同的是，可以列出继承属性。

 属性`getter和setter`，在ECMAScript5中，属性值，可以用一个或两个方法替换，这就是存取器属性`accessor property`，他和数据属性`data property`不同，存取器属性存入会调用`set`方法，读取会调用`get`方法，因此存入可能会跟读取的数据不相同。定义存取器属性最简单的方法是使用对象直接两语法的一种扩展写法:
```js
var o = {
//普通的数据属性
  data_prop : value,
    
	//存取器属性一般是成对出现，注意get set后面没有冒号，同时他们用逗号分隔
	get accessor_prop() {},
	set accessor_prop() {}
}
```

属性特性，对于数据属性来说包括它的值（value），可写性（writable），可枚举性（enumerable）和可配置性（configurable）。对于存取器来说包括读取（get），写入（set），可枚举性和可配置性，ECMAScript5定义了一个属性描述符（property descriptor）的对象。获取这个对象可以使用，`Object.getOwnPropertyDescriptor()`函数。第一个参数是对象，第二个参数是属性。这个函数只能获取自由属性的描述符。要获取继承属性的需要遍历原型链。设置属性的特性可以使用`Object.defineProperty()`，参数分别为对象，属性，要修改的值,如果要一次配置多个属性使用`Object.defineProperties()`函数，参数分别为对象和映射表。
```js
var t = {
    x : 1
}

Object.defineProperty(t,"x",{
    value : 2,
    writable : true,
    enumerable : true,
    configurable : true
});

//定义多个属性
Object.defineProperties(t,{
    x : { value : 6, writable : false}, 
    y : { value : 7, enumerable : true},
    r : {
        get : function(){ return r},
        enumerable : true
    }
});
```
下面是完整的属性特性的规则，不符合规则的都会抛出类型错误异常：

1. 如果对象是不可扩展的，则可以编辑已有的自由属性，但不能给他添加新属性。
2. 如果属性是不可配置的，则不能修改它的可配置性和可枚举性。
3. 如果存取器属性是不可配置的，则不能修改其getter和setter方法，也不能将它转换为数据属性。
4. 如果数据属性是不可配置的，则不能将它转换为存取器属性。
5. 如果数据属性是不可配置的，则不能将它的可写性从false修改为ture，但可以从true修改为false。
6. 如果数据属性是不可配置且不可写的，则不能修改它的值。然而可配置但不可写属性的值是可以修改的（实际上是先将它标记为可写的，然后修改它的值，最后转换为不可写的。
给`Object.prototype`添加一个不可枚举的`extend`方法，这个方法用来复制一个对象的所有属性。
```js
Object.defineProperty(Object.prototype,"extend",{
    writable : true,
    enumerable : false,
    configurable : true,
    value : function(o) {
        //得到所有的自由属性，包括不可枚举属性
        var names = Object.getOwnPropertyNames(o);
				
        //遍历它们
        for(var i = 0; i < names.length; i++) {
				
            //如果存在则跳过
            if(names[i] in this) continue;
						
            //获得o中的属性的描述符
            var desc = Object.getOwnPropertyDescriptor(o,name[i]);
						
            //用它给this创建一个属性
            Object.defineProperty(this, name[i], desc);
        }
}
```
对象的原型属性，原型属性是在实例对象创建之初就设置好的，通过对象直接量创建的对象使用`Object.prototype`作为他们的原型。通过`new`创建的对象使用构造函数的`prototype`作为他们的原型。通过Object.create()创建的对象使用第一个参数作为他们的原型。获取一个对象的原型，在ECMAScript5中可以使用`Object.getPrototypeOf()`查询对象的原型，判断一个对象是否是另一个对象的原型，使用`isPrototypeOf()`方法，例如使用`p.isPrototypeOf(o)`来检测p是否是o的原型，需要注意的是`isPrototypeOf()`函数实现的功能和`instanceof`运算符非常类似。

对象的类属性，对象的类属性是一个字符串，用以表示对象的类型信息。ECMAScript5和ECMAPScript3都未提供设置这个属性的方法，并只有一种间接的方法可以查询它，默认的`toString()`方法，返回字符串`[Object class]`，不过，由于`toString()`方法很多都被重写了，为了能正确的调用，为了能够正确得调用`toString()`，必须间接的调用`Function.call()`方法,`Object.prototype.toString.call(o).slice(8,-1)`。

对象的可扩展性，他表示是否可以给对象添加新的属性，所有的内置对象都默认是可扩展的，ECMAScript5定义了用来查询用来查询和设置对象可扩展性的函数。`Object.esExtensible()`来判断对象是否是可扩展的。

`Object.preventExtensions()`，将待转换的对象作为参数传进去，注意，一旦将对象转换为不可扩展的，就没办法再将其转换为可扩展的了。可扩展属性的目的是将对象锁定，避免外界的干扰。`Object.seal`,`Object.freeze()`等也有类似但更复杂的效果。

序列化对象，ECMAScript5提供了内置的`JSON.stringify()`和`JSON.parse()`来序列化和还原`JavaScript`对象，`JSON`的语法是`JavaScript`语法的子集，它并不能支持`JavaScript`中的所有值，`NaN``、Infinity`和`-Infinity`序列化的结果是`null`。同时`JSON.stringify()`只能序列化对象可枚举的自由属性。函数、`RegExp`、`Error`对象和`undefined`值不能序列化和还原，同时可以通过传入第二个参数来定制序列化和还原操作。

## 数组
 数组直接量的语法允许有可选的结尾的逗号，故`[,,]`只有两个元素而非三个。
 
 数组`new Array()`不传入参数时创建一个空数组，传入一个参数时表示的是长度，传入多个参数时，显式指定数组的元素。
 
所有数组都是对象，可以为其创建任意属性名的属性，所有的索引也是属性名，调用使用索引数值的时候，JavaScript会自动转换为字符串，当为处于`0~2^32 - 2`的索引赋值的时候，会自动维护数组的length长度，这意味着数组没有越界一说，即使不存在也只会返回`undefined`。

数组的另一个特性是，当为`length`属性赋值为一个小于当前长度的非负整数n时，当前数组中的那些索引值大于等于n的元素将从中删除。

数组的添加和删除，首部添加`unshift()`、尾部添加`push()`、尾部弹出`pop()`、首部弹出`shift()`同时也可以用`delete a[0]`的方式来删除数组，但这样不会改变数组的长度。

`Array.prototype`中定义了一些方法，`Array.join()`用来将所有的元素用指定的字符连接起来，`Array.split()`是`Array.join()`的反向操作，用来分割字符串。`Array.reverse()`用来将数组元素反序，`Array.sort()`用来排序数组元素，当不带参数时，默认按照字母元素排序，`undefined`会被排到最后面，为了指定排序规则，可以传入一个比较函数。假设第一个参数应该在前，比较函数应该返回一个小于0的数值。`Array.concat()`用来创建并返回一个新的数组，它的元素包括调用`concat()`的原始数组的元素和`concat()`的每个参数。如果参数中有一个是数组，则连接的是数组的元素，而非数组本身。但是`concat()`不会扁平化数组的数组，也不会修改调用的数组。`Array.slice()`用来返回子数组，第一个参数指定开始的位置，第二个参数指定结束的位置，可以是负数，表示是倒数第几个从-1倒数第一个开始，`Array.splice()`方法是在数组中插入或删除元素的通用方法。第一个参数指定要删除或插入的位置，第二个参数指定要删除的元素个数，往后的参数指定要插入的元素。区别于`concat()`，`splice()`会插入数组本身而不是元素。同时数组同其他对象一样拥有`toString()`方法。该方法针对数组，将每个元素转换为字符串，并且输出用逗号分隔的字符串列表。
```js
[1,[2,3]].toString() //1,2,3
[1,[2,3]].join() //1,2,3
[1,[2,3]].join("-")  //1-2,3
```

ECMAScript5定义了9个新的数组方法来遍历、映射、过滤、检测、简化和搜索数组。首先这些数组方法大多数第一个参数接受一个函数，对不存在的元素不调用该函数，调用提供的函数通常包括三个参数分别是，数组元素，元素索引，数组本身，通常忽略后两个参数。大多数数组方法的第二个参数是可选的，如果有，则被调用的函数被看作是第二个参数的方法。也就是说，在调用函数时传递进去的第二个参数作为它的`this`关键字的值来使用。这些数组方法不会修改原数组。`forEach()`用来从头至尾遍历数组，为每个元素调用指定的函数，没有办法提前终止遍历，除非用`try`抛出异常。`map()`将调用的数组的每个元素传递个指定的函数，并返回一个数组，它包含该函数的返回值。`filter()`方法返回的是调用的数组的一个子集，传递的函数用来逻辑判断，如果返回`true`则将该元素添加到一个新的数组中。`every()`和`some()`用来逻辑判断，`every()`所有元素都返回`true`该函数返回`true`,`some()`只要有一个返回`true`就会返回`true`,注意在数学惯例上，对于空数组`every()`返回`true`，`some()`返回`false`。`reduce()`和`reduceRight()`方法使用指定的函数将数组元素进行组合。他们与前面的函数不同，他们的第一个参数是函数，调用函数的参数第一个是传入的初始值，该函数的返回值也会传给这个数，第二个参数是数组元素，`reduce()`的第二个参数是调用函数第一个参数的初始值，如果没有指定这个值，则默认会使用数组的第一个元素作为初始值，在空数组上，不带初始值参数调用`reduce()`将导致类型错误异常。如果数组只有一个元素而且没有定义初始值，或者定义了初始值但数组为空，`reduce()`都会直接返回一个值，而不会进行任何处理，`reduceRight()`与`reduce()`类似，不同的是它是从右到左处理数组的。`indexOf()`和`lastIndexOf()`用来搜索整个数组中具有的指定的值，并返回他们的索引或者没有找到返回`-1`。`indexOf()`从头搜索而`lastIndexOf()`则反向搜索，第一个参数是需要搜索的值，第二个参数是开始的位置。

判断数组问题。在ECMAScript3中要区分数组和非数组是很困难的，原因的`typeof`只能返回`Object`（并且对于除了函数以外的所有对象都是如此），`instanceof`操作符只能用于简单的情形`[] instanceof Array`使用`instanceof`的问题是，当浏览器有多个窗口时（有frame存在），由于每个窗口口有自己的环境，有自己的全局对象，每个全局对象又自己的构造函数。因此一个窗体中的对象不可能是另外窗体中的构造函数的实例。这说明`instanceof`并不可靠。解决方案是查看对象的类属性。同时在ECMAScript5中已经加入了`Array.isArray()`来判断是否是数组，`Array.isArray([])`会返回`true`。
```js
var isArrray = Array.isArray || function(o) {
    return typeof o === "object" && Object.prototype.toString.call(o) === "[Object Array]";
}
```

类数组对象，属性名是数字索引，并且由`length`长度的对象，可以看成是类数组对象。JavaScript数组方法是特意定义为通用的，因此他们不仅应用在真正的数组而且在类数组对象上都能正确工作。在ECMAScript5中，所有的数组方法都是通用的。在ECMAScript3中，除了`toString()`和`toLocaleString()`以外的所有方法也是通用的。但由于对象没有继承`Array`的方法，所以调用的时候要用`Function.call()`的方法。下面这个函数用来检测类数组对象。
```js
function isArrayLike(o) {
    if(o &&                         //o非null、undefined
       typeof o === "object" &&     //o是对象
       isFinite(o.length) &&        //o.length的限制
       o.length >= 0 &&
       o.length === Math.floor(o.length) &&
       o.length < 4294967296)
       return true;
    else
       return false;
}
```

作为字符串的数组，在ECMAScript5中字符串的行为类似于只读的数组。除了用`charAt()`方法来访问外，可以使用方括号来访问，这个事实使得通用的数组方法可以应用在字符串上。但是，字符串是不可修改的，故把他们当做数组看待是，它们是只读的。如`push()`、`sort()`、`reverse()`、`splice()`等数组方法会修改数组，在字符串上是无效的。

## 函数
函数每次调用会拥有`this`关键字的值，这就是本次调用的上下文，如果函数挂载在一个对象上，那么`this`就指代这个对象。

函数声明语句“被提前”到外部脚本或外部函数作用域的顶部，所以以这种方式声明的函数，可以在它定义之前调用。不过以表达式定义的函数，只是变量的声明提前了，但给变量赋值是不会提前的。同时函数的如果没有`return`语句，会默认返回`undefined`。

函数声明语句并非真正的语句，它们可以出现在一般代码里，或者内嵌在其它函数中，但它们不能出现在循环、条件判断、或者try/cache/finally以及with语句中。此限制仅适用于语句声明形式定义的函数。函数定义表达式可以出现在JavaScript代码的任何地方。

判断是否是严格模式
```js
var strict = (function() { return !this;}());
```

构造函数，如果函数或者方法调用用之前带有关键字`new`，它就构成了构造函数，凡是没有形参的构造函数调用都可以省略圆括号。构造函数通常不适用`return`关键字，他们通常初始化新对象，当构造函数的函数体执行完毕时，它会显示返回。在这种情况下，构造函数调用表达式的返回结果就是这个新对象的值。然而如果构造函数显示的使用`return`语句返回一个对象，那么调用表达式的值就是这个对象。

`arguments`是指代函数的实参，它是一个类数组对象，它有一个重要的功能，就是可以让函数可以操作任意数量的实参，注意，不定实参函数的实参个数不能为零。除了数组元素，实参对象还定义了`callee`和`caller`，他们在ECMAScript5严格模式中，对这两个属性的读写操作都会产生一个类型错误。而在非严格模式下，ECMAScript标准规范规定`callee`属性指代当前正在执行的函数。`caller`是非标准的，但大多数浏览器都实现了这个属性，他指代调用当前调用正在执行的函数的函数。通过`caller`属性可以访问调用栈。

函数可以自定义自己的属性，因为函数也是一种对象，有时候为了保存函数中的某个值，可以为该函数创建一个属性，全局变量当然也可以，但有时候只是这一个函数用，写成全局变量会比较乱，所以用属性的方式更好。

作为命名空间的函数，有时候为了不污染其全局命名空间，需要创建一个命名空间，让全局变量变成局部变量。这是立即调用函数，这种命名空间技术很常见。
```js
(function() {
    // 模块代码
}());
```

闭包。函数对象可以通过作用域链相互关联起来，函数体内部的变量都可以保存在函数作用域内，这种特性在计算机科学文献中称为闭包。闭包主要应用在在外部依旧能改变和读取函数里定义的局部变量，内部嵌套函数可以访问外部函数内定义的变量，通常作为返回值返回。
```js
function counter() {
  var n = 0;
  return {
    count: function() {return n++;},
    reset: function() {n = 0;}
  }
}
var c = counter(),d = counter();  //创建两个计数器
c.count()                         // => 0
d.count()                         // => 0: 它们互不干扰
c.reset()


// 从技术角度看，其实可以将这个闭包合并成属性存取方法getter和setter。
function counter(n){
    return {
        get count() {
            return n++;
        }
        set count(m){
            if(m>=n) n = m;
            else throw Error("error");  //不允许变小
        }
    }
}
var c = counter(1000)
c.count  //1000
c.count  //1001
c.count = 2000
```

我们要特别小心那些不希望共享的变量往往不经意共享给了其他闭包。如下面的例子。因此要注意关联到闭包的作用域链都是“活动的”。嵌套的函数不会将作用域内的私有成员复制一份，也不会对所绑定的变量生成静态快照。
```js
function constfuncs() {
    var funcs = [];
    for(var i = 0;i < 10;i++){
        funcs[i] = functin() {return i;};
    }
    return funcs;
}
var funcs = constfuncs();
funcs[5](); //当constfuncs()返回时，变量i的值是10，所有的闭包都共享这一个值
```

书写闭包的时候还要注意一件事情，`this`是Javascript的关键字，而不是变量。所以在闭包中调用的`this`不是同一个`this`，可以将`this`转存为一个变量。
```js
var self = this
```

函数本身也有`length`属性，它与`arguments.length`不同，前者表示形参个数，后者表示实参个数。

函数的`toString()`方法大多数都会返回函数的完整源码。内置函数往往返回一个类似`[native code]`的字符串作为函数体。

`Function()`构造函数，它可以传入任意数量的字符串实参，最后一个实参所表示的文本就是函数体。它可以包含任意的JavaScript语句，每两条语句之间用分号分隔。最重要的一点，`Function()`构建的函数并不是使用词法作用域，相反，函数体代码的编译，总是会在顶层函数执行。

`bind()`是在ECMAScript5中新增的方法，它和`call`使用方法类似，不同之处是`bind()`返回的是一个新的函数。

高阶函数就是操作函数的函数，它接受一个函数作为参数并返回一个函数。记忆函数可以用高阶函数实现，通常用在递归中像下面这样：
```js
function memorize(f) {
    var cache = {}; //将值保存在闭包内
    return function() {
        var key = arguments.length + Array.prototype.join.call(arguments,",");
        if (key in cache) return cache[key];
        else return cache[key] = f.apply(this,arguments);
    };
}

var factorial = memorize(function(n) {
                            return (n<=1) ? 1 : n * factorial(n-1);
                         });
factorial(5);
```

每个JavaScript函数（ECMAScript5中的`Function.bind()`方法返回的函数除外）都自动拥有一个`prototype`属性。这个属性的值就是一个对象，这个对象包含唯一一个不可枚举属性`constructor`。

## 正则表达式
正则表达式的字符类
字符 | 匹配
---|---
[...] | 方括号内的任意字符
[^...] | 不在方括号内的任意字符
. | 除换行符和其他Unicode行终止符之外的任意字符
\w | 任何是ASCII字符组成的单词，等价于[a-zA-Z0-9]
\W | 任何不是ASCII字符组成的单词，等价于[^a-zA-Z0-9]
\s | 任何Unicode空白符
\S | 任何非Unicode空白符的字符，注意\w和\S的不同
\d | 任何ASCII数字，等价于[0-9]
\D | 除了ASCII数字以外的任何字符，等价于[^0-9]
[\b] | 退格直接量（特例）

正则表达式的重复字符语法
字符 | 含义
---|---
{n,m} | 匹配前一项至少n次，但不能超过m次
{n,} | 匹配前一项n次或者更多次
{n} | 匹配前一项n次
? | 匹配前一项0次或者1次等价于{0,1}
+ | 匹配前一次或多次{1,}
* | 匹配前一项0次或多次等价于{0,}

正则表达式重复字符是尽可能多地匹配，而且允许后续的正则表达式继续匹配。因此，我们称之为“贪婪的”匹配。要进行非贪婪的匹配，只需在待匹配的字符后面跟随一个问号即可。

正则表达式的选择分组和引用，分组使用字符`|`它用于分割供选择的字符。例如`/ab|cd/`可以匹配`ab`，或者`cd`，注意，它类似于或，尝试匹配的次序是从左到右，知道发现匹配项就停止。`()`圆括号在正则表达式中有多个作用，第一个作用是把单独的项组合成子表达式。以便于一起处理。另一个作用是在完整的模式中定义子模式。第三个做义工是允许在同一个正则表达式的后部引用前面的子表达式。这是通过在`\`后加数字实现的。如`/(['"])[^'"]\1`这里要注意的是，对正则表达式中前一个子表达式的引用，并不是指对子表达式模式的引用，而是指的是与那个模式相匹配的文本的引用。这样，应用可以用于实施一条约束，即一个字符串各个单独部分包含的是完全相同的字符。上面的例子就要求单引号双引号必须匹配。`(?...)`只组合，把项合到一个单元，但不记忆于该组相匹配的字符

正则表达式中的锚字符

字符 | 含义
---|---
^ | 匹配字符串的开头，在多行检索中，匹配一行的开头
$ | 匹配字符串的结尾，在多行检索中，匹配一行的结尾
\b | 匹配一个单词的边界，简言之，就是位于字符\w和\W之间的位置，或位于字符\w和字符串的开头或者结尾之间的位置（但需要注意，[\b]匹配的是退格符）
\B | 匹配非单词边界的位置
(?=p) | 零宽正向先行断言，要求接下来的字符都与p匹配，但不能包括匹配p的那些字符
(?!p) | 零宽负向先行断言，要求接下来的字符不与p匹配

正则表达式修饰符，放在`/`符号之外，修饰符`i`用以说明模式匹配不区分大小写，修饰符`g`用以说明模式匹配应该是全局的，也就是说，应该找出被检索字符串中的所有匹配。修饰符`m`用以在多行模式中执行匹配，在这种模式下，如果待检测的字符串包含多行，那么^和$锚字符除了匹配整个字符串的开始和结尾之外，还能匹配每行的开始和结尾。

String对象的一些用以执行正则表达式模式匹配和检索替换操作的方法。String支持四种正则表达式的方法，最简单的是`search()`参数是一个正则表达式，返回第一个与之匹配的字串的起始位置，如果找不到匹配的字串，它将返回-1，如果它的参数不是正则表达式，则首先会通过`RegExp`构造函数将它转换成正则表达式，`search()`方法不支持全局检索，因为它忽略正则表达式参数中的修饰符`g`。`replace()`方法用以执行检索和替换操作。其中第一个参数是一个正则表达式或字符串，第二个参数是要替换的字符串。如果正则表达式有修饰符`g`则会替换所有匹配项，否则就只会替换第一个匹配项。正则表达式中使用圆括号括起来的子表达式有记忆功能。如果在替换字符串中出现了`$`加数字，那么`replace()`可以将指定的子表达式相匹配的文本来替换匹配的字符串。同时`replace()`方法的第二个参数可以是函数，该函数能动态的计算替换字符串。`match()`参数是正则表达式，如果有修饰符`g`则会返回一个匹配的数组，如果没有`g`也是返回数组，但第一个元素是匹配的数组，往后依次是匹配的子表达式。字符串的`split()`函数参数也可以是正则表达式如果在替换字符串中出现了`$`加数字，那么`replace()`将于指定的子表达式相匹配的文本来替换这两个字符。这是一个很有用。比如可以用它讲一个字符串中的英文引号替换为中文半角引号：
```js
//一段 文本起始于引号，结束于引号
//中间的内容不能包含引号
var quote = /"(^"*)"/g;

//用中文半角引号替换英文引号，同时要保持引号之间的内容（存储在$1）没有被修改
text.repace(quote,' “$1” ');
```

`RegExp()`构造函数带有两个参数，第一个参数包含正则表达式的主体部分，也就是直接量中两条斜线之间的部分，同时必须要将字符串中的`\`换成`\\`。第二个参数是可选的，可以传入单个修饰符或者他们的组合组成的字符串。
```js
var zipcode = new RegExp("\\d{5}","g");
```

`RegExp`对象包含5个属性。属性`source`是一个只读字符串，包含正则表达式的文本。属性`global`是一个只读的布尔值，用以说明这个正则表达式是否带有修饰符`g`。属性`ignoreCase`也是一个只读的布尔值，用以说明正则表达式是否带有修饰符`i`。属性`multiline`是一个只读的布尔值，用以说明正则表达式是否带有修饰符`m`。属性`lastIndex`是一个可读写的属性，用以保存当有修饰符`g`的时候，这个属性存储在整个字符串中下一次开始检索的位置。

`RegExp`对象定义了两个用于执行模式匹配操作的方法。`exec()`和`String`的`match()`方法很像，不过这个方法总是返回一个匹配，同时每次调用匹配后都会更改正则对象的`lastIndex`属性，下一次调用同一个正则表达式的时候，会从新的位置开始匹配。当`exec()`没有任何匹配结果的时候，它会将`lastIndex`重置为0，`test()`方法和`exec()`类似，只不过`test()`仅仅返回`true`或`false`。

## Web浏览器中的JavaScript
引入js通常使用`<script>`标签，使用`src`属性就像指定的JavaScript文件的内容直接出现在标签之间一样。需要注意的是，即使指定了`src`属性并且`<script>`标签之间没有内容，结束的`</script>`标签也不能丢。在XHTML中，在此处可以使用简短的`<script/>`标签。同时在XHTML中，`<script>`标签中的内容被当做其他内容一样对待。如果要使用XHTML，最好把所有的JavaScript代码放入一个CDATA部分中:
```js
<script><![CDATA[
// 这里是你的JavaScript代码
]]></script>
```

正常情况下，浏览器在解析html源文件的时候当遇到外部`<script>`标签的时候会停止解析，先下载脚本并执行后才会继续解析dom元素。但是如果在`<script>`标签中加入`async`或`defer`后就可以实现异步加载，不会阻塞`dom`的构建两者都支持onload事件回调来解决需要该脚本来执行的初始化。
```js
<script async src="myAsyncScript.js" onload="myInit()"></script>
<script defer src="myDeferScript.js" onload="myInit()"></script>

//异步载入并执行脚本在不支持这两个属性时，可以使用其他技术
function loadasync(url){
    var head = document.getElementsByTagName("head")[0];
    var s = document.createElement("script");
    s.src = url;
    head.appendChild(s);
}
//loadasync函数会动态的载入脚本到文档中，成为正在执行的JavaScript程序的一部分
```

同源策略，同源策略是对JavaScript代码能够操作那些Web内容的一条完整的安全限制。具体来说，脚本只能读取和所所属文档来源相同的窗口和文档的属性。文档的来源包含协议、主机，以及载入文档的URL端口。从不同Web服务器载入的文档具有不同的来源。通过统一主机的不同端口载入的文档具有不同的来源。使用`http`协议载入的文档和使用`https`协议载入的文档具有不同的来源，即使他们来自同一个服务器。同源策略还应用于使用`XMLHttpRequest`生成的HTTP请求。这个对象允许客户端JavaScript生成任意的HTTP请求到脚本所属文档的Web服务器，但是不允许脚本和其他Web服务器通信。

不严格的同源策略。同源策略给那些使用多个子域的大站点带来了一些问题。例如，来自`home.example.com`的文档的脚本想要合法的访问`developer.example.com`载入的文档的属性。为了支持这种类型的多域名站点，可以使用`Document`对象的`domain`属性。在默认情况下，属性`domain`存放的是载入文档的服务器的主机名。可以设置这一属性，不过使用的字符串必须具有有效的域前缀或它本身。因此，如果一个`domain`属性的初始值是字符串`home.example.com`，就可以把它设置为字符串`example.com`，其他的都不行。另外，`domain`值中必须有一个点号，不能把它设置为`com`或其他顶级域名。如果两个窗口设置了相同的`domain`值，那么这两个窗口就不再受同源策略的约束，他们可以相互读取对方的属性。

不严格的同源策略的第二项技术已经标准化为：跨域资源共享（Cross-Origin Resource Sharing）CORS。这个标准草案用新的`Orgin:`请求和新的`Aceess-Control-Allow-Origin`响应头来扩展`HTTP`。它允许服务器用头信息显示地列出源，或者使用通配符来匹配所有的源并允许由任何地址请求文件。这样`XMLHttpRequest`就不会被同源策略所有限制了。另一种新技术，叫做跨文档消息（cross-document messaging），允许来自一个文档的脚本可以传递文本消息到另一文档里的脚本，而不敢脚本的来源是否不同。调用`Window`对象上的`postMessage()`方法，可以异步传递消息事件到其他窗口的文档里。一个文档里的脚本还是不能调用在其他文档里的方法和读取属性，但它们可以用这种消息传递技术来实现安全的通信。

## Window对象
`setTimeOut()`和`setInterval()`可以用来注册在指定的时间轴单词或重复调用的函数。他们都被定义成`Window`对象的方法，`clearTimeout()`和`clearInterval()`用来绑定函数的执行。

`Window`对象的`location`数字引用的是`Location`对象，它表示该窗口中当前显示的文档的`URL`，并定义了方法来使窗口载入新的文档。`Document`对象的`location`属性也引用到`Location`对象。
```js
window.location == document.location  //总是返回true
```

`Document`对象也有一个`URL`属性，是文档首次载入后保存该文档的`URL`的静态字符串。如果定位到文档中的片段标识符（如#table-of-content），`Location`对象会做出对应的更新，而`document.URL`属性却不会改变，同时`Location`对象有很多的其他属性——`protocal`,`host`,`hostname`,`post`,`pathname`和`search`等。

载入新的文档有多种方法，`Location`对象的`assign()`方法和`replace()`区别是前者会有历史记录，而后者不会，一种更传统的方法是直接把新的`URL`赋值给`location`属性，如果文档中没有元素的ID是`top`，它会让浏览器跳到文档开始处。`location = "#top"`，注意，`Location`对象的`URL`分解属性是可写的，对他们重新赋值会改变`URL`位置，并且导致浏览器载入一个新的文档（如果改变的是`hash`属性，则在当前文档中进行转跳）。

`Window`对象的`history`属性引用的是该窗口的`History`对象。用来把窗口的浏览历史用文档和文档状态列表的形式表示。`history`的`length`属性，用来表示浏览历史列表中的元素数量，但出于安全的因素，脚本不能访问已保存的`URL`。`Histroy`的`back()`和`forward()`方法和浏览器的“后退”和“前进”按钮一样。`go()`接受一个整数参数，可以在历史列表中向前（正参数）或（向后（负参数）跳过任意多个页。如果串口中包含多个子窗口，子窗口的浏览历史会按时间顺序穿插在主窗口的历史中。这意味着主窗口调用`history.back()`可能会单只其中一个子窗口往回跳转到前一个显示的文档，但主窗口保留当前状态不变。

`Window`的`navigator`属性用来返回浏览器信息。

`Window`对象的`alert()`,`confirm()`,和`prompt()`方法都可以弹出一个对话框。

错误处理，`Window`对象的`onerror`属性是一个事件处理程序，当未捕获的异常传播到调用栈上时就会调用它，并把错误消息输出到浏览器的Javascript控制台上。如果给这个属性赋值一个函数，那么只要这个窗口中发生了Javascript的错误，就会调用该函数，即如他完成了窗口的错误处理程序。`onerror`的事件处理函数的调用通过三个字符串参数，而不是通过通常传递一个事件参数。除了参数，返回值`false`通知浏览器事件处理程序已经处理了错误，不需要其他操作。
```js
//在一个对话框中弹出错误消息，但不超过三次
window.onerror = function(msg, url, line){
    if( onerror.num++ < onerror.max){
        alert("ERROR: " + msg + "\n" + url + " : " + line);
        return true;
    }
}
```

作为Window对象属性的文档元素。如果在HTML文档中用`id`属性来为元素命名，并且如果`Window`对象没有此名字的属性，`Window`对象会赋予一个属性，它的名字是`id`属性的值，而他们的值指向表示文档元素的`HTMLElement`对象。如果文档包含一个`<button id="okay">`元素，可以通过全局变量`okay`来引用此元素，但是有一个重要的警告：如果`Window`对象已经具有此名字的属性，这就不会发生，以下HTML元素如果有`name`属性的话，也会有这样的表现`<a><applet><area><embed><form><frame><frameset><iframe><img><object>`，`id`元素在文档中必须是唯一的：两个元素不能有相同的id。但是，这对`name`属性无效。如果上面元素有多于一个相同的`name`属性（或者一个元素有`name`属性，而另一个元素有相同的`id`属性），具有该名称的隐式全局变量会引用一个类数组对象，这个类数组对象的元素是所有命名的元素。有`name`或`id`属性的`<iframe>`元素是个特殊的例子。那么隐式创建的变量不会引用表示元素自身的`Element`对象，而是引用表示`<iframe>`元素创建的浏览器窗体的`Window`对象。

`Window`对象的`open()`对象用来打开一个新的窗口，第一个参数是要在新打开的窗口中显示文档的URL。如果这个参数省略了（也可以是空字符串），那么会使用空页面的`URL about:blank`它还有第二个和第三个参数，它的返回值是代表命名或新创建的窗口的`Window`对象。新创建的窗口中，`opener`属性引用的是打开它的脚本的`Window`对象，在其他窗口中，`opener`为`null`。由于大部分浏览器增加了弹出窗口过滤系统。通常，`open()`方法只有当用户手动单击按钮或者链接的时候才会调用。

`window`对象的`close()`用来关闭一个窗口。

任何窗口或者窗体中的JavaScript代码都可以将自己的窗口和窗体引用为`window`或`self`。`parent`用来表示父窗体，`top`用来表示顶级窗体，顶级窗体的`parent == self`还有多种方法引用窗体，一种是使用`<iframe>`元素的`contentWindow`属性还有一种是使用`Window`对象的`frames`属性，它是一个类数组对象，第一个子窗体是`frames[0]`如果`<iframe>`指定了`id`或`name`还可以使用名字来索引`frames["f1"]`或`frames.f1`。
```js
var childFrame = docuement.getElementById("f1").contentWindow;
```

## 脚本化文档
DOM有其默认的基本属性，而这些属性就是所谓的`property`，无论如何，它们都会在初始化的时候在DOM对象上创建。而dom对象中的`attributes`属性是`atttibute`列表。注意，打印`attribute`属性不会直接得到对象的值，而是获取一个包含属性名和值的字符串。`attribute`和`property`之间的数据绑定是单向的，`attribute->property`。更改property和attribute上的任意值，都会将更新反映到HTML页面中。

通过ID选取元素。定义在`Document`类上`getElementById()`可以通过id查找DOM元素。通过名字选取元素，`getElementsByName()`根据名字查找元素，它定义在`HTMLDocument`中，而不再`Document`类中，所以它之针对`HTML`文档可用，在`XML`文档中不可用。返回一个`NodeList`，`NodeList`对象是一个类数组对象，同时为`<form>`,`<img>`,`<iframe>`,`<applet>`等设置`name`属性值将自动为`Document`对象创建以`name`属性值为名字的属性。通过标签名选取元素，`Document`对象的`getElementByTagName()`方法可以用来选取指定类型的`HTML`或`XML`元素，传递通配符`*`，将获得一个代表文档中所有元素的`NodeList`对象。`Element`类也定义`getElementsByTagName()`方法，其原理和`Document`版本一样，但是它之选取调用该方法的元素的后代元素。同时`HTMLDocument`类定义一些快捷属性来访问各种各样的节点。例如`images`、`forms`、`links`等他们可以用`document.forms.ship`来访问，这些是`HTMLCollection`对象，还有两个属性它们指代特殊的单个元素而不是元素的集合。`document.body`是一个HTML元素的`<body>`元素，`doucument.head`是`<head>`元素。这些属性总是会定义：如果文档源代码未显示的包含`<head>`和`<body>`元素，浏览器将隐式的创建它们。`Document`类的`documentElement`属性指代文档的根元素。在HTML元素中，它总是指代`<html>`元素。注意`NodeList`和`HTMLCollection`都是实时的。

通过css类选取元素。`getElementsByClassName`返回一个实时的`NodeList`它的参数字符串间是用空格隔开的而不是逗号。

用给定选择器的来选择元素的方法是`Document`的`querySelectorAll()`方法。它接受包含一个CSS选择器的字符串参数，返回一个`NodeList`但这个并不是实时的。没有匹配元素将返回空的`NodeList`，`querySelector`于它不同的是只返回第一个匹配的元素，如果没有匹配就返回`null`。

作为节点树的文档

属性名 | 描述
---|---
parentNode | 该节点的父节点，或者针对类似Document对象应该是null，因为它没有父节点
childNodes | 只读的类数组对象（NodeList对象），它是该节点的子节点的实时表示
firstChild、lastChild | 该节点的字节点中的第一个和最后一个，如果该节点没有子节点则为null
nextSibling、previousSibling | 该节点的兄弟节点中的前一个和下一个。
nodeType | 该节点的类型。9代表Document节点，1代表Element节点，3代表Text节点，8代表Comment节点，11代表DocumentFragment节点
nodeValue | Text节点或Comment节点的文本内容
nodeName | 元素的标签名，以大写形式表示


作为元素树的文档

属性名 | 描述
---|---
children | 跟childNodes类似，不过它只包含Element元素
firstElementChild,lastElementChild | 类似firstChild和lastChild，但只代表子Element
nextElementSibling,previousElementSibling | 类似nextSibling和previousSibling，但只代表兄弟Element
childElementCount | 子元素的数量。返回的值和children.length值相等

表示HTML文档元素的`HTMLElement`对象定义了读写属性，它们映射了元素的HTML属性。从HTML属性名转换到JavaScript属性名应该采用小写。但是，如果属性名包含不止一个单词，则将除了第一个单词以外的单词的首字母大写，例如`：defaultChecked`和`tabIndex`。有些HTML属性名在JavaScript中是保留字。对于这些属性，一般规则是为属性名加前缀`html`。例如，HTML的for属性（`<label>`元素）在Javascript中表为`htmlFor`属性。`class`在Javascript中时保留字（但还未使用），它是HTML非常重要的`class`属性，是上面规则的一个例外：在JavaScript代码中它变为`className`。

Element类型还定义了`getAttribute()`和`setAttribute()`方法来查询和设置非标准的HTML属性，也可以用来查询和设置XML文档中元素上的属性`。hasAttribute()`和`removeAttribute()`，他们用来检测命名属性是否存在和完全删除属性。

HTML5增添了往元素上添加新的数据属性的API，任意以`data-`为前缀的小写的属性名字都是合法的。这些数据技术性将不会对其元素的表现产生影响，他们定义了一种标准的、附加额外数据的方法，并不是在文档合法性上作出让步。在js中取属性时使用`dataset.x`，其中`x`就是`data-`后面的值，带连字符的属性对应驼峰命名法属性名。或者使用`getAttribute()`来获取。

Node类型定义了`Attributes`属性，任何非`Element`对象节点，该属性为`null`。对于Element对象，`attributes`属性是只读的类数组对象，它代表元素的所有属性。它也是实时的。它可以用数字索引访问，也可以用属性名索引
```js
//`name`和`value`属性返回该属性的名字和值
document.getElementById("parent").attributes[0].name
document.getElementById("parent").attributes["id"].value
```

元素中的内容`innerHTML`会返回内容中的标签，`outerHTML`会返回包括标签本身的内容，`textContent`会忽略标签返回纯文本内容，`innerText`跟`textContent`不同的是它不会忽略HTML标签。

`Text`和`CDATASection`都是`CharacterData`的子类型，`CharacterData`定义了data属性，他和`nodeValue`的文本相同。可以通过data来该表文本内容。

创建元素`createElement()`，创建文本节点`createTextNode()`，复制节点`cloneNode()`方法，除了IE的其他浏览器中，`Document`对象还定义了一个类似的方法叫`importNode()`。如果给它传递另一个文档的一个节点，它将返回一个适合本文档插入的节点的副本。传递`true`作为第二个参数，该方法将递归地导入所有的后代节点。

`appendChild()`在节点最后插入节点，`insertBefore()`和`appendChild()`一样它接受两个参数，一个参数就是待插入的节点，第二个参数是已存在的节点，新节点将插入该节点的前面。如果传递`null`作为第二个参数，`insertBefore()`的行为类似`appendChild()`，它将节点插入在最后。删除节点`removeChild()`，替换节点`replaceChild()`，第一个参数是新节点可以是字符串，第二个参数是要替换的节点。`DocumentFragment`是一种特殊的Node，他作为其他节点的一个临时容器。可以把一组节点当成一个节点操作，它的`parentNode`是`null`，创建它使用`document.createDocumentFragment()`。

判断滚动条的位置。使用`Window`对象的`pageXOffset`和`pageYOffset`，对IE或者其他任何浏览器也可以通过`document.documentElement`的根节点的`scrollLeft`和`scrollTop`来获取，在怪异模式下，必须使用`document.body`来使用它们由于在各浏览器中表现不一样，所以获取滚动条位置使用如下代码
```js
window.scroll(0,100); //可以用来设置滚动条位置
var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
```

判断视口尺寸。除了IE及更早的版本之外可以使用`Window`对象的`innerWidth`和`innerHeight`，对IE或者其他任何浏览器也可以使用`document.documentElement.clientWidth`和`document.documentElement.clientHeight`怪异模式下使用`document.body.clientWidth`和`document.body.clientHeight`。

判断尺寸。所有HTML元素拥有`offsetWidth`和`offsetHeight`只读属性。返回的尺寸包含元素的边框和内边距，除去了外边距。

判断元素的位置。`getBoundingClientRect()`。判断视口指定位置有什么元素，`elementFromPoint()`传递X和Y坐标（使用视口坐标而非文档坐标）。判断元素的文档位置使用`offsetLeft`和`offsetTop`来返回元素的X和Y坐标，他们是相对于祖先元素定位的如果他们的 `offsetParent`为`null`，那么这些属性就是文档坐标，因此一般来说用`offsetLeft`和`offsetTop`来计算元素e的位置需要一个循环
```js
function getElementPosition(e) {
    var x = 0,y = 0;
    while(e != null) {
        x += e.offsetLeft;
        y += e.offsetTop;
        e = e.offsetParent;
    }
    return {x:x, y:y};
}
```

设置滚动条滚动可以直接设置`scrollTop`属性和`scrollLeft`属性。还有一种更简单的方法使用`Window`对象的`scrollTo()`或`scroll()`这两个方法一样都接受X和Y坐标两个参数，他们会滚动到指定位置，`scrollBy()`会滚动指定距离，也接受同样的参数。

每个HTML元素都包括以下属性offsetWidth，offsetHeight，offsetLeft，offsetTop，offsetParent，clientWidth，clientHeight，cilentLeft，clientTop，scorllWidth，scrollHeight，scrollLeft，scroollTop。`clientWidth`和`clientHeight`不包括边框大小只包括内容和内边距，如果浏览器在内边距和边框之间添加了滚动条，那么其返回值中也不包括滚动条，内联元素的值是0。有一个特例，在文档的根元素查询这些属性时，他们的返回值和窗口的`innerWidth`和`innerHeight`属性值相等。`scrollWidth`和`scrollHeight`是元素的内容区域加上它的内边距再加上任何一处内容的尺寸。

访问表单元素有很多方式
```js
window.address   //不可靠
document.forms.address[0]
document.forms.address.street
document.address.street   //当有name="address"
//或者用elements属性
document.forms.address.elements.street
```

每个表单元素都有一个`form`属性，对包含元素的`Form`对象的只读引用，或者如果元素没有包含在一个`<form>`元素中，则其值为`null`。

每个Form元素都有一个`onsubmit`和`onreset`事件，他们可以通过返回false取消动作。表单元素在接收到焦点时也会触发`focus`事件，失去焦点时触发`blur`事件，由于在事件处理程序代码中关键字`this`是触发该事件的文档元素的一个引用。而且所有的表单元素又都包含了一个`form`属性引用了该包含的表单，这些元素的事件处理程序总是能够通过`this.form`来得到`Form`对象的引用，然后通过`this.form.x`来得到表单中以`x`命名的元素。

单选框和复选框都定义了`checked`属性和`defaultChecked`属性。点击他们会触发`onclick`事件，同时也会触发`onchange`事件。（但注意，当用户单击其他单选按钮而导致这个单选按钮状态的改变，后者不触发onchange事件）

文本输入域的`onchange`事件处理程序是在用户输入新的文本或编辑已存在的文本时触发，它表明用户完成了编辑并将焦点移出了文本域。不同的文本输入元素定义`onkeypress`、`onkeydown`和`onkeyup`事件处理程序。可以从`onkeypress`或`onkeydown`事件处理程序返回`false`，防止用户的按键。

Select元素通常被渲染成下拉菜单的形式，但当指定其`size`属性大于1时，它将显示为列表中的选项，如果`<select>`元素有`multiple`属性，也就是Select对象的`type`属性值为`select-multiple`。否则就只能选择单个项，它的`type`属性为`select-one`。当用户选择或取消选取一个选项是，`Select`元素触发`onchange`事件处理程序。针对`select-one`Select元素，它的可读/可写属性`selectedIndex`指定了哪个选项当前被选中。针对`select-multiple`元素，单个`selectedIndex`属性不足以表示被选中的一组选项。这种情况下，要判断哪些被选中，就必须遍历`options[]`数组的元素，并检测每个`Option`对象的`selected`属性值。每个`<option>`都有`text`属性用来指定要显示的文本，`value`属性是用来提交的属性。注意，Option元素没有与表单相关的事件处理程序。    

Document同时包含其他属性cookie，domain，lastModified，location，referrer，title，URL。其中`referrer`是这些属性中最有趣的属性之一：它包含用户链接到当前文档的上一个文档的`URL`，需要在服务器中才有效果。

有两种方法来启用编辑功能。其一，设置任何标签的HTML `contenteditable`属性。其二，设置对应元素的JavaScript `contenteditable`属性，为元素添加`spellcheck`属性来显示开启拼写检查，而使用`spellcheck=false`来显示关闭该功能（例如，当一`个<textarea>`将显示源代码或其他内容包含了字典找不到的标识符时）。将`Document对象`的`designMode`属性设置为字符串`on`使得整个文档可编辑。

## 事件处理
`addEventLister()`用来绑定事件，它要指定三个参数，第一个是事件名字，第二个是处理函数，第三个是布尔值，`true`表示事件句柄在捕获阶段执行，`false`表示默认在冒泡阶段执行。`addEventListener()`能多次调用为同一个对象注册同一事件类型的多个处理程序函数，不会覆盖。`removeEventListener()`与它相对，参数也先相同。IE9之前不支持这两个方法可以使用attachEvent()和detachEvent()他们只需要两个参数，第一个参数都需要有on前缀。

在IE8和以前的版本中要取得事件对象，需要使用全局对象`window.event`来获得事件对象。

在`attachEvent`中它的`this`不事件目标，它指代的是`window`对象。

通常情况下，事件处理程序的返回值`false`就是告诉浏览器不要执行这个事件相关的默认操作。

事件传播。事件捕获阶段，事件从最上一级标签开始往下查找，直到捕获到事件目标的父元素。时间冒泡事件，事件从目标开始，往上冒泡直到页面的最上一级标签。事件冒泡是事件传播的第三个阶段，第二个阶段是目标对象本身的事件处理程序调用，第一个阶段就是捕获阶段。

事件取消。在支持`addEventListener()`的浏览器中，也能通过调用事件对象的`preventDefault()`方法取消事件的默认操作。不过，在IE9之前的IE中，可以通过设置事件对象的`returnValue`属性为`false`来达到同样的效果。下面的代码用到全部三种技术
```js
function cancelHandler(event){
    var event = event || window.event; // 用于IE
    
    if(event.preventDefault) event.preventDefault();
    if(event.returnValue) event.returnValue = false;
    return false;
}
```

阻止冒泡。事件对象的`stopPropagation()`方法可以阻止事件的传播，IE9之前不支持`stopPropagation()`方法。相反，IE事件对象有一个`cancelBubble`属性，设置这个属性为`true`能阻止事件进一步传播。

`Window`的`load`事件直到文档和所有图片加载完毕时才会发生。`Document`的`DOMContentLoaded`事件，在文档加载完毕且所有延迟脚本都执行完毕会触发，这时候图片和异步的脚本可能仍在加载。`document.readyState`属性随文档加载过程而变。在IE中，每次状态改变都会伴随`Document`对象上的`readystatechange`事件。HTML5标准化了`readystatechange`事件，但它仅在`load`事件之前触发。
```js
var whenReady = (function(){
   var funcs = [];
   var ready = false;
   
   //当文档准备完毕，调用该函数
   function handler(e) {
       //如果已经运行过一次，只需要返回
       if (ready) return;
       
       if (e.type === "readystatechange" && document.readyState !== "complete")
          return;
        
       //运行所有注册函数
       for(var i = 0;i < funcs.length; i++){
           funcs[i].call(document);
       }
       
       ready = true;
       funcs = null;

   }
   //为接收到的任何事件注册处理程序
   if (document.addEventListener) {
       document.addEventListener("DOMContentLoaded", handler, false);
       document.addEventListener("readystatechange", handler, false);
       window.addEventListener("load", handler, false);
   }else if(document.attachEvent){
       document.attachEvent("onreadystatechange", handler, false);
       window.attachEvent("onload", handler, false);
   }
   
   return function whenReady(f) {
       if(ready) f.call(document);
       else funcs.push(f);
   }
}());
```

鼠标事件。传递给鼠标事件处理程序的事件对象有`clientX`和`clientY`属性，它们你指定了鼠标指针相对于包含窗口的坐标。加入窗口的滚动偏移量就可以把鼠标位置转换成文档坐标`altKey`、`ctrlKey`、`metaKey`和`shiftKey`属性指定了当前事件发生时是否有各种键盘辅助键按下。
类型 | 说明
---|---
click | 点击鼠标的时候激活
contextmenu | 鼠标左键上下文激活之前触发
dblclick | 鼠标双击触发
mousedown | 鼠标被按下触发
mouseup | 鼠标被释放时触发
mousemove | 用户移动鼠标时触发
mouseover | 当鼠标进入元素时触发
mouseout | 当鼠标离开的时候触发
mouseenter | 类似“mouserover”，但不冒泡。IE将其引入，HTML5将其标准化，但尚未广泛实现
mouseleave | 类似“mouseout”，但不冒泡。IE将其引入，HTML5将其标准化，但尚未广泛实现

鼠标滚轮事件。`mousewheel`用来处理鼠标滚轮事件，在Firefox中，用`DOMMouseScroll`事件取代`mousewheel`，同时3级DOM事件规范草案标准定义`了wheel`事件作为`mousewheel`和`DOMMouseScroll`的标准版本。传递给wheel事件处理程序的事件对象将有`deltaX`、`deltaY`和`deltaZ`。

拖放事件。 任何有HTML`draggable`属性的文档元素都是拖放源。他在这个元素上的时候触发`dragstart`事件。这个事件的处理程序就调用`dataTransfer.setData()`指定当前可用的拖放源数据（当新的HTML5 API实现的时候，可以用`dataTransfer.items.add()`代替）同时这个事件处理程序也可以设置`dataTransfer.effectAllowed`来指定支持移动、复制和链接传输操作中的几种，同时它可以调用`dataTransfer.setDragImage()`或`dataTransfer.addElement()`指定图片或文档元素用作拖动时的视觉表现。当数据放置的时候会触发`dragend`事件。如果拖放源支持移动操作，它就会检查`dataTransfer.dropEffect`去看看是否实际执行了移动操作。如果执行了，数据就被传输到其他地方，你应该从拖放源中删除它。拖放目标比拖放源更棘手，当拖放对象进入到文档元素时触发`dragenter`事件。拖放目标应该使用`dataTransfer.types`属性确定拖放对象的可用数据是否是它能够理解的格式（也可以检查`dataTransfer.effectAllow`确保拖放源和拖放目标同意使用移动、复制和链接操作中的一个。）如果检查成功，拖放目标必须让用户和浏览器都知道它对放置感兴趣。可以通过改变它的边框或背景颜色来向用户反馈。
令人吃惊的是，拖放目标通过取消事件来告知浏览器它对放置感兴趣（也就是返回`false`）如果拖放目标取消了 `dragenter`事件，浏览器将发送`dragover`事件表示用户继续在目标上拖动对象。类似的是，拖放目标必须监听且取消所有这些事情来表明它对放置放置感兴趣。如果拖放目标想指定它只允许移动、复制或链接操作，它应该使用`dragover`事件处理程序来设置`dataTransfer.dropEffect`。如果取消了该事件就会继续触发`dragleave`事件。遗憾的是，`dragenter`和`dragleave`事件会冒泡，如果拖放目标内部有嵌套元素，想要知道`dragleave`事件表示拖放对象从拖放目标离开到目标外的事件还是到目标内的事件非常困难，可以使用一些其他方法来判断。最后，如果用户把拖放对象放置到拖放目标上，在拖放目标上就会触发`drop`事件。这个事件的处理程序可以使用`dataTransfer.getData()`获取传输数据并做一些适当的处理。另外如果用户在拖放目标处放置一个或多个文件，`dataTransfer.files`属性将是一个类数组的`File`对象。使用新的HTML5 API，`drop`事件处理程序将能遍历`dataTransfer.items[]`的元素去检查文件和非文件数据。
```js
dnd.addEventListener("drop", function(e){
	e = e || window.event;
	e.preventDefault();
	var dt = e.dataTransfer;
	var file = dt.files[0];
	var reader = new FileReader();

    reader.onload = function (e) {
      var img = document.createElement('img');
      img.style.width = "400px";
      img.style.height = "200px";
      img.src = e.target.result;
      dnd.appendChild(img);
    };

    reader.readAsDataURL(file);
	this.className = "";
});
```

文本事件。`keydown`事件和`keyup`事件是低级事件`，keypress`事件是较高级事件。3级DOM定义了一个更通用的`textinput`事件，目前支持的是`textInput`事件。`textinput`和`textInput`都会传递一个事件对象，他有一个保存输入文本的`data`属性。一个`keypress`事件表示输入的单字符，事件对象以数字Unicode编码的形式指定字符，所以必须用`String.fromCharCode()`把它转换成字符串。在大多数浏览器中，事件的keyCode属性指定了输入字符的编码。firfox使用的charCode属性。`textinput`、`textInput`、`keypress`可以通过取消这些事件来阻止字符输入。

## 脚本化HTTP
`XMLHttpRequest`用来进行异步请求。由于在IE5和IE6中它只是一个`ActiveX`对象。IE7之前的版本不支持非标准的`XMLHttpRequest`构造函数所以有
```js
if(window.XMLHttpRequest === undefined) {
    window.XMLHttpRequest = function() {
        try {
            //如果可用，则使用ActiveX对象的最新版本
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch(e){
            try {
                //否则，回退到较旧的版本
                return new ActiveXObject("Msxml2.XMLHTTP.3.0");
            } catch(e1){
                throw new Error("XMLHttpRequest is noew supported");
            }
        }
    }
}
```

指定请求。创建`XMLHttpRequest`对象后，发起HTTP请求的下一步是调用`XMLHttpRequest`对象的`open()`方法去指定这个请求的两个必须部分：方法和URL。它是相对于文档路径的URL。写绝对路径的话协议，主机和端口通常必须匹配所在文档的对应内容：跨域的请求通常会报错。如果要设置请求头`request.setRequestHeader("Content-Type", "text/plain")`;有很多头都无需设置或不能设置XMLHttpRequest会自动设置。最后一步就是制定可选的请求主体并向服务器发送它。使用`send()`方法像如下这样做：`request.send(null)`;GET请求绝对没有主体，所以应该传递`null`或省略这个参数。POST请求通常拥有主体，同时它应该匹配使用的`setRequestHeader()`指定的`Content-Type`头。

取得响应。一个完整的HTTP响应由状态码、响应头集合和响应主体组成。`status`和`statusText`属性以数字和文本的形式返回HTTP状态码。使用`getResponseHeader(`)和`getAllResponseHeaders()`能查询响应头。响应主题可以从`responseText`属性中得到文本形式的，从`responseXML`属性中得到`Document`形式的。因为发送请求是异步的要等到返回才有这些值，所以必须监听`XMLHttpRequest`对象上的`readystatechange`事件。但为了理解这个事件类型，必须要有`readyState`。
```js
function getText(url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.send(null);
    request.onreadystatechange = function() {
        if(request.readyState === 4 && request.status === 200){
            var type = request.getResponseHeader("Content-Type");
            if(type.match(/^text/))
                callback(request.responseText);
        }
    }
}
```

常量 | 值 |含义
---|---|---
UNSENT | 0 | open()尚未调用
OPENED | 1 | open()已调用
HEADERS_RECEIVED | 2 | 接收到头信息
LOADING | 3 | 接收到响应主题
DONE | 4 | 响应完成

`XMLHttpRequest`也支持同步响应。把`false`作为第3个参数传递给`open()`，就会同步阻塞，直到请求完成。响应解码，如果服务器发送XML文档但没有设置适当的`MIME`类型，或者如果服务器在`Content-Type`头包含了错误的`charset`参数，那么`XMLHttpRequest`将在使用错误的编码来解析响应。XHR2定义了`overrideMimeType()`方法来解决这个问题，在调用`send()`之前把类型传递给`overrideMimeType()`这将使`XMLHttpRequest`忽略`Content-Type`头而使用指定的类型`request.overrideMimeType("text/plain; charset=utf-8")`。

表单编码的请求，当用户提交表单是，表单中数据编码到一个字符串中并随请求发送。默认情况下，HTML表单通过POST方法发送给服务器，而编码后的表单数据则用作请求主体。对表单数据使用的编码方案相对简单：对每个表单元素的名字和值执行普通的URL编码（使用十六进制转义码替换特殊字符），使用等号把编码后的名字和值分开，并使用&符号分开名/值对。一个简单表单的编码像如下这样：`find=pizza&zipcode=02134&radius=1km`表单数据编码格式有一个正式的`MIME`类型：`application/x-www-form-urlencoded`，当使用`POST`方法提交这种顺序的表单数据时，必须设置`Content-Type`请求头为这个值。 `encodeURIComponent()`可以把字符串当成URI组件进行编码。
```js
function encodeFormData(data) {
    if(!data) return "";  // 一直返回字符串
    var pairs = []; // 为了保存名=值对
    for(var name in data) {
        if(!data.hasOwnProperty(name)) continue; //跳过继承属性
        if(typeof data[name] === "function") continue; //跳过方法
        var value = data[name].toString(); //把值转换成字符串
        name = encodeURIComponent(name.replace("%20", "+"); //编码名字
        value = encodeURIComponent(value.replace("%20", "+");  //编码值
        pairs.push(name+ "=" + value);
    }
    return pairs.join('&');
}
```

JSON编码的请求，使用`JSON.stringify(data)`进行编码。
XML编码的请求，可以传递一个`document`对象，他看起来像这样
```js
<query>
    <find zipcode="02134" radius="1km">
        pizza
    </find>
</query>
```

上传文件。HTML表单的特性之一是当用户通过`<input type="file">`元素选择文件时，表单将在它产生的POST请求主题中发送文件内容。HTML表单始终能上传文件，但`XMLHttpRequest`不能做同样的事情，然而，XHR2 API允许通过向`send()`方法传入`File`对象来实现上传文件。没有`File()`对象构造函数，脚本仅能获得表示用户当前选择文件的`File`对象。在支持`File`对象的浏览器中，每个`<input type="file">`元素有一个`files`属性，它是`File`对象中的类数组对象。拖放API允许通过拖放事件的`dataTransfer.file`属性访问用户拖放到元素上的文件。

`multipart/form-data`请求，当HTML表单同时包含文件上传元素和其他元素时，浏览器不能使用普通的表单编码而必须使用称为`multipart/form-data`的特殊`Content-Type`来用POST方法提交表单。这种编码包括使用长“边界”字符串把请求主体分离成多个部分。这个文本数据，手动创建`multipart/form-data`请求主体是可能的，但很复杂。XHR2定义了新的`FormData` API。这个对象使用`FormData(`)构造函数创建FormData对象，然后按需多次调用这个对象的`append()`方法把个体部分添加到请求中
```js
function postFormData(url, data, callback) {
    if(typeof FormData === "undefined")
        throw new Error("FormData is not implemented");
        
    var request = new XMLHttpRequest();
    request.open("POST", url);
    request.onreadystatechange = function() {
        if(request.readyState === 4 && callback)
            callback(request);
    }
    var formdata = new FormData();
    for(var name in data) {
        if(!data.hasOwnProperty(name)) continue; //跳过继承属性
        if(typeof data[name] === "function") continue; //跳过方法
        var value = data[name]; 
        if(typeof value === "function") continue;
        formdata.append(name, value);
    }
    //send()会自动设置Content-Type头
    request.send(formdata);
}
```

HTTP进度事件。当调用`send()`时，触发单个`loadstart`事件。当正在加载服务器的响应时，`XMLHttpRequest`对象会发生`progress`事件，通常每隔50毫秒左右，所以可以使用这些事件给用户反馈请求的进度。如果请求快速完成，它可能从不触发`progress`事件。当事件完成时会触发`load`事件一个完成的请求不一定是成功状态。请求无法完成的情况有3中，对应三种事件，`abort`、`timeout`和`error`事件。于`progress`事件相关联的时间对象又3个有用的属性。`loaded`属性是目前传输的字节数值。`total`属性是`Content-Length`头传输的数据的整体长度，如果不知道内容长度则为0，最后，如果知道内容长度则`lengthComputable`属性为`true`，否则为`false`。除了为监控HTTP响应的加载定义的这些有用的事件外，XHR2也给出了用于监控HTTP请求上传的时间。在实现这些特性的浏览器中，`XMLHttpRequest`对象将有`upload`属性。`upload`属性值是一个对象，它定义了`addEventListener()`方法和整个`process`事件集合，比如`onprogress`和`onload`。（但`upload`对象没有定义`onreadystatechange`属性，`upload`仅能触发新的事件类型）对于`XMLHttpRequest`对象x，设置`x.onprogress`以监控响应的下载进度，并且设置`x.upload.onprogress`以监控请求的上传进度。可以通过调用`abort()`来终止正在进行的http请求。XHR2通过在HTTP响应中选择发送合适的CORS允许跨域访问网站。有一些安全细节不能进行跨域，如果跨域请求需要这几种凭证才能成功，那么必须在`send()`发送请求前设置XML`HttpRequest`实现`withCredential`s属性为`true`。这样做不常见，但测试`widthCredentials`的存在性是测试浏览器是否支持`CORS`的一种方法。

在不支持跨域请求的浏览器中，还有另一种方式来进行跨域访问就是`JSONP`，它的原理就是使用script标签，只需设置`<script>`元素的`src`属性（假设它还没有插进去，需要插入进去），然后浏览器就会发送一个HTTP请求以下载src属性所指向的`URL`。同时它不受同源策略的影响，使用`JSONP`，`JSON`响应数据（理论上）是合法的`JavaScript`代码，当它到达时浏览器将执行它。相反，不适用`JSONP`，而是对`JSON`编码过的数据解码，结果还是数据，并没有做任何事情。这就是JSONP中P的意义所在。当通过`<script>`元素调用数据时，响应内容必须用JavaScript函数名和圆括号包裹起来。类似`handleResponse([1,2, {"buckle": "my shoe"}])`包裹后的响应会成为`<script>`元素的内容，它会先判断JSON编码后的数据，然后把它传递给handleResponse()函数，我们应该告诉服务器他的回调函数，这个可以通过在URL中添加一个查询参数来实现：例如，追加`?jsonp`或&`jsonp`或`callback`
```js
function getJSONP(url, callback) {
    var cbnum = "cb" + getJSONP.counter++;
    var cbname = "getJSONP."+cbnum;
    
    if(url.indexOf("?") === -1)
        url += "?jsonp" + cbname;
    else
        url + "&jsonp=" + cbname;
        
    var script = document.createElement("script");
    
    getJSONP[cbnum] = function(response) {
        try{
            callback(response);
        }
        finally {
            delete getJSONP[cbnum];
            script.parentNode.removeChild(script);
        }
    }
    
    script.src = url;
    document.body.appendChild(script);
}

getJSONP.counter = 0;
```

基于服务器推送事件的Comet技术。在服务端推送事件的标准草案中定义了一个`EventSource`对象，简化了Comet应用程序的编写可以传递一个URL给`EventSource()`构造函数，然后在返回的实例上监听消息事件。与`message`事件关联的事件对象有一个`data`属性，这个属性保存服务器发送的字符串。同时有一个type属性默认值`是messag`e，事件源可以修改这个值。
```js
var ticker = new EventSource("stockprices.php");
ticker.onmessage = function(e) {
    var type = e.type;
    var data = e.data;
}
```

## 客户端存储
实现了Web存储草案标准的浏览器在Window对象上定义了两个属性：`localStorage`和`sessionStorage`。这两个属性都代表同一个`Storage`对象——一个持久化关联数组，数组使用字符串来所以，存储的值也都是字符串形式的。`localStorage`和`sessionStorage`两者的区别在于存储的有效期和作用域不同：数据可以存储多长时间以及谁拥有数据的访问权。
```js
var name = localStorage.username;  //查询一个存储的值
name = localStorage["username"];  //等价于数组表示法
if(!name) {
    name = prompt("What is your name?");  //询问用户一个问题
    localStorage.username = name;  //存储用户的答案
}

for(var name in localStorage) {
    var value = localStorage[name];
}
```

由于浏览器仅仅支持字符串类型数据。如果想要存储和获取其他类型的数据，不得不自己动手进行解码和编码
```js
localStorage.x = 10;
var x = parseInt(localStorage.x);

localStorage.lastRead = (new Date()).toUTCString();
var lastRead = new Date(Date.parse(localStorage.lastRead));

localStorage.data = JSON.stringify(data);
var data = JSON.parse(localStorage.data);
```

`localStorag`e和`sessionStorage`的区别在于存储的有效期和作用域不同。通过`localStorage`存储的数据是永久性的，除非Web应用可以删除存储的数据，或者用户通过设置浏览器配置来删除，否则数据将一直保留在用户的电脑上，永不过期。`localStorage`的作用域是限定在文档源级别的，文档源是通过协议、主机名以及端口三者来确定的。同源的文档间共享同样的`localStorage`数据。他们可以互相读取对方的数据，设置可以覆盖对方的数据。它同时会受浏览器供应商的限制。`sessionStorage`的有效期和存储数据的脚本所有在的最顶层窗口或者是浏览器标签页是一样的。一旦窗口或者标签页被永久关闭了，那么所有通过`sessionStorage`存储的数据也会被删除（当时需要注意的是，现在浏览器已经具备了重新打开最近关闭的标签页随后回复上一次浏览的会话功能，因此，这些标签以及与之相关的`sessionStorage`的有效期可能会更长些）。与`localStorage`一样，`sessionStorage`的作用域也是限定在文档源中，因此非同源文档间都是无法共享`sessionStorage`的。不仅如此，`sessionStorage`的作用域还被限定在窗口中。如果同源的文档渲染在不同的浏览器标签中，那么它们相互之间拥有是各自的`sessionStorage`数据，无法共享；一个标签页中的脚本是无法读取或者覆盖由另一个变迁页脚本写入的数据，哪怕这两个标签页渲染的是同一个页面，运行的是同一个脚本也不行。要注意的是：这里提到的基于窗口作用域的`sessionStorage`指的窗口只是顶级窗口。如果一个浏览器标签包含两个`<iframe>`元素，它们所包含的文档是同源的，那么这两者之间是可以共享`sessionStorage`的。
- `localStorage`和`sessionStorage`还提供了更加正式的API。调用`setItem()`方法，将对应的名字和值传递进去，可以实现数据存储。调用`getItem()`方法，将名字传递进去，可以获取对应的值。调用`removeItem()`方法，将名字传递进去，可以删除对应的值。`clear()`方法可以删除所有存储的数据，不需要参数。使用`length`属性以及`key()`方法，传入0~length-1的数字，可以枚举所有存储数据的名字。它们存储的通常是对象和数组类的副本，确保之后的任何改变都不会影响到存储的对象。
```js
localStorage.o = {x:1};
localStorage.o.x = 2;  //试图去设置该对象的属性值
localStorage.o.x  =>1  // =>1:x没有变

//使用getItem()不会有这种困惑,这里我们并不想存储2
localStorage.getItem("o").x = 2;
```

还有另一个使用显示的存储API的理由就是：在还不支持Web存储标准的浏览器中，其他的存储机制的顶层API对其也是兼容的。
```js
var memory = window.localStorage || (window.UserDataStorage && new UserDataStorage()) || new cookieStorage();

var username = memory.getItem("username");
```

无论什么时候存储在`localStorage`或者`sessionStorage`的数据发生改变，浏览器都会在其他对该数据可见的窗口对象上触发存储事件（但是，在对数据进行改变的窗口对象上是不会触发的），如果浏览器有两个标签页也都打开了来自同源的页面，其中一个页面在`localStorage`上存储了数据，那么另外一标签页就会接受到一个存储事件。还要注意的是，只有当存储数据真正发生改变的时候才会触发存储事件。像给已经存在的存储项设置一个一模一样的值，抑或是删除一个本来就不存在的存储项都是不会触发存储事件的。为存储事件注册处理程序可以通过`addEventListener()`方法，在绝大多数浏览器中，还可以使用给window对象设置`onstorage`属性的方式，不过Firefox不支持该属性。与存储事件相关的事件对象有5个非常重要的属性。
名称 | 作用
---|---
key | 被设置或者移除的项的名字或者键名。如果调用的是clear()函数，那么该属性值为null。
newValue | 保存该项的新值；或者调用removeItem()时，该属性值为null
oldValue | 改变或者删除该项前，保存该项原先的值；当插入一个新项的时候，该属性值为null
storageArea | 这个属性值就好比是目标Window对象上的localStorage属性或者是sessionStorage属性
url | 触发该存储变化脚本所在文档的URL

localStorage和存储事件都是采用广播机制的，浏览器会对目前正在访问同样站点的所有窗口发送消息。

检测`cookie`是否可用可以通过检测`navigator.cookieEnable`这个属性来实现，但并不是所有的浏览器都支持该属性。`cookie`是`document`对象的一个属性。

`cookie`除了名和值，还有一些可选的属性来控制`cookie`的有效期和作用域。`cookie`默认的有效期很短暂，它只会持续在Web浏览器的会话期间，一旦用户关闭浏览器，`cookie`保存的数据就丢失了。想要延长`cookie`的有效期，可以通过设置max-age属性，但是必须明确告诉浏览器cookie的有效期是多长。一旦设置了有效期，浏览器就会将`cookie`数据存储在一个文件中，并且直到过了指定的有效期才会删除该文件。和`localStorage`以及`sessionStorage`类似，`cookie`的作用域是通过文档源和文档路径来确定的。该作用域通过`cookie`的`path`和`domain`属性也是可配置的。默认情况下，`cookie`和常见它的页面有关，并对该页面以及和该web页面以及该页面同目录或者子目录的其他页面可见。如Web页面`http://www.example.com/catalog/index.html`页面创建了一个`cookie`，那么该`cookie`对`http://www.exmple.com/catalog/orderhtml`页面可见，有时候可以设置`cookie`路径（设置`cookie`的`path`属性）。例如在`http://www.example.com/catalog/widgets/index.html`页面创建了一个`cookie`，并且设置了路径为/，那么该`cookie`对任何`http://www.example.com`这台web服务器上的页面都是可见的。`cookie`的作用域默认由文档源限制。但是，有的大型网站想要子域之间能够共享`cookie`，可以设置`cookie`的`domain`属性来实现。要注意的，`cookie`的域只能设置为当前服务器的域。`cookie`的属性`secure`是一个布尔类型的值，用来表明`cookie`的值以何种形式通过网络传播。`cookie`默认是以不安全的形式传递的（通过普通的、不安全的HTTP连接）。而一旦`cookie`被标识为安全的，那么就只能当前浏览器和服务器通过`HTTPS`或者其他的安全协议连接的时候才能传递它。

保存`cookie`。要设置`cookie`属性为一个字符串形式的值:`name=value`如`document.cookie = "version=" + encodeURIComponent(document.lastModified);`，由于`cookie`的名/值中的值是不允许包含分号、逗号和空白符，因此，在存储前一般可以采用JavaScript核心的全局函数`encodeURIComponent()`对值进行编码。相应的，读取`cookie`值的时候需要采用`decodeURIComponent()`函数解码。设置其他属性如`max-age`、`path`、`domain`和`secure`属性，只需在字符串后面追加分号和`name=value`。要改变`cookie`的值，需要使用相同的名字、路径和域，但是新的值重新设置`cookie`的值。同样地，设置新的`max-age`属性就可以改变原来的`cookie`的有效期。删除`cookie`，需要使用相同的名字、路径和域，然后指定一个任意（非空）的值，并将`max-age`属性指定为0，再次设置`cookie`。

`cookie`的设计初衷是给服务端脚本用来存储少量数据的，该数据会在每次请求一个相关的URL时传递到服务器中。RFC 2965标准不允许浏览器保存超过300个`cookie`，为每个Web服务器保存的`cookie`数不能超过20个，而且，每个`cookie`保存的数据不能超过4kb。

IE中可以使用`userData`来持久化对象。IE5以及IE5以上版本的浏览器是通过`document`元素后面添加一个专属的DHTML行为来实现客户端存储
```js
var memory = document.createElment("div");
memory.id="_memory";
memory.style.display = "none";
memory.style.behavior = "url('#default#userData')";  //附加userData行为
document.body.appendChild(memory);
```

一旦给元素赋予了`userData`行为，该元素就拥有`load()`和`save()`方法。`load()`方法用于载入存储的数据。使用它的时候必须传递一个字符串作为参数——类似于一个文件名，该参数用来做指定要载入的存储数据。当数据载入后，就可以通过该元素的属性来访问这些名/值对形式的数据，可以使用`getAttribte()`来查询这些数据。通过`setAttribute`方法来设置属性，然后通过`save()`方法来存储新的数据；要删除数据，通过`removeAttribute()`方法然后调用`save()`方法即可。
```js
memory.load("myStoredData");  //根据指定名，载入对应的数据
var name = memory.getAttribute("username");  //获取其中的数据片段
if(!name) {
    name = prompt("What is your name?");  //获取用户输入
    memory.setAttribute(" username ", name);   //将其设置成memory元素的一个属性
    memory.save("myStoredData ");  //保存它方便下次使用
}
```

默认情况下`userData`存储的数据除非手动删除否则永不过期。但是也可以使用`expires`属性来指定它的过期。例如推迟100天
```js
var now = (new Data()).getTime();
var expires = now + 100*24*60*60*1000; //把天数转换成毫秒
expires = new Date(expires).toUTCString();  //将其转换成字符串
memory.expires = expires;  //设置userData的过期时间
```

IE `userData`的作用域限制在当前文档同目录的文档中。它的作用域没有`cookie`宽泛，`cookie`对其所在的子目录也有效。`useData`的机制并没有像`cookie`那样，通过设置`path`和`domain`属性来控制或者改变其作用域的方式。`userData`允许存储的数据比`cookie`大，但比`localSession`以及`sessionStorage`允许存储的数据量要小。

HTML5中新增了应用程序缓存，它允许Web应用将程序本身“安装”到浏览器中。离线仍然可用。它需要在文件中指定清单具体细节见p594。

可以通过检测`navigator.onLine`来检测浏览器是否在线

