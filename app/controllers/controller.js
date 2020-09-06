const mysql = require("mysql");
var jwt = require('jsonwebtoken');

var connections = require('../models/db.js')

// Função que gera um novo Token JWT
function generateAccessToken(username) {
    return jwt.sign(username, process.env.SECRET, { expiresIn: '24h' });
}

// Função que formata o número de telefone para o formato +xx (xx) xxxxx-xxxx
function formatNumber(number){
    var cleaned = ('' + number).replace(/\D/g, '') //'limpa' a string

    var result = cleaned.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/,'+$1 ($2) $3-$4');
    return result;
}

// Função do controller que realiza a autenticação para a rota /autentica
exports.autentica = (req,res,next) => {

    // Um modelo básico de autenticação
    if (req.body.username === "macapa" && req.body.password === "macapa123") {
        const token = generateAccessToken({ username: req.body.username });

        return res.json({auth: true, token: token});
    }

    if (req.body.username === "varejao" && req.body.password === "varejao123") {
        const token = generateAccessToken({ username: req.body.username });

        return res.json({auth: true, token: token});
    }

    res.status(400).json({message: "Login inválido"});

};

// Função do controller que realiza o cadastro dos contatos na respectiva base, com base no usuário autenticado pelo token
exports.cadastraContatos = (req,res,next) => {

    if (!req.body.contacts || req.body.contacts.length == 0) {
        return res.status(400).send({
            message: "Contacts não pode ser vazio"
        });
    }

    if (req.user === "macapa") {
        var sql = "INSERT INTO contacts (nome, celular) VALUES ?";
        contacts = req.body.contacts;
        var values = [];

        contacts.forEach(function (item) {
            values.push([item.name.toUpperCase(),formatNumber(item.cellphone)]);
        });

        connections.mysql.query(sql, [values], function(err) {
            if (err) {
                throw err;
                return res.status(500).send({
                    error: err || "Erro inserindo contatos"
                });
            }
            connections.mysql.end();
        });

        return res.send({
            message: "Contatos cadastrados"
        });

        // console.log(values);

    } else if (req.user === "varejao") {
        var sql = "INSERT INTO contacts (nome, celular) VALUES ?";
        contacts = req.body.contacts;
        var values = [];

        contacts.forEach(function (item) {
            var clean = ('' + item.cellphone).replace(/\D/g, ''); //'limpa' a string
            values.push([item.name,clean]);
        });

        // Função utilizada para formatar os valores a serem inseridos da query em um formato aceito pelo Postgres
        sql = mysql.format(sql,[values]);
        // console.log(sql);

        connections.postgres.query(sql, function(err) {
            if (err) {
                throw err;
                return res.status(500).send({
                    error: err || "Erro inserindo contatos"
                });
            }
            connections.postgres.end();
        });

        return res.send({
            message: "Contatos cadastrados"
        });

    } else {
        return res.status(400).send({
            message: "Erro: usuário não disponível"
        });
    }
};
