import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "@/components/ui/webapp.css";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import Logout from "@/components/auth/Logout";
import ProductPage from "@/pages/ProductPage";
import OrderPage from "@/pages/OrderPage";

// --- COMPONENT CON: USER DROPDOWN ---
const UserDropdown: React.FC<{ user: any; onClose: () => void }> = ({ user, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={dropdownRef} className="user-dropdown-box shadow">
      {/* Phần Header Profile */}
      <div className="dropdown-profile-header text-center">
        <div className="avatar-container mb-2">
          <img 
            src="https://i.pravatar.cc/150?u=longla" 
            alt="avatar" 
            className="avatar-large" 
          />
        </div>
        <h5 className="user-display-name">{user.username || 'longla'}</h5>
        <p className="user-display-email">{user.email || 'longla@gmail.com'}</p>
      </div>

      {/* Danh sách chức năng */}
      <div className="dropdown-divider-custom"></div>
      
      <ul className="dropdown-action-list">
        <li className="action-item">
          <i className="bi bi-person-circle icon-blue"></i>
          <span>Thông tin cá nhân</span>
        </li>
        <li className="action-item logout-action">
          <i className="bi bi-power"></i>
          <Logout /> {/* Đảm bảo component Logout chỉ render text "Sign Out" */}
        </li>
      </ul>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const WebAppPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [activePage, setActivePage] = useState<"product" | "order">("product");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return <div className="p-5 text-center">Vui lòng đăng nhập...</div>;

  return (
    <div className="app-container d-flex flex-column vh-100">
      
      {/* 1. TOPBAR */}
      <header className="topbar-Menu px-4 d-flex align-items-center justify-content-between bg-white border-bottom shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <i 
            className={`bi ${isCollapsed ? 'bi-list' : 'bi-text-indent-left'} fs-4 cursor-pointer text-muted`}
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ cursor: 'pointer' }}
          ></i>
          <div className="topbar-left d-none d-md-block fw-bold text-dark">
             Inventory & Orders Management
          </div>
        </div>

        <div className="topbar-right d-flex align-items-center">
          <div className="d-flex gap-3 me-4 text-muted fs-5 d-none d-sm-flex">
             

            <i className="bi bi-bell cursor-pointer"></i>
          </div>
          <div className="vr me-4 opacity-25" style={{ height: '30px' }}></div>
          
          <div className="position-relative">
            <div 
              className="user-nav-trigger d-flex align-items-center gap-2" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img src="https://i.pravatar.cc/150?u=longla" alt="user" className="rounded-circle thumb-avatar" />
              <span className="fw-medium d-none d-md-inline">{user.username}</span>
              <i className="bi bi-chevron-down small text-muted"></i>
            </div>

            {showDropdown && <UserDropdown user={user} onClose={() => setShowDropdown(false)} />}
          </div>
        </div>
      </header>

      <div className="d-flex flex-grow-1 overflow-hidden">
        
        {/* 2. SIDEBAR */}
        <aside className={`sidebar-Menu ${isCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-label px-4 mt-4 mb-2">
            <small className="text-muted fw-bold">{isCollapsed ? '•' : 'MAIN MENU'}</small>
          </div>

          <nav className="nav flex-column">
            <button 
              className={`nav-link-custom ${activePage === "product" ? "active" : ""}`} 
              onClick={() => setActivePage("product")}
            >
              <i className="bi bi-box-seam"></i>
              <span>Sản phẩm</span>
            </button>
            <button 
              className={`nav-link-custom ${activePage === "order" ? "active" : ""}`} 
              onClick={() => setActivePage("order")}
            >
              <i className="bi bi-receipt"></i>
              <span>Đơn hàng</span>
            </button>
          </nav>
        </aside>

        {/* 3. MAIN CONTENT */}
        <main className="main-content-Menu p-4 flex-grow-1 overflow-auto bg-light">
          <div className="content-card shadow-sm">
            {activePage === "product" && <ProductPage />}
            {activePage === "order" && <OrderPage />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WebAppPage;