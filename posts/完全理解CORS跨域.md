---
title: "完全理解CORS跨域"
date: "2018-7-9"
tags: 前端
author: xwchris
desc: "跨域使我们经常遇到的一种情况，这是当浏览器的同源限制我们又需要不同源的时候需要用到跨域技术，本文旨在完全理清跨域"
---

说跨域之前先说说同源策略，同源策略是一种约定，几乎所有现代浏览器都遵循了这种约定，它也是一种安全策略，确保非同源的请求无法随意请求，从而保证了网站的安全。同源需要保证协议，域名，端口都相同，只要有一个不同，那么他们就不是同源的。虽然同源策略保证了安全性，但有时候我们确实需要非同源之间相互访问，比如在前后端分离的项目中，前端和后端的地址分别为`http://www.xwchris.me`和`http://api.xwchris.me`。非同源之间跨域访问就要用到CORS跨域方法。CORS全称`Cross Origin Resource Sharing`即跨域资源共享。

## CORS跨域相关头部
以下是几种与跨域相关的头部，及简单的介绍。

- Access-Control-Allow-Headers（请求头，响应头，预请求）（携带Cookie情况下不能为*）
- Access-Control-Allow-Methods（请求头，响应头，预请求）（携带Cookie情况下不能为*）
- Access-Control-Allow-Origin（响应头，预请求/正常请求）（携带Cookie情况下不能为*）
- Access-Control-Allow-Credentials（响应头，预请求/正常请求）（携带Cookie情况下要设置为true）
- Access-Control-Max-Age（响应头，预请求）（单位s）

## 简单请求的CORS
简单请求要满足以下条件：

1. 请求方法必须是`GET`、`HEAD`和`POST`其中的一个
2. HTTP信息不能超过以下几种字段`Accept`、`Accept-Language`、`Content-Language`、`Last-Event-ID`和`Content-Type`且`Content-Type`的值只限于`application/x-www-form-urlencoded`、`multipart/form-data`和`text/plain`。

浏览器发送简单请求时会自动在请求头部添加`Origin`字段，代表访问源。
要支持CORS访问需要服务器在响应头中添加`Access-Control-Allow-Origin`，可以使用`*`来表示允许所有域跨域访问。

## 非简单请求的CORS
非简单请求与简单请求最大的不同在于，它有一次预请求`preflight`的过程，只有这次请求校验通过，才能发送正常的请求。
### 预请求
预请求是`OPTIONS`请求，浏览器会自动添加`Access-Control-Request-Headers`和`Access-Control-Request-Method`。需要服务器返回的响应头包括`Access-Control-Allow-Headers`、`Access-Control-Allow-Methods`和`Access-Control-Allow-Origin`。

除了`Access-Control-Allow-Origin`是必须的之外，其他两种只有在不符合简单请求需要的时候服务器才需要添加，比如在简单请求的基础上自定义了一个请求头`X-xx-name: chris`，那么服务器只需要在响应头中添加`Access-Control-Allow-Headers`。每种响应头都可以使用`*`通配符来表示所有。
### 正常请求
预请求完之后就可以发送正常请求了，正常请求的步骤与简单请求一致，也需要添加`Access-Control-Allow-Origin`响应头。
### 减少预请求次数
可以通过设置`Access-Control-Max-Aage`来减少预请求的次数，需要包含在预请求的响应头中，指定在该时间内预请求验证有效，不必每次都进行预请求，它的单位是`s`。如`Access-Control-Max-Age: 1728000`，即有效期为20天。

## 携带Cookie的请求
默认情况下，跨域请求不会携带Cookie，如果要携带Cookie进行跨域请求需要请求方和接收方同时支持。为了支持携带Cookie需要在请求的时候由开发者手动指定请求对象`xhr.withCredentials=true`。服务器响应头需要包含`Access-Control-Allow-Credentials: true`，如果是非简单请求，预请求也需要包含该头部。
	
这里需要注意的是，在这种情况下所有需要的响应头的值都不能是`*`，在需要的情况下都需要明确指定。

## 其他跨域方法
除了CORS，我们还可以使用`JSONP`技术来进行跨域，这是一种很古老的Hack。我们都是知道`script`标签可以访问任何域下的脚本，因此可以利用这种方法来进行跨域，这需要服务器进行配合。举个栗子🌰：
```html
<script type="text/javascript">
	function getName(name) {
		console.log(name);
	}
</script>
<script src="http://api.xxx.com?callback=getName"></script>
```
请求服务器后服务器需要拿到`callback`字段的值，然后将要返回的值变成JSON，放入`getName`中。最终返回的值x像这个形式`;getName({"name": "chris"})`，这样getName函数就可以就可以拿到相应的值。

JSONP相比CORS，只能进行GET请求，但是兼容性好一些。不过现代浏览器基本上都支持了CORS请求，可以放心食用。