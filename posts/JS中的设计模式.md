---
title: "JS中的设计模式"
date: "2017-11-12"
tags: js
author: xwchris
desc: "JS设计模式阅读记录要点，待以后方便查阅，回忆，学习"
---

## Javascript的多态
多态是程序语言中很重要的一部分。多态最重要的思想是将“做什么”和“谁来做”分开，降低两者之间的耦合度，增强程序的扩展性和可维护性。使用多态的思想能让我们减少和消除`if...else`分支判断。一个渲染地图程序的例子。
```js
var googleMap = {
	show: function() {
		console.log('show google map');
	}
}

var baiduMap = {
	show: function() {
		console.log('show baidu map');
	}
}

// 使用if...else分支
function renderMap(type) {
	if (type === 'google') {
		googleMap.show();
	} else if (type === 'baidu') {
		baiduMap.show();
	}
}

// 使用多态特性
function renderMap(map) {
	if (map.show instanceof Function) {
		map.show();
	}
}
```
可以看出使用多态特性，代码简洁了很多，可扩展性页增强了很多。以后遇到`if...else`语句，先判断能否利用多态特性来让代码变得更DRY。

## Javascript中的原型继承
要实现原型继承的方式，需要遵循以下四点：
1. 所有的数据都要是对象
2. 对象的生成不是通过实例化类，而是找到一个对象并作为一个原型克隆它
3. 对象会记住它的原型
4. 如果对象无法响应某个请求，它会把这个请求委托给它的自己的原型

在js中，引入两套类型机制，基本类型和对象类型，基本类型包括`undefined`，`number`,，`string`， `boolean`， `function`，`object`。除了`undefined`之外，一切都应该是对象，`number`，`boolean`，`string`也可通过包装类的方式变成对象类型数据来处理。

在js中，生成一个对象通过克隆的方式，没有类的概念，通过`new Person()`构造一个对象，这里的`Person`并不是类，而是函数构造器。下面来模拟一下new运算的过程。
```js
var objectFactory = function() {
	var obj = {}, Constructor = [].shift.call(arguments);
	obj.__proto__ = Constructor.prototype;
	var ret = Constructor.apply(obj, arguments);
	return typeof ret === 'obj' ? ret : obj;
}

// 这两段代码效果相同
var a = objectFactory(A, 'chris');
var b = new A('chris');
```

对象的原型更确切的应该说是对象构造器的原型，js给对象提供了一个`__proto__`的属性在某些浏览器中会被公开出来。或者使用`Object.getPrototypeOf`来获取对象的原型。
```js
var a = new Object();
a.__proto__ === Object.prototype; // true
Object.getPrototypeOf(a) === Object.prototype; // true
```

## 闭包
闭包主要跟变量的作用域和声明周期密切相关。从理论上来说所有函数都是闭包，但是这没有什么意义，根据使用为主原则，除了分割作用域外，更常用的一个作用是延长变量的声明周期，一个js中经典的问题。
```js
// 假设现在有五个div元素
var nodes = document.getElementsByTagName('div');

for (var i = 0; i < nodes.length; i++) {
	nodes[i].onclick = function() {
		console.log(i);
	}
}
```
这段程序中不论点击哪一个都会输出5，这是因为`click`事件为异步事件，当我们点击的时候，更具作用域向上查找`i`，这个时候早已循环完毕，所有的`i`都是5。现在用闭包进行修改。
```js
var nodes = document.getElementsByTagName('div');

for (var i = 0; i < nodes.length; i++) {
	(function(i) {
		nodes[i].onclick = function() {
			console.log(i);
		}
	})(i);
```
这次在点击会依次输出`0,1,2,3,4`，同上理，点击触发的时候寻找`i`，首先查找闭包内部的`i`，闭包帮助我们把每一次循环的值记录了下来。

同理编出以下判断类型的代码
```js
var Type = {};

for (var i = 0, type; type = ['String', 'Array', 'Number'][i++];) {
	(function (type) {
		Type['is' + type] = function(obj) {
			return Object.prototype.toString.call(obj) === '[object ' + type + ']';
		}
	})(type);
}

Type.isNumber(2); // true
Type.isArray([]); // true
```

