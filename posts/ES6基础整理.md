---
title: "ES6基础整理"
date: "2019-03-04"
tags: js
author: xwchris
desc: "本文自己学习复习用，基本内容来自阮一峰的[ECMAScript 6 入门]"
---

# let和const命令

## let命令
- `let`的用法类似于`var`，不同的是，它只在`let`所在的代码块内有效，相当于为js加入了块级作用域。
```js
var a = [];
for (var i = 0; i < 10; i++) {
  // var c = i;
  let c = i;
  a[i] = function () {
    console.log(c);
  };
}
a[6](); //用var输出9。用let输出6
```

- `let`不会 像var一样发生变量提升现象。同时`let`不可在同一块级作用域中重复声明，如果重复声明会报错。

## const命令
- 用`const`声明的变量的值不能修改。强制修改不会报错，只会默默的失败，值不变。

- `const`和`let`一样声明只在块级作用域中有效，同时也不能在同一块级作用域中重复声明，重复声明会报错。

# 变量的解构赋值

## 数组的解构赋值
- ES6允许按照一定的模式，从数组和对象中提取值，对变量进行赋值，这被称为解构(Destructing)。
```js
// ES5及之前赋值像下面这样
var a = 1;
var b = 2;
var c = 3;

// ES6可以像下面这样
var [a,b,c] = [1,2,3];
```

- 数组可以嵌套写，只要结构一致。本质上这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会赋予相应的值。当解析不成功的时候对应的值会被赋值为`undefined`。

- 对`undefined`和`null`进行解构会报错。因为解构只能用于数组或对象，其他原始类型的值都可以转为相应的对象，但是，`undefined`和`null`不能转为对象，因此报错。
```js
// 报错
var [foo] = undefined;
var [foo] = null;
```

- 解析赋值可以指定默认值
```js
var [foo = true] = [];  // foo = true
[x, y = "b"] = ["a"]; // a = "a", b = "b"
[x, y = "b"] = ["a", undefined]; // a = "a", b = "b"
```

- 事实上只要某种数据结构具有`Iterator`接口，都可以采用数组形式解构

## 对象的解构赋值

- 解构不止可以应用于数组还可应用于对象，不同的是数组是按照顺序对应的，对象要按照名字对应，如果不对应要用另一种写法。
```js
// 正常使用
var {foo, bar} = {foo : "aaa", bar : "bbb"};

// 名字不对应  baz = undefined
var {baz} = {foo : "aaa", bar : "bbb"};

// 名字不对应用另一种写法 baz = "aaa"
var {foo : baz} = {foo : "aaa", bar : "bbb"};
```

- 和数组解构一样，对象解构也可以嵌套，也可以指定默认值。同时注意对应已声明的变量的对象解构。以下代码会报错，因为JavaScript引擎会将`{x}`解析成代码块，从而引发语法错误，要解决该问题不能将`{`写在最前面，可以加上`()`来解决。
```js
var x; 

// 错误的写法
{x} = {x : 1};

// 正确的写法
({x}) = {x : 1};
// 或
({x} = {x : 1});
```

## 解构的用途

- 交换变量的值。
```js
[x , y] = [y, x];
```

- 从函数返回多个值。
```js
function func(){
    return [1, 2, 3];
}

let [a, b, c] = func();
```

- 函数参数的定义。
```js
function f({x, y, z}){ ... }

f({x : 1, y : 2, z : 3});
```

- 函数参数的默认值。
```js
JQuery.ajax = function(url, {
    async = true,
    cache = true,
    complete = function(){
    // ..More config
    }
}){
    // ..function body
}
```

- 遍历`Map`结构。任何部署了`Iterator`接口的对象，都可以用`for ... of`循环遍历。`Map`结构原生支持`Iterator`接口，配合变量的解构赋值，获取键名和键值就非常方便。
```js
var map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map){
    console.log(key + " is " + value);
}

// 只获取键名
for (let [key] of map){
    console.log(key + " is " + value);
}

// 只获取键值
for (let [, value] of map){
    console.log(key + " is " + value);
}
```

- 输入模块指定方法。往往需要指定输入那些方法。解构赋值使得输入语句非常清晰。
```js
const { SourceMapConsumer, SourceNode} = require("source-map");
```

# 字符串扩展

## charPointAt()

- JavaScript内部是以UTF-16存储字符的，每个字符固定为两个字节。对于那些需要以四个字符存储的字符（Unicode码点大于0xFFFF的字符），JavaScript会认为它们是两个字符。比如对于一个汉字，javaScript不能正确处理，字符串长度会误判为2，而且`charAt`方法无法读取字符，`charCodeAt`只能分别返回前两个字符和后两个字符的值。ES6提供的`charPointAt`能正确处理4个字节存储的字符，返回一个字符的码点。
```js
var s = "𠮷a";

s.charPointAt(0); // 134071
s.charPointAt(1); // 57271

s.charCodeAt(2); // 97
```

- `charPointAt`是测试一个字符是两个字节组成还是四个字节组成最简单的方法。
```js
function is32Bit(c){
    return c.codePointAt(0) > 0xFFFF;
}

is32Bit('𠮷'); // true;
is32Bit('a'); // false;
```

## String.fromCodePonit()

- ES5提供的`String.fromCharCode`方法，用于从码点返回对应的字符，但是这个字符不能识别大于`0xFFFF`的字符。而ES6提供的`String.fromCodePoint`方法，可以识别`0xFFFF`的字符，弥补了`String.fromCharCode`方法的不足。
```js
String.fromCharCode(0x20BB7)
// "ஷ"

String.fromCodePoint(0x20BB7) 
// "𠮷"
```

## at()

