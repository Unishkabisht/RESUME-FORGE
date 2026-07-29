require("dotenv").config();

const settings = {
    development: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        dialect: "mysql",
        port: process.env.MYSQL_PORT,
        logging: false
    }
};

module.exports = settings;
