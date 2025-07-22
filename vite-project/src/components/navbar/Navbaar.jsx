import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ShoppingCart,
  UserCircle2,
  MessageCircle,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import SearchBar from "../searchBar/SearchBar";
import { useState, useRef } from "react";
import useDarkMode from "../../hooks/useDarkMode";

const categories = {
  Notebooks: {
    Notebooks: ["Notebooks AMD", "Notebooks Intel"],
    Almacenamiento: [
      "Discos SSD",
      "Discos Externos USB",
      "Memorias SD - Pendrives",
    ],
    Accesorios: ["Mouse Inalámbricos", "Mochilas", "Pads"],
    "Memorias RAM": ["Memorias RAM Sodimm"],
  },
  "Componentes de PC": {
    "": [
      "Placas de Video",
      "Motherboards",
      "Microprocesadores",
      "Discos SSD",
      "Memorias RAM",
      "Gabinetes",
      "Fuentes",
      "CPU Coolers - Coolers",
      "Conectividad",
    ],
    Accesorios: ["Pasta térmica"],
  },
  Periféricos: {
    Auriculares: [
      "Gamer",
      "Estéreo",
      "Surround",
      "Para celular",
      "Soporte de auriculares",
    ],
    Mouse: ["Gamer", "Inalámbrico"],
    Teclados: ["Mecánicos", "Membrana", "RGB", "Combo"],
    Pads: ["Small", "Medium", "Large"],
    Parlantes: ["Parlantes"],
    Joysticks: ["Joystick"],
    "Volantes y Accesorios": ["Volantes"],
    Webcams: ["WebCams"],
    Impresoras: ["Tinta y tóner"],
  },
  Monitores: {
    "": [
      "Monitores LED",
      'Monitores 21"',
      'Monitores 24"',
      'Monitores 27"',
      'Monitores 32"',
      "Monitores Curvos",
    ],
  },
};

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

  const [theme, toggleTheme] = useDarkMode();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const [hovered, setHovered] = useState(null);
  const timeoutRef = useRef(null);

  const logout = () => {
    localStorage.clear("users");
    navigate("/");
  };

  // Toggle submenu para móvil
  const toggleSubmenu = (idx) => {
    if (submenuOpen === idx) setSubmenuOpen(null);
    else setSubmenuOpen(idx);
  };

  // Hover submenu desktop
  const handleMouseEnter = (cat) => {
    clearTimeout(timeoutRef.current);
    setHovered(cat);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHovered(null);
    }, 200);
  };

  return (
    <nav className="bg-black text-white dark:text-white sticky top-0 z-50 shadow-md transition-colors duration-300">
      {/* MOBILE header */}
      <div className="lg:hidden flex justify-between items-center px-4 py-3">
        {/* Menu hamburguesa izquierda */}
        <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {showMobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logo centro */}
        <Link to="/">
          <img className="h-12" src="/logo3.png" alt="Logo" />
        </Link>

        {/* Carrito y modo oscuro derecha */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingCart size={26} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          <button onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE menu desplegable */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white dark:bg-black px-4 pb-4 text-black dark:text-white">
          {Object.entries(categories).map(([catName, subcats], idx) => (
            <div
              key={catName}
              className="border-b border-gray-300 dark:border-gray-700 py-2"
            >
              <button
                onClick={() => toggleSubmenu(idx)}
                className="flex justify-between w-full font-semibold text-left"
              >
                <span className="capitalize">{catName}</span>
                <span>{submenuOpen === idx ? "−" : "+"}</span>
              </button>

              {submenuOpen === idx && (
                <div className="ml-4 mt-2 space-y-2 text-sm">
                  {Object.entries(subcats).map(([subcatTitle, subcatItems]) => (
                    <div key={subcatTitle}>
                      {subcatTitle !== "" && (
                        <div className="text-cyan-500 font-semibold uppercase">
                          {subcatTitle}
                        </div>
                      )}
                      <ul className="ml-3 mt-1 space-y-1">
                        {subcatItems.map((item, i) => (
                          <li
                            key={i}
                            className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-cyan-500 transition-colors"
                            onClick={() => {
                              navigate(`/category/${item}`);
                              setShowMobileMenu(false);
                            }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Opciones usuario */}
          <div className="mt-4 border-t border-gray-300 dark:border-gray-700 pt-3 space-y-2 text-sm">
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
              <button onClick={logout} className="block w-full text-left py-1">
                Cerrar sesión
              </button>
            )}
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
            <img className="h-16 w-auto" src="/logo3.png" alt="Logo" />
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="w-1/3 flex justify-end space-x-6 items-center">
          <Link to="/FAQ" className="flex flex-col items-center text-sm">
            <MessageCircle size={22} />
            <span>Ayuda</span>
          </Link>

          {/* Modo claro/oscuro */}
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center text-sm"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === "dark" ? "Claro" : "Oscuro"}</span>
          </button>

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
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow-lg z-30">
                {!user && (
                  <>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowDropdown(false)}
                    >
                      Registrarse
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowDropdown(false)}
                    >
                      Iniciar sesión
                    </Link>
                  </>
                )}
                {user?.role === "user" && (
                  <Link
                    to="/user-dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowDropdown(false)}
                  >
                    Usuario
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link
                    to="/admin-dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowDropdown(false)}
                  >
                    Admin
                  </Link>
                )}
                {user && (
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
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

      {/* DESKTOP submenu desplegable */}
      <div
        onMouseLeave={handleMouseLeave}
        className="hidden lg:flex justify-center bg-black/90 text-white absolute top-full left-0 right-0 z-40"
      >
        {hovered &&
          Object.entries(categories[hovered]).map(([subcatTitle, items]) => (
            <div
              key={subcatTitle}
              className="px-6 py-4 border-r last:border-r-0 border-gray-700 min-w-[160px]"
            >
              {subcatTitle !== "" && (
                <h3 className="text-cyan-400 font-semibold uppercase mb-2">
                  {subcatTitle}
                </h3>
              )}
              <ul className="space-y-1 text-sm">
                {items.map((item, i) => (
                  <li
                    key={i}
                    className="cursor-pointer hover:text-cyan-400 transition"
                    onClick={() => navigate(`/category/${item}`)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </nav>
  );
};

export default Navbar;
