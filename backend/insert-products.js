const { Sequelize } = require('sequelize');

// Configuração do banco
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'ticketz',
  password: 'strongpassword',
  database: 'ticketz',
  logging: false
});

// Definir modelo Product
const Product = sequelize.define('Product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: Sequelize.STRING(3),
    defaultValue: 'BRL'
  },
  sku: {
    type: Sequelize.STRING
  },
  category: {
    type: Sequelize.STRING
  },
  stock: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  imageUrl: {
    type: Sequelize.STRING
  },
  companyId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Products',
  timestamps: true
});

// Produtos de cesta básica
const products = [
  {
    name: 'Arroz Branco Tipo 1',
    description: 'Arroz branco tipo 1, grãos longos e soltos, pacote 5kg',
    price: 12.90,
    currency: 'BRL',
    sku: 'ARROZ-001',
    category: 'Grãos e Cereais',
    stock: 100,
    active: true,
    companyId: 1
  },
  {
    name: 'Feijão Carioca',
    description: 'Feijão carioca tipo 1, selecionado, pacote 1kg',
    price: 8.50,
    currency: 'BRL',
    sku: 'FEIJAO-001',
    category: 'Grãos e Cereais',
    stock: 150,
    active: true,
    companyId: 1
  },
  {
    name: 'Açúcar Cristal',
    description: 'Açúcar cristal especial, pacote 1kg',
    price: 4.90,
    currency: 'BRL',
    sku: 'ACUCAR-001',
    category: 'Açúcar e Adoçantes',
    stock: 200,
    active: true,
    companyId: 1
  },
  {
    name: 'Óleo de Soja',
    description: 'Óleo de soja refinado, garrafa 900ml',
    price: 6.30,
    currency: 'BRL',
    sku: 'OLEO-001',
    category: 'Óleos e Azeites',
    stock: 80,
    active: true,
    companyId: 1
  },
  {
    name: 'Sal Refinado',
    description: 'Sal refinado iodado, pacote 1kg',
    price: 2.20,
    currency: 'BRL',
    sku: 'SAL-001',
    category: 'Temperos e Condimentos',
    stock: 120,
    active: true,
    companyId: 1
  },
  {
    name: 'Macarrão Espaguete',
    description: 'Macarrão espaguete sêmola, pacote 500g',
    price: 3.80,
    currency: 'BRL',
    sku: 'MACARRAO-001',
    category: 'Massas',
    stock: 90,
    active: true,
    companyId: 1
  },
  {
    name: 'Farinha de Trigo',
    description: 'Farinha de trigo especial, pacote 1kg',
    price: 5.60,
    currency: 'BRL',
    sku: 'FARINHA-001',
    category: 'Farinhas',
    stock: 70,
    active: true,
    companyId: 1
  },
  {
    name: 'Café em Pó',
    description: 'Café torrado e moído tradicional, pacote 500g',
    price: 9.40,
    currency: 'BRL',
    sku: 'CAFE-001',
    category: 'Bebidas',
    stock: 60,
    active: true,
    companyId: 1
  },
  {
    name: 'Leite Integral',
    description: 'Leite integral UHT, caixa 1L',
    price: 4.20,
    currency: 'BRL',
    sku: 'LEITE-001',
    category: 'Laticínios',
    stock: 50,
    active: true,
    companyId: 1
  },
  {
    name: 'Ovos Brancos',
    description: 'Ovos brancos grandes, dúzia',
    price: 8.90,
    currency: 'BRL',
    sku: 'OVOS-001',
    category: 'Proteínas',
    stock: 40,
    active: true,
    companyId: 1
  }
];

async function insertProducts() {
  try {
    await sequelize.authenticate();
    console.log('Conectado ao banco de dados');
    
    console.log('Inserindo produtos...');
    
    for (const productData of products) {
      try {
        const product = await Product.create(productData);
        console.log(`✅ ${product.name} - R$ ${product.price}`);
      } catch (error) {
        console.log(`❌ Erro ao inserir ${productData.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 Processo concluído!');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await sequelize.close();
  }
}

insertProducts();
