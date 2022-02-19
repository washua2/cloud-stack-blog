//入口层

//保存当前文件的路径
global.__basename = __dirname;

const express = require('express');

const bodyParser = require('body-parser');

//导入配置
global.config = require(__basename + '/config/config.js');

//导入中间层
let middleWare = require(__basename + '/middleWare/middleWare.js');

//导入路由层
let routes = require(__basename + '/routes/routes.js');

//导入连接mysq层
global.sequelize = require(__basename + '/db/connect.js');

//导入所有模型
global.model = require(__basename + '/db/model/model.js');

const app = express();

//解析 application/x-www-form-urlencoded 编码方式
app.use(bodyParser.urlencoded({ extended: false, limit: "5000kb" }))

//解析 application/json
app.use(bodyParser.json({ limit: "5000kb" }));

// 设置静态目录
app.use("/userUpload", express.static(__basename + "/upload"))

//CORS处理
//app.all(*)表示所有请求路径必须经过
app.all('*', (req, res, next) => {

    //允许跨域地址, 动态允许域名请求
    res.header("Access-Control-Allow-Origin", req.headers.origin);

    // res.header("Access-Control-Allow-Origin", "http://www.kangliuyong.com:10000");

    //*表示允许所有域请求，在实际开发中，一般指定允许某个域请求，如上面设置
    // res.header("Access-Control-Allow-Origin", "*");

    //如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");

    //该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

    //该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可
    //res.header('Access-Control-Allow-Credentials', true);

    //是否允许继续访问下一个路由或者中间件
    next();

});

//加载中间件拦截层
middleWare(app);

//加载路由
routes(app);

app.listen(config.serverOptions.port, () => {
    console.log(`the server running at${config.serverOptions.host}:${config.serverOptions.port}`);
})