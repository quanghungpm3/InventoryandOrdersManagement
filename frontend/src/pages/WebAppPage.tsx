import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Logout from "@/components/auth/Logout";
import ProductPage from "@/pages/ProductPage";
import OrderPage from "@/pages/OrderPage";
import DashboardPage from "@/pages/DashboardPage";
import "@/components/ui/webapp.css";

const UserDropdown = ({ onClose }: { user: any; onClose: () => void }) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={dropdownRef} className="user-dropdown-box">
      <div className="dropdown-arrow"></div>
      <div className="dropdown-profile-header">
      </div>
      <ul className="dropdown-action-list">
        <li className="action-item">
          <i className="bi bi-gear"></i>
          <span>Cài đặt</span>
        </li>
        <li className="action-item logout-style">
          <i className="bi bi-box-arrow-right"></i>
          <Logout />
        </li>
      </ul>
    </div>
  );
};

const WebAppPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [activePage, setActivePage] = useState<"dashboard" | "product" | "order">("dashboard");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Dùng cho Desktop
  const [sidebarShowMobile, setSidebarShowMobile] = useState(false); // Dùng cho Mobile

  if (!user) return <div className="loading-state">Vui lòng đăng nhập...</div>;

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { key: "product", label: "Sản phẩm", icon: "bi-box-seam" },
    { key: "order", label: "Đơn hàng", icon: "bi-receipt" },
  ];

  return (
    <div className="app-container">
      <header className="topbar-Menu">
        <div className="topbar-left-section">
          <button className="mobile-toggle-btn" onClick={() => setSidebarShowMobile(true)}>
            <i className="bi bi-list"></i>
          </button>
          <button className="desktop-toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            <i className={`bi ${isCollapsed ? 'bi-text-indent-right' : 'bi-text-indent-left'}`}></i>
          </button>
          <span className="brand-title">Inventory & Orders</span>
        </div>
        <div className="topbar-right-section">
          <i className="bi bi-bell icon-btn"></i>
          <div className="vertical-divider"></div>

          <div className="user-profile-wrapper">
            <div className="user-nav-trigger" onClick={() => setShowDropdown(!showDropdown)}>
              <img src="https://i.pravatar.cc/150?u=longla" alt="user" className="thumb-avatar" />
              <span className="desktop-username"> {user.displayName}</span>
              <i className="bi bi-chevron-down arrow-icon"></i>
            </div>
            {showDropdown && <UserDropdown user={user} onClose={() => setShowDropdown(false)} />}
          </div>
        </div>
      </header>

      <div className="app-main-layout">
        {sidebarShowMobile && (
          <div className="sidebar-overlay" onClick={() => setSidebarShowMobile(false)}></div>
        )}

        <aside className={`sidebar-Menu ${isCollapsed ? 'collapsed' : ''} ${sidebarShowMobile ? 'mobile-show' : ''}`}>
          <div className="sidebar-header-mobile">
            <span className="brand-title">Inventory & Orders</span>
            <i className="bi bi-x-lg" onClick={() => setSidebarShowMobile(false)}></i>
          </div>

          <div className="sidebar-label">MAIN MENU</div>
          <nav className="nav-list">
            {menuItems.map(item => (
              <button
                key={item.key}
                className={`nav-link-custom ${activePage === item.key ? "active" : ""}`}
                onClick={() => {
                  setActivePage(item.key as any);
                  setSidebarShowMobile(false);
                }}
              >
                <i className={`bi ${item.icon}`}></i>
                <span className="link-text">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        <main className="main-content-Menu">
          <div className="content-card">
            {activePage === "dashboard" && <DashboardPage />}
            {activePage === "product" && <ProductPage />}
            {activePage === "order" && <OrderPage />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WebAppPage;