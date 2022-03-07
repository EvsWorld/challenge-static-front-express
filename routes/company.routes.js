import { Router } from "express";
import * as controller from "../controllers/company.controller";
const router = Router();

router.get("/show", controller.findAll);
router.post("/upload", controller.upload);
router.get("/search", controller.search);

export default router;
