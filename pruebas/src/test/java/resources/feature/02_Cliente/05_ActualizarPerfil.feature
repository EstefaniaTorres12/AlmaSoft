#language: es

Caracteristica: Actualizacion de datos del perfil del cliente

Como cliente autenticado
Quiero actualizar mis datos personales
Para mantener mi informacion actualizada en el sistema

Antecedentes:
Dado que el cliente ha iniciado sesion correctamente
Y el cliente se encuentra en la seccion "Perfil"

@actualizar_perfil
Esquema del escenario: Actualizar datos personales exitosamente

Cuando el cliente edita su nombre "<nombre>"
Y el cliente edita su segundoNombre "<segundoNombre>"
Y el cliente edita su primerApellido "<primerApellido>"
Y el cliente edita su segundoApellido "<segundoApellido>"
Y el cliente edita su documento "<documento>"
Y el cliente edita su telefono "<telefono>"
Y el cliente edita su direccion "<direccion>"
Y el cliente edita su correo "<correo>"
Y el cliente edita su contrasena "<contrasena>"
Y guarda los cambios

Entonces el sistema actualiza los datos del cliente en la base de datos
Y muestra el mensaje "Perfil actualizado correctamente"
Y los datos del cliente reflejan la informacion actualizada
Y el sistema muestra los datos actualizados en pantalla

Ejemplos:
| nombre | segundoNombre | primerApellido | segundoApellido | documento  | telefono   | direccion           | correo              | contrasena |
| Juan   | Carlos        | Perez          | Lopez           | 123456789  | 3001234567 | Calle 123 #45-67    | juan@mail.com       | 12345678   |
| Maria  | Elena         | Gomez          | Torres          | 987654321  | 3109876543 | Carrera 10 #20-30   | maria@mail.com      | 87654321   |