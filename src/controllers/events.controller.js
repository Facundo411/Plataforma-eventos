import EventsService from "../services/events.service.js";
import mongoose from "mongoose";

const eventsService = new EventsService();

export async function getEvents(req, res) {
    try {
        const { status, category, location, dateFrom, dateTo, page = 1, limit = 10, sort = "date" } = req.query;

        const filters = {};

        if (status) filters.status = status;
        if (category) filters.category = category;
        if (location) {
            filters.location = { $regex: location, $options: "i" };
        }

        if (dateFrom || dateTo) {
            filters.date = {};

            if (dateFrom) {
                const from = new Date(dateFrom);

                if (Number.isNaN(from.getTime())) {
                    return res.status(400).json({
                        status: "error",
                        message: "La fecha dateFrom no es válida"
                    });
                }

                filters.date.$gte = from;
            }

            if (dateTo) {
                const to = new Date(dateTo);

                if (Number.isNaN(to.getTime())) {
                    return res.status(400).json({
                        status: "error",
                        message: "La fecha dateTo no es válida"
                    });
                }

                filters.date.$lte = to;
            }

            if (
                filters.date.$gte &&
                filters.date.$lte &&
                filters.date.$gte > filters.date.$lte
            ) {
                return res.status(400).json({
                    status: "error",
                    message: "dateFrom no puede ser posterior a dateTo"
                });
            }
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (
            !Number.isInteger(pageNumber) ||
            !Number.isInteger(limitNumber) ||
            pageNumber < 1 ||
            limitNumber < 1
        ) {
            return res.status(400).json({
                status: "error",
                message: "page y limit deben ser números enteros mayores a cero"
            });
        }

        const sortOptions = {};
        const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
        const sortDirection = sort.startsWith("-") ? -1 : 1;

        if (!["date", "title", "price", "category"].includes(sortField)) {
            return res.status(400).json({
                status: "error",
                message: "Campo de ordenamiento no válido"
            });
        }

        sortOptions[sortField] = sortDirection;

        const result = await eventsService.getEvents(filters, {
            page: pageNumber,
            limit: limitNumber,
            sort: sortOptions
        });

        return res.status(200).json({
            status: "success",
            ...result
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los eventos"
        });
    }
}

export async function getEventById(req, res) {
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

        return res.status(200).json({
            status: "success",
            payload: event
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener el evento"
        });
    }
}

export async function createEvent(req, res) {
    try {
        const {
            title,
            description,
            category,
            date,
            location,
            capacity,
            price
        } = req.body;

        const event = await eventsService.createEvent({
            title,
            description,
            category,
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
        if (
            error.message.includes("obligatorios") ||
            error.message.includes("fecha") ||
            error.message.includes("capacidad") ||
            error.message.includes("precio")
        ) {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Error interno del servidor"
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

        const {
            title,
            description,
            category,
            date,
            location,
            capacity,
            price
        } = req.body;

        const updatedEvent = await eventsService.updateEvent(
            id,
            {
                title,
                description,
                category,
                date,
                location,
                capacity,
                price
            },
            req.user.id,
            req.user.role
        );

        return res.status(200).json({
            status: "success",
            payload: updatedEvent
        });
    } catch (error) {
        if (error.message.includes("no encontrado")) {
            return res.status(404).json({
                status: "error",
                message: error.message
            });
        }

        if (error.message.includes("permisos")) {
            return res.status(403).json({
                status: "error",
                message: error.message
            });
        }

        if (
            error.message.includes("obligatorios") ||
            error.message.includes("fecha") ||
            error.message.includes("capacidad") ||
            error.message.includes("precio") ||
            error.message.includes("cancelado")
        ) {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Error interno del servidor"
        });
    }
}

export async function changeEventStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: "error",
                message: "El ID del evento no es válido"
            });
        }

        const updatedEvent = await eventsService.changeEventStatus(
            id,
            status,
            req.user.id,
            req.user.role
        );

        return res.status(200).json({
            status: "success",
            payload: updatedEvent
        });
    } catch (error) {
        if (error.message.includes("no encontrado")) {
            return res.status(404).json({
                status: "error",
                message: error.message
            });
        }

        if (error.message.includes("permisos")) {
            return res.status(403).json({
                status: "error",
                message: error.message
            });
        }

        if (
            error.message.includes("estado") ||
            error.message.includes("fecha") ||
            error.message.includes("cancelado") ||
            error.message.includes("finalizado")
        ) {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Error interno del servidor"
        });
    }
}