- ES5提供的`String.prototype.charAt`方法，返回字符串给定位置的字符。该方法不能识别码点大于`0xFFFF`的字符。ES7提供了`at`方法，可以识别Unicode编号大于`0xFFFF`的字符，返回正确字符。
```js
'𠮷'.charAt(0); //  '\uD842'
'𠮷'.at(0); // 𠮷
```

## 字符的Unicode表示法

- JavaScript允许采用`\uxxxx`的形式来表示一个字符，但不能表示大于`0xFFFF`的字符，ES6对这一点做出了改进只要在`\u`后面加上大括号，就可以正确解读该字符。

## 正则表达式的u修饰符

- 点`.`在正则表达式中表示除了换行符之外的单个任意字符。对于码点大于`0xFFFF`的字符无法识别，必须加上u修饰符。
```js
var s = "𠮷";

/^.$/.test(s); //false
/^.$/u.test(s); //true
```

- ES6新增了使用大括号表示Unicode字符，这种表示法在正则表达式中必须用u修饰符，才能识别。
```js
/\u{61}/.test('a') // false
/\u{61}/u.test('a') // true
/\u{20BB7}/u.test('𠮷') // true
```

- 使用u修饰符后，所有量词都会正确识别大于码点大于0xFFFF的Unicode字符。
```js
/a{2}/.test('aa') // true
/a{2}/u.test('aa') // true
/𠮷{2}/.test('𠮷𠮷') // false
/𠮷{2}/u.test('𠮷𠮷') // true
```

- u修饰符也影响到预定义模式，能否正确识别码点大于`0xFFFF`的Unicode字符。\S是预定义模式，匹配所有不是空格的字符。只有加了u修饰符，它才能正确匹配码点大于0xFFFF的Unicode字符。
```js
/^\S$/.test('𠮷') // false
/^\S$/u.test('𠮷')


// 利用这一点，可以写出一个正确返回字符串长度的函数
function codePointLength(text) {
    var result = text.match(/[\s\S]/gu);
    return result ? result.length : 0;
}

var s = "𠮷𠮷";

s.length // 4
codePointLength(s) // 2
```

- 有些Unicode字符的编码不同，但是字型很相近，比如，\u004B与\u212A都是大写的K。
```js
// 不加u修饰符，就无法识别非规范的K字符。
/[a-z]/i.test('\u212A') // false
/[a-z]/iu.test('\u212A') // true
```

## normalize()

- 为了表示语调和重音符号，Unicode提供了两种方法。一种是直接提供带重音符号的字符，比如`Ǒ（\u01D1）`。另一种是提供合成符号（combining character），即原字符与重音符号的合成，两个字符合成一个字符，比如`O（\u004F）`和`ˇ（\u030C）`合成`Ǒ（\u004F\u030C）`。这两种表示方法，在视觉和语义上都等价，但是JavaScript不能识别。ES6提供`String.prototype.normalize()`方法，用来将字符的不同表示方法统一为同样的形式，这称为Unicode正规化。`normalize`方法可以接受四种参数。NFC，默认参数，表示“标准等价合成”（Normalization Form Canonical Composition），返回多个简单字符的合成字符。所谓“标准等价”指的是视觉和语义上的等价。NFD，表示“标准等价分解”（Normalization Form Canonical Decomposition），即在标准等价的前提下，返回合成字符分解的多个简单字符。NFKC，表示“兼容等价合成”（Normalization Form Compatibility Composition），返回合成字符。所谓“兼容等价”指的是语义上存在等价，但视觉上不等价，比如“囍”和“喜喜”。NFKD，表示“兼容等价分解”（Normalization Form Compatibility Decomposition），即在兼容等价的前提下，返回合成字符分解的多个简单字符。不过，`normalize`方法目前不能识别三个或三个以上字符的合成。这种情况下，还是只能使用正则表达式，通过Unicode编号区间判断。
```js
'\u01D1'==='\u004F\u030C' //false

'\u01D1'.length // 1
'\u004F\u030C'.length // 2


'\u01D1'.normalize() === '\u004F\u030C'.normalize()  // true


'\u004F\u030C'.normalize(NFC).length // 1
'\u004F\u030C'.normalize(NFD).length // 2
```

## includes(),startWith(),endWith()

- 传统上，JavaScript只有`indexOf()`方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6又提供了三种新的方法，他们都返回布尔值。`includes`表示是否找到了字符串，`startWith`表示是否以指定字符串开头，`endWith`表示是否以指定字符串结尾。这三个方法都支持两个参数，第二个参数除了`endWith`表示结束位置外，其他两个都表示开始搜索位置。
```js
var s = "Hello World";

s.startWith("World", 6); // true
s.endWith("Hello", 5); // true
s.includes("Hello", 6); // false
```

## repeat()

- `repeat`返回一个新字符串，表示将原字符重复n次。
```js
'x'.repeat(3); // xxx
```

## 正则表达式的y修饰符

- 除了u修饰符，ES6还增加了y修饰符，叫做粘连(sticky)修饰符。它的作用与g修饰符类似，也是全局匹配，后一次匹配从上一次匹配成功的下一个位置开始，不同之处在于，g修饰符只确保剩余位置中存在匹配，而y必须保证匹配必须从剩余位置第一个开始。
```js
var s = "aaa_aa_a";

var r1 = /a+/g;
var r2 = /a+/y;

r1.exec(s); // ["aaa"];
r2.exec(s); // ["aaa"];

r1.exec(s); // ["aa"];
r2.exec(s); // null;

// 进一步说，y修饰符号隐含了头部匹配的标志ˆ,y修饰符的设计本意，就是让头部匹配的标志ˆ在全局匹配中都有效

/b/y.exec("aba"); // null
```

