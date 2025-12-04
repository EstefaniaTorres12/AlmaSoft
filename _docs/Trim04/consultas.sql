##CONSULTAS MULTITABLA

## INFORMACION DEL CONTRATO Y CLIENTE 
select * from contrato as co
inner join cliente as cr
on co.cliente_id=cr.cliente_id
inner join usuario as us
on cr.cliente_id=us.usuario_id;


##INFORMACION DEL CONTRATO SI ESTA ACTIVO Y DEL CLIENTE
select contrato_id, usuario_primer_nombre, usuario_primer_apellido, cliente_edad
from contrato as co
inner join cliente as cr
on co.cliente_id=cr.cliente_id
inner join usuario as us
on cr.cliente_id=us.usuario_id
where contrato_estado=true;


##CONTRATOS INACTIVOS
select contrato_id, usuario_primer_nombre, usuario_primer_apellido, cliente_edad
from contrato as co
inner join cliente as cr
on co.cliente_id=cr.cliente_id
inner join usuario as us
on cr.cliente_id=us.usuario_id
where contrato_estado=false;


## CONTRATO PLAN Y SERVICIOS
select co.contrato_id, plan_nombre, servicio_nombre
from contrato as co
inner join contrato_plan as cp
on co.contrato_id = cp.contrato_id
inner join plan_funebre as pf
on cp.plan_id=pf.plan_id
inner join servicio_plan as sp
on pf.plan_id=sp.plan_id
inner join servicio as s
on sp.servicio_id=s.servicio_id;


## CONTRATO Y PRODUCTOS QUE CONTIENE
select co.contrato_id,  producto_nombre
from contrato as co
inner join contrato_producto as cpo
on co.contrato_id=cpo.contrato_id
inner join producto as p
on cpo.producto_id=p.producto_id;

## contrato y afiliados
select co.contrato_id, afiliado_id, usuario_primer_nombre, usuario_primer_apellido
from contrato as co
inner join afiliado as a
on co.contrato_id = a.contrato_id
inner join usuario as us
on a.afiliado_id = us.usuario_id;

##usuarios y sus roles
Select r.rol_id, rol_nombre, us.usuario_id, usuario_primer_nombre, usuario_primer_apellido
from rol as r
inner join rol_usuario as ru
on r.rol_id=ru.rol_id
inner join usuario as us
on ru.usuario_id= us.usuario_id;


## productos a subcategorias
Select producto_id, producto_nombre, sc.subcategoria_id, subcategoria_nombre
from producto as p
inner join subcategoria as sc
on p.subcategoria_id=sc.subcategoria_id
where sc.subcategoria_nombre='Tamaño-Grande';

Select producto_id, producto_nombre, sc.subcategoria_id, subcategoria_nombre
from producto as p
inner join subcategoria as sc
on p.subcategoria_id=sc.subcategoria_id
where sc.subcategoria_nombre='Tamaño-Pequeño';




