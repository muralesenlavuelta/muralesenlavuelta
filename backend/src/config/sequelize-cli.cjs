require("dotenv").config();

module.exports = {
    development: {
        dialect: "postgres",
        url: process.env.DATABASE_URL,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    },

    test: {
        dialect: "postgres",
        url: process.env.DATABASE_URL,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    },

    production: {
        dialect: "postgres",
        url: process.env.DATABASE_URL,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};