## 模板字符串

- 模板字符串是字符串的增强版，用反引号(`)标识。他可以当做普通字符串，也可以定义多行字符串，或者在字符串中嵌入变量。
```js
`Javascript is good`

`Javascript
is good`

var t = "good";

`Javascript is ${t}`
```

- 嵌入变量需要将变量写在`${}`中，而且大括号内部可以运算，以及引用对象属性。
```js
var x = 1;
var y = 2;

console.log(`${x} + ${y} = ${x+y}`);
// "1 + 2 = 3"
```

# 数值的扩展

## 二进制和八进制表示

- ES6中提供了二进制和八进制的新写法，分别用前缀`0o`和`0b`表示。八进制的`0o`表示方法，将要将要取代已经在ES5中被逐步淘汰的加前缀0的写法。注意十六进制是用前缀`0x`。
```js
0b111110111 === 503 // true
0o767 === 503 // true
```

## Number.isFinite(),Number.isNaN()

- ES6在Number基础上增加了`Number.isFinite()`和`Number.isNaN()`两个方法，前者用来检测一个数是否无穷，后者用来检测一个数是否为`NaN`。
```js
Number.isFinite(15); // true
Number.isFinite(0.8); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite(-Infinity); // false

Number.isNaN(NaN); // true
Number.isNaN(15); // false
```

- 它们与传统的`isFinite`和`isNaN`方法不同的是，传统的要先将非数值对象转换为数值对象再进行判断，而这两个新方法，对于一切非数值返回`false`
```js
isFinite(25) // true
isFinite("25") // true
Number.isFinite(25) // true
Number.isFinite("25") // false

isNaN(NaN) // true
isNaN("NaN") // true
Number.isNaN(NaN) // true
Number.isNaN("NaN") // false
```

## Number.parseInt(),Number.parseFloat()

- ES6将全局方法`parseInt`和`parseFloat`，移植到`Number`对象上面，行为完全保持不变。这样做的目的是，逐步减少全局方法，使得语言逐步模块化。

## Number.isInteger()和安全整数

-  `Number.isInteger`用来判断一个数是否为整数，需要注意的是在JavaScript中，`3`和`3.0`是同一个数，都是整数。

- JavaScript能够准确的表示整数范围在`-2ˆ53`和`2ˆ53`之间。ES6引入了`Number.MAX_SAFE_INTEGER`和`Number.MIN_SAFE_INTEGER`这两个常量，用来表示这个范围的上下限。`Number.isSafeInteger`则是用来判断一个整数是否落在这个范围之内。

## Math对象的扩展

- `Math.trunc`用来返回一个数的整数部分，去除小数部分。
- `Math.sign`用来返回一个数的符号值。正数返回`+1`，负数返回`-1`，0返回`0`，NaN返回`NaN`。
- `Math.acosh(x)` 返回x的反双曲余弦（inverse hyperbolic cosine）
- `Math.asinh(x)` 返回x的反双曲正弦（inverse hyperbolic sine）
- `Math.atanh(x)` 返回x的反双曲正切（inverse hyperbolic tangent）
- `Math.cbrt(x)` 返回x的立方根
- `Math.clz32(x)` 返回x的32位二进制整数表示形式的前导0的个数
- `Math.cosh(x)` 返回x的双曲余弦（hyperbolic cosine）
- `Math.expm1(x)` 返回eˆx - 1
- `Math.fround(x)` 返回x的单精度浮点数形式
- `Math.hypot(...values)` 返回所有参数的平方和的平方根
- `Math.imul(x, y)` 返回两个参数以32位整数形式相乘的结果
- `Math.log1p(x)` 返回1 + x的自然对数
- `Math.log10(x)` 返回以10为底的x的对数
- `Math.log2(x)` 返回以2为底的x的对数
- `Math.tanh(x)` 返回x的双曲正切（hyperbolic tangent）

# 数组的扩展

## Array.from

- `Array.from`用于将类数组对象和可遍历对象转化成数组，包括ES6新增的`Set`和`Map`结构。
```js
Array.from({ 0: "a", 1: "b", 2: "c", length: 3 });
// [ "a", "b" , "c" ]
```

- `Array.from`还可以接受第二个参数，类似于数组的`map`方法用来对每个元素进行处理。
```js
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);
```

- Array.from()的一个应用是，将字符串转为数组，然后返回字符串的长度。这样可以避免JavaScript将大于\uFFFF的Unicode字符，算作两个字符的bug。
```js
function countSymbols(string){
    return Array.from(string).length;
}
```

## Array.of

- `Array.of`主要用来将一组数值转换为数组，这个方法主要用来弥补`Array()`构造函数的不足，参数个数不同，行为不一致。

## 数组实例的find()和findIndex()

- 数组实例的`find`用来找出第一个符合条件的数组元素，它的参数是一个函数。所有元素按顺序依次调用该回调函数，直到找到第一个符合条件的数组元素返回该数组元素，否则返回`undefined`。
```
[1, 5, 10, 15].find(function(value, index, arr) {
    return value > 9;
}) // 10
```

- `findIndex`与`find`类似，只是它返回的是符合条件的数组元素位置。

- 另外，这两个方法都可以发现NaN，弥补了IndexOf()的不足。
```js
[NaN].indexOf(NaN);
// -1

[NaN].findIndex(y => Object.is(NaN, y));
// 0
```

## 数组实例的fill()

- `fill`使用给定值填充数组。`fill`方法用于空数组的初始化非常方便。所有已存在元素会全部被抹去。同时`fill`可以接受第二第三个参数用于指定填充的起始位置和结束位置。
```js
['a', 'b', 'c'].fill(7); // [7, 7, 7]

