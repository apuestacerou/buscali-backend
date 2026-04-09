# Explicación completa: Módulo de Usuarios (Buscali Backend)

Este documento explica **todo lo que hicimos** para el CRUD de usuarios: idea general, piezas del código y cómo se relacionan.

---

## 1. ¿Qué queríamos lograr?

En Buscali hay **usuarios** (pasajeros, conductores, administradores) que deben guardarse en una base de datos. Necesitábamos:

- **Crear** usuarios (registro).
- **Listar** todos los usuarios.
- **Ver** un usuario por su ID.
- **Actualizar** datos de un usuario.
- **Eliminar** un usuario.

Eso se llama **CRUD** (Create, Read, Update, Delete). Todo esto se hace a través de una **API REST**: el frontend (o Postman) envía peticiones HTTP y el backend responde con JSON.

---

## 2. Arquitectura: las piezas del proyecto

El backend está organizado en capas. Cada archivo tiene un rol claro:

```
Cliente (navegador, Postman, app)
        │
        │  HTTP (GET, POST, PUT, DELETE)
        ▼
┌─────────────────────────────────────────────────────────┐
│  app.ts          → Punto de entrada, monta rutas         │
├─────────────────────────────────────────────────────────┤
│  routes/         → Define URL → función del controlador  │
│  usuariosRoutes.ts                                       │
├─────────────────────────────────────────────────────────┤
│  controllers/     → Lógica: validar, guardar, responder  │
│  usuariosController.ts                                    │
├─────────────────────────────────────────────────────────┤
│  models/          → Cómo es la tabla en la base de datos │
│  Usuario.ts                                              │
├─────────────────────────────────────────────────────────┤
│  config/          → Conexión a Postgres (Neon)           │
│  database.ts                                             │
└─────────────────────────────────────────────────────────┘
        │
        ▼
   Base de datos Postgres (tabla `usuarios`)
```

- **app.ts**: arranca Express, monta rutas y el 404.
- **routes**: asocia cada URL y método (GET, POST, etc.) a una función del controlador.
- **controllers**: reciben la petición, validan, usan el modelo para leer/escribir en la BD y envían la respuesta.
- **models**: definen la estructura de la tabla (columnas y tipos) con Sequelize.
- **config/database.ts**: configura la conexión a Postgres (Neon) y registra el modelo Usuario.

---

## 3. La base de datos: tabla `usuarios`

En Postgres (Neon) hay una tabla llamada **`usuarios`**. Cada fila es un usuario. Las columnas son:

| Columna       | Tipo        | Descripción |
|---------------|-------------|-------------|
| id            | INTEGER     | Número único, se genera solo (autoincremental). |
| nombre        | VARCHAR(120)| Nombre del usuario. Obligatorio. |
| email         | VARCHAR(255)| Correo. Opcional. |
| telefono      | VARCHAR(20) | Teléfono. Opcional. |
| password_hash | VARCHAR(255)| Contraseña **hasheada** (nunca en texto plano). |
| rol           | VARCHAR(20) | `pasajero`, `conductor` o `administrador`. |
| created_at    | TIMESTAMP   | Fecha de creación. |
| updated_at    | TIMESTAMP   | Fecha de última actualización. |

No guardamos la contraseña en texto claro; usamos **bcrypt** para convertirla en un “hash” que no se puede revertir. Así, si alguien ve la base de datos, no puede saber las contraseñas.

---

## 4. El modelo: `src/models/Usuario.ts`

El **modelo** es la representación en código de esa tabla. Usamos **Sequelize** con TypeScript (sequelize-typescript).

- **@Table**: indica que la clase `Usuario` es la tabla `usuarios`, con timestamps y nombres en snake_case en la BD.
- **@Column**: cada propiedad es una columna (tipo, si es obligatoria, valor por defecto).
- **@CreatedAt** / **@UpdatedAt**: Sequelize rellena y actualiza las fechas solo.

Con esto podemos hacer en código cosas como:

- `Usuario.findAll()` → SELECT * FROM usuarios
- `Usuario.findByPk(1)` → buscar por id
- `Usuario.create({ nombre, email, ... })` → INSERT
- `usuario.save()` → UPDATE
- `usuario.destroy()` → DELETE

---

## 5. La configuración de la base de datos: `src/config/database.ts`

Aquí creamos la **conexión** a Postgres:

- Si existe **DATABASE_URL** en `.env` (caso Neon), usamos esa URL y activamos SSL.
- Si no, usamos variables por separado: DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT.

También le decimos a Sequelize qué **modelos** usa (`Usuario`), para que pueda crear/sincronizar la tabla al arrancar (`sequelize.sync()` en app.ts).

---

## 6. El controlador: `src/controllers/usuariosController.ts`

