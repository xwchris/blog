---
title: "ContentType与文件上传"
date: "2020-11-21"
tags: js
author: xwchris
desc: "最近在处理一个node文件上传问题的时候，遇到了很大的阻碍，最终查了很多资料并求助大佬才解决。这促使我要把这一块完全弄明白，下次遇到不能再到处查资料来解决问题"
---

## Content-Type 基本概念
Content-Type是HTTP的实体头部，用于指示资源的MIME类型。它可以出现在请求头或者响应头中。

1. 请求头中，客户端告诉服务端要发送给的数据类型，服务端就可以知道如何正确处理数据。
2. 响应头中，服务端告诉客户端返回的响应数据的类型，客户端（浏览器）会根据MIME类型进行相应的处理，或者开发者自己处理。

Content-Type的书写格式类似于下面这种
```
Content-Type: text/html; charset=utf-8
Content-Type: multipart/form-data; boundary=something
```
值的部分主要包含三部分
1. mimetype（资源或数据的MIME类型）
2. charset（字符集）
3. boundary（内容边界，在多类型内容中有用）

各部分之间用`;`分割，其中[MIME](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)的种类很多，下面主要说要我们常用的几种

## Content-Length
常与Content-Type一起出现的有Content-Length

Content-Length表示八位字节的长度，如果Content-Length是出现并有效的话，一定要保证该值的正确性，否则会出现意料之外的错误。

1. Content-Length大于实际长度则可能会出现无响应的情况（客户端或服务端等待读取下一个字节，却读取不到）
2. Content-Length小于实际长度则可能会截断数据信息

## Content-Type 应用在响应中
在响应中常见的Content-Type有：
1. `application/json` ajax请求数据返回json
2. `application/javascript` javascript文件
3. `text/css` css文件（注意与js不同的是这里是text，application通常表示可执行或可解析的二进制数据）
4. `text/html` html文件
5. `text/plain` 纯文本

## Content-Type 应用在请求中
请求发送数据使用`POST`请求，如使用`form`表单发送给的请求，通常使用的Content-Type有

### application/x-www-form-urlencoded
`application/x-www-form-urlencoded` 数据会被编码。编码规则为使用`&`分割键值对，键值对之间使用`=`分割键值，对于非字母和数字的字符则会进行[percent-encoding](https://developer.mozilla.org/zh-CN/docs/Glossary/percent-encoding)，特殊字符会以`%`后加ASCII码十六进制表示，空白符会以`+`或`%20`表示

```http
POST / HTTP/1.1
Host: test.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 19

name=xiaoming&age=8
```

### application/json
`application/json` 现在也有很多用在请求头中，用于高速服务端发送的是一个JSON字符串

```http
POST / HTTP/1.1
Host: test.com
Content-Type: application/json
Content-Length: 22

{"name": "xiaoming", "age": 8}
```

### multipart/form-data
`multipart/form-data` 通常表单需要传文件的时候使用，因为文件需要使用二进制方式表示

```http
POST /test.html HTTP/1.1 
Host: test.com 
Content-Type: multipart/form-data;boundary="boundary" 

--boundary 
Content-Disposition: form-data; name="name1" 

value1 
--boundary 
Content-Disposition: form-data; name="name2"

value2
```

## 文件上传
### 浏览器中上传
在浏览器中文件上传需要构造`FormData`对象，数据需要使用`append`加入`FormData`对象中，文件通常就是`File`或`blob`类型。`FormData`构造成功后，通过请求api将`FormData`传入即可，`Content-Type`和`Content-Length`浏览器客户端会自动设置

```js
const file = new File(["foo"], "foo.txt", {
  type: "text/plain",
})
const form = new FormData()
form.append('name', 'xiaoming')
form.append('file', file, 'text.png')
form.append('age', 8)

const xhr = new XMLHttpRequest()
xhr.open('POST', 'http://test.com/test/upload')
xhr.send(form)
```

请求内容是这样的
```http
POST /test/upload HTTP/1.1 
Host: test.com 
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryYr963ldXs1XPBv7A

------WebKitFormBoundaryYr963ldXs1XPBv7A
Content-Disposition: form-data; name="name"

xiaoming
------WebKitFormBoundaryYr963ldXs1XPBv7A
Content-Disposition: form-data; name="file"; filename="text.png"
Content-Type: text/plain

foo
------WebKitFormBoundaryYr963ldXs1XPBv7A
Content-Disposition: form-data; name="age"

8
------WebKitFormBoundaryYr963ldXs1XPBv7A--
```

### Node中上传
那如果要在node中像浏览器一样上传，要怎么做。node中没有FormData对象，这是我们可以借助第三方包[form-data](https://www.npmjs.com/package/form-data)
```js
const FormData = require('form-data')
const fs = require('fs')
 
const mime = 'image/png'
const form = new FormData()
form.append('name', 'xiaoming')
form.append('file', fs.createReadStream('/foo/bar.png'), {
	contentType: mime,
    filename: 'test.png'
})
form.append('age', 8)

// 获取内容length
const length = await new Promise((resolve, reject) => {
    data.getLength((err, length) => {
        if (err) {
            reject(err)
        } else {
            resolve(length)
        }
    })
})

// 这里使用axios发送请求，换成任何库都是一样的，主要需要注意的是正确设置`Content-Type`和`Content-Length`
const headers = data.getHeaders()
const res = await axios
  .post(pssConfig.uploadLink, data, {
      responseType: 'json',
      headers: {
          'Content-Type': headers['content-type'],
          'Content-Length': length
      }
  })   
```

## 总结
感谢大家耐心看完，很多写的不好的地方希望能指正。通常我们会忽略看起来很简单的东西，但真正用到的时候才显示出这些基础的重要性。但最重要的，不论是查资料还是问别人，在解决完问题后都要及时思考和总结才能变成自己的东西
