"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
//import bcrypt from 'bcryptjs';
var bcrypt = require('bcryptjs');
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    email: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false
    },
    password_hash: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false
    }
}, {
    tableName: 'users',
    sequelize: db_1.sequelize,
    hooks: {
        beforeCreate: (user) => {
            user.password_hash = bcrypt.hashSync(user.password_hash, 8);
        }
    }
});
