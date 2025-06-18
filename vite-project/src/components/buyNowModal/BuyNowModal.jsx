import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementQuantity,
  decrementQuantity,
  deleteFromCart,
} from "../../redux/cartSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { initMercadoPago } from "@mercadopago/sdk-react";

// Inicialización de MercadoPago
initMercadoPago("APP_USR-4bbcc18f-f704-4ab9-bc2a-fa53ba90cc66");

const BuyNowModal = ({ addressInfo, setAddressInfo, buyNowFunction }) => {
  const [open, setOpen] = useState(false);

  // Función para abrir/cerrar el modal
  const handleOpen = () => setOpen(!open);

  // Validación de los campos del formulario
  const isFormValid =
    addressInfo.name &&
    addressInfo.address &&
    addressInfo.pincode &&
    addressInfo.mobileNumber;

  // Crear preferencia de MercadoPago para el carrito completo
  const createPreference = async (cartItems) => {
    try {
      const items = cartItems.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        description: item.description,
        productImageUrl: item.productImageUrl,
      }));

      console.log("Items enviados al backend para crear preferencia:", items);

      // Llamada al backend para crear la preferencia
      const response = await axios.post(
        "https://ecommerce-tech-zone-git-main-devdonattis-projects.vercel.app//api/create_preference_cart",
        { cartItems: items }
      );

      // Verifica lo que devuelve la respuesta
      console.log("Respuesta del servidor:", response.data);

      const { id, init_point } = response.data;

      // Verifica si el id fue recibido correctamente
      if (id) {
        console.log("Preference ID set:", id); // Verifica que se está guardando correctamente
        window.location.href = init_point; // Redirige al usuario a MercadoPago
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
      {/* Botón principal para abrir el modal */}
      <Button
        type="button"
        onClick={handleOpen}
        className="w-full px-4 py-3 text-center text-gray-100 bg-black border border-transparent dark:border-gray-700 hover:border-gray-500 hover:text-white-700 hover:bg-gray-500 rounded-xl"
      >
        Comprar ahora
      </Button>

      {/* Modal con el formulario de dirección */}
      <Dialog open={open} handler={handleOpen} className="bg-gray-500">
        <DialogBody>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              value={addressInfo.name}
              onChange={(e) => {
                setAddressInfo({ ...addressInfo, name: e.target.value });
              }}
              placeholder="Nombre"
              className="bg-gray-300 border border-gray-200 px-2 py-2 w-full rounded-md outline-none text-black placeholder-yellow-700"
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="address"
              value={addressInfo.address}
              onChange={(e) => {
                setAddressInfo({ ...addressInfo, address: e.target.value });
              }}
              placeholder="Tu direccion"
              className="bg-gray-300 border border-gray-200 px-2 py-2 w-full rounded-md outline-none text-black placeholder-yellow-700"
            />
          </div>

          <div className="mb-3">
            <input
              type="number"
              name="pincode"
              value={addressInfo.pincode}
              onChange={(e) => {
                setAddressInfo({ ...addressInfo, pincode: e.target.value });
              }}
              placeholder="Codigo postal"
              className="bg-gray-300 border border-gray-200 px-2 py-2 w-full rounded-md outline-none text-black placeholder-yellow-700"
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="mobileNumber"
              value={addressInfo.mobileNumber}
              onChange={(e) => {
                setAddressInfo({
                  ...addressInfo,
                  mobileNumber: e.target.value,
                });
              }}
              placeholder="Telefono"
              className="bg-gray-300 border border-gray-200 px-2 py-2 w-full rounded-md outline-none text-black placeholder-yellow-700"
            />
          </div>

          {/* Botón para confirmar la compra */}
          <Button
            type="button"
            onClick={() => {
              handleOpen(); // Cerrar el modal
              buyNowFunction(createPreference); // Llamar a la función buyNowFunction que pasará createPreference
            }}
            disabled={!isFormValid} // Deshabilitar el botón si el formulario no está completo
            className={`w-full px-4 py-3 text-center text-gray-100 ${
              !isFormValid ? "bg-gray-400 cursor-not-allowed" : "bg-black"
            } border border-transparent dark:border-gray-700 rounded-lg`}
          >
            Confirmar compra
          </Button>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default BuyNowModal;
