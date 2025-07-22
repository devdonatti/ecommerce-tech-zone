import { useNavigate } from "react-router";
import Layout from "../../components/layout/Layout";
import { useContext, useEffect } from "react";
import myContext from "../../context/myContext";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";

const AllProduct = () => {
  const navigate = useNavigate();

  const context = useContext(myContext);
  const { getAllProduct } = context;

  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addCart = (item) => {
    dispatch(addToCart(item));
    toast.success("Agregar al carrito");
  };

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Borrar del carrito");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      <div className="py-8">
        {/* Heading */}
        <h1 className="text-center mb-5 text-2xl font-semibold">
          Todos los productos
        </h1>

        {/* Main */}
        <section className="text-gray-600 body-font">
          <div className="container px-5 lg:px-0 py-5 mx-auto">
            {/* Usamos grid para 2 columnas en móvil, 4 en md+ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {getAllProduct.map((item, index) => {
                const { id, title, price, productImageUrl } = item;
                return (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer flex flex-col"
                  >
                    {/* Imagen */}
                    <img
                      onClick={() => navigate(`/productinfo/${id}`)}
                      className="lg:h-64 h-48 w-full object-cover"
                      src={productImageUrl}
                      alt="product"
                    />

                    {/* Contenido */}
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <div>
                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                          SMILE
                        </h2>

                        {/* Título truncado en una línea */}
                        <h1 className="title-font text-lg font-medium text-gray-900 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                          {title}
                        </h1>

                        <h1 className="title-font text-lg font-medium text-gray-900 mb-4">
                          ${price}
                        </h1>
                      </div>

                      {/* Botón alineado abajo */}
                      <div className="flex justify-center mt-auto">
                        {cartItems.some((p) => p.id === item.id) ? (
                          <button
                            onClick={() => deleteCart(item)}
                            className="bg-red-700 hover:bg-gray-600 w-full text-white py-1 rounded-lg font-bold"
                          >
                            Borrar
                          </button>
                        ) : (
                          <button
                            onClick={() => addCart(item)}
                            className="bg-black hover:bg-gray-600 w-full text-white py-1 rounded-lg font-bold"
                          >
                            Agregar al carrito
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AllProduct;
