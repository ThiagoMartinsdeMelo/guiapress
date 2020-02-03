const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }, password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Depois do relacionamento tem que atualizar o banco
// É necessário remover a linha após a criação da tabela no banco
//User.sync({force: true});

module.exports = User;