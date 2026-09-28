import Event from "../models/Event.js";

class EventsRepository {
    async getAll() {
        return await Event.find();
    }
}

export default EventsRepository;