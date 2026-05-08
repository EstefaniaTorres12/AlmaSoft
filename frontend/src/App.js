import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

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
import Lapida from './components/productos/Lapida';
import ArreglosFlorales from './components/productos/ArregloFloral';

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
import AfiliacionesAdmin from './components/admin/AfiliacionesAdmin';

/* CLIENTE */
import HomeClient from './components/client/pages/HomeClient';
import TuPlan from './components/client/pages/TuPlan';
import Afiliados from './components/client/pages/Afiliados';
import Contrato from './components/client/pages/Contrato';
import Servicios from './components/client/pages/Servicios';
import Pagos from './components/client/pages/Pagos';
import Sedes from './components/client/pages/Sedes';
import Perfil from './components/client/pages/Perfil';

/* ASESOR */
import AsesorLayout from './components/asesor/layout/AsesorLayout';
import HomeAsesor from './components/asesor/pages/HomeAsesor';
import ClientesFrontAsesor from './components/asesor/pages/ClientesFront';
import AgregarClienteAsesor from './components/asesor/AgregarCliente';
import EditarClienteAsesor from './components/asesor/EditarCliente';
import DetallesClienteAsesor from './components/asesor/DetallesCliente';
import PlanesFrontAsesor from './components/asesor/pages/PlanesFront';
import EditarPlanAsesor from './components/asesor/EditarPlanAsesor';
import ProductosFrontAsesor from './components/asesor/pages/ProductosFront';
import AfiliacionesAsesor from './components/asesor/pages/AfiliacionesFront';
import PerfilAsesor from './components/asesor/pages/PerfilAsesor';
import RegistrarAfiliadoAsesor from './components/asesor/RegistrarAfiliado';
import EditarAfiliadoAsesor from './components/asesor/EditarAfiliadoAsesor';

