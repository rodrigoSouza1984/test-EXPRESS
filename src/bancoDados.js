const Sequelize = require('sequelize')

const sequelize = new Sequelize(    {
    dialect: 'postgres', 
    host: 'localhost',//'172.17.0.2',//para container separado'172.17.0.2',//localhost era o antes
    port: 5432,
    data_base: 'consulta_credito',
    username: 'postgres',
    password: '123456',   
    logging: false
})

const clienteModel = (sequelize, DataTypes) => {
    const Cliente = sequelize.define('Cliente', {
        CPF: {
            type: DataTypes.STRING,
            allowNull: false,
            primarkey: true,
            unique: true
        },
        Nome: {
            type: DataTypes.STRING,
            allowNull: false,            
            unique: true
        }
    })

    return Cliente
}

const consultaModel = (sequelize, DataTypes) => {
    const Consulta = sequelize.define('Consulta', {
        Valor: {
            type: DataTypes.DOUBLE,
            allowNull: false,           
        },
        NumPrestacoes: {
            type: DataTypes.INTEGER,
            allowNull: false,          
        },
        Juros: {
            type: DataTypes.DOUBLE,
            allowNull: false,          
        },
        Montante: {
            type: DataTypes.DOUBLE,
            allowNull: false,          
        },
        ClienteCPF: {
            type: DataTypes.STRING,
            allowNull: true,          
        },
        Prestacoes: {
            type: DataTypes.STRING,
            allowNull: false,          
        }
        
    })

    return Consulta
}

const cliente = clienteModel(sequelize, Sequelize.DataTypes)
const consulta = consultaModel(sequelize, Sequelize.DataTypes)

cliente.hasMany(consulta, {as: 'Consultas'})
consulta.belongsTo(cliente)

module.exports = {
    cliente,
    consulta,
    sequelize
}