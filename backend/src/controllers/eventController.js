import {
    getEventsService,
    getEventByIdService,
    createEventService,
    updateEventService,
    deleteEventService
} from "../services/eventService.js";

export const getEvents = async (
    req,
    res
) => {

    try {

        const events = await getEventsService();

        return res.status(200).json({

            success: true,

            data: events
        });

    } catch (error) {

        console.error(
            "Error al obtener eventos:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "No se pudieron obtener los eventos."
        });
    }
};

export const getEventById = async (
    req,
    res
) => {

    try {

        const event = await getEventByIdService(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            data: event
        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message
        });
    }
};

export const createEvent = async (
    req,
    res
) => {

    try {

        const event = await createEventService(
            req.body
        );

        return res.status(201).json({

            success: true,

            message: "Evento creado correctamente.",

            data: event
        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message
        });
    }
};

export const updateEvent = async (
    req,
    res
) => {

    try {

        const event = await updateEventService(
            req.params.id,
            req.body
        );

        return res.status(200).json({

            success: true,

            message: "Evento actualizado correctamente.",

            data: event
        });

    } catch (error) {

        const status = error.message === "Evento no encontrado." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};

export const deleteEvent = async (
    req,
    res
) => {

    try {

        await deleteEventService(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            message: "Evento eliminado correctamente."
        });

    } catch (error) {

        const status = error.message === "Evento no encontrado." ? 404 : 400;

        return res.status(status).json({

            success: false,

            message: error.message
        });
    }
};