import { Router } from "express";
import { sessions } from "../controllers/sessions.controller.js";

const router = Router();

router.get("/", sessions);

export default router;