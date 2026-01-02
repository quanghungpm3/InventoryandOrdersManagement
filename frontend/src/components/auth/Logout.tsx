import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const Logout = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="logout-text w-100" onClick={handleLogout}>
      Đăng xuất
    </div>
  );
};

export default Logout;