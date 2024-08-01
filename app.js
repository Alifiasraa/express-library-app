const express = require("express");
const indexRoutes = require("./src/routes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to library!");
});

app.use("/api", indexRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
