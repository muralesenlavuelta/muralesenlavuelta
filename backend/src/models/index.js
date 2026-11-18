import Mural from "./Mural.js";
import Author from "./Author.js";
import MuralAuthor from "./MuralAuthor.js";

import Collective from "./Collective.js";
import AuthorCollective from "./AuthorCollective.js";

import Theme from "./Theme.js";
import MuralTheme from "./MuralTheme.js";

import Keyword from "./Keyword.js";
import MuralKeyword from "./MuralKeyword.js";

import Event from "./Event.js";

import MuralImage from "./MuralImage.js";

import User from "./User.js";

import MuralLike from "./MuralLike.js";

import Comment from "./Comment.js";

import MuralAlert from "./MuralAlert.js";
import MuralAlertReport from "./MuralAlertReport.js";

Mural.belongsToMany(Author, {
    through: MuralAuthor,
    foreignKey: "muralId",
    otherKey: "authorId",
    as: "authors"
});

Author.belongsToMany(Mural, {
    through: MuralAuthor,
    foreignKey: "authorId",
    otherKey: "muralId",
    as: "murals"
});

Author.belongsToMany(Collective, {
    through: AuthorCollective,
    foreignKey: "authorId",
    otherKey: "collectiveId",
    as: "collectives"
});

Collective.belongsToMany(Author, {
    through: AuthorCollective,
    foreignKey: "collectiveId",
    otherKey: "authorId",
    as: "authors"
});

Mural.belongsToMany(Theme, {
    through: MuralTheme,
    foreignKey: "muralId",
    otherKey: "themeId",
    as: "themes"
});

Theme.belongsToMany(Mural, {
    through: MuralTheme,
    foreignKey: "themeId",
    otherKey: "muralId",
    as: "murals"
});

Mural.belongsToMany(Keyword, {
    through: MuralKeyword,
    foreignKey: "muralId",
    otherKey: "keywordId",
    as: "keywords"
});

Keyword.belongsToMany(Mural, {
    through: MuralKeyword,
    foreignKey: "keywordId",
    otherKey: "muralId",
    as: "murals"
});

Event.hasMany(Mural, {
    foreignKey: "eventId",
    as: "murals"
});

Mural.belongsTo(Event, {
    foreignKey: "eventId",
    as: "event"
});

Mural.hasMany(MuralImage, {
    foreignKey: "muralId",
    as: "images",
    onDelete: "CASCADE"
});

MuralImage.belongsTo(Mural, {
    foreignKey: "muralId",
    as: "mural"
});

Mural.hasMany(MuralLike, {
    foreignKey: "muralId",
    as: "likes",
    onDelete: "CASCADE"
});

MuralLike.belongsTo(Mural, {
    foreignKey: "muralId",
    as: "mural"
});

User.hasMany(Comment, {
    foreignKey: "userId",
    as: "comments"
});

Comment.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});

Mural.hasMany(Comment, {
    foreignKey: "muralId",
    as: "comments",
    onDelete: "CASCADE"
});

Comment.belongsTo(Mural, {
    foreignKey: "muralId",
    as: "mural"
});

User.hasMany(MuralAlert, {
    foreignKey: "userId",
    as: "alerts"
});

MuralAlert.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});

MuralAlert.hasMany(MuralAlertReport, {
    foreignKey: "alertId",
    as: "reports",
    onDelete: "CASCADE"
});

MuralAlertReport.belongsTo(MuralAlert, {
    foreignKey: "alertId",
    as: "alert"
});

MuralAlertReport.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});

Mural.hasMany(MuralAlert, {
    foreignKey: "muralId",
    as: "alerts",
    onDelete: "CASCADE"
});

MuralAlert.belongsTo(Mural, {
    foreignKey: "muralId",
    as: "mural"
});

export {
    Mural,
    Author,
    MuralAuthor,

    Collective,
    AuthorCollective,

    Comment,

    Theme,
    MuralTheme,

    Keyword,
    MuralKeyword,

    Event,

    MuralImage,

    User,

    MuralLike,
    MuralAlert,
    MuralAlertReport
};
