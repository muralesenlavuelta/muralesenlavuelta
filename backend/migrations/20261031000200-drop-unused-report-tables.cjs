"use strict";

const TABLES_TO_REMOVE = [
    "mural_alert_images",
    "mural_report_images",
    "mural_reports"
];

module.exports = {
    async up(queryInterface) {
        const existingTables = await queryInterface.showAllTables();

        for (const tableName of TABLES_TO_REMOVE) {
            if (!existingTables.includes(tableName)) continue;

            const [rows] = await queryInterface.sequelize.query(
                `SELECT COUNT(*)::int AS count FROM "${tableName}"`
            );

            if (Number(rows[0].count) > 0) {
                throw new Error(
                    `No se puede eliminar ${tableName}: la tabla contiene datos.`
                );
            }
        }

        for (const tableName of TABLES_TO_REMOVE) {
            if (existingTables.includes(tableName)) {
                await queryInterface.dropTable(tableName);
            }
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.createTable("mural_reports", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: { type: Sequelize.STRING(200), allowNull: true },
            description: { type: Sequelize.TEXT, allowNull: true },
            address: { type: Sequelize.STRING(255), allowNull: true },
            latitude: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
            longitude: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
            knownAuthor: { type: Sequelize.STRING(200), allowNull: true },
            additionalInfo: { type: Sequelize.TEXT, allowNull: true },
            status: {
                type: Sequelize.STRING(30),
                allowNull: false,
                defaultValue: "pending"
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" }
            },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });

        await queryInterface.createTable("mural_report_images", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            reportId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "mural_reports", key: "id" },
                onDelete: "CASCADE"
            },
            url: { type: Sequelize.STRING(500), allowNull: false },
            caption: { type: Sequelize.STRING(255), allowNull: true },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });

        await queryInterface.createTable("mural_alert_images", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            alertId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "mural_alerts", key: "id" },
                onDelete: "CASCADE"
            },
            url: { type: Sequelize.STRING(500), allowNull: false },
            caption: { type: Sequelize.STRING(255), allowNull: true },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });
    }
};
