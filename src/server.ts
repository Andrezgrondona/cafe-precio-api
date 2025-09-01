import express from "express";
import precioCafeRoute from "./routes/precioCafe";

const app = express();
const PORT = 3000;


app.use("/precio-cafe", precioCafeRoute);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
