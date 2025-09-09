'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Buscar a primeira empresa (companyId = 1)
    const companies = await queryInterface.sequelize.query(
      'SELECT id FROM "Companies" LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (companies.length === 0) {
      console.log('No companies found, skipping product seed');
      return;
    }

    const companyId = companies[0].id;

    await queryInterface.bulkInsert('Products', [
      {
        name: 'Smartphone Galaxy S23',
        description: 'Smartphone Samsung Galaxy S23 com 128GB, tela 6.1", câmera tripla e processador Snapdragon 8 Gen 2',
        price: 3999.99,
        currency: 'BRL',
        sku: 'SAMS23-128',
        category: 'Smartphones',
        stock: 15,
        active: true,
        imageUrl: 'https://example.com/galaxy-s23.jpg',
        companyId: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Notebook Dell Inspiron 15',
        description: 'Notebook Dell Inspiron 15 polegadas, Intel i5, 8GB RAM, 256GB SSD, Windows 11',
        price: 2899.99,
        currency: 'BRL',
        sku: 'DELL-INS15',
        category: 'Notebooks',
        stock: 8,
        active: true,
        imageUrl: 'https://example.com/dell-inspiron.jpg',
        companyId: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fone de Ouvido Bluetooth',
        description: 'Fone de ouvido sem fio com cancelamento de ruído, bateria de 20h, compatível com Alexa',
        price: 299.99,
        currency: 'BRL',
        sku: 'FONE-BT-001',
        category: 'Acessórios',
        stock: 25,
        active: true,
        imageUrl: 'https://example.com/fone-bluetooth.jpg',
        companyId: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mouse Gamer RGB',
        description: 'Mouse gamer com sensor óptico de 12.000 DPI, 7 botões programáveis e iluminação RGB',
        price: 159.99,
        currency: 'BRL',
        sku: 'MOUSE-GAMER-001',
        category: 'Periféricos',
        stock: 30,
        active: true,
        imageUrl: 'https://example.com/mouse-gamer.jpg',
        companyId: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Webcam Full HD',
        description: 'Webcam com resolução Full HD 1080p, microfone integrado, compatível com PC e Mac',
        price: 199.99,
        currency: 'BRL',
        sku: 'WEBCAM-FHD-001',
        category: 'Periféricos',
        stock: 12,
        active: true,
        imageUrl: 'https://example.com/webcam-fhd.jpg',
        companyId: companyId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
