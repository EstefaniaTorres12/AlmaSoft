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
import Lapida from "./components/productos/Lapida";
import ArreglosFlorales from "./components/productos/ArregloFloral";

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
import CategoriaFront from './components/admin/Categorias';
import AgregarCategoria from './components/admin/AgregarCategoria';
import EditarCategoria from './components/admin/EditarCategoria';
import SubCategoriaFront from './components/admin/SubCategoriaFront';
import AgregarSubCategoria from './components/admin/AgregarSubCategoria';
import EditarSubCategoria from './components/admin/EditarSubCategoria';
import ProductoFront from './components/admin/ProductoFront';
import AgregarProducto from './components/admin/AgregarProducto';
import EditarProducto from './components/admin/EditarProducto';
import PlanFront from './components/admin/PlanFront';
import AgregarPlan from './components/admin/AgregarPlan';
import EditarPlan from './components/admin/EditarPlan';


import { useEffect } from "react";
import ArreglosFloral from './components/productos/ArregloFloral';


function App() {

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#D8CFE8";

  }, []);

  const location = useLocation();
  const isLogin = location.pathname === "/pages/IniciarSesion";
  const isRegister = location.pathname === "/pages/Registrarse";

  const isAuthPage =
    location.pathname === "/pages/IniciarSesion" ||
    location.pathname === "/pages/Registrarse";

  const isAdminPage =
    location.pathname.startsWith("/clientes") ||
    location.pathname.startsWith("/usuarios") ||
    location.pathname.startsWith("/categorias") ||
    location.pathname.startsWith("/subcategorias") ||
    location.pathname.startsWith("/productos/agregar") ||
    location.pathname.startsWith("/productos/ProductoFront") ||
    location.pathname.startsWith("/productos/editar") ||
    location.pathname.startsWith("/planes") ||
    location.pathname.startsWith("/admin");

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
        <Route path="/productos/lapida" element={<Lapida />} />
        <Route path="/productos/arreglos-florales" element={<ArreglosFlorales />} />
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

        <Route
          path="/admin/CategoriaFront"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <CategoriaFront />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/categorias/agregar"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <AgregarCategoria />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/categorias/editar/:id"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <EditarCategoria />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/SubCategoriaFront"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <SubCategoriaFront />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/subcategorias/agregar"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <AgregarSubCategoria />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/subcategorias/editar/:id"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <EditarSubCategoria />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/ProductoFront"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <ProductoFront />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/productos/agregar"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <AgregarProducto />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/productos/editar/:id"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", height: "150vh" }}>
                <EditarProducto />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/Planes"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", minHeight: "100vh" }}>
                <PlanFront />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/planes/agregar"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", minHeight: "100vh" }}>
                <AgregarPlan />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path="/planes/editar/:id"
          element={
            <RutaProtegida>
              <SideBar />
              <div style={{ marginLeft: "200px", background: "#D8CFE8", minHeight: "100vh" }}>
                <EditarPlan />
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