import { useContext, useEffect, useRef, useState, Fragment } from "react";
import myContext from "../../context/myContext";
import { doc, updateDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";

const OrderDetail = () => {
  const context = useContext(myContext);
  const { getAllOrder, deleteProduct, getAllOrderFunction } = context;

  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const [openOrder, setOpenOrder] = useState(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      setShowArrows(el.scrollWidth > el.clientWidth);
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [getAllOrder]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(fireDB, "order", orderId), {
        status: newStatus,
      });
      toast.success("Estado actualizado");
      getAllOrderFunction(); // opcional si querés refrescar después de cambiar
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("Error al actualizar estado");
    }
  };

  return (
    <div className="relative bg-[#0a0a0a] min-h-[70vh] p-6 rounded-2xl shadow-lg border border-fuchsia-700 text-white">
      <div className="flex items-center justify-center mb-6 gap-4">
        {showArrows && (
          <button
            onClick={scrollLeft}
            className="w-10 h-10 bg-fuchsia-700 hover:bg-fuchsia-600 rounded-full shadow-lg transition"
          >
            ◀
          </button>
        )}
        <h1 className="text-2xl font-extrabold text-fuchsia-500">Órdenes</h1>
        {showArrows && (
          <button
            onClick={scrollRight}
            className="w-10 h-10 bg-fuchsia-700 hover:bg-fuchsia-600 rounded-full shadow-lg transition"
          >
            ▶
          </button>
        )}
      </div>

      <div
        className="relative overflow-x-auto"
        ref={scrollRef}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        <table className="w-full border-collapse border border-fuchsia-700 min-w-[900px]">
          <thead>
            <tr className="bg-black text-cyan-400 text-sm uppercase border-b border-fuchsia-600">
              <th className="px-4 py-2 border border-fuchsia-600">#</th>
              <th className="px-4 py-2 border border-fuchsia-600">Orden ID</th>
              <th className="px-4 py-2 border border-fuchsia-600">Cliente</th>
              <th className="px-4 py-2 border border-fuchsia-600">Estado</th>
              <th className="px-4 py-2 border border-fuchsia-600">Total</th>
              <th className="px-4 py-2 border border-fuchsia-600">Día</th>
              <th className="px-4 py-2 border border-fuchsia-600">Acción</th>
            </tr>
          </thead>

          <tbody>
            {getAllOrder.map((order, index) => {
              const total = order.cartItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              );

              return (
                <Fragment key={order.id}>
                  <tr
                    className="bg-black border-b border-fuchsia-700 hover:bg-fuchsia-900 transition cursor-pointer"
                    onClick={() =>
                      setOpenOrder(openOrder === order.id ? null : order.id)
                    }
                  >
                    <td className="px-4 py-2 text-center border border-fuchsia-600">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border border-fuchsia-600">
                      {order.id}
                    </td>
                    <td className="px-4 py-2 border border-fuchsia-600">
                      {order.addressInfo.name}
                    </td>
                    <td className="px-4 py-2 border border-fuchsia-600 text-center">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="bg-black text-green-400 font-semibold text-sm border border-fuchsia-700 rounded px-2 py-1 focus:outline-none"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border border-fuchsia-600">
                      ${total}
                    </td>
                    <td className="px-4 py-2 border border-fuchsia-600 text-center">
                      {order.date}
                    </td>
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(order.id);
                      }}
                      className="px-4 py-2 text-red-500 text-center cursor-pointer hover:bg-red-700 transition border border-fuchsia-600 font-semibold"
                    >
                      Borrar
                    </td>
                  </tr>

                  {openOrder === order.id && (
                    <tr className="bg-[#111] border-b border-fuchsia-700">
                      <td colSpan={7} className="px-6 py-4 space-y-6">
                        {/* Datos del cliente */}
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-white">
                          <div>
                            <span className="font-bold text-cyan-400">
                              Nombre:
                            </span>{" "}
                            {order.addressInfo.name}
                          </div>
                          <div>
                            <span className="font-bold text-cyan-400">
                              Dirección:
                            </span>{" "}
                            {order.addressInfo.address}
                          </div>
                          <div>
                            <span className="font-bold text-cyan-400">
                              Código Postal:
                            </span>{" "}
                            {order.addressInfo.pincode}
                          </div>
                          <div>
                            <span className="font-bold text-cyan-400">
                              Teléfono:
                            </span>{" "}
                            {order.addressInfo.mobileNumber}
                          </div>
                          <div>
                            <span className="font-bold text-cyan-400">
                              Email:
                            </span>{" "}
                            {order.email}
                          </div>
                        </div>

                        {/* Productos */}
                        <div>
                          <h3 className="text-cyan-400 font-semibold mb-2">
                            Productos:
                          </h3>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {order.cartItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="border border-cyan-600 rounded-md p-4 bg-black text-white"
                              >
                                <img
                                  src={item.productImageUrl}
                                  alt={item.title}
                                  className="w-16 h-16 object-contain mb-2"
                                />
                                <p className="text-sm font-bold">
                                  {item.title}
                                </p>
                                <p className="text-xs capitalize">
                                  Categoría: {item.category}
                                </p>
                                <p className="text-xs">Precio: ${item.price}</p>
                                <p className="text-xs">
                                  Cantidad: {item.quantity}
                                </p>
                                <p className="text-xs font-semibold text-fuchsia-400">
                                  Subtotal: ${item.price * item.quantity}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetail;
