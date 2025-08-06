const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./config/database");
const variantRoutes = require("./routes/variants");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);

// TODO: Error Handler Creates a request issue so will be considered later
// app.use(errorHandler);

// Body parsing
app.use(express.json());

// Routes
app.use("/api/variants", variantRoutes);

// Start server
const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
