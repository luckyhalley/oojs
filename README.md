OOJS - make codes easy!
===================================  
简单, 是一种美、一种哲学、一种信仰.
oojs 提供了最佳的 javascript 编程方式, 让代码更加简单的编写、阅读和维护.

**oojs 代码示例**:
```js
//创建cookie类
oojs.define({
    name: 'cookie',                 //类名
    namespace: 'oojs.utility',      //命名空间
    prefix: 'prefix-',              //属性
    getCookie:function(key){...}    //函数
});

//使用cookie类
var cookie = oojs.using('oojs.utility.cookie');
var id = cookie.getCookie('id');
```

oojs 是 **编程框架** 而非 **类库** , 适用于所有的js项目, 可以和各种规范如ADM,CDM等一起使用. 
oojs中的oo即面向对象(Object Oriented), **对象是组织代码的最小单位.** 

**oojs 核心理念**:
> 万物皆对象
> 对象皆JSON

**oojs 主要功能**:
> 使用JSON结构描述类
> 使用命名空间组织类
> 兼容全版本node环境
> 兼容全部浏览器环境

---

#传统的JS编程方式

首先, 让我们了解为何传统js编程方式会导致代码的可读性下降. 
因为js的灵活性, 在开发中经常会出现孤零的变量和函数, 比如:
```js
var a = function(){return b};
var b = 'hello';
var c = a();
function d(){
    //...
}
```
所以我们常常见到这样组织代码的:
```js
var property1 = 'a';
function method1(){...};
var property2 = 'b';
function method2(){...};
var property3 = '';
if(property1==='a'){
    property3 = 'c';
    var method3 = method1(property3);
}
```


再加上匿名函数和闭包的乱入:
```js
//匿名函数和闭包举例
var property4 = 'd';
var method4 = method1(function(){
    function(){
        return property4;
    }
})
```
即使是有名的js项目或者大神们编写的代码已经尽量清晰的去组织变量和代码, 当代码量过多时也必然会导致可读性下降.
本质原因是传统的js开发 **将变量作为了组织代码的最小单位** .

oojs的思想是 **将对象作为组织代码的最小单位** . 实际上, 已经有很多的开发者意识到了这一问题.比如在最新版本的jQuery中源码, 已经通过使用JSON对象提高了代码可读性:
```js
jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},
    ...
	noop: function() {}
});
```
由此可见, **使用JSON字面量创建对象, 是最自然的面向对象编程方式.**

基于此, oojs诞生了.

---
# oojs入门

**名词解释-全限定性名**:  命名空间+类名.比如类C, 所在的命名空间是A.B, 则C的全限定性名是A.B.C

## 简单示例
下面是一个简单的node程序示例.
```js
//node环境下引用oojs
require('node-oojs');

//定义cookie类
oojs.define({
    name: 'cookie',
    namespace: 'oojs.utility',
    getCookie:function(key){...},
    setCookie:function(key, value, option){...}
});

//使用cookie类, 因为cookie是静态类所以不需要实例化
var cookie = oojs.using('oojs.utility.cookie');

//使用cookie类的getCookie函数
var id = cookie.getCookie('id');
```
在oojs中, 使用JSON结构声明一个类. 通过oojs.define完成类的定义. 通过oojs.using获取到类的引用. 


## 开始使用

下面详细的讲解使用oojs的步骤.

### 1. 引用oojs
oojs支持浏览器和node环境. 使用oojs的第一步就是引入oojs.

#### node 环境
使用npm或者cnpm安装最新版本的oojs. **注意oojs的npm模块名称叫做"node-oojs"**(因为npm上的oojs名字已经被占用).
在项目根目录运行npm命令:
```js
npm install node-oojs
```
在程序的入口处引用:
```js
require('node-oojs');
```
整个程序进程只需要引用一次. 


#### 浏览器环境
在浏览器环境下, 需要手动下载oojs文件. 项目地址:
```html
https://github.com/zhangziqiu/oojs
```

