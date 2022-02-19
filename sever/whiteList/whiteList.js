//请求域白名单
exports.hostList = [
    'http://192.168.1.108:8080',
    'http://localhost:8080',
    "http://120.78.192.153:9001"

]

// 验证码白名单
exports.codeList = [
    "/register"
]

// token 验证白名单
exports.tokenList = [
    "/addMessage",
    "/getPerson",
    "/toggleStatus",
    "/removeData",
    "/addReply",
    "/toggleReply",
    "/removeReply",
    "/addPhoto",
    "/togglePhoto",
    "/removePhoto",
    "/toggleUser",
    "//addArticleType",
    "/toggleArticleType",
    "/removeArticleType",
    "/addArticle",
    "/toggleArticle",
    "/removeArticle",
    "/eidtArticle",

]