Caracteristica: Pago de plan funerario

Como cliente
Quiero pagar mi plan funerario
Para activarlo

Antecedentes:
Dado que el cliente ha iniciado sesion correctamente
Y el cliente tiene un plan en estado "Pendiente"
Y el cliente se encuentra en la seccion de pagos

@pago_plan
Esquema del escenario: Pago exitoso

Cuando el cliente selecciona el plan
Y selecciona el metodo de pago "<metodoPago>"
Y ingresa el monto "<monto>"
Y confirma el pago

Entonces el sistema registra la transaccion
Y actualiza el estado del plan a "Activo"
Y muestra el mensaje "Pago exitoso"

Ejemplos:
| metodoPago     | monto   |
| Tarjeta        | 500000  |
| Nequi          | 1200000 |
| Transferencia  | 2000000 |