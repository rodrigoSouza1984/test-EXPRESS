const calculaValor = require('../src/calcula-valor')

describe('calculaMontante', () => {
    test('Com uma prestação Deve retornar o capital', () => {
        //operacao
        const montante = calculaValor.calcularMontante(100, 0.0175, 1);

        //Resultado ou comportamento esperado
        expect(montante).toBe(100)
    })


    test('Com 4 prestações o montante é acrescido de juros', () => {
        //operação
        const montante = calculaValor.calcularMontante(500, 0.025, 4);

        //resultado ou comportamento esperado
        expect(montante).toBe(538.45)
    })
})


describe('arrendondar', () => {
    test('Arredondar em Duas casas decimais', () => {
        const resultado = calculaValor.arredondar(538.4453124999998)
        expect(resultado).toBe(538.45)
    })
})

describe('calcularPrestacoes', () => {
    test('O número de parcelas é igual ao número de prestacoes', () => {
        const numeroPrestacoes = 6

        const prestacoes = calculaValor.calcularPrestacoes(200, numeroPrestacoes);

        expect(prestacoes.length).toBe(numeroPrestacoes);
    })

    test('Unica prestação igual ao montante passado', () => {
        const numeroPrestacoes = 1

        const prestacoes = calculaValor.calcularPrestacoes(200, numeroPrestacoes);

        expect(prestacoes.length).toBe(numeroPrestacoes);
        expect(prestacoes[0]).toBe(200)

    })

    test('Valor soma prestacoes deve ser igual montante com duas casa decimais', () => {
        const numeroPrestacoes = 3
        const montante = 100
        let soma = 0

        const prestacoes = calculaValor.calcularPrestacoes(montante, numeroPrestacoes);

        for (let i = 0; i < prestacoes.length; i++) {
            soma += prestacoes[i]
        }

        calculaValor.arredondar(soma);
        expect(prestacoes.length).toBe(numeroPrestacoes);
        expect(soma).toBe(montante)
    })

    test('Analisar se esta realmente adicionando nas primeiras parcelas a diferenca', () => {
        const numeroPrestacoes = 3
        let montante = 101.994
        montante = calculaValor.arredondar(101.994 * 100)
        //console.log(montante, 'aaaa')


        const prestacoes = calculaValor.calcularPrestacoes(montante, numeroPrestacoes);

        //testando se o array sempre vem em forma decrescente indicando que o vamor mais alto esta nas primeiras parcelas
        for (let i = 0; i < prestacoes.length - i; i++) {
            const j = i + 1
            //console.log(j)
            expect(prestacoes[i]).toBeGreaterThanOrEqual(prestacoes[j])
        }
    })

})


    test('exemplo de uso do MOCK ', async () => {
        let pessoas = new Array(3);

        pessoas[0] = {
            nome: 'João',
            idade: 19
        }

        pessoas[1] = {
            nome: 'Jose',
            idade: 17
        }

        pessoas[2] = {
            nome: 'Maria',
            idade: 18
        }

        const mockCallback = jest.fn(pessoa =>pessoa.idade)

        calculaValor.realizarParaAdultos(pessoas, mockCallback)

        expect(mockCallback.mock.calls.length).toBe(2)  //qnatas vezes o mock foi chamado espera 2 para passar ok
        
        expect(mockCallback.mock.calls[0][0]).toBe(pessoas[0]); //ver se a 1 pessoa chamada foi de indice 0
        expect(mockCallback.mock.results[0].value).toBe(pessoas[0].idade);//ver se a idade eh da pessoa de indice 0
        
        expect(mockCallback.mock.calls[1][0]).toBe(pessoas[2]);//mesma coisa soh que com o indice 2 as 2 linhas
        expect(mockCallback.mock.results[1].value).toBe(pessoas[2].idade);


    })

    test('TIMER COM MOCK ', (done) => {

        jest.useFakeTimers();

        const mockCallback = jest.fn(() => done());

        calculaValor.timerMock(mockCallback);

        jest.advanceTimersByTime(1000);
        expect(mockCallback).toHaveBeenCalledTimes(0);

        jest.advanceTimersByTime(3000);
        expect(mockCallback).toHaveBeenCalledTimes(1);

    })

    afterEach(() => {
        jest.useRealTimers();
    })

    //abaixo os metodos para montar cenario com timer
    // afterEach => executa depois da cada expect
    //afterAll => executa depois de todos os expcts
    //beforeEach => antes de cada
    //beforeAll   => antes de todos


