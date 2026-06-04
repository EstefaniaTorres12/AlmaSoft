// Fuente única de verdad para roles, rutas y sesión.
// Toda la lógica de autenticación/autorización del frontend
// debe importar desde aquí, nunca definir strings de roles en línea.

export const ROLES = {
  ADMINISTRADOR: "Administrador",
  ASESOR:        "Asesor",
  CLIENTE:       "Cliente",
  AFILIADO:      "Afiliado",
};

// Panel al que debe ir cada rol después del login o cuando accede a una ruta prohibida
export const DESTINO_POR_ROL = {
  [ROLES.ADMINISTRADOR]: "/usuarios",
  [ROLES.ASESOR]:        "/usuarios",
  [ROLES.CLIENTE]:       "/client",
  [ROLES.AFILIADO]:      "/client/afiliados",
};

export function getRutaPorRol(rol) {
  return DESTINO_POR_ROL[rol] || "/pages/IniciarSesion";
}

export function getSession() {
  return {
    token:      localStorage.getItem("token"),
    rol:        localStorage.getItem("rol") || "",
    usuario_id: localStorage.getItem("usuario_id"),
    usuario:    JSON.parse(localStorage.getItem("usuario") || "{}"),
  };
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  localStorage.removeItem("usuario_id");
  localStorage.removeItem("usuario");
  window.location.href = "/pages/IniciarSesion";
}
