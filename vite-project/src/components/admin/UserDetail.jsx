import { useContext, useEffect, useRef, useState } from "react";
import myContext from "../../context/myContext";

const UserDetail = () => {
  const context = useContext(myContext);
  const { getAllUser } = context;

  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      setShowArrows(el.scrollWidth > el.clientWidth);
    };

    checkScroll();

    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [getAllUser]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
    }
  };

  return (
    <div className="relative bg-[#0a0a0a] min-h-[70vh] p-6 rounded-2xl shadow-lg border border-fuchsia-700 text-white">
      {/* Contenedor título + flechas */}
      <div className="flex items-center justify-center mb-6 gap-4">
        {showArrows && (
          <button
            onClick={scrollLeft}
            aria-label="Desplazar tabla a la izquierda"
            title="Desplazar tabla a la izquierda"
            className="flex items-center justify-center w-10 h-10 bg-fuchsia-700 hover:bg-fuchsia-600 rounded-full shadow-lg cursor-pointer transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        <h1 className="text-2xl font-extrabold text-fuchsia-500 select-none">
          Usuarios
        </h1>

        {showArrows && (
          <button
            onClick={scrollRight}
            aria-label="Desplazar tabla a la derecha"
            title="Desplazar tabla a la derecha"
            className="flex items-center justify-center w-10 h-10 bg-fuchsia-700 hover:bg-fuchsia-600 rounded-full shadow-lg cursor-pointer transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Tabla con scroll horizontal sin barra visible */}
      <div
        className="relative overflow-x-auto"
        ref={scrollRef}
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE 10+
        }}
      >
        {/* Ocultar scrollbar Chrome, Edge, Safari */}
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        <table className="w-full border-collapse border border-fuchsia-700 min-w-[700px]">
          <thead>
            <tr className="bg-black border-b border-fuchsia-600 text-cyan-400 uppercase text-sm">
              <th className="px-4 py-2 border border-fuchsia-600">N°</th>
              <th className="px-4 py-2 border border-fuchsia-600">Nombre</th>
              <th className="px-4 py-2 border border-fuchsia-600">Email</th>
              <th className="px-4 py-2 border border-fuchsia-600">Uid</th>
              <th className="px-4 py-2 border border-fuchsia-600">Rol</th>
              <th className="px-4 py-2 border border-fuchsia-600">Día</th>
            </tr>
          </thead>

          <tbody>
            {getAllUser.map((value, index) => (
              <tr
                key={index}
                className="bg-black border-b border-fuchsia-700 hover:bg-fuchsia-900 transition-colors"
              >
                <td className="px-4 py-2 border border-fuchsia-600 text-center text-sm text-cyan-400">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border border-fuchsia-600 text-white text-sm capitalize">
                  {value.name}
                </td>
                <td className="px-4 py-2 border border-fuchsia-600 text-white text-sm break-words cursor-pointer">
                  {value.email}
                </td>
                <td className="px-4 py-2 border border-fuchsia-600 text-white text-sm cursor-pointer">
                  {value.uid}
                </td>
                <td className="px-4 py-2 border border-fuchsia-600 text-white text-sm cursor-pointer capitalize">
                  {value.role}
                </td>
                <td className="px-4 py-2 border border-fuchsia-600 text-white text-sm cursor-pointer text-center">
                  {value.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetail;
