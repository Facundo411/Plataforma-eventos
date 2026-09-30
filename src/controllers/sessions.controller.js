import SessionsService from "../services/sessions.service.js";

const sessionsService = new SessionsService();

export async function getSessions(req, res) {
    try {
        const result = await sessionsService.getStatus();

        res.status(200).json({
            status: "success",
            ...result
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener el estado de sessions"
        });
    }
}