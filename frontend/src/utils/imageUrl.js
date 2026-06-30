const DEFAULT_IMAGE = '/img/default.png';

/**
 * Construye la URL correcta para una imagen de producto.
 *
 * Las imágenes se almacenan en frontend/public/ y son servidas por el
 * servidor del frontend (no el backend). El valor en BD ya incluye la
 * barra inicial: /img/Ataud1.jpg o /uploads/timestamp-random.jpg.
 *
 * @param {string|null} imagen - Valor de producto_imagen proveniente de la API.
 * @returns {string} URL absoluta desde la raíz del frontend.
 */
export const getProductImageUrl = (imagen) => {
  if (!imagen) return DEFAULT_IMAGE;
  return imagen;
};

export { DEFAULT_IMAGE };
