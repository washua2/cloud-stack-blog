//控制器层, 处理业务逻辑


// 导入服务层
let service = require(__basename + "/service/service.js")

// 导入工具库
let utils = require(__basename + "/utils/utils.js")

//导入操作符
const { Op } = require('sequelize');

//导入uuid生成唯一标识
let uuid = require('uuid');

class Controller {

    constructor() {}

    //注册
    register(req, res) {

        //截取参数
        let params = req.body;
        // 查询当前邮箱是否被注册
        service.selectData({
            modelName: "User",
            attributes: ["userId", "nickName"],
            condition: {
                email: params.email
            }
        }).then(result => {
            let data = result[0]
            if (data) {
                res.send({ msg: '邮箱已被注册', status: 1002 });
            } else {
                // 进行md5单向加密
                let password = utils.encodeString(req.body.password)
                    // 获取时间戳作为id
                let userId = "uid_" + new Date().getTime()
                let filesPromise = []

                filesPromise.push(
                    utils.uploadFile({
                        base64: req.body.photo,
                        type: req.body.photoType
                    })
                )
                Promise.all(filesPromise).then(async result => {
                    //2、将数据写入数据库 
                    await service.createData({
                        modelName: 'User',
                        data: {
                            userId,
                            email: req.body.email,
                            nickname: req.body.nickName,
                            userImg: result[0],
                            password
                        },
                    }).then(results => {
                        res.send({ msg: '注册成功', status: 1000 });
                    }).catch(err => {
                        res.send({ msg: '注册失败', status: 1003 });
                    })


                    // 调用mysql服务层调用user方法  将数据 存储到数据库
                }).catch(err => {
                    res.send({ msg: '注册失败', status: 1004 });

                })

            }
        }).catch(err => {
            res.send({ msg: '注册失败', status: 1005 });
        })


        return


    }

    // 发送验证码
    sendCode(req, res) {
        // 获取随机6位验证码
        let code = utils.createSixCode()
            // 通过时间戳获取codeId
        let codeId = "cid_" + new Date().getTime()
            // 先存储验证码 后发邮件
        service.createData({
            modelName: "Code",
            data: {
                codeId,
                code,
                email: req.body.email
            }
        }).then(result => {
            let { codeId } = result
            // 开发时 先关闭
            utils.sendMail({
                from: config.emailOptions.user,
                to: req.body.email,
                subject: "邮箱验证码",
                text: `验证码${code} 三分钟内有效`
            }).then(result => {
                res.send({ msg: "发送验证码成功", status: 666, codeId })
            }).catch(err => {
                res.send({ msg: "发送验证码失败", status: 999 })
            })

        }).catch(err => {
            res.send({ msg: "发送验证码失败", status: 999 })
        })





    }

    // 登录
    login(req, res) {
            service.selectData({
                modelName: "User",
                attributes: ["email", "password", "userId"],
                condition: {
                    email: req.body.email
                }
            }).then(result => {
                // 加密密码
                let password = utils.encodeString(req.body.password)
                    // 判断输入密码 与数据库密码 是否一致
                if (result[0].dataValues.password === password) {
                    let token = utils.signToken(result[0].dataValues.userId)
                    let tk = token.split(".")
                    let tks = {
                        wyhwyhwyhwyh: "sds332h8dids9eh9hu9sdjksdskadn",
                        sdijhcnsjd: "913j9u9e1bibisaojdoajsndn"
                    }
                    config.tokenName.forEach((v, i) => {
                        tks[v] = tk[i]
                    });
                    res.send({ msg: "登录成功", code: 200, token: tks })
                } else {
                    res.send({ msg: "账号或密码不正确", code: 202 })
                }
            }).catch(err => {
                res.send({ msg: "登陆失败,请先注册", code: 201 })
            })
        }
        // 修改密码
    modify(req, res) {
            let replacements = {
                email: req.body.email,
                code: req.body.code
            }
            let sql = "SELECT*FROM `code` WHERE `email` = :email AND `code` = :code"

            service.query(sql, {
                replacements,
                type: "SELECT"
            }).then(result => {
                let oldPassowrd = utils.encodeString(req.body.oldPassowrd)
                service.selectData({
                    modelName: "User",
                    condition: {
                        password: oldPassowrd
                    }
                }).then(v1 => {
                    let password = utils.encodeString(req.body.password)
                    service.updateData({
                        modelName: "User",
                        value: {
                            password
                        },
                        condition: {
                            userId: req.body.userId
                        }
                    }).then(v2 => {
                        res.send({ msg: "修改密码成功", status: 808 })
                    })
                }).catch(err => {
                    res.send({ msg: "原密码不正确", status: 313 })
                })



            }).catch(err => {
                res.send({ msg: "邮箱或验证码不正确", status: 303 })
            })
        }
        // 注销账号
    cancellation(req, res) {
            // 加密密码
            let password = utils.encodeString(req.body.password)
            let replacements = {
                email: req.body.email,
                password
            }
            let sql = "SELECT*FROM `user` WHERE `email` = :email AND `password` = :password"
            service.query(sql, {
                replacements,
                type: "SELECT"
            }).then(result => {
                service.destroyData({
                    modelName: "User",
                    condition: {
                        userId: req.body.userId
                    }
                }).then(v => {

                    if (v >= 1) {
                        res.send({ msg: "注销成功", status: 909 })
                    }
                })
            }).catch(err => {
                res.send({ msg: "注销失败,邮箱或密码错误", status: 707 })
            })
        }
        // 修改个人信息
    modifyPersonal(req, res) {
            service.selectData({
                modelName: "User",
                condition: {
                    userId: req.body.person.userId
                }
            }).then(result => {
                let filesPromise = []
                if (req.body.photo !== '') {
                    filesPromise.push(
                        utils.uploadFile({
                            base64: req.body.photo,
                            type: req.body.photoType
                        })
                    )
                }

                Promise.all(filesPromise).then(result => {
                    service.updateData({
                        modelName: "User",
                        value: {
                            email: req.body.email,
                            nickname: req.body.nickName,
                            userImg: result[0] || req.body.person.userImg
                        },
                        condition: {
                            userId: req.body.person.userId
                        }
                    }).then(v => {
                        if (v[0] === 1) {
                            res.send({ msg: "修改个人信息成功", status: 9996 })
                        }
                    }).catch(err => {
                        res.send({ msg: "修改个人信息失败", status: 6999 })
                    })
                })


            }).catch(err => {
                res.send({ msg: "修改失败,不存在此数据", status: 6999 })
            })
        }
        // 忘记密码
    forget(req, res) {
        let replacements = {
            email: req.body.email,
            code: req.body.code
        }
        let sql = "SELECT*FROM `code` WHERE `email` = :email AND `code` = :code"
        service.query(sql, {
            replacements,
            type: "SELECT"
        }).then(result => {
            let password = utils.encodeString(req.body.password)
            service.updateData({
                modelName: "User",
                value: {
                    password
                },
                condition: {
                    email: req.body.email
                }
            }).then(v2 => {
                if (v2 == 1) {
                    res.send({ msg: "找回密码成功", status: 808 })
                }

            }).catch(err => {
                res.send({ msg: "找回密码失败", status: 303 })
            })
        }).catch(err => {
            res.send({ msg: "验证码或邮箱不正确", status: 303 })
        })
    }

