import React from "react";
import { Form } from "react-bootstrap";

export default function FiltrosCronograma({ setFiltro }) {
  const handleChange = (e) => {
    setFiltro(e.target.value);
  };

  return (
    <Form.Select onChange={handleChange}>
      <option value="Todos">Todos</option>
      <option value="Misa">Misa</option>
      <option value="Velación">Velación</option>
      <option value="Sepelio">Sepelio</option>
      <option value="Exhumación">Exhumación</option>
    </Form.Select>
  );
}

