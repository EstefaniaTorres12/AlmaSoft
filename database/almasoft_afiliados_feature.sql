USE BBDD_FUNERARIA_ALMASOFT;

CREATE TABLE IF NOT EXISTS AFILIACION_SOLICITUD (
  solicitud_id INT NOT NULL AUTO_INCREMENT,
  contrato_id INT NOT NULL,
  titular_id INT NOT NULL,
  usuario_postulado_id INT NOT NULL,
  parentesco VARCHAR(45) NOT NULL,
  observacion VARCHAR(255) NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  fecha_solicitud DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_revision DATETIME NULL,
  revisado_por INT NULL,
  motivo_revision VARCHAR(255) NULL,
  PRIMARY KEY (solicitud_id),
  CONSTRAINT fk_solicitud_contrato
    FOREIGN KEY (contrato_id)
    REFERENCES CONTRATO(contrato_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_solicitud_titular
    FOREIGN KEY (titular_id)
    REFERENCES USUARIO(usuario_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_solicitud_postulado
    FOREIGN KEY (usuario_postulado_id)
    REFERENCES USUARIO(usuario_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_solicitud_revisor
    FOREIGN KEY (revisado_por)
    REFERENCES USUARIO(usuario_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS NOTIFICACION_USUARIO (
  notificacion_id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  notificacion_titulo VARCHAR(120) NOT NULL,
  notificacion_mensaje VARCHAR(255) NOT NULL,
  notificacion_tipo VARCHAR(45) NOT NULL,
  referencia_id INT NULL,
  leida BOOLEAN NOT NULL DEFAULT 0,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (notificacion_id),
  CONSTRAINT fk_notificacion_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES USUARIO(usuario_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_afiliacion_estado ON AFILIACION_SOLICITUD (estado, contrato_id);
CREATE INDEX idx_notificacion_usuario ON NOTIFICACION_USUARIO (usuario_id, leida, fecha_creacion);
