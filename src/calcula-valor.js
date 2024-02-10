function calcularMontante(capital, taxa, periodo) {
    let montante = capital * Math.pow((1 + taxa), periodo - 1);
    montante = arredondar(montante)
    return montante;
}

function arredondar(valor) {
    const precisao = 100;
    const arredondado = Math.round((valor + Number.EPSILON) * precisao) / precisao
    return arredondado;
}

function calcularPrestacoes (montante, numeroParcelas){
    const prestacaoBase = arredondar(montante/numeroParcelas)
    //console.log(prestacaoBase)
    const resultado = Array(numeroParcelas).fill(prestacaoBase);
    
    let somaPrestacoes = resultado.reduce((a, t) => a + t )
        
    let diferenca = arredondar(montante-somaPrestacoes)    
    let i = 0

    //console.log(resultado.map(res => arredondar(res / 100)))

    while(diferenca != 0 ){
        resultado[i] =  arredondar(resultado[i] + 0.01)
        somaPrestacoes = resultado.reduce((a, t) => a + t )        
        diferenca = arredondar(montante-somaPrestacoes)
        i++;
    }

    
    

    return resultado
}


function realizarParaAdultos (pessoas, callback){
    for(let i = 0; i < pessoas.length; i++){
        if(pessoas[i].idade >= 18){
            callback(pessoas[i]);
        }
    }
}

function timerMock (callback) {
    setTimeout(() => {
        callback();
    }, 3000)
}

module.exports = {
    calcularMontante,
    arredondar,
    calcularPrestacoes,
    realizarParaAdultos,
    timerMock
}
