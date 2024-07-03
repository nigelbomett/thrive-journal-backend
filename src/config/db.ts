import { Sequelize } from "sequelize";

//Sequelize instance used to connect to database
export const sequelize = new Sequelize('journaling_app','root','password',{
    host:'localhost',
    dialect:'mysql'
});