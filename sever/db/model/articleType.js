//留言板模型(数据表)
const { DataTypes, Model } = require('sequelize');

class ArticleType extends Model {}

ArticleType.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '表单id'
    },
    articleTypeId: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '分类id',
    },
    statusType: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: '0',
        comment: '审核状态',
    },
    articlename: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '分类名称',
    },


}, {
    sequelize,
    tableName: 'articleType',
    underscored: true
})

//模型同步到mysql的数据表, false: 如果表存在, 则不创建, 如果表不存在, 则创建新表; true: 如果表存在, 先删除旧表, 再创建新表
ArticleType.sync({ force: false })

module.exports = ArticleType;