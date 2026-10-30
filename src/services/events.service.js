
import EventsRepository from "../repositories/events.repository.js";

const eventsRepository = new EventsRepository();

class EventsService {
    async getEvents(filters = {}, options = {}) {
        return await eventsRepository.getAll(filters, options);
    }

    async getEventById(id) {
        return await eventsRepository.getById(id);
    }

    async createEvent(eventData) {
        const { title, description, category, date, location, capacity, price } = eventData;

        if (!title || !description || !category || !location || !date) {
            throw new Error("Todos los campos obligatorios deben estar completos");
        }

        const eventDate = new Date(date);

        if (Number.isNaN(eventDate.getTime())) {
            throw new Error("La fecha del evento no es válida");
        }

        if (eventDate < new Date()) {
            throw new Error("No se puede crear un evento con fecha pasada");
        }

        if (!Number.isFinite(Number(capacity)) || Number(capacity) <= 0) {
            throw new Error("La capacidad debe ser mayor a cero");
        }

        if (!Number.isFinite(Number(price)) || Number(price) < 0) {
            throw new Error("El precio debe ser mayor o igual a cero");
        }

        return await eventsRepository.create(eventData);
    }

    async updateEvent(id, eventData) {
        const event = await eventsRepository.getById(id);

        if (!event) {
            return null;
        }

        if (event.status === "cancelled") {
            throw new Error("No se puede modificar un evento cancelado");
        }

        const { date, capacity, price } = eventData;

        if (date !== undefined) {
            const eventDate = new Date(date);

            if (Number.isNaN(eventDate.getTime())) {
                throw new Error("La fecha del evento no es válida");
            }

            if (eventDate < new Date()) {
                throw new Error("No se puede actualizar un evento con fecha pasada");
            }
        }

        if (
            capacity !== undefined &&
            (!Number.isFinite(Number(capacity)) || Number(capacity) <= 0)
        ) {
            throw new Error("La capacidad debe ser mayor a cero");
        }

        if (
            price !== undefined &&
            (!Number.isFinite(Number(price)) || Number(price) < 0)
        ) {
            throw new Error("El precio debe ser mayor o igual a cero");
        }

        return await eventsRepository.update(id, eventData);
    }

    async changeEventStatus(id, status) {
        const event = await eventsRepository.getById(id);

        if (!event) {
            return null;
        }

        if (event.status === "cancelled") {
            throw new Error("No se puede cambiar el estado de un evento cancelado");
        }

        if (event.status === "finished" && status !== "finished") {
            throw new Error("No se puede cambiar el estado de un evento finalizado");
        }

        const allowedStatuses = ["draft", "published", "cancelled", "finished"];

        if (!allowedStatuses.includes(status)) {
            throw new Error("El estado del evento no es válido");
        }

        if (status === "published") {
            const eventDate = new Date(event.date);

            if (Number.isNaN(eventDate.getTime())) {
                throw new Error("La fecha del evento no es válida");
            }

            if (eventDate < new Date()) {
                throw new Error("No se puede publicar un evento cuya fecha ya pasó");
            }
        }

        return await eventsRepository.update(id, { status });
    }

}

export default EventsService;
