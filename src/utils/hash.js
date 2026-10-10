import bcrypt from "bcrypt";

export async function createHash(password) {
    return await bcrypt.hash(password, 10);
}

export async function compareHash(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
}