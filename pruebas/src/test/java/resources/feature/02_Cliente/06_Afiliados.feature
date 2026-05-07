#language: es

Caracteristica: Gestion de afiliados en plan funerario

Como cliente con un plan funerario activo
Quiero agregar y gestionar afiliados
Para que puedan acceder a los beneficios del plan

Antecedentes:
Dado que el cliente ha iniciado sesion correctamente
Y el cliente tiene un plan en estado "Activo"
Y el cliente se encuentra en la seccion "Afiliados"

@buscar_afiliado
Esquema del escenario: Buscar usuario por documento

Cuando el cliente ingresa el documento "<documento>"
Y presiona el boton de buscar

Entonces el sistema consulta la base de datos
Y muestra la informacion del usuario encontrado

Ejemplos:
| documento  |
| 123456789  |
| 987654321  |

@solicitar_afiliacion
Escenario: Enviar solicitud de afiliacion

Dado que el cliente ha buscado un usuario existente

Cuando el cliente selecciona la opcion "Solicitar afiliacion"

Entonces el sistema registra la solicitud de afiliacion
Y envía la solicitud al administrador para validacion
Y muestra el mensaje "Solicitud enviada correctamente"

@validar_afiliacion
Escenario: Validar afiliacion por administrador

Dado que existe una solicitud de afiliacion pendiente

Cuando el administrador valida que el usuario existe en la base de datos
Y aprueba la solicitud

Entonces el sistema cambia el estado a "Afiliado"
Y registra el afiliado en el plan del cliente

@notificacion_afiliado
Escenario: Notificar al usuario afiliado

Dado que la solicitud de afiliacion fue aprobada

Cuando el sistema procesa la afiliacion

Entonces el usuario afiliado recibe una notificacion
Y puede visualizar los beneficios del plan

@ver_afiliados
Escenario: Visualizar lista de afiliados

Cuando el cliente accede a la lista de afiliados

Entonces el sistema muestra todos los afiliados registrados
Y muestra el estado de cada afiliado
