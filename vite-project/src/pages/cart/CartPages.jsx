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
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Descuento
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // Envío
  const [zipCode, setZipCode] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingZones, setShippingZones] = useState([]);

  // NUEVO: retiro en Carapachay (gratis)
  const [pickupCarapachay, setPickupCarapachay] = useState(false);

  // Traer zonas de envío desde Firestore
  useEffect(() => {
    const fetchShippingZones = async () => {
      try {
        const snapshot = await getDocs(collection(fireDB, "shippingZones"));
        const zones = snapshot.docs.map((doc) => doc.data());
        setShippingZones(zones);
      } catch (e) {
        console.error(e);
        toast.error("No se pudieron cargar las zonas de envío");
      }
    };
    fetchShippingZones();
  }, []);

  // Helpers CABA/GBA
  const isCABA = (cp) => Number.isFinite(cp) && cp >= 1000 && cp <= 1499;

  const getGbaCost = (gba, cp) => {
    if (!gba) return null;
    const rangos = Array.isArray(gba.rangos) ? gba.rangos : null;
    if (!rangos || rangos.length === 0) return null;

    const sorted = [...rangos]
      .map(Number)
      .filter(Number.isFinite)
      .sort((a, b) => a - b);
    if (sorted.length < 2) return null;

    for (let i = 0; i < sorted.length - 1; i++) {
      const min = sorted[i];
      const max = sorted[i + 1];
      if (cp >= min && cp < max) {
        if (i === 0 && Number.isFinite(Number(gba.franja1)))
          return Number(gba.franja1);
        if (i === 1 && Number.isFinite(Number(gba.franja2)))
          return Number(gba.franja2);
        if (i >= 2 && Number.isFinite(Number(gba.franja3)))
          return Number(gba.franja3);
        return null;
      }
    }
    return null;
  };

  // Calcular envío
  const calculateShipping = (zipInput) => {
    const cp = Number(zipInput);
    if (!Number.isFinite(cp)) {
      toast.error("Ingresá un código postal numérico");
      return;
    }

    if (!shippingZones || !shippingZones[0]) {
      toast.error("Zonas de envío no disponibles todavía");
      return;
    }

    const zones = shippingZones[0]; // { CABA, GBA, Interior }

    // Si hay retiro, ignoramos cálculo
    if (pickupCarapachay) {
      toast("Tenés seleccionado retiro en Carapachay (sin envío).");
      return;
    }

    // 1) CABA
    if (zones.CABA && isCABA(cp)) {
      const price = Number(zones.CABA.franja1 ?? zones.CABA.price);
      if (Number.isFinite(price)) {
        setShippingCost(price);
        toast.success(`Envío CABA: $${price.toLocaleString("es-AR")}`);
        return;
      }
    }

    // 2) GBA
    const gbaCost = getGbaCost(zones.GBA, cp);
    if (Number.isFinite(gbaCost)) {
      setShippingCost(gbaCost);
      toast.success(`Envío GBA: $${gbaCost.toLocaleString("es-AR")}`);
      return;
    }

    // 3) Interior
    if (zones.Interior) {
      const interior = Number(zones.Interior.franja1 ?? zones.Interior.price);
      if (Number.isFinite(interior)) {
        setShippingCost(interior);
        toast.success(`Envío Interior: $${interior.toLocaleString("es-AR")}`);
        return;
      }
    }

    setShippingCost(0);
    toast.error("No pudimos calcular el envío para ese código postal");
  };

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // NUEVO: si eligen retiro, ponemos envío 0 y limpiamos CP
  useEffect(() => {
    if (pickupCarapachay) {
      setShippingCost(0);
    }
  }, [pickupCarapachay]);

  // Crear preferencia de pago (agrega envío como ítem salvo retiro)
  const createPreference = async () => {
    try {
      const items = cartItems.map((item) => ({
        title: item.title,
        quantity: Number(item.quantity),
        price: Number(item.priceCard ?? item.price),
        description: item.description,
        productImageUrl: item.productImageUrl,
      }));

      // 🚫 No agregamos el item "Envío" acá
      // if (!pickupCarapachay && Number(shippingCost) > 0) { items.push(...); }

      const response = await axios.post(
        "https://ecommerce-tech-zone-q2e8-git-main-devdonattis-projects.vercel.app/api/create_preference_cart",
        {
          cartItems: items,
          // Dejamos que el backend lo sume; si es retiro, va 0
          shippingCost: pickupCarapachay ? 0 : Number(shippingCost),
        }
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
    const price = Number(item.priceCard ?? item.price);
    return sum + (isNaN(quantity) || isNaN(price) ? 0 : quantity * price);
  }, 0);

  const transferTotal = cartItems.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    const priceWithRecargo = Number(item.price);
    const priceBase = priceWithRecargo / 1.1;
    return (
      sum + (isNaN(quantity) || isNaN(priceBase) ? 0 : quantity * priceBase)
    );
  }, 0);

  const discountedTotal = discountPercent
    ? Math.round(cartTotal - cartTotal * (discountPercent / 100))
    : cartTotal;

  // NUEVO: solo suma envío si NO es retiro
  const finalTotal =
    discountedTotal + (pickupCarapachay ? 0 : shippingCost || 0);

  const user = JSON.parse(localStorage.getItem("users"));

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

  // Código de descuento
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
    const today = new Date();
    const expiration = new Date(discountData.expiresAt);

    if (!discountData.active) return toast.error("Código inactivo");
    if (expiration < today) return toast.error("El código ha expirado");

    setDiscountPercent(discountData.discount);
    toast.success(`Código aplicado: ${discountData.discount}%`);
  };

  // Comprar ahora (validación obligatoria)
  const buyNowFunction = async () => {
    // Debe haber envío calculado o retiro seleccionado
    const canCheckout = pickupCarapachay || Number(shippingCost) > 0;
    if (!canCheckout) {
      toast.error(
        "Elegí envío o tildá 'Retiro gratis en Carapachay' para continuar."
      );
      return;
    }

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
      shippingCost: pickupCarapachay ? 0 : shippingCost,
      pickupCarapachay, // guardamos la elección
      subtotal: cartTotal,
      discountPercent,
      finalTotal,
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

  // Condición global para habilitar compra
  const canCheckout = pickupCarapachay || Number(shippingCost) > 0;

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
                                $
                                {Number(
                                  item.priceCard ?? item.price
                                ).toLocaleString("es-AR")}
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
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-800">
                      Subtotal ({cartItemTotal} items)
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ${cartTotal.toLocaleString("es-AR")}
                    </dd>
                  </div>

                  {/* Precio con transferencia (informativo) */}
                  <div className="flex items-center justify-between mt-2">
                    <dt className="text-sm text-green-600 italic">
                      Precio transferencia 10% de descuento
                    </dt>
                    <dd className="text-sm font-medium text-gray-700 italic">
                      ${transferTotal.toLocaleString("es-AR")}
                    </dd>
                  </div>

                  {/* Descuento aplicado */}
                  {discountPercent > 0 && (
                    <div className="flex items-center justify-between mt-2">
                      <dt className="text-sm text-green-600">
                        Descuento ({discountPercent}%)
                      </dt>
                      <dd className="text-sm font-medium text-green-700">
                        -{" "}
                        {(cartTotal - discountedTotal).toLocaleString("es-AR")}
                      </dd>
                    </div>
                  )}

                  {/* Código de descuento */}
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

                  {/* Cálculo de envío */}
                  <div className="px-2 py-2 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Código Postal"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                        disabled={pickupCarapachay}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const parsed = Number(zipCode);
                          if (Number.isNaN(parsed)) {
                            toast.error("Ingresá un código postal válido");
                            return;
                          }
                          calculateShipping(parsed);
                        }}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm"
                        disabled={pickupCarapachay}
                      >
                        Calcular envío
                      </button>
                    </div>

                    {/* Checkbox Retiro */}
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={pickupCarapachay}
                        onChange={(e) => {
                          setPickupCarapachay(e.target.checked);
                          if (e.target.checked) {
                            setShippingCost(0);
                          }
                        }}
                      />
                      Retiro gratis en zona Carapachay
                    </label>

                    {pickupCarapachay ? (
                      <p className="text-blue-600 text-sm">
                        ✅ Retiro en Carapachay seleccionado (sin costo de
                        envío)
                      </p>
                    ) : Number(shippingCost) > 0 ? (
                      <p className="text-green-600 text-sm">
                        ✅ Envío: $
                        {Number(shippingCost).toLocaleString("es-AR")}
                      </p>
                    ) : (
                      <p className="text-amber-600 text-sm">
                        ⚠️ Elegí retiro en Carapachay o calculá el envío para
                        continuar.
                      </p>
                    )}
                  </div>

                  {/* Envío (desglosado) */}
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-800">Envío</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      $
                      {Number(
                        pickupCarapachay ? 0 : shippingCost || 0
                      ).toLocaleString("es-AR")}
                    </dd>
                  </div>

                  {/* Total final */}
                  <div className="flex items-center justify-between border-y border-dashed py-4 mt-2">
                    <dt className="text-base font-medium text-gray-900">
                      Total
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      ${finalTotal.toLocaleString("es-AR")}
                    </dd>
                  </div>
                </dl>

                <div className="px-2 pb-4 font-medium text-green-700">
                  <div className="flex flex-col gap-3 mb-6">
                    {/* Botones de compra bloqueados si no hay método */}
                    {canCheckout ? (
                      <div className="flex gap-4">
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
                          shippingCost={pickupCarapachay ? 0 : shippingCost}
                        />
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled
                          className="opacity-60 cursor-not-allowed bg-gray-300 text-gray-600 px-4 py-2 rounded-md"
                        >
                          Comprar (bloqueado)
                        </button>
                        <span className="text-sm text-amber-600">
                          Primero elegí retiro en Carapachay o calculá el envío.
                        </span>
                      </>
                    )}
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