oojs项目的bin目录下面, 有两个js文件:

* oojs.core.js: 仅包括核心的面向对象编程功能.
* oojs.js: 除了核心功能, 还包括loader类用于加载依赖类. 以及event类用于处理事件编程. 通常都加载此文件.

将oojs.js下载到项目中后, 直接引用即可:

```html
<script type="text/javascript" src="./bin/oojs.js"></script>
```

### 2. 创建类
在 **[项目根目录]/src/utility** 目录下创建template.js文件, 内容如下:

```js
    //template类提供一个render方法用于模板和数据的拼接
	oojs.define({
		name: 'template',
		namespace: 'utility',
		render: function (source, data) {
			var regexp = /{(.*?)}/g;
			return source.replace(regexp, function (match, subMatch, index, s) {
				return data[subMatch] || "";
			});
		}
	});
```
上面就是一个完整类的代码. 在oojs中, js类文件都是以oojs.define开始, 里面包括一个JSON格式的对象. 开发者可以自由的添加属性和方法, 但是要注意   **此JSON对象的以下属性是oojs框架使用的:**    
    
* name: 类名, 比如上面的 template
* namespace: 类所在的命名空间. 比如template类放在了 utility 命名空间下. 我们可以将所有的工具类都放在utility命名空间下,实现类的组织管理.
* 名字为 **"类名"** 的函数(比如template类的template函数): 类的构造函数. 使用 oojs.create 创建一个类实例时, 会执行一次构造函数. 
* 名字为 **"$+类名"** 的函数(比如template类的$template函数): 类的静态构造函数. 当使用oojs.define将一个类引入时, 会执行一次静态构造函数. 创建实例的时候不会执行. 多次执行oojs.define只有第一次引入时会调用一次.
* deps: 依赖的类. 使用object描述. key为引用变量名, value为类的全限定性名. 后续可以通过this.key引用到这个依赖类. **在构造函数和静态构造函数执行时,所有的deps依赖类都已经加载完毕.可以安全的使用依赖类.** 在构造函数或者静态构造函数中可以放心的使用this.key的方式使用依赖类. 有关加载依赖的详细说明后面会有单独的章节讲解.

### 3. 使用类
现在我们已经有了一个template类. 下面介绍如何在不同的环境下使用template类.
#### 3.1 创建入口类
通常程序都有一个main函数作为程序入口, 在oojs中稍有不同, 借助oojs的依赖管理和静态构造函数, 我们可以构造一个入口类main.js: 
```js
    oojs.define({
        name: 'main',
        deps: { template: 'utility.template' },
        $main: function(){
            var result = this.template.render('My name is {name}', {name:'ZZQ'});
            console.log(result);
        }
    });
```
main.js可以放置在任意目录,而且也没有命名空间. main的静态构造函数$main作为程序的入口, 在静态构造函数中通过"this.template"的引用到template类. 

#### 3.2 node环境运行
在node环境中运行main.js, 需要在main.js顶部添加引用oojs库的代码:

```js
    //引用oojs库
    require('node-oojs');
    //后面就是main类的完整代码.
    oojs.define({
        name: 'main',
        deps: { template: 'utility.template' },
        $main: function(){
            var result = this.template.render('My name is {name}', {name:'ZZQ'});
            console.log(result);
        }
    });
```

运行:
```js
    node main.js
```
即可看到输出结果:
```js
    My name is ZZQ
```

在node环境下, 当加载 utility.template 类时, 默认会从如下路径加载类文件:
```js
[node运行目录]/src/utility/template.js
```
即将 [node运行根目录]/src 目录作为代码存放的根目录, 每一个命名空间就是一个文件夹.

