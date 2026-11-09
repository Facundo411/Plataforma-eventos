import Ticket from "../models/Ticket.js";

class TicketsDAO {
    async findById(id) {
        return await Ticket.findById(id);
    }

    async findByUser(userId) {
        return await Ticket.find({ user: userId })
            .populate("event", "title date location")
            .populate("user", "first_name last_name email role");
    }

    async findByEvent(eventId) {
        return await Ticket.find({ event: eventId });
    }

    async findOne(filters) {
        return await Ticket.findOne(filters);
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

    async count(filters = {}) {
        return await Ticket.countDocuments(filters);
    }
}

export default TicketsDAO;