import EventsDAO from "../dao/events.dao.js";

class EventsRepository {
    constructor() {
        this.dao = new EventsDAO();
    }

    async getAll(filters = {}, options = {}) {
        return await this.dao.findAll(filters, options);
    }

    async getById(id) {
        return await this.dao.findById(id);
    }

    async create(eventData) {
        return await this.dao.create(eventData);
    }

    async update(id, eventData) {
        return await this.dao.update(id, eventData);
    }
}

export default EventsRepository;