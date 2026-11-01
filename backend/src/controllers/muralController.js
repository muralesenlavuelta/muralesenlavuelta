import {
    createMuralService,
    updateMuralService,
    deleteMuralService
} from "../services/muralService.js";

import {
    getMuralsService,
    getMuralByIdService,
    getMuralRankingService
} from "../services/muralQueryService.js";

import {
    likeMuralService,
    unlikeMuralService,
    getMuralLikesService
} from "../services/muralLikeService.js";

export const getMurals = async (req, res) => {

    try {

        const {
            search,
            year,
            authorId,
            themeId,
            keywordId,
            eventId,
            page,
            limit,
            sort
        } = req.query;

        const result = await getMuralsService({
            search,
            year,
            authorId,
            themeId,
            keywordId,
            eventId,
            page,
            limit,
            sort
        });

        return res.status(200).json({

            success: true,

            data: result.murals,

            pagination: result.pagination
        });

    } catch (error) {

        console.error(
            "Error al obtener murales:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "No se pudieron obtener los murales."
        });
    }
};

export const getMuralById = async (
    req,
    res
) => {

    try {

        const mural = await getMuralByIdService(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            data: mural
        });

    } catch (error) {

        const status = error.message === "Mural no encontrado." ? 404 : 500;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};

export const createMural = async (req, res) => {

    try {

        const {
            name,
            description,
            address,
            latitude,
            longitude,
            year,
            dimensions,
            historicalInfo,
            authorIds,
            themeIds,
            keywordIds,
            eventId
        } = req.body;

        if (!name || name.trim() === "") {

            return res.status(400).json({
                success: false,
                message: "El título del mural es obligatorio."
            });
        }

        if (authorIds !== undefined && !Array.isArray(authorIds)) {

            return res.status(400).json({
                success: false,
                message: "authorIds debe ser un array."
            });
        }

        if (themeIds !== undefined && !Array.isArray(themeIds)) {

            return res.status(400).json({
                success: false,
                message: "themeIds debe ser un array."
            });
        }

        if (keywordIds !== undefined && !Array.isArray(keywordIds)) {

            return res.status(400).json({
                success: false,
                message: "keywordIds debe ser un array."
            });
        }

        const mural = await createMuralService({
            name: name.trim(),
            description,
            address,
            latitude,
            longitude,
            year,
            dimensions,
            historicalInfo,
            authorIds,
            themeIds,
            keywordIds,
            eventId
        });

        return res.status(201).json({

            success: true,

            message: "Mural creado correctamente.",

            data: mural
        });

    } catch (error) {

        console.error(
            "Error al crear mural:",
            error
        );

        return res.status(400).json({

            success: false,

            message: error.message
        });
    }
};

export const updateMural = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;

        const mural = await updateMuralService(
            id,
            req.body
        );

        return res.status(200).json({

            success: true,

            message: "Mural actualizado correctamente.",

            data: mural
        });


    } catch (error) {

        console.error(
            "Error al actualizar mural:",
            error
        );

        const status = error.message === "Mural no encontrado." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};

export const deleteMural = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;

        await deleteMuralService(id);

        return res.status(200).json({

            success: true,

            message: "Mural eliminado correctamente."
        });

    } catch (error) {

        console.error(
            "Error al eliminar mural:",
            error
        );

        const status = error.message === "Mural no encontrado." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};

export const getMuralRanking = async (
    req,
    res
) => {

    try {

        let limit = Number(req.query.limit) || 10;

        if (limit < 1) {
            limit = 1;
        }

        if (limit > 100) {
            limit = 100;
        }

        const murals = await getMuralRankingService(
            limit
        );

        return res.status(200).json({

            success: true,

            data: murals
        });

    } catch (error) {

        console.error(
            "Error al obtener ranking de murales:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "No se pudo obtener el ranking de murales."
        });
    }
};

export const likeMural = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;

        const {
            voterToken
        } = req.body;

        const result = await likeMuralService(
            id,
            voterToken
        );

        return res.status(201).json({

            success: true,

            message: "Like agregado correctamente.",

            data: {

                likesCount: result.likesCount
            }
        });

    } catch (error) {

        console.error(
            "Error al dar like:",
            error
        );

        let status = 400;

        if (
            error.message === "Mural no encontrado."
        ) {

            status = 404;
        }

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};

export const unlikeMural = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;

        const {
            voterToken
        } = req.body;

        const result = await unlikeMuralService(
            id,
            voterToken
        );

        return res.status(200).json({

            success: true,

            message: "Like eliminado correctamente.",

            data: {

                likesCount: result.likesCount
            }
        });

    } catch (error) {

        console.error(
            "Error al quitar like:",
            error
        );

        let status = 400;

        if (
            error.message === "Mural no encontrado."
        ) {

            status = 404;
        }

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};

export const getMuralLikes = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;

        const {
            voterToken
        } = req.query;

        const result = await getMuralLikesService(
            id,
            voterToken
        );

        return res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        console.error(
            "Error al obtener likes:",
            error
        );

        const status = error.message === "Mural no encontrado." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message

        });
    }
};