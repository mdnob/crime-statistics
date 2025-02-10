require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: 'oracle.cise.ufl.edu:1521/orcl'
};

console.log(`Connecting to database with ${dbConfig.user} ${dbConfig.password}`);

module.exports = dbConfig;
