//收集模型

//导入user模型
let User = require(__basename + '/db/model/user.js');

// 导入code验证码模型
let Code = require(__basename + '/db/model/code.js')

// 导入message模型
let Message = require(__basename + '/db/model/message.js')


// 导入Reply模型
let Reply = require(__basename + '/db/model/reply.js')

// 导入Photo模型
let Photo = require(__basename + '/db/model/photo.js')

// 导入ArticleType模型
let ArticleType = require(__basename + '/db/model/articleType.js')

// 导入Article模型
let Article = require(__basename + '/db/model/article.js')

// 导入Journal模型
let Journal = require(__basename + '/db/model/Journal.js')


module.exports = {
    User,
    Code,
    Message,
    Reply,
    Photo,
    ArticleType,
    Article,
    Journal
}