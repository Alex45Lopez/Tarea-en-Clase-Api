# Bolsa SENATI - API de Perfil

API REST del sistema Bolsa SENATI correspondiente al módulo de Gestión de Perfil de Aprendiz.

## Descripción

Este proyecto implementa el backend encargado de administrar toda la información del perfil del aprendiz, incluyendo datos personales, avatar, contraseña, palabras clave y distritos adicionales de residencia. Está construido como un servicio Node.js/Express con conexión a MySQL mediante pool de conexiones.

## Tecnologías

- **Node.js** - Entorno de ejecución JavaScript
- **Express 4.x** - Framework web para API REST
- **MySQL 2 / mysql2** - Driver MySQL con soporte de Promesas y pool de conexiones
- **bcryptjs** - Hashing seguro de contraseñas
- **express-validator** - Validación de datos de entrada
- **dotenv** - Gestión de variables de entorno
- **cors** - Middleware de Cross-Origin Resource Sharing

## Estructura del Proyecto

```
API clse/
├── src/
│   ├── config/
│   │   └── db.js                 # Pool de conexiones MySQL
│   ├── controllers/
│   │   └── perfilController.js   # Lógica de negocio del módulo perfil
│   ├── models/
│   │   └── perfilModel.js        # Consultas SQL y acceso a datos
│   ├── routes/
│   │   └── perfilRoutes.js       # Definición de rutas REST
│   ├── app.js                    # Configuración de Express
│   └── server.js                 # Punto de entrada del servidor
├── db/
│   └── database.sql              # Script de creación de base de datos
├── .env                          # Variables de entorno
├── package.json
└── README.md
```

## Instalación y Configuración

### Requisitos previos

- Node.js v18 o superior
- MySQL / XAMPP con el servicio MySQL activo

### Pasos de instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar el script de base de datos:
   - Abrir phpMyAdmin o cliente MySQL
   - Ejecutar el contenido de `db/database.sql`
   - Esto creará la base `bolsa_senati`, las tablas `aprendices`, `palabras_clave` y `distritos_adicionales`, además del usuario de aplicación `senati_app`

3. Configurar variables de entorno en el archivo `.env`:
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=senati_app
DB_PASSWORD=senati_pass_2026
DB_NAME=bolsa_senati
```

## Ejecución

- **Producción:**
```bash
npm start
```

- **Desarrollo (con recarga automática):**
```bash
npm run dev
```

El servidor se levantará en `http://localhost:3000`

## Endpoints

Todos los endpoints del módulo perfil están bajo el prefijo `/api/perfil`.

### Salud del Servicio

| Método | Ruta            | Descripción               |
|--------|-----------------|---------------------------|
| GET    | `/`             | Información del servicio  |
| GET    | `/api/health`   | Estado del servidor       |

### Perfil de Aprendiz

| Método | Ruta                                              | Descripción                                  |
|--------|---------------------------------------------------|----------------------------------------------|
| GET    | `/api/perfil/:id`                                 | Obtener perfil completo                      |
| PUT    | `/api/perfil/:id`                                 | Actualizar datos personales                  |
| PUT    | `/api/perfil/:id/avatar`                          | Actualizar URL del avatar                    |
| PUT    | `/api/perfil/:id/password`                        | Cambiar contraseña                           |
| PUT    | `/api/perfil/:id/distritos-adicionales`           | Actualizar hasta 3 distritos adicionales     |
| POST   | `/api/perfil/:id/palabras-clave`                  | Agregar una palabra clave                    |
| DELETE | `/api/perfil/:id/palabras-clave/:palabraId`       | Eliminar una palabra clave                   |

## Endpoints de ejemplo

### Obtener perfil
```bash
GET /api/perfil/1
```
**Respuesta 200:**
```json
{
  "id": 1,
  "nombres_apellidos": "Juan Pérez",
  "telefono_movil": "999888777",
  "correo_personal": "juan@gmail.com",
  "correo_institucional": "juan.perez@senati.edu.pe",
  "carrera": "Ingeniería de Software",
  "ciclo": 4,
  "distrito_residencia": "Lima",
  "avatar_url": "https://...",
  "palabras_clave": [{ "id": 1, "palabra": "JavaScript" }],
  "distritos_adicionales": [{ "orden": 1, "distrito": "Miraflores" }],
  "created_at": "...",
  "updated_at": "..."
}
```

### Actualizar datos personales
```bash
PUT /api/perfil/1
Content-Type: application/json

{
  "nombres_apellidos": "Juan Pérez Gómez",
  "distrito_residencia": "San Isidro"
}
```

### Cambiar contraseña
```bash
PUT /api/perfil/1/password
Content-Type: application/json

{
  "password_actual": "contrasena123",
  "password_nueva": "nuevaContrasena"
}
```

## Códigos de Error

| Código | Descripción                                         |
|--------|-----------------------------------------------------|
| 200    | Operación exitosa                                   |
| 201    | Recurso creado (palabra clave agregada)             |
| 204    | Sin contenido (palabra clave eliminada)             |
| 400    | Datos inválidos o faltantes                         |
| 401    | Contraseña incorrecta                               |
| 404    | Aprendiz / Palabra clave no encontrado              |
| 409    | Duplicado (correo / palabra ya existe)              |
| 500    | Error interno del servidor                          |

## Autor

Proyecto desarrollado como parte de las actividades de clase del SENATI.
