# Buscali Backend

Buscali es una aplicación diseñada para mejorar la movilidad urbana mediante el seguimiento en tiempo real de rutas de transporte público. Este repositorio contiene el backend del sistema, desarrollado con Node.js y Sequelize, conectado a una base de datos relacional Postgres y complementado con una base NoSQL para el manejo de coordenadas GPS.

## 🚀 Funcionalidades principales

- **Gestión de usuarios y conductores**  
  Registro, autenticación y administración de perfiles con roles diferenciados (pasajero, conductor, administrador).

- **Seguimiento en tiempo real**  
  Visualización de la ubicación de vehículos en el mapa, con actualización automática de datos GPS.

- **Historial de búsquedas**  
  Consulta de trayectos frecuentes y búsquedas recientes asociadas a cada usuario.

- **Visualización de rutas**  
  Acceso al trayecto completo de cada ruta registrada en el sistema.

- **Seguridad y autenticación**  
  Contraseñas temporales generadas en el backend, cifrado de credenciales y control de sesiones activas.

## 🗂️ Arquitectura de datos

- **Postgres (relacional)**  
  - Usuarios  
  - Conductores  
  - Rutas  
  - Historial de búsquedas  
  - Sesiones  

- **NoSQL (MongoDB u otro)**  
  - Trayectos (coordenadas de rutas)  
  - Ubicaciones en tiempo real (GPS de conductores)  

## ⚙️ Tecnologías utilizadas

- Node.js  
- Express  
- Sequelize (ORM)  
- Postgres (Neon)  
- MongoDB (para datos geoespaciales)  
- OpenStreetMap o Google Maps

## 📌 Casos de uso documentados

El proyecto cuenta con casos de uso que describen la interacción de actores con el sistema y los procesos internos del servidor, incluyendo validaciones, consultas y transmisión de datos GPS.

## 📈 Estado del proyecto

Actualmente en desarrollo, con el backend en construcción y la integración de servicios de geolocalización y geocodificación.



