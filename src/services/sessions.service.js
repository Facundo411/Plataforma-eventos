import SessionsRepository from "../repositories/sessions.repository.js";

const sessionsRepository = new SessionsRepository();

class SessionsService {
    async getStatus() {
        return await sessionsRepository.getStatus();
    }
}

export default SessionsService;