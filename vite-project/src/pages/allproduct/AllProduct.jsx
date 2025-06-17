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
    // console.log(item)
    dispatch(addToCart(item));
    toast.success("Agregar al carrito");
  };

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Borrar del carrito");
  };

  // console.log(cartItems)

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  return (
    <Layout>
      <div className="py-8">
        {/* Heading  */}
        <div className="">
          <h1 className=" text-center mb-5 text-2xl font-semibold">
            Todos los productos
          </h1>
        </div>

        {/* main  */}
        <section className="text-gray-600 body-font">
          <div className="container px-5 lg:px-0 py-5 mx-auto">
            <div className="flex flex-wrap -m-4">
              {getAllProduct.map((item, index) => {
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
    </Layout>
  );
};

export default AllProduct;
