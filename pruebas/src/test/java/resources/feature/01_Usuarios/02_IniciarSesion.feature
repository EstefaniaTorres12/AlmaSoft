#language: es


Característica:Inicio de sesion en el sistema funerario Almasoft


Como cliente registrado
Quiero iniciar sesion en el sistema
Para acceder a mi panel

@login
Esquema del escenario: Inicio de sesion exitoso

Dado que el cliente se encuentra en la pagina de inicio de sesion

Cuando el cliente ingresa el correo "<correo>"
Y el cliente ingresa la contraseña "<contraseña>"
Y presiona el boton de iniciar sesion

Entonces el sistema valida las credenciales
Y redirige al panel del cliente

Ejemplos:
| correo              | contraseña |
| juanperez@mail.com | 12345678   |
| cliente@test.com   | test1234   |