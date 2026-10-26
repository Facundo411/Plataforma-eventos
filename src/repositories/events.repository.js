import Event from "../models/Event.js";

class EventsRepository {
    async getAll() {
        return await Event.find({ published: true });
    }

    async getById(id) {
        return await Event.findById(id);
    }

    async create(eventData) {
        return await Event.create(eventData);
    }

    async update(id, eventData) {
        return await Event.findByIdAndUpdate(
            id,
            eventData,
            { new: true, runValidators: true }
        );
    }

    async publish(id) {
        return await Event.findByIdAndUpdate(
            id,
            { published: true },
            { new: true, runValidators: true }
        );
    }
}

export default EventsRepository;