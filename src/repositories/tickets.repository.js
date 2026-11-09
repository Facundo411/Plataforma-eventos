import TicketsDAO from "../dao/tickets.dao.js";

class TicketsRepository {
    constructor() {
        this.dao = new TicketsDAO();
    }

    async getById(id) {
        return await this.dao.findById(id);
    }

    async getByUser(userId) {
        return await this.dao.findByUser(userId);
    }

    async getByEvent(eventId) {
        return await this.dao.findByEvent(eventId);
    }

    async findActiveByUserAndEvent(userId, eventId) {
        return await this.dao.findOne({
            user: userId,
            event: eventId,
            status: { $in: ["confirmed", "pending"] }
        });
    }

    async create(ticketData) {
        return await this.dao.create(ticketData);
    }

    async update(id, ticketData) {
        return await this.dao.update(id, ticketData);
    }
}

export default TicketsRepository;