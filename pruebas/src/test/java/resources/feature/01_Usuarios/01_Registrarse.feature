#language: es

Característica: Registro de usuario funerario

Como cliente nuevo
Quiero registrarme en el sistema
Para acceder a los servicios funerarios

@registro_cliente
Esquema del escenario: Registro exitoso de cliente

Dado que el cliente se encuentra en el modulo de registro

Cuando el cliente realiza el registro con primerNombre "<primerNombre>",segundoNombre "<segundoNombre>", primerApellido "<primerApellido>", segundoApellido "<segundoApellido>",direccion "<direccion>", documento "<documento>", telefono "<telefono>", correo "<correo>", contrasena"<contrasena>" y fechaNacimiento "<fechaNacimiento>"

Entonces el sistema guarda el cliente en la base de datos
Y muestra el mensaje "Registro exitoso"

Ejemplos:
| primerNombre | segundoNombre | primerApellido | segundoApellido | direccion         | documento  | telefono   | correo              | contrasena | fechaNacimiento |
| Juan         | Carlos        | Perez          | Lopez           | Calle 123 #45-67  | 123456789  | 3001234567 | juanperez@mail.com | 12345678   | 1995-05-10      |