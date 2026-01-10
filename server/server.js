const express = require("express");

const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger");

const connectDB = require("./config/database");
const fileRoutes = require("./routes/fileRoutes");

require("dotenv").config();

// config express
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

connectDB();

// endpoints
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/", fileRoutes);

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
