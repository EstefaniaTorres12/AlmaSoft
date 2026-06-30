export function formatPrice(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return value || "No disponible";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(number);
}

export function formatFecha(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
