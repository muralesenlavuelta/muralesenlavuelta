import {
    Mural,
    Author,
    Theme,
    Keyword,
    Event
} from "../models/index.js";

const findRelations = async (Model, ids, errorMessage) => {
    if (ids.length === 0) {
        return [];
    }

    const records = await Model.findAll({
        where: {
            id: ids
        }
    });

    if (records.length !== ids.length) {
        throw new Error(errorMessage);
    }

    return records;
};

const validateEvent = async (eventId) => {
    if (eventId === null) {
        return;
    }

    const event = await Event.findByPk(eventId);

    if (!event) {
        throw new Error(
            "El evento indicado no existe."
        );
    }
};

export const createMuralService = async (data) => {
    const {
        name,
        description,
        address,
        latitude,
        longitude,
        year,
        dimensions,
        historicalInfo,
        authorIds = [],
        themeIds = [],
        keywordIds = [],
        eventId = null
    } = data;

    const [authors, themes, keywords] = await Promise.all([
        findRelations(
            Author,
            authorIds,
            "Uno o más autores no existen."
        ),
        findRelations(
            Theme,
            themeIds,
            "Una o más temáticas no existen."
        ),
        findRelations(
            Keyword,
            keywordIds,
            "Una o más keywords no existen."
        )
    ]);

    await validateEvent(eventId);

    const transaction = await Mural.sequelize.transaction();

    try {
        const mural = await Mural.create(
            {
                name,
                description,
                address,
                latitude,
                longitude,
                year,
                dimensions,
                historicalInfo,
                eventId
            },
            {
                transaction
            }
        );

        if (authors.length > 0) {
            await mural.setAuthors(authors, {
                transaction
            });
        }

        if (themes.length > 0) {
            await mural.setThemes(themes, {
                transaction
            });
        }

        if (keywords.length > 0) {
            await mural.setKeywords(keywords, {
                transaction
            });
        }

        await transaction.commit();

        return mural;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const updateMuralService = async (id, data) => {
    const mural = await Mural.findByPk(id);

    if (!mural) {
        throw new Error(
            "Mural no encontrado."
        );
    }

    const allowedFields = [
        "title",
        "description",
        "address",
        "latitude",
        "longitude",
        "year",
        "dimensions",
        "historicalInfo",
        "eventId"
    ];

    const updateData = {};

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updateData[field] = data[field];
        }
    }

    if (updateData.title !== undefined) {
        if (!updateData.title || updateData.title.trim() === "") {
            throw new Error(
                "El título no puede estar vacío."
            );
        }

        updateData.title = updateData.title.trim();
    }

    if (updateData.eventId !== undefined && updateData.eventId !== null) {
        await validateEvent(updateData.eventId);
    }

    await mural.update(updateData);

    return mural;
};

export const deleteMuralService = async (id) => {
    const mural = await Mural.findByPk(id);

    if (!mural) {
        throw new Error(
            "Mural no encontrado."
        );
    }

    await mural.destroy();

    return true;
};
