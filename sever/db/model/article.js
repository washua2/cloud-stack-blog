//留言板模型(数据表)
const { DataTypes, Model } = require('sequelize');

class Article extends Model {}

Article.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '表单id'
    },
    articleId: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '文章id',
    },
    pid: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '文章id',
    },
    status: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: '0',
        comment: '审核状态',
    },
    articlename: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '文章类型名称',
    },
    nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '昵称',
    },
    userImg: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '用户头像',
    },
    email: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '邮箱',
    },
    text: {
        type: DataTypes.STRING(5000),
        allowNull: false,
        defaultValue: '',
        comment: '文章内容',
    }

}, {
    sequelize,
    tableName: 'article',
    underscored: true
})

//模型同步到mysql的数据表, false: 如果表存在, 则不创建, 如果表不存在, 则创建新表; true: 如果表存在, 先删除旧表, 再创建新表
Article.sync({ force: false })

module.exports = Article;