import NodeRSA from "node-rsa";

// Generar claves RSA
const key = new NodeRSA({ b: 512 }); // Puedes ajustar el tamaño de la clave

export const postPasswordToEncrypt = async (req, res) => {
  console.log(req.body);
  const { password } = req.body;
  const encrypted = key.encrypt(password, "base64");

  // console.log(encrypted);

  res.json({
    dataEncrypted: encrypted,
  });
};

export const postPasswordToDecrypt = async (req, res) => {
  const { encryptedMessage } = req.body;
  const decrypted = key.decrypt(encryptedMessage, "utf8");
  res.json({ dataDecrypted: decrypted });
};
