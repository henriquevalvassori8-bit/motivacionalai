// netlify/functions/get-training-tips.js
const { Client } = require('pg');

exports.handler = async (event, context) => {
    const DATABASE_URL = process.env.NETLIFY_DATABASE_URL;

    if (!DATABASE_URL) {
        console.error("Erro: Variável de ambiente NETLIFY_DATABASE_URL não configurada.");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Variável de ambiente NETLIFY_DATABASE_URL ausente.' })
        };
    }

    const pgClient = new Client({
        connectionString: DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await pgClient.connect();
        console.log('Conectado ao banco de dados para dicas de treino.');

        const queryText = 'SELECT titulo, conteudo, data_geracao FROM dicas_treino ORDER BY data_geracao DESC;';
        const res = await pgClient.query(queryText);

        const allTips = res.rows;
        
        // Retorna um array de dicas (vazio ou preenchido) com status 200 OK
        console.log('Dicas de treino encontradas:', allTips.length);
        return {
            statusCode: 200,
            body: JSON.stringify(allTips)
        };

    } catch (error) {
        console.error('Erro na função get-training-tips:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Erro ao carregar dica de treino: ${error.message}` })
        };
    } finally {
        // Garante que a conexão com o banco de dados seja fechada
        await pgClient.end();
    }
};