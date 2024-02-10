const request = require('supertest')
const app = require('../src/app.js')
const bancoDados = require('../src/bancoDados.js')

describe('Testes de Integração', () => {
    beforeEach(async () => {
        await bancoDados.cliente.destroy({ where: {} })
        await bancoDados.consulta.destroy( { where: {}  })
    })

    afterAll(async () => await bancoDados.sequelize.close())

    const clienteJoao = {
        Nome: 'João Silva2',
        CPF: '000.000.000-01'
    }

    const resultadoEsperado = {
        montante: 106.9,
        juros: 0.025,
        parcelas: 3,
        primeiraPrestacao: 35.64,
        prestacoes: [35.64, 35.63, 35.63],        
    }

    const payloadRequest = {
        nome: clienteJoao.Nome,
        CPF: clienteJoao.CPF,
        valor: 101.75,
        parcelas: 3
    }

    test('responder http 200 na raiz', () => {
        request(app).get('/').then(res => expect(res.status).toBe(200))
    })

    test('responder http 200 na raiz', async () => {
        const res = await request(app).get('/')
        expect(res.status).toBe(200)
    })

    test('CENARIO 01', async () => {
        const res = await request(app).post('/consulta-credito').send(payloadRequest)
        
        //resultado obtido com sussesso
        expect(res.body.erro).toBeUndefined()
        expect(res.body.montante).toBe(106.9)
        expect(res.status).toBe(201)
        expect(res.body).toMatchObject(resultadoEsperado)
        expect(res.body).toMatchSnapshot(resultadoEsperado)

        //cliente foi armazenado
        const cliente = await bancoDados.cliente.findOne({where: {CPF: clienteJoao.CPF}})
        expect(cliente.CPF).toBe(clienteJoao.CPF)

        const consulta = await bancoDados.consulta.findOne({where: {ClienteCPF: clienteJoao.CPF}})
        expect(consulta.Valor).toBe(101.75)
    })

    test('CENARIO 02', async () => {
        bancoDados.cliente.create(clienteJoao)
        bancoDados.consulta.create({
            Valor: 1,
            NumPrestacoes:2,
            Juros: 0.5,
            Prestacoes: '1, 1',
            ClienteCPF: clienteJoao.CPF,
            Montante: 2,
            createdAt: '2016-06-22 19:10:25-07'
        })        

        const res = await request(app).post('/consulta-credito').send(payloadRequest)
        expect(res.body).toMatchObject(resultadoEsperado)
        expect(res.body).toMatchSnapshot(resultadoEsperado)
        expect(res.status).toBe(201)

        const count = await bancoDados.consulta.count({where: {ClienteCPF: clienteJoao.CPF}})
        expect(count).toBe(2)
    })

    test('CENARIO 03', async () => {
        const res1 = await request(app).post('/consulta-credito').send(payloadRequest)

        expect(res1.body).toMatchSnapshot(resultadoEsperado)

        const res2 = await request(app).post('/consulta-credito').send(payloadRequest)

        //resultado obtido
        expect(res2.body.erro).toBeDefined()
        expect(res2.status).toBe(405)
    })
    

    test('CENARIO 04', async () => {
        const res = await request(app).post('/consulta-credito').send({})

        //resultado obtido
        expect(res.body.erro).toBeDefined()
        expect(res.status).toBe(400)
    })
    
})