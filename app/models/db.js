const mysql = require("mysql");
const {Client} = require('pg')
const config = require('config');

// Cria uma conexão com a base MySQL
const connection_mysql = mysql.createConnection({
    host: config.ServerHost,
    port: config.MySQLPort,
    user: config.DBUser,
    password: config.DBPassword,
    database: config.DB
});

// open the MySQL connection
connection_mysql.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the MySQL database");
});

// Cria uma conexão com a base Postgres
const client = new Client({
    host: config.ServerHost,
    port: config.PostgresPort,
    user: config.DBUser,
    password: config.DBPassword,
    database: config.DB
});

// Connect with the Postgres database
client.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the Postgres database");
});

module.exports = {
    mysql: connection_mysql,
    postgres: client
}
