import sequelize from "../config/database.js";
import { Mural, MuralAlert, MuralAlertReport, User } from "../models/index.js";

export const MURAL_ALERT_TYPES = ["damaged", "changed"];
export const MURAL_ALERT_STATUSES = ["pending", "resolved"];

export const createMuralAlertReportService = async ({ muralId, userId, type, description }) => {
    if (!MURAL_ALERT_TYPES.includes(type)) {
        throw new Error("El tipo de problema indicado no es válido.");
    }

    if (description !== undefined && description !== null && (typeof description !== "string" || description.trim().length > 1000)) {
        throw new Error("La descripción no puede superar los 1000 caracteres.");
    }

    const transaction = await sequelize.transaction();

    try {
        const mural = await Mural.findByPk(muralId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!mural) {
            throw new Error("Mural no encontrado.");
        }

        const alert = await MuralAlert.findOne({
            where: { muralId: mural.id, type, status: "pending" },
            transaction
        });

        if (!alert) {
            const newAlert = await MuralAlert.create({
                type,
                description: description?.trim() || null,
                address: mural.address,
                latitude: mural.latitude,
                longitude: mural.longitude,
                userId,
                muralId: mural.id
            }, { transaction });

            await MuralAlertReport.create({
                alertId: newAlert.id,
                userId,
                description: description?.trim() || null
            }, { transaction });

            await transaction.commit();
            return { alertId: newAlert.id, reportCount: 1 };
        }

        await MuralAlertReport.create({
            alertId: alert.id,
            userId,
            description: description?.trim() || null
        }, { transaction });

        const reportCount = await MuralAlertReport.count({
            where: { alertId: alert.id },
            transaction
        });

        await transaction.commit();

        return {
            alertId: alert.id,
            reportCount
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const createMissingMuralReportService = async ({
    userId,
    muralName,
    address,
    latitude,
    longitude,
    description
}) => {
    if (typeof muralName !== "string" || muralName.trim().length < 1 || muralName.trim().length > 150) {
        throw new Error("Ingresá una referencia de hasta 150 caracteres para identificar el mural.");
    }

    if (address !== undefined && address !== null && (typeof address !== "string" || address.trim().length > 255)) {
        throw new Error("La ubicación escrita no puede superar los 255 caracteres.");
    }

    if (description !== undefined && description !== null && (typeof description !== "string" || description.trim().length > 1000)) {
        throw new Error("La descripción no puede superar los 1000 caracteres.");
    }

    const hasLatitude = latitude !== undefined && latitude !== null && String(latitude).trim() !== "";
    const hasLongitude = longitude !== undefined && longitude !== null && String(longitude).trim() !== "";
    if (hasLatitude !== hasLongitude) {
        throw new Error("Seleccioná el punto en el mapa para guardar sus coordenadas.");
    }

    const parsedLatitude = hasLatitude ? Number(latitude) : null;
    const parsedLongitude = hasLongitude ? Number(longitude) : null;
    if (
        (hasLatitude && (!Number.isFinite(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90)) ||
        (hasLongitude && (!Number.isFinite(parsedLongitude) || parsedLongitude < -180 || parsedLongitude > 180))
    ) {
        throw new Error("Las coordenadas de la ubicación no son válidas.");
    }

    const normalizedAddress = address?.trim() || null;
    if (!normalizedAddress && !hasLatitude) {
        throw new Error("Indicá una dirección o seleccioná la ubicación en el mapa.");
    }

    const transaction = await sequelize.transaction();

    try {
        const alert = await MuralAlert.create({
            type: "missing",
            muralName: muralName.trim(),
            description: description?.trim() || null,
            address: normalizedAddress,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            userId,
            muralId: null
        }, { transaction });

        await MuralAlertReport.create({
            alertId: alert.id,
            userId,
            description: description?.trim() || null
        }, { transaction });

        await transaction.commit();
        return { alertId: alert.id, reportCount: 1 };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const getMuralAlertsService = async (status = "pending") => {
    if (status !== "all" && !MURAL_ALERT_STATUSES.includes(status)) {
        throw new Error("El estado indicado no es válido.");
    }

    const alerts = await MuralAlert.findAll({
        where: status === "all" ? {} : { status },
        include: [
            { model: Mural, as: "mural", attributes: ["id", "name", "address"] },
            {
                model: MuralAlertReport,
                as: "reports",
                attributes: ["id", "description", "createdAt"],
                include: [{ model: User, as: "user", attributes: ["id", "username"] }]
            }
        ],
        order: [["updatedAt", "DESC"]]
    });

    return alerts.map((alert) => ({
        ...alert.toJSON(),
        reportCount: alert.reports.length
    }));
};

export const updateMuralAlertStatusService = async ({ id, status }) => {
    if (!MURAL_ALERT_STATUSES.includes(status)) {
        throw new Error("El estado indicado no es válido.");
    }

    const alert = await MuralAlert.findByPk(id);
    if (!alert) {
        throw new Error("El problema reportado no fue encontrado.");
    }

    await alert.update({ status });
    return alert;
};
