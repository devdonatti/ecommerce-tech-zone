import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/layout/Layout";
import { Trash } from "lucide-react";
import {
  decrementQuantity,
  deleteFromCart,
  incrementQuantity,
  updateQuantity, // Asegúrate de tener esta acción en tu slice de Redux
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
  const [preferenceIdcart, setPreferenceIdcart] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);

  const createPreference = async () => {
    try {
      const items = cartItems.map((item) => {
        const quantity = Number(item.quantity);
        const price = Number(item.price);

        // Verificar que los valores son números válidos
        if (isNaN(quantity) || isNaN(price)) {
          throw new Error("La cantidad o el precio no son números válidos");
        }

        return {
          title: item.title,
          quantity,
          price,
          description: item.description,
          productImageUrl: item.productImageUrl,
        };
      });

      const response = await axios.post(
        "https://ecommerce-tech-zone-q2e8-git-main-devdonattis-projects.vercel.app/api/create_preference_cart",
        { cartItems: items }
      );

      console.log("Respuesta del servidor:", response.data); // Verifica la respuesta

      const { id } = response.data;
      if (id) {
        setPreferenceIdcart(id); // Asegúrate de que el estado se actualice correctamente
      } else {
        throw new Error("No se recibió un ID de preferencia");
      }
      return id;
    } catch (error) {
      console.error("Error al crear la preferencia:", error);
      toast.error(error.message); // Mostrar mensaje de error si hay uno
    }
  };

  const handleBuyNow = async () => {
    try {
      const response = await axios.post(
        "https://ecommerce-tech-zone-q2e8-git-main-devdonattis-projects.vercel.app/api/create_preference_cart",
        { cartItems }
      );
      const preferenceIdcart = response.data.id;
      if (preferenceIdcart) {
        setPreferenceIdcart(preferenceIdcart); // Guarda el preferenceId en el estado
      } else {
        throw new Error("No se pudo obtener el ID de la preferencia");
      }
    } catch (error) {
      console.error("Error al crear la preferencia:", error);
      toast.error("Hubo un problema al crear la preferencia");
    }
  };

  const buyCart = async () => {
    const id = await createPreference();
    if (id) {
      setPreferenceIdcart(id); // Establecer el id de la preferencia en el estado
    }
  };

  const cartItems = useSelector((state) => state.cart);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems)); // Guardamos el carrito actualizado en localStorage
  }, [cartItems]);
  useEffect(() => {
    if (preferenceIdcart) {
      console.log("ID de preferencia disponible:", preferenceIdcart);
    }
  }, [preferenceIdcart]);

  const dispatch = useDispatch();

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Producto eliminado del carrito");
  };

  const handleIncrement = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity(id));
  };

  // Calcular el total de artículos y el total de la compra
  const cartItemTotal = cartItems
    .map((item) => item.quantity)
    .reduce((prevValue, currValue) => prevValue + currValue, 0);

  const cartTotal = cartItems
    .map((item) => item.price * item.quantity)
    .reduce((prevValue, currValue) => prevValue + currValue, 0);

  // Sincronizar el carrito con localStorage cada vez que cambie el estado
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems)); // Guardamos el carrito actualizado en localStorage
  }, [cartItems]);

  // Recuperar usuario desde el localStorage
  const user = JSON.parse(localStorage.getItem("users"));

  // Estado para la dirección
  const [addressInfo, setAddressInfo] = useState({
    name: "",
    address: "",
    pincode: "",
    mobileNumber: "",
    time: Timestamp.now().toMillis(), // Convertir Timestamp a milisegundos
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });

  // Función para realizar la compra
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
      email: user?.email || "invitado",
      userid: user?.uid || "invitado",
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

  // Manejar el cambio de la cantidad
  const handleQuantityChange = (e, id) => {
    const newQuantity = e.target.value;
    // Actualizar la cantidad en el carrito
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-7xl lg:px-0">
        <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Carrito
          </h1>
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section
              aria-labelledby="cart-heading"
              className="rounded-lg bg-white lg:col-span-8"
            >
              <h2 id="cart-heading" className="sr-only">
                Productos en tu carrito
              </h2>
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.length > 0 ? (
                  <>
                    {cartItems.map((item, index) => {
                      const {
                        id,
                        title,
                        price,
                        productImageUrl,
                        quantity,
                        category,
                      } = item;
                      return (
                        <div key={index}>
                          <li className="flex py-6 sm:py-6">
                            <div className="flex-shrink-0">
                              <img
                                src={productImageUrl}
                                alt="img"
                                className="sm:h-38 sm:w-38 h-24 w-24 rounded-md object-contain object-center"
                              />
                            </div>
                            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                              <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                <div>
                                  <div className="flex justify-between">
                                    <h3 className="text-sm">
                                      <div className="font-semibold text-black">
                                        {title}
                                      </div>
                                    </h3>
                                  </div>
                                  <div className="mt-1 flex text-sm">
                                    <p className="text-sm text-gray-500">
                                      {category}
                                    </p>
                                  </div>
                                  <div className="mt-1 flex items-end">
                                    <p className="text-sm font-medium text-gray-900">
                                      ${price}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                          <div className="mb-2 flex">
                            <div className="min-w-24 flex">
                              <button
                                onClick={() => handleDecrement(id)}
                                type="button"
                                className="h-7 w-7"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                className="mx-1 h-7 w-9 rounded-md border text-center"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(e, id)} // Aquí manejamos el cambio
                              />
                              <button
                                onClick={() => handleIncrement(id)}
                                type="button"
                                className="flex h-7 w-7 items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                            <div className="ml-6 flex text-sm">
                              <button
                                onClick={() => deleteCart(item)}
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
                      );
                    })}
                  </>
                ) : (
                  <p className="text-gray-500">Tu carrito está vacío.</p>
                )}
              </ul>
            </section>
            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0"
            >
              <h2
                id="summary-heading"
                className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4"
              >
                Detalle
              </h2>
              <div>
                <dl className=" space-y-1 px-2 py-4">
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
                      <label className="flex items-center justify-between">
                        <span>CABA</span>
                        <input
                          type="radio"
                          name="shipping"
                          value="1000"
                          checked={shippingCost === 1000}
                          onChange={() => setShippingCost(1000)}
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Provincia de Buenos Aires</span>
                        <input
                          type="radio"
                          name="shipping"
                          value="1500"
                          checked={shippingCost === 1500}
                          onChange={() => setShippingCost(1500)}
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span>Interior del país</span>
                        <input
                          type="radio"
                          name="shipping"
                          value="2000"
                          checked={shippingCost === 2000}
                          onChange={() => setShippingCost(2000)}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-y border-dashed py-4 ">
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
                    <BuyNowModal
                      addressInfo={addressInfo}
                      setAddressInfo={setAddressInfo}
                      buyNowFunction={buyNowFunction}
                    />
                  </div>

                  {preferenceIdcart && (
                    <Wallet
                      initialization={{
                        preferenceId: preferenceIdcart, // Asegúrate de que preferenceId no sea null
                      }}
                      customization={{
                        texts: { valueProp: "smart_option" },
                      }}
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
