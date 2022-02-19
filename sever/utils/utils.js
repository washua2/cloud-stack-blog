// 工具方法

// 导入加密模块
const crypto = require("crypto")

// 导入token模块
const jsonwebtoken = require("jsonwebtoken")

// 导入fs模块
const fs = require("fs")

// 导入uuid
let uuid = require("uuid")

// 导入 发送邮件模块
const nodemailer = require("nodemailer");



// 创建发邮件实例
let transporter = nodemailer.createTransport({
    host: config.emailOptions.host,
    port: config.emailOptions.port,
    pool: config.emailOptions.pool,
    secure: config.emailOptions.secure, // true for 465, false for other ports
    // 授权
    auth: {
        type: 'login',
        user: config.emailOptions.user, // generated ethereal user
        // 授权码   
        pass: config.emailOptions.pass, // generated ethereal password
    }

});


class Utils {
    constructor() {}

    // 加密字符串
    encodeString(value) {
        // 创建md5加密方式
        let md5 = crypto.createHash("md5");

        // 使用md5方式加密字符串

        return md5.update(value).digest("hex")
    }

    //发邮件
    sendMail(options) {
        /**
         * options.from:发件地址
         * to:收件地址，多个收件地址，需要以逗号隔开
         * subject:邮件主题
         * text:邮件文本内容
         * html:邮件html内容
         * text和html选一个
         */
        return new Promise((resolve, reject) => {
            transporter.sendMail(options, (err, info) => {
                // 如果发邮件失败
                if (err) {
                    reject(err)
                } else {
                    resolve(info)
                }
            })
        })

    }

    // 随机生成6位验证码
    createSixCode() {
            let code = [];
            for (let i = 0; i < 6; i++) {
                let random = Math.floor(Math.random() * 10)
                code.push(random)
            }
            return code.join("")
        }
        // 签名token字符串
    signToken(value) {
        /**
         * options.data:签名token字符串
         * options.secret: 加密
         * options.expiresIn:有效期
         */
        return jsonwebtoken.sign({
            data: value
        }, config.saltOptions.tokenSalt, {
            expiresIn: config.expiresIn.tokenExpiresIn
        });


    }

    // 验证token
    verifyToken(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken.verify(token, config.saltOptions.tokenSalt, (err, decoded) => {
                if (err) {
                    // 如果token验证失败
                    reject(err)
                } else {
                    // 如果验证成功
                    resolve(decoded)
                }
            })
        })
    }

    // 上传文件
    uploadFile(options) {
        // 1.将base64 转换成buffer（二进制文件）
        // 2.将buffer写入服务器
        return new Promise((resolve, reject) => {

            // 获取buffer
            let buffer = Buffer.from(options.base64, 'base64')

            // 生成文件名称
            let fileName = uuid.v1() + "." + options.type

            // 文件路径
            let url = __basename + "/upload/" + fileName

            // fs.writeFile(文件路径，文件内容[,编码方式]，回调函数)
            fs.writeFile(url, buffer, err => {
                if (err) {
                    // 如果上传失败
                    reject(err)
                } else {
                    // 如果上传成功
                    let httpUrl = config.staticUrls.userImg + "/" + "userUpload" + "/" + fileName
                    resolve(httpUrl)
                }
            })


        })
    }

}


module.exports = new Utils();