new Array(3).fill(7); // [7, 7, 7]

['a', 'b', 'c'].fill(7, 1, 2) // ['a', 7, 'c']
```

## 数组实例的entries(), keys(), values()

- ES6提供三个新的方法`entries()`，`keys()`和v`alues()`——用于遍历数组。它们都返回一个遍历器，可以用`for...of`循环进行遍历，唯一的区别是`keys()`是对键名的遍历、`values()`是对键值的遍历，`entries()`是对键值对的遍历。

## 数组推导

- ES6提供简洁的写法，允许直接从现有数组直接推出新的数组，这被称为数组推导。注意，数组推导中，`for ... of`结构总是写在最前面，返回的表达式写在最后面，可以在`for ... of`后面再加上`if`来限制循环条件，因此他们可以替代数组中的`map`和`filter`方法。
```js
var a1 = [1, 2, 3, 4];
var a2 = [for (i of a1) i * 2]; // [2, 4, 6, 8]


var years = [ 1954, 1974, 1990, 2006, 2010, 2014 ];

[for (year of years) if (year > 2000) year]; // [ 2006, 2010, 2014 ]
```

- 在一个数组推导中，还可以使用多个for...of结构，构成多重循环。同时由于字符串可以视为数组，因此字符串也可以直接用于数组推导。
```js
var a1 = ["x1", "y1"];
var a2 = ["x2", "y2"];
var a3 = ["x3", "y3"];

[for (s of a1) for (w of a2) for (r of a3) console.log(s + w + r)];

// 字符串推导 
[for (c of 'abcde') if (/[aeiou]/.test(c)) c].join('') // 'ae'

[for (c of 'abcde') c+'0'].join('') // 'a0b0c0d0e0'
```

- 数组推导需要注意的地方是，新数组会立即在内存中生成。这时，如果原数组是一个很大的数组，将会非常耗费内存。

## Array.observe()，Array.unobserve()

- 这两个方法用于监听（取消监听）数组的变化，指定回调函数。它们的用法与`Object.observe`和`Object.unobserve`方法完全一致，也属于ES7的一部分，参阅对象扩展部分。唯一的区别是，对象可监听的变化一共有六种，而数组只有四种`add`、`update`、`delete`、`splice`（数组的`length`属性发生变化）。

# 对象的扩展

## 属性的简洁表示法

- ES6可以直接写入变量和函数，作为对象的属性和方法。这样书写更简洁。
```js
function f(x, y){
    return {x, y};
}
//等同于

function f(x, y){
    return {x : x, y : y};
}
```

- 方法也可以简写
```js
var o = {
    method() {
        return "hello";
    }
};

//等同于

var o = {
    method: function(){
        return "hello";
    }
};
```

## 属性名表达式

- ES6允许字面量定义对象时，用表达式作为对象的属性名，即把表达式放在方括号内。
```js
let propKey = "foo";

let obj = {
    [propKey] : true,
    ['a' + 'bc'] : 123,
    ['hello'](){
        return 'hi';
    }
};
```

## Object.is()

- `Object.is`用来比较两个值是否严格相等和`===`不同的有两处：一是`+0`不等于`-0`,`NaN`等于自身。

## Object.assign()

- `Object.assign`方法用来将源对象的所有可枚举属性，复制到目标对象。它至少需要两个对象作为参数，第一个参数是目标对象，后面的参数全是源对象。只要有一个参数不是对象就会报错

- 该方法可以为对象添加属性和添加方法，同时也可以克隆对象，代码如下：
```js
// 只克隆自身，不可隆继承的值
function clone(origin){
    return Object.assign({}, origin);
}

// 克隆自身和克隆继承的值
function clone(origin){
    let originProto = Object.getPrototypeOf(origin);
    return Object.assgin(Object.create(originProto), origin);
}
```

- `Object.assgin`可以为属性指定默认值。
```
const DEFAULTS = {
    logLevel : 0,
    outputFormat : 'html'
};

function processContent(options){
    let options = Object.assign({}, DEFAULT, options);
}
```

## proto属性，Object.setPrototypeOf()，Object.getPrototypeOf()

- `proto`属性，用来读取或设置当前对象的`prototype`对象。该属性一度被正式写入ES6草案，但后来又被移除。目前，所有浏览器都部署了这个属性。有了该属性，就不需要用`Object.create()`来创建新对象了。
```js
// es6写法
var obj = {
    __proto__ : someOtherObj,
    method : function(){
        
    }
}

// es5写法
var obj = Object.create(someOtherObj);
obj.method = function(){ ... }
```

- `Object.setPrototypeOf`方法的作用于`proto`属性一样，是ES6推荐的用来设置原型的对象的方法。


- 该方法于`Object.setPrototypeOf`配套，用来获取对象的`prototype`属性。

## Symbol

- ES6引入了一种新的原始数据类型`Symbol`，表示独一无二的ID。它通过Symbol函数生成，该函数可以接受一个参数，表示`Symbol`实例的名字，用`name`访问。
```js
let symbol1 = Symbol();
typeof symbol; //symbol

var mySymbol = Symbol('Test');
mySymbol.name; //Test
```

- `Symbol`函数不能使用`new`命令，否则会报错。这是因为生成`Symbol`是一个原始类型的值，不是对象。同时`Symbol`类型不能同其他类型进行运算。`Symbol`类型的值可以转换为字符串。

- `Symbol`类型作为属性名，不会出现在`for ... in`循环中，也不会被`Object.keys()`和`Object.getOwnPropertyNames()`返回，但有一个对应的`Object.getOwnPropertySymbols`方法，以及`Object.getOwnPropertyKeys`方法都可以获取`Symbol`属性名。

## Proxy

- `Proxy`可以理解为提供了一层机制，可以对外界的访问进行过滤和改写。`proxy`的原意是代理，这里表示由它来代理某些操作

- ES6原生提供`Proxy`构造函数，用来生成`Proxy`实例。要使`Proxy`起作用就必须操作代理对象，而不能直接操作原对象。`ownKeys`方法用来拦截`Object.keys()`操作。
```js
var person = {
    name : "hello";
}

