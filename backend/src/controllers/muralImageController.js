import {
    Mural,
    MuralImage
} from "../models/index.js";

export const getMuralImages = async (req, res) => {
    try {
        const { muralId } = req.params;

        const mural = await Mural.findByPk(muralId);

        if (!mural) {
            return res.status(404).json({
                success: false,
                message: "Mural no encontrado."
            });
        }

        const images = await MuralImage.findAll({
            where: {
                muralId
            },
            order: [
                ["isPrimary", "DESC"],
                ["createdAt", "ASC"]
            ]
        });

        return res.status(200).json({
            success: true,
            data: images
        });

    } catch (error) {
        console.error(
            "Error al obtener imágenes:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "No se pudieron obtener las imágenes."
        });
    }
};

export const createMuralImage = async (req, res) => {
    try {
        const { muralId } = req.params;

        const {
            url,
            caption,
            isPrimary = false
        } = req.body;

        const mural = await Mural.findByPk(muralId);

        if (!mural) {
            return res.status(404).json({
                success: false,
                message: "Mural no encontrado."
            });
        }

        if (!url || url.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "La URL de la imagen es obligatoria."
            });
        }

        const transaction = await MuralImage.sequelize.transaction();

        try {

            if (isPrimary) {
                await MuralImage.update(
                    {
                        isPrimary: false
                    },
                    {
                        where: {
                            muralId
                        },
                        transaction
                    }
                );
            }

            const image = await MuralImage.create(
                {
                    muralId,
                    url: url.trim(),
                    caption,
                    isPrimary
                },
                {
                    transaction
                }
            );

            await transaction.commit();

            return res.status(201).json({
                success: true,
                message: "Imagen agregada correctamente.",
                data: image
            });

        } catch (error) {

            await transaction.rollback();

            throw error;

        }

        return res.status(201).json({
            success: true,
            message: "Imagen agregada correctamente.",
            data: image
        });

        } catch (error) {
            console.error("Error al crear imagen:",error);

            return res.status(500).json({
                success: false,
                message: "No se pudo agregar la imagen."
            });
        }
};

export const deleteMuralImage = async (req, res) => {
    try {
        const {
            muralId,
            imageId
        } = req.params;

        const image = await MuralImage.findOne({
            where: {
                id: imageId,
                muralId
            }
        });

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Imagen no encontrada."
            });
        }

        await image.destroy();

        return res.status(200).json({
            success: true,
            message: "Imagen eliminada correctamente."
        });

    } catch (error) {
        console.error(
            "Error al eliminar imagen:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "No se pudo eliminar la imagen."
        });
    }
};