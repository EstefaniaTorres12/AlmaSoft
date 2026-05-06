import React, { useEffect, useMemo, useState } from "react";
import AsesorLayout from "../layout/AsesorLayout";
import { authFetch } from "../../../utils/authFetch";
import "../styles/asesorPages.css";

function buildDisplayName(usuario) {
  return [
    usuario.usuario_primer_nombre,
    usuario.usuario_segundo_nombre,
    usuario.usuario_primer_apellido,
    usuario.usuario_segundo_apellido,
  ]
    .filter(Boolean)
    .join(" ");
}

function getPhotoStorageKey(usuarioId) {
  return `asesor_profile_photo_${usuarioId}`;
}

function emitProfileUpdated() {
  window.dispatchEvent(new Event("asesor-profile-updated"));
}

export default function PerfilAsesor() {
  const usuarioLocal = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario")) || {};
    } catch {
      return {};
    }
  }, []);

  const usuarioId = usuarioLocal.usuario_id || localStorage.getItem("usuario_id");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("/img/usuario.png");
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    usuario_primer_nombre: "",
    usuario_segundo_nombre: "",
    usuario_primer_apellido: "",
    usuario_segundo_apellido: "",
    usuario_documento: "",
    usuario_correo: "",
    usuario_direccion: "",
    usuario_credencial: "",
  });

  useEffect(() => {
    if (!usuarioId) {
      setError("No fue posible identificar al usuario.");
      setLoading(false);
      return;
    }

    const storedPhoto = localStorage.getItem(getPhotoStorageKey(usuarioId));
    if (storedPhoto) {
      setProfilePhoto(storedPhoto);
    }

    authFetch(`http://localhost:3001/api/usuarios/id/${usuarioId}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al cargar perfil");
        return data.data; // Backend returns { success, message, data }
      })
      .then((usuario) => {
        const normalized = {
          usuario_id: usuarioId,
          usuario_primer_nombre: usuario.usuario_primer_nombre || "",
          usuario_segundo_nombre: usuario.usuario_segundo_nombre || "",
          usuario_primer_apellido: usuario.usuario_primer_apellido || "",
          usuario_segundo_apellido: usuario.usuario_segundo_apellido || "",
          usuario_documento: usuario.usuario_documento || "",
          usuario_correo: usuario.usuario_correo || "",
          usuario_direccion: usuario.usuario_direccion || "",
          usuario_credencial: "",
        };

        setOriginalData(normalized);
        setFormData(normalized);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "No fue posible cargar el perfil.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [usuarioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !usuarioId) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      localStorage.setItem(getPhotoStorageKey(usuarioId), result);
      setProfilePhoto(result);
      emitProfileUpdated();
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {};
    const fields = ["usuario_primer_nombre", "usuario_segundo_nombre", "usuario_primer_apellido", "usuario_segundo_apellido", "usuario_documento", "usuario_correo", "usuario_direccion"];

    fields.forEach(field => {
        if (formData[field] !== originalData[field]) {
            payload[field] = formData[field];
        }
    });

    if (formData.usuario_credencial) {
        payload.usuario_credencial = formData.usuario_credencial;
    }

    if (Object.keys(payload).length === 0) {
      setSaving(false);
      setError("No hay cambios para actualizar.");
      return;
    }

    try {
      const response = await authFetch(`http://localhost:3001/api/usuarios/update/${usuarioId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al actualizar");

      // Actualizar localStorage con los nuevos datos
      const updatedUsuario = { ...usuarioLocal, ...payload };
      delete updatedUsuario.usuario_credencial; // No guardar contraseña en localStorage
      localStorage.setItem("usuario", JSON.stringify(updatedUsuario));

      setOriginalData({ ...formData, usuario_credencial: "" });
      setFormData(prev => ({ ...prev, usuario_credencial: "" }));
      setSuccess("Perfil actualizado correctamente.");
      emitProfileUpdated();
    } catch (err) {
      setError(err.message || "Error al actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  const profileName = buildDisplayName(formData) || "Asesor";

  return (
    <AsesorLayout>
      <div className="asesor-page-shell">
        <div className="asesor-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Mi Perfil</h1>
            <p>Gestiona tu información personal y configuraciones de cuenta.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'rgba(122, 76, 255, 0.05)', padding: '10px 20px', borderRadius: '15px', border: '1px solid rgba(122, 76, 255, 0.1)' }}>
            <img src={profilePhoto} alt="Perfil" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
                <strong style={{ display: 'block', color: '#301f57' }}>{profileName}</strong>
                <span style={{ fontSize: '0.85rem', color: '#6f6789' }}>Asesor Comercial</span>
            </div>
          </div>
        </div>

        {loading ? (
          <p>Cargando perfil...</p>
        ) : (
          <div className="asesor-info-grid" style={{ marginTop: '20px' }}>
            <div className="asesor-info-card" style={{ gridColumn: 'span 2' }}>
              <h3>Datos Personales</h3>
              {error && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '12px', borderRadius: '10px', marginBottom: '15px' }}>{error}</div>}
              {success && <div style={{ color: '#155724', backgroundColor: '#d4edda', padding: '12px', borderRadius: '10px', marginBottom: '15px' }}>{success}</div>}
              
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <div className="asesor-form-group">
                  <label>Primer Nombre</label>
                  <input className="asesor-form-control" name="usuario_primer_nombre" value={formData.usuario_primer_nombre} onChange={handleChange} required />
                </div>
                <div className="asesor-form-group">
                  <label>Segundo Nombre</label>
                  <input className="asesor-form-control" name="usuario_segundo_nombre" value={formData.usuario_segundo_nombre} onChange={handleChange} />
                </div>
                <div className="asesor-form-group">
                  <label>Primer Apellido</label>
                  <input className="asesor-form-control" name="usuario_primer_apellido" value={formData.usuario_primer_apellido} onChange={handleChange} required />
                </div>
                <div className="asesor-form-group">
                  <label>Segundo Apellido</label>
                  <input className="asesor-form-control" name="usuario_segundo_apellido" value={formData.usuario_segundo_apellido} onChange={handleChange} />
                </div>
                <div className="asesor-form-group">
                  <label>Documento</label>
                  <input className="asesor-form-control" name="usuario_documento" value={formData.usuario_documento} onChange={handleChange} required />
                </div>
                <div className="asesor-form-group">
                  <label>Correo Electrónico</label>
                  <input className="asesor-form-control" type="email" name="usuario_correo" value={formData.usuario_correo} onChange={handleChange} required />
                </div>
                <div className="asesor-form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Dirección</label>
                  <input className="asesor-form-control" name="usuario_direccion" value={formData.usuario_direccion} onChange={handleChange} />
                </div>
                <div className="asesor-form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Nueva Contraseña (dejar en blanco para no cambiar)</label>
                  <input className="asesor-form-control" type="password" name="usuario_credencial" value={formData.usuario_credencial} onChange={handleChange} />
                </div>
                <button type="submit" className="asesor-btn" disabled={saving} style={{ gridColumn: 'span 2' }}>
                  {saving ? "Guardando..." : "Actualizar Información"}
                </button>
              </form>
            </div>

            <div className="asesor-info-card">
              <h3>Foto de Perfil</h3>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <img src={profilePhoto} alt="Avatar" style={{ width: '150px', height: '150px', borderRadius: '25px', objectFit: 'cover', border: '4px solid #f3edff', marginBottom: '20px' }} />
                <label className="asesor-btn asesor-btn-secondary" style={{ width: '100%', cursor: 'pointer' }}>
                  Cambiar Foto
                  <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                </label>
                <p style={{ fontSize: '0.8rem', color: '#6f6789', marginTop: '10px' }}>Formatos permitidos: JPG, PNG. Máx 2MB.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AsesorLayout>
  );
}
