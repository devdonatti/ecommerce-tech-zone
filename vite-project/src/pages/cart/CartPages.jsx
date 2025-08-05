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
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import BuyNowModal from "../../components/buyNowModal/BuyNowModal";
import BankTransferModal from "../../components/bankTransferModal/BankTransferModal";
import axios from "axios";

const CartPage = () => {
  const [errors, setErrors] = useState({});
  const [shippingCost, setShippingCost] = useState(0); // Envío gratis por defecto
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

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
        { cartItems: items, shippingCost }
      );

      const { init_point } = response.data;

      if (!init_point) throw new Error("No se recibió el link de pago");
      return init_point;
    } catch (error) {
      console.error("Error al crear preferencia:", error);
      toast.error(error.message);
    }
  };

  const buyCart = async () => {
    const initPoint = await createPreference();
    if (initPoint) {
      window.location.href = initPoint;
    }
  };

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

  const handleQuantityChange = (e, id) => {
    const newQuantity = e.target.value;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const cartItemTotal = cartItems.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    return sum + (isNaN(quantity) ? 0 : quantity);
  }, 0);

  const cartTotal = cartItems.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    const price = Number(item.price);
    return sum + (isNaN(quantity) || isNaN(price) ? 0 : quantity * price);
  }, 0);

  const discountedTotal = discountPercent
    ? Math.round(cartTotal - cartTotal * (discountPercent / 100))
    : cartTotal;

  const user = JSON.parse(localStorage.getItem("users"));

  // addressInfo inicial
  const [addressInfo, setAddressInfo] = useState({
    name: "",
    address: "",
    localidad: "",
    provincia: "",
    pincode: "",
    mobileNumber: "",
    time: Timestamp.now().toMillis(),
    date: new Date().toLocaleString("es-AR", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });

  // Aplicar código de descuento
  const applyDiscountCode = async () => {
    if (!discountCode) return toast.error("Ingresá un código");

    const q = query(
      collection(fireDB, "discountCodes"),
      where("code", "==", discountCode.toUpperCase())
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return toast.error("Código inválido");
    }

    const discountData = snapshot.docs[0].data();

    // Validaciones
    const today = new Date();
    const expiration = new Date(discountData.expiresAt);

    if (!discountData.active) return toast.error("Código inactivo");
    if (expiration < today) return toast.error("El código ha expirado");

    setDiscountPercent(discountData.discount);
    toast.success(`Código aplicado: ${discountData.discount}%`);
  };

  const buyNowFunction = async () => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const addressRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s,.-]+$/;
    const pincodeRegex = /^[0-9]{4,10}$/;
    const mobileRegex = /^[0-9]{6,15}$/;

    const newErrors = {
      name: !nameRegex.test(addressInfo.name),
      address: !addressRegex.test(addressInfo.address),
      localidad: !nameRegex.test(addressInfo.localidad),
      provincia: !nameRegex.test(addressInfo.provincia),
      pincode: !pincodeRegex.test(addressInfo.pincode),
      mobileNumber: !mobileRegex.test(addressInfo.mobileNumber),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return toast.error("Completá los campos correctamente");
    }

    const orderInfo = {
      cartItems,
      addressInfo,
      email: user?.email || "invitado",
      userid: user?.uid || "invitado",
      status: "confirmed",
      shippingCost,
      subtotal: cartTotal,
      discountPercent,
      finalTotal: discountedTotal,
      time: Timestamp.now().toMillis(),
      date: new Date().toLocaleString("es-AR", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    try {
      const orderRef = collection(fireDB, "order");
      await addDoc(orderRef, orderInfo);
      toast.success("Orden creada exitosamente");
      await buyCart();
    } catch (error) {
      toast.error("Error al crear la orden");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-7xl lg:px-0">
        <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Carrito
          </h1>
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            {/* Lista de productos */}
            <section
              aria-labelledby="cart-heading"
              className="rounded-lg bg-white lg:col-span-8"
            >
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <div key={index}>
                      <li className="flex py-6 sm:py-6">
                        <div className="flex-shrink-0">
                          <img
                            src={item.productImageUrl}
                            alt="img"
                            className="sm:h-38 sm:w-38 h-24 w-24 rounded-md object-contain object-center"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="text-sm font-semibold text-black">
                                  {item.title}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.category}
                              </p>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                ${Number(item.price).toLocaleString("es-AR")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                      <div className="mb-2 flex">
                        <div className="min-w-24 flex">
                          <button
                            onClick={() => handleDecrement(item.id)}
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
                            onClick={() => handleIncrement(item.id)}
                            type="button"
                            className="h-7 w-7"
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
                  ))
                ) : (
                  <p className="text-gray-500">Tu carrito está vacío.</p>
                )}
              </ul>
            </section>

            {/* Resumen */}
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
                <dl className="space-y-1 px-2 py-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-800">
                      Precio ({cartItemTotal} items)
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ${cartTotal.toLocaleString("es-AR")}
                    </dd>
                  </div>

                  {/* Input código de descuento */}
                  <div className="px-2 py-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Código de descuento"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                      />
                      <button
                        type="button"
                        onClick={applyDiscountCode}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm"
                      >
                        Aplicar
                      </button>
                    </div>
                    {discountPercent > 0 && (
                      <p className="text-green-500 text-sm mt-2">
                        ✅ Se aplicó un {discountPercent}% de descuento
                      </p>
                    )}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between border-y border-dashed py-4 mt-2">
                    <dt className="text-base font-medium text-gray-900">
                      Total
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      ${discountedTotal.toLocaleString("es-AR")}
                    </dd>
                  </div>

                  <p className="text-green-600 text-sm mt-2">Envío gratis</p>
                </dl>

                <div className="px-2 pb-4 font-medium text-green-700">
                  <div className="flex gap-4 mb-6">
                    <BuyNowModal
                      addressInfo={addressInfo}
                      setAddressInfo={setAddressInfo}
                      buyNowFunction={buyNowFunction}
                      errors={errors}
                      setErrors={setErrors}
                    />
                    <BankTransferModal
                      addressInfo={addressInfo}
                      setAddressInfo={setAddressInfo}
                      shippingCost={0}
                    />
                  </div>
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
