# Correções para o Servidor

## Arquivos que precisam ser atualizados no servidor:

### 1. src/app.ts
Substitua as linhas 7-8:
```typescript
import * as Sentry from "@sentry/node";
import { requestHandler, errorHandler } from "@sentry/node/dist/handlers";
```

E as linhas 40 e 75:
```typescript
app.use(requestHandler());
app.use(errorHandler());
```

### 2. src/generated/translationKeys.ts
Criar o arquivo com o conteúdo:
```typescript
export const getAllTranslationKeys = (): string[] => {
  return [
    "welcome", "goodbye", "error", "success", "loading", "save", "cancel",
    // ... (conteúdo completo do arquivo)
  ];
};
```

### 3. Recompilar
```bash
cd /home/suporte/Mercale-whatsapp/backend
npm run build
npm start
```

## Comandos para executar no servidor:

```bash
# 1. Editar app.ts
nano src/app.ts

# 2. Criar diretório generated
mkdir -p src/generated

# 3. Criar translationKeys.ts
nano src/generated/translationKeys.ts

# 4. Recompilar
npm run build

# 5. Iniciar servidor
npm start
```
