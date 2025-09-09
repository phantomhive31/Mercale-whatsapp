import { QueryInterface, DataTypes, QueryTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Adicionar configuração priceBotEnabled para todas as empresas existentes
    const companies = await queryInterface.sequelize.query(
      'SELECT id FROM "Companies"',
      { type: QueryTypes.SELECT }
    );

    for (const company of companies as any[]) {
      await queryInterface.sequelize.query(
        `INSERT INTO "Settings" ("key", "value", "companyId", "createdAt", "updatedAt")
         SELECT 'priceBotEnabled', 'disabled', ${company.id}, NOW(), NOW()
         WHERE NOT EXISTS (
           SELECT 1 FROM "Settings" 
           WHERE "key" = 'priceBotEnabled' AND "companyId" = ${company.id}
         )`
      );
    }
  },

  down: async (queryInterface: QueryInterface) => {
    // Remover configuração priceBotEnabled
    await queryInterface.sequelize.query(
      'DELETE FROM "Settings" WHERE "key" = \'priceBotEnabled\''
    );
  }
};

