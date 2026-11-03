import TicketsService from "../services/tickets.service.js";
import mongoose from "mongoose";

const ticketsService = new TicketsService();

export async function createTicket(req, res) {
    try {
        const { eid } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(eid)) {
            return res.status(400).json({
                status: "error",
                message: "El ID del evento no es válido"
            });
        }

        const ticket = await ticketsService.createTicket(
            req.user.id,
            eid,
            quantity
        );

        return res.status(201).json({
            status: "success",
            payload: ticket
        });
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: error.message
        });
    }
}

export async function getMyTickets(req, res) {
    try {
        const tickets = await ticketsService.getMyTickets(req.user.id);

        return res.status(200).json({
            status: "success",
            payload: tickets
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener tus inscripciones"
        });
    }
}

export async function cancelTicket(req, res) {
    try {
        const { tid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(tid)) {
            return res.status(400).json({
                status: "error",
                message: "El ID del ticket no es válido"
            });
        }

        const ticket = await ticketsService.cancelTicket(
            tid,
            req.user.id,
            req.user.role
        );

        return res.status(200).json({
            status: "success",
            payload: ticket
        });
    } catch (error) {
        const statusCode = error.message.includes("permisos") ? 403 :
            error.message.includes("no existe") ? 404 : 400;

        return res.status(statusCode).json({
            status: "error",
            message: error.message
        });
    }
}

export async function getTicketsByEvent(req, res) {
    try {
        const { eid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(eid)) {
            return res.status(400).json({
                status: "error",
                message: "El ID del evento no es válido"
            });
        }

        const tickets = await ticketsService.getTicketsByEvent(
            eid,
            req.user.id,
            req.user.role
        );

        return res.status(200).json({
            status: "success",
            payload: tickets
        });
    } catch (error) {
        const statusCode = error.message.includes("permisos") ? 403 :
            error.message.includes("no existe") ? 404 : 400;

        return res.status(statusCode).json({
            status: "error",
            message: error.message
        });
    }
}