import { Navigate } from "react-router-dom";
import { getRutaPorRol } from "../../utils/auth";

/**
 * Guarda rutas según rol.
 *
 * - Sin token         → redirige a login
 * - Token + rol válido → renderiza children
 * - Token + rol inválido → redirige al panel del rol actual (no a "/")
 */
const RutaProtegida = ({ children, rolPermitido }) => {
  const token = localStorage.getItem("token");
  const rol   = localStorage.getItem("rol") || "";

  if (!token) {
    return <Navigate to="/pages/IniciarSesion" replace />;
  }

  if (rolPermitido) {
    const rolesPermitidos = Array.isArray(rolPermitido) ? rolPermitido : [rolPermitido];

    if (!rolesPermitidos.includes(rol)) {
      return <Navigate to={getRutaPorRol(rol)} replace />;
    }
  }

  return children;
};

export default RutaProtegida;