    // 添加 留言板数据
    addMessage(req, res) {
            let filesPromise = []

            filesPromise.push(
                utils.uploadFile({
                    base64: req.body.photo,
                    type: req.body.photoType
                })
            )
            Promise.all(filesPromise).then(result => {

                // 通过时间戳获取codeId
                let messageId = "cid_" + new Date().getTime()
                service.createData({
                    modelName: "Message",
                    data: {
                        messageId,
                        messagename: req.body.person.nickName,
                        email: req.body.person.email,
                        userImg: req.body.person.userImg,
                        messageImg: result[0],
                        status: req.body.status,
                        desc: req.body.desc
                    }
                }).then(success => {
                    res.send({ msg: "添加成功", status: 1511 })
                }).catch(err => {
                    res.send({ msg: "添加失败", status: 1512 })
                })

            }).catch(err => {
                res.send({ msg: "添加失败", status: 1513 })
            })
        }
        // 查询个人信息
    getPerson(req, res) {
            // 查询数据库
            service.selectData({
                modelName: "User",
                attributes: ["userImg", "nickName", "email", "userId"],
                condition: {
                    email: req.body.email
                }
            }).then(result => {
                res.send({ msg: "查询个人信息成功", status: 1501, data: result })
            }).catch(err => {
                res.send({ msg: "查询个人信息失败", status: 1502 })
            })

        }
        // 获取 添加的留言信息
    getData(req, res) {
            /**
             * SELECT*FROM `message`
                WHERE `status` = 0
                AND `nickname` LIKE '%was%'
                ORDER BY `updated_at` DESC
                LIMIT 0,2
             * */
            // 查询数据库
            let sql = "SELECT*FROM `message`"
            let replacements = {
                offset: Number(req.query.offset),
                limit: Number(req.query.limit)
            };

            if (Number(req.query.status) !== -1) {

                sql += " WHERE `status_type` = :status";
                replacements.status = req.query.status;

            }
            if (Number(req.query.status) !== -1) {
                if (req.query.nickName) {

                    sql += " AND `messagename` LIKE :nickname";
                    replacements.nickname = `%${req.query.nickName}%`;
                }
            } else {
                if (req.query.nickName) {

                    sql += " WHERE `messagename` LIKE :nickname";
                    replacements.nickname = `%${req.query.nickName}%`;
                }
            }

            sql += " ORDER BY `updated_at` DESC LIMIT :offset, :limit";
            service.query(sql, {
                replacements,
                type: 'SELECT'
            }).then(result => {
                res.send({ msg: "查询留言信息成功", status: 1505, result })
            }).catch(err => {
                res.send({ msg: "查询留言信息失败", status: 1506 })
            })
        }
        //获取留言板的条目数
    getDataTotal(req, res) {
        /**
         * SELECT COUNT(`message_id`) AS `count` FROM `message`
            WHERE `status` = 0
            AND `nickname` LIKE '%was%'
            ORDER BY `updated_at` DESC
         * */
        // 查询数据库
        let sql = "SELECT COUNT(`message_id`) AS `count` FROM `message`"
        let replacements = {};

        if (Number(req.query.status) !== -1) {
            sql += " WHERE `status_type` = :status";
            replacements.status = req.query.status;

        }
        if (Number(req.query.status != -1)) {
            if (req.query.nickName) {
                sql += " AND `messagename` LIKE :nickname"
                replacements.nickname = `%${req.query.nickName}%`
            }
        } else {
            if (req.query.nickName) {
                sql += " WHERE `messagename` LIKE :nickname"
                replacements.nickname = `%${req.query.nickName}%`
            }
        }
        sql += " ORDER BY `updated_at` DESC ";
        service.query(sql, {
            replacements,
            type: 'SELECT'
        }).then(result => {
            res.send({ msg: "查询留言板条目数成功", status: 1606, result })
        }).catch(err => {
            res.send({ msg: "查询留言板条目数失败", status: 1607 })
        })
    }

