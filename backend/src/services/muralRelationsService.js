import {
    Mural,
    Author,
    Theme,
    Keyword
} from "../models/index.js";

export const updateMuralAuthorsService = async (
    muralId,
    authorIds
) => {

    const mural = await Mural.findByPk(muralId);

    if (!mural) {
        throw new Error(
            "Mural no encontrado."
        );
    }

    const authors = await Author.findAll({
        where: {
            id: authorIds
        }
    });

    if (authors.length !== authorIds.length) {
        throw new Error(
            "Uno o más autores no existen."
        );
    }

    await mural.setAuthors(authors);

    return authors;
};

export const updateMuralThemesService = async (
    muralId,
    themeIds
) => {

    const mural = await Mural.findByPk(muralId);

    if (!mural) {
        throw new Error(
            "Mural no encontrado."
        );
    }

    const themes = await Theme.findAll({
        where: {
            id: themeIds
        }
    });

    if (themes.length !== themeIds.length) {
        throw new Error(
            "Una o más temáticas no existen."
        );
    }

    await mural.setThemes(themes);

    return themes;
};

export const updateMuralKeywordsService = async (
    muralId,
    keywordIds
) => {

    const mural = await Mural.findByPk(muralId);

    if (!mural) {
        throw new Error(
            "Mural no encontrado."
        );
    }

    const keywords = await Keyword.findAll({
        where: {
            id: keywordIds
        }
    });

    if (keywords.length !== keywordIds.length) {
        throw new Error(
            "Una o más keywords no existen."
        );
    }

    await mural.setKeywords(keywords);

    return keywords;
};