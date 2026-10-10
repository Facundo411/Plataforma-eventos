import SessionsService from "../services/sessions.service.js";

const sessionsService = new SessionsService();

export async function register(req, res) {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Faltan campos obligatorios"
            });
        }

        if (!email.includes("@")) {
            return res.status(400).json({
                status: "error",
                message: "El email no es válido"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                status: "error",
                message: "La contraseña debe tener al menos 8 caracteres"
            });
        }

        const user = await sessionsService.registerUser(
            first_name,
            last_name,
            email,
            password
        );

        res.status(201).json({
            status: "success",
            payload: user
        });

    } catch (error) {
        if (error.message === "El email ya está registrado") {
            return res.status(409).json({
                status: "error",
                message: error.message
            });
        }

        res.status(500).json({
            status: "error",
            message: "Error al registrar el usuario"
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email y password son obligatorios"
            });
        }

        const token = await sessionsService.loginUser(
            email,
            password
        );

        res.cookie("currentUser", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 3600000,
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({
            status: "success",
            message: "Login correcto"
        });

    } catch (error) {
        if (error.message === "Credenciales inválidas") {
            return res.status(401).json({
                status: "error",
                message: "Credenciales inválidas"
            });
        }

        res.status(500).json({
            status: "error",
            message: "Error al iniciar sesión"
        });
    }
}

export async function current(req, res) {
    res.status(200).json({
        status: "success",
        payload: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    });
}

export function logout(req, res) {
    res.clearCookie("currentUser", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });

    return res.status(200).json({
        status: "success",
        message: "Sesión cerrada"
    });
}