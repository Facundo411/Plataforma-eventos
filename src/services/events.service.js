import EventsRepository from "../repositories/events.repository.js";

const eventsRepository = new EventsRepository();

class EventsService {
    async getEvents() {
        return await eventsRepository.getAll();
    }
}

export default EventsService;