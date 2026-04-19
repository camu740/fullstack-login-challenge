# Full-Stack Auth Challenge (Spring Boot + Angular)

Este proyecto implementa una solución completa de autenticación con Spring Boot (Backend) y Angular (Frontend), siguiendo los requisitos de Java 1.8, JWT, Refresh Token, y SSO simulado.

## Estructura del Proyecto

| Carpeta | Descripción |
| :--- | :--- |
| `/backend` | Servidor Spring Boot 2.7.18 (Java 8 kompatible). |
| `/frontend` | Aplicación Angular 16.2.16 con Material y i18n. |

## Requisitos Previos

- **Java JDK 1.8** (o superior con compatibilidad 8 habilitada).
- **Node.js** (v16+) y **npm**.
- **Maven** (opcional, se incluye `mvnw` en el backend).

## Backend (Spring Boot)

### Ejecución
1. Dirígete a la carpeta `backend`.
2. Ejecuta el comando:
   ```bash
   ./mvnw spring-boot:run
   ```
   *Nota: En Windows usa `mvnw.cmd`.*

### Detalles Técnicos
- **Base de Datos**: H2 (en memoria). Acceso en `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:authdb`, User: `sa`, Pass: `password`).
- **Endpoints**:
  - `POST /api/auth/login`: Autenticación con email/password.
  - `POST /api/auth/refresh`: Refresco de Access Token.
  - `GET /api/auth/sso`: Inicio de flujo SSO (redirección simulada).
  - `GET /api/auth/sso/callback`: Validación de código SSO y entrega de tokens.
- **Credenciales de Prueba**:
  - **Email**: `admin@challenge.com`
  - **Password**: `Admin123!`

## Frontend (Angular)

### Instalación y Ejecución
1. Dirígete a la carpeta `frontend`.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar servidor de desarrollo:
   ```bash
   npm start
   ```
   *Esto usa `ng serve --proxy-config src/proxy.conf.json`.*
4. Abre `http://localhost:4200` en tu navegador.

### Características
- **Diseño**: Basado en el Figma proporcionado, con split-view e ilustraciones.
- **Registro de Usuarios**: Flujo completo de registro con validaciones de duplicados en backend.
- **Seguridad de Contraseñas**: Medidor de fortaleza (Password Strength Meter) en tiempo real con requisitos estrictos de complejidad.
- **i18n**: Soporte completo para Español (ES), Inglés (EN), Francés (FR) y Portugués (PT).
- **Validaciones**: Formularios reactivos con feedback visual dinámico.
- **SSO Simulado**: Flujo completo con ventana de selección de certificado (DNIe), procesamiento y callback.
- **Interfaz Responsiva**: Layout adaptable y preventivo ante solapamiento de componentes.

## Seguridad y Auditoría
Debido a los requisitos estrictos de versiones (Angular 16), el proyecto reporta vulnerabilidades transitorias propias del framework. Consulta el documento [SECURITY_AUDIT.md](SECURITY_AUDIT.md) para más detalles técnicos y justificación.

## Configuración de CORS y Proxy
- El Backend permite peticiones desde `http://localhost:4200` mediante `@CrossOrigin` y `WebSecurityConfig`.
- El Frontend utiliza `proxy.conf.json` para mapear `/api` a `http://localhost:8080` durante el desarrollo, evitando problemas de CORS en el navegador.

## Pruebas de API (cURL)

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@challenge.com", "password":"Admin123!"}'
```

### Refresh Token
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
     -H "Content-Type: application/json" \
     -d '{"refreshToken":"TU_REFRESH_TOKEN"}'
```
