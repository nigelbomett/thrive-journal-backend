import { Sequelize } from "sequelize";

//Sequelize instance used to connect to database
export const sequelize = new Sequelize(
    process.env.DB_NAME as string, 
    process.env.DB_USERNAME as string, 
    process.env.DB_PASSWORD as string,{
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string,10),
    dialect:'mysql'
});


export const sequelize_test = new Sequelize(
    process.env.TEST_DB_NAME as string,
    process.env.TEST_DB_USERNAME as string,
    process.env.TEST_DB_PASSWORD as string, {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    dialect: 'mysql'
});