    // 切换留言状态
    toggleStatus(req, res) {
        service.selectData({
            modelName: "Message",
            attributes: ["message_id"],
            condition: {
                message_id: req.body.messageId
            }
        }).then(result => {
            // 修改数据库
            service.updateData({
                modelName: "Message",
                value: {
                    status_type: Number(req.body.status)
                },
                condition: {
                    message_id: req.body.messageId
                }
            }).then(result => {
                if (result[0] === 1) {
                    res.send({ msg: "修改状态成功", status: 1701, result })
                } else {
                    res.send({ msg: "修改状态失败", status: 1702 })
                }

            }).catch(err => {
                res.send({ msg: "修改状态失败", status: 1703 })
            })
        }).catch(err => {
            res.send({ msg: "不存在此数据", status: 1704 })
        })

    }

    // 删除留言信息
    removeData(req, res) {
        // 查询数据库
        service.selectData({
            modelName: "Message",
            attributes: ["message_id"],
            condition: {
                message_id: {
                    [Op.in]: req.body.pids
                }
            }
        }).then(result => {
            if (req.body.pids.length === result.length) {

                //启动事务处理
                service.transaction(async t => {
                    //删除数据
                    await service.destroyData({
                        modelName: 'Message',
                        condition: {
                            Message_id: {
                                [Op.in]: req.body.pids
                            }
                        },
                        transaction: t
                    })

                    //删除类型关系数据
                    await service.destroyData({
                        modelName: 'Reply',
                        condition: {
                            pid: {
                                [Op.in]: req.body.pids
                            },
                        },
                        transaction: t
                    })


                }).then((result) => {
                    res.send({ msg: "删除留言成功", status: 1801 })
                }).catch(err => {
                    res.send({ msg: "删除留言失败", status: 1802 })

                })
            } else {
                res.send({ msg: "不存在此数据", status: 1804 })
            }

        }).catch(err => {
            res.send({ msg: "不存在此数据", status: 1804 })
        })

    }

    //添加回复
    addReply(req, res) {
            let filesPromise = []

            filesPromise.push(
                utils.uploadFile({
                    base64: req.body.photo,
                    type: req.body.photoType
                })
            )
            Promise.all(filesPromise).then(result => {

                // 通过时间戳获取codeId
                let replyId = "cid_" + new Date().getTime()
                service.createData({
                    modelName: "Reply",
                    data: {
                        replyId,
                        nickname: req.body.person.nickName,
                        email: req.body.person.email,
                        userImg: req.body.person.userImg,
                        replyImg: result[0],
                        status: req.body.status,
                        desc: req.body.desc,
                        pid: req.body.pid
                    }
                }).then(success => {
                    res.send({ msg: "添加成功", status: 1521 })
                }).catch(err => {
                    res.send({ msg: "添加失败", status: 1522 })
                })

            }).catch(err => {
                res.send({ msg: "添加失败", status: 1522 })
            })
        }
        // 获取回复列表
    getReplyList(req, res) {
            let sql = "SELECT*FROM `reply`  "
                // ORDER BY `updated_at` DESC
            let replacements = {
                offset: Number(req.query.offset),
                limit: Number(req.query.limit)
            }

            if (Number(req.query.status != -1)) {
                sql += "WHERE `status` = :status"
                replacements.status = req.query.status

            }
            if (Number(req.query.status != -1)) {
                if (req.query.nickName) {
                    sql += " AND `nickname` LIKE :nickname"
                    replacements.nickname = `%${req.query.nickName}%`
                }
                if (req.query.pid) {
                    sql += "  AND `pid` = :pid"
                    replacements.pid = req.query.pid
                }
            } else {
                if (req.query.nickName) {
                    sql += " WHERE `nickname` LIKE :nickname"
                    replacements.nickname = `%${req.query.nickName}%`
                }
                if (req.query.pid) {
                    sql += " WHERE `pid` = :pid"
                    replacements.pid = req.query.pid
                }
            }


            sql += " ORDER BY `updated_at` DESC LIMIT :offset, :limit"
            service.query(sql, {
                replacements,
                type: "SELECT"
            }).then(result => {
                res.send({ msg: "获取回复列表成功", status: 1388, result })
            }).catch(err => {
                res.send({ msg: "获取回复列表失败", status: 1399 })
            })
        }
        // 切换回复状态
    toggleReply(req, res) {
            service.selectData({
                modelName: "Reply",
                attributes: ["reply_id"],
                condition: {
                    reply_id: req.body.replyId
                }
            }).then(result => {
                // 修改数据库
                service.updateData({
                    modelName: "Reply",
                    value: {
                        status: Number(req.body.status)
                    },
                    condition: {
                        reply_id: req.body.replyId
                    }
                }).then(result => {
                    if (result[0] === 1) {
                        res.send({ msg: "修改状态成功", status: 2001, result })
                    } else {
                        res.send({ msg: "修改状态失败", status: 2002 })
                    }

                }).catch(err => {
                    res.send({ msg: "修改状态失败", status: 2002 })
                })
            }).catch(err => {
                res.send({ msg: "不存在此数据", status: 2003 })
            })
        }
        // 删除回复信息
    removeReply(req, res) {
            // 查询数据库
            service.selectData({
                modelName: "Reply",
                attributes: ["reply_id"],
                condition: {
                    reply_id: {
                        [Op.in]: req.body.pids
                    }
                }
            }).then(result => {
                if (req.body.pids.length === result.length) {
                    // 删除数据库
                    service.destroyData({
                        modelName: "Reply",
                        condition: {
                            reply_id: {
                                [Op.in]: req.body.pids
                            }
                        }
                    }).then(v => {
                        if (v >= 1) {
                            res.send({ msg: "删除回复成功", status: 2101 })
                        } else {
                            res.send({ msg: "删除回复失败", status: 2102 })
                        }

                    }).catch(err => {
                        res.send({ msg: "删除回复失败", status: 2103 })
                    })
                } else {
                    res.send({ msg: "不存在此数据", status: 2104 })
                }

            }).catch(err => {
                res.send({ msg: "不存在此数据", status: 2104 })
            })
        }
        // 获取回复总条目数
    getReplyTotal(req, res) {
        // 查询数据库
        let sql = "SELECT COUNT(`reply_id`) AS `count` FROM `reply`"
        let replacements = {};

        if (Number(req.query.status) !== -1) {
            sql += " WHERE `status` = :status";
            replacements.status = req.query.status;

        }
        if (Number(req.query.status != -1)) {
            if (req.query.nickName) {
                sql += " AND `nickname` LIKE :nickname"
                replacements.nickname = `%${req.query.nickName}%`
            }
            if (req.query.pid) {
                sql += "  AND `pid` = :pid"
                replacements.pid = req.query.pid
            }
        } else {
            if (req.query.nickName) {
                sql += " WHERE `nickname` LIKE :nickname"
                replacements.nickname = `%${req.query.nickName}%`
            }
            if (req.query.pid) {
                sql += "  WHERE `pid` = :pid"
                replacements.pid = req.query.pid
            }
        }
        sql += " ORDER BY `updated_at` DESC ";
        service.query(sql, {
            replacements,
            type: 'SELECT'
        }).then(result => {
            res.send({ msg: "查询回复条目数成功", status: 2011, result })
        }).catch(err => {
            res.send({ msg: "查询回复条目数失败", status: 2012 })
        })
    }


