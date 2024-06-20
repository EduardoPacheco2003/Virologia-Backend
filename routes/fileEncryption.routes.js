import { Router } from "express";
import { postFileToEncrypt } from "../controllers/fileEncrytion.controller.js";
import multer from "multer";
import NodeRSA from "node-rsa";
import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Subir el directorio `uploads` un nivel más para crear en la raíz del proyecto
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Generar claves RSA
const key = new NodeRSA({ b: 512 });

// Configurar Multer para manejar la carga de archivos
const upload = multer({ dest: "uploads/" });

// Ruta para cifrar un archivo
router.post("/encrypt-file", upload.single("file"), (req, res) => {
  const fileData = fs.readFileSync(req.file.path);

  // Generar una clave simétrica
  const symmetricKey = crypto.randomBytes(32); //
  const iv = crypto.randomBytes(16); // IV

  // Cifrar el archivo con
  const cipher = crypto.createCipheriv("aes-256-cbc", symmetricKey, iv);
  let encryptedFile = cipher.update(fileData);
  encryptedFile = Buffer.concat([encryptedFile, cipher.final()]);

  // Guardar el archivo cifrado
  const encryptedFilePath = path.join(
    uploadsDir,
    `encrypted_${req.file.originalname}`
  );
  fs.writeFileSync(encryptedFilePath, encryptedFile);

  // Eliminar el archivo temporal subido
  fs.unlinkSync(req.file.path);

  res.json({
    message: "File encrypted successfully",
    encryptedFilePath,
    symmetricKey: symmetricKey.toString("hex"),
    iv: iv.toString("hex"),
  });
});

// Ruta para descifrar un archivo
router.post("/decrypt-file", upload.single("file"), (req, res) => {
  const { symmetricKey, iv } = req.body;
  const encryptedFileData = fs.readFileSync(req.file.path);
  const SimKey = symmetricKey[0];
  const IV = iv[0];

  try {
    // Descifrar el archivo
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(SimKey, "hex"),
      Buffer.from(IV, "hex")
    );
    let decryptedFile = decipher.update(encryptedFileData);
    decryptedFile = Buffer.concat([decryptedFile, decipher.final()]);

    // Guardar el archivo descifrado
    const decryptedFilePath = path.join(
      uploadsDir,
      `decrypted_${req.file.originalname}`
    );
    fs.writeFileSync(decryptedFilePath, decryptedFile);

    // Eliminar el archivo temporal subido
    fs.unlinkSync(req.file.path);

    res.json({
      message: "File decrypted successfully",
      decryptedFilePath,
    });
  } catch (error) {
    console.error("Error during decryption: ", error);
    res
      .status(500)
      .json({ message: "Error decrypting file. Incorrect data or key." });
  }
});

export default router;