var proxy = new Proxy(person, {
    get : function(target, property){
        
    },
    set : function(target, property, value){
        
    },
    ownKeys : function(target){
        reutrn ["hello"];
    }
});

Object.keys(proxy); // ["hello"]
```
- Proxy支持的拦截操作一览。
1. `defineProperty(target, propKey, propDesc)`：返回一个布尔值，拦截`Object.defineProperty(proxy, propKey, propDesc)`
2. `deleteProperty(target, propKey)` ：返回一个布尔值，拦截`delete proxy[propKey]`
3. `enumerate(target)`：返回一个遍历器，拦截`for (x in proxy)`
4. `get(target, propKey, receiver)`：返回类型不限，拦截对象属性的读取
5. `getOwnPropertyDescriptor(target, propKey)` ：返回属性的描述对象，拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`
6. `getPrototypeOf(target)` ：返回一个对象，拦截`Object.getPrototypeOf(proxy)`
7. `has(target, propKey)`：返回一个布尔值，拦截`propKey in proxy`
8. `isExtensible(target)`：返回一个布尔值，拦截`Object.isExtensible(proxy)`
9. `ownKeys(target)`：返回一个数组，拦截`Object.getOwnPropertyPropertyNames(proxy)`、`Object.getOwnPropertyPropertySymbols(proxy)`、`Object.keys(proxy)`
10. `preventExtensions(target)`：返回一个布尔值，拦截`Object.preventExtensions(proxy)`
11. `set(target, propKey, value, receiver)`：返回一个布尔值，拦截对象属性的设置
12. `setPrototypeOf(target, proto)`：返回一个布尔值，拦截`Object.setPrototypeOf(proxy, proto)`

- 如果目标对象是函数，那么还有两种额外操作可以拦截。`apply`方法：拦截`Proxy`实例作为函数调用的操作，比如`proxy(···)`、`proxy.call(···)`、`proxy.apply(···)`。
`construct`方法：拦截`Proxy`实例作为构造函数调用的操作，比如`new proxy(···)`。

- `Proxy.revocable`方法返回一个可取消的`Proxy`实例。
```js
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```

## Object.observe()，Object.unobserve()

- 注意，Object.observe和Object.unobserve这两个方法不属于ES6，而是属于ES7的一部分。

- `Object.observe`用来监听对象（以及数组）的变化，一旦监听对象发生变化，就会触发回调函数。
```
ar user = {};
Object.observe(user, function(changes){    
  changes.forEach(function(change) {
    user.fullName = user.firstName+" "+user.lastName;         
  });
});

user.firstName = 'Michael';
user.lastName = 'Jackson';
user.fullName // 'Michael Jackson'
```

- 回调函数的changes参数是一个数组，代表对象发生的变化。change对象是下面的样子。
```js
var change = {
  object: {...}, 
  type: 'update', 
  name: 'p2', 
  oldValue: 'Property 2'
}
```

- `Object.observe`方法目前共支持监听六种变化。`add`添加属性，`update`属性值变化，`delete`删除属性，`setProperty`设置原型，`reconfigure`属性的`attributes`对象发生变化，`preventExtensions`对象被禁止扩展（当一个对象变的不可扩展时， 也就不必再监听听了）。该方法可以接受第三个参数来指定监听的事件类型。
```js
Object.observe(o, observer, ['delete']);
```

- `Object.unobserve`方法用来取消监听。
```js
Object.unobserve(o, observer);
```

# 函数的扩展

## 函数参数的默认值

- ES6允许为函数设置默认值，即直接写参数定义的后面。定义了默认值的参数，后面不能再有其他未定义默认值的参数，因为定义了默认值的参数可以默认省略，这样会发生错误。

- 要注意的是指定了函数参数的默认值后，函数的length属性会失真，只会有没有默认值参数的长度。

## rest参数

- ES6引入了`rest`参数(... 变量名)，用于获取多余的参数，搭配一个数组，多余的参数会被全部放入数组中，这样就不需要使用`arguments`对象了。

## 扩展运算符

- 扩展运算符是三个点(...)。它好比`rest`参数的逆运算，将一个数组转为逗号分隔的参数序列。 该运算符主要用于函数调用。

## 箭头函数

- ES6使用`=>`定义函数。
```js
var f = v => v;
//等于
var f = function(v){
    return v;
}
```

- 如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代替参数部分。
```js
var f = () => 5;
```

- 箭头函数需要注意的几点：
1. 函数体内的`this`，绑定定义时所在的对象，而不是使用时所在的对象
2. 不可以当做构造函数，也就是说，不可以使用`new`命令，否则会抛出一个错误。
3. 不可以使用`arguments`对象，该对象在函数体内不存在。

# Set和Map数据结构

## Set

- ES6提供了新的数据结构`Set`。它类似于数组，与数组不同的是它不能有重复值。可以使用`new Set()`来创建一个新的集合。

- `Set`结构的构造函数，默认就是`Set`本身。同时它有`size`属性，用来表示成员总数。

- `Set`的方法有，`add`添加一个成员返回`Set`结构本身。`delete`删除某个值，返回一个布尔值表示是否删除成功。`has`表示是否有某个成员值，返回布尔值。`clear`清除所有成员变量，没有返回值。

