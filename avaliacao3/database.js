const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './banco_de_dados.db';

//Load
function abrirBancoDeDados(path = DB_PATH) {
    return new sqlite3.Database(path, (error) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Banco aberto.');
        }
    });
}

const DB = abrirBancoDeDados();

//Run
function runQuery(query) {
    return new Promise((resolve, reject) => {
        DB.run(query, (error) => {
            if (error) {
                console.error(error);
                reject(error)
            } else {
                console.log('Sucesso ao executar "run query".')
                resolve()
            }
        })
    });
}

function runAddQuery(query, ...args) {
    return new Promise((resolve, reject) => {
        DB.run(query, args, (error) => {
            if (error) {
                console.error(error);
                reject(error)
            } else {
                console.log('Sucesso ao executar "add query".')
                resolve()
            }
        })
    });
}

function getQuery(query, ...args) {
    return new Promise((resolve, reject) => {
        DB.get(query, args, (error, row) => {
            if (error) {
                console.error(error);
                reject(error)
            } else {
                console.log('Sucesso ao executar "get query".')
                resolve(row)
            }
        })
    });
}

function getAllQuery(query, ...args) {
    return new Promise((resolve, reject) => {
        DB.all(query, args, (error, rows) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.log('Sucesso ao executar "all query".')
                resolve(rows);
            }
        })
    });
}

module.exports = {
    abrirBancoDeDados,
    runQuery,
    runAddQuery,
    getQuery,
    getAllQuery
}