    // 添加相册图片
    addPhoto(req, res) {
            let filesPromise = []

            filesPromise.push(
                utils.uploadFile({
                    base64: req.body.photo,
                    type: req.body.photoType
                })
            )
            Promise.all(filesPromise).then(result => {
                // 通过时间戳获取photoId
                let photoId = "pho_" + new Date().getTime()
                service.createData({
                    modelName: "Photo",
                    data: {
                        photoId,
                        nickname: req.body.person.nickName,
                        email: req.body.person.email,
                        userImg: req.body.person.userImg,
                        photoImg: result[0],
                        status: req.body.status,
                    }
                }).then(success => {
                    res.send({ msg: "添加成功", status: 3001 })
                }).catch(err => {
                    res.send({ msg: "添加失败", status: 3002 })
                })

            }).catch(err => {
                res.send({ msg: "添加失败", status: 3003 })
            })
        }
        //获取图片列表
    getPhoto(req, res) {
            /** 
             *  SELECT*FROM `photo`
                WHERE `status` = 0
                AND `nickname` LIKE '%wsa%'
                ORDER BY `updated_at` DESC
                LIMIT 0,6
             * */
            let sql = "SELECT*FROM `photo`  "
            let replacements = {
                offset: Number(req.query.offset),
                limit: Number(req.query.limit)
            }

            if (Number(req.query.status != -1)) {
                sql += "WHERE `status` = :status"
                replacements.status = req.query.status


            }

            if (Number(req.query.status != -1)) {
                if (req.query.nickName) {
                    sql += " AND `nickname` LIKE :nickname"
                    replacements.nickname = `%${req.query.nickName}%`
                }
            } else {
                if (req.query.nickName) {
                    sql += " WHERE `nickname` LIKE :nickname"
                    replacements.nickname = `%${req.query.nickName}%`
                }
            }

            sql += " ORDER BY `updated_at` DESC LIMIT :offset, :limit"

            service.query(sql, {
                replacements,
                type: "SELECT"
            }).then(result => {
                res.send({ msg: "获取回复列表成功", status: 3006, result })
            }).catch(err => {
                res.send({ msg: "获取回复列表失败", status: 3007 })
            })
        }
        // 获取图片列表的条目数
    getPhotoTotal(req, res) {
            // 查询数据库
            let sql = "SELECT COUNT(`photo_id`) AS `count` FROM `photo`"
            let replacements = {};

            if (Number(req.query.status) !== -1) {
                sql += " WHERE `status` = :status";
                replacements.status = req.query.status;

            }
            if (Number(req.query.status != -1)) {
                if (req.query.nickName) {
                    sql += " AND `nickname` LIKE :nickname"
                    replacements.nickname = `%${req.query.nickName}%`
                }
            } else {
                if (req.query.nickName) {
                    sql += " WHERE `nickname` LIKE :nickname"
                    replacements.nickname = `%${req.query.nickName}%`
                }
            }
            sql += " ORDER BY `updated_at` DESC ";
            service.query(sql, {
                replacements,
                type: 'SELECT'
            }).then(result => {
                res.send({ msg: "查询图片条目数成功", status: 3011, result })
            }).catch(err => {
                res.send({ msg: "查询图片条目数失败", status: 3012 })
            })
        }
        // 切换图片状态
    togglePhoto(req, res) {
            service.selectData({
                modelName: "Photo",
                attributes: ["photo_id"],
                condition: {
                    photo_id: req.body.photoId
                }
            }).then(result => {
                // 修改数据库
                service.updateData({
                    modelName: "Photo",
                    value: {
                        status: Number(req.body.status)
                    },
                    condition: {
                        photo_id: req.body.photoId
                    }
                }).then(result => {
                    if (result[0] === 1) {
                        res.send({ msg: "修改状态成功", status: 4001, result })
                    } else {
                        res.send({ msg: "修改状态失败", status: 4002 })
                    }

                }).catch(err => {
                    res.send({ msg: "修改状态失败", status: 4002 })
                })
            }).catch(err => {
                res.send({ msg: "不存在此数据", status: 4003 })
            })
        }
        // 删除图片
    removePhoto(req, res) {
            // 查询数据库
            service.selectData({
                modelName: "Photo",
                attributes: ["photo_id"],
                condition: {
                    photo_id: {
                        [Op.in]: req.body.pids
                    }
                }
            }).then(result => {
                if (req.body.pids.length === result.length) {
                    // 删除数据库
                    service.destroyData({
                        modelName: "Photo",
                        condition: {
                            photo_id: {
                                [Op.in]: req.body.pids
                            }
                        }
                    }).then(v => {
                        if (v >= 1) {
                            res.send({ msg: "删除图片成功", status: 4101 })
                        } else {
                            res.send({ msg: "删除图片失败", status: 4102 })
                        }

                    }).catch(err => {
                        res.send({ msg: "删除图片失败", status: 4103 })
                    })
                } else {
                    res.send({ msg: "不存在此数据", status: 4104 })
                }

            }).catch(err => {
                res.send({ msg: "不存在此数据", status: 4104 })
            })
        }
        //获取用户数据
    getUserList(req, res) {
            let sql = "SELECT*FROM `user`  "
                // ORDER BY `updated_at` DESC
            let replacements = {
                offset: Number(req.query.offset),
                limit: Number(req.query.limit)
            }

            if (Number(req.query.status != -1)) {
                sql += "WHERE `status` = :status"
                replacements.status = req.query.status

            }
            if (Number(req.query.status != -1)) {
                if (req.query.email) {
                    sql += " AND `email` = :email"
                    replacements.email = `${req.query.email}`
                }
            } else {
                if (req.query.email) {
                    sql += " WHERE `email` = :email"
                    replacements.email = `${req.query.email}`
                }
            }
            sql += " ORDER BY `updated_at` DESC LIMIT :offset, :limit"

            service.query(sql, {
                replacements,
                type: "SELECT"
            }).then(result => {
                res.send({ msg: "获取用户列表成功", status: 1411, result })
            }).catch(err => {
                res.send({ msg: "获取用户列表失败", status: 1422 })
            })
        }
        //获取用户条目数
    getUserTotal(req, res) {
            // 查询数据库
            let sql = "SELECT COUNT(`user_id`) AS `count` FROM `user`"
            let replacements = {};

            if (Number(req.query.status) !== -1) {
                sql += " WHERE `status` = :status";
                replacements.status = req.query.status;

            }
            if (Number(req.query.status != -1)) {
                if (req.query.nickName) {
                    sql += " AND `nickname` LIKE :nickname"
                    replacements.nickname = `%${req.query.nickName}%`
                }
            } else {
                if (req.query.nickName) {
                    sql += " WHERE `nickname` LIKE :nickname"
                    replacements.nickname = `%${req.query.nickName}%`
                }
            }
            sql += " ORDER BY `updated_at` DESC ";
            service.query(sql, {
                replacements,
                type: 'SELECT'
            }).then(result => {
                res.send({ msg: "查询用户条目数成功", status: 1431, result })
            }).catch(err => {
                res.send({ msg: "查询用户条目数失败", status: 1432 })
            })
        }
        // 切换用户状态
    toggleUser(req, res) {
            service.selectData({
                modelName: "User",
                attributes: ["user_id"],
                condition: {
                    user_id: req.body.userId
                }
            }).then(result => {
                // 修改数据库
                service.updateData({
                    modelName: "User",
                    value: {
                        status: Number(req.body.status)
                    },
                    condition: {
                        user_id: req.body.userId
                    }
                }).then(result => {
                    if (result[0] === 1) {
                        res.send({ msg: "修改状态成功", status: 4031, result })
                    } else {
                        res.send({ msg: "修改状态失败", status: 4032 })
                    }

                }).catch(err => {
                    res.send({ msg: "修改状态失败", status: 4032 })
                })
            }).catch(err => {
                res.send({ msg: "不存在此数据", status: 4033 })
            })
        }
        // 添加文章分类
    addArticleType(req, res) {
            // 查询当前邮箱是否被注册
            service.selectData({
                modelName: "ArticleType",
                attributes: ["articleTypeId", "articleName", "statusType"],
                condition: {
                    articlename: req.body.articleName
                }
            }).then(result => {
                if (result[0]) {
                    res.send({ msg: "该类型已存在", status: 5023 })
                    return
                }
                // 通过时间戳获取codeId
                let articleTypeId = "cid_" + new Date().getTime()
                service.createData({
                    modelName: "ArticleType",
                    data: {
                        articleTypeId,
                        articlename: req.body.articleName,
                        statusType: req.body.status,
                    }
                }).then(success => {
                    res.send({ msg: "添加成功", status: 5021 })
                }).catch(err => {
                    res.send({ msg: "添加失败", status: 5022 })
                })
            })
        }
        // 获取文章分类数据
    getArticleType(req, res) {
            let sql = "SELECT*FROM `articleType`  "
            let replacements = {
                offset: Number(req.query.offset),
                limit: Number(req.query.limit)
            }

            if (Number(req.query.status != -1)) {
                sql += "WHERE `status_type` = :status"
                replacements.status = req.query.status

            }
            if (Number(req.query.status != -1)) {
                if (req.query.articleName) {
                    sql += " AND `articlename` LIKE :articlename"
                    replacements.articlename = `%${req.query.articleName}%`
                }
            } else {
                if (req.query.articleName) {
                    sql += " WHERE `articlename` LIKE :articlename"
                    replacements.articlename = `%${req.query.articleName}%`
                }
            }
            sql += " ORDER BY `updated_at` DESC LIMIT :offset, :limit"

            service.query(sql, {
                replacements,
                type: "SELECT"
            }).then(result => {
                res.send({ msg: "获取分类列表成功", status: 5001, result })
            }).catch(err => {
                res.send({ msg: "获取分类列表失败", status: 5002 })
            })
        }
        // 获取文章分类条目数
    getArticleTotal(req, res) {
            // 查询数据库
            let sql = "SELECT COUNT(`article_type_id`) AS `count` FROM `articleType`"
            let replacements = {};

            if (Number(req.query.status) !== -1) {
                sql += " WHERE `status_type` = :status";
                replacements.status = req.query.status;

            }
            if (Number(req.query.status != -1)) {
                if (req.query.articleName) {
                    sql += " AND `articlename` LIKE :articlename"
                    replacements.articlename = `%${req.query.articleName}%`
                }
            } else {
                if (req.query.articleName) {
                    sql += " WHERE `articlename` LIKE :articlename"
                    replacements.articlename = `%${req.query.articleName}%`
                }
            }
            sql += " ORDER BY `updated_at` DESC ";
            service.query(sql, {
                replacements,
                type: 'SELECT'
            }).then(result => {
                res.send({ msg: "查询用户条目数成功", status: 5101, result })
            }).catch(err => {
                res.send({ msg: "查询用户条目数失败", status: 5102 })
            })
        }
        // 切换文章分类状态
    toggleArticleType(req, res) {
            service.selectData({
                modelName: "ArticleType",
                attributes: ["article_type_id"],
                condition: {
                    article_type_id: req.body.articleTypeId
                }
            }).then(result => {
                // 修改数据库
                service.updateData({
                    modelName: "ArticleType",
                    value: {
                        statusType: Number(req.body.status)
                    },
                    condition: {
                        article_type_id: req.body.articleTypeId
                    }
                }).then(result => {
                    if (result[0] === 1) {
                        res.send({ msg: "修改状态成功", status: 4031, result })
                    } else {
                        res.send({ msg: "修改状态失败", status: 4032 })
                    }

                }).catch(err => {
                    res.send({ msg: "修改状态失败", status: 4032 })
                })
            }).catch(err => {
                res.send({ msg: "不存在此数据", status: 4033 })
            })
        }
        // 删除文章分类
    removeArticleType(req, res) {
        // 查询数据库
        service.selectData({
            modelName: "ArticleType",
            attributes: ["article_type_id"],
            condition: {
                article_type_id: {
                    [Op.in]: req.body.pids
                }
            }
        }).then(result => {
            if (req.body.pids.length === result.length) {

                //启动事务处理
                service.transaction(async t => {
                    //删除数据
                    await service.destroyData({
                        modelName: 'ArticleType',
                        condition: {
                            article_type_id: {
                                [Op.in]: req.body.pids
                            }
                        },
                        transaction: t
                    })

                    //删除类型关系数据
                    await service.destroyData({
                        modelName: 'Article',
                        condition: {
                            pid: {
                                [Op.in]: req.body.pids
                            },
                        },
                        transaction: t
                    })


                }).then(() => {

                    res.send({ msg: '删除文章分类成功', status: 1170 });

                }).catch(err => {

                    res.send({ msg: '删除文章分类失败', status: 1171 });
                })


            } else {
                res.send({ msg: '不存在此数据', status: 1172 });
            }

        }).catch(err => {
            res.send({ msg: "不存在此数据", status: 1172 })
        })
    }

