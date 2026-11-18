import {
    Event,
    Mural
} from "../models/index.js";

export const getEventsService = async () => {

    return await Event.findAll({
        include: [
            {
                model: Mural,
                as: "murals",
                attributes: [
                    "id",
                    "name"
                ],
                required: false
            }
        ],
        order: [
            ["startDate", "DESC"],
            ["name", "ASC"]
        ]
    });
};

export const getEventByIdService = async (
    id
) => {

    const event = await Event.findByPk(id, {
        include: [
            {
                model: Mural,
                as: "murals",
                attributes: [
                    "id",
                    "name"
                ],
                required: false
            }
        ]
    });

    if (!event) {

        throw new Error(
            "Evento no encontrado."
        );
    }

    return event;
};

export const createEventService = async (
    data
) => {

    const {
        name,
        description,
        startDate,
        endDate,
        location,
        organizer,
        additionalInfo
    } = data;

    if (!name || name.trim() === "") {

        throw new Error(
            "El nombre del evento es obligatorio."
        );
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {

        throw new Error(
            "La fecha de finalización no puede ser anterior a la fecha de inicio."
        );
    }

    const event = await Event.create({

        name: name.trim(),

        description: description || null,

        startDate: startDate || null,

        endDate: endDate || null,

        location: location || null,

        organizer: organizer || null,

        additionalInfo: additionalInfo || null
    });

    return event;
};

export const updateEventService = async (
    id,
    data
) => {

    const event = await Event.findByPk(id);

    if (!event) {

        throw new Error(
            "Evento no encontrado."
        );
    }

    const allowedFields = [
        "name",
        "description",
        "startDate",
        "endDate",
        "location",
        "organizer",
        "additionalInfo"
    ];

    const updateData = {};

    for (const field of allowedFields) {

        if (data[field] !== undefined) {

            updateData[field] = data[field];
        }
    }

    if (updateData.name !== undefined) {

        if (!updateData.name || updateData.name.trim() === "") {

            throw new Error(
                "El nombre del evento no puede estar vacío."
            );
        }


        updateData.name = updateData.name.trim();
    }

    const finalStartDate = updateData.startDate !== undefined ? updateData.startDate : event.startDate;

    const finalEndDate = updateData.endDate !== undefined ? updateData.endDate : event.endDate;

    if (finalStartDate && finalEndDate && new Date(finalEndDate) < new Date(finalStartDate)) {

        throw new Error(
            "La fecha de finalización no puede ser anterior a la fecha de inicio."
        );
    }

    await event.update(
        updateData
    );

    return event;
};

export const deleteEventService = async (
    id
) => {

    const event = await Event.findByPk(id);

    if (!event) {

        throw new Error(
            "Evento no encontrado."
        );
    }

    await Mural.update(
        {
            eventId: null
        },
        {
            where: {
                eventId: id
            }
        }
    );

    await event.destroy();

    return true;
};