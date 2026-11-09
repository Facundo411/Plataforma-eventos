import { generateToken } from "../utils/jwt.js";
import UserDTO from "../dtos/UserDTO.js";




export function register(req, res) {
    return res.status(201).json({
        status: "success",
        payload: new UserDTO(req.user)
    });
}

export function login(req, res) {
    const user = req.user;

    const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role
    });

    res.cookie("currentUser", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 3600000,
        secure: process.env.NODE_ENV === "production"
    });

    return res.status(200).json({
        status: "success",
        message: "Login correcto"
    });
}

export async function current(req, res) {
    const user = new UserDTO(req.user);

    return res.status(200).json({
        status: "success",
        payload: user
    });
}

export function logout(req, res) {
    res.clearCookie("currentUser", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });

    return res.status(200).json({
        status: "success",
        message: "Sesión cerrada"
    });
}