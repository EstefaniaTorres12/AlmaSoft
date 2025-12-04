
## consultas de una tabla
select * FROM AFILIADO;
select * FROM CATEGORIA;
select * FROM CLIENTE;
select * FROM CONTRATO;
select * FROM CONTRATO_PLAN;
select * FROM CONTRATO_PRODUCTO;
select * FROM PAGO;
select * FROM PLAN_FUNEBRE;
select * FROM PRODUCTO;
select * FROM ROL;
select * FROM ROL_USUARIO;
select * FROM SERVICIO;
select * FROM SERVICIO_PLAN;
select * FROM SUBCATEGORIA;
select * FROM TELEFONO;
select * FROM USUARIO;



select usuario_id, usuario_primer_nombre, usuario_primer_apellido from usuario;

select usuario_id, usuario_primer_nombre, usuario_primer_apellido from usuario
where usuario_id=1 or usuario_id=10;

select usuario_id,usuario_correo from usuario
where usuario_id=6 or usuario_id=8 ;

select * from producto where producto_precio <=4000;

select * from producto where producto_precio >= 5000;

SELECT * FROM PRODUCTO 
WHERE subcategoria_id=  3
ORDER BY subcategoria_id;

select * from subcategoria
where categoria_id=3
order by categoria_id desc;

select sum(contrato_valor) from contrato;






