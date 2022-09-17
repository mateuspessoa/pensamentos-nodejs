const { DataTypes } = require('sequelize')

const db = require('../db/conn')

// Usuário
const User = require('./User')


const Tought = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    }
})

//Diz que um pensamento pertence a um usuário
Tought.belongsTo(User)

//Diz que um usuário pode ter vários pensamentos
User.hasMany(Tought)

module.exports = Tought