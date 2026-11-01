import { Comment, Mural, User } from "../models/index.js";

const PUBLIC_STATUS = "approved";
const VALID_STATUSES = ["pending", "approved", "rejected"];

export const getCommentsService = async ({ muralId, includeAll = false }) => {
    const where = { muralId };
    if (!includeAll) where.moderationStatus = PUBLIC_STATUS;

    return Comment.findAll({
        where,
        include: [{ model: User, as: "user", attributes: ["id", "username"] }],
        order: [["createdAt", "DESC"]]
    });
};

export const getAllCommentsService = async ({ status } = {}) => {
    const where = status && VALID_STATUSES.includes(status)
        ? { moderationStatus: status }
        : {};

    return Comment.findAll({
        where,
        include: [
            { model: User, as: "user", attributes: ["id", "username", "email"] },
            { model: Mural, as: "mural", attributes: ["id", "name"] }
        ],
        order: [["createdAt", "DESC"]]
    });
};

export const createCommentService = async ({ muralId, userId, content }) => {
    const mural = await Mural.findByPk(muralId);
    if (!mural) throw new Error("Mural no encontrado.");

    if (typeof content !== "string" || content.trim().length < 1 || content.trim().length > 2000) {
        throw new Error("El comentario debe tener entre 1 y 2000 caracteres.");
    }

    return Comment.create({
        muralId,
        userId,
        content: content.trim(),
        moderationStatus: "pending"
    });
};

export const updateCommentService = async ({ id, userId, isAdmin, content }) => {
    const comment = await Comment.findByPk(id);
    if (!comment) throw new Error("Comentario no encontrado.");
    if (!isAdmin && comment.userId !== userId) throw new Error("No tienes permiso para editar este comentario.");
    if (typeof content !== "string" || content.trim().length < 1 || content.trim().length > 2000) {
        throw new Error("El comentario debe tener entre 1 y 2000 caracteres.");
    }

    await comment.update({ content: content.trim(), moderationStatus: isAdmin ? comment.moderationStatus : "pending" });
    return comment;
};

export const deleteCommentService = async ({ id, userId, isAdmin }) => {
    const comment = await Comment.findByPk(id);
    if (!comment) throw new Error("Comentario no encontrado.");
    if (!isAdmin && comment.userId !== userId) throw new Error("No tienes permiso para eliminar este comentario.");
    await comment.destroy();
};

export const moderateCommentService = async ({ id, moderationStatus }) => {
    if (!VALID_STATUSES.includes(moderationStatus)) throw new Error("Estado de moderación inválido.");
    const comment = await Comment.findByPk(id);
    if (!comment) throw new Error("Comentario no encontrado.");
    await comment.update({ moderationStatus });
    return comment;
};
