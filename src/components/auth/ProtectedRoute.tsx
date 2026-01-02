import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  const init = async () => {
    const store = useAuthStore.getState();

    // 🔑 F5 / reload: chưa có accessToken thì refresh
    if (!store.accessToken) {
      await refresh();
    }

    // 👉 lấy state MỚI NHẤT sau refresh
    const { accessToken, user } = useAuthStore.getState();

    // có token nhưng chưa có user
    if (accessToken && !user) {
      await fetchMe();
    }

    setStarting(false);
  };

  useEffect(() => {
    init();
  }, []);

  const { accessToken } = useAuthStore();

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
