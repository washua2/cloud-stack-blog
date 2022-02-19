//中间件拦截层

//导入白名单
let whiteList = require(__basename + '/whiteList/whiteList.js')
    // 导入服务层
let service = require(__basename + '/service/service.js')
    // 导入工具库
let utils = require(__basename + "/utils/utils.js")

module.exports = app => {

    // 判断请求的方式
    app.use((req, res, next) => {
        if (req.method === "OPTIONS") {
            res.send(true)
        } else {
            next()
        }
    })


    //请求域拦截
    app.use((req, res, next) => {

            //截取请求域
            let origin = req.headers.origin;
            if (whiteList.hostList.indexOf(origin) > -1) {
                //允许通过
                next();
            } else {
                res.send({ msg: '请求域不合法', status: 0 });
            }

        })
        // 验证码请求拦截
        // 拦截邮箱验证码
    app.use((req, res, next) => {

        // 获取 当前路由路径
        let url = req.url.split("?")[0]
            // 判断白名单中是否存在 存在即需要验证
            // 根据codeId查询 验证码
        if (whiteList.codeList.indexOf(url) > -1) {
            service.selectData({
                modelName: "Code",
                attributes: ["codeId", "email", "code", "createdAt"],
                condition: {
                    codeId: req.body.codeId
                }
            }).then(result => {
                let data = result[0].dataValues
                    // 获取当前时间戳
                let codeTime = new Date().getTime()
                    // 获取验证码时间戳
                let createdTime = new Date(data.createdAt).getTime()

                // 判断是否获取到数据
                if (data) {
                    if (req.body.email === data.email && req.body.code === data.code) {
                        if (codeTime - createdTime <= 180000) {
                            next()
                        } else {
                            res.send({ msg: "验证码已过期", status: 402 })
                        }
                    } else {
                        res.send({ msg: "验证码和获取的邮箱不匹配", status: 400 })
                    }
                } else {
                    res.send({ msg: "验证码不存在", status: 403 })
                }
            }).catch(err => {
                res.send({ msg: "验证码不存在", status: 403 })

            })
        } else {
            next()

        }
    })

    // 拦截token
    app.use((req, res, next) => {
        // 获取 当前路由路径
        let url = req.url.split("?")[0]
        if (whiteList.tokenList.indexOf(url) > -1) {
            // 需要验证token
            let tk = [];
            config.tokenName.forEach(v => {
                tk.push(req.body[v]);
            })
            let token = tk.join(".")

            utils.verifyToken(token).then(result => {
                // 将userId传递
                req.userId = result.data
                next()
            }).catch(err => {
                res.send({ msg: "拦截token请先登录", status: 1030 })
            })
        } else {
            // 无需验证token
            next()
        }
    })
}