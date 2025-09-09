-- Inserir produtos de cesta básica para teste
INSERT INTO "Products" (name, description, price, currency, sku, category, stock, active, "companyId", "createdAt", "updatedAt") VALUES 
('Arroz Branco Tipo 1', 'Arroz branco tipo 1, grãos longos e soltos, pacote 5kg', 12.90, 'BRL', 'ARROZ-001', 'Grãos e Cereais', 100, true, 1, NOW(), NOW()),
('Feijão Carioca', 'Feijão carioca tipo 1, selecionado, pacote 1kg', 8.50, 'BRL', 'FEIJAO-001', 'Grãos e Cereais', 150, true, 1, NOW(), NOW()),
('Açúcar Cristal', 'Açúcar cristal especial, pacote 1kg', 4.90, 'BRL', 'ACUCAR-001', 'Açúcar e Adoçantes', 200, true, 1, NOW(), NOW()),
('Óleo de Soja', 'Óleo de soja refinado, garrafa 900ml', 6.30, 'BRL', 'OLEO-001', 'Óleos e Azeites', 80, true, 1, NOW(), NOW()),
('Sal Refinado', 'Sal refinado iodado, pacote 1kg', 2.20, 'BRL', 'SAL-001', 'Temperos e Condimentos', 120, true, 1, NOW(), NOW()),
('Macarrão Espaguete', 'Macarrão espaguete sêmola, pacote 500g', 3.80, 'BRL', 'MACARRAO-001', 'Massas', 90, true, 1, NOW(), NOW()),
('Farinha de Trigo', 'Farinha de trigo especial, pacote 1kg', 5.60, 'BRL', 'FARINHA-001', 'Farinhas', 70, true, 1, NOW(), NOW()),
('Café em Pó', 'Café torrado e moído tradicional, pacote 500g', 9.40, 'BRL', 'CAFE-001', 'Bebidas', 60, true, 1, NOW(), NOW()),
('Leite Integral', 'Leite integral UHT, caixa 1L', 4.20, 'BRL', 'LEITE-001', 'Laticínios', 50, true, 1, NOW(), NOW()),
('Ovos Brancos', 'Ovos brancos grandes, dúzia', 8.90, 'BRL', 'OVOS-001', 'Proteínas', 40, true, 1, NOW(), NOW()),
('Margarina', 'Margarina cremosa com sal, pote 500g', 7.20, 'BRL', 'MARGARINA-001', 'Laticínios', 30, true, 1, NOW(), NOW()),
('Extrato de Tomate', 'Extrato de tomate concentrado, lata 340g', 3.10, 'BRL', 'EXTRATO-001', 'Conservas', 100, true, 1, NOW(), NOW()),
('Biscoito Cream Cracker', 'Biscoito cream cracker, pacote 400g', 4.50, 'BRL', 'BISCOITO-001', 'Biscoitos e Bolachas', 80, true, 1, NOW(), NOW()),
('Sabão em Pó', 'Sabão em pó concentrado, caixa 1kg', 11.80, 'BRL', 'SABAO-001', 'Limpeza', 45, true, 1, NOW(), NOW()),
('Detergente Líquido', 'Detergente líquido neutro, frasco 500ml', 2.90, 'BRL', 'DETERGENTE-001', 'Limpeza', 70, true, 1, NOW(), NOW());