#### 3.3 浏览器环境
假设项目目录就是网站的根目录, 并且网站名称是 localhost. 
在根目录下创建main.html, 编写如下代码:
```html
<!DOCTYPE html>
<html>
    <body>
        <!-- 引入oojs, 假设将oojs.js下载到了src目录中 -->
        <script type="text/javascript" src="./src/oojs.js"></script>
        <!-- 设置类文件根目录 -->
        <script>
            oojs.setPath('http://localhost/src/');
        </script>
        <script>
                //下面是main.js的内容, 可以将main直接写在页面里
                oojs.define({
                    name: 'main',
                    deps: { template: 'utility.template' },
                    $main: function(){
                        var result = this.template.render('My name is {name}', {name:'ZZQ'});
                        console.log(result);
                    }
                });
        </script>
    </body>
</html>
```

打开 http://localhost/main.html页面, 即可在console控制台中看到:
```js
    My name is ZZQ
```

在浏览器中使用时, 需要设置类文件的根目录.oojs框架将从指定的根目录, 使用异步的方式加载类. 比如上面的例子加载 utility.template 类的地址是:
```js
    http://localhost/src/utility/template.js
```
如果main有多个依赖类, 会同时并行异步加载, 并且在所有的类都加载完毕后在运行$main静态构造函数. 

通过上面实例的详细讲解, 已经可以使用oojs编写简单可维护的js代码了.
下面的篇幅会介绍一些oojs细节和高级用法.

---
		
## 类的加载路径

使用oojs的项目代码是用类组织的.在入门示例中, template.js 加载时, 默认使用如下路径:

***node:***
[node运行的目录]/src/utility/template.js

***浏览器:***
[页面当前域名]/src/utility/template.js

即无论是node还是浏览器, 在项目的根目录里创建src文件夹, src内根据命名空间来组织文件夹.

oojs提供了setPath函数, 可以为特定的类或者命名空间指定自己特殊的加载路径.

```js
//设置全局根目录
oojs.setPath('./src2/');
oojs.setPath('http://localhost/asset/js/');

//为 A 和 A.B 命名空间设置特殊的加载路径
oojs.setPath({
    'A':'./src1/A/',
    'A.B':'./src2/A/B/'
});
```
oojs的路径查找使用的是树状结构. 以"A.B.C"这个类的查找规则为例:

* 首先从root根目录查找. 此时path为默认的src目录.
* 查找命名空间A, 发现通过setPath设置了A的路径, 此时path为上面设置的 './src1/A'
* 查找命名空间A.B, 发现通过setPath设置了A.B的路径, 此时path为上面设置的 './src2/A/B/'
* 查找命名空间A.B.C, 未发现A.B.C的路径, 于是使用上一步的path作为结果返回

通过上面的查找行为可以看出, 优先使用更加精确的类的加载路径, 否则使用父路径.

---
     
# oojs的git源码结构

## bin目录
bin目录中, 用于存放编译后的文件. bin目录下有以下两个js文件:

* oojs.core.js: 压缩后的文件. 仅包括核心的面向对象编程功能.
* oojs.js: 压缩后的文件. 除了核心功能, 还包括loader类用于加载依赖类.以及event类用于处理事件编程. 通常都加载此文件.

在bin的根目录下, 放置的是代码压缩后的js文件. 通常在项目中引用的就是代码压缩后的js文件. 同时为了应对一些比如调试等场景, bin目录下还包括如下文件夹: 

* format文件夹: 格式化,但是无注释的编译结果
* gzip文件夹: gzip后的编译结果
* source文件夹: 包含注释的编译结果

上面每一个文件夹中, 也都包含 oojs.core.js和oojs.js两个文件(gzip目录下是.gz后缀), 可以根据需要使用.

## src目录
src目录存放oojs的源码文件. oojs框架自身也是按照oojs的编程方式实现的, 即oojs是自解析的. 

* oojs文件夹 : oojs命名空间
    * event.js : oojs.event类实现了事件编程和promise编程模式. 这是异步编程时必不可少的类.
    * loader.js : oojs.loader类提供了浏览器环境加载依赖类的加载器. 
* oojs.js : oojs的核心编程框架. oojs.core.js就是直接从这个文件编译出来的.
    