闭包主要用来封装私有变量和延长变量声明周期。

## 高阶函数
所谓高阶函数就是一种参数为函数，同时返回值为函数的函数，他的用法有很多，这里列一些常见的高阶函数的应用。

### currying
currying又称部分求值，一个currying的函数首先接收一些参数，接收到参数后并不立刻求值，而是返回另一个函数，刚才传入的参数在函数中形成闭包被保存起来，带到函数真正需要求值的时候，之前传入的所有参数都会被一次性用于求值。下面是一个计算每日开销的例子。
```js
function currying(fn) {
	var args = [];
	
	return function() {
		if (arguments.length === 0) {
			return fn.apply(this. args);
		} else {
			[].push.apply(args, arguments);
			return arguments.callee;
		}
	}
}

var cost = (function() {
	var money = 0;
	
	return function () {
		for (var i = 0; i < arguments.length; i++) {
			money += arguments[i];
		}
		return money;
	};
})();

// 并不会真正计算
cost(100);
cost(200);

// 真正计算
cost();
```

### uncurrying
uncurrying可以把函数的this泛化的过程提取出来
```js
Function.prototype.uncurrying = function () {
	var self = this;
	return function() {
		var obj = Array.prototype.shift.call(arguments);
		return self.apply(obj, arguments);
	}
}

var push = Array.prototype.push.uncurrying();

(function() {
	push(arguments, 4);
	console.log(arguments);
})(1,2,3);
```

### 函数节流
函数节流用来控制很频繁的操作，比如`mousemove`事件等。
```js
var throttle = function (fn, interval) {
	var _self = fn,
		timer,
		firstTime = true; // 第一次调用
		
		return function() {
			var _me = this;
			var args = arguments;
			
			if (firstTime) {
				_self.apply(_me, args);
				return firstTime = false;
			}
			
			if (timer) {
				return false;
			}
			
			timer = setTimeout(function() {
				clearTimeout(timer);
				timer = null;
				_self.apply(_me, args);
			}, interval || 300);
		}
}

window.onresize = throttle(function() {
	console.log(1);
}, 500);
```

### 分时函数
如果要同时创建100000个div，浏览器会假死，我们可以利用分时函数来分组创建元素。
```js
var ary = [];

for (var i = 0; i < 100000; i++) {
  ary.push(i);
}

var timeChunk = function(ary, fn, count, interval) {
  var timer;

  var start = function() {
    for (var i = 0; i < Math.min(count, ary.length); i++) {
      var obj = ary.shift();
      fn(obj);
    }
  }

  return function() {
    timer = setInterval(function() {
      if (ary.len === 0) {
        return clearInterval(timer);
      }

      start();
    }, interval || 200)
  }
}

var renderFriendsList = timeChunk(ary, function(n) {
  var dom = document.createElement('div');
  dom.innerHTML = n;
  document.body.appendChild(dom);
}, 20, 100);

renderFriendsList();
```

## 策略模式
策略模式是定义一系列算法，并把它们封装起来，并且使他们可以互相替换。下面是一个简单的动画的例子
```js
// 定义渐变函数
var tween = {
  // t动画已消耗时间,b动画初始位置,c动画目标位置，d动画持续总时间
  linear: function (t, b, c, d) {
    return c * t / d + b;
  },
  easeIn: function (t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  strongEaseIn: function (t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  strongEaseOut: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  sineaseIn: function (t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  sineaseOut: function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  }
}

// 动画构造器
var Animate = function(dom) {
  this.dom = dom;
  this.startTime = 0;
  this.startPos = 0; // 开始位置
  this.endPos = 0; // 结束位置
  this.propertyName = null; // 要改变的属性名称
  this.duration = null; // 动画持续时间
  this.easing = null; // 缓动算法
}

// 动画开始函数start
Animate.prototype.start = function (propertyName, duration, endPos, easing) {
  this.startTime = +new Date;
  this.propertyName = propertyName;
  this.duration = duration;
  this.startPos = this.dom.getBoundingClientRect()[propertyName] || 0;
  this.endPos = endPos;
  this.easing = tween[easing];

  var self = this;
  var timer = setInterval(function() {
    if (self.step() === false) {
      clearInterval(timer);
      return;
    }
  }, 19);
}

// 动画计算位置函数step
Animate.prototype.step = function () {
  // 获得当前时间
  var current = +new Date;

  // 修正位置
  if (current - this.startTime > this.duration) {
    this.update(this.endPos);
    return false;
  }

  this.update(this.easing(current - this.startTime, this.startPos, this.endPos, this.duration));
}

// 动画更新函数update
Animate.prototype.update = function (pos) {
  console.log(this.dom, pos);
  return this.dom.style[this.propertyName] = pos + 'px';
}

// 测试动画效果
var div = document.getElementById('div');
var animate = new Animate(div);

animate.start('marginLeft', 1000, 200, 'sineaseIn');
```

