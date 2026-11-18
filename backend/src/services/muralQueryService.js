import {
    Op
} from "sequelize";

import {
    Mural,
    Author,
    Theme,
    Keyword,
    Event,
    MuralImage
} from "../models/index.js";

const likesCountLiteral = () => [
    Mural.sequelize.literal(`(
        SELECT COUNT(*)
        FROM "mural_likes" AS "likes"
        WHERE "likes"."muralId" = "Mural"."id"
    )`),
    "likesCount"
];

const muralIncludes = () => [
    {
        model: Author,
        as: "authors",
        attributes: [
            "id",
            "name",
            "biography",
            "photo"
        ],
        through: {
            attributes: []
        },
        required: false
    },
    {
        model: Theme,
        as: "themes",
        attributes: [
            "id",
            "name"
        ],
        through: {
            attributes: []
        },
        required: false
    },
    {
        model: Keyword,
        as: "keywords",
        attributes: [
            "id",
            "name"
        ],
        through: {
            attributes: []
        },
        required: false
    },
    {
        model: Event,
        as: "event",
        required: false
    },
    {
        model: MuralImage,
        as: "images",
        attributes: [
            "id",
            "url",
            "caption",
            "isPrimary"
        ],
        required: false
    }
];

const getPagination = (page, limit) => {
    const currentPage = Math.max(
        parseInt(page, 10) || 1,
        1
    );

    const itemsPerPage = Math.min(
        Math.max(
            parseInt(limit, 10) || 10,
            1
        ),
        100
    );

    return {
        currentPage,
        itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage
    };
};

const getMuralOrder = (sort) => {
    switch (sort) {
        case "oldest":
            return [["createdAt", "ASC"]];
        case "popular":
            return [
                [likesCountLiteral()[0], "DESC"],
                ["createdAt", "DESC"]
            ];
        case "alphabetical":
            return [["title", "ASC"]];
        case "newest":
        default:
            return [["createdAt", "DESC"]];
    }
};

export const getMuralsService = async (options = {}) => {
    const {
        search,
        year,
        authorId,
        themeId,
        keywordId,
        eventId,
        page = 1,
        limit = 10,
        sort = "newest"
    } = options;

    const {
        currentPage,
        itemsPerPage,
        offset
    } = getPagination(page, limit);

    const where = {};

    if (search && search.trim() !== "") {
        const searchTerm = `%${search.trim()}%`;

        where[Op.or] = [
            {
                title: {
                    [Op.iLike]: searchTerm
                }
            },
            {
                description: {
                    [Op.iLike]: searchTerm
                }
            },
            {
                address: {
                    [Op.iLike]: searchTerm
                }
            }
        ];
    }

    if (year) {
        const parsedYear = parseInt(year, 10);

        if (!Number.isNaN(parsedYear)) {
            where.year = parsedYear;
        }
    }

    const include = muralIncludes();

    if (eventId) {
        where.eventId = Number(eventId);
    }

    if (authorId) {
        include[0].where = {
            id: authorId
        };
        include[0].required = true;
    }

    if (themeId) {
        include[1].where = {
            id: themeId
        };
        include[1].required = true;
    }

    if (keywordId) {
        include[2].where = {
            id: keywordId
        };
        include[2].required = true;
    }

    const result = await Mural.findAndCountAll({
        where,
        include,
        attributes: {
            include: [
                likesCountLiteral()
            ]
        },
        distinct: true,
        order: getMuralOrder(sort),
        limit: itemsPerPage,
        offset
    });

    const totalItems = result.count;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
        murals: result.rows,
        pagination: {
            page: currentPage,
            limit: itemsPerPage,
            totalItems,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1
        }
    };
};

export const getMuralByIdService = async (id) => {
    const mural = await Mural.findByPk(
        id,
        {
            include: muralIncludes(),
            attributes: {
                include: [
                    likesCountLiteral()
                ]
            }
        }
    );

    if (!mural) {
        throw new Error(
            "Mural no encontrado."
        );
    }

    return mural;
};

export const getMuralRankingService = async (limit = 10) => {
    return await Mural.findAll({
        include: muralIncludes(),
        attributes: {
            include: [
                likesCountLiteral()
            ]
        },
        order: [
            [likesCountLiteral()[0], "DESC"],
            ["createdAt", "DESC"]
        ],
        limit
    });
};
