import {
    Author
} from "../models/index.js";

export const getAuthorsService = async () => {

    return await Author.findAll({
        order: [
            ["name", "ASC"]
        ]
    });
};

export const getAuthorByIdService = async (
    id
) => {

    const author = await Author.findByPk(id);

    if (!author) {
        throw new Error(
            "Autor no encontrado."
        );
    }

    return author;
};

export const createAuthorService = async (
    data
) => {

    const {
        name,
        biography,
        photo
    } = data;

    if (!name || name.trim() === "") {
        throw new Error(
            "El nombre del autor es obligatorio."
        );
    }

    const author = await Author.create({

        name: name.trim(),

        biography: biography || null,

        photo: photo || null
    });

    return author;
};

export const updateAuthorService = async (
    id,
    data
) => {

    const author = await Author.findByPk(id);

    if (!author) {
        throw new Error(
            "Autor no encontrado."
        );
    }

    const allowedFields = [
        "name",
        "biography",
        "photo"
    ];

    const updateData = {};

    for (const field of allowedFields) {

        if (
            data[field] !== undefined
        ) {
            updateData[field] =
                data[field];
        }
    }

    if (
        updateData.name !== undefined
    ) {

        if (!updateData.name || updateData.name.trim() === "") {

            throw new Error(
                "El nombre del autor no puede estar vacío."
            );
        }

        updateData.name = updateData.name.trim();
    }

    await author.update(
        updateData
    );

    return author;
};

export const deleteAuthorService = async (
    id
) => {

    const author = await Author.findByPk(id);

    if (!author) {
        throw new Error(
            "Autor no encontrado."
        );
    }

    await author.destroy();

    return true;
};