import {
    getMuralLikeCountService,
    likeMuralService,
    getMuralVoteStatusService
} from "../services/muralLikeService.js";

export const getMuralLikeCount = async (
    req,
    res
) => {

    try {

        const count =
            await getMuralLikeCountService(
                req.params.muralId
            );

        return res.status(200).json({

            success: true,

            data: {
                count
            }
        });

    } catch (error) {

        const status = error.message === "Mural no encontrado." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};

export const likeMural = async (
    req,
    res
) => {

    try {

        const {
            muralId
        } = req.params;

        const {
            voterToken
        } = req.body;

        await likeMuralService(
            muralId,
            voterToken
        );

        const count = await getMuralLikeCountService(muralId);

        return res.status(201).json({

            success: true,

            message: "Voto registrado correctamente.",

            data: {
                count
            }
        });

    } catch (error) {

        const status = error.message === "Mural no encontrado." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};

export const getMuralVoteStatus = async (
    req,
    res
) => {

    try {

        const {
            muralId
        } = req.params;

        const {
            voterToken
        } = req.query;

        const hasVoted = await getMuralVoteStatusService(
            muralId,
            voterToken
        );

        return res.status(200).json({

            success: true,

            data: {
                hasVoted
            }
        });

    } catch (error) {

        const status = error.message === "Mural no encontrado." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};