function App() {
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
   
  }, []);

  const location = useLocation();

  const isAuthPage =
    location.pathname === '/pages/IniciarSesion' ||
    location.pathname === '/pages/Registrarse';

  const isAdminPage =
    location.pathname.startsWith('/clientes') ||
    location.pathname.startsWith('/usuarios') ||
    location.pathname.startsWith('/categorias') ||
    location.pathname.startsWith('/subcategorias') ||
    location.pathname.startsWith('/productos/agregar') ||
    location.pathname.startsWith('/productos/ProductoFront') ||
    location.pathname.startsWith('/productos/editar') ||
    location.pathname.startsWith('/planes') ||
    location.pathname.startsWith('/admin');

  const isAsesorPage = location.pathname.startsWith('/asesor');
  const isClientPage = location.pathname.startsWith('/client');
  const hideHeader = isAuthPage || isAdminPage || isAsesorPage || isClientPage;

  return (
    <>
      {!hideHeader && (
        <>
          <BarraPrincipal />
          <BarraNavegacion />
        </>
      )}

      <Routes>
        {/* PÚBLICAS */}
        <Route path='/' element={<PaginaInicio />} />
        <Route path='/productos/Ataud' element={<Ataud />} />
        <Route path='/productos/Urna' element={<Urna />} />
        <Route path='/productos/lapida' element={<Lapida />} />
        <Route path='/productos/arreglos-florales' element={<ArreglosFlorales />} />
        <Route path='/productos/ProductosAtaud' element={<ProductosAtaud />} />
        <Route path='/pages/AcercaDeNosotros' element={<AcercaDeNosotros />} />
        <Route path='/pages/IniciarSesion' element={<IniciarSesion />} />
        <Route path='/pages/Registrarse' element={<Registrarse />} />

        {/* ADMIN */}
        <Route
          path='/clientes/Cliente'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <Cliente />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/clientes/AgregarCliente'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <AgregarCliente />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/clientes/EditarCliente/:id'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <EditarCliente />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/usuarios/DetallesCliente/:id'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <DetallesCliente />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/usuarios'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <UsuarioFront />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/usuarios/AgregarUsuario'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <AgregarUsuario />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/usuarios/EditarUsuario/:id'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <EditarUsuario />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/usuarios/DetallesUsuario/:id'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <DetallesUsuario />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/admin/CategoriaFront'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <CategoriaFront />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/categorias/agregar'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <AgregarCategoria />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/categorias/editar/:id'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <EditarCategoria />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/admin/SubCategoriaFront'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <SubCategoriaFront />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/subcategorias/agregar'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <AgregarSubCategoria />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/subcategorias/editar/:id'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <EditarSubCategoria />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/admin/ProductoFront'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <ProductoFront />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/productos/agregar'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <AgregarProducto />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/productos/editar/:id'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', height: '150vh' }}>
                <EditarProducto />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/admin/Planes'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', minHeight: '100vh' }}>
                <PlanFront />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/planes/agregar'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', minHeight: '100vh' }}>
                <AgregarPlan />
              </div>
            </RutaProtegida>
          }
        />

        <Route
          path='/planes/editar/:id'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', minHeight: '100vh' }}>
                <EditarPlan />
              </div>
            </RutaProtegida>
          }
        />

        {/* CLIENTE */}
        <Route
          path='/client'
          element={
            <RutaProtegida rolPermitido='Cliente'>
              <HomeClient />
            </RutaProtegida>
          }
        />

        <Route
          path='/admin/afiliaciones'
          element={
            <RutaProtegida rolPermitido={['Administrador', 'Asesor']}>
              <SideBar />
              <div style={{ marginLeft: '200px', background: '#D8CFE8', minHeight: '100vh' }}>
                <AfiliacionesAdmin />
              </div>
            </RutaProtegida>
          }
        />
        <Route
          path='/client/plan'
          element={
            <RutaProtegida rolPermitido='Cliente'>
              <TuPlan />
            </RutaProtegida>
          }
        />
        <Route
          path='/client/afiliados'
          element={
            <RutaProtegida rolPermitido={['Cliente', 'Afiliado']}>
              <Afiliados />
            </RutaProtegida>
          }
        />
        <Route
          path='/client/contrato'
          element={
            <RutaProtegida rolPermitido='Cliente'>
              <Contrato />
            </RutaProtegida>
          }
        />
        <Route
          path='/client/pagos'
          element={
            <RutaProtegida rolPermitido='Cliente'>
              <Pagos />
            </RutaProtegida>
          }
        />
        <Route
          path='/client/sedes'
          element={
            <RutaProtegida rolPermitido='Cliente'>
              <Sedes />
            </RutaProtegida>
          }
        />
        <Route
          path='/client/contacto'
          element={
            <RutaProtegida rolPermitido='Cliente'>
              <Servicios />
            </RutaProtegida>
          }
        />
        <Route
          path='/client/perfil'
          element={
            <RutaProtegida rolPermitido={['Cliente', 'Afiliado']}>
              <Perfil />
            </RutaProtegida>
          }
        />

        {/* ASESOR */}
        <Route
          path='/asesor'
          element={
            <RutaProtegida rolPermitido='Asesor'>
              <AsesorLayout>
                <HomeAsesor />
              </AsesorLayout>
            </RutaProtegida>
          }
        />

        <Route
          path='/asesor/clientes'
          element={
            <RutaProtegida rolPermitido='Asesor'>
              <AsesorLayout>
                <ClientesFrontAsesor />
              </AsesorLayout>
            </RutaProtegida>
          }
        />

        <Route
          path='/asesor/clientes/agregar'
          element={
            <RutaProtegida rolPermitido='Asesor'>
              <AsesorLayout>
                <AgregarClienteAsesor />
              </AsesorLayout>
            </RutaProtegida>
          }
        />

        <Route
          path='/asesor/clientes/editar/:id'
          element={
            <RutaProtegida rolPermitido='Asesor'>
              <AsesorLayout>
                <EditarClienteAsesor />
              </AsesorLayout>
            </RutaProtegida>
          }
        />

        <Route
          path='/asesor/clientes/detalles/:id'
          element={
            <RutaProtegida rolPermitido='Asesor'>
              <AsesorLayout>
                <DetallesClienteAsesor />
              </AsesorLayout>
            </RutaProtegida>
          }
        />

        <Route
          path='/asesor/planes'
          element={
            <RutaProtegida rolPermitido='Asesor'>
              <AsesorLayout>
                <PlanesFrontAsesor />
              </AsesorLayout>
            </RutaProtegida>
          }
        />

        <Route
          path='/asesor/planes/editar/:id'
          element={
            <RutaProtegida rolPermitido='Asesor'>
              <AsesorLayout>
                <EditarPlanAsesor />
              </AsesorLayout>
            </RutaProtegida>
          }
        />

        <Route
          path='/asesor/productos'
          element={
            <RutaProtegida rolPermitido='Asesor'>
              <AsesorLayout>
                <ProductosFrontAsesor />
              </AsesorLayout>
            </RutaProtegida>
          }
        />

        <Route
          path='/asesor/afiliados'
          element={
            <RutaProtegida rolPermitido='Asesor'>
              <AsesorLayout>
                <AfiliacionesAsesor />
              </AsesorLayout>
            </RutaProtegida>
          }
        />

        <Route
          path='/asesor/afiliados/registrar'
          element={
            <RutaProtegida rolPermitido='Asesor'>
              <AsesorLayout>
                <RegistrarAfiliadoAsesor />
              </AsesorLayout>
            </RutaProtegida>
          }
        />

        <Route
          path='/asesor/afiliados/editar/:id'
          element={
            <RutaProtegida rolPermitido='Asesor'>
              <AsesorLayout>
                <EditarAfiliadoAsesor />
              </AsesorLayout>
            </RutaProtegida>
          }
        />

        <Route
          path='/asesor/perfil'
          element={
            <RutaProtegida rolPermitido='Asesor'>
              <AsesorLayout>
                <PerfilAsesor />
              </AsesorLayout>
            </RutaProtegida>
          }
        />

        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  );
}

export default App;
