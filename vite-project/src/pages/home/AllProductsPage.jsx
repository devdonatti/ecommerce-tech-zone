import { useContext } from "react";
import myContext from "../../context/myContext";
import { useNavigate } from "react-router";
import { Eye, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import Layout from "../../components/layout/Layout";

const AllProductsPage = () => {
  const { getAllProduct } = useContext(myContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addCart = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
    toast.success("Agregado al carrito");
  };

  return (
    <Layout>
      <div className="px-4 mt-8">
        <h1 className="text-2xl font-semibold text-center dark:text-black mb-6">
          Todos los Productos
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(getAllProduct) &&
            getAllProduct.map((item) => {
              const { id, title, price, productImageUrl } = item;

              const priceOriginal = price; // precio base
              const priceDiscount = Math.round(priceOriginal * 1.25); // tachado
              const priceInstallments = Math.round(priceOriginal * 1.1); // cuotas

              return (
                <div
                  key={id}
                  className="bg-white dark:bg-gray-900 border p-3 rounded-xl shadow hover:shadow-[0_0_15px_#06b6d4] hover:border-cyan-500 transition-all duration-300"
                >
                  <img
                    src={productImageUrl}
                    alt={title}
                    className="h-52 w-full object-cover rounded-md cursor-pointer"
                    onClick={() => navigate(`/productinfo/${id}`)}
                  />
                  <div className="mt-3 space-y-1">
                    <h2 className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                      {title}
                    </h2>

                    {/* Precio tachado */}
                    <p className="text-xs text-gray-400 line-through">
                      ${priceDiscount.toLocaleString("es-AR")}
                    </p>

                    {/* Precio principal */}
                    <p className="text-lg font-bold text-[#08BC08] dark:text-[#08BC08]">
                      ${priceOriginal.toLocaleString("es-AR")}
                    </p>

                    {/* Precio en cuotas */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      ${Number(priceOriginal).toLocaleString("es-AR")} en cuotas
                    </p>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => navigate(`/productinfo/${id}`)}
                        className="flex-1 flex items-center justify-center gap-1 bg-[#08BC08] hover:bg-green-700 text-white py-1 rounded-full text-xs"
                      >
                        <Eye size={14} /> Ver
                      </button>
                      <button
                        onClick={() => addCart(item)}
                        className="flex-1 flex items-center justify-center gap-1 bg-cyan-600 hover:bg-cyan-800 text-white py-1 rounded-full text-xs"
                      >
                        <ShoppingCart size={14} /> Agregar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
};

export default AllProductsPage;
