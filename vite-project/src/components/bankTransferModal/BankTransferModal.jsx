// components/bankTransferModal/BankTransferModal.jsx
import { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import toast from "react-hot-toast";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import { useSelector } from "react-redux";

const BankTransferModal = ({ addressInfo, setAddressInfo, shippingCost }) => {
  const [open, setOpen] = useState(false);
  const [showCBU, setShowCBU] = useState(false);

  const cartItems = useSelector((state) => state.cart);
  const user = JSON.parse(localStorage.getItem("users"));

  const cartTotal = cartItems.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    const price = Number(item.price);
    return sum + (isNaN(quantity) || isNaN(price) ? 0 : quantity * price);
  }, 0);

  const handleOpen = () => {
    setShowCBU(false);
    setOpen(!open);
  };

  const handleConfirm = async () => {
    if (
      !addressInfo.name ||
      !addressInfo.address ||
      !addressInfo.pincode ||
      !addressInfo.mobileNumber
    ) {
      return toast.error("Todos los campos son requeridos");
    }

    if (shippingCost === 0) {
      toast.error("Debés seleccionar una opción de envío");
      setOpen(false); // Cierra el modal
      return;
    }

    try {
      const orderInfo = {
        cartItems,
        addressInfo,
        email: user?.email || "invitado",
        userid: user?.uid || "invitado",
        status: "pendiente de transferencia",
        shippingCost,
        total: cartTotal + shippingCost,
        time: Timestamp.now().toMillis(),
        date: new Date().toLocaleString("es-AR", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      const orderRef = collection(fireDB, "order");
      await addDoc(orderRef, orderInfo);
      toast.success("Orden creada. Esperamos tu transferencia.");
      setShowCBU(true);
    } catch (error) {
      toast.error("Error al crear la orden");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("0000003100029002166741");
    toast.success("CBU copiado al portapapeles");
  };

  return (
    <>
      <Button color="gray" onClick={handleOpen}>
        Pagar con transferencia
      </Button>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>
          {showCBU ? "Datos para la transferencia" : "Completá tus datos"}
        </DialogHeader>

        <DialogBody>
          {showCBU ? (
            <div className="space-y-4 text-sm">
              <p>
                <strong>CBU:</strong> 0000003100029002166741{" "}
                <button
                  onClick={copyToClipboard}
                  className="ml-2 text-blue-500 underline text-xs"
                >
                  Copiar
                </button>
              </p>
              <p>
                <strong>Alias:</strong> techzone.transfer
              </p>

              <p className="text-green-700 mt-4">
                Luego de transferir, enviá el comprobante a nuestro WhatsApp.
              </p>
              <a
                href={`https://wa.me/5491170618004?text=${encodeURIComponent(
                  `Hola! Te envío el comprobante de la transferencia.\n\nNombre: ${
                    addressInfo.name
                  }\nTotal: $${
                    cartTotal + shippingCost
                  }\n\nAdjunto el comprobante a continuación.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button color="blue" className="mt-4">
                  Enviar comprobante por WhatsApp
                </Button>
              </a>
            </div>
          ) : (
            <div className="grid gap-4">
              <Input
                label="Nombre"
                value={addressInfo.name}
                onChange={(e) =>
                  setAddressInfo({ ...addressInfo, name: e.target.value })
                }
              />
              <Input
                label="Dirección"
                value={addressInfo.address}
                onChange={(e) =>
                  setAddressInfo({ ...addressInfo, address: e.target.value })
                }
              />
              <Input
                label="Código Postal"
                value={addressInfo.pincode}
                onChange={(e) =>
                  setAddressInfo({ ...addressInfo, pincode: e.target.value })
                }
              />
              <Input
                label="Celular"
                value={addressInfo.mobileNumber}
                onChange={(e) =>
                  setAddressInfo({
                    ...addressInfo,
                    mobileNumber: e.target.value,
                  })
                }
              />
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen}>
            Cerrar
          </Button>
          {!showCBU && (
            <Button color="green" onClick={handleConfirm} className="ml-2">
              Confirmar
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default BankTransferModal;
