//用户模型(数据表)
const { DataTypes, Model } = require('sequelize');

class Code extends Model {}

Code.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '验证码表id'
    },
    codeId: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '验证码id',
        unique: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '',
        comment: '邮箱',
    },
    code: {
        type: DataTypes.STRING(6),
        allowNull: false,
        defaultValue: '',
        comment: '验证码'
    }

}, {
    sequelize,
    tableName: 'code',
    underscored: true
})

//模型同步到mysql的数据表, false: 如果表存在, 则不创建, 如果表不存在, 则创建新表; true: 如果表存在, 先删除旧表, 再创建新表
Code.sync({ force: false })

module.exports = Code;