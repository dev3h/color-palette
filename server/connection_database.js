const { Sequelize } = require("sequelize");

// database, username, password, options
const sequelize = new Sequelize("learn_nodejs", "root", null, {
  host: "localhost",
  dialect: "mysql",
  // ẩn log Executing (default): SELECT 1+1 AS result
  logging: false,
});

const connectionDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
connectionDatabase()
