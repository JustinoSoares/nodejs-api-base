const Sequelize = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("users",{
    name: {
        type: Sequelize.STRING,
        allowNull:true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        timestamps: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

// User.sync({ force: true });
module.exports = User;