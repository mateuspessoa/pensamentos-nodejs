const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toughts2', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
})

try {
    sequelize.authenticate()
    console.log('Banco de Dados conectado com sucesso')
} catch(err) {
    console.log(`Não foi possível se conectar ao Banco de Dados: ${err}`)
}

module.exports = sequelize