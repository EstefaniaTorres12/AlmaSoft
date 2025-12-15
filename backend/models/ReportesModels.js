const db = require('../config/config');

const Reporte = {};

// 1. REPORTE DE USUARIOS/CLIENTES (tabla USUARIO)
Reporte.obtenerUsuarios = (filtros, result) => {
    let sql = `
        SELECT 
            u.usuario_id,
            CONCAT(u.usuario_primer_nombre, ' ', u.usuario_primer_apellido) as nombre_completo,
            u.usuario_documento,
            u.usuario_correo,
            u.usuario_direccion,
            GROUP_CONCAT(DISTINCT t.telefono SEPARATOR ', ') as telefonos,
            r.rol_nombre,
            CASE 
                WHEN c.cliente_id IS NOT NULL THEN 'Cliente'
                WHEN a.afiliado_id IS NOT NULL THEN 'Afiliado'
                ELSE 'Usuario'
            END as tipo_usuario,
            c.cliente_fecha_nacimiento,
            c.cliente_edad,
            ru.estado_cred as estado_activo
        FROM USUARIO u
        LEFT JOIN TELEFONO t ON u.usuario_id = t.usuario_id
        LEFT JOIN ROL_USUARIO ru ON u.usuario_id = ru.usuario_id
        LEFT JOIN ROL r ON ru.rol_id = r.rol_id
        LEFT JOIN CLIENTE c ON u.usuario_id = c.cliente_id
        LEFT JOIN AFILIADO a ON u.usuario_id = a.afiliado_id
        WHERE 1=1
    `;
    
    const params = [];
    
    if (filtros && filtros.tipo) {
        if (filtros.tipo === 'cliente') {
            sql += ` AND c.cliente_id IS NOT NULL`;
        } else if (filtros.tipo === 'afiliado') {
            sql += ` AND a.afiliado_id IS NOT NULL`;
        }
    }
    
    if (filtros && filtros.rol_id) {
        sql += ` AND r.rol_id = ?`;
        params.push(filtros.rol_id);
    }
    
    if (filtros && filtros.estado_cred !== undefined) {
        sql += ` AND ru.estado_cred = ?`;
        params.push(filtros.estado_cred);
    }
    
    sql += ` GROUP BY u.usuario_id ORDER BY u.usuario_primer_apellido`;
    
    db.query(sql, params, (err, usuarios) => {
        if (err) {
            console.log('Error al consultar reporte de usuarios:', err);
            result(err, null);
        } else {
            console.log('Reporte de usuarios obtenido:', usuarios.length, 'registros');
            result(null, usuarios);
        }
    });
};

// 2. REPORTE DE CONTRATOS
Reporte.obtenerContratos = (filtros, result) => {
    let sql = `
        SELECT 
            co.contrato_id,
            co.contrato_estado,
            co.contrato_valor,
            co.cliente_id,
            CONCAT(u.usuario_primer_nombre, ' ', u.usuario_primer_apellido) as nombre_cliente,
            u.usuario_documento,
            COUNT(DISTINCT cp.producto_id) as productos_asociados,
            COUNT(DISTINCT cpl.plan_id) as planes_asociados,
            COUNT(DISTINCT p.pago_id) as pagos_realizados,
            SUM(p.pago_monto) as total_pagado,
            MAX(p.pago_fecha) as ultimo_pago
        FROM CONTRATO co
        LEFT JOIN CLIENTE cl ON co.cliente_id = cl.cliente_id
        LEFT JOIN USUARIO u ON cl.cliente_id = u.usuario_id
        LEFT JOIN CONTRATO_PRODUCTO cp ON co.contrato_id = cp.contrato_id
        LEFT JOIN CONTRATO_PLAN cpl ON co.contrato_id = cpl.contrato_id
        LEFT JOIN PAGO p ON co.contrato_id = p.contrato_id
        WHERE 1=1
    `;
    
    const params = [];
    
    if (filtros && filtros.contrato_estado !== undefined) {
        sql += ` AND co.contrato_estado = ?`;
        params.push(filtros.contrato_estado);
    }
    
    if (filtros && filtros.fecha_inicio) {
        // Si tuvieras fecha de creación en CONTRATO, la agregarías aquí
        // sql += ` AND DATE(co.fecha_creacion) >= ?`;
        // params.push(filtros.fecha_inicio);
    }
    
    sql += ` GROUP BY co.contrato_id ORDER BY co.contrato_id DESC`;
    
    db.query(sql, params, (err, contratos) => {
        if (err) {
            console.log('Error al consultar reporte de contratos:', err);
            result(err, null);
        } else {
            console.log('Reporte de contratos obtenido:', contratos.length, 'contratos');
            result(null, contratos);
        }
    });
};

