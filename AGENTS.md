# AGENTS.md - Resumen del Proyecto `4-react-app`

## 1. Descripción General
Aplicación frontend **Single Page Application (SPA)** construida con **React 19, TypeScript y Tailwind CSS v4** para consumir la API RESTful de `3-spring-api`. Implementa gestión de estado global con **Zustand**, validación en doble capa con **Zod + Spring Boot `@Valid`**, autenticación mediante **cookies `HttpOnly` (`jwt_token`)** y control de acceso basado en roles (**RBAC**: `USER` y `ADMIN`) para los módulos de Clientes, Facturación y Usuarios.

## 2. Stack Tecnológico y Configuración
- **Runtime / Bundler**: Node.js + **Vite 8** (`@vitejs/plugin-react`)
- **Lenguaje y Framework UI**: **React 19.3** + **TypeScript 7**
- **Estilos e Iconografía**: **Tailwind CSS v4** (`@tailwindcss/vite`) con soporte **Dark / Light Mode** (`.dark`) + `lucide-react`
- **Enrutamiento**: `react-router-dom` (rutas públicas, protegidas con permisos granulares y exclusivas `ADMIN`)
- **Estado Global (Store)**: **Zustand** (`zustand` + middleware `persist`)
- **Validación de Formularios**: **Zod** (`zod`) sincronizado con las reglas Jakarta Validation del backend
- **Cliente HTTP**: **Axios** (`withCredentials: true`) + Proxy de desarrollo en `vite.config.ts` (`/api` y `/actuator` -> `${VITE_BACKEND_URL}`)
- **Variables de Entorno (`.env`)**:
  - `VITE_BACKEND_URL`: URL base del backend para el proxy de desarrollo Vite (`http://localhost:8080`).
  - `VITE_API_BASE_URL`: URL base global de Axios (por defecto vacía para usar el proxy local o mismo dominio).
  - `VITE_AUTH_BASE_URL`: Prefijo para endpoints de autenticación (`/api/auth`).
  - `VITE_CUSTOMERS_BASE_URL`: Prefijo para endpoints de clientes (`/api/customers`).
  - `VITE_INVOICES_BASE_URL`: Prefijo para endpoints de facturación (`/api/invoices`).
  - `VITE_USERS_BASE_URL`: Prefijo para endpoints de usuarios (`/api/users`).
  - `VITE_ACTUATOR_BASE_URL`: Prefijo para endpoints de salud y Actuator (`/actuator`).

## 3. Estructura de Directorios (`src/`)
- **`config/`**: Configuración centralizada de rutas base de endpoints consumiendo `import.meta.env` (`apiConfig.ts`).
- **`types/`**: Contratos TypeScript espejo del backend (`api.ts`: `Role`, `UserDto`, `UserRequestDto`, `AuthRequestDto`, `CustomerDto`, `InvoiceStatus`, `InvoiceItemDto`, `InvoiceDto`, `ErrorResponse`, `FieldErrors`).
- **`schemas/`**: Esquemas declarativos de **Zod** y utilidades de mapeo (`authSchema.ts`, `customerSchema.ts`, `invoiceSchema.ts`, `userSchema.ts`, `zodUtils.ts`).
- **`services/`**: Capa de comunicación HTTP con Axios (`apiClient.ts` con interceptor `401` y parser de errores `@Valid`, `authService.ts`, `customerService.ts`, `invoiceService.ts`, `userService.ts`, `actuatorService.ts`).
- **`store/`**: Stores reactivos de **Zustand**:
  - `useAuthStore.ts`: Sesión del usuario (`UserDto`) persistida en `localStorage` y auto-limpieza ante eventos `401 Unauthorized`.
  - `useCustomerStore.ts`: Estado CRUD, búsqueda, paginación y modo de vista (`table` | `cards`) de clientes.
  - `useInvoiceStore.ts`: Estado CRUD, búsqueda por texto, filtro por estado (`ALL` | `PAID` | `PENDING` | `OVERDUE` | `CANCELLED`), filtro por cliente (`customerFilter`) y paginación de facturas.
  - `useUserStore.ts`: Estado CRUD, búsqueda por email y filtro por rol (`ALL` | `ADMIN` | `USER`) de usuarios.
  - `useThemeStore.ts`: Estado persistido del tema (`light` | `dark`) sincronizado con `document.documentElement`.
  - `useToastStore.ts`: Cola global de notificaciones flotantes (`success`, `error`, `warning`, `info`).
