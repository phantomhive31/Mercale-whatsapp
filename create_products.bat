@echo off
echo Inserindo produtos de cesta basica...

docker compose -f docker-compose-local.yaml exec -T postgres psql -U ticketz -d ticketz -c "INSERT INTO \"Products\" (name, description, price, currency, sku, category, stock, active, \"companyId\", \"createdAt\", \"updatedAt\") VALUES ('Arroz Branco', 'Arroz branco tipo 1, pacote 5kg', 12.90, 'BRL', 'ARROZ-001', 'Graos', 100, true, 1, NOW(), NOW());"

docker compose -f docker-compose-local.yaml exec -T postgres psql -U ticketz -d ticketz -c "INSERT INTO \"Products\" (name, description, price, currency, sku, category, stock, active, \"companyId\", \"createdAt\", \"updatedAt\") VALUES ('Feijao Carioca', 'Feijao carioca tipo 1, pacote 1kg', 8.50, 'BRL', 'FEIJAO-001', 'Graos', 150, true, 1, NOW(), NOW());"

docker compose -f docker-compose-local.yaml exec -T postgres psql -U ticketz -d ticketz -c "INSERT INTO \"Products\" (name, description, price, currency, sku, category, stock, active, \"companyId\", \"createdAt\", \"updatedAt\") VALUES ('Acucar Cristal', 'Acucar cristal especial, pacote 1kg', 4.90, 'BRL', 'ACUCAR-001', 'Adocantes', 200, true, 1, NOW(), NOW());"

docker compose -f docker-compose-local.yaml exec -T postgres psql -U ticketz -d ticketz -c "INSERT INTO \"Products\" (name, description, price, currency, sku, category, stock, active, \"companyId\", \"createdAt\", \"updatedAt\") VALUES ('Oleo de Soja', 'Oleo de soja refinado, garrafa 900ml', 6.30, 'BRL', 'OLEO-001', 'Oleos', 80, true, 1, NOW(), NOW());"

docker compose -f docker-compose-local.yaml exec -T postgres psql -U ticketz -d ticketz -c "INSERT INTO \"Products\" (name, description, price, currency, sku, category, stock, active, \"companyId\", \"createdAt\", \"updatedAt\") VALUES ('Sal Refinado', 'Sal refinado iodado, pacote 1kg', 2.20, 'BRL', 'SAL-001', 'Temperos', 120, true, 1, NOW(), NOW());"

docker compose -f docker-compose-local.yaml exec -T postgres psql -U ticketz -d ticketz -c "INSERT INTO \"Products\" (name, description, price, currency, sku, category, stock, active, \"companyId\", \"createdAt\", \"updatedAt\") VALUES ('Macarrao', 'Macarrao espaguete, pacote 500g', 3.80, 'BRL', 'MACARRAO-001', 'Massas', 90, true, 1, NOW(), NOW());"

docker compose -f docker-compose-local.yaml exec -T postgres psql -U ticketz -d ticketz -c "INSERT INTO \"Products\" (name, description, price, currency, sku, category, stock, active, \"companyId\", \"createdAt\", \"updatedAt\") VALUES ('Farinha de Trigo', 'Farinha de trigo especial, pacote 1kg', 5.60, 'BRL', 'FARINHA-001', 'Farinhas', 70, true, 1, NOW(), NOW());"

docker compose -f docker-compose-local.yaml exec -T postgres psql -U ticketz -d ticketz -c "INSERT INTO \"Products\" (name, description, price, currency, sku, category, stock, active, \"companyId\", \"createdAt\", \"updatedAt\") VALUES ('Cafe em Po', 'Cafe torrado e moido, pacote 500g', 9.40, 'BRL', 'CAFE-001', 'Bebidas', 60, true, 1, NOW(), NOW());"

docker compose -f docker-compose-local.yaml exec -T postgres psql -U ticketz -d ticketz -c "INSERT INTO \"Products\" (name, description, price, currency, sku, category, stock, active, \"companyId\", \"createdAt\", \"updatedAt\") VALUES ('Leite Integral', 'Leite integral UHT, caixa 1L', 4.20, 'BRL', 'LEITE-001', 'Laticinios', 50, true, 1, NOW(), NOW());"

docker compose -f docker-compose-local.yaml exec -T postgres psql -U ticketz -d ticketz -c "INSERT INTO \"Products\" (name, description, price, currency, sku, category, stock, active, \"companyId\", \"createdAt\", \"updatedAt\") VALUES ('Ovos', 'Ovos brancos grandes, duzia', 8.90, 'BRL', 'OVOS-001', 'Proteinas', 40, true, 1, NOW(), NOW());"

echo Produtos inseridos com sucesso!