## 项目根目录
bin和src两个目录是最主要的文件夹. 除了这两个文件夹, oojs的项目根目录还包括如下文件:

* .gitignore: git配置文件, 里面写明了git不需要管理的文件. 比如 node_modules 文件夹.

* README.md: 说明文档. 即您正在阅读的这个页面的内容.

* make.js: 编译文件. 使用 node make.js 命令, 可以从src目录生成bin目录下面的所有文件.

* package.json: 包描述文件.

---
    
# 事件函数与this指针
假设我们声明了一个类:
```js
    oojs.define({
        name:'myClass',
        word: 'Hello World',
        say: function(){
            alert(this.word);
        }
    })
```
myClss类有一个say函数, 输出myClass类的word属性. say函数中通过this引用myClass类自身. 这在通常情况下都是正确的.

但是在事件中, 比如常见的按钮单击事件, 或者一个定时器函数, this指针并不是总指向myClass自身的:
```js
    window.word = 'I am window';
    var myClass = oojs.using('myClass');
    setTimeout(myClass.say, 1000);
```
上面的代码会输出"I am window"而不是myClass类中的"Hello World". 因为在setTimeout中的this指向了window对象而不是myClass.

oojs提供了proxy函数用于解决this指针问题. 默认情况下为了使用方便, 会为function的原型添加proxy函数. 如果不希望对原型造成污染也可以通过配置取消此功能. 

proxy函数用来修改事件的this指针. 比如上面的代码可以这样修改:
```js
    var myClass = oojs.using('myClass');
    setTimeout(myClass.say.proxy(myClass), 1000);
```
使用了proxy之后, 可以正常的输出"Hello World".

proxy函数的第一个参数表示this指针需要指向的对象. 

proxy函数还可以 ***修改事件处理函数的签名*** , 下面举一个复杂的例子.

在nodejs中, 系统提供了socket对象, 用于网络编程. 
```js
var net = require('net');
var client = net.connect({port: 8124},
    function() { //'connect' listener
          console.log('client connected');
          client.write('world!\r\n');
});
```
调用 net.connect函数时, 需要传递一个回调函数, 并且回调函数是无参数的.
通常, 使用上面的例子, 我们传递了一个匿名的回调函数, 并且在这个回调函数中使用 client变量, 此时会生成一个闭包, 以便在回调函数执行时, 可以正确访问到client变量.

使用proxy函数, 可以用一种 ***显式闭包*** 的方式, 将client作为参数传递, 让其看起来是通过参数传递的而不是使用闭包:

```js
var net = require('net');
var client = net.connect({port: 8124},
    function(mySocket) { //'connect' listener
          console.log('client connected');
          mySocket.write('world!\r\n');
}.proxy(this, client));
```
注意, 这里通过proxy除了传递this对象外, 还传递了client变量.
connect原本的回调函数是没有签名的, 但是你会发现在回调函数执行时, mySocket可以被正常访问. 此时我们将原本无参数的事件处理函数, 变成了一个有参数的事件处理函数. 

proxy函数看似神奇,其实内部还是使用闭包实现. 所以我在这里称其为 ***显式闭包*** .
使用显示闭包极大的增加了代码的可读性和可维护性. 可以说显示闭包让邪恶的闭包从良了.

