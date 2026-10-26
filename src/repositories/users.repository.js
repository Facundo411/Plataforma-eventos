import UsersDAO from "../dao/users.dao.js";

class UsersRepository {
    constructor() {
        this.usersDAO = new UsersDAO();
    }

    async findByEmail(email) {
        return await this.usersDAO.findByEmail(email);
    }

    async getAll() {
        return await this.usersDAO.getAll();
    }

    async create(userData) {
        return await this.usersDAO.create(userData);
    }
}

export default UsersRepository;