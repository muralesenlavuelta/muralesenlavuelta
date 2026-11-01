import {
    getThemesService,
    getThemeByIdService,
    createThemeService,
    updateThemeService,
    deleteThemeService
} from "../services/themeService.js";

export const getThemes = async (
    req,
    res
) => {

    try {

        const themes = await getThemesService();

        return res.status(200).json({
            success: true,
            data: themes
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "No se pudieron obtener las temáticas."
        });
    }
};

export const getThemeById = async (
    req,
    res
) => {

    try {

        const theme = await getThemeByIdService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: theme
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const createTheme = async (
    req,
    res
) => {

    try {

        const theme = await createThemeService(
            req.body
        );

        return res.status(201).json({

            success: true,

            message: "Temática creada correctamente.",

            data: theme
        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message
        });
    }
};

export const updateTheme = async (
    req,
    res
) => {

    try {

        const theme = await updateThemeService(
            req.params.id,
            req.body
        );

        return res.status(200).json({

            success: true,

            message: "Temática actualizada correctamente.",

            data: theme
        });

    } catch (error) {

        const status = error.message === "Temática no encontrada." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};


export const deleteTheme = async (
    req,
    res
) => {

    try {

        await deleteThemeService(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            message: "Temática eliminada correctamente."
        });

    } catch (error) {

        const status = error.message === "Temática no encontrada." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};