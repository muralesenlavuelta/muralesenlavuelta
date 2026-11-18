import {
    updateMuralAuthorsService,
    updateMuralThemesService,
    updateMuralKeywordsService
} from "../services/muralRelationsService.js";

export const updateMuralAuthors = async (
    req,
    res
) => {

    try {

        const {
            muralId
        } = req.params;

        const {
            authorIds
        } = req.body;

        if (!Array.isArray(authorIds)) {

            return res.status(400).json({
                success: false,
                message: "authorIds debe ser un array."
            });
        }

        const authors = await updateMuralAuthorsService(
            muralId,
            authorIds
        );

        return res.status(200).json({

            success: true,

            message: "Autores actualizados correctamente.",

            data: authors
        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message
        });
    }
};

export const updateMuralThemes = async (
    req,
    res
) => {

    try {

        const {
            muralId
        } = req.params;

        const {
            themeIds
        } = req.body;

        if (!Array.isArray(themeIds)) {

            return res.status(400).json({
                success: false,
                message: "themeIds debe ser un array."
            });
        }

        const themes = await updateMuralThemesService(
            muralId,
            themeIds
        );

        return res.status(200).json({

            success: true,

            message: "Themes actualizados correctamente.",

            data: themes
        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message
        });
    }
};

export const updateMuralKeywords = async (
    req,
    res
) => {

    try {

        const {
            muralId
        } = req.params;

        const {
            keywordIds
        } = req.body;

        if (!Array.isArray(keywordIds)) {

            return res.status(400).json({
                success: false,
                message: "keywordIds debe ser un array."
            });
        }

        const keywords = await updateMuralKeywordsService(
            muralId,
            keywordIds
        );

        return res.status(200).json({

            success: true,

            message: "Keywords actualizadas correctamente.",

            data: keywords
        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message
        });
    }
};