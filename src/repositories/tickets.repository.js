import Ticket from "../models/Ticket.js";

class TicketsRepository {
    async getById(id) {
        return await Ticket.findById(id);
    }

    async getByUser(userId) {
        return await Ticket.find({ user: userId })
            .populate("event", "title date location");
    }

    async getByEvent(eventId) {
        return await Ticket.find({ event: eventId });
    }

    async findActiveByUserAndEvent(userId, eventId) {
        return await Ticket.findOne({
            user: userId,
            event: eventId,
            status: { $in: ["confirmed", "pending"] }
        });
    }

    async create(ticketData) {
        return await Ticket.create(ticketData);
    }

    async update(id, ticketData) {
        return await Ticket.findByIdAndUpdate(
            id,
            ticketData,
            { new: true, runValidators: true }
        );
    }
}

export default TicketsRepository;