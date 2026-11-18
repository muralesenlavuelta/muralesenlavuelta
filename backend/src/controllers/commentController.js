import {
    createCommentService,
    deleteCommentService,
    getAllCommentsService,
    getCommentsService,
    moderateCommentService,
    updateCommentService
} from "../services/commentService.js";

const errorStatus = (error) => {
    if (error.message.includes("no encontrado")) return 404;
    if (error.message.includes("permiso")) return 403;
    return 400;
};

export const getMuralComments = async (req, res) => {
    try {
        const comments = await getCommentsService({ muralId: req.params.muralId });
        return res.status(200).json({ success: true, data: comments });
    } catch (error) {
        return res.status(500).json({ success: false, message: "No se pudieron obtener los comentarios." });
    }
};

export const createComment = async (req, res) => {
    try {
        const comment = await createCommentService({ muralId: req.params.muralId, userId: req.user.id, content: req.body.content });
        return res.status(201).json({ success: true, message: "Comentario enviado a moderación.", data: comment });
    } catch (error) {
        return res.status(errorStatus(error)).json({ success: false, message: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const comment = await updateCommentService({ id: req.params.id, userId: req.user.id, isAdmin: req.user.role === "admin", content: req.body.content });
        return res.status(200).json({ success: true, message: "Comentario actualizado.", data: comment });
    } catch (error) {
        return res.status(errorStatus(error)).json({ success: false, message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        await deleteCommentService({ id: req.params.id, userId: req.user.id, isAdmin: req.user.role === "admin" });
        return res.status(200).json({ success: true, message: "Comentario eliminado." });
    } catch (error) {
        return res.status(errorStatus(error)).json({ success: false, message: error.message });
    }
};

export const getAllComments = async (req, res) => {
    try {
        const comments = await getAllCommentsService({ status: req.query.status });
        return res.status(200).json({ success: true, data: comments });
    } catch (error) {
        return res.status(500).json({ success: false, message: "No se pudieron obtener los comentarios." });
    }
};

export const moderateComment = async (req, res) => {
    try {
        const comment = await moderateCommentService({ id: req.params.id, moderationStatus: req.body.moderationStatus });
        return res.status(200).json({ success: true, message: "Estado de comentario actualizado.", data: comment });
    } catch (error) {
        return res.status(errorStatus(error)).json({ success: false, message: error.message });
    }
};
