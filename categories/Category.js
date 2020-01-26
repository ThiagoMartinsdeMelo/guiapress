const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Depois do relacionamento tem que atualizar o banco
// É necessário remover a linha após a criação da tabela no banco
//Category.sync({force: true});

module.exports = Category;