## 命令模式
命令模式以一种松耦合的方式将接收者和命令之间关联起来。
以下是一个命令模式的实例，模拟街头霸王游戏，WASD用来移动，并且具有播放录像功能。实现原理就是将移动封装成命令，然后将命令进行缓存。点击播放录像的时候重新执行一遍命令即可。
```js
var Ryu = {
	"up": function() {
		console.log('up');
	},
	"down": function() {
		console.log('down');
	},
	"left": function() {
		console.log('left');
	},
	"right": function() {
		console.log('right');
	}
}

var commands = {
	"119": "up", // w
	"115": "down", // s
	"97": "left", // a
	"100": "right" // d
};

var commandStack = []; // 保存命令的堆栈

var makeCommand = function (receiver, action) {
	return function () {
		receiver[action]();
	}
}

document.onkeypress = function(ev) {
	var keyCode = ev.keyCode, command = makeCommand(Ryu, commands[keyCode]);
	
	if (command) {
		command();
		commandStack.push(command);
	}
}

// 点击播放录像
document.getElementById('replay').onclick = function() {
	var command;
	while(command = commandStack.shift()) {
		command();
	}
}
```

## 宏命令
宏命令是一组命令的集合，通过执行宏命令我们可以一次执行一组命令。
```js
var closeCommand = {
	execute: function() {
		console.log('关门');
	}
}

var openPcCommadn = {
	execute: function() {
		console.log('开PC');
	}
}

var MacroCommand = function () {
	return {
		commandList: [],
		add: function(command) {
			this.commandList.push(command);
		},
		execute: function() {
			for (var i = 0, command; command = this.commandsList[i++];) {
				command.execute();
			}
		}
	}
}

var macroCommand = MacroCommand();
macroCommand.add(closeCommand);
macroCommand.add(openPcCommand);

macroCommand.execute();
	
```
这个例子的命令如`closeCommand`并没有包含任何receiver的信息，它本身就包揽了执行请求的行为，这更我们之前看到的命令对象都包含了一个receiver是矛盾的。包含receiver的命令是“傻瓜式”的，它只负责把客户的请求转交给接收者来执行。没用接收者的称谓智能命令，这种方式和策略模式非常接近，没有办法从结构上分辨，只是他们的意图不同，策略模式所有策略对象的目标都是一致的。而智能命令解决目标更具有发散性。

## 享元模式
享元模式要求将对象的属性划分为内部状态和外部状态，内部状态可以共享，外部状态无法共享。它的目标是尽量减少共享对象的数量。下面是划分内部状态和外部状态的原则。它是为解决性能问题而生的。

1. 内部状态存储于对象内部
2. 内部状态可以被一些对象共享
3. 内部状态独立于具体的场景，通常不会改变
4. 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享

