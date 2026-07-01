import SidebarAsesor from "../components/SidebarAsesor";
import "../styles/asesorLayout.css";

export default function AsesorLayout({ children }) {
  return (
    <div className="asesor-layout">
      <SidebarAsesor />

      <div className="asesor-content">
        {children}
      </div>
    </div>
  );
}