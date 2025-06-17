import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const categories = [
  {
    name: "PC",
    subcategories: ["Cámaras", "Sensores", "Fuentes"],
  },
  {
    name: "Perifericos",
    subcategories: ["Alarmas", "DVR", "CCTV"],
  },
  {
    name: "Monitores",
    subcategories: ["Parlantes", "Micrófonos", "Auriculares"],
  },
];

const Category = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="bg-black text-white border-b border-gray-700">
      {/* Mobile toggle */}
      <div className="lg:hidden flex justify-between items-center px-4 py-3">
        <span className="text-white font-semibold">Categorías</span>
        <button onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden px-4 pb-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="mb-2">
              <div
                className="font-semibold cursor-pointer"
                onClick={() => {
                  if (cat.subcategories.length === 0) {
                    navigate(`/category/${cat.name}`);
                    toggleMenu();
                  }
                }}
              >
                {cat.name}
              </div>
              {cat.subcategories.length > 0 && (
                <ul className="ml-4 mt-1 space-y-1 text-sm">
                  {cat.subcategories.map((sub, subIdx) => (
                    <li
                      key={subIdx}
                      className="cursor-pointer text-gray-300 hover:text-white"
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
      <div className="hidden lg:flex justify-center space-x-6 py-3 text-sm font-light relative">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="relative group"
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <button
              className="hover:text-gray-300 transition-colors duration-200"
              onClick={() =>
                cat.subcategories.length === 0 &&
                navigate(`/category/${cat.name}`)
              }
            >
              {cat.name}
              {cat.subcategories.length > 0 && (
                <span className="ml-1">&#x25BE;</span>
              )}
            </button>

            {hovered === idx && cat.subcategories.length > 0 && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white text-black rounded shadow-lg z-10 w-40">
                {cat.subcategories.map((sub, subIdx) => (
                  <div
                    key={subIdx}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
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
