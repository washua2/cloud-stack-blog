//留言板模型(数据表)
const { DataTypes, Model } = require('sequelize');

class Message extends Model {}

Message.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '表单id'
    },
    messageId: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '留言板id',
    },
    status_type: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: '0',
        comment: '审核状态',
    },
    messagename: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '留言用户名',
    },
    email: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '邮箱',
    },
    messageImg: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '留言板图片',
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
        comment: '留言板内容',
    }

}, {
    sequelize,
    tableName: 'message',
    underscored: true
})

//模型同步到mysql的数据表, false: 如果表存在, 则不创建, 如果表不存在, 则创建新表; true: 如果表存在, 先删除旧表, 再创建新表
Message.sync({ force: false })

module.exports = Message;