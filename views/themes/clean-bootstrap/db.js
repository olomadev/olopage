import { Sequelize } from "sequelize";
//
// Database connection
// 
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});
