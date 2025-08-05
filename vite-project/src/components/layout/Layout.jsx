import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbaar.jsx";
import Category from "../category/Category";

const Layout = ({ children }) => {
  return (
    <div className="relative">
      <Navbar />
      <Category />
      <div className="main-content min-h-screen">{children}</div>
      <Footer />

      {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/5491154105141" // tu número con código de país sin +
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 hover:bg-[#08BC08] text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 z-50"
      >
        <img className="w-20 h-20" src="/wp.png" alt="" />
      </a>
    </div>
  );
};

export default Layout;
