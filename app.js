const express = require("express");
const cors = require("cors");
const indexRoutes = require("./src/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/api-docs-v1.json");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to library!");
});

app.use("/api", indexRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
