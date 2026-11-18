import crypto from "crypto";

export const createVoterToken = async (
    req,
    res
) => {

    const voterToken = crypto.randomUUID();


    return res.status(200).json({

        success: true,

        data: {
            voterToken
        }
    });
};