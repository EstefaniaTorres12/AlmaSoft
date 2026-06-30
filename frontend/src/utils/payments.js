export function clasificarPago(metodo) {
  const m = (metodo || "").toLowerCase();
  if (m.startsWith("tienda"))   return { label: "Tienda",   color: "#3a7bd5", bg: "#e8f0ff" };
  if (m.startsWith("servicio")) return { label: "Servicio", color: "#6a5acd", bg: "#f0eeff" };
  return                               { label: "Plan",     color: "#2e7b59", bg: "#e1f5e9" };
}

export function parsePagoMetodo(pago_metodo) {
  if (!pago_metodo) return { tipo: "desconocido" };
  const partes = pago_metodo.split(" | ");
  const prefix = (partes[0] || "").toLowerCase().trim();
  if (prefix === "tienda") {
    return { tipo: "tienda", metodo: partes[1] || "", productos: partes[2] || "", total: partes[3] || "" };
  }
  if (prefix === "servicio") {
    return { tipo: "servicio", nombre: partes[1] || "", metodo: partes[2] || "", total: partes[3] || "" };
  }
  return { tipo: "plan" };
}