下面是一个对象池的例子。对象池是一种共享技术，需要对象的时候不是直接创建而是从对象池中获取，如果对象池中有空闲的对象则直接获取，没有则创建一个新对象。使用完后再将对象放回对象池。它跟享元模式有一些相似之处，但是没有分离内部状态和外部状态的过程。
```js
var objectPoolFactory = function (createObjFn) {
	var objectPool = [];
	
	return {
		create: function() {
			var obj = objectPool.length === 0 ? createObjectFn.apply(this, arguments) : objectPool.shift();
			return obj;
		},
		recover: function(obj) {
			objectPool.push(obj);
		}
	}
}

var imageFactory = objectPoolFactory(function() {
	var image = document.createElement('image');
	
	image.onload = function() {
		console.log('image loaded');
		imageFactory.recover(image);
	}
	
	return image;
}

var img1 = imageFactory.create();
img1.src = 'http://baidu.com';

var img2 = imageFacotry.create();
img2.src = 'http://google.com';
```

### 用AOP实现职责链
```js

Function.prototype.after = function(fn) {
  var self = this;

  return function() {
    var ret = self.apply(this, arguments);

    if (ret === 'nextSuccessor') {
      return fn.apply(this, arguments);
    }

    return ret;
  }
}

var order = order500.after(order200).after(orderNormal);
```
使用AOP实现职责链既简单又巧妙，但是这种把函数叠在一起的方式，同时也叠加了函数的作用域，如果链条较长也会对性能有较大影响。

## 职责链模式
职责链模式是使多个对象都有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递，知道有一个对象可以处理它为止。下面是一个职责链模式的例子。

假设一个手机售卖网站针对用户交纳的不同定金有不同的优惠，已经支付过500元定金的用户会受到100元的优惠券，已经支付200元定金的用户可以受到50元的优惠券，没有支付定金的用户只能进入普通购买模式，且有库存限制。我们要写一个`order`函数来给出用户订单信息。`orderType`表示订单类型，`pay`表示用户是否已支付定金没有支付要降级到普通用户，`stock`用来表示库存。如果用普通方式写那么我们的函数会充斥大量的`if...else`语句，这里我们使用职责链模式来写这个函数。
```js
var order500 = function(orderType, pay) {
  if (orderType === 1 && pay) {
    console.log('500元定金订购，获得100元优惠券');
  } else {
    return 'nextSuccessor';
  }
}

var order200 = function(orderType, pay) {
  if (orderType === 2 && pay) {
    console.log('200元定金订购，或得50元优惠券');
  } else {
    return 'nextSuccessor';
  }
}

var orderNormal = function(orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买，无优惠券');
  } else {
    console.log('手机库存不足');
  }
}

var Chain = function(fn) {
  this.fn = fn;
  this.nextSuccessor = null;
}

Chain.prototype.setNextSuccessor = function(successor) {
  return this.nextSuccessor = successor;
}

Chain.prototype.passRequest = function() {
  var ret = this.fn.apply(this, arguments);

  if (ret === 'nextSuccessor') {
    return this.nextSuccessor && this.nextSuccessor.passRequest.apply(this.nextSuccessor, arguments);
  }

  return ret;
}

var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);

chainOrder500.setNextSuccessor(chainOrder200).setNextSuccessor(chainOrderNormal);

// 测试
chainOrder500.passRequest(1, true, 500);
chainOrder500.passRequest(1, false, 500);
chainOrder500.passRequest(2, true, 500);
chainOrder500.passRequest(2, false, 500);
chainOrder500.passRequest(3, true, 500);
chainOrder500.passRequest(3, false, 0);
```

## 中介者模式
中介者模式使得各个对象之间得以解耦，以中介者和对象之间的一对多关系取代了对象之间的网状多对多欢喜。各个对象之间只需关注自身功能的实现，对象之间的交互关系交给了中介者对象来实现和维护。中介者模式虽然可以方便的对模块和对象进行解耦但是对象之间并非一定需要解耦。我们写程序是为了快速完成项目交付生产，而不是堆砌模式和过度设计。关键在于如何去衡量对象之间的耦合关系。下面是一个中介者模式的简单例子，虽然这里不用中介者模式可以很简单的实现，但是为了说明中介者模式，用中介者模式来实现。

