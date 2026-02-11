import { Navigate } from "react-router-dom";

const RutaProtegida = ({ children, rolPermitido }) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (rolPermitido && rol !== rolPermitido) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RutaProtegida;