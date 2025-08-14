import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ProductDetail from "../../components/admin/ProductDetail";
import OrderDetail from "../../components/admin/OrderDetail";
import UserDetail from "../../components/admin/UserDetail";
import { useContext } from "react";
import myContext from "../../context/myContext";
import { Link } from "react-router-dom";
import DiscountCodesAdmin from "./DiscountCodesAdmin";
import AdminShippingZones from "./AdminShippingZones";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("users"));
  const context = useContext(myContext);
  const { getAllProduct, getAllOrder, getAllUser } = context;

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-5 py-8">
      {/* Top */}
      <div className="mb-5">
        <div className="bg-black text-white py-6 px-6 rounded-2xl shadow-lg flex items-center justify-between border border-fuchsia-700">
          <h1 className="text-2xl font-extrabold tracking-wide">
            Panel del administrador
          </h1>
          <Link to={"/"}>
            <button className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:from-fuchsia-500 hover:to-cyan-400 text-black px-4 py-2 rounded-md font-bold transition duration-300">
              Home
            </button>
          </Link>
        </div>
      </div>

      {/* User Info Card */}
      <div className="mb-5 max-w-xl mx-auto bg-black border border-cyan-400 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex justify-center mb-4">
          <img
            className="w-20 h-20 rounded-full border border-black"
            src="/logo3.png"
            alt="Logo"
          />
        </div>
        <div className="text-center space-y-2">
          <h2>
            <span className="font-semibold text-cyan-400">Nombre: </span>
            {user?.name || "—"}
          </h2>
          <h2>
            <span className="font-semibold text-cyan-400">Email: </span>
            {user?.email || "—"}
          </h2>
          <h2>
            <span className="font-semibold text-cyan-400">Día: </span>
            {user?.date || "—"}
          </h2>
          <h2>
            <span className="font-semibold text-cyan-400">Rol: </span>
            {user?.role || "—"}
          </h2>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-6xl mx-auto">
        <Tabs>
          <TabList className="flex flex-wrap justify-center gap-4 mb-6">
            {/* Products Tab */}
            <Tab className="cursor-pointer flex flex-col items-center bg-black border border-cyan-400 rounded-xl px-6 py-4 hover:border-fuchsia-600 transition duration-300 w-40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={48}
                height={48}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-2 text-cyan-400"
                viewBox="0 0 24 24"
              >
                <path d="m5 11 4-7" />
                <path d="m19 11-4-7" />
                <path d="M2 11h20" />
                <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4" />
                <path d="m9 11 1 9" />
                <path d="M4.5 15.5h15" />
                <path d="m15 11-1 9" />
              </svg>
              <span className="text-white font-bold text-2xl">
                {getAllProduct.length}
              </span>
              <span className="text-fuchsia-500 font-semibold">Productos</span>
            </Tab>

            {/* Orders Tab */}
            <Tab className="cursor-pointer flex flex-col items-center bg-black border border-cyan-400 rounded-xl px-6 py-4 hover:border-fuchsia-600 transition duration-300 w-40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={48}
                height={48}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-2 text-cyan-400"
                viewBox="0 0 24 24"
              >
                <line x1={10} x2={21} y1={6} y2={6} />
                <line x1={10} x2={21} y1={12} y2={12} />
                <line x1={10} x2={21} y1={18} y2={18} />
                <path d="M4 6h1v4" />
                <path d="M4 10h2" />
                <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
              </svg>
              <span className="text-white font-bold text-2xl">
                {getAllOrder.length}
              </span>
              <span className="text-fuchsia-500 font-semibold">Ordenes</span>
            </Tab>

            {/* Users Tab */}
            <Tab className="cursor-pointer flex flex-col items-center bg-black border border-cyan-400 rounded-xl px-6 py-4 hover:border-fuchsia-600 transition duration-300 w-40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={48}
                height={48}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-2 text-cyan-400"
                viewBox="0 0 24 24"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx={9} cy={7} r={4} />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="text-white font-bold text-2xl">
                {getAllUser.length}
              </span>
              <span className="text-fuchsia-500 font-semibold">Usuarios</span>
            </Tab>
          </TabList>

          <TabPanel>
            <ProductDetail />
          </TabPanel>
          <TabPanel>
            <OrderDetail />
          </TabPanel>
          <TabPanel>
            <UserDetail />
          </TabPanel>
        </Tabs>
      </div>
      <div className="m-4">
        <DiscountCodesAdmin />
      </div>
      <div className="m-4">
        <AdminShippingZones />
      </div>
    </div>
  );
};

export default AdminDashboard;
