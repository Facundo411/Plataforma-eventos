import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";
import SessionsService from "../services/sessions.service.js";
import { verifyToken } from "../utils/jwt.js";

const sessionsService = new SessionsService();

passport.use(
    "register",
    new CustomStrategy(async (req, done) => {
        try {
            const { first_name, last_name, email, password } = req.body;

            if (!first_name || !last_name || !email || !password) {
                return done(null, false, {
                    message: "Todos los campos son obligatorios"
                });
            }

            if (!email.includes("@")) {
                return done(null, false, {
                    message: "El email no es válido"
                });
            }

            if (password.length < 8) {
                return done(null, false, {
                    message: "La contraseña debe tener al menos 8 caracteres"
                });
            }

            const user = await sessionsService.registerUser(
                first_name,
                last_name,
                email,
                password
            );

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);


passport.use(
    "login",
    new CustomStrategy(async (req, done) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return done(null, false, {
                    message: "Email y password son obligatorios"
                });
            }

            const user = await sessionsService.authenticateUser(
                email,
                password
            );

            return done(null, user);
        } catch (error) {
            if (error.message === "Credenciales inválidas") {
                return done(null, false, {
                    message: "Credenciales inválidas"
                });
            }

            return done(error);
        }
    })
);

passport.use(
    "current",
    new CustomStrategy((req, done) => {
        const token = req.cookies?.currentUser;

        if (!token) {
            return done(null, false, {
                message: "No autenticado"
            });
        }

        try {
            const decoded = verifyToken(token);

            return done(null, {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            });
        } catch (error) {
            return done(null, false, {
                message: "No autenticado"
            });
        }
    })
);


export default passport;