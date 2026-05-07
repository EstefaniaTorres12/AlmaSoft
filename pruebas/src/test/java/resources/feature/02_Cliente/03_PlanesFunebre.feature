Caracteristica: Adquirir plan funerario

Como cliente autenticado
Quiero adquirir un plan funerario
Para obtener los servicios ofrecidos

Antecedentes:
Dado que el cliente ha iniciado sesion correctamente
Y el cliente se encuentra en el panel principal

@adquirir_plan
Esquema del escenario: Compra de plan funerario

Cuando el cliente selecciona el plan "<nombrePlan>"
Y visualiza el precio "<precio>"
Y confirma la compra del plan

Entonces el sistema registra el plan en la base de datos
Y el estado del plan queda "Pendiente"
Y se muestra el mensaje "Plan adquirido correctamente"

Ejemplos:
| nombrePlan     | precio   |
| Plan Basico    | 500000   |
| Plan Premium   | 1200000  |
| Plan Familiar  | 2000000  |