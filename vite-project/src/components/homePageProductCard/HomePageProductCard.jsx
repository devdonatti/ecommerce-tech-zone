import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import myContext from "../../context/myContext";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";

const HomePageProductCard = () => {
  const navigate = useNavigate();
  const context = useContext(myContext);
  const { getAllProduct } = context;

  const cartItems = useSelector((state) => state.cart); // Asegúrate de que 'cart' sea un array
  const dispatch = useDispatch();

  // Agregar un producto al carrito
  const addCart = (item) => {
    dispatch(addToCart(item));
    toast.success("Agregado al carrito");
  };

  // Eliminar un producto del carrito
  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Borrado del carrito");
  };

  // Sincronizar el carrito con el localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <div className="mt-10">
      {/* Heading  */}
      <div className="">
        <h1 className="text-center mb-5 text-2xl font-semibold">Destacados</h1>
      </div>

      {/* Main Section */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-5 mx-auto">
          <div className="flex flex-wrap -m-4">
            {/* Asegúrate de que 'getAllProduct' sea un array */}
            {Array.isArray(getAllProduct) &&
              getAllProduct.slice(0, 8).map((item, index) => {
                const { id, title, price, productImageUrl } = item;
                return (
                  <div key={index} className="p-4 w-full md:w-1/4">
                    <div className="h-full border border-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer flex flex-col">
                      {/* Imagen */}
                      <img
                        onClick={() => navigate(`/productinfo/${id}`)}
                        className="lg:h-80 h-96 w-full object-cover"
                        src={productImageUrl}
                        alt="product"
                      />

                      {/* Contenido */}
                      <div className="p-6 flex flex-col justify-between flex-grow">
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
                              className="bg-red-700 hover:bg-gray-600 w-full text-white py-[6px] rounded-lg font-bold"
                            >
                              Borrar
                            </button>
                          ) : (
                            <button
                              onClick={() => addCart(item)}
                              className="bg-black hover:bg-gray-600 w-full text-white py-[6px] rounded-lg font-bold"
                            >
                              Agregar al carrito
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageProductCard;
