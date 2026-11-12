import UsersRepository from "../repositories/users.repository.js";
import UserDTO from "../dtos/UserDTO.js";

const usersRepository = new UsersRepository();

export async function getUsers(req, res) {
    try {
        const users = await usersRepository.getAll();

        return res.status(200).json({
            status: "success",
            payload: users.map(user => new UserDTO(user))
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los usuarios"
        });
    }
}
