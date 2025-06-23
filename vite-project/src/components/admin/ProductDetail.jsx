import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import Loader from "../loader/Loader";
import { deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const context = useContext(myContext);
  const { loading, setLoading, getAllProduct, getAllProductFunction } = context;
  const navigate = useNavigate();

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
  }, [getAllProduct]);

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

  // Delete product
  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(fireDB, "products", id));
      toast.success("Producto borrado exitosamente");
      getAllProductFunction();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-[#0a0a0a] min-h-[70vh] p-6 rounded-2xl shadow-lg border border-fuchsia-700 text-white">
      {/* Header con flechas y título */}
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
          Productos
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

      {/* Botón agregar producto */}
      <div className="flex justify-end mb-5">
        <Link to={"/addproduct"}>
          <button className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:from-fuchsia-500 hover:to-cyan-400 text-black px-4 py-2 rounded-md font-bold transition duration-300">
            Agregar
          </button>
        </Link>
      </div>

      {/* Loader */}
      <div className="flex justify-center relative top-20">
        {loading && <Loader />}
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

        <table className="w-full border-collapse border border-fuchsia-700 min-w-[800px]">
          <thead>
            <tr className="bg-black border-b border-fuchsia-600 text-cyan-400 uppercase text-sm">
              <th className="px-4 py-2 border border-fuchsia-600">N°</th>
              <th className="px-4 py-2 border border-fuchsia-600">Imagen</th>
              <th className="px-4 py-2 border border-fuchsia-600">Título</th>
              <th className="px-4 py-2 border border-fuchsia-600">Precio</th>
              <th className="px-4 py-2 border border-fuchsia-600">Categoría</th>
              <th className="px-4 py-2 border border-fuchsia-600">Día</th>
              <th className="px-4 py-2 border border-fuchsia-600">Editar</th>
              <th className="px-4 py-2 border border-fuchsia-600">Borrar</th>
            </tr>
          </thead>
          <tbody>
            {getAllProduct.map((item, index) => {
              const { id, title, price, category, date, productImageUrl } =
                item;
              return (
                <tr
                  key={index}
                  className="bg-black border-b border-fuchsia-700 hover:bg-fuchsia-900 transition-colors"
                >
                  <td className="px-4 py-2 border border-fuchsia-600 text-center text-sm text-cyan-400">
                    {index + 1}.
                  </td>
                  <td className="px-4 py-2 border border-fuchsia-600 text-center">
                    <img
                      className="w-20 mx-auto rounded-md object-contain"
                      src={productImageUrl}
                      alt={title}
                    />
                  </td>
                  <td className="px-4 py-2 border border-fuchsia-600 text-white text-sm capitalize">
                    {title}
                  </td>
                  <td className="px-4 py-2 border border-fuchsia-600 text-white text-sm">
                    $ {price}
                  </td>
                  <td className="px-4 py-2 border border-fuchsia-600 text-white text-sm capitalize">
                    {category}
                  </td>
                  <td className="px-4 py-2 border border-fuchsia-600 text-white text-sm text-center">
                    {date}
                  </td>
                  <td
                    onClick={() => navigate(`/updateproduct/${id}`)}
                    className="px-4 py-2 border border-fuchsia-600 text-green-400 text-center cursor-pointer hover:bg-green-700 transition duration-300 font-semibold"
                  >
                    Editar
                  </td>
                  <td
                    onClick={() => deleteProduct(id)}
                    className="px-4 py-2 border border-fuchsia-600 text-red-500 text-center cursor-pointer hover:bg-red-700 transition duration-300 font-semibold"
                  >
                    Borrar
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetail;
