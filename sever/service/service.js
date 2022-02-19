// 服务层

const { QueryTypes } = require('sequelize');

class Service {
    constructor() {}
        // 添加数据
    createData(options) {
            return model[options.modelName].create(options.data)
        }
        // 查询数据
    selectData(options) {
        return model[options.modelName].findAll({
            // 查询字段
            attributes: options.attributes,
            // 查询条件
            where: options.condition
        })
    }

    //更新数据
    updateData(options) {
        //options: 参数对象 object
        /**
         * options.modelName: 模型名称, string
         * options.value: 更新数据, object
         * options.condition: 查询条件, object
         * options.transaction: 事务处理对象
         */

        return model[options.modelName].update(options.value, {
            where: options.condition
        }, { transaction: options.transaction });
    }

    //删除数据
    destroyData(options) {
            //options: 参数对象 object
            /**
             * options.modelName: 模型名称, string
             * options.condition: 查询条件, object
             * options.transaction: 事务处理对象
             */

            return model[options.modelName].destroy({
                where: options.condition
            }, { transaction: options.transaction });
        }
        //事务处理
    transaction(fn) {
            /**
             * fn: 回调函数, 回调函数的第一个参数为事务处理对象
             */
            return sequelize.transaction(fn);
        }
        //原始查询
    query(sql, options) {
        /**
         * sql: sql语句, string
         * options.replacements: 替换sql语句的值, object
         * options.type: sql操作类型, string ==> SELECT, UPDATE, DELETE, INSERT....
         */
        return sequelize.query(sql, {
            replacements: options.replacements,
            type: QueryTypes[options.type]
        })
    }
}

module.exports = new Service()