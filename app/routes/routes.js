var jwt = require('jsonwebtoken');

// Função middleware que realiza a autenticação baseada no token fornecido no header
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401).json({auth:false, message:'Error: no token provided'});
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        console.log(err)
        if (err) return res.sendStatus(403).json({auth: false, message:'Failed to authenticate token'});

        req.user = decoded.username;
        next(); // continua com o processamento da requisição
    });
}

module.exports = (app) => {

    // Get controller functions
    const appController = require('../controllers/controller.js');

    // Rota default
    app.get('/', (req, res) => {
        res.json({"message": "API teste"});
    });

    // Rota para a autenticação de um usuário
    app.post('/autentica', appController.autentica);

    // Rota para o cadastro de contatos
    app.post('/cadastra', authenticateToken, appController.cadastraContatos);

}
