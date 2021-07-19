---
title: "Web安全"
date: "2020-06-07"
tags: 前端
author: xwchris
desc: "很多网站经常会有各种方面的漏洞，这些漏洞会被黑客利用来窃取用户信息或做一些其他不合法的事。目前对于网站最常见的两种攻击方式xss和csrf"
---

## XSS
### 什么是xss
xss全称为cross site  script，翻译过来是跨站脚本攻击。该攻击主要利用的是浏览器对服务器内容的信任造成的，如果有用户恶意在网站上插入了脚本，而该内容又被保存到服务器展示给其他用户，那么这就完成了一个跨站脚本攻击。通常恶意脚本会执行一些其他操作，如冒充用户发送请求等，那么这就是csrf攻击。因此xss一般不是独立存在的，它是一种攻击常用到的手段。

### 如何防护
为了防止xss攻击，关键是不能执行恶意脚本。因此有以下几种手段：
- 在客户端对用户输入的内容进行过滤，如过滤`<script>`标签等
- 展示用户内容的时候对用户内容进行转义如将`<`转义为`&lt`
- 对链接内容进行过滤如过滤掉`javascript:`的链接等
- 使用csp进行脚本执行的限制


## CSRF
### 什么是csrf
csrf全称cross site request forgery，翻译过来是跨站请求伪造。它主要利用的是服务器对浏览器的信任，利用浏览器存储的用户验证信息，来对服务器进行请求。

### 如何防护
解决伪造的问题，主要是要有验证手段，来验证请求属于正常的请求
- 对于可以修改的内容的接口使用Restful形式的接口
- 使用refer或者在客户端生成token每次用来校验请求是否合法
- cookie设置为secure和httpOnly

## CSP
CSP全称content security policy，即内容安全策略。它可以用来限制网站资源的来源，来过滤不合规则的资源或者不合规则的脚本等。

要使csp生效，可以在响应头中设置

```
Content-Security-Policy: policy
```

或者可以利用`meta`标签的`http-equiv`模拟响应头，在客户端设置csp
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

CSP可以设置很多种类的资源，常用的有`default-src`，`style-src`，`script-src`。
它的值可以设置为域如`*.trusted.com`或`'self'`代表当前域等很丰富的种类，详细的值请参考[MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)