- 遍历操作。`Set`结构有一个`values()`方法，可以返回一个遍历器。可以使用`for ... of`进行循环。Set结构的默认遍历器就是它的values方法。这意味着可以直接省略`values()`直接进行遍历。

- `Set`结构的`foreach`方法，参数是一个函数，对每个成员执行某种操作，返回一个新的`Set`。`foreach`方法还可以有第二个参数，表示绑定的this对象。

- 为了与`Map`保持一致，`Set`也有`keys()`和`entries()`方法，这时每个值的键名就是键值。

- 由于扩展运算符`（...）`内部使用`for...of`循环，所以也可以用于`Set`结构。这就提供了另一种数组元素去重的方法。
```js
let arr = [3,5,2,2,5];
let unique = [... new Set(arr)];  //[3, 5, 2]
```

- 同时数组的`map`和`filter`方法也可以用于`Set`了，因此使用`Set`可以很容易的实现并集和交集。
```js
let a = new Set([1,2,3]);
let b = new Set([4,3,2]);

let union = new Set([...a, ...b]);
// [1,2,3,4]

let intersect = new Set([...a].filter(x => b.has(x))); 
// [2,3]
```

## WeakSet

- `WeakSet`结构与`Set`类似，也是不重复的值的集合，但是它和`Set`有两个区别，一是它的成员只能是对象不能是其他类型的值，二是它的成员对象都是弱引用，即垃圾回收机制不考虑`WeakSet`对该对象的引用。这个特点意味着无法引用`WeakSet`的成员，因此`WeakSet`是不可遍历的。

- `WeakSet`有三种方法，`add`向`WeakSet`实例添加一个新成员。`delete`清除`WeakSet`实例的指定成员，`has`返回一个布尔值，表示某个值是否在`WeakSet`实例中。

## Map

- `Map`是一个键值对组合，可以使用`get`和`set`方法来设置键值对，它和对象不同的地方是，它的键名可以是其他类型的值，而对象的键名只能是字符串。

- 同时注意，只有同一个对象的引用，才视为是同一个值。如果是简单类型的值，只有严格相等，`Map`才将其视为使同一个值，包括`0`和`-0`。另外，虽然`NaN`自身不严格相等，但是`Map`将其视为同一个键。
```js
var map = new Map();

map.set(['a'], 555);
map.get(['a']); // undefined

//由于内存地址不一致所有这不是同一个对象
```

- `Map`的属性和方法有。`size`返回成员总数，`set`设置键值对，返回整个`Map` ，`get`获取键值如果找不到则返回`undefined`，`has`返回一个布尔值，表示某个键是否在`Map`数据结构中，`delete`删除某个键，返回`true`，如果删除失败，返回`false`。`clear`清除所有成员，没有返回值。由于`Set`方法返回的是自身，因此可以采用链式写法。
```
let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');
```

- `Map`提供三种遍历器，分别是`keys()` 返回键名遍历器，`values()`返回键值遍历器，`entries()`返回所有成员的遍历器。这些都可以使用`for ... of`来遍历。`Map`结构的默认遍历器接口是`entries()`。

- 使用扩展运算符，配合数组的`map`和`filter`可以实现`Map`过滤等操作。
```js
let map = new Map()
    .set(1, 'a')
    .set(2, 'b')
    .set(3. 'c');
    
let map1 = new Map(
    [...map].filter(([k,v]) => k < 3);
);

// 产生Map结构[1 => 'a', 2 => 'b']
```

## WeakMap

- `WeakMap`操作上同`Map`相同，它也和`WeakSet`一样，键名必须是对象，对象是弱引用，当对象被从内存中删除时，它的键所对应的`WeakMap`记录就会自动被移除。同时它和`Map`不同的是没有遍历操作，没有`size`属性，不支持`clear`方法。这与WeakMap的键不被计入引用、被垃圾回收机制忽略有关。

# Iterator和for ...of循环

- 遍历器`Iterator`是一种接口规格，任何对象只要有这个接口，就可以完成遍历操作。在ES6中主要供`for ...of`使用。

- 在ES6中有三种数据结构部署有原生的`Iterator`接口，分别是数组，类数组对象和`Set`和`Map`结构。除此之外，其他数据结构的`Iterator`接口都需要自己部署。

- 遍历器提供了一个指向当前对象的某个属性，使用`next`方法就可以将指针移动到下一个属性。`next`方法返回包含`value`和`done`两个属性的对象，`value`是当前遍历位置的值，`done`属性是一个布尔值，表示遍历是否结束。下面是一个部署`Iterator`接口的例子。其中`Symbol.iterator`是一个表达式，返回`Symbol`对象的`iterator`属性，这是一个预定义好的、类型为`Symbol`的特殊值，所以放在方括号内。
```js
let obj = {
  data: [ 'hello', 'world' ],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false
          };
        } else {
          return { value: undefined, done: true };
        }
      }
    };
  }
};


var arr = [1, 5, 7];
var arrEntries = arr.entries();

arrEntries.toString() 
// "[object Array Iterator]"

arrEntries === arrEntries[Symbol.iterator]()
// true
```

## for ...of

- JavaScript原有的`for ...in`循环，只能获取对象的键名，不能直接获取值。ES6提供`for ...of`循环，允许遍历获得键值。对于普通的对象，for...of结构不能直接使用，会报错，必须部署了iterator接口后才能使用。但是，这样情况下，for...in循环依然可以用来遍历键名。

- `for...of`循环可以使用的范围包括数组、类似数组的对象（比如`arguments`对象、`DOM NodeList`对象）、`Set`和`Map`结构、`Generator`对象，以及字符串。

# Generator

## 简介