El controlador tiene **una función por acción** del CRUD. Cada función recibe `req` (petición) y `res` (respuesta).

### listar (GET /api/usuarios)

- Hace `Usuario.findAll()` ordenado por id.
- Excluye `passwordHash` de la respuesta (por seguridad).
- Devuelve un array de usuarios en JSON.

### obtenerPorId (GET /api/usuarios/:id)

- Toma el `id` de la URL (`req.params.id`), lo convierte a número.
- Si no es un número válido → 400.
- Busca con `Usuario.findByPk(id)`; si no existe → 404.
- Responde el usuario (sin passwordHash).

### crear (POST /api/usuarios)

- Lee del body: nombre, email, telefono, password, rol.
- Valida: nombre obligatorio; password obligatorio y mínimo 6 caracteres.
- Define un rol válido (pasajero, conductor, administrador) o por defecto "pasajero".
- Hashea la contraseña con **bcrypt** y guarda ese hash en `passwordHash`.
- Crea el usuario con `Usuario.create(...)`.
- Quita `passwordHash` de la respuesta y devuelve 201 con el usuario creado.

### actualizar (PUT /api/usuarios/:id)

- Obtiene el id de la URL y busca el usuario.
- Si no existe → 404.
- Actualiza solo los campos que vengan en el body (nombre, email, telefono, password, rol).
- Si envían password nueva, la hashea con bcrypt y actualiza `passwordHash`.
- Guarda con `usuario.save()` y responde el usuario actualizado (sin passwordHash).

### eliminar (DELETE /api/usuarios/:id)

- Busca el usuario por id; si no existe → 404.
- Llama a `usuario.destroy()` para borrarlo de la BD.
- Responde 204 (éxito sin cuerpo).

---

## 7. Las rutas: `src/routes/usuariosRoutes.ts`

Las rutas **unen** cada URL + método HTTP con la función del controlador:

- `GET /` (relativo a /api/usuarios) → listar
- `GET /:id` → obtenerPorId
- `POST /` → crear
- `PUT /:id` → actualizar
- `DELETE /:id` → eliminar

En `app.ts` montamos este router en **/api/usuarios**, así que las URLs finales son:

- GET    http://localhost:3000/api/usuarios
- GET    http://localhost:3000/api/usuarios/1
- POST   http://localhost:3000/api/usuarios
- PUT    http://localhost:3000/api/usuarios/1
- DELETE http://localhost:3000/api/usuarios/1

---

## 8. El punto de entrada: `src/app.ts`

Aquí:

1. Se cargan variables de entorno con **dotenv** (por ejemplo DATABASE_URL desde `.env`).
2. Se carga **reflect-metadata** (necesario para sequelize-typescript).
3. Se crea la app de **Express** y se usa **express.json()** para leer el body en JSON.
4. Se definen:
   - **GET /** → mensaje de bienvenida y lista de endpoints.
   - **GET /health** → comprobar que el servidor está vivo.
   - **Montaje de /api/usuarios** → todas las rutas del CRUD.
   - **Manejador 404** → para cualquier otra ruta.
5. En **start()**:
   - Conecta a la BD con `sequelize.authenticate()`.
   - Sincroniza tablas con `sequelize.sync()` (crea la tabla si no existe).
   - Inicia el servidor con `app.listen(PORT)`.

---

## 9. Flujo de una petición (ejemplo: crear usuario)

1. El cliente envía **POST** a `http://localhost:3000/api/usuarios` con body JSON: `{ "nombre": "Ana", "password": "clave123", ... }`.
2. Express recibe la petición; `express.json()` parsea el body.
3. La ruta **POST /api/usuarios** hace que se ejecute **usuariosController.crear**.
4. El controlador valida nombre y password, hashea la contraseña con bcrypt, llama a **Usuario.create(...)**.
5. Sequelize hace un **INSERT** en la tabla `usuarios` en Postgres.
6. El controlador quita `passwordHash` del objeto y responde con **status 201** y el usuario en JSON.

---

## 10. Seguridad que aplicamos

- **Contraseñas**: nunca se guardan en texto plano; siempre se hashean con bcrypt.
- **Respuestas**: nunca enviamos `passwordHash` en el JSON al cliente.
- **Validación**: nombre y password obligatorios; password mínimo 6 caracteres; rol dentro de los valores permitidos.
- **.env**: la URL de la base de datos y secretos están en `.env`, que no se sube a Git.

---

## 11. Resumen en una frase

**“Definimos la tabla usuarios en un modelo, configuramos la conexión a Postgres, y exponemos un CRUD completo por HTTP (rutas + controlador) que crea, lee, actualiza y elimina usuarios, hasheando contraseñas y sin devolverlas en las respuestas.”**

Con esto tienes el panorama completo de lo que hicimos en el módulo de usuarios y cómo encaja en el proyecto.
