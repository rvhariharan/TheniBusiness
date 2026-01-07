const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.'))); // Serve static files from current directory

// Database Setup
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )`, (err) => {
            if (err) console.error("Error creating users table", err);
        });

        // Jobs Table
        db.run(`CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            company TEXT,
            location TEXT,
            salary TEXT,
            type TEXT,
            posted_date DATE DEFAULT (datetime('now', 'localtime'))
        )`, (err) => {
            if (err) {
                console.error("Error creating jobs table", err);
            } else {
                // Seed some data if empty
                db.get("SELECT count(*) as count FROM jobs", (err, row) => {
                    if (row && row.count === 0) {
                        const stmt = db.prepare("INSERT INTO jobs (title, company, location, salary, type) VALUES (?, ?, ?, ?, ?)");
                        stmt.run("Software Engineer", "Tech Solutions", "Theni", "₹25,000 - ₹40,000", "Full-time");
                        stmt.run("Marketing Executive", "Theni Traders", "Theni", "₹15,000 - ₹20,000", "Part-time");
                        stmt.run("Store Manager", "Super Mart", "Bodinayakanur", "₹18,000 a month", "Full-time");
                        stmt.run("Graphic Designer", "Creative Hub", "Cumbum", "₹12,000 - ₹25,000", "Contract");
                        stmt.finalize();
                        console.log("Seeded jobs table");
                    }
                });
            }
        });
    }
});

// Routes

// Get All Jobs
app.get('/api/jobs', (req, res) => {
    db.all("SELECT * FROM jobs ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ jobs: rows });
    });
});

// Get Job by ID
app.get('/api/jobs/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM jobs WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.json({ job: row });
    });
});

// Sign Up
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

        db.run(sql, [name, email, hash], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: "Email already exists" });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "User registered successfully", userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], async (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const match = await bcrypt.compare(password, row.password);
        if (match) {
            res.json({ message: "Login successful", user: { id: row.id, name: row.name, email: row.email } });
        } else {
            res.status(400).json({ error: "Invalid email or password" });
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