另外, 显示闭包还可以解决循环中使用闭包的常见错误, 看下面的例子:
(参见:https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

```html
<p id="help">Helpful notes will appear here</p>
<p>E-mail: <input type="text" id="email" name="email"></p>
<p>Name: <input type="text" id="name" name="name"></p>
<p>Age: <input type="text" id="age" name="age"></p>
```

```js
function showHelp(help) {
  document.getElementById('help').innerHTML = help;
}

function setupHelp() {
  var helpText = [
      {'id': 'email', 'help': 'Your e-mail address'},
      {'id': 'name', 'help': 'Your full name'},
      {'id': 'age', 'help': 'Your age (you must be over 16)'}
    ];

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i];
    document.getElementById(item.id).onfocus = function() {
      showHelp(item.help);
    }
  }
}

setupHelp();
```
数组 helpText 中定义了三个有用的提示信息，每一个都关联于对应的文档中的输入域的 ID。通过循环这三项定义，依次为每一个输入域添加了一个 onfocus 事件处理函数，以便显示帮助信息。

运行这段代码后，您会发现它没有达到想要的效果。无论焦点在哪个输入域上，显示的都是关于年龄的消息。

该问题的原因在于赋给 onfocus 是闭包（showHelp）中的匿名函数而不是闭包对象；在闭包（showHelp）中一共创建了三个匿名函数，但是它们都共享同一个环境（item）。在 onfocus 的回调被执行时，循环早已经完成，且此时 item 变量（由所有三个闭包所共享）已经指向了 helpText 列表中的最后一项。

使用proxy函数就不会出现上面的问题:
```js
    document.getElementById(item.id).onfocus = function(ev, item) {
      showHelp(item.help);
    }.proxy(this, item);
```
特别要注意, proxy函数只能在原有的事件处理函数后面新增参数. onfocus事件原本是包括一个事件对象参数的. 即上面的ev. 所以需要将item作为第二个函数参数使用.

相对于传统的node变成, 下面来看看使用oojs实现的完整的socket服务器的例子:
```js
require('node-oojs');


oojs.define({
    name: 'socketServer',    
    /**
     * 静态构造函数
     */
    $socketServer: function () {
        var net = require('net');
		
        //启动服务
        this.server = net.createServer();
        this.server.on('connection', this.onConnection.proxy(this));
        this.server.on('error', this.onError.proxy(this));
        this.server.listen(8088, function () {
            base.log.info('server bound');
        });
    },

    /**
     * 服务器连接事件处理函数. 
     * @param {Object} socket 本次连接的socket对象
     */
    onConnection: function (socket) {
        socket.on('data', this.onData.proxy(this, socket));
        socket.on('end', this.onEnd.proxy(this, socket));
        socket.on('error', this.onError.proxy(this, socket));
    },

     /**
     * socket接收数据事件处理函数. 
     * @param {Object} data 本次介绍到的数据对象buffer
     * @param {Object} socket 本次连接的socket对象
     */
    onData: function (data, socket) {
        //do something...
    },

    /**
     * socket 关闭事件处理函数. 
     * @param {Object} socket 本次连接的socket对象
     */
    onEnd: function (socket) {
        //do something...
    },

    /**
     * socket 异常事件处理函数. 
     * @param {Object} err 异常对象
     * @param {Object} socket 本次连接的socket对象
     */
    onError: function (err, socket) {
        //do something...
    }
});
```

---

#oojs的原型继承和快速克隆
oojs中使用特有的快速克隆方法实现高效的对象创建. 主要用在内部的oojs.create函数中, 此函数用于创建一个类实例.

假设a是classA的一个实例. 此时的原型链情况如下:

    a.contructor.prototype->classA

当访问a的一个属性时, 有以下几种情况:

1. 属性是值类型:
    访问: 通过原型链获取到classA的属性
    赋值: 在a对象上设置新的属性值, 再次访问时获取到的是a对象上的新值
2. 属性是引用类型(比如object类型):
    访问: 通过原型链获取到classA的属性
    赋值: 因为是引用类型, 所以实际上是对classA上的引用对象赋值. 即classA被修改, 所有实例的此属性都被修改

为了解决此问题, oojs在创建classA的实例时, 会遍历classA的属性, 如果发现属性的类型是引用类型, 则对其进行快速克隆:
```js
        /**
         * 快速克隆方法
         * @public
         * @method fastClone
         * @param {Object} source 带克隆的对象. 使用此方法克隆出来的对象, 如果source对象被修改, 则所有克隆对象也会被修改
         * @return {Object} 克隆出来的对象.
         */
        fastClone: function (source) {
            var temp = function () {};
            temp.prototype = source;
            var result = new temp();
        }
```
传统的克隆对象是十分消耗性能的, oojs的最初也是用了传统的克隆方法. 最后改进成使用快速克隆方法. 

假设这个属性为A, 此时相当于将属性A作为类, 创建了一个属性A的实例, 即关系是:

    a.A.constructor.prototype -> classA.A 

此时, 如果A的所有属性都不是引用类型, 则可以解决上面的赋值问题.
但是如果属性A本身, 又含有引用类型, 则同样会出现赋值是修改原形的问题. 
假设: A.B为object
则通过 a.A.B 获取到的对象与 classA.A.B 获取到的对象是同一个对象. 对于a.A.B的修改同样会影响到classA.A.B
通过递归的快速克隆可以解决此问题, 但是因为性能开销太大, 所以oojs最后不支持多层的对象嵌套. 

实际上, 我们可以通过编程方式来解决这个问题.
* 在类声明时赋值的属性, 即JSON中直接描述的属性值, 应该是静态static类型. 不应在运行时修改.
* 如果一个属性是实例属性, 则应该在动态构造函数中赋值.比如:
```js
oojs.define({
    name: 'classA'
    A: null
    classA:function(){
        this.A = { B:1 }
    }
});
```

所以一定要注意, 如果类的属性是对象, 并且是实例属性(运行时会被修改),则必须在动态构造函数中创建.

另改一个问题就是a对象的遍历. 同样因为使用了原型继承, 不能够通过hasOwnProperty来判断一个属性是否是实例a的. 可以通过遍历classA来解决:
```js
for(var key in a){
    if(key && typeof a[key] !== 'undefined' && classA.hasOwnProperty(key)){
        //do something...
    }
}
```

---

#事件编程
js中常常使用事件和异步, 在浏览器端的Ajax是异步, 在nodejs中更是到处都是异步事件.

在异步事件的编程中, 常常会遇到多层嵌套的情况. 比如:

```js
var render = function (template, data, l10n) {
  //do something...
};

$.get("template", function (template) {
  // something
  $.get("data", function (data) {
    // something
    $.get("l10n", function (l10n) {
      // something
      render(template, data, l10n);
    });
  });
});
```
在异步的世界里, 需要在回调函数中获取调用结果, 然后再进行接下来的处理流程, 所以导致了回调函数的多层嵌套, 并且只能串行处理.

oojs提供了oojs.event, 来解决此问题. 比如要实现上面的功能, 可以进行如下改造:
```js
var render = function (template, data, l10n) {
  //do something...
};

var ev = oojs.create(oojs.event);
ev.bind('l10n', function(data){
    ev.emit('l10n', data);
});
ev.bind('data', function(data){
    ev.emit('data', data);
});
ev.bind('template', function(data){
    ev.emit('template', data);
});
//并行执行template, data和l10n事件, 都执行完毕后会触发group中的回调函数
ev.group('myGroup', ['template','data','l10n'], function(data){
    render(data.template, data.data, data.l10n);
});
```
oojs.event的group可以将事件打包成一组. 在group的回调函数中, 会传递一个参数data, 这是一个object对象, 其中key为group中绑定的每一个事件名, value为事件的返回值. 所以可以通过data[事件名]获取到某一个事件的返回值. 

oojs.event中的group还可以动态添加新的事件. 比如:
```js
ev.group('myGroup', ['template','data','l10n'], function(data){
    render(data.template, data.data, data.l10n);
});

ev.group('myGroup', ['another'], function(data){
    anotherData = data.another;
});
```
注意上面的代码, 虽然为myGroup又添加了一个another事件. 但是此时mygroup绑定了两个事件处理函数, 这两个函数都会在所有事件完成时执行, 但是不一定哪个在前. 所以oojs.event还提供了afterGroup事件, 此事件会在所有group绑定的callback执行完毕后再执行:
```js
ev.group('myGroup', ['template','data','l10n']);

ev.group('myGroup', ['another']);

ev.afterGroup('myGroup', function(data){
    render(data.template, data.data, data.l10n, data.another);
});
```

oojs.event使用oo的思想实现. node中本身自带EventEmmiter也实现了部分功能. 

---

# Promise 编程

使用event事件编程, 可以解决回调函数嵌套的问题. 但是是否有更好的解决办法呢? 答案是使用Promise.

通过举例, 来快速的了解什么是Promise. 

传统的回调函数方式编程, 在这个例子中, step1,step2,step3 三个函数都是异步顺序执行的:
```js
var step1,step2,step3 = function(data, callback){
    var result = data + 1;
    callback(result);
}

// step1开始执行
var data1 = 1;
step1(data1, function(data2){
    // step2开始执行
    step2(data2, function(data3){
        // step3开始执行
        step3(data3, function(data4){
            // 输出最终执行结果
            console.log(data4);
        })
    })
})
```
使用event事件编程, 绑定了一个事件序列:
```js
var ev = oojs.create(oojs.event);
ev.bind('step1', function(data1){
    // step1开始执行
    var data2 = data1 + 1;
    ev.emit('step2', data2);
});
ev.bind('step2', function(data2){
    // step2开始执行
    var data3 = data2 + 1;
    ev.emit('step3', data3);
});
ev.bind('step3', function(data3){
    // step3开始执行
    var data4 = data3 + 1;
    // 输出最终执行结果
    console.log(data4);
});

// 从step1开始
ev.emit('step1', 1);
```

使用Promise编程, 使用then函数将事件串联起来:
```js
// 创建了一个完成态的promise对象,下一个then会立刻执行,并且传递参数 1.
var promise = oojs.promise.resolve(1);
promise.then(function(data1){
     // step1开始执行
     var data2 = data1 + 1;
     return data2;
}).then(function(data2){
     // step2开始执行
     var data3 = data2 + 1;
     return data3;
}).then(function(data3){
     // step3开始执行
     var data4 = data3 + 1;
     // 输出最终执行结果
    console.log(data4);
})
```
从上面三个实例可见, event和promise都可以解决回调函数嵌套的问题.

不同的是, event需要创建三个事件, 以step1事件为例,需要在step1的事件处理函数中,显示的调用step2.即事件序列的执行迅
速分散在了每一个事件处理函数中.

而使用promise时, 是由一个promise对象通过调用then函数, 将step1-3串联起来, 整个事件的执行顺序集中在了一起管理.

有关promise的深入学习,推荐以下学习资料: 
《JavaScript Promise迷你书（中文版）》
http://liubin.org/promises-book/#ch2-promise-all

---

# 为什么要用面向对象的思想写js?

oo不仅仅是一种编程方法, 而是组织代码的最小单位. 

看几个使用AMD规范的例子就会明白, AMD中最后一个参数factory虽然美其名曰构造函数, 但是在这个函数中, 你可以做任何事情:创建局部function, function中再嵌套function, 使用闭包, 处理一些业务逻辑. 最后的结果是这个factory不易阅读和维护.
    
究其原因, js编程很容易陷入面向过程编程的方式中. 而AMD等规范只注重"模块"的开发, 却忽视了一个模块内部的代码如何组织和管理.
    
js中让代码不易管理的几个杀手包括: 闭包, 零散的函数对象, 异步机制(node中尤其重要).
    
oojs使用oo的思想, 减少闭包的使用, 让每一个函数对象都挂靠在类对象上, 减少孤零的函数对象的存在. 再配合oojs.event的事件机制, 解决异步编程中的事件嵌套噩梦.
    
可以说oojs为js的大规模开发提供了有效地基础保障.

---

# 加入我们
   oojs还在发展中, 我们尽量不在核心的oojs.js中加入过多的功能, 保持核心精简. 同时通过oojs团队成员的努力, 让oojs适用于更多的场景. 
   
   欢迎有志之士加入到oojs的开发中来! 
 





