import User from "../models/User.js";

class UsersDAO {
    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async getAll() {
        return await User.find().select("-password");
    }

    async create(userData) {
        return await User.create(userData);
    }
}

export default UsersDAO;