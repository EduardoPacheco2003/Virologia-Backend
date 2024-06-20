import { Router } from "express";
import {
  postPasswordToDecrypt,
  postPasswordToEncrypt,
} from "../controllers/passwordEncryption.controller.js";

const router = Router();

router.post("/encrypt", postPasswordToEncrypt);
router.post("/decrypt", postPasswordToDecrypt);

export default router;
