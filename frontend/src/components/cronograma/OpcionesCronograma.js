import React from "react";
import { Dropdown } from "react-bootstrap";

export default function OpcionesCronograma({ setFiltro, limpiar }) {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
        Opciones
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => setFiltro("Todos")}>
          Mostrar Todos
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setFiltro("Misa")}>
          Solo Misas
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setFiltro("Velación")}>
          Solo Velaciones
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setFiltro("Sepelio")}>
          Solo Sepelios
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setFiltro("Exhumación")}>
          Solo Exhumaciones
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={limpiar}>Limpiar Cronograma</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}