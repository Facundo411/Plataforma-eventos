import bcrypt from "bcrypt";

export async function createHash(password) {
    return await bcrypt.hash(password, 10);
}