import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import PaginaInicio from './components/pages/PaginaInicio';
import BarraNavegacion from './components/pages/BarraNavegacion';
import Carrusel from './components/pages/Carrusel';
import BarraPrincipal from './components/pages/BarraPrincipal';
import ContactenosFooter from './components/pages/ContactenosFooter';
import InisiarSesion from './components/pages/IniciarSesion';
import Registrarse from './components/pages/Registrarse';
import ProductosAtaud from './components/pages/ProductosAtaud';
import AcercaDeNosotros from './components/pages/AcercaDeNosotros';
import SideBar from './components/SideBar';
import BarraCliente from './components/clientes/BarraCliente';
import Cliente from './components/clientes/Cliente';
import AgregarCliente from './components/clientes/AgregarCliente';
import EditarCliente from './components/clientes/EditarCliente';
import DetallesCliente from './components/clientes/DetallesCliente';
import UsuarioFront from './components/usuarios/UsuarioFront';
import EditarUsuario from './components/usuarios/EditarUsuario';
import DetallesUsuario from './components/usuarios/DetallesUsuario';
import AgregarUsuario from './components/usuarios/AgregarUsuario';

function App() {
  return (
  <>
   <Router>
    
    <SideBar />
    
    <div style={{ marginLeft: "200px", background:"#D8CFE8",  height: "150vh" }}>
      <BarraCliente/>
      
        <Routes>
          {/* Rutas de cliente */}
          <Route path='/clientes/Cliente' element={<Cliente/>}></Route>
          <Route path='/clientes/AgregarCliente' element={<AgregarCliente/>}></Route>
          <Route path='/clientes/editar/:id' element={<EditarCliente/>}></Route>
          <Route path='/clientes/detalles/:id' element={<DetallesCliente/>}></Route>
          
          {/* rutas del afiliado*/}



          {/*rutas del usuario*/}
          <Route path='/usuarios/UsuarioFront' element={<UsuarioFront/>}></Route>
          <Route path='/usuarios/AgregarUsuario' element={<AgregarUsuario/>}></Route>
          <Route path='/usuarios/EditarUsuario/:id' element={<EditarUsuario/>}></Route>
          <Route path='/usuarios/detalles/:id' element={<DetallesUsuario/>}></Route>



          
        </Routes>
      </div>
   </Router>
   </>
  );
}

export default App;
