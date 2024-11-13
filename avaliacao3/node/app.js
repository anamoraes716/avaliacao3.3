const database = require('./database.js');
const db_tables = require('./db_tables.js');

const path = require('path');
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PDFDocument = require('pdfkit');

//setup tables
database.runQuery(db_tables.categoria);
database.runQuery(db_tables.usuario);
database.runQuery(db_tables.plantacao);
database.runQuery(db_tables.atividade);

//config
app.use('/html', express.static(path.join(__dirname, 'html')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'html'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret:'chave_Ana Julia',
    resave:false,
    saveUninitialized:true,
    cookie: {secure:false}
}));

//rotas
app.get('/', (req, res) => {
    res.render('trabalho', {})
});

app.post('/', async (req, res) => {
    const {email, password} = req.body;
    const filtrarUsuario = 'select * from usuario where email = ? and senha = ?;';
    const usuario = await database.getQuery(filtrarUsuario, email, password);

    if (!usuario) {
        res.redirect('/?e=1');
    } else {
        const user = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
        }
        req.session.usuario = user;
        res.redirect('/menu');
    }
})

app.post('/cadastrar', async (req, res) => {
    const {nome, email, senha} = req.body;

    const cadastrarUsuario = 'insert into usuario(nome,email,senha) values (?,?,?);';
    await database.runAddQuery(cadastrarUsuario, nome, email, senha);

    res.redirect('/?s=1');
})

app.get('/menu', async (req, res) => {
    const usuario = req.session.usuario;
    if (!usuario) {
        res.redirect('/');
    } else {

        const queryPlantacao = 'select * from atividade;';
        const atividade = await database.getAllQuery(queryPlantacao);
        const queryAtividade = 'select * from atividade;';
        const plantacao = await database.getAllQuery(queryTransacoes);

        res.render('trabalho', {usuario: usuario, plantacao: plantacao, atividade:atividade})
    }
});

app.post('/cadastrarCategoria', async (req, res) => {
    const {descricao} = req.body;

    const cadastrarCategoria = 'insert into categoria(descricao) values (?);';
    await database.runAddQuery(cadastrarCategoria, descricao);

    res.redirect('/menu?section=cadastroTransacao');
});

app.post('/cadastrarTransacao', async (req, res) => {
    const usuario = req.session.usuario;
    const {descricao, valor, data, categoria_id, operation} = req.body;


    if (Number(operation) > 0) {
        const editarTransacao = 'update transacao set descricao = ?, valor = ?, data = ?, categoria_id = ? where id = ?;';
        await database.runAddQuery(editarTransacao, descricao, valor, data, categoria_id, Number(operation));

        res.redirect('/menu?s=3&section=listarTransacoes');
    } else {
        const cadastrarTransacao = 'insert into transacao(usuario_id, descricao, valor, data, categoria_id) values (?,?,?,?,?);';
        await database.runAddQuery(cadastrarTransacao, usuario.id, descricao, valor, data, categoria_id);
    
        res.redirect('/menu?s=2&section=cadastroTransacao');
    }
})
app.post('/excluirTransacao', async (req, res) => {
    const {id} = req.body;
    const editarTransacao = 'delete from transacao where id = ?;';
    await database.runAddQuery(editarTransacao, id);

    res.redirect('/menu?section=listarTransacoes');
});

app.post('/gerar-relatorio', async (req, res) => {
    const usuario = req.session.usuario;
    if (!usuario) {
        res.redirect('/');
    } else {

        function filtrarTransacoesPorData(transacoes, dataInicio, dataFim) {
            return transacoes.filter(transacao => {
                return transacao.data >= dataInicio && transacao.data <= dataFim;
            });
        }

        const {data_inicio, data_fim} = req.body;
        const queryTransacoes = 'select transacao.*, categoria.descricao as categoria from transacao join categoria on transacao.categoria_id = categoria.id;';
        const transacoes = filtrarTransacoesPorData(await database.getAllQuery(queryTransacoes), data_inicio, data_fim);

        // Configura o cabeçalho para download
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio_transacoes.pdf');
        res.setHeader('Content-Type', 'application/pdf');

        const doc = new PDFDocument();
        doc.pipe(res);

        // Título do Relatório
        doc.fontSize(20).text('Relatório de Transações', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(Usuário: ${usuario.nome} / Email: ${usuario.email});
        doc.moveDown();
        doc.fontSize(12).text(Dados de: ${data_inicio} / até: ${data_fim});
        doc.moveDown().moveDown();

        // Cabeçalho da Tabela
        const descX = 20;
        const valorX = 120;
        const dataX = 180;
        const categoriaX = 300;

        doc.fontSize(12).text('Descrição', descX, doc.y, { continued: true })
        .text('Valor', valorX, doc.y, { continued: true })
        .text('Data', dataX, doc.y, { continued: true })
        .text('Categoria', categoriaX, doc.y);
        doc.moveDown().moveDown();

        // Preenche as linhas da tabela com dados das transações
        if (transacoes.length > 0) {
            transacoes.forEach(transacao => {
                doc.fontSize(10)
                    .text(transacao.descricao, descX, doc.y, { continued: true })
                    .text(R$ ${transacao.valor.toFixed(2)}, valorX, doc.y, { continued: true })
                    .text(transacao.data, dataX, doc.y, { continued: true })
                    .text(transacao.categoria || 'Sem categoria', categoriaX, doc.y);

                doc.moveDown();
            });
        } else {
            doc.moveDown()
            doc.fontSize(11).text('Você não possui transações nesse intervalo!');
        }

        // Finaliza o documento
        doc.end();
    }
});

//init
app.listen(5000, () => {
    console.log('Servidor aberto em: http://localhost:5000');
})