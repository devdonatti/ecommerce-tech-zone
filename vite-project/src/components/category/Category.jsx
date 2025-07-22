import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const categoryData = {
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
  Corporativos: "",
};

const Category = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleMouseEnter = (catName) => {
    clearTimeout(timeoutRef.current);
    setHovered(catName);
    setSubmenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHovered(null);
      setSubmenuOpen(false);
    }, 200);
  };

  return (
    <div className="bg-gray-200 dark:bg-black text-black dark:text-white border-b border-gray-300 dark:border-gray-700 z-40 relative">
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden px-4 pb-4">
          <div
            className="mb-2 font-semibold cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400"
            onClick={() => {
              navigate("/productos");
              toggleMenu();
            }}
          >
            Productos
          </div>

          {Object.entries(categoryData).map(([cat, subcats]) => (
            <div key={cat} className="mb-3">
              <div className="font-semibold cursor-default">{cat}</div>
              <div className="ml-4 mt-1 text-sm space-y-2">
                {Object.entries(subcats).map(([subcat, filters]) => (
                  <div key={subcat}>
                    {subcat !== "" && (
                      <div className="text-cyan-500 dark:text-cyan-400 font-semibold uppercase">
                        {subcat}
                      </div>
                    )}
                    <ul className="ml-3 mt-1 space-y-1">
                      {filters.map((filter, i) => (
                        <li
                          key={i}
                          className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400"
                          onClick={() => {
                            navigate(`/category/${filter}`);
                            toggleMenu();
                          }}
                        >
                          {filter}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop Menu */}
      <div className="hidden lg:flex justify-center space-x-6 py-3 text-sm font-light relative z-50">
        <div className="relative group">
          <button
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 capitalize"
            onClick={() => navigate("/productos")}
          >
            Productos
          </button>
        </div>

        {Object.entries(categoryData).map(([cat, subcats]) => (
          <div
            key={cat}
            className="relative group"
            onMouseEnter={() => handleMouseEnter(cat)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 capitalize">
              {cat}
              {Object.keys(subcats).length > 0 && (
                <span className="ml-1">&#x25BE;</span>
              )}
            </button>

            {hovered === cat && submenuOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/80 text-white rounded shadow-lg w-64 z-50 p-4 space-y-2">
                {Object.entries(subcats).map(([subcat, filters]) => (
                  <div key={subcat}>
                    {subcat !== "" && (
                      <div className="text-xs uppercase tracking-wide text-cyan-400 mb-1 font-semibold">
                        {subcat}
                      </div>
                    )}
                    <ul className="space-y-1">
                      {filters.map((filter, i) => (
                        <li
                          key={i}
                          className="cursor-pointer text-sm hover:text-cyan-400 transition"
                          onClick={() => navigate(`/category/${filter}`)}
                        >
                          {filter}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
