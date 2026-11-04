# Curso Spring Boot + Antigravity AI — Frontend (`4-react-app`)

Aplicación web **Single Page Application (SPA)** construida con **React 19**, **TypeScript 7**, **Vite 8** y **Tailwind CSS v4** que actúa como cliente del backend RESTful `3-spring-api`. Proporciona una interfaz moderna con modo claro/oscuro para la gestión de **Clientes (CRM)**, **Facturación (ERP)** y **Control de Usuarios y Roles (RBAC)**.

---

## Características Principales

- **Autenticación con Cookies `HttpOnly` y Control de Acceso (RBAC)**:
  - Inicio de sesión, registro y botones de acceso rápido de demostración (`ADMIN` y `USER`).
  - Rutas protegidas (`ProtectedRoute`) y rutas exclusivas de administración (`AdminRoute`).
  - Interfaz adaptativa según el rol: los usuarios con rol `USER` disponen de acceso de consulta en Clientes y Facturas, mientras que las acciones de escritura (`Crear`, `Editar`, `Eliminar`) se habilitan únicamente para el rol `ADMIN`.
- **Directorio de Clientes (`/customers`)**:
  - Vista conmutable entre **Tabla** y **Cuadrícula de Tarjetas**, búsqueda diferida (`useDeferredValue`) a 60fps y paginación.
  - Modal de ficha de cliente con copia rápida al portapapeles y listado de facturas emitidas al cliente.
- **Gestión de Facturación (`/invoices`)**:
  - Listado de facturas con filtrado combinable por texto, cliente (`?customerId=`) y estado (`PAID`, `PENDING`, `OVERDUE`, `CANCELLED`), además de sumatorio dinámico del volumen facturado.
  - Modal de desglose completo de líneas de facturación (`InvoiceDetailModal`).
  - Editor dinámico de facturas (`InvoiceFormModal`) con adición/eliminación de líneas y cálculo en tiempo real de subtotales e importe total.
- **Administración de Usuarios y Roles (`/users`)**:
  - Gestión exclusiva para `ADMIN` con filtrado por rol, creación/edición de cuentas y protección contra la auto-eliminación del administrador en sesión.
- **Panel de Operaciones (`/`)**:
  - Métricas en tiempo real de clientes, facturas emitidas, usuarios registrados, matriz interactiva de permisos RBAC y estado de salud del backend (`GET /actuator/health`).
- **Validación en Doble Capa**:
  - Validación instantánea en cliente mediante esquemas **Zod** sincronizados con las restricciones `@Valid` del backend Spring Boot.

---

## Stack Tecnológico

| Categoría | Tecnología |
| :--- | :--- |
| **Librería UI y Lenguaje** | React 19.3 + TypeScript 7 |
| **Bundler y Dev Server** | Vite 8 (`@vitejs/plugin-react`) |
| **Estilos e Iconos** | Tailwind CSS v4 (`@tailwindcss/vite`) + `lucide-react` |
| **Enrutamiento** | React Router v7 (`react-router-dom`) con *code-splitting* (`React.lazy`) |
| **Estado Global** | Zustand (`zustand` + middleware `persist`) |
| **Validación de Esquemas** | Zod (`zod`) |
| **Cliente HTTP** | Axios (`withCredentials: true` + interceptores `401`) |
| **Linter** | Oxlint (`oxlint`) |

---

## Estructura del Proyecto (`src/`)

```text
src/
├── components/
│   ├── auth/        # ProtectedRoute, AdminRoute, LoginForm, RegisterForm, DemoAccessButtons
│   ├── customers/   # CustomerToolbar, CustomerTable, CustomerCardGrid, CustomerFormModal, CustomerDetailModal
│   ├── dashboard/   # StatCard, RecentCustomersList, RbacMatrixCard
│   ├── invoices/    # InvoiceStatusBadge, InvoiceDetailModal, InvoiceFormModal
│   ├── layout/      # AppLayout, SidebarNav, Topbar
│   ├── ui/          # Modal, FormInput, ConfirmDialog, PaginationBar, RoleBadge, ToastContainer, etc.
│   └── users/       # UserToolbar, UserTable, UserFormModal, RoleSelectorCards
├── pages/           # LoginPage, RegisterPage, DashboardPage, CustomersPage, InvoicesPage, UsersPage
├── schemas/         # Esquemas Zod (authSchema, customerSchema, invoiceSchema, userSchema, zodUtils)
├── services/        # Cliente Axios y servicios REST (apiClient, authService, customerService, invoiceService, userService, actuatorService)
├── store/           # Stores de Zustand (useAuthStore, useCustomerStore, useInvoiceStore, useUserStore, useThemeStore, useToastStore)
└── types/           # Contratos TypeScript (api.ts)
```

---

## Requisitos Previos y Configuración

1. **Node.js** (v20+ recomendado) y **npm**.
2. El backend **`3-spring-api`** ejecutándose en `http://localhost:8080`.
   - El servidor de desarrollo de Vite redirige automáticamente las peticiones a `/api` y `/actuator` hacia `http://localhost:8080` mediante el proxy configurado en `vite.config.ts`.

---

## Instalación y Comandos Disponibles

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo en http://localhost:5173
npm run dev

# 3. Verificar tipos con TypeScript y compilar para producción en dist/
npm run build

# 4. Ejecutar el linter estático (Oxlint)
npm run lint

# 5. Previsualizar la build de producción localmente
npm run preview
```

---

## Rutas de la Aplicación y Permisos (RBAC)

| Ruta | Acceso | Descripción |
| :--- | :--- | :--- |
| `/login` | Público | Inicio de sesión y acceso rápido con cuentas demo (`ADMIN` / `USER`). |
| `/register` | Público | Registro de nuevas cuentas con rol `USER`. |
| `/` | `USER`, `ADMIN` | Panel de operaciones, métricas de negocio, estado de Actuator y matriz RBAC. |
| `/customers` | `USER` (lectura), `ADMIN` (CRUD) | Directorio de clientes, ficha detallada y acceso a sus facturas. |
| `/invoices` | `USER` (lectura), `ADMIN` (CRUD) | Gestión de facturación, filtrado por cliente/estado y desglose de líneas. |
| `/users` | Exclusivo `ADMIN` | Administración de usuarios, asignación de roles y contraseñas. |
