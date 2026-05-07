#language: es

Caracteristica: Compra de productos funerarios

Como cliente
Quiero comprar productos del carrito
Para completar el proceso de adquisicion

Antecedentes:
Dado que el cliente ha iniciado sesion correctamente
Y el cliente tiene productos en el carrito

@confirmar_compra
Escenario: Confirmar compra de productos

Cuando el cliente hace clic en "Finalizar compra"

Entonces el sistema registra la compra
Y genera una orden
Y asigna un numero de orden
Y redirige al modulo de pago


@ver_resumen
Escenario: Ver resumen de compra

Cuando el cliente inicia el proceso de compra

Entonces el sistema muestra el resumen de la orden
Y muestra los productos seleccionados
Y muestra el total a pagar


@historial_compras
Escenario: Ver historial de compras

Cuando el cliente accede a "Mis compras"

Entonces el sistema muestra las ordenes realizadas
Y muestra los productos comprados
Y muestra el estado de la compra


@detalle_orden
Escenario: Ver detalle de una orden

Dado que el cliente tiene compras realizadas

Cuando el cliente selecciona una orden

Entonces el sistema muestra el detalle de la orden
Y muestra los productos incluidos
Y muestra el total pagado
Y muestra el estado