这是一个小游戏，可以加入不同的玩家，为简化问题，当一个玩家死亡时，其他玩家获胜。如果用普通的写法，当一个玩家死亡时，我们需要通知所有的玩家他们获胜，这时玩家之间都耦合在一起。使用中介者模式，我们可以解开玩家之间的耦合关系，每个玩家只需要关注自己的状态，当状态改变通知中介者，它会帮助我们通知到各个玩家改变他们的状态。中介者模式用在这里可能有点大材小用，但是足以说明问题。
```js
var Player = function(name) {
  this.name = name;
  this.state = 'alive';
}

Player.prototype.die = function() {
  this.state = 'die';
  mediator.receiveMessage('playerDie', this);
}

Player.prototype.win = function() {
  this.state = 'win';
  console.log(this.name + ':' + ' win');
}

var PlayerFactory = function(name) {
  var player = new Player(name);

  mediator.receiveMessage('addPlayer', player);
  return player;
}

var mediator = {
  players: [],
  receiveMessage: function(instructor, player) {
    var players = this.players;
    if (instructor === 'addPlayer') {
      players.push(player);
    } else if (instructor === 'playerDie'){
      for(var i = 0; i < players.length; i++) {
        if (players[i] !== player) {
          players[i].win();
        }
      }
    }
  }
}

var player1 = new PlayerFactory('player1');
var player2 = new PlayerFactory('player2');
var player3 = new PlayerFactory('player3');

player1.die();

```

## 装饰者模式
装饰者模式可以给对象动态地增加职责，而不改变对象自身。跟继承相比，这是一种更加灵活的方式。

### AOP
AOP中文翻译为“面向切面编程”，什么是切面，其实我理解的也不是很好。不过有一篇[文章](https://hackernoon.com/aspect-oriented-programming-in-javascript-es5-typescript-d751dda576d0)中写到：如果你为了满足当前环境而每次都粘贴一些重复变量或参数，那么这就是一个基础的AOP候选。目前我暂时把它理解为，将操作想像成一个个平面，如果可以将各层分开，那么就可以在一个操作之前或之后进行动态装饰，这是我理解的AOP。

下面是一个使用AOP装饰函数进行数据上报的例子。加入有一个登录弹框，我们要记录有多少人点击了登录，当没有使用AOP装饰时，我们像下面这样写：
```js
// 弹出浮层
var showLogin = function() {
	// 弹出浮层
}

var log = function() {
	// 记录日志
}

document.getElementById('button').onclick = showLogin;
```

这样在`showLogin`函数中既要打开浮层又要负责数据上报，两个层面的功能却被耦合在一个函数中，使用AOP分离后，可以像这样：
```js
Function.prototype.after = function(afterfn) {
	var _self = this; // 保存原函数
	
	return function() {
		var ret = _self.apply(this, arguments); // 保证this不被劫持
		afterfn.apply(this, arguments);
		return ret;
	}
}

// 弹出浮层
var showLogin = function() {
	// 弹出浮层
}

var log = function() {
	// 记录日志
}

showLogin = showLogin.after(log);

document.getElementById('button').onclick = showLogin;
```
可以看出这样我们将两个层面分离开来，如果有其他需要记录日志的函数，我们可以很方面的同时进行装饰。

## 状态模式
状态模式的关键是区分事务f内部的状态，事务内部状态的改变忘完会带来事务的行为改变。通常谈到封装我们都喜欢先封装事务的行为，但是在状态模式中，要把各个状态都封装成单独的类。js是一种无类语言，没有规定状态一定要从类型中创建而来。状态模式是状态机的实现之一，下面是一个开关的例子：
```js
var Light = function() {
	this.currState = FSM.off;
	this.button = null;
}

Light.prototype.init = function() {
	var button = doument.createElement('button'), self = this;
	
	button.innerHTML = '已关灯';
	this.button = document.body.appendChild(button);
	
	
	this.button.onClick = function( ){
		self.currState.buttonWasPressed.call(self); // 把请求委托给FSM状态机
	}
};

var FSM = {
	off: {
		buttonWasPressed: function() {
			console.log('关灯');
			this.button.innerHTML = '下一次按我是开灯';
			this.currState = FSM.on;
		}
	},
	on: {
		buttonWasPressed: function() {
			console.log('开灯');
			this.button.innerHTML = '下一次按我是关灯';
			this.currState = FSM.off;
		}
	}
};
```