//配置层

//服务器基础配置
const serverOptions = {
    //服务器地址
    // host: 'http://127.0.0.1',

    //端口
    // port: 9000

    // 阿里云
    host: 'http://120.78.192.153',

    port: 9000

}
exports.serverOptions = serverOptions;

//数据库配置
exports.mysqlOptions = {
    database: 'serverdb',
    username: 'root',
    password: '990820wyh',
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+08:00'
}

// 邮箱配置
exports.emailOptions = {
    host: "smtp.163.com",
    port: 465,
    user: "wangyuanhua_zik@163.com",
    pass: "QCKBRNAXWTMBSRRX",
    secure: true,
    pool: true
}

// 加密配置
exports.saltOptions = {
    //token加密字符串
    tokenSalt: '__wyh__'
}

// 有效期
exports.expiresIn = {
        // token有效期
        tokenExpiresIn: '1d'
    }
    // token关联键名
exports.tokenName = [
    "dweweqsdwe",
    "sdqwew",
    "scnjisddsdads"
]

// 访问静态文件的地址
exports.staticUrls = {
    userImg: `${serverOptions.host}:${serverOptions.port}`
}