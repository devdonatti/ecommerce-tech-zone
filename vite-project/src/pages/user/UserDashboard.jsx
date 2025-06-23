import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Loader from "../../components/loader/Loader";
import { fireDB } from "../../firebase/FirebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("users"));
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(fireDB, "order"),
      where("userid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserOrders(orders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-5 lg:py-8">
        {/* Top */}
        <div className="bg-gray-300 py-5 rounded-xl border border-gray-300">
          <div className="flex justify-center">
            <img className="w-20 h-20" src="/logo1.png" alt="logo" />
          </div>
          <div>
            <h1 className="text-center text-lg">
              <span className="font-bold">Nombre: </span>
              {user?.name}
            </h1>
            <h1 className="text-center text-lg">
              <span className="font-bold">Email: </span>
              {user?.email}
            </h1>
            <h1 className="text-center text-lg">
              <span className="font-bold">Día: </span>
              {user?.date}
            </h1>
            <h1 className="text-center text-lg">
              <span className="font-bold">Rol: </span>
              {user?.role}
            </h1>
          </div>
        </div>

        {/* Bottom - Ordenes */}
        <div className="mx-auto my-4 max-w-6xl px-2 md:my-6 md:px-0">
          <h2 className="text-2xl lg:text-3xl font-bold">Órdenes de compra</h2>

          {loading ? (
            <div className="flex justify-center relative top-10">
              <Loader />
            </div>
          ) : (
            userOrders.map((order, orderIndex) => {
              const total = order.cartItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              );
              return (
                <div
                  key={orderIndex}
                  className="mt-5 border border-gray-300 rounded-xl overflow-hidden"
                >
                  <div className="bg-gray-300 p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-semibold text-sm text-black">
                        N° de orden
                      </h3>
                      <p className="text-sm text-gray-900 break-all">
                        #{order.id}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-black">Día</h3>
                      <p className="text-sm text-gray-900">{order.date}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-black">
                        Estado
                      </h3>
                      <p className="text-sm text-green-800 capitalize">
                        {{
                          pending: "pendiente",
                          confirmed: "confirmado",
                          shipped: "enviado",
                          delivered: "entregado",
                          cancelled: "cancelado",
                        }[order.status] || order.status}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-black">
                        Total
                      </h3>
                      <p className="text-sm text-gray-900">${total}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {order.cartItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row gap-4 border-t pt-4"
                      >
                        <img
                          src={item.productImageUrl}
                          alt={item.title}
                          className="w-24 h-24 object-contain rounded-lg border"
                        />
                        <div className="flex flex-col justify-between flex-1">
                          <p className="text-sm font-bold text-gray-900">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.category}
                          </p>
                          <p className="text-sm text-gray-500">
                            x {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 self-center">
                          ${item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
