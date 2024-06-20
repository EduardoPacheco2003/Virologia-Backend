import express from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import passwordEncryptionRoutes from "./routes/passwordEncryption.routes.js";
import fileEncryptionRoutes from "./routes/fileEncryption.routes.js";

const app = express();

app.use(express.json());
app.disable("x-powered-by");
app.use(corsMiddleware());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

app.get("/", (req, res) => {
  res.json("Hello World");
});

// Ruta para cifrar y descifrar la contraseña
app.use(passwordEncryptionRoutes);
app.use(fileEncryptionRoutes);

//Ruta 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
