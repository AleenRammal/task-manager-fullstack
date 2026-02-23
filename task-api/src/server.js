const express = require("express");
const cors = require("cors");
require("dotenv").config();

const tasksRouter = require("./routes/tasks");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/tasks", tasksRouter);

// Test route
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
