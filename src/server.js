const app = require('./app')

const bancoDados = require('./bancoDados')

bancoDados.sequelize.sync().then(async () => {
    await console.log('Conectado ao banco de dados')
})

app.listen(5678, () => {
    console.log('Aplicação ouvindo na porta 5678')
})