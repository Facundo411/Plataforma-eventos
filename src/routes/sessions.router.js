import { Router } from "express";
import { register, login, current, logout } from "../controllers/sessions.controller.js";
import passport from "passport";

const router = Router();

router.post("/register", (req, res, next) => {
    passport.authenticate(
        "register",
        { session: false },
        (err, user, info) => {
            if (err) {
                if (err.message === "El email ya está registrado") {
                    return res.status(409).json({
                        status: "error",
                        message: err.message
                    });
                }

                return res.status(500).json({
                    status: "error",
                    message: "Error al registrar el usuario"
                });
            }

            if (!user) {
                return res.status(400).json({
                    status: "error",
                    message: info?.message || "Error al registrar el usuario"
                });
            }

            req.user = user;
            return register(req, res, next);
        }
    )(req, res, next);
});

router.post("/login", (req, res, next) => {
    passport.authenticate(
        "login",
        { session: false },
        (err, user, info) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Error al iniciar sesión"
                });
            }

            if (!user) {
                const message = info?.message;

                if (message === "Credenciales inválidas") {
                    return res.status(401).json({
                        status: "error",
                        message: "Credenciales inválidas"
                    });
                }

                return res.status(400).json({
                    status: "error",
                    message: message || "Email y password son obligatorios"
                });
            }

            req.user = user;
            return login(req, res, next);
        }
    )(req, res, next);
});

router.get("/current", (req, res, next) => {
    passport.authenticate(
        "current",
        { session: false },
        (err, user) => {
            if (err || !user) {
                return res.status(401).json({
                    status: "error",
                    message: "No autenticado"
                });
            }

            req.user = user;
            return current(req, res, next);
        }
    )(req, res, next);
});

router.post("/logout", logout);

export default router;