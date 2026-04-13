import SidebarClient from "../components/SidebarClient";
import "../styles/clientLayout.css";

export default function ClientLayout({ children }) {
  return (
    <div className="client-layout">
      <SidebarClient />

      <div className="client-content">
        {children}
      </div>
    </div>
  );
}