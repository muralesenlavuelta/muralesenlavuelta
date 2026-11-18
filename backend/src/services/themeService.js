import {
    Theme
} from "../models/index.js";

export const getThemesService = async () => {

    return await Theme.findAll({
        order: [
            ["name", "ASC"]
        ]
    });
};

export const getThemeByIdService = async (
    id
) => {

    const theme = await Theme.findByPk(id);

    if (!theme) {
        throw new Error(
            "Temática no encontrada."
        );
    }

    return theme;
};

export const createThemeService = async (
    data
) => {

    const {
        name,
        description
    } = data;

    if (!name || name.trim() === "") {
        throw new Error(
            "El nombre de la temática es obligatorio."
        );
    }

    return await Theme.create({

        name: name.trim(),

        description:
            description || null
    });
};

export const updateThemeService = async (
    id,
    data
) => {

    const theme = await Theme.findByPk(id);

    if (!theme) {
        throw new Error(
            "Temática no encontrada."
        );
    }

    const updateData = {};

    if (
        data.name !== undefined
    ) {

        if (!data.name || data.name.trim() === "") {
            throw new Error(
                "El nombre no puede estar vacío."
            );
        }

        updateData.name = data.name.trim();
    }

    if (
        data.description !== undefined
    ) {

        updateData.description = data.description;
    }

    await theme.update(
        updateData
    );

    return theme;
};

export const deleteThemeService = async (
    id
) => {

    const theme = await Theme.findByPk(id);

    if (!theme) {
        throw new Error(
            "Temática no encontrada."
        );
    }

    await theme.destroy();

    return true;
};