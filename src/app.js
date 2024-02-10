const express = require('express')
const app = express()

const {check, validationResult} = require('express-validator')
const { consulta } = require('./bancoDados')

const consultaCliente = require('./consulta-cliente')

app.use(express.json())

app.get('/', async(req, res) =>{
    res.status(200).send('Subiu a aplicacao')
})

app.post('/consulta-credito', 

    check('nome', 'Nome deve ser informado').notEmpty(),
    check('CPF', 'CPF deve ser informado').notEmpty(),
    check('valor', 'O valor deve ser um numero').notEmpty().isFloat(),
    check('parcelas', 'O numero de parcelas deve ser um numero inteiro').notEmpty().isInt(),

    async (req, res) => {
        const erros = validationResult(req)
        if(!erros.isEmpty()){
            return res.status(400).json({erro: erros.array()})
        }

        try {
            console.log('a')
            const valores = await consultaCliente.consultar(
                req.body.nome,
                req.body.CPF,
                req.body.valor,
                req.body.parcelas,                
            )            
            res.status(201).json(valores)
        }catch(err){
            return res.status(405).json({erro: err.message})
        }
    }
)

module.exports = app