// 3. REPORTE DE PRODUCTOS (funerarios)
Reporte.obtenerProductos = (filtros, result) => {
    let sql = `
        SELECT 
            p.producto_id,
            p.producto_nombre,
            p.producto_descripcion,
            p.producto_precio,
            p.producto_stock,
            p.producto_estado,
            c.categoria_nombre,
            sc.subcategoria_nombre,
            COUNT(DISTINCT cp.contrato_id) as veces_contratado,
            SUM(p.producto_precio) as valor_total_contratos
        FROM PRODUCTO p
        LEFT JOIN SUBCATEGORIA sc ON p.subcategoria_id = sc.subcategoria_id
        LEFT JOIN CATEGORIA c ON sc.categoria_id = c.categoria_id
        LEFT JOIN CONTRATO_PRODUCTO cp ON p.producto_id = cp.producto_id
        WHERE 1=1
    `;
    
    const params = [];
    
    if (filtros && filtros.categoria_id) {
        sql += ` AND c.categoria_id = ?`;
        params.push(filtros.categoria_id);
    }
    
    if (filtros && filtros.subcategoria_id) {
        sql += ` AND sc.subcategoria_id = ?`;
        params.push(filtros.subcategoria_id);
    }
    
    if (filtros && filtros.producto_estado !== undefined) {
        sql += ` AND p.producto_estado = ?`;
        params.push(filtros.producto_estado);
    }
    
    if (filtros && filtros.stock_bajo === 'true') {
        sql += ` AND p.producto_stock < 5`; // Ajusta según tu criterio
    }
    
    sql += ` GROUP BY p.producto_id ORDER BY c.categoria_nombre, sc.subcategoria_nombre`;
    
    db.query(sql, params, (err, productos) => {
        if (err) {
            console.log('Error al consultar reporte de productos:', err);
            result(err, null);
        } else {
            console.log('Reporte de productos obtenido:', productos.length, 'productos');
            result(null, productos);
        }
    });
};

// 4. REPORTE DE PLANES FUNEBRES
Reporte.obtenerPlanesFunebres = (filtros, result) => {
    let sql = `
        SELECT 
            pf.plan_id,
            pf.plan_nombre,
            pf.plan_precio,
            pf.plan_estado,
            COUNT(DISTINCT sp.servicio_id) as servicios_incluidos,
            COUNT(DISTINCT cp.contrato_id) as contratos_asociados,
            GROUP_CONCAT(DISTINCT s.servicio_nombre SEPARATOR ', ') as lista_servicios,
            SUM(pf.plan_precio) as ingresos_totales
        FROM PLAN_FUNEBRE pf
        LEFT JOIN SERVICIO_PLAN sp ON pf.plan_id = sp.plan_id
        LEFT JOIN SERVICIO s ON sp.servicio_id = s.servicio_id
        LEFT JOIN CONTRATO_PLAN cp ON pf.plan_id = cp.plan_id
        WHERE 1=1
    `;
    
    const params = [];
    
    if (filtros && filtros.plan_estado !== undefined) {
        sql += ` AND pf.plan_estado = ?`;
        params.push(filtros.plan_estado);
    }
    
    sql += ` GROUP BY pf.plan_id ORDER BY pf.plan_precio DESC`;
    
    db.query(sql, params, (err, planes) => {
        if (err) {
            console.log('Error al consultar reporte de planes funebres:', err);
            result(err, null);
        } else {
            console.log('Reporte de planes funebres obtenido:', planes.length, 'planes');
            result(null, planes);
        }
    });
};

