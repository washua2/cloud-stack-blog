//回复模型(数据表)
const { DataTypes, Model } = require('sequelize');

class Reply extends Model {}

Reply.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '表单id'
    },
    pid: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '回复id',
    },
    replyId: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '回复id',
    },
    status: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: '0',
        comment: '审核状态',
    },
    nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '回复用户名',
    },
    replyImg: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '回复图片',
    },
    userImg: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '用户头像',
    },
    desc: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '回复内容',
    }

}, {
    sequelize,
    tableName: 'reply',
    underscored: true
})

//模型同步到mysql的数据表, false: 如果表存在, 则不创建, 如果表不存在, 则创建新表; true: 如果表存在, 先删除旧表, 再创建新表
Reply.sync({ force: false })

module.exports = Reply;