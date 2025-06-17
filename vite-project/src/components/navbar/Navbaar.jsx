import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ShoppingCart,
  LogOut,
  UserCircle2,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import SearchBar from "../searchBar/SearchBar";
import { useState } from "react";

const Navbar = () => {
  const storedUser = localStorage.getItem("users");
  let user = null;

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("Error al parsear los datos de usuario:", error);
    }
  }

  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const logout = () => {
    localStorage.clear("users");
    navigate("/");
  };

  return (
    <nav className="bg-black sticky top-0 z-50 text-white shadow-md">
      {/* MOBILE header */}
      <div className="lg:hidden flex justify-between items-center px-4 py-3">
        <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {showMobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
        <Link to="/">
          <img className="h-12" src="/logo1.png" alt="Logo" />
        </Link>
        <div className="relative">
          <Link to="/cart">
            <ShoppingCart size={26} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* MOBILE menu content */}
      {showMobileMenu && (
        <div className="lg:hidden px-4 pb-4 space-y-3 text-sm">
          <SearchBar />
          <div className="space-y-2">
            <Link
              to="/ayuda"
              className="flex items-center gap-2"
              onClick={() => setShowMobileMenu(false)}
            >
              <MessageCircle size={20} /> Ayuda
            </Link>

            <div>
              {!user && (
                <>
                  <Link
                    to="/signup"
                    className="block py-1"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Registrarse
                  </Link>
                  <Link
                    to="/login"
                    className="block py-1"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Iniciar sesión
                  </Link>
                </>
              )}
              {user?.role === "user" && (
                <Link
                  to="/user-dashboard"
                  className="block py-1"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Usuario
                </Link>
              )}
              {user?.role === "admin" && (
                <Link
                  to="/admin-dashboard"
                  className="block py-1"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Admin
                </Link>
              )}
              {user && (
                <button
                  onClick={logout}
                  className="block w-full text-left py-1"
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP layout */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2">
        {/* Left: Search Bar */}
        <div className="w-1/3">
          <SearchBar />
        </div>

        {/* Center: Logo */}
        <div className="w-1/3 flex justify-center">
          <Link to="/">
            <img className="h-16 w-auto" src="/logo1.png" alt="Logo" />
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="w-1/3 flex justify-end space-x-6 items-center">
          <Link to="/ayuda" className="flex flex-col items-center text-sm">
            <MessageCircle size={22} />
            <span>Ayuda</span>
          </Link>

          {/* Usuario Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex flex-col items-center text-sm"
            >
              <UserCircle2 size={24} />
              <span>Mi cuenta</span>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-30">
                {!user && (
                  <>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Registrarse
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Iniciar sesión
                    </Link>
                  </>
                )}
                {user?.role === "user" && (
                  <Link
                    to="/user-dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Usuario
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link
                    to="/admin-dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Admin
                  </Link>
                )}
                {user && (
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Salir
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Carrito */}
          <Link
            to="/cart"
            className="flex flex-col items-center text-sm relative"
          >
            <ShoppingCart size={22} />
            <span>Mi carrito</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
