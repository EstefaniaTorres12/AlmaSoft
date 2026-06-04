import { useEffect, useState } from "react";

/**
 * Devuelve la sesión del usuario desde localStorage y se sincroniza
 * ante cambios (evento storage y eventos personalizados de perfil).
 */
export function useSession(profilePhotoKey = null) {
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario")) || {};
    } catch {
      return {};
    }
  });

  const [profilePhoto, setProfilePhoto] = useState("/img/usuario.png");

  useEffect(() => {
    const sync = () => {
      try {
        const u = JSON.parse(localStorage.getItem("usuario")) || {};
        setUsuario(u);

        if (profilePhotoKey) {
          const uid = u.usuario_id || localStorage.getItem("usuario_id");
          const key = `${profilePhotoKey}_${uid}`;
          setProfilePhoto(localStorage.getItem(key) || "/img/usuario.png");
        }
      } catch {
        setUsuario({});
        setProfilePhoto("/img/usuario.png");
      }
    };

    sync();

    const events = ["storage", "client-profile-updated", "asesor-profile-updated"];
    events.forEach((e) => window.addEventListener(e, sync));
    return () => events.forEach((e) => window.removeEventListener(e, sync));
  }, [profilePhotoKey]);

  const nombreCorto =
    [usuario.usuario_primer_nombre, usuario.usuario_primer_apellido]
      .filter(Boolean)
      .join(" ") ||
    usuario.usuario_correo ||
    "Usuario";

  const rol = localStorage.getItem("rol") || "";

  return { usuario, nombreCorto, profilePhoto, rol };
}
