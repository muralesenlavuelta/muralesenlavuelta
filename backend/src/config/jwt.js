import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_EXPIRES_IN =
    process.env.JWT_EXPIRES_IN || "2h";


if (!JWT_SECRET) {

    throw new Error(
        "JWT_SECRET no está configurado en el archivo .env"
    );
}

export const generateToken = (payload) => {

    return jwt.sign(
        payload,
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN
        }
    );
};

export const verifyToken = (token) => {

    return jwt.verify(
        token,
        JWT_SECRET
    );
};