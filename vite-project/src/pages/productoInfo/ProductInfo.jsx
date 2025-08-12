import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { doc, getDoc } from "firebase/firestore";

import Layout from "../../components/layout/Layout";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { fireDB } from "../../firebase/FirebaseConfig";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";

// Componentes separados
import ProductGallery from "./ProductGallery";
import ProductDetails from "./ProductDetails";
import FeaturedSlider from "./FeaturedSlider";

initMercadoPago("APP_USR-84634554-b65e-4d73-8dee-c07d4962e39b", {
  locale: "es-AR",
});

const ProductInfo = () => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [product, setProduct] = useState(null);

  const context = useContext(myContext);
  const { loading, setLoading, getAllProduct } = context;

  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Obtener datos del producto
  const getProductData = async () => {
    setLoading(true);
    try {
      const productTemp = await getDoc(doc(fireDB, "products", id));
      if (productTemp.exists()) {
        const productData = { ...productTemp.data(), id: productTemp.id };
        setProduct(productData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear preferencia de MP
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
      return response.data.id;
    } catch (error) {
      console.error("Error al crear la preferencia:", error);
    }
  };

  const handleBuy = async () => {
    const id = await createPreference();
    if (id) setPreferenceId(id);
  };

  const addCart = (item) => {
    const priceBase = Number(item.price); // Precio base (transferencia)
    const priceCard = Math.round(priceBase * 1.1); // +10% recargo para tarjeta
    dispatch(
      addToCart({
        ...item,
        quantity: 1,
        price: priceBase, // Precio base sin recargo
        priceCard: priceCard, // Precio con recargo
      })
    );
    toast.success("Agregado al carrito");
  };

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Borrado del carrito");
  };

  useEffect(() => {
    getProductData();
  }, [id]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      <section className="py-6 lg:py-12 bg-white text-gray-800 dark:bg-black dark:text-white">
        {loading || !product ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-10">
              <ProductGallery product={product} />
              <ProductDetails
                product={product}
                cartItems={cartItems}
                addCart={addCart}
                deleteCart={deleteCart}
                preferenceId={preferenceId}
                Wallet={Wallet}
              />
            </div>

            {/* Descripción */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">
                Descripción del producto
              </h3>
              <p className="whitespace-pre-line text-sm text-gray-700">
                {product?.description || "Sin descripción"}
              </p>
            </div>

            {/* Especificaciones */}
            <div className="mt-10">
              <h3 className="text-lg font-bold mb-3">
                Especificaciones del producto
              </h3>
              <div className="flex flex-col gap-4 text-sm">
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

      {/* Destacados */}
      {Array.isArray(getAllProduct) && getAllProduct.length > 0 && (
        <FeaturedSlider
          products={getAllProduct}
          addCart={addCart}
          navigate={navigate}
        />
      )}
    </Layout>
  );
};

export default ProductInfo;
