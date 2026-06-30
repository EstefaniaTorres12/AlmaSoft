# ALMASOFT MASTER DOCUMENT

> **Documento Maestro del Proyecto ALMASOFT**
>
> Este documento sirve como contexto principal para cualquier IA
> (Claude, Codex, ChatGPT, Gemini) o desarrollador que continúe el
> proyecto.

------------------------------------------------------------------------

# 1. Descripción del proyecto

## Nombre

ALMASOFT

## Objetivo

ALMASOFT es un sistema administrativo para una funeraria que integra un
panel de administración y un módulo de e-commerce.

El objetivo es administrar clientes, usuarios, categorías,
subcategorías, productos, planes fúnebres, contratos, compras y pagos,
permitiendo además que los clientes puedan comprar productos
relacionados con servicios funerarios.

------------------------------------------------------------------------

# 2. Stack tecnológico

## Frontend

-   React
-   React Router
-   Bootstrap / React-Bootstrap
-   Context API
-   CartContext

## Backend

-   Node.js
-   Express
-   JWT
-   MySQL

## Base de datos

MySQL (NO modificar su estructura).

------------------------------------------------------------------------

# 3. Restricciones obligatorias

Estas reglas SIEMPRE deben respetarse.

-   NO crear tablas nuevas.
-   NO crear columnas nuevas.
-   NO modificar el esquema de la BD.
-   NO cambiar la arquitectura.
-   NO renombrar rutas.
-   NO renombrar componentes.
-   NO romper el panel administrativo.
-   Mantener el diseño visual existente.
-   Reutilizar componentes antes de crear otros nuevos.
-   Utilizar únicamente la base de datos existente.

------------------------------------------------------------------------

# 4. Arquitectura general

## Frontend

-   Panel Administrativo
-   E-commerce
-   CartContext
-   ProductCard
-   CategoryProductsPage

## Backend

-   Controllers
-   Routes
-   Models
-   Middlewares
-   Utils

------------------------------------------------------------------------

# 5. Estado actual

## Fase 1 (Completada)

### Corregido

-   Carrito unificado.
-   Checkout real.
-   Eliminada confirmación falsa.
-   CartContext sincronizado.
-   Stock actualizado.
-   Pago registrado correctamente.
-   Validado frontend y backend.

------------------------------------------------------------------------

## Fase 2 (Completada — 100% ✅)

### Corregido

-   Eliminados datos estáticos principales.
-   Catálogo consume la API.
-   ProductCard reutilizable.
-   CategoryProductsPage reutilizable.
-   ProductosAtaud corregido (filtros por categoría/subcategoría + búsqueda por texto vía URL params).
-   PaginaInicio consume API (productos, planes, categorías, subcategorías).
-   Categorías adaptadas para consumir la API.
-   Build del frontend exitosa y sin warnings.
-   Bug SQL: `getCarrito` sin `categoria_nombre` ni `producto_stock` — corregido.
-   Bug SQL: `getProductos` (tienda cliente) sin `producto_imagen` — corregido.
-   URLs de imágenes inconsistentes en 7 componentes — unificadas con `utils/imageUrl.js`.
-   `useCallback` innecesario en `Tienda.js` — eliminado.
-   `frontend/.env` creado con `REACT_APP_API_URL=http://localhost:3005`.
-   `frontend/.env.production` creado con placeholder para URL de producción.
-   `frontend/.env.example` actualizado al puerto correcto (3005).
-   `backend/.env` actualizado: `PORT=3005` formalizado; `ALLOWED_ORIGINS` documentado para producción.
-   `App_js_HEAD_backup.js` eliminado del repositorio.
-   `backend/debugLogin.js` eliminado del repositorio.
-   Warnings de ESLint en todos los archivos — resueltos (build completamente limpio).
-   Variable `cartCount` sin uso en `Tienda.js` — eliminada.
-   Destructuración inútil `[prod, cart]` en `Tienda.js` — corregida a `[prod]`.
-   Variable `rol` sin uso en `Carrito.js` — eliminada (validación de rol delegada al backend).
-   Checkout: confirmación falsa por `setTimeout` eliminada. Invitados redirigidos a login.
-   Checkout: errores del backend ahora se muestran inline al usuario.
-   Checkout: `rol` eliminado del frontend — el backend es el único que valida permisos.
-   Historial de pagos: `pago_metodo` ahora parseado y presentado en campos legibles.
-   Historial de pagos: `contrato_id` técnico eliminado de la vista del usuario.
-   Historial de pagos: typo "aun" corregido a "aún".
-   HomeClient.js: placeholder "Logged In Successfully" eliminado.

------------------------------------------------------------------------

# 6. Problemas detectados inicialmente

-   Carrito duplicado.
-   Checkout falso.
-   Datos estáticos.
-   Endpoint de productos inconsistente.
-   Botones sin funcionalidad.
-   Código duplicado.
-   Historial de pagos frágil.
-   Flujo del e-commerce inconsistente.

------------------------------------------------------------------------

# 7. Objetivo del e-commerce

Flujo esperado:

Login

↓

Catálogo

↓

Detalle

↓

Carrito

↓

Checkout

↓

Pago

↓

Historial

------------------------------------------------------------------------

# 8. Componentes importantes

## CartContext

Responsable de sincronizar el carrito con la API manteniendo
compatibilidad con el frontend.

## ProductCard

Componente reutilizable para todos los productos.

## CategoryProductsPage

Wrapper reutilizable para todas las categorías.

------------------------------------------------------------------------

# 9. Convenciones de desarrollo

-   No duplicar código.
-   Reutilizar componentes.
-   Mantener Bootstrap.
-   Mantener el diseño existente.
-   Consumir datos desde la API.
-   No usar datos estáticos si la API ya los proporciona.

------------------------------------------------------------------------

# 10. Próximas fases

## Fase 3 (En progreso)

### Sprint 3.1 — Correcciones funcionales del historial (completado ✅)

-   `TuPlan.js`: eliminada `formatPaymentLabel` muerta; agregados `parsePagoMetodo` + `clasificarPago` locales; sección de pagos ahora muestra badge por tipo y descripción parseada; fecha corregida (sin componente de hora).
-   `Contrato.js`: función `describePago` para convertir `pago_metodo` a texto legible en tabla y en PDF exportado; estado vacío con CTA para usuario sin contrato activo; detección de HTTP 404 separada de errores reales.

### Sprint 3.2 — Correcciones backend del historial (completado ✅)

-   `getHistorialPagos` SQL: LEFT JOIN → subconsulta escalar para `plan_nombre` (elimina riesgo de filas duplicadas por `contrato_plan` con múltiples registros por `contrato_id`).
-   `checkoutCarrito` y `solicitarServicio`: fecha cambiada de `new Date().toISOString().slice(0,10)` (UTC) a `new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" })` (zona horaria Colombia).
-   `adquirirPlan` y `mejorarPlan`: fecha cambiada de `NOW()` MySQL (UTC) al mismo método Colombia; métodos de pago normalizados con `normalizarMetodoPago()`: "pse"→"PSE", "debito"→"Tarjeta débito", "credito"→"Tarjeta crédito", "efectivo*"→"Efectivo".

### Sprint 3.3 — Refactorización de utilidades compartidas (completado ✅)

**Nuevos módulos:**
-   `src/utils/formatters.js` — `formatPrice(value)`, `formatFecha(value)` (mes corto, es-CO)
-   `src/utils/payments.js` — `clasificarPago(metodo)`, `parsePagoMetodo(pago_metodo)`

**Limpieza por componente:**
-   `TuPlan.js`: eliminadas 4 funciones locales (`formatPrice`, `formatDate`, `clasificarPago`, `parsePagoMetodo`); renombrado `formatDate` → `formatFecha` en JSX
-   `Pagos.js`: eliminadas 3 funciones locales (`formatFecha`, `clasificarPago`, `parsePagoMetodo`)
-   `Servicios.js`: eliminada `formatPrice` local
-   `HomeClient.js`: eliminada `formatPrice` local
-   `PlanModal.js`: eliminada `formatPrice` local

**No tocado (intencional):**
-   `Contrato.js:formatFecha` — usa `month: "long"` para documento formal (comportamiento diferente)
-   `Afiliados.js:formatDate` — componente admin fuera de scope

### Pendiente

-   Sprint 3.4 — Auditoría de `clientOperations.controller.js`.

## Fase 4

-   Auditoría general.

## Fase 5 (En progreso)

### Sprint 5.1 — Correcciones responsive Alta/Media (completado ✅)

**Hallazgo durante implementación:**
-   PC-1 (`.plan-detail-hero` sin breakpoint) ya estaba resuelto en `clientPages.css` línea 895-898 con `grid-template-columns: 1fr` dentro del bloque `@media (max-width: 980px)`. El audit anterior leyó el archivo parcialmente. No requirió cambio.

**Cambios implementados:**
-   PC-2 `contrato.css`: añadido `display: block; overflow-x: auto; -webkit-overflow-scrolling: touch` a `.contrato-table` en `@media (max-width: 640px)` — la tabla del contrato ahora hace scroll horizontal en móvil en lugar de desbordar el layout.
-   PC-3 `homeClient.css`: añadido breakpoint intermedio `@media (max-width: 760px)` con `grid-template-columns: repeat(2, minmax(0, 1fr))` para `.client-stats-grid` — en tablet estrecha (640–760px) las estadísticas pasan de 3 a 2 columnas en lugar de colapsar directamente a 1.
-   LP-1 `BarraPrincipal.css` + `BarraPrincipal.js`: menú hamburguesa mobile ahora incluye sección de navegación de categorías (Inicio, Ataúdes, Urnas, Lápidas, Arreglos Florales, Todos los productos); max-height del menú expandido aumentada de 280px a 560px; añadidos estilos `.hdr-mobile-nav` y `.hdr-mobile-link`.

**Build:** 0 warnings, 0 errores. Bundle JS 156.66 kB (+80 B), CSS 51.88 kB (+83 B).

------------------------------------------------------------------------

# 11. Checklist

-   [x] Carrito
-   [x] Checkout
-   [x] API catálogo
-   [x] ProductCard reutilizable
-   [x] CategoryProductsPage
-   [x] Build sin warnings
-   [x] Configuración de entorno (.env)
-   [x] Checkout invitados — flujo correcto y sin confirmaciones falsas
-   [x] Historial de pagos — presentación legible desde BD
-   [ ] Responsive
-   [ ] Historial completo
-   [ ] Optimización
-   [ ] Testing completo
-   [ ] Deploy final

------------------------------------------------------------------------

# 12. Instrucciones para cualquier IA

1.  Lee completamente este documento antes de modificar el proyecto.
2.  Respeta todas las restricciones.
3.  Trabaja por fases.
4.  Antes de modificar archivos importantes explica qué cambiarás y por
    qué.
5.  No continúes con la siguiente fase sin autorización.
6.  Ejecuta pruebas cuando corresponda.
7.  Entrega un informe al finalizar cada fase.
8.  Si una mejora requiere modificar la base de datos o la arquitectura,
    detente y solicita aprobación.

------------------------------------------------------------------------

# Nota

Este documento es la referencia principal del proyecto y debe mantenerse
actualizado conforme avance el desarrollo.
