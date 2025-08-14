import { useNavigate, useParams } from "react-router";
import Layout from "../../components/layout/Layout";
import { useContext } from "react";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { Eye, ShoppingCart } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";

const CategoryPage = () => {
  const { categoryname } = useParams();
  const context = useContext(myContext);
  const { getAllProduct, loading } = context;
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart); // asumí que tu carrito está en state.cart

  // Función para agregar al carrito con precios bien calculados
  const addCart = (item) => {
    const priceBase = Number(item.price); // precio base (transferencia)
    const priceCard = Math.round(priceBase * 1.1); // precio con recargo 10%

    dispatch(
      addToCart({
        ...item,
        quantity: 1,
        price: priceCard, // guardo el precio con recargo para simplificar cálculos después
        priceCard: priceCard,
      })
    );

    toast.success("Agregado al carrito");
  };

  // Filtramos productos por categoría
  const filterProduct = getAllProduct.filter((obj) =>
    obj.category.includes(categoryname)
  );

  // Cálculos de totales idénticos a los de cartpage.jsx
  const cartItemTotal = cartItems.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    return sum + (isNaN(quantity) ? 0 : quantity);
  }, 0);

  const cartTotal = cartItems.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    const price = Number(item.priceCard ?? item.price);
    return sum + (isNaN(quantity) || isNaN(price) ? 0 : quantity * price);
  }, 0);

  const transferTotal = cartItems.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    const priceWithRecargo = Number(item.price);
    const priceBase = priceWithRecargo / 1.1; // deshacer recargo
    return (
      sum + (isNaN(quantity) || isNaN(priceBase) ? 0 : quantity * priceBase)
    );
  }, 0);

  return (
    <Layout>
      <div className="mt-10 px-5">
        {/* Heading */}
        <h1 className="text-center mb-5 text-2xl font-semibold first-letter:uppercase">
          {categoryname}
        </h1>

        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <>
            {filterProduct.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filterProduct.map((item) => {
                  const { id, title, price, productImageUrl } = item;
                  return (
                    <div
                      key={id}
                      className="bg-white dark:bg-gray-900 border p-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-[0_0_15px_#06b6d4] hover:border-cyan-500 transition-all duration-300"
                    >
                      <img
                        onClick={() => {
                          navigate(`/productinfo/${id}`);
                          window.scrollTo(0, 0);
                        }}
                        className="h-52 sm:h-60 w-full object-cover cursor-pointer"
                        src={productImageUrl}
                        alt={title}
                      />

                      <div className="p-4 space-y-2">
                        <h2 className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                          {title}
                        </h2>

                        <p className="text-xs text-[#08BC08] dark:text-gray-500 line-through">
                          ${Math.round(price * 1.25).toLocaleString("es-AR")}
                        </p>

                        <div>
                          <p className="text-3xl font-bold text-[#08BC08] dark:text-[#08BC08] leading-tight">
                            ${price.toLocaleString("es-AR")}
                          </p>
                          <span className="block text-sm text-[#08BC08] font-medium">
                            con débito o transferencia
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${Math.round(price * 1.1).toLocaleString("es-AR")}{" "}
                          crédito
                        </p>

                        <div className="flex flex-col gap-2 mt-3">
                          <button
                            onClick={() => {
                              navigate(`/productinfo/${id}`);
                              window.scrollTo(0, 0);
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-[#08BC08] hover:bg-cyan-500 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors"
                          >
                            <Eye size={16} /> VER MÁS
                          </button>
                          <button
                            onClick={() => addCart(item)}
                            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-800 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors"
                          >
                            <ShoppingCart size={16} /> AGREGAR AL CARRITO
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center mt-10">
                <img
                  className="mb-2"
                  src="https://cdn-icons-png.flaticon.com/128/2748/2748614.png"
                  alt="No products"
                />
                <h1 className="text-black text-xl">
                  {categoryname} no fue encontrado
                </h1>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
