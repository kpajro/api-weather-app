const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const PORT = process.env.PORT || 7174;

const app = express();

// consts
const error404 = "Image not found.";

app.use(cors({
    origin: ['http://localhost:3000', 'https://kpajro.github.io'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Show API routes
app.get("/api", (req, res) => {
    res.json("/api/hot /api/cold /api/rain");
});

app.get("/api/:table", async (req, res) => {
    const table = req.params.table;
    let connection;

    try {
        connection = await pool.getConnection();
        const [results] = await connection.query("SELECT * FROM ??", [table]);
        res.json(results);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

app.get("/api/:table/:name", async (req, res) => {
    const table = req.params.table;
    const name = req.params.name;
    let connection;

    try {
        connection = await pool.getConnection();
        const [results] = await connection.query("SELECT img FROM ?? WHERE filename = ?", [table, name]);
        if (results.length === 0) {
            return res.status(404).json({ error: error404 });
        }
        const blob = results[0].img;

        res.set('Content-Type', 'image/png');
        res.send(blob);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}, connect to http://localhost:${PORT}/api`);
});
