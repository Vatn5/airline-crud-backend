# ✈️ Airline CRUD Backend

API RESTful para gestionar vuelos y pasajeros, lista para desarrollo y producción usando Docker Compose, Express.js y MongoDB.

---

## 📦 Estructura del proyecto


---

## 🚀 Despliegue y Uso del Entorno

Este proyecto está preparado para funcionar tanto en **desarrollo** como en **producción** utilizando Docker Compose.

---

### ⚡️ Entorno de Desarrollo

1. **Clona el repositorio:**
    ```bash
    git clone https://github.com/TU_USUARIO/TU_REPO.git
    cd TU_REPO
    ```

2. **Configura variables de entorno:**
    ```bash
    cp .env.example .env
    # Edita el archivo .env con tus credenciales y parámetros locales
    ```

3. **(Opcional) Para hot reload:**  
   Asegúrate de tener un archivo `docker-compose.override.yml` con:
    ```yaml
    services:
      api:
        volumes:
          - ./api:/usr/src/app
        command: npm run dev
    ```

4. **Levanta los servicios:**
    ```bash
    docker compose up --build
    ```

5. **API disponible en:**  
    [http://localhost:3000](http://localhost:3000)  
    *(o el puerto definido en `.env`)*

---

### 🛡️ Entorno de Producción

1. **Configura variables de entorno seguras:**  
    Usa un archivo `.env.production` o define las variables directamente en tu servidor/cloud.

2. **Inicia el entorno en modo producción:**
    ```bash
    docker compose --env-file .env.production up --build -d
    ```

3. **La API estará disponible en el puerto configurado en tu entorno.**

---

## 📋 Diferencias clave entre entornos

| Característica   | Desarrollo            | Producción                |
|------------------|----------------------|---------------------------|
| Hot reload       | Sí (`ts-node-dev`)   | No                        |
| Seguridad        | Local                | Variables seguras         |
| Dependencias     | Todas                | Solo las necesarias       |
| Logs/Errores     | Verboso              | Controlado                |
| Uso principal    | Desarrollo y pruebas | Usuarios finales          |

---

## 🧩 Variables de entorno

El archivo `.env.example` contiene la estructura necesaria para tus variables:

```env
MONGO_INITDB_DATABASE=
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
MONGO_URI=
NODE_ENV=
PORT=
