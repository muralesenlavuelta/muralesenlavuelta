import {
    createMuralAlertReportService,
    createMissingMuralReportService,
    getMuralAlertsService,
    updateMuralAlertStatusService
} from "../services/muralAlertService.js";

const errorStatus = (error) => {
    if (error.message.includes("encontrado")) return 404;
    if (
        error.message.includes("no es válido") ||
        error.message.includes("no puede superar") ||
        error.message.includes("ubicación") ||
        error.message.includes("coordenadas") ||
        error.message.includes("Ingresá") ||
        error.message.includes("Indicá") ||
        error.message.includes("Seleccioná")
    ) return 400;
    return 500;
};

const handleError = (res, error, context) => {
    const status = errorStatus(error);

    if (status === 500) {
        console.error(context, error);
        return res.status(status).json({
            success: false,
            message: "No se pudo completar la operación."
        });
    }

    return res.status(status).json({
        success: false,
        message: error.message
    });
};

export const createMuralAlertReport = async (req, res) => {
    try {
        const report = await createMuralAlertReportService({
            muralId: req.params.muralId,
            userId: req.user.id,
            type: req.body.type,
            description: req.body.description
        });

        return res.status(201).json({
            success: true,
            message: "El problema fue reportado correctamente.",
            data: report
        });
    } catch (error) {
        return handleError(res, error, "Error al registrar un reporte de mural:");
    }
};

export const createMissingMuralReport = async (req, res) => {
    try {
        const report = await createMissingMuralReportService({
            userId: req.user.id,
            muralName: req.body.muralName,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            description: req.body.description
        });

        return res.status(201).json({
            success: true,
            message: "El mural faltante fue reportado correctamente.",
            data: report
        });
    } catch (error) {
        return handleError(res, error, "Error al registrar un mural faltante:");
    }
};

export const getMuralAlerts = async (req, res) => {
    try {
        const alerts = await getMuralAlertsService(req.query.status || "pending");
        return res.status(200).json({ success: true, data: alerts });
    } catch (error) {
        return handleError(res, error, "Error al obtener los reportes de murales:");
    }
};

export const updateMuralAlertStatus = async (req, res) => {
    try {
        const alert = await updateMuralAlertStatusService({
            id: req.params.id,
            status: req.body.status
        });

        return res.status(200).json({
            success: true,
            message: "El estado del problema fue actualizado.",
            data: alert
        });
    } catch (error) {
        return handleError(res, error, "Error al actualizar el estado de un reporte:");
    }
};
