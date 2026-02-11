import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

/* PÚBLICO */
import PaginaInicio from './components/pages/PaginaInicio';
import ProductosAtaud from './components/productos/ProductosAtaud';
import AcercaDeNosotros from './components/pages/AcercaDeNosotros';
import IniciarSesion from './components/pages/IniciarSesion';
import Registrarse from './components/pages/Registrarse';
import BarraPrincipal from './components/pages/BarraPrincipal';
import BarraNavegacion from './components/pages/BarraNavegacion';
import Urna from './components/productos/Urna';
import Ataud from './components/productos/Ataud';

/* ADMIN */
import SideBar from './components/SideBar';
import Cliente from './components/clientes/Cliente';
import UsuarioFront from './components/usuarios/UsuarioFront';
import RutaProtegida from './components/pages/RutaProtegida';
import AgregarCliente from './components/clientes/AgregarCliente';
import AgregarUsuario from './components/usuarios/AgregarUsuario';
import DetallesUsuario from './components/usuarios/DetallesUsuario';
import EditarUsuario from './components/usuarios/EditarUsuario';
import EditarCliente from './components/clientes/EditarCliente';
import DetallesCliente from './components/clientes/DetallesCliente';

function App() {
  const location = useLocation();
  const isLogin = location.pathname === "/pages/IniciarSesion";
  const isRegister = location.pathname === "/pages/Registrarse";

  const isAuthPage =
    location.pathname === "/pages/IniciarSesion" ||
    location.pathname === "/pages/Registrarse";

  const isAdminPage =
    location.pathname.startsWith("/clientes") ||
    location.pathname.startsWith("/usuarios");

  return (
    <>
      {/* BARRAS SOLO SI NO ES LOGIN / REGISTER */}
      {!isAuthPage && !isAdminPage && (
        <>
          <BarraPrincipal />
          <BarraNavegacion />
        </>
      )}

      <Routes>
        {/* PÚBLICAS */}
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/productos/Ataud" element={<Ataud />} />
        <Route path="/productos/Urna" element={<Urna />} />
        <Route path="/productos/ProductosAtaud" element={<ProductosAtaud />} />
        <Route path="/pages/AcercaDeNosotros" element={<AcercaDeNosotros />} />
        <Route path="/pages/IniciarSesion" element={<IniciarSesion />} />
        <Route path="/pages/Registrarse" element={<Registrarse />} />

        {/* ADMIN */}
        <Route
          path="/clientes/Cliente"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <Cliente />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/clientes/AgregarCliente'
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <AgregarCliente />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/clientes/EditarCliente/:id'
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <EditarCliente />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/usuarios/DetallesCliente/:id"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <DetallesCliente />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/usuarios"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <UsuarioFront />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/usuarios/AgregarUsuario"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <AgregarUsuario />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/usuarios/EditarUsuario/:id"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <EditarUsuario />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/usuarios/DetallesUsuario/:id"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <DetallesUsuario />
              </div>
            </RutaProtegida>
          }
        />






        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;