// 5. REPORTE DE PAGOS
Reporte.obtenerPagos = (filtros, result) => {
    let sql = `
        SELECT 
            pa.pago_id,
            pa.pago_metodo,
            pa.pago_fecha,
            co.contrato_id,
            co.contrato_valor,
            CONCAT(u.usuario_primer_nombre, ' ', u.usuario_primer_apellido) as nombre_cliente,
            u.usuario_documento,
            CASE 
                WHEN a.afiliado_id IS NOT NULL THEN 'Afiliado'
                ELSE 'Cliente'
            END as tipo_cliente
        FROM PAGO pa
        LEFT JOIN CONTRATO co ON pa.contrato_id = co.contrato_id
        LEFT JOIN CLIENTE cl ON co.cliente_id = cl.cliente_id
        LEFT JOIN USUARIO u ON cl.cliente_id = u.usuario_id
        LEFT JOIN AFILIADO a ON u.usuario_id = a.afiliado_id
        WHERE 1=1
    `;
    
    const params = [];
    
    if (filtros && filtros.fecha_inicio) {
        sql += ` AND pa.pago_fecha >= ?`;
        params.push(filtros.fecha_inicio);
    }
    
    if (filtros && filtros.fecha_fin) {
        sql += ` AND pa.pago_fecha <= ?`;
        params.push(filtros.fecha_fin);
    }
    
    if (filtros && filtros.pago_metodo) {
        sql += ` AND pa.pago_metodo = ?`;
        params.push(filtros.pago_metodo);
    }
    
    if (filtros && filtros.contrato_id) {
        sql += ` AND pa.contrato_id = ?`;
        params.push(filtros.contrato_id);
    }
    
    sql += ` ORDER BY pa.pago_fecha DESC`;
    
    db.query(sql, params, (err, pagos) => {
        if (err) {
            console.log('Error al consultar reporte de pagos:', err);
            result(err, null);
        } else {
            console.log('Reporte de pagos obtenido:', pagos.length, 'pagos');
            result(null, pagos);
        }
    });
};

// 6. ESTADÍSTICAS GENERALES DE LA FUNERARIA
Reporte.obtenerEstadisticas = (result) => {
    const sql = `
        SELECT 
            -- Usuarios
            (SELECT COUNT(*) FROM USUARIO) as total_usuarios,
            (SELECT COUNT(*) FROM CLIENTE) as total_clientes,
            (SELECT COUNT(*) FROM AFILIADO) as total_afiliados,
            
            -- Contratos
            (SELECT COUNT(*) FROM CONTRATO WHERE contrato_estado = 1) as contratos_activos,
            (SELECT COUNT(*) FROM CONTRATO WHERE contrato_estado = 0) as contratos_inactivos,
            (SELECT SUM(contrato_valor) FROM CONTRATO WHERE contrato_estado = 1) as valor_contratos_activos,
            
            -- Productos
            (SELECT COUNT(*) FROM PRODUCTO WHERE producto_estado = 1) as productos_activos,
            (SELECT COUNT(*) FROM PRODUCTO WHERE producto_estado = 0) as productos_inactivos,
            (SELECT COUNT(*) FROM PRODUCTO WHERE producto_stock < 5) as productos_stock_bajo,
            
            -- Planes
            (SELECT COUNT(*) FROM PLAN_FUNEBRE WHERE plan_estado = 1) as planes_activos,
            (SELECT AVG(plan_precio) FROM PLAN_FUNEBRE WHERE plan_estado = 1) as promedio_precio_planes,
            
            -- Pagos recientes
            (SELECT COUNT(*) FROM PAGO WHERE MONTH(pago_fecha) = MONTH(CURDATE())) as pagos_este_mes,
            (SELECT SUM(contrato_valor) FROM CONTRATO co 
             LEFT JOIN PAGO pa ON co.contrato_id = pa.contrato_id 
             WHERE MONTH(pa.pago_fecha) = MONTH(CURDATE())) as ingresos_este_mes
    `;
    
    db.query(sql, (err, estadisticas) => {
        if (err) {
            console.log('Error al consultar estadísticas:', err);
            result(err, null);
        } else {
            console.log('Estadísticas obtenidas');
            result(null, estadisticas[0]);
        }
    });
};

