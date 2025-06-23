import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "pc",
    subcategories: ["Cámaras", "Sensores", "Fuentes"],
  },
  {
    name: "perifericos",
    subcategories: ["Alarmas", "DVR", "CCTV"],
  },
  {
    name: "monitores",
    subcategories: ["Parlantes", "Micrófonos", "Auriculares"],
  },
];

const Category = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleMouseEnter = (idx) => {
    clearTimeout(timeoutRef.current);
    setHovered(idx);
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
      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden px-4 pb-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="mb-2">
              <div
                className="font-semibold cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400"
                onClick={() => {
                  navigate(`/category/${cat.name}`);
                  toggleMenu();
                }}
              >
                {cat.name}
              </div>
              {cat.subcategories.length > 0 && (
                <ul className="ml-4 mt-1 space-y-1 text-sm">
                  {cat.subcategories.map((sub, subIdx) => (
                    <li
                      key={subIdx}
                      className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                      onClick={() => {
                        navigate(`/category/${sub}`);
                        toggleMenu();
                      }}
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Desktop menu */}
      <div className="hidden lg:flex justify-center space-x-6 py-3 text-sm font-light relative z-50">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="relative group"
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 capitalize"
              onClick={() => navigate(`/category/${cat.name}`)}
            >
              {cat.name}
              {cat.subcategories.length > 0 && (
                <span className="ml-1">&#x25BE;</span>
              )}
            </button>

            {hovered === idx && submenuOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/80 text-white rounded shadow-lg w-44 z-50 transition-all duration-300 ease-in-out">
                {cat.subcategories.map((sub, subIdx) => (
                  <div
                    key={subIdx}
                    className="px-4 py-2 hover:bg-white/10 cursor-pointer text-sm transition"
                    onClick={() => navigate(`/category/${sub}`)}
                  >
                    {sub}
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
