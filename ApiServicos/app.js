const express = require('express');
const app = express();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Listagem de todos os profissionais:

app.get('/profissionais', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM profissionais');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Listagem de profissionais por especialidade:

app.get('/profissionais/:especialidade', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM profissionais WHERE especialidade = ?', [req.params.especialidade]);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Listagem das vagas encerradas

app.get('/vagas/encerradas', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows, fields] = await conn.query('SELECT * FROM vagas WHERE encerrada = 1');
    conn.release();
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar vagas');
  }
});

// Cadastrar novos profissionais:

app.post('/profissionais', async (req, res) => {
  const { nome, especialidade, email, telefone } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query('INSERT INTO profissionais (nome, especialidade, email, telefone) VALUES (?, ?, ?, ?)', [nome, especialidade, email, telefone]);
    connection.release();
    res.json({ message: 'Profissional cadastrado com sucesso' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Excluir profissionais:

app.delete('/profissionais/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM profissionais WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Profissional excluído com sucesso' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Alterar informações sobre os profissionais:

app.put('/profissionais/:id', async (req, res) => {
  const { nome, especialidade, email, telefone } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query('UPDATE profissionais SET nome = ?, especialidade = ?, email = ?, telefone = ? WHERE id = ?', [nome, especialidade, email, telefone, req.params.id]);
    connection.release();
    res.json({ message: 'Profissional atualizado com sucesso' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}.`);
});
