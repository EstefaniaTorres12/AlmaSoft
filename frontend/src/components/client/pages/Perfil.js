import { useEffect, useMemo, useState } from "react";
import ClientLayout from "../layout/ClientLayout";
import { authFetch } from "../../../utils/authFetch";
import "../styles/clientPages.css";

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
  return `client_profile_photo_${usuarioId}`;
}

function emitProfileUpdated() {
  window.dispatchEvent(new Event("client-profile-updated"));
}

export default function Perfil() {
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
  const [showPassword, setShowPassword] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("/img/usuario.png");
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

        if (!response.ok || !data.success) {
          throw new Error(data.message || "No se pudo cargar el perfil");
        }

        return data.data;
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
        localStorage.setItem("usuario", JSON.stringify(normalized));
        emitProfileUpdated();
        setError("");
      })
      .catch((err) => {
        console.error(err);
        if (String(err.message || "").includes("Acceso denegado")) {
          setError("");
        } else {
          setError(err.message || "No fue posible cargar el perfil.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [usuarioId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {};
    const editableFields = [
      "usuario_primer_nombre",
      "usuario_segundo_nombre",
      "usuario_primer_apellido",
      "usuario_segundo_apellido",
      "usuario_documento",
      "usuario_correo",
      "usuario_direccion",
      "usuario_credencial",
    ];

    editableFields.forEach((field) => {
      const currentValue = formData[field] ?? "";
      const originalValue = originalData?.[field] ?? "";

      if (field === "usuario_credencial") {
        if (currentValue.trim()) {
          payload[field] = currentValue;
        }
        return;
      }

      if (currentValue.trim() && currentValue !== originalValue) {
        payload[field] = currentValue.trim();
      }
    });

    if (Object.keys(payload).length === 0) {
      setSaving(false);
      setError("No hay cambios para actualizar.");
      return;
    }

    try {
      const response = await authFetch(
        `http://localhost:3001/api/usuarios/update/${usuarioId}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No fue posible actualizar el perfil");
      }

      const updatedProfile = {
        ...(originalData || {}),
        ...formData,
        ...payload,
        usuario_id: usuarioId,
        usuario_credencial: "",
      };

      setFormData(updatedProfile);
      setOriginalData(updatedProfile);
      localStorage.setItem("usuario", JSON.stringify(updatedProfile));
      emitProfileUpdated();
      setSuccess("Perfil actualizado correctamente.");
    } catch (err) {
      console.error(err);
      if (String(err.message || "").includes("Acceso denegado")) {
        setError("");
      } else {
        setError(err.message || "Error al actualizar el perfil.");
      }
    } finally {
      setSaving(false);
    }
  };

  const profileName = buildDisplayName(formData) || "Cliente";

  return (
    <ClientLayout>
      <section className="client-page-shell profile-shell">
        <div className="client-page-header profile-header">
          <div>
            <p className="client-kicker">Cuenta</p>
            <h1>Perfil del cliente</h1>
          </div>

          <div className="profile-highlight-card">
            <img src={profilePhoto} alt="Perfil" />
            <div>
              <strong>{profileName}</strong>
              <span>{formData.usuario_correo || "Correo pendiente"}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="client-empty-state">Cargando perfil...</div>
        ) : (
          <div className="profile-layout">
            <aside className="profile-summary-column">
              <article className="client-info-card profile-summary-card">
                <h3>Resumen</h3>
                <p>Nombre completo: {profileName}</p>
                <p>Documento: {formData.usuario_documento || "No registrado"}</p>
                <p>Correo: {formData.usuario_correo || "No registrado"}</p>
                <p>Direccion: {formData.usuario_direccion || "No registrada"}</p>
              </article>

              <article className="client-info-card profile-summary-card">
                <h3>Foto de perfil</h3>
                <div className="profile-photo-panel">
                  <img src={profilePhoto} alt="Vista previa" className="profile-photo-large" />
                  <label className="profile-upload-button">
                    Subir foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      hidden
                    />
                  </label>
                </div>
              </article>
            </aside>

            <form className="profile-form-card" onSubmit={handleSubmit}>
              <div className="profile-grid">
                <label className="profile-field">
                  <span>Primer nombre</span>
                  <input
                    name="usuario_primer_nombre"
                    value={formData.usuario_primer_nombre}
                    onChange={handleChange}
                  />
                </label>

                <label className="profile-field">
                  <span>Segundo nombre</span>
                  <input
                    name="usuario_segundo_nombre"
                    value={formData.usuario_segundo_nombre}
                    onChange={handleChange}
                  />
                </label>

                <label className="profile-field">
                  <span>Primer apellido</span>
                  <input
                    name="usuario_primer_apellido"
                    value={formData.usuario_primer_apellido}
                    onChange={handleChange}
                  />
                </label>

                <label className="profile-field">
                  <span>Segundo apellido</span>
                  <input
                    name="usuario_segundo_apellido"
                    value={formData.usuario_segundo_apellido}
                    onChange={handleChange}
                  />
                </label>

                <label className="profile-field">
                  <span>Documento</span>
                  <input
                    name="usuario_documento"
                    value={formData.usuario_documento}
                    onChange={handleChange}
                  />
                </label>

                <label className="profile-field">
                  <span>Correo</span>
                  <input
                    type="email"
                    name="usuario_correo"
                    value={formData.usuario_correo}
                    onChange={handleChange}
                  />
                </label>

                <label className="profile-field profile-field-full">
                  <span>Direccion</span>
                  <input
                    name="usuario_direccion"
                    value={formData.usuario_direccion}
                    onChange={handleChange}
                  />
                </label>

                <label className="profile-field profile-field-full">
                  <span>Nueva contrasena</span>
                  <div className="profile-password-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="usuario_credencial"
                      value={formData.usuario_credencial}
                      onChange={handleChange}
                      placeholder="Deja este campo vacio si no deseas cambiarla"
                    />
                    <button
                      type="button"
                      className="profile-password-toggle"
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? "Ocultar" : "Ver"}
                    </button>
                  </div>
                </label>
              </div>

              {error && <div className="profile-feedback error">{error}</div>}
              {success && <div className="profile-feedback success">{success}</div>}

              <div className="profile-actions">
                <button
                  type="button"
                  className="client-secondary-button"
                  onClick={() => {
                    if (originalData) {
                      setFormData((current) => ({
                        ...originalData,
                        usuario_credencial: current.usuario_credencial,
                      }));
                    }
                    setError("");
                  }}
                >
                  Limpiar
                </button>

                <button
                  type="submit"
                  className="client-primary-button"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </ClientLayout>
  );
}
