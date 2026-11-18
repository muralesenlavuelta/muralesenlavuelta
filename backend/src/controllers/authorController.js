import {
    getAuthorsService,
    getAuthorByIdService,
    createAuthorService,
    updateAuthorService,
    deleteAuthorService
} from "../services/authorService.js";

export const getAuthors = async (
    req,
    res
) => {

    try {

        const authors = await getAuthorsService();


        return res.status(200).json({

            success: true,

            data: authors
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "No se pudieron obtener los autores."
        });
    }
};

export const getAuthorById = async (
    req,
    res
) => {

    try {

        const author = await getAuthorByIdService(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            data: author
        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message
        });
    }
};

export const createAuthor = async (
    req,
    res
) => {

    try {

        const author = await createAuthorService(
            req.body
        );

        return res.status(201).json({

            success: true,

            message: "Autor creado correctamente.",

            data: author
        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message
        });
    }
};

export const updateAuthor = async (
    req,
    res
) => {

    try {

        const author = await updateAuthorService(
            req.params.id,
            req.body
        );

        return res.status(200).json({

            success: true,

            message: "Autor actualizado correctamente.",

            data: author
        });

    } catch (error) {

        const status = error.message === "Autor no encontrado." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};

export const deleteAuthor = async (
    req,
    res
) => {

    try {

        await deleteAuthorService(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            message: "Autor eliminado correctamente."
        });

    } catch (error) {

        const status = error.message === "Autor no encontrado." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};