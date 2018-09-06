 
## 运行此项目

 1. 克隆项目到本地
 2. 全局安装 gulp：`npm install gulp -g`
 3. 安装 gulp 插件：`npm install` 
 4. 开发环境只要运行gulp less 然后在 web 服务器中打开 [app/index.html]
 5. 正式环境先运行gulp less再运行 gulp，然后在 web 服务器中打开 [build/index.html]。（即以 file:// 协议打开）是无效的。

### 项目结构

```
app：项目源码。开发的时候代码写在这里。
 |--directives：整个网站公用的指令写在这里面
 |--images：存放图片
 |--modules：用于存放各个模块，例如一个网站可以分成主页、用户中心等模块
 |--services：整个网站公用的服务写在这里面
 |--styles：整个网站公用的样式
 |--vendor：存放第三方代码库
 |--views：存放并不属于某个模块的模板，例如整个网站都会用到的页头和页脚
 |--app.js：路由表、config()、run()等代码块写在这里面
 |--bootstrap.js：程序的启动文件，用于配置 requireJS 的配置及启动应用
 |--index.html：应用入口页面

gulpfile.js：根据 app 文件夹里的源码生成适合生产环境使用的代码。会精简文件并重命名为 md5 文件名
package.json：用于声明 gulpfile.js 会用到的各种模块
```

[app/modules]里面的子模块包含各自的模板、指令等代码。如果某个指令、服务等会在其他模块里用到，你应该考虑把它加入到 [app/directives]等文件夹中。

若一个子模块也包含子模块，那么也应该根据此规则进行分割。例如项目有 _用户中心_ 模块，但这个模块还包含 _基本信息_、_收货地址_ 、_好友列表_ 等模块，那么就应该是这样的结构：

```
app/modules/customer：用户中心模块
 |--basic：基本信息模块
 |--address：收货地址模块
 |--friends：好友列表模块
 |--common.js：上面这些模块都用得到的代码，比如 API 接口
```

这样的结构易于将项目拆分，但是在声明路由的时候会比较麻烦：因为公用文件必须得先加载。上面的结构可能就需要这样声明路由：

```js
$stateProvider
  .state( 'nav.customer' , { // 一个父状态用来加载公用文件
    abstract : true ,
    template : '<div ui-view></div>' ,
    resolve : {
      loadModule : asyncLoad( [ 'modules/customer/common' ] ) // 公用文件
    }
  } )
  .state( 'nav.customer.basic' , { // 子状态来加载各自的模板与代码
    url : '/customer/basic' ,
    templateUrl : 'modules/customer/basic/index.html' ,
    controller : 'CustomerBasicController' ,
    resolve : {
      loadModule : asyncLoad( [ 'modules/customer/basic/index' ] ) // 子状态自己的代码
    }
  } )
  // ...
```
