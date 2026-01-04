import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "@/pages/SignInPage";
import WebAppPage from "@/pages/WebAppPage";
import DashboardPage from "@/pages/DashboardPage";
import OrderPage from "@/pages/OrderPage";
import { Toaster } from "sonner";
import SignUpPage from "@/pages/SignUpPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route
            path="/signin"
            element={<SignInPage />}
          />
          <Route
            path="/signup"
            element={<SignUpPage />}
          />

          {/* protectect routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/"
                element={<WebAppPage />}
              />
              <Route
                path="/"
                element={<DashboardPage />}
              />
              <Route
                path="/products"
                element={<OrderPage />}
              />
              <Route
                path="/orders"
                element={<ProductPage />}
              />
            </Route>

            
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
