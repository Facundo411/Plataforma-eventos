import EventsRepository from "../repositories/events.repository.js";

const eventsRepository = new EventsRepository();

class EventsService {
    async getEvents() {
        return await eventsRepository.getAll();
    }

    async getEventById(id) {
        return await eventsRepository.getById(id);
    }

    async createEvent(eventData) {
        return await eventsRepository.create(eventData);
    }

    async updateEvent(id, eventData) {
        return await eventsRepository.update(id, eventData);
    }

    async publishEvent(id) {
        return await eventsRepository.publish(id);
    }
}

export default EventsService;