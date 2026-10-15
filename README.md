# Sistema de Gestión de Empleados - Stack MEAN

> **Práctica 03: Stack MEAN (MongoDB, Express, Angular, Node.js)**  
> **Carrera:** Maestría de Software  
> **Asignatura:** Patrones de Diseño de APIs  

Este proyecto implementa una arquitectura web desacoplada, blindada y reactiva para la gestión de personal (CRUD de Empleados), transformando un sistema base acoplado en un software con atributos de calidad del estándar **ISO/IEC 25010** (modularidad, mantenibilidad, fiabilidad y testeabilidad).

---

## 🚀 Los 4 Retos de Refactorización Implementados

### 🔹 Reto 1: Desacoplamiento del Backend y Persistencia Inversa (Patrón Repository)
- **Problema:** Los controladores de Express conocían e instanciaban directamente el modelo de Mongoose (`EmployeeModel`).
- **Solución:** Se implementó el **Patrón Repository** mediante una interfaz abstracta (`IEmployeeRepository`). La capa web de Express es agnóstica a Mongoose y recibe la persistencia por **Inyección de Dependencias** (`EmpleadosController`).
- **Archivos:** `src/domain/empleado.ts`, `src/repositories/IEmployeeRepository.ts`, `src/repositories/MongooseEmployeeRepository.ts`, `src/controllers/empleados.controllers.ts`.

### 🔹 Reto 2: Validación Perimetral DTO y Respuesta Universal con Zod
- **Problema:** Ausencia de validación de tipos y reglas de negocio en tiempo de ejecución, payloads asimétricos y filtración de excepciones crudas del sistema.
- **Solución:**
  - Esquemas declarativos en **Zod** (`employee.dto.ts`) para blindar `req.body` y `req.params`.
  - Middleware de validación perimetral (`validate.middleware.ts`) que rechaza solicitudes inválidas con HTTP 400.
  - **Response Wrapper Pattern** (`response.wrapper.ts`) que unifica todas las salidas HTTP bajo la estructura `{ success, message, data, error, timestamp }`.
  - Middleware interceptor global de errores (`error.middleware.ts`).

### 🔹 Reto 3: Programación Reactiva e Inmutabilidad en el Servicio (Angular)
- **Problema:** Estado local mutable en el componente y re-consultas excesivas a la red tras cada acción.
- **Solución:** Lógica de consumo aislada en un servicio reactivo (`EmployeeService`). Manejo de estado interno mediante un **`BehaviorSubject` privado** y exposición de un flujo de solo lectura (`Observable$`).
- **Inmutabilidad:** Mutación de referencias inmutables mediante el operador spread (`[...current, new]`), `map` y `filter`.

### 🔹 Reto 4: Arquitectura de Componentes Smart vs. Dumb
- **Problema:** Vista monolítica masiva que mezclaba formularios con tablas de visualización.
- **Solución:** Fragmentación de la interfaz gráfica:
  - **Smart Component (Orquestador - `EmpleadoComponent`):** Inyecta el servicio reactivo y consume los observables con el **`async pipe`**.
  - **Dumb Components (Presentacionales):**
    - `EmpleadoFormComponent`: Captura de datos conectada exclusivamente por `@Input()` y `@Output()`. Reseteo automático tras guardar.
    - `EmpleadoTableComponent`: Rejilla de visualización conectada exclusivamente por `@Input()` y `@Output()`.

---

## 📁 Estructura del Proyecto

```text
practica empleados/
├── backend/
│   ├── src/
│   │   ├── config/             # Conexión a MongoDB (database.ts)
│   │   ├── controllers/        # Controladores desacoplados de persistencia
│   │   ├── domain/             # Entidades puras de TypeScript (empleado.ts)
│   │   ├── dtos/               # Esquemas declarativos Zod (employee.dto.ts)
│   │   ├── middlewares/        # Validación perimetral y manejo de errores
│   │   ├── models/             # Esquemas de Mongoose
│   │   ├── repositories/       # Interfaz IEmployeeRepository y repositorio Mongoose
│   │   ├── routes/             # Enrutador Express con validación
│   │   ├── utils/              # ResponseWrapper universal
│   │   ├── app.ts              # Configuración de Express y middlewares
│   │   └── index.ts            # Punto de entrada y arranque del servidor
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/app/
    │   ├── components/
    │   │   ├── empleado/           # Smart Component (Orquestador con async pipe)
    │   │   ├── empleado-form/      # Dumb Component (Formulario presentacional)
    │   │   └── empleado-table/     # Dumb Component (Tabla presentacional)
    │   ├── models/                 # Modelos e interfaces frontend (empleado.ts)
    │   └── services/               # Servicio reactivo (EmployeeService / BehaviorSubject)
    ├── package.json
    └── angular.json
```

---

## 🛠️ Requisitos Previos

- **Node.js:** v20.x o superior
- **Angular CLI:** v17.x o superior
- **MongoDB:** Servidor local (`mongodb://127.0.0.1:27017`) o MongoDB Compass/Atlas

---

## 💻 Instalación y Ejecución

### 1. Backend (Servidor Express)
```bash
cd backend
npm install
npm run dev
```
> El servidor iniciará en: `http://localhost:3000/api/v1`

### 2. Frontend (Cliente Angular)
```bash
cd frontend
npm install
npx ng serve
```
> La aplicación web estará disponible en: `http://localhost:4200`

---

## 📡 Endpoints de la API REST

| Método | Endpoint | Descripción | Body (JSON) / Params |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/empleados` | Crear nuevo empleado | `{ "nombre", "cargo", "departamento", "sueldo" }` |
| **GET** | `/api/v1/empleados` | Listar todos los empleados | Ninguno |
| **GET** | `/api/v1/empleados/:id` | Consultar por ID | `:id` (ObjectId de 24 caracteres) |
| **PUT** | `/api/v1/empleados/:id` | Actualizar empleado | Parcial o total de campos |
| **DELETE**| `/api/v1/empleados/:id` | Eliminar empleado | `:id` (ObjectId de 24 caracteres) |

### Estructura de Respuesta Universal (Response Wrapper)
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... },
  "timestamp": "2026-10-15T..."
}
```
