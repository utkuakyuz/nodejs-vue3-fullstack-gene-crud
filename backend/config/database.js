const { Sequelize } = require("sequelize");
require("dotenv").config();

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

// Test  connection
const testConnection = async () => {
  try {
    await sequelize.authenticate() .then(() => console.log('Database connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));;
  } catch (error) {
    console.error("Unable to connect to database:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
