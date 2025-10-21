FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala TODAS as dependências (incluindo devDependencies para o build)
RUN npm ci && npm cache clean --force

# Copia código fonte
COPY . .

# Compila a aplicação
RUN npm run build

# Instala apenas dependências de produção em pasta separada
RUN npm ci --only=production && npm cache clean --force

# Estágio de produção
FROM node:20-alpine

WORKDIR /app

# Copia dependências de produção
COPY --from=builder /app/node_modules ./node_modules

# Copia código compilado
COPY --from=builder /app/dist ./dist

# Copia package.json para comandos npm
COPY package*.json ./

# Expõe a porta da aplicação
EXPOSE 3000

# Usuário não-root para segurança
USER node

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]

