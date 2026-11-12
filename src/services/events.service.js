import EventsRepository from "../repositories/events.repository.js";
import EventDTO from "../dtos/EventDTO.js";

const eventsRepository = new EventsRepository();

class EventsService {
    async getEvents(filters = {}, options = {}) {
        const result = await eventsRepository.getAll(filters, options);

        return {
            ...result,
            data: result.data.map(event => new EventDTO(event))
        };
    }

    async getEventById(id) {
        const event = await eventsRepository.getById(id);

        if (!event) {
            return null;
        }

        return new EventDTO(event);
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

        const event = await eventsRepository.create(eventData);

        return new EventDTO(event);
    }

    async updateEvent(id, eventData, userId, userRole) {
        
            const event = await eventsRepository.getById(id);

            if (!event) {
                throw new Error("Evento no encontrado");
            }

            const isAdmin = userRole === "admin";
            const isOwner = event.organizer.toString() === userId.toString();

            if (!isAdmin && !isOwner) {
                throw new Error("No tenés permisos para modificar este evento");
            }

            if (event.status === "cancelled") {
                throw new Error("No se puede modificar un evento cancelado");
            }

            if (
                !eventData.title ||
                !eventData.description ||
                !eventData.category ||
                !eventData.date ||
                !eventData.location ||
                eventData.capacity === undefined ||
                eventData.price === undefined
            ) {
                throw new Error("Todos los campos obligatorios deben estar completos");
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

            const updatedEvent = await eventsRepository.update(id, eventData);

            return new EventDTO(updatedEvent);
        
    }

    async changeEventStatus(id, status, userId, userRole) {
        const event = await eventsRepository.getById(id);

        if (!event) {
            throw new Error("Evento no encontrado");
        }

        const isAdmin = userRole === "admin";
        const isOwner = event.organizer.toString() === userId.toString();

        if (!isAdmin && !isOwner) {
            throw new Error("No tenés permisos para modificar este evento");
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

        const updatedEvent = await eventsRepository.update(id, { status });

        return new EventDTO(updatedEvent);
    }

}

export default EventsService;
