#language: es

Caracteristica: Compra de productos funerarios

Como cliente
Quiero comprar productos funerarios (urnas, ataudes, arreglos, lapidas)
Para cubrir las necesidades extra del servicio funerario

Antecedentes:
Dado que el cliente ha iniciado sesion correctamente
Y el cliente se encuentra en la seccion "E-commerse"

@ver_productos
Escenario: Visualizar productos disponibles
Cuando el cliente accede al catalogo de productos
Entonces el sistema consulta la base de datos
Y muestra la lista de productos disponibles
Y cada producto muestra nombre, precio, descripcion,categoria,subcategoria  e imagen


@filtrar_productos
Esquema del escenario: Filtrar productos por categoria

Cuando el cliente selecciona la categoria "<categoria>"

Entonces el sistema muestra los productos de esa categoria

Ejemplos:
| categoria        |
| Urnas            |
| Ataudes          |
| Arreglos Florales|
| Lapidas          |


@detalle_producto
Esquema del escenario: Ver detalle de un producto

Cuando el cliente selecciona el producto "<producto>"

Entonces el sistema muestra el detalle del producto
Y muestra el precio "<precio>"
Y muestra la descripcion
Y muestra disponibilidad

Ejemplos:
| producto                | precio   |
| Urna Clasica           | 300000   |
| Ataud Premium          | 2500000  |
| Arreglo Floral Grande  | 200000   |
| Lapida en Marmol       | 1500000  |


@agregar_carrito
Esquema del escenario: Agregar producto al carrito

Cuando el cliente selecciona el producto "<producto>"
Y hace clic en "Agregar al carrito"

Entonces el sistema agrega el producto al carrito
Y actualiza la cantidad de productos

Ejemplos:
| producto               |
| Urna Clasica           |
| Ataud Premium          |


@ver_carrito
Escenario: Visualizar carrito de compras

Cuando el cliente accede al carrito

Entonces el sistema muestra los productos seleccionados
Y muestra cantidades
Y muestra el total a pagar


@eliminar_producto
Escenario: Eliminar producto del carrito

Dado que el cliente tiene productos en el carrito

Cuando el cliente elimina un producto

Entonces el sistema actualiza el carrito
Y recalcula el total


@confirmar_compra
Escenario: Confirmar compra de productos

Dado que el cliente tiene productos en el carrito

Cuando el cliente hace clic en "Finalizar compra"

Entonces el sistema registra la compra
Y genera una orden
Y redirige al modulo de pago


@historial_compras
Escenario: Ver historial de compras

Cuando el cliente accede a "Mis compras"

Entonces el sistema muestra las ordenes realizadas
Y muestra los productos comprados
Y muestra el estado de la compra