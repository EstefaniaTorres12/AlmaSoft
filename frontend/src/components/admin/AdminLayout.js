import AdminSideBar from "./AdminSideBar";
import "../../styles/admin.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSideBar />
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
