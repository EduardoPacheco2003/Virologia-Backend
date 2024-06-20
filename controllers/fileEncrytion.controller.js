export const postFileToEncrypt = async (req, res) => {
  async (req, res) => {
    const { file } = req;
    const fileData = fs.readFileSync(file.path);

    res.json({ message: "File encrypted" });
  };
};
