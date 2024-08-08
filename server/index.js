const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

const PORT = process.env.PORT || 7174

const app = express()

// consts

const error404 = "Image not found."

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "weatherapp"
})

db.connect((err) => {
    if (err){
        console.error("Error:", err)
        return;
    }
    console.log("Connected");
})

//show api routes

app.get("/api", (req, res) =>{
    res.json("/api/hot /api/cold /api/rain")
})

//call everything

app.get("/api/:table", (req, res) =>{
    const table = req.params.table
    db.query("SELECT * FROM ??", [table], (err, results) =>{
        if (err) throw err;
        res.json(results)
    })
})

//call specific

app.get("/api/:table/:name", (req, res) =>{
    const table = req.params.table
    const name = req.params.name
    db.query("SELECT img FROM ?? WHERE filename = ?", [table, name], (err, results) =>{
        if (err){
            return res.status(500).json({error: err.message})
        }
        if (results.length == 0){
            return res.status(404).json({error: error404})
        }
        const blob = results[0].img

        res.set('Content-Type', 'image/png')
        res.send(blob)
    })
})

app.listen(PORT, () =>{
    console.log(`Server is listening on ${PORT}, connect to http://localhost:${PORT}/api`)
})