"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const columns = await queryInterface.describeTable("murals");

        if (!columns.year) {
            await queryInterface.addColumn("murals", "year", {
                type: Sequelize.INTEGER,
                allowNull: true
            });
        }
    },

    async down(queryInterface) {
        const columns = await queryInterface.describeTable("murals");

        if (columns.year) {
            await queryInterface.removeColumn("murals", "year");
        }
    }
};