- ES6引入`Generator`函数，作用就是起到完全控制函数内部状态的变化，依次遍历这些状态。在形式上`Generator`就是一个普通函数，不同的是在`function`与函数名之间有一个星号，同时函数体内部使用`yield`语句，定义遍历器的每个成员，即内部不同的状态。
```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
    return 'ending';
}

var hw = helloWorldGenerator();
```

- 调用上面的`Generator`函数的时候函数并不执行，而是返回一个遍历器，每次调用`next`函数，都会从函数体头部或者上一次执行的地方开始，直到遇到下一条`yield`语句。就是说`next`方法就是在遍历`yield`语句定义的内部状态。
```js
hw.next() 
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

## next方法的参数

- `yield`本身没有返回值或者说总是返回`undefined`，next方法可以带一个参数，该参数就会被当作上一个yield语句的返回值。

- `Generato`r函数从暂停状态到恢复运行，它的上下文状态`context`是不变的。通过`next`方法的参数，就有办法在`Generator`函数开始运行之后，继续向函数体内部注入值。也就是说，可以在`Generator`函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。由于第一次调用`next`没有`yield`语句，所以第一次不能传递参数，即使传递了参数也会直接忽略。
```js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var it = foo(5);

it.next()
// { value:6, done:false }
it.next(12)
// { value:8, done:false }
it.next(13)
// { value:42, done:true }
```

## for ...of循环

- `for ...of`循环可以自动遍历`Generator`函数，且此时不再需要调用`next`方法，一旦`next`方法遇到`done`值为`true`就会终止循环且不包括该值。下面是实现斐波那契数列的例子。
```js
function* fibonacci(){
    let [prev, curr] = [0, 1];
    for(;;){
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}

for(let n of fibonacci()){
    if(n > 1000) break;
    console.log(n);
}
```

## throw方法

- `Generator`函数还有一个特点，就是它可以在函数体外抛出错误，在函数体内捕获。这种函数体内捕获错误的机制，大大方便了对错误的处理。如果使用回调函数的写法，想要捕获多个错误，就不得不为每个函数写一个错误处理语句。


```js
var g = function* () {
    while (true) {
        try {
            yield;
        } catch (e) {
            if (e != 'a') {
                throw e;
            }
            console.log('内部捕获', e);
        }
    }
};

var i = g();
i.next();

try {
    i.throw('a');
    i.throw('b');
} catch (e) {
    console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```

## yield*语句

- 如果`yield`命令后面跟的是一个遍历器，需要在`yiel`d命令后面加上星号，表明它返回的是一个遍历器。这被称为`yield*`语句。
```js
let delegatedIterator = (function* () {
  yield 'Hello!';
  yield 'Bye!';
}());

let delegatingIterator = (function* () {
  yield 'Greetings!';
  yield* delegatedIterator;
  yield 'Ok, bye.';
}());

for(let value of delegatingIterator) {
  console.log(value);
}
// "Greetings!
// "Hello!"
// "Bye!"
// "Ok, bye."
```

## Generator与状态机

- `Generator`是实现状态机的最佳结构。
```js
// 普通写法
var ticking = true;
var clock = function() {
  if (ticking)
    console.log('Tick!');
  else
    console.log('Tock!');
  ticking = !ticking;
}

// Generator写法
var clock = function*(_) {
  while (true) {
    yield _;
    console.log('Tick!');
    yield _;
    console.log('Tock!');
  }
};
```

## Generator与协程

- 协程和线程很像。不同的是协程每次只能有一个在执行状态，其他都处于暂停状态，直达拿到运行权。另一个不同的地方是，线程是谁先拿到资源谁先执行，由环境决定，而协程有程序自己决定控制权。

- Generator函数是ECMAScript 6对协程的实现，但属于不完全实现，只做到了暂停执行和转移执行权，有一些特性没有实现，比如不支持所调用的函数之中的yield语句（即递归执行yield语句）。

- 如果将Generator函数看作多任务运行的方式，存在多个进入点和退出点。那么，一方面，并发的多任务可以写成多个Generator函数；另一方面，继发的任务则可以按照发生顺序，写在一个Generator函数之中，然后用一个任务管理函数执行

## 应用

### 异步操作的同步化表达

- 由于`Generator`函数有暂缓执行的效果，所以可以取代回调函数，异步操作的语句可以写在`yield`语句下面。
```js
function* loadUI() { 
    showLoadingScreen(); 
    yield loadUIDataAsynchronously(); 
    hideLoadingScreen(); 
} 
var loader = loadUI();
// 加载UI
loader.next() 

// 卸载UI
loader.next()
```

### 控制流管理

- 如果有一个多步操作非常耗时，采用回调函数，可能会写成下面这样。`Generator`函数可以进一步改善代码运行流程。实际操作中，一般让`yield`语句返回`Promise`对象。
```js
// 普通写法
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // Do something with value4
      });
    });
  });
});

