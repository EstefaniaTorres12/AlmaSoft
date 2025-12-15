import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React, { createContext } from 'react';
import SideBar from './components/SideBar';
import BarraCliente from './components/clientes/BarraCliente';
import Cliente from './components/clientes/Cliente';
import AgregarCliente from './components/clientes/AgregarCliente';
import EditarCliente from './components/clientes/EditarCliente';
import DetallesCliente from './components/clientes/DetallesCliente';
import Usuario from './components/usuarios/Usuario';
import EditarUsuario from './components/usuarios/EditarUsuario';
import DetallesUsuario from './components/usuarios/DetallesUsuario';
import AgregarUsuario from './components/usuarios/AgregarUsuario';
import Categorias from './components/categorias/categorias.jsx';
import Planes from './components/planes/planes.jsx';
import Compras from './components/compras/compras.jsx';
import Tramites from './components/tramites/tramites';
import Cronograma from './components/cronograma/cronograma';
import Inicio from './components/Inicio/inicio.jsx';
import Admin from './components/admin/Admin.jsx';
import ProductosAtaud from './components/pages/ProductosAtaud';
import ProductoConAPI from './components/pages/ProductoConAPI';
import Bodega from './components/bodega/bodega.jsx';

// Mock useToast para compatibilidad con componentes existentes
export const ToastContext = createContext();

export const useToast = () => {
  const showToast = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}]: ${message}`);
    // En producción, aquí se mostraría un toast real
  };
  return {
    info: (msg) => showToast(msg, 'info'),
    success: (msg) => showToast(msg, 'success'),
    warning: (msg) => showToast(msg, 'warning'),
    error: (msg) => showToast(msg, 'error'),
  };
};

function App() {
  return (
  <>
   <Router>
    
    <SideBar />
    
    <div style={{ marginLeft: "200px", background:"#D8CFE8",  height: "150vh" }}>
      <BarraCliente/>
      
        <Routes>
          {/* Ruta de inicio */}
          <Route path='/' element={<Inicio/>}></Route>

          {/* Rutas de cliente */}
          <Route path='/clientes/Cliente' element={<Cliente/>}></Route>
          <Route path='/clientes/AgregarCliente' element={<AgregarCliente/>}></Route>
          <Route path='/clientes/editar/:id' element={<EditarCliente/>}></Route>
          <Route path='/clientes/detalles/:id' element={<DetallesCliente/>}></Route>
          
          {/* Rutas del usuario */}
          <Route path='/usuarios/Usuario' element={<Usuario/>}></Route>
          <Route path='/usuarios/AgregarUsuario' element={<AgregarUsuario/>}></Route>
          <Route path='/usuarios/EditarUsuario/:id' element={<EditarUsuario/>}></Route>
          <Route path='/usuarios/detalles/:id' element={<DetallesUsuario/>}></Route>

          {/* Rutas de categorías */}
          <Route path='/categorias' element={<Categorias/>}></Route>

          {/* Ruta admin */}
          <Route path='/admin' element={<Admin/>}></Route>

          {/* Rutas de planes */}
          <Route path='/planes' element={<Planes/>}></Route>

          {/* Rutas de compras */}
          <Route path='/compras' element={<Compras/>}></Route>

          {/* Rutas de productos */}
          <Route path='/productos-ataud' element={<ProductosAtaud/>}></Route>
          <Route path='/productos' element={<ProductoConAPI/>}></Route>

          {/* Rutas de bodega */}
          <Route path='/bodega' element={<Bodega/>}></Route>

          {/* Rutas de trámites */}
          <Route path='/tramites' element={<Tramites/>}></Route>

          {/* Rutas de cronograma */}
          <Route path='/cronograma' element={<Cronograma/>}></Route>
        </Routes>
      </div>
   </Router>
   </>
  );
}

export default App;