    // 获取文章类型列表
    getAllArticleType(req, res) {
        let sql = "SELECT*FROM `articleType` ORDER BY `updated_at` DESC  "
        service.query(sql, {
            type: "SELECT"
        }).then(result => {
            res.send({ msg: "获取所有文章类型数据成功", status: 5066, result })
        }).catch(err => {
            res.send({ msg: "获取所有文章类型数据失败", status: 5077 })
        })

    }

    // 添加首页内容
    addArticle(req, res) {
            // 获取时间戳作为id
            let articleId = "uid_" + new Date().getTime()
            service.createData({
                modelName: "Article",
                data: {
                    articleId,
                    nickname: req.body.person.nickName,
                    email: req.body.person.email,
                    userImg: req.body.person.userImg,
                    status: req.body.status,
                    pid: req.body.pid,
                    text: req.body.text,
                    articlename: req.body.articleName
                }
            }).then(success => {
                res.send({ msg: "添加成功", status: 6001 })
            }).catch(err => {
                res.send({ msg: "添加失败", status: 6002 })
            })
        }
        // 获取首页内容
    getAllArticle(req, res) {
            /**
             * SELECT*FROM `articletype` AS `a`  INNER JOIN `article` AS `b`  
                ON `a`.`article_type_id` = `b`.`pid`
                AND `a`.`status` = "1"  
                AND `b`.`status` = "1" 
                AND `b`.`articlename` LIKE "%大数据%" 
                ORDER BY `a`.`updated_at` DESC 
             * */

            let sql = "SELECT*FROM `articletype` AS `a`  INNER JOIN `article` AS `b`  ON `a`.`article_type_id` = `b`.`pid` "
            let replacements = {
                offset: Number(req.query.offset),
                limit: Number(req.query.limit)
            }
            if (Number(req.query.statusType != -1)) {
                sql += " AND `a`.`status_type` = :status"
                replacements.status = req.query.statusType
            }

            if (Number(req.query.status != -1)) {
                sql += " AND `b`.`status` = :status"
                replacements.status = req.query.status
            }

            if (req.query.nickName) {
                sql += " AND `b`.`text` LIKE :nickname"
                replacements.nickname = `%${req.query.nickName}%`
            }
            sql += " ORDER BY `b`.`updated_at` DESC LIMIT :offset, :limit"
            service.query(sql, {
                replacements,
                type: "SELECT"
            }).then(result => {
                res.send({ msg: "获取首页列表成功", status: 6081, result })
            }).catch(err => {
                res.send({ msg: "获取首页列表失败", status: 6092 })
            })
        }
        // 获取首页条目数
    getAllArticleTotal(req, res) {
            // SELECT COUNT(`article_type_id`) AS `count` FROM `articleType`
            let sql = "SELECT COUNT(`article_id`) AS `count` FROM `article` AS `b`  INNER JOIN `articletype` AS `a`  ON `a`.`article_type_id` = `b`.`pid` "
            let replacements = {
                offset: Number(req.query.offset),
                limit: Number(req.query.limit)
            }
            if (Number(req.query.statusType != -1)) {
                sql += " AND `a`.`status_type` = :status"
                replacements.status = req.query.statusType
            }

            if (Number(req.query.status != -1)) {
                sql += " AND `b`.`status` = :status"
                replacements.status = req.query.status
            }

            if (req.query.nickName) {
                sql += " AND `b`.`text` LIKE :nickname"
                replacements.nickname = `%${req.query.nickName}%`
            }
            service.query(sql, {
                replacements,
                type: "SELECT"
            }).then(result => {
                res.send({ msg: "获取首页列表总数成功", status: 8081, result })
            }).catch(err => {
                res.send({ msg: "获取首页列表总数失败", status: 8092 })
            })
        }
        // 获取列表
    getArticle(req, res) {

            let sql = "SELECT*FROM `article`"
            let replacements = {
                offset: Number(req.query.offset),
                limit: Number(req.query.limit)
            }

            if (Number(req.query.status != -1)) {
                sql += "WHERE `status` = :status"
                replacements.status = req.query.status

            }
            if (Number(req.query.status != -1)) {
                if (req.query.nickName) {
                    sql += " AND `text` LIKE :nickname"
                    replacements.nickname = `%${req.query.nickName}%`
                }
                if (req.query.pid) {
                    sql += "  AND `pid` = :pid"
                    replacements.pid = req.query.pid
                }
            } else {
                if (req.query.nickName) {
                    sql += " WHERE `text` LIKE :nickname"
                    replacements.nickname = `%${req.query.nickName}%`
                    if (req.query.pid) {
                        sql += "  AND `pid` = :pid"
                        replacements.pid = req.query.pid
                    }
                } else {
                    if (req.query.pid) {
                        sql += "  WHERE `pid` = :pid"
                        replacements.pid = req.query.pid
                    }
                }
            }
            sql += " ORDER BY `updated_at` DESC LIMIT :offset, :limit"

            service.query(sql, {
                replacements,
                type: "SELECT"
            }).then(result => {
                res.send({ msg: "获取列表成功", status: 6011, result })
            }).catch(err => {
                res.send({ msg: "获取列表失败", status: 6022 })
            })
        }
        // 获取列表条目数
    getTotal(req, res) {
            let sql = "SELECT COUNT(`article_id`) AS `count` FROM `article`"
            let replacements = {
                offset: Number(req.query.offset),
                limit: Number(req.query.limit)
            }

            if (Number(req.query.status != -1)) {
                sql += "WHERE `status` = :status"
                replacements.status = req.query.status

            }
            if (Number(req.query.status != -1)) {
                if (req.query.nickName) {
                    sql += " AND `text` LIKE :nickname"
                    replacements.nickname = `%${req.query.nickName}%`
                }
                if (req.query.pid) {
                    sql += "  AND `pid` = :pid"
                    replacements.pid = req.query.pid
                }
            } else {
                if (req.query.nickName) {
                    sql += " WHERE `text` LIKE :nickname"
                    replacements.nickname = `%${req.query.nickName}%`
                    if (req.query.pid) {
                        sql += "  AND `pid` = :pid"
                        replacements.pid = req.query.pid
                    }
                } else {
                    if (req.query.pid) {
                        sql += "  WHERE `pid` = :pid"
                        replacements.pid = req.query.pid
                    }
                }

            }
            service.query(sql, {
                replacements,
                type: "SELECT"
            }).then(result => {
                res.send({ msg: "获取首页条目数成功", status: 6055, result })
            }).catch(err => {
                res.send({ msg: "获取首页条目数失败", status: 6066 })
            })
        }
        // 切换首页内容状态
    toggleArticle(req, res) {
            service.selectData({
                modelName: "Article",
                attributes: ["article_id"],
                condition: {
                    article_id: req.body.articleId
                }
            }).then(result => {
                // 修改数据库
                service.updateData({
                    modelName: "Article",
                    value: {
                        status: Number(req.body.status)
                    },
                    condition: {
                        article_id: req.body.articleId
                    }
                }).then(result => {
                    if (result[0] === 1) {
                        res.send({ msg: "修改状态成功", status: 4031, result })
                    } else {
                        res.send({ msg: "修改状态失败", status: 4032 })
                    }

                }).catch(err => {
                    res.send({ msg: "修改状态失败", status: 4032 })
                })
            }).catch(err => {
                res.send({ msg: "不存在此数据", status: 4033 })
            })
        }
        // 删除文章数据
    removeArticle(req, res) {
            // 查询数据库
            service.selectData({
                modelName: "Article",
                attributes: ["article_id"],
                condition: {
                    article_id: {
                        [Op.in]: req.body.pids
                    }
                }
            }).then(result => {
                if (req.body.pids.length === result.length) {
                    // 删除数据库
                    service.destroyData({
                        modelName: "Article",
                        condition: {
                            article_id: {
                                [Op.in]: req.body.pids
                            }
                        }
                    }).then(v => {
                        if (v >= 1) {
                            res.send({ msg: "删除文章成功", status: 4101 })
                        } else {
                            res.send({ msg: "删除文章失败", status: 4102 })
                        }

                    }).catch(err => {
                        res.send({ msg: "删除文章失败", status: 4103 })
                    })
                } else {
                    res.send({ msg: "不存在此数据", status: 4104 })
                }

            }).catch(err => {
                res.send({ msg: "不存在此数据", status: 4104 })
            })
        }
        // 查询对应的文章
    searchArticle(req, res) {
            let sql = "SELECT*FROM `article`"
            let replacements = {}
            if (req.query.pid) {
                sql += " WHERE `article_id` = :pid"
                replacements.pid = req.query.pid
            } else {
                res.send({ msg: "未传入指定pid", status: 7103 })
                return
            }
            service.query(sql, {
                replacements,
                type: "SELECT"
            }).then(result => {
                res.send({ msg: "查询对应的文章成功", status: 7101, result })
            }).catch(err => {
                res.send({ msg: "查询对应的文章失败", status: 7102 })
            })
        }
        // 修改对应的文章
    eidtArticle(req, res) {
            service.selectData({
                modelName: "Article",
                attributes: ["article_id"],
                condition: {
                    article_id: req.body.articleId
                }
            }).then(result => {
                // 修改数据库
                service.updateData({
                    modelName: "Article",
                    value: {
                        status: Number(req.body.status),
                        nickname: req.body.person.nickName,
                        articlename: req.body.articleName,
                        email: req.body.person.email,
                        text: req.body.text,
                        userImg: req.body.person.userImg,
                        pid: req.body.pid,
                        articleId: req.body.articleId
                    },
                    condition: {
                        article_id: req.body.articleId
                    }
                }).then(result => {
                    if (result[0] === 1) {
                        res.send({ msg: "修改成功", status: 1701, result })
                    } else {
                        res.send({ msg: "修改失败", status: 1702 })
                    }

                }).catch(err => {
                    res.send({ msg: "修改失败", status: 1703 })
                })
            }).catch(err => {
                res.send({ msg: "不存在此数据", status: 1704 })
            })
        }
        // 添加日志
    addJournal(req, res) {
            // 获取时间戳作为id
            let journalId = "uid_" + new Date().getTime()
            service.createData({
                modelName: "Journal",
                data: {
                    journalId,
                    text: req.body.text,
                }
            }).then(success => {
                res.send({ msg: "添加成功", status: 6001 })
            }).catch(err => {
                res.send({ msg: "添加失败", status: 6002 })
            })
        }
        // 获取日志信息
    getJournal(req, res) {
            let sql = "SELECT*FROM `journal`"
            service.query(sql, {
                type: "SELECT"
            }).then(result => {
                res.send({ msg: "获取日志成功", status: 5066, result })
            }).catch(err => {
                res.send({ msg: "获取日志失败", status: 5077 })
            })
        }
        // 修改日志
    editorJournal(req, res) {
        service.selectData({
            modelName: "Journal",
            attributes: ["journal_id"],
            condition: {
                journal_id: req.body.journalId
            }
        }).then(result => {
            // 修改数据库
            service.updateData({
                modelName: "Journal",
                value: {
                    text: req.body.text,
                    journalId: req.body.journalId
                },
                condition: {
                    journal_id: req.body.journalId
                }
            }).then(result => {
                if (result[0] === 1) {
                    res.send({ msg: "修改成功", status: 1701, result })
                } else {
                    res.send({ msg: "修改失败", status: 1702 })
                }

            }).catch(err => {
                res.send({ msg: "修改失败", status: 1703 })
            })
        }).catch(err => {
            res.send({ msg: "不存在此数据", status: 1704 })
        })
    }

}


module.exports = new Controller();