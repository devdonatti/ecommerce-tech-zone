import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/layout/Layout";
import { Trash } from "lucide-react";
import {
  decrementQuantity,
  deleteFromCart,
  incrementQuantity,
  updateQuantity,
} from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import BuyNowModal from "../../components/buyNowModal/BuyNowModal";
import { Navigate } from "react-router";
import axios from "axios";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

initMercadoPago("APP_USR-4bbcc18f-f704-4ab9-bc2a-fa53ba90cc66");

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const [preferenceIdcart, setPreferenceIdcart] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);

  // Sincronizar carrito con localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Crear preferencia
  const createPreference = async () => {
    try {
      const items = cartItems.map((item) => ({
        title: item.title,
        quantity: Number(item.quantity),
        price: Number(item.price),
        description: item.description,
        productImageUrl: item.productImageUrl,
      }));

      const response = await axios.post(
        "https://ecommerce-tech-zone-q2e8-git-main-devdonattis-projects.vercel.app/api/create_preference_cart",
        { cartItems: items }
      );

      const { id } = response.data;
      if (id) setPreferenceIdcart(id);
      else throw new Error("No se recibió un ID de preferencia");
    } catch (error) {
      console.error("Error al crear la preferencia:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (preferenceIdcart) {
      console.log("ID de preferencia disponible:", preferenceIdcart);
    }
  }, [preferenceIdcart]);

  // Usuario y dirección
  const user = JSON.parse(localStorage.getItem("users"));
  const [addressInfo, setAddressInfo] = useState({
    name: "",
    address: "",
    pincode: "",
    mobileNumber: "",
    time: Timestamp.now().toMillis(),
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });

  // Confirmar compra
  const buyNowFunction = async () => {
    if (
      !addressInfo.name ||
      !addressInfo.address ||
      !addressInfo.pincode ||
      !addressInfo.mobileNumber
    ) {
      return toast.error("Todos los campos son requeridos");
    }

    const orderInfo = {
      cartItems,
      addressInfo,
      email: user.email,
      userid: user.uid,
      status: "confirmed",
      time: Timestamp.now().toMillis(),
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    try {
      await createPreference();
      const orderRef = collection(fireDB, "order");
      await addDoc(orderRef, orderInfo);
      toast.success("Orden creada exitosamente");
    } catch (error) {
      toast.error("Error al crear la orden");
    }
  };

  // Cálculos de totales
  const cartItemTotal = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  // Manejo de cantidad
  const handleQuantityChange = (e, id) => {
    dispatch(updateQuantity({ id, quantity: e.target.value }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-7xl lg:px-0">
        <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Carrito
          </h1>

          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            {/* Productos */}
            <section className="rounded-lg bg-white lg:col-span-8">
              <ul className="divide-y divide-gray-200">
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <div key={index}>
                      <li className="flex py-6">
                        <div className="flex-shrink-0">
                          <img
                            src={item.productImageUrl}
                            alt={item.title}
                            className="h-24 w-24 rounded-md object-contain object-center sm:h-38 sm:w-38"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                              <h3 className="text-sm font-semibold text-black">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.category}
                              </p>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                ${item.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                      <div className="mb-2 flex">
                        <div className="min-w-24 flex">
                          <button
                            onClick={() => dispatch(decrementQuantity(item.id))}
                            type="button"
                            className="h-7 w-7"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="mx-1 h-7 w-9 rounded-md border text-center"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(e, item.id)}
                          />
                          <button
                            onClick={() => dispatch(incrementQuantity(item.id))}
                            type="button"
                            className="h-7 w-7 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <div className="ml-6 flex text-sm">
                          <button
                            onClick={() => dispatch(deleteFromCart(item))}
                            type="button"
                            className="flex items-center space-x-1 px-2 py-1 pl-0"
                          >
                            <Trash size={12} className="text-red-500" />
                            <span className="text-xs font-medium text-red-500">
                              Borrar
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Tu carrito está vacío.</p>
                )}
              </ul>
            </section>

            {/* Detalle de compra */}
            <section className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0">
              <h2 className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900">
                Detalle
              </h2>
              <div>
                <dl className="space-y-1 px-2 py-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-800">
                      Precio ({cartItemTotal} items)
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      $ {cartTotal}
                    </dd>
                  </div>

                  <div className="py-4">
                    <dt className="text-sm text-gray-800 mb-2">Envío</dt>
                    <div className="space-y-2 text-sm">
                      {[
                        { label: "CABA", cost: 1000 },
                        { label: "Provincia de Buenos Aires", cost: 1500 },
                        { label: "Interior del país", cost: 2000 },
                      ].map((option) => (
                        <label
                          key={option.label}
                          className="flex items-center justify-between"
                        >
                          <span>{option.label}</span>
                          <input
                            type="radio"
                            name="shipping"
                            value={option.cost}
                            checked={shippingCost === option.cost}
                            onChange={() => setShippingCost(option.cost)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-y border-dashed py-4">
                    <dt className="text-base font-medium text-gray-900">
                      Total
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      $ {cartTotal + shippingCost}
                    </dd>
                  </div>
                </dl>

                <div className="px-2 pb-4 font-medium text-green-700">
                  <div className="flex gap-4 mb-6">
                    {user ? (
                      <BuyNowModal
                        addressInfo={addressInfo}
                        setAddressInfo={setAddressInfo}
                        buyNowFunction={buyNowFunction}
                      />
                    ) : (
                      <Navigate to={"/login"} />
                    )}
                  </div>

                  {preferenceIdcart && (
                    <Wallet
                      initialization={{ preferenceId: preferenceIdcart }}
                      customization={{ texts: { valueProp: "smart_option" } }}
                    />
                  )}
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
