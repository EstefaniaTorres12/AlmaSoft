USE BBDD_FUNERARIA_ALMASOFT;

ALTER TABLE PAGO
  ADD COLUMN pago_estado VARCHAR(20) NOT NULL DEFAULT 'aprobado' AFTER contrato_id,
  ADD COLUMN pago_referencia VARCHAR(60) NOT NULL DEFAULT 'PENDIENTE' AFTER pago_estado,
  ADD COLUMN pago_entidad VARCHAR(120) NULL AFTER pago_referencia,
  ADD COLUMN pago_tipo_tarjeta VARCHAR(20) NULL AFTER pago_entidad,
  ADD COLUMN pago_ultimos4 VARCHAR(4) NULL AFTER pago_tipo_tarjeta,
  ADD COLUMN pago_fecha_limite DATE NULL AFTER pago_ultimos4,
  ADD COLUMN pago_observacion VARCHAR(255) NULL AFTER pago_fecha_limite;

CREATE INDEX idx_pago_contrato_fecha ON PAGO (contrato_id, pago_fecha);
CREATE INDEX idx_pago_referencia ON PAGO (pago_referencia);

/*
Si vas a crear la tabla PAGO desde cero, esta es la version recomendada:

CREATE TABLE PAGO(
  pago_id INT NOT NULL AUTO_INCREMENT,
  pago_metodo VARCHAR(120) NOT NULL,
  pago_fecha DATE NOT NULL,
  contrato_id INT NOT NULL,
  pago_estado VARCHAR(20) NOT NULL DEFAULT 'aprobado',
  pago_referencia VARCHAR(60) NOT NULL,
  pago_entidad VARCHAR(120) NULL,
  pago_tipo_tarjeta VARCHAR(20) NULL,
  pago_ultimos4 VARCHAR(4) NULL,
  pago_fecha_limite DATE NULL,
  pago_observacion VARCHAR(255) NULL,
  PRIMARY KEY (pago_id),
  CONSTRAINT fk_contrato_pago
    FOREIGN KEY (contrato_id)
    REFERENCES CONTRATO(contrato_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;
*/
