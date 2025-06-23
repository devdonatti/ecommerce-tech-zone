import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage.jsx";
import NoPage from "./pages/noPage/NoPage.jsx";
import ProductInfo from "./pages/productoInfo/ProductInfo.jsx";
import ScrollTop from "./components/scrollTop/ScrollTop.jsx";
import CartPages from "./pages/cart/CartPages.jsx";
import AllProduct from "./pages/allproduct/AllProduct.jsx";
import Signup from "./pages/registration/Signup";
import Login from "./pages/registration/Login";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProductPage from "./pages/admin/AddProductPage.jsx";
import UpdateProductPage from "./pages/admin/UpdateProductPage.jsx";
import MyState from "./context/myState.jsx";
import { Toaster } from "react-hot-toast";
import { ProtectedRouteForUser } from "./protectedRoute/ProtectedRouteForUser";
import { ProtectedRouteForAdmin } from "./protectedRoute/ProtectedRouteForAdmin";
import CategoryPage from "./pages/category/CategoryPage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {
  return (
    <MyState>
      <Router>
        <div className="bg-white min-h-screen overflow-x-hidden w-full">
          <ScrollTop />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NoPage />} />
            <Route path="/productinfo/:id" element={<ProductInfo />} />
            <Route path="/cart" element={<CartPages />} />
            <Route path="/allproduct" element={<AllProduct />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/category/:categoryname"
              element={<CategoryPage />}
            />{" "}
            {/* category Page route  */}
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRouteForUser>
                  <UserDashboard />
                </ProtectedRouteForUser>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRouteForAdmin>
                  <AdminDashboard />
                </ProtectedRouteForAdmin>
              }
            />
            <Route
              path="/addproduct"
              element={
                <ProtectedRouteForAdmin>
                  <AddProductPage />
                </ProtectedRouteForAdmin>
              }
            />
            <Route
              path="/updateproduct/:id"
              element={
                <ProtectedRouteForAdmin>
                  <UpdateProductPage />
                </ProtectedRouteForAdmin>
              }
            />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </MyState>
  );
};

export default App;
