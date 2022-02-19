//留言板模型(数据表)
const { DataTypes, Model } = require('sequelize');

class Journal extends Model {}

Journal.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '表单id'
    },
    journalId: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '文章id',
    },
    text: {
        type: DataTypes.STRING(5000),
        allowNull: false,
        defaultValue: '',
        comment: '文章内容',
    }

}, {
    sequelize,
    tableName: 'journal',
    underscored: true
})

//模型同步到mysql的数据表, false: 如果表存在, 则不创建, 如果表不存在, 则创建新表; true: 如果表存在, 先删除旧表, 再创建新表
Journal.sync({ force: false })

module.exports = Journal;