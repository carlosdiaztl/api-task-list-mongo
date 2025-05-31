ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-alpine
#declaracion argumentos de entorno
ARG HTTP_PROXY
ARG DEVELOPER

# Recibir el argumento

# Convertirlo en variable de entorno
ENV HTTP_PROXY=$HTTP_PROXY
ENV DEVELOPER=$DEVELOPER

RUN echo "Hola desde el contenedor$HTTP_PROXY"
# Establece el directorio de trabajo
WORKDIR /usr/src/app
#
ENV NODE_ENV development
# Copia package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install 

RUN npm install ts-node typescript --save-dev

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 8080

# Comando por defecto para ejecutar los test
RUN npm run test
# CMD [ "npm", "run", "test" ]