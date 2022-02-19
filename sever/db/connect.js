//导入sequelize模块
const { Sequelize } = require('sequelize');

//连接mysql
module.exports = new Sequelize(config.mysqlOptions.database, config.mysqlOptions.username, config.mysqlOptions.password, {
    host: config.mysqlOptions.host,
    dialect: config.mysqlOptions.dialect,
    timezone: config.mysqlOptions.timezone
});