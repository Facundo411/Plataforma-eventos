import UsersDAO from "../dao/users.dao.js";

class UsersRepository {
    constructor() {
        this.dao = new UsersDAO();
    }

    async findByEmail(email) {
        return await this.dao.findByEmail(email);
    }

    async getAll() {
        return await this.dao.getAll();
    }

    async findById(id) {
        return await this.dao.findById(id);
    }

    async create(userData) {
        return await this.dao.create(userData);
    }
}

export default UsersRepository;