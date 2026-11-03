import TicketsRepository from "../repositories/tickets.repository.js";
import EventsRepository from "../repositories/events.repository.js";
import User from "../models/User.js";
import EmailService from "./email.service.js";
import crypto from "node:crypto";

const ticketsRepository = new TicketsRepository();
const eventsRepository = new EventsRepository();
const emailService = new EmailService();

class TicketsService {
    async createTicket(userId, eventId, quantity) {
        const event = await eventsRepository.getById(eventId);

        if (!event) {
            throw new Error("El evento no existe");
        }

        if (event.status !== "published") {
            throw new Error("El evento no está disponible para inscripciones");
        }

        if (event.date < new Date()) {
            throw new Error("El evento ya finalizó");
        }

        if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
            throw new Error("La cantidad debe ser un número entero mayor a cero");
        }

        const existingTicket = await ticketsRepository.findActiveByUserAndEvent(
            userId,
            eventId
        );

        if (existingTicket) {
            throw new Error("El usuario ya tiene una inscripción activa para este evento");
        }

        const tickets = await ticketsRepository.getByEvent(eventId);

        const occupied = tickets
            .filter(ticket => ticket.status !== "cancelled")
            .reduce((total, ticket) => total + ticket.quantity, 0);

        const available = event.capacity - occupied;

        if (available < Number(quantity)) {
            throw new Error("No hay suficientes cupos disponibles");
        }

        const ticketData = {
            user: userId,
            event: eventId,
            status: "confirmed",
            quantity: Number(quantity),
            reservationCode: crypto.randomUUID()
        };

        const ticket = await ticketsRepository.create(ticketData);

        const user = await User.findById(userId);

        if (user) {
            await emailService.sendEmail(
                user.email,
                "Inscripción confirmada",
                `
            <h1>¡Inscripción confirmada!</h1>
            <p>Tu inscripción al evento <strong>${event.title}</strong> fue confirmada.</p>
            <p>Cantidad de entradas: ${quantity}</p>
            <p>Código de reserva: ${ticket.reservationCode}</p>
        `
            );
        }

        return ticket;
    }

    async getMyTickets(userId) {
        return await ticketsRepository.getByUser(userId);
    }

    async cancelTicket(ticketId, userId, userRole) {
        const ticket = await ticketsRepository.getById(ticketId);

        if (!ticket) {
            throw new Error("El ticket no existe");
        }

        if (
            ticket.user.toString() !== userId.toString() &&
            userRole !== "admin"
        ) {
            throw new Error("No tenés permisos para cancelar este ticket");
        }

        if (ticket.status === "cancelled") {
            throw new Error("El ticket ya está cancelado");
        }

        return await ticketsRepository.update(ticketId, {
            status: "cancelled",
            cancelledAt: new Date()
        });
    }

    async getTicketsByEvent(eventId, userId, userRole) {
        const event = await eventsRepository.getById(eventId);

        if (!event) {
            throw new Error("El evento no existe");
        }

        const isAdmin = userRole === "admin";
        const isOwner = event.organizer.toString() === userId.toString();

        if (!isAdmin && !isOwner) {
            throw new Error("No tenés permisos para consultar los tickets de este evento");
        }

        return await ticketsRepository.getByEvent(eventId);
    }
}

export default TicketsService;