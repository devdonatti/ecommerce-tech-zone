import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { initMercadoPago } from "@mercadopago/sdk-react";

initMercadoPago("APP_USR-4bbcc18f-f704-4ab9-bc2a-fa53ba90cc66");

const BuyNowModal = ({ addressInfo, setAddressInfo, buyNowFunction }) => {
  const [open, setOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart);

  const handleOpen = () => setOpen(!open);

  const isFormValid =
    addressInfo.name &&
    addressInfo.address &&
    addressInfo.pincode &&
    addressInfo.mobileNumber;

  const createPreference = async (cartItems) => {
    try {
      const items = cartItems.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        description: item.description,
        productImageUrl: item.productImageUrl,
      }));

      const response = await axios.post(
        "https://ecommerce-tech-zone-q2e8-git-main-devdonattis-projects.vercel.app/api/create_preference_cart",
        { cartItems: items }
      );

      const { id, init_point } = response.data;
      if (id) {
        window.location.href = init_point;
      } else {
        throw new Error("No se recibió un ID de preferencia");
      }
    } catch (error) {
      console.error("Error al crear la preferencia:", error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleOpen}
        className="w-full px-4 py-3 text-center text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow"
      >
        Comprar ahora
      </Button>

      <Dialog
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <DialogBody className="bg-white rounded-xl p-6 max-w-md mx-auto text-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Datos de envío
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={addressInfo.name}
              onChange={(e) =>
                setAddressInfo({ ...addressInfo, name: e.target.value })
              }
              placeholder="Nombre completo"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-cyan-500 placeholder-gray-400"
            />

            <input
              type="text"
              name="address"
              value={addressInfo.address}
              onChange={(e) =>
                setAddressInfo({ ...addressInfo, address: e.target.value })
              }
              placeholder="Dirección"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-cyan-500 placeholder-gray-400"
            />

            <input
              type="number"
              name="pincode"
              value={addressInfo.pincode}
              onChange={(e) =>
                setAddressInfo({ ...addressInfo, pincode: e.target.value })
              }
              placeholder="Código postal"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-cyan-500 placeholder-gray-400"
            />

            <input
              type="text"
              name="mobileNumber"
              value={addressInfo.mobileNumber}
              onChange={(e) =>
                setAddressInfo({ ...addressInfo, mobileNumber: e.target.value })
              }
              placeholder="Teléfono"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-cyan-500 placeholder-gray-400"
            />
          </div>

          <div className="mt-6 flex justify-between gap-4">
            <Button
              variant="text"
              onClick={handleOpen}
              className="w-full text-gray-500 hover:text-gray-800"
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={() => {
                handleOpen();
                buyNowFunction(createPreference);
              }}
              disabled={!isFormValid}
              className={`w-full px-4 py-2 text-white rounded-md shadow ${
                !isFormValid
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-700"
              }`}
            >
              Confirmar compra
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default BuyNowModal;
