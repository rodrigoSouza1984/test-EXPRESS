const calculaValor = require('./calcula-valor.js')

const bancoDados = require('./bancoDados')

const juros = 0.025

const consultar = async (nome, CPF, valor, parcelas) => {
    console.log('1qqqqqqqq')
    let cliente = await bancoDados.cliente.findOne({
        where: { CPF }
    })    

    if (cliente === null) {
        cliente = await bancoDados.cliente.create({
            Nome: nome,
            CPF: CPF
        })
    }

    const ultimaConsulta = await bancoDados.consulta.findOne({
        where: { ClienteCPF: CPF},
        order: [//tipo de ordenacao pelo campo createdAt que gera altomatico, mo maior po menor 'DESC 
            [bancoDados.sequelize.col('createdAt'), 'DESC']
        ]
    })

    if(ultimaConsulta){        
        const diferenca = Math.abs(ultimaConsulta.dataValues.createdAt.getTime() - new Date().getTime())
        const diferencaDias = Math.round(diferenca / (1000 * 60 * 60 * 24))

        if(diferencaDias <= 30){
            throw new Error(`Última consulta realizada há ${diferencaDias} dias`)
        }
    }

    const montante = calculaValor.calcularMontante(valor, juros, parcelas)
    const prestacoes = calculaValor.calcularPrestacoes(montante, parcelas)

    const novaConsulta = {
        Valor : valor,
        NumPrestacoes: parcelas,
        Juros: juros,
        Prestacoes: prestacoes.join(', '),
        ClienteCPF: cliente.CPF,
        Montante: montante
    }

    await bancoDados.consulta.create(novaConsulta)

    return {
        montante: montante,
        juros: juros,
        parcelas: prestacoes.length,
        primeiraPrestacao: prestacoes[0],
        prestacoes: prestacoes
    }

}

module.exports = {
    consultar    
}