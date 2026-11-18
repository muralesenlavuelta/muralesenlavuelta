import {
    Mural,
    MuralLike
} from "../models/index.js";

const findMuralOrThrow = async (muralId) => {
    const mural = await Mural.findByPk(muralId);

    if (!mural) {
        throw new Error(
            "Mural no encontrado."
        );
    }

    return mural;
};

const validateVoterToken = (voterToken) => {
    if (!voterToken || voterToken.trim() === "") {
        throw new Error(
            "El voterToken es obligatorio."
        );
    }
};

const countLikes = (muralId) => MuralLike.count({
    where: {
        muralId
    }
});

export const getMuralLikeCountService = async (muralId) => {
    await findMuralOrThrow(muralId);
    return await countLikes(muralId);
};

export const likeMuralService = async (muralId, voterToken) => {
    await findMuralOrThrow(muralId);
    validateVoterToken(voterToken);

    const existingLike = await MuralLike.findOne({
        where: {
            muralId,
            voterToken
        }
    });

    if (existingLike) {
        throw new Error(
            "Ya has dado like a este mural."
        );
    }

    const like = await MuralLike.create({
        muralId,
        voterToken
    });

    return {
        like,
        likesCount: await countLikes(muralId)
    };
};

export const unlikeMuralService = async (muralId, voterToken) => {
    await findMuralOrThrow(muralId);
    validateVoterToken(voterToken);

    const like = await MuralLike.findOne({
        where: {
            muralId,
            voterToken
        }
    });

    if (!like) {
        throw new Error(
            "No has dado like a este mural."
        );
    }

    await like.destroy();

    return {
        likesCount: await countLikes(muralId)
    };
};

export const getMuralLikesService = async (
    muralId,
    voterToken = null
) => {
    const mural = await findMuralOrThrow(muralId);
    const likesCount = await countLikes(muralId);

    let hasLiked = false;

    if (voterToken && voterToken.trim() !== "") {
        const existingLike = await MuralLike.findOne({
            where: {
                muralId,
                voterToken
            }
        });

        hasLiked = Boolean(existingLike);
    }

    return {
        muralId: mural.id,
        likesCount,
        hasLiked
    };
};

export const getMuralVoteStatusService = async (
    muralId,
    voterToken
) => {
    await findMuralOrThrow(muralId);

    if (!voterToken) {
        return false;
    }

    const like = await MuralLike.findOne({
        where: {
            muralId,
            voterToken
        }
    });

    return Boolean(like);
};
