const usuario = `
    CREATE TABLE IF NOT EXISTS usuario (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(200) NOT NULL,
        senha VARCHAR(200) NOT NULL
    ); 
`
const plantacao = `
    CREATE TABLE IF NOT EXISTS transacao (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        tipo_cultivo VARCHAR(255) NOT NULL,
        area_plantada VARCHAR(200) NOT NULL,
        data_plantio VARCHAR(100) NOT NULL
    );
`
const atividade = `
    CREATE TABLE IF NOT EXISTS transacao (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        atividade VARCHAR(255) NOT NULL,
        data_atividade VARCHAR(100) NOT NULL
    );
`
module.exports = {
    usuario,
    plantacao,
    atividade
}