// 7. REPORTE DE VENTAS/CONTRATOS POR PERIODO
Reporte.obtenerVentasPeriodo = (filtros, result) => {
    let sql = `
        SELECT 
            DATE_FORMAT(p.pago_fecha, '%Y-%m') as periodo,
            COUNT(DISTINCT co.contrato_id) as total_contratos,
            SUM(co.contrato_valor) as valor_total,
            COUNT(DISTINCT co.cliente_id) as clientes_unicos,
            AVG(co.contrato_valor) as valor_promedio,
            GROUP_CONCAT(DISTINCT pf.plan_nombre SEPARATOR '; ') as planes_vendidos
        FROM PAGO p
        LEFT JOIN CONTRATO co ON p.contrato_id = co.contrato_id
        LEFT JOIN CONTRATO_PLAN cpl ON co.contrato_id = cpl.contrato_id
        LEFT JOIN PLAN_FUNEBRE pf ON cpl.plan_id = pf.plan_id
        WHERE 1=1
    `;
    
    const params = [];
    
    if (filtros && filtros.fecha_inicio) {
        sql += ` AND p.pago_fecha >= ?`;
        params.push(filtros.fecha_inicio);
    }
    
    if (filtros && filtros.fecha_fin) {
        sql += ` AND p.pago_fecha <= ?`;
        params.push(filtros.fecha_fin);
    }
    
    sql += ` GROUP BY DATE_FORMAT(p.pago_fecha, '%Y-%m') ORDER BY periodo DESC`;
    
    db.query(sql, params, (err, ventas) => {
        if (err) {
            console.log('Error al consultar reporte de ventas por periodo:', err);
            result(err, null);
        } else {
            console.log('Reporte de ventas por periodo obtenido:', ventas.length, 'períodos');
            result(null, ventas);
        }
    });
};

// 8. REPORTE DE SERVICIOS MÁS SOLICITADOS
Reporte.obtenerServiciosPopulares = (filtros, result) => {
    let sql = `
        SELECT 
            s.servicio_id,
            s.servicio_nombre,
            s.servicio_descripcion,
            s.servicio_precio,
            COUNT(DISTINCT sp.plan_id) as planes_que_lo_incluyen,
            COUNT(DISTINCT cp.contrato_id) as veces_contratado,
            SUM(pf.plan_precio) as ingresos_generados
        FROM SERVICIO s
        LEFT JOIN SERVICIO_PLAN sp ON s.servicio_id = sp.servicio_id
        LEFT JOIN PLAN_FUNEBRE pf ON sp.plan_id = pf.plan_id
        LEFT JOIN CONTRATO_PLAN cp ON pf.plan_id = cp.plan_id
        WHERE 1=1
    `;
    
    const params = [];
    
    sql += ` GROUP BY s.servicio_id ORDER BY veces_contratado DESC, ingresos_generados DESC`;
    
    db.query(sql, params, (err, servicios) => {
        if (err) {
            console.log('Error al consultar reporte de servicios populares:', err);
            result(err, null);
        } else {
            console.log('Reporte de servicios populares obtenido:', servicios.length, 'servicios');
            result(null, servicios);
        }
    });
};

module.exports = Reporte;