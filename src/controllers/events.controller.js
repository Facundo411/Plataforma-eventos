import EventsService from "../services/events.service.js";
import mongoose from "mongoose";

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

export async function createEvent(req, res) {
    try {
        const {
            title,
            description,
            date,
            location,
            capacity,
            price
        } = req.body;

        const event = await eventsService.createEvent({
            title,
            description,
            date,
            location,
            capacity,
            price,
            organizer: req.user.id
        });

        return res.status(201).json({
            status: "success",
            payload: event
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al crear el evento"
        });
    }
}


export async function updateEvent(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: "error",
                message: "El ID del evento no es válido"
            });
        }

        const event = await eventsService.getEventById(id);


        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }

        const isAdmin = req.user.role === "admin";
        const isOwner = event.organizer.toString() === req.user.id.toString();

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                status: "error",
                message: "No tenés permisos para modificar este evento"
            });
        }

        const {
            title,
            description,
            date,
            location,
            capacity,
            price
        } = req.body;

        const updatedEvent = await eventsService.updateEvent(id, {
            title,
            description,
            date,
            location,
            capacity,
            price
        });

        return res.status(200).json({
            status: "success",
            payload: updatedEvent
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al modificar el evento"
        });
    }
}

export async function publishEvent(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: "error",
                message: "El ID del evento no es válido"
            });
        }

        const event = await eventsService.getEventById(id);

        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }

        const isAdmin = req.user.role === "admin";
        const isOwner =
            event.organizer.toString() === req.user.id.toString();

        if (!isAdmin && !isOwner) {
            return res.status(403).json({
                status: "error",
                message: "No tenés permisos para publicar este evento"
            });
        }

        const publishedEvent = await eventsService.publishEvent(id);

        return res.status(200).json({
            status: "success",
            payload: publishedEvent
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al publicar el evento"
        });
    }
}

