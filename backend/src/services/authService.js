import bcrypt from "bcryptjs";

import {
    generateToken
} from "../config/jwt.js";

import {
    User
} from "../models/index.js";

export const registerUserService = async ({
    username,
    email,
    password
}) => {

    if (typeof username !== "string" || username.trim() === "") {
        throw new Error(
            "El nombre de usuario es obligatorio."
        );
    }

    const normalizedUsername = username.trim();

    if (normalizedUsername.length < 3) {
        throw new Error(
            "El nombre de usuario debe tener al menos 3 caracteres."
        );
    }

    if (normalizedUsername.length > 50) {
        throw new Error(
            "El nombre de usuario no puede superar los 50 caracteres."
        );
    }

    if (typeof email !== "string" || email.trim() === "") {
        throw new Error(
            "El email es obligatorio."
        );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
        throw new Error(
            "El email no tiene un formato válido."
        );
    }

    if (typeof password !== "string" || password.length < 6) {
        throw new Error(
            "La contraseña debe tener al menos 6 caracteres."
        );
    }

    const existingUser = await User.findOne({
        where: {
            email: normalizedEmail
        }
    });

    if (existingUser) {
        throw new Error(
            "Ya existe un usuario con ese email."
        );
    }

    const existingUsername = await User.findOne({
        where: {
            username: normalizedUsername
        }
    });

    if (existingUsername) {
        throw new Error(
            "Ya existe un usuario con ese nombre."
        );
    }

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    const user = await User.create({
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,
        role: "user"
    });

    return user;
};

export const loginUserService = async ({
    email,
    password
}) => {

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        where: {
            email: normalizedEmail
        }
    });

    if (!user) {
        throw new Error(
            "Email o contraseña incorrectos."
        );
    }

    if (!user.isActive) {
        throw new Error(
            "La cuenta está desactivada."
        );
    }

    const passwordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordCorrect) {
        throw new Error(
            "Email o contraseña incorrectos."
        );
    }

    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
    });

    return {
        token,

        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    };
};