import EventsService from "../services/events.service.js";

const eventsService = new EventsService();

export async function getEvents(req, res) {
    try {
        const events = await eventsService.getEvents();

        res.status(200).json({
            status: "success",
            payload: events
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener los eventos"
        });
    }
}