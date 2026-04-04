# BusCali 🚌

> El mejor backend del universo para la movilidad urbana en Santiago de Cali.

BusCali es una plataforma integral diseñada para optimizar la experiencia de transporte público en la ciudad. Este repositorio contiene el **Backend**, un servicio robusto construido con **Node.js** y **TypeScript** que centraliza las reglas de negocio, la persistencia de datos geográficos y la autenticación tanto para la App Móvil (Usuarios) como para el Panel Web (Administradores).

## 🏗️ Arquitectura del Sistema

El proyecto se basa en un modelo de **Backend Monolítico** con servicios de frontend independientes, permitiendo una gestión centralizada de la lógica de movilidad.

- **Stack Principal:** Node.js + Express + TypeScript.
- **Persistencia:** - **PostgreSQL**: Base de datos relacional gestionada a través de **Sequelize** (Modelos y Migraciones).
- **Seguridad:** Autenticación basada en **JWT** (JSON Web Tokens) y cifrado de datos sensibles con **bcrypt**.
- **Geolocalización:** Almacenamiento de coordenadas en formato **GeoJSON** en la base de datos, consumidas por el frontend mediante la API de Google Maps.

### Diagrama de Comunicación

El flujo de datos sigue una arquitectura RESTful:

1. **App Móvil (React Native):** Interfaz para el ciudadano de Cali.
2. **Panel Web (React):** Herramienta de gestión para administradores del sistema.

## 🚀 1. Instalación y Configuración

### Requisitos previos

- **Node.js** (v18.x o superior)
- **npm** (v9.x o superior)
- Instancias locales o remotas de **PostgreSQL**.

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/apuestacerou/buscali-backend.git
   cd buscali-backend
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar Variables de Envono:**
   Crea un archivo `.env` en la raíz del proyecto basándote en los requerimientos de la aplicación:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASS=tu_contraseña
   DB_NAME=buscali
   JWT_SECRET=tu_secreto_para_tokens
   ```

4. **Compilar y ejecutar:**
   Para desarrollo con recarga automática:
   ```bash
   npm run dev
   ```
   Para generar el build de producción:
   ```bash
   npm run build
   ```

## 🛠️ 2. Convenciones de Desarrollo y Git Flow

Para mantener la integridad del código en un entorno colaborativo de ingeniería, se establecen las siguientes normas:

### Estrategia de Ramas (Git Flow)

Se utiliza un flujo basado en ramas para separar el código estable del desarrollo activo:

- **`main`**: Rama de producción. Solo se fusiona código que ha sido probado y es 100% estable.
- **`develop`**: Rama principal de desarrollo. Todos los cambios terminados se integran aquí.
- **`feature/[nombre-tarea]`**: Ramas de corta duración creadas a partir de `develop`. Ejemplo: `feature/auth-jwt` o `feature/map-integration`.

### Estándar de Mensajes de Commit

Es obligatorio el uso de **Conventional Commits** para facilitar la lectura del historial:

- `feat:` Cuando agregas una nueva funcionalidad.
- `fix:` Cuando corriges un error en el código.
- `docs:` Cambios únicamente en archivos de documentación.
- `chore:` Tareas de mantenimiento (actualizar `package.json`, configurar `tsconfig.json`).

---

## 📍 3. Estado del Proyecto (Roadmap)

Actualmente nos encontramos en la fase de **MVP (Producto Mínimo Viable)** para la App Móvil.

- [x] Configuración inicial del servidor Express con TypeScript.
- [x] Modelado de base de datos relacional (PostgreSQL).
- [x] Implementación de autenticación con JWT y Bcrypt.
- [ ] Integración de mapas y visualización de rutas (En proceso).
- [ ] Panel administrativo web (Pendiente).

---

**BusCali Backend** - _El mejor backend del universo._
