//路由层

//导入控制器层
let controller = require(__basename + '/controller/controller.js');

module.exports = app => {

    //注册
    app.post('/register', controller.register);
    // 发送验证码
    app.post("/sendCode", controller.sendCode);
    // 登录
    app.post("/login", controller.login)
        // 修改密码
    app.post("/modify", controller.modify)
        // 注销账号
    app.post("/cancellation", controller.cancellation)
        // 修改个人信息
    app.post("/modifyPersonal", controller.modifyPersonal)
        // 找回密码
    app.post("/forget", controller.forget)

    // 添加留言板数据
    app.post("/addMessage", controller.addMessage)
        // 查询个人信息
    app.post("/getPerson", controller.getPerson)
        // 获取留言信息
    app.get("/getData", controller.getData)
        // 获取留言板 条目数
    app.get("/getDataTotal", controller.getDataTotal)
        // 修改留言状态
    app.post("/toggleStatus", controller.toggleStatus)
        // 删除留言信息
    app.post("/removeData", controller.removeData)

    // 添加留言回复
    app.post("/addReply", controller.addReply)
        // 获取回复列表
    app.get("/getReplyList", controller.getReplyList)
        // 修改回复状态
    app.post("/toggleReply", controller.toggleReply)
        // 删除回复信息
    app.post("/removeReply", controller.removeReply)
        // 获取回复条目数
    app.get("/getReplyTotal", controller.getReplyTotal)

    // 添加相册图片
    app.post("/addPhoto", controller.addPhoto)
        // 获取图片列表
    app.get("/getPhoto", controller.getPhoto)
        // 获取图片列表条目数
    app.get("/getPhotoTotal", controller.getPhotoTotal)
        // 切换图片状态
    app.post("/togglePhoto", controller.togglePhoto)
        // 删除图片
    app.post("/removePhoto", controller.removePhoto)
        // 获取用户列表
    app.get("/getUserList", controller.getUserList)
        // 获取用户条目数
    app.get("/getUserTotal", controller.getUserTotal)
        // 修改用户状态
    app.post("/toggleUser", controller.toggleUser)
        // 添加文章分类
    app.post("/addArticleType", controller.addArticleType)
        // 获取文章分类列表
    app.get("/getArticleType", controller.getArticleType)
        // 获取文章分类条目数
    app.get("/getArticleTotal", controller.getArticleTotal)
        // 获取所有文章类型数据
    app.get("/getAllArticleType", controller.getAllArticleType)
        // 修改文章分类状态
    app.post("/toggleArticleType", controller.toggleArticleType)
        // 删除文章分类
    app.post("/removeArticleType", controller.removeArticleType)


    // 添加首页内容
    app.post("/addArticle", controller.addArticle)
        // 查询部分首页内容
    app.get("/getArticle", controller.getArticle)
        // 获取部分首页条目数
    app.get("/getTotal", controller.getTotal)
        // 修改文章状态
    app.post("/toggleArticle", controller.toggleArticle)
        // 删除文章
    app.post("/removeArticle", controller.removeArticle)
        // 查询指定文章
    app.get("/searchArticle", controller.searchArticle)
        // 修改指定文章
    app.post("/eidtArticle", controller.eidtArticle)
        // 获取首页内容
    app.get("/getAllArticle", controller.getAllArticle)
        // 获取首页条目数
    app.get("/getAllArticleTotal", controller.getAllArticleTotal)
        // 添加日志内容
    app.post("/addJournal", controller.addJournal)
        // 获取日志信息
    app.get("/getJournal", controller.getJournal)
        // 修改日志信息
    app.post("/editorJournal", controller.editorJournal)


}