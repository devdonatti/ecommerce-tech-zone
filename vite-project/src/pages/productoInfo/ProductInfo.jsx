import { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import { useParams } from "react-router";
import { fireDB } from "../../firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";

initMercadoPago("APP_USR-84634554-b65e-4d73-8dee-c07d4962e39b ", {
  locale: "es-AR",
}); // CLIENT iD

const ProductInfo = () => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [mainImage, setMainImage] = useState(""); // para la galería
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  const createPreference = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/create_preference",
        {
          title: product?.title,
          quantity: 1,
          price: product?.price,
          description: product?.description,
          picture_url: product?.productImageUrl,
        }
      );
      const { id } = response.data;
      return id;
    } catch (error) {
      console.error("Error al crear la preferencia:", error);
    }
  };

  const handleBuy = async () => {
    const id = await createPreference();
    if (id) setPreferenceId(id);
  };

  const [product, setProduct] = useState("");
  const { id } = useParams();

  const getProductData = async () => {
    setLoading(true);
    try {
      const productTemp = await getDoc(doc(fireDB, "products", id));
      const productData = { ...productTemp.data(), id: productTemp.id };
      setProduct(productData);
      setMainImage(productData.productImageUrl); // setea imagen principal
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addCart = (item) => {
    dispatch(addToCart(item));
    toast.success("Agregado al carrito");
  };

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Borrado del carrito");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    getProductData();
  }, []);

  return (
    <Layout>
      <section className="py-6 lg:py-12 bg-white text-gray-800 dark:bg-black dark:text-white">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Imagen principal y galería */}
              <div className="md:w-1/2 flex flex-col items-center gap-4">
                <img
                  src={mainImage}
                  alt={product?.title}
                  className="w-full max-w-md border p-2 rounded-lg object-contain"
                />
                <div className="flex gap-2 flex-wrap justify-center">
                  {[product?.productImageUrl, ...(product?.images || [])].map(
                    (img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Miniatura ${idx}`}
                        onClick={() => setMainImage(img)}
                        className={`h-16 w-16 object-cover cursor-pointer border ${
                          mainImage === img
                            ? "border-cyan-500"
                            : "border-gray-300"
                        } rounded-md hover:opacity-80 transition`}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Info del producto */}
              <div className="md:w-1/2 space-y-4">
                <h1 className="text-2xl font-semibold">{product?.title}</h1>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Precio especial
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    ${product?.price}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hasta 6 cuotas sin interés
                  </p>
                </div>
                <ul className="text-sm space-y-1 border-t pt-4">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✔</span> Stock
                    disponible
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">🚚</span> Envíos
                    a todo el país
                  </li>
                </ul>
                <div className="flex flex-col gap-3 pt-4">
                  {cartItems.some((p) => p.id === product.id) ? (
                    <button
                      onClick={() => deleteCart(product)}
                      className="w-full px-4 py-3 text-white bg-red-600 hover:bg-red-700 border border-red-700 rounded-md"
                    >
                      Quitar del carrito
                    </button>
                  ) : (
                    <button
                      onClick={() => addCart(product)}
                      className="w-full px-4 py-3 text-white 
                               bg-black hover:bg-gray-800 
                               dark:bg-cyan-500 dark:hover:bg-cyan-600 
                               border border-black dark:border-cyan-500 
                               rounded-md transition-colors duration-200"
                    >
                      Agregar al carrito
                    </button>
                  )}
                  {preferenceId && (
                    <Wallet
                      initialization={{ preferenceId }}
                      customization={{ texts: { valueProp: "smart_option" } }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-12 border-t pt-6">
              <h2 className="text-lg font-bold mb-2">
                Descripción del producto
              </h2>
              <p className="text-sm leading-relaxed">{product?.description}</p>
            </div>

            {/* Especificaciones */}
            <div className="mt-10">
              <h3 className="text-lg font-bold mb-3">
                Especificaciones del producto
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Marca:</p>
                  <p>{product?.brand || "Sin especificar"}</p>
                </div>
                <div>
                  <p className="font-semibold">Conectividad:</p>
                  <p>{product?.connectivity || "Sin especificar"}</p>
                </div>
                <div>
                  <p className="font-semibold">Compatibilidad:</p>
                  <p>{product?.compatibility || "Sin especificar"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default ProductInfo;