- **`components/`**: Arquitectura modular de componentes pequeños de responsabilidad única:
  - `ui/`: `FormInput`, `Modal`, `ConfirmDialog`, `PaginationBar`, `RoleBadge`, `EmptyState`, `LoadingState`, `ToastContainer`.
  - `layout/`: `AppLayout`, `SidebarNav` (accesos a Resumen, Clientes `CRM`, Facturas `ERP` y Usuarios `ADMIN`), `Topbar`.
  - `auth/`: `ProtectedRoute`, `AdminRoute`, `LoginForm`, `RegisterForm`, `DemoAccessButtons`.
  - `dashboard/`: `StatCard`, `RecentCustomersList`, `RbacMatrixCard`.
  - `customers/`: `CustomerToolbar`, `CustomerTable`, `CustomerTableRow`, `CustomerCardGrid`, `CustomerCard`, `CustomerFormModal`, `CustomerDetailModal` (incluye listado de facturas asociadas al cliente y enlace a `/invoices?customerId={id}`).
  - `invoices/`: `InvoiceStatusBadge`, `InvoiceDetailModal` (desglose de líneas, subtotales e importe total), `InvoiceFormModal` (editor dinámico de líneas de factura validado con Zod).
  - `users/`: `UserToolbar`, `UserTable`, `UserTableRow` (protección anti auto-eliminación del `ADMIN` activo), `RoleSelectorCards`, `UserFormModal`.
- **`pages/`**: Vistas principales ensambladoras (`LoginPage`, `RegisterPage`, `DashboardPage`, `CustomersPage`, `InvoicesPage`, `UsersPage`).

## 4. Rutas y Control de Acceso (RBAC)
| Ruta | Acceso | Componentes Principales | Endpoints Consumidos |
| :--- | :--- | :--- | :--- |
| `/login` | Público | `LoginPage`, `LoginForm`, `DemoAccessButtons` | `POST /api/auth/login` |
| `/register` | Público | `RegisterPage`, `RegisterForm` | `POST /api/auth/register` |
| `/` | `USER`, `ADMIN` | `DashboardPage`, `StatCard`, `RecentCustomersList`, `RbacMatrixCard` | `GET /actuator/health`, `GET /api/customers`, `GET /api/invoices`, `GET /api/users` |
| `/customers` | `USER` (lectura), `ADMIN` (CRUD) | `CustomersPage`, `CustomerTable`, `CustomerCardGrid`, `CustomerFormModal`, `CustomerDetailModal` | `GET`, `POST`, `PUT`, `DELETE /api/customers/**` y `GET /api/customers/{id}/invoices` |
| `/invoices` | `USER` (lectura), `ADMIN` (CRUD) | `InvoicesPage`, `InvoiceDetailModal`, `InvoiceFormModal`, `InvoiceStatusBadge` | `GET`, `POST`, `PUT`, `DELETE /api/invoices/**` |
| `/users` | Exclusivo `ADMIN` | `UsersPage`, `UserTable`, `UserFormModal`, `RoleSelectorCards` | `GET`, `POST`, `PUT`, `DELETE /api/users/**` |

## 5. Skills Disponibles (`.agents/skills/`) y Casos de Uso
| Skill | Ruta | Cuándo Utilizarla (Casos de Uso) |
| :--- | :--- | :--- |
| **`frontend-design`** | `.agents/skills/frontend-design/SKILL.md` | Al crear nuevas vistas, rediseñar componentes UI/UX, definir paletas de color (Light/Dark), tipografía, micro-interacciones o mejorar el acabado visual con Tailwind CSS. |
| **`vercel-react-best-practices`** | `.agents/skills/vercel-react-best-practices/SKILL.md` | Al escribir, revisar o refactorizar componentes React 19, hooks, efectos (`useEffect`), carga de datos (`Promise.allSettled`), estado derivado (`useMemo`) y optimización de bundles. |

## 6. Reglas y Convenciones de Desarrollo
1. **Modularidad**: Mantener componentes pequeños y atómicos (separar tablas, filas `<tr>`, tarjetas, modales y formularios en archivos propios).
2. **Doble Validación**: Validar siempre primero en cliente con **Zod** (`safeParse` + `extractZodFieldErrors`) y mapear también los errores `400` del backend (`parseApiError`) en `fieldErrors`.
3. **Estado Global**: Utilizar exclusivamente stores de **Zustand** en `src/store/` (no introducir `React Context` redundantes).
4. **Seguridad y Cookies**: Todas las llamadas HTTP deben pasar por `apiClient` (`withCredentials: true`) y el proxy de Vite para preservar la cookie `jwt_token` (`HttpOnly`).

## 7. Comandos Frecuentes
- **Servidor de desarrollo** (`http://localhost:5173`): `npm run dev`
- **Compilar para producción**: `npm run build` (`tsc -b && vite build`)
- **Linter estático**: `npm run lint` (`oxlint`)
- **Previsualizar build**: `npm run preview`
