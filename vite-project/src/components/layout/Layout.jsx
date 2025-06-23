import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbaar.jsx";
import Category from "../category/Category"; // 👈 Importá tu componente de categorías

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Category /> {/* 👈 Agregalo justo después de la Navbar */}
      <div className="main-content min-h-screen">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
