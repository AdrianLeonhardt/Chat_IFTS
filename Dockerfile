# FROM node:22-alpine

# WORKDIR /app

# COPY package.json ./
# RUN npm install

# COPY backend ./backend
# COPY script-sql.sh ./

# RUN chmod +x script-sql.sh

# ENTRYPOINT ["./script-sql.sh"]
# CMD ["npm", "start"]

FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app/backend

# Copia los archivos de dependencias del backend al contenedor
COPY package.json package-lock.json ../
# Instala las dependencias usando el directorio raíz del proyecto (/app)  
RUN npm install --prefix /app

# Copia todos los código al contenedor
COPY backend ./    
COPY frontend ../frontend  
COPY script-sql.sh ../script-sql.sh

# Da permisos de ejecución al script para poder ejecutarlo luego
RUN chmod +x ../script-sql.sh

# Establece el script de espera como punto de entrada (espera a que MySQL esté listo)
ENTRYPOINT ["../script-sql.sh"]

# Comando para iniciar la app Node.js
CMD ["node", "index.js"]
