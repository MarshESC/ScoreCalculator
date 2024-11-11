const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const path = require("path");

// Create Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "eventdriven",
};

app.post("/api/scores", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const { criteria1, criteria2, totalScore } = req.body;

    const [result] = await connection.execute(
      "INSERT INTO scores (criteria1_score, criteria2_score, total_score) VALUES (?, ?, ?)",
      [criteria1, criteria2, totalScore]
    );

    await connection.end();
    res.json({ success: true, message: "Scores saved successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving scores" });
  }
});

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
