import {
    getKeywordsService,
    getKeywordByIdService,
    createKeywordService,
    updateKeywordService,
    deleteKeywordService
} from "../services/keywordService.js";

export const getKeywords = async (
    req,
    res
) => {

    try {

        const keywords = await getKeywordsService();

        return res.status(200).json({
            success: true,
            data: keywords
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "No se pudieron obtener las keywords."
        });
    }
};

export const getKeywordById = async (
    req,
    res
) => {

    try {

        const keyword = await getKeywordByIdService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: keyword
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const createKeyword = async (
    req,
    res
) => {

    try {

        const keyword = await createKeywordService(
            req.body
        );

        return res.status(201).json({

            success: true,

            message: "Keyword creada correctamente.",

            data: keyword
        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message
        });
    }
};

export const updateKeyword = async (
    req,
    res
) => {

    try {

        const keyword = await updateKeywordService(
            req.params.id,
            req.body
        );

        return res.status(200).json({

            success: true,

            message: "Keyword actualizada correctamente.",

            data: keyword
        });

    } catch (error) {

        const status = error.message === "Keyword no encontrada." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};

export const deleteKeyword = async (
    req,
    res
) => {

    try {

        await deleteKeywordService(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            message: "Keyword eliminada correctamente."
        });

    } catch (error) {

        const status = error.message === "Keyword no encontrada." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};