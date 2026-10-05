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