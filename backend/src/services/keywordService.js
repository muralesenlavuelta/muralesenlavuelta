import {
    Keyword
} from "../models/index.js";

export const getKeywordsService = async () => {

    return await Keyword.findAll({
        order: [
            ["name", "ASC"]
        ]
    });
};

export const getKeywordByIdService = async (
    id
) => {

    const keyword = await Keyword.findByPk(id);

    if (!keyword) {
        throw new Error(
            "Keyword no encontrada."
        );
    }

    return keyword;
};

export const createKeywordService = async (
    data
) => {

    const {
        name
    } = data;

    if (!name || name.trim() === "") {
        throw new Error(
            "El nombre de la keyword es obligatorio."
        );
    }

    return await Keyword.create({
        name: name.trim()
    });
};

export const updateKeywordService = async (
    id,
    data
) => {

    const keyword = await Keyword.findByPk(id);

    if (!keyword) {
        throw new Error(
            "Keyword no encontrada."
        );
    }

    if (
        data.name !== undefined
    ) {

        if (!data.name || data.name.trim() === "") {
            throw new Error(
                "El nombre no puede estar vacío."
            );
        }

        keyword.name = data.name.trim();
    }

    await keyword.save();

    return keyword;
};

export const deleteKeywordService = async (
    id
) => {

    const keyword = await Keyword.findByPk(id);

    if (!keyword) {
        throw new Error(
            "Keyword no encontrada."
        );
    }

    await keyword.destroy();

    return true;
};