// Generator写法
function* longRunningTask() {
  try {    
    var value1 = yield step1();
    var value2 = yield step2(value1);
    var value3 = yield step3(value2);
    var value4 = yield step4(value3);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}

scheduler(longRunningTask());

function scheduler(task) {
    setTimeout(function () {
        if (!task.next(task.value).done) {
            scheduler(task);
    }
  }, 0);
}
```

### 部署Iterator接口

- 利用`Generato`r函数，可以在任意对象上部署`iterator`接口。
```js
function* iterEntries(obj) {
    let keys = Object.keys(obj);
    for (let i=0; i < keys.length; i++) {
        let key = keys[i];
        yield [key, obj[key]];
    }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
    console.log(key, value);
}

// foo 3
// bar 7
```

### 作为数据结构

- Generator可以看作是数据结构，更确切地说，可以看作是一个数组结构，因为Generator函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口。
```js
function *doStuff() {
  yield fs.readFile.bind(null, 'hello.txt');
  yield fs.readFile.bind(null, 'world.txt');
  yield fs.readFile.bind(null, 'and-such.txt');
}
```

# Promise对象

## 基本用法

- ES6提供了`Promise`对象，所谓`Promise`对象，就是代表了未来某个要发生的事（比如回调函数），`Promise`的作用就是可以把异步操作以同步流程表达出来，避免了层层嵌套。同时`Promise`对象还提供了了一整套完整的接口，使得可以更容易控制异步接口。
```
var promise = new Promise(function(resolve, reject) {
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});

promise.then(function(value) {
  // success
}, function(value) {
  // failure
});



function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

timeout(100).then(() => {
  console.log('done');
});
```

## then链式操作

- `Promise.prototype.then`方法返回的是一个新的`Promise`对象，所以可以进行链式写法。同时第一个回调函数执行完毕后会将返回结果作为第二个回调函数的参数传入，如果类型是`Promise`对象，会等`Promise`对象有了处理结果再继续执行。
```js
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // 对comments进行处理
});
```

## catch捕捉错误

- `Promise.prototype.catch`是`Promise.prototype.then(null, reject)`的别名，用于指定发生，错误时的回调函数。`Promise`的对象的错误具有冒泡性质，会一直向后传递，直到被捕获为止。也就是说错误总会被下一个`catch`语句捕获。
```js
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前两个回调函数的错误
});
```

## Promise.all和Promise.race

- `Promise.all`用于将多个`Promise`实例转化为一个`Promise`实例，参数不一定要是数组，但一定要有`Iterator`接口，且每个成员都要是`Promise`对象。合成的`Promise`对象的状态有两种情况，一是所有的参数`Promise`都是`fulfilled`状态，该对象才会变成`fulfilled`状态。二是只要有一个对象是`reject`状态，该对象的状态就会变为`reject`状态。

- `Promise.race`方法同样是将多个`Promise`实例，包装成一个`Promise`实例。只要有一个参数`Promise`对象的状态改变，那合成的`Promise`对象的状态就跟着改变。那个率先改变的`Promise`实例的返回值，就传递给该对象的返回值。    

- 如果`Promise.all`方法和`Promise.race`方法的参数，不是`Promise`实例，就会先调用的`Promise.resolve`方法，将参数转为`Promise`实例，再进一步处理。

## Promise.resolve和Promise.reject

- `Promise.resolve`会将一个不是`Promise`对象的对象转化为一个新的`Promise`对象，且它的状态是`fulfilled`。

- `Promise.rejct`和`Promise.resolve`类似，不同的是它转化的`Promise`对象的状态时`rejected`。

## async函数

- `async`不属于ES6而属于ES7，`async`函数是用来取代回调函数的另一种方法。只要函数名之前加上`async`关键字，就表明该函数内部有异步操作。该异步操作应该返回一个`Promise`对象，前面用`await`关键字注明。当函数执行的时候，一旦遇到`await`就会先返回，等到触发的异步操作完成，再接着执行函数体内后面的语句。
```js
function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function asyncValue(value) {
  await timeout(50);
  return value;
}
```

# Class和Module

## Class

- ES6引入了`Class`（类）这个概念，作为对象的模板。通过`class`关键字，可以定义类。而且可以通过`extends`关键字实现继承。
```js
class ColorPoint extends Point {

  constructor(x, y, color) {
    super(x, y); // 等同于super.constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color+' '+super();
  }

}
```

## Module

- ES6在语言规格的层面上，实现了模块功能，而且实现得相当简单，完全可以取代现有的`CommonJS`和`AMD`规范，成为浏览器和服务器通用的模块解决方案。ES6模块的设计思想，是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。ES6模块不是对象，而是通过`export`命令显式指定输出的代码，输入时也采用静态命令的形式。所以，ES6可以在编译时就完成模块编译，效率要比`CommonJS`模块高。

### export命令，import命令

- `export`命令用于用户自定义模块，规定对外接口。`import`用于输入其他模块提供的功能，同时创造命名空间防止函数名冲突。
```js
// profile.js
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;

export {firstName, lastName, year};



// main.js

import {firstName, lastName, year} from './profile';

function sfirsetHeader(element) {
  element.textContent = firstName + ' ' + lastName;
}
```

- 如果想为输入的变量重新取一个名字，`import`语句中要使用`as`关键字，将输入的变量重命名。
```js
import { lastName as surname} from './profile';
```

### 模块的整体输入,module命令

- 整体输入可以用`*`，`module`命令可以取代`import`语句，达到整体输入模块的效果。`module`后面跟的变量，表示输出的模块定义在该变量上。
```js
import * as circle from 'circle';

console.log("圆面积：" + circle.area(4));
console.log("圆周长：" + circle.circumference(14));

//或

module circle from 'circle';

console.log("圆面积：" + circle.area(4));
console.log("圆周长：" + circle.circumference(14));
```

### export default命令

- 如果想要输出匿名函数，可以使用`export default`命令，其他模块输入的时候可以用`import`命令为该匿名函数指定任意名字。一个模块只能有一个默认输出，因此export deault命令只能使用一次。
```js
import $ from 'jquery';
```

### 模块继承

- 模块之间也可以继承。
```js

// circleplus.js

export * from 'circle';
```

### ES6模块转码

- 浏览器目前还不支持ES6模块，为了现在就能使用，可以将转为ES5的写法。可以使用[ES6 module transpiler](https://github.com/esnext/es6-module-transpiler)和[SystemJS](https://github.com/systemjs/systemjs)进行转码