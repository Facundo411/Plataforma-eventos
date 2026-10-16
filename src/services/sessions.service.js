import UsersRepository from "../repositories/users.repository.js";
import { createHash, compareHash } from "../utils/hash.js";

const usersRepository = new UsersRepository();

class SessionsService {

    async registerUser(first_name, last_name, email, password) {

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await usersRepository.findByEmail(normalizedEmail);

        if (existingUser) {
            throw new Error("El email ya está registrado");
        }

        const passwordHash = await createHash(password);

        const newUser = await usersRepository.create({
            first_name,
            last_name,
            email: normalizedEmail,
            password: passwordHash
        });

        const userResponse = newUser.toObject();
        delete userResponse.password;

        return userResponse;
    }


    async authenticateUser(email, password) {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await usersRepository.findByEmail(normalizedEmail);

        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        const isValidPassword = await compareHash(
            password,
            user.password
        );

        if (!isValidPassword) {
            throw new Error("Credenciales inválidas");
        }

        return user;
    }

}

export default SessionsService;