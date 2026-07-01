// Fuente única de verdad para roles, rutas y sesión.
// Toda la lógica de autenticación/autorización del frontend
// debe importar desde aquí, nunca definir strings de roles en línea.

export const ROLES = {
  ADMINISTRADOR: "Administrador",
  ASESOR:        "Asesor",
  CLIENTE:       "Cliente",
  AFILIADO:      "Afiliado",
};

// Redirección por nombre de rol (usado por RutaProtegida)
export const DESTINO_POR_ROL = {
  [ROLES.ADMINISTRADOR]: "/usuarios",
  [ROLES.ASESOR]:        "/asesor",
  [ROLES.CLIENTE]:       "/client",
  [ROLES.AFILIADO]:      "/client/afiliados",
};

// Redirección por rol_id numérico (usado por IniciarSesion después del login)
// rol_id = 1 → Cliente, 2 → Asesor, 3 → Administrador
export const DESTINO_POR_ROL_ID = {
  1: "/client",    // Cliente
  2: "/asesor",    // Asesor
  3: "/usuarios",  // Administrador
};

export function getRutaPorRol(rol) {
  return DESTINO_POR_ROL[rol] || "/pages/IniciarSesion";
}

export function getSession() {
  return {
    token:      localStorage.getItem("token"),
    rol:        localStorage.getItem("rol") || "",
    rol_id:     Number(localStorage.getItem("rol_id")) || null,
    usuario_id: localStorage.getItem("usuario_id"),
    usuario:    JSON.parse(localStorage.getItem("usuario") || "{}"),
  };
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("rol_id");
  localStorage.removeItem("usuario_id");
  localStorage.removeItem("usuario");
  window.location.href = "/pages/IniciarSesion";
}
