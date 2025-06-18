import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { initMercadoPago } from "@mercadopago/sdk-react";

// Inicializa MercadoPago solo una vez
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

  const createPreference = async () => {
    try {
      const items = cartItems.map((item) => ({
        title: `${item.title} x${item.quantity}`,
        quantity: Number(item.quantity),
        unit_price: Number(item.price),
        description: item.description,
        picture_url: item.productImageUrl,
      }));

      const response = await axios.post(
        "https://ecommerce-tech-zone-q2e8-git-main-devdonattis-projects.vercel.app/api/create_preference_cart",
        { cartItems: items }
      );

      const { id, init_point } = response.data;

      if (id && init_point) {
        console.log("Preferencia creada correctamente:", id);
        window.location.href = init_point; // Redirige a MercadoPago
      } else {
        throw new Error("No se recibió un ID de preferencia válido");
      }
    } catch (error) {
      console.error("Error al crear la preferencia:", error);
      toast.error("Error al crear la preferencia");
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleOpen}
        className="w-full px-4 py-3 text-center text-gray-100 bg-black border border-transparent hover:bg-gray-700 rounded-xl"
      >
        Comprar ahora
      </Button>

      <Dialog open={open} handler={handleOpen} className="bg-gray-500">
        <DialogBody>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              value={addressInfo.name}
              onChange={(e) =>
                setAddressInfo({ ...addressInfo, name: e.target.value })
              }
              placeholder="Nombre"
              className="bg-gray-300 border border-gray-200 px-2 py-2 w-full rounded-md outline-none text-black placeholder-yellow-700"
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="address"
              value={addressInfo.address}
              onChange={(e) =>
                setAddressInfo({ ...addressInfo, address: e.target.value })
              }
              placeholder="Tu dirección"
              className="bg-gray-300 border border-gray-200 px-2 py-2 w-full rounded-md outline-none text-black placeholder-yellow-700"
            />
          </div>

          <div className="mb-3">
            <input
              type="number"
              name="pincode"
              value={addressInfo.pincode}
              onChange={(e) =>
                setAddressInfo({ ...addressInfo, pincode: e.target.value })
              }
              placeholder="Código postal"
              className="bg-gray-300 border border-gray-200 px-2 py-2 w-full rounded-md outline-none text-black placeholder-yellow-700"
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="mobileNumber"
              value={addressInfo.mobileNumber}
              onChange={(e) =>
                setAddressInfo({
                  ...addressInfo,
                  mobileNumber: e.target.value,
                })
              }
              placeholder="Teléfono"
              className="bg-gray-300 border border-gray-200 px-2 py-2 w-full rounded-md outline-none text-black placeholder-yellow-700"
            />
          </div>

          <Button
            type="button"
            onClick={() => {
              if (!isFormValid) {
                return toast.error("Completa todos los campos");
              }
              handleOpen(); // Cerrar el modal
              buyNowFunction(createPreference); // Pasa la función a buyNowFunction
            }}
            disabled={!isFormValid}
            className={`w-full px-4 py-3 text-center text-gray-100 ${
              !isFormValid ? "bg-gray-400 cursor-not-allowed" : "bg-black"
            } border border-transparent rounded-lg`}
          >
            Confirmar compra
          </Button>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default BuyNowModal;
