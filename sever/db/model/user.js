//用户模型(数据表)
const { DataTypes, Model } = require('sequelize');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '表单id'
    },
    userId: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '用户id',
        unique: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '',
        comment: '邮箱',
        unique: true
    },
    password: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: '',
        comment: '密码'
    },
    nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '昵称'
    },
    userImg: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: '',
        comment: '用户头像'
    },
    phone: {
        type: DataTypes.STRING(11),
        allowNull: false,
        defaultValue: '',
        comment: '手机号'
    },
    status: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: '1',
        comment: '审核状态',
    },
}, {
    sequelize,
    tableName: 'user',
    underscored: true
})

//模型同步到mysql的数据表, false: 如果表存在, 则不创建, 如果表不存在, 则创建新表; true: 如果表存在, 先删除旧表, 再创建新表
User.sync({ force: false })

module.exports = User;