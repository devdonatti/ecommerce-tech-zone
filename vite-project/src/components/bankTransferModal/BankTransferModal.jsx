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

const BankTransferModal = ({
  addressInfo,
  setAddressInfo,
  shippingCost,
  totalTransfer, // <-- NUEVO: total por transferencia (productos + envío o 0 si retiro)
}) => {
  const [open, setOpen] = useState(false);
  const [showCBU, setShowCBU] = useState(false);
  const [errors, setErrors] = useState({});

  const cartItems = useSelector((state) => state.cart);
  const user = JSON.parse(localStorage.getItem("users"));

  // total con precios "price" (base sin recargo) -> ya lo usás como referencia
  const cartTotal = cartItems.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    const price = Number(item.price);
    return sum + (isNaN(quantity) || isNaN(price) ? 0 : quantity * price);
  }, 0);

  const handleOpen = () => {
    setShowCBU(false);
    setOpen(!open);
    setErrors({});
  };

  const handleConfirm = async () => {
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

    try {
      const orderInfo = {
        cartItems,
        addressInfo,
        email: user?.email || "invitado",
        userid: user?.uid || "invitado",
        status: "pendiente de transferencia",
        shippingCost,
        // Guardamos explícitamente el total a transferir que ve el cliente
        totalTransfer: Number(totalTransfer || 0),
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
    navigator.clipboard.writeText("0000003100029621780498");
    toast.success("CBU copiado al portapapeles");
  };

  const whatsappText = `Hola! Te envío el comprobante de la transferencia.

Nombre: ${addressInfo.name}
Total: $${Number(totalTransfer || 0).toLocaleString("es-AR")}

Adjunto el comprobante a continuación.`;

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
              <p className="font-semibold">
                Total a transferir: $
                {Number(totalTransfer || 0).toLocaleString("es-AR")}
              </p>

              <div className="h-px w-full bg-gray-200 my-2" />

              <p>
                <strong>CBU:</strong> 0000003100029621780498{" "}
                <button
                  onClick={copyToClipboard}
                  className="ml-2 text-blue-500 underline text-xs"
                >
                  Copiar
                </button>
              </p>
              <p>
                <strong>Alias:</strong> olivosmp
              </p>

              <p className="text-green-700 mt-4">
                Luego de transferir, enviá el comprobante a nuestro WhatsApp.
              </p>
              <a
                href={`https://wa.me/5491154105141?text=${encodeURIComponent(
                  whatsappText
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button color="blue" className="mt-2">
                  Enviar comprobante por WhatsApp
                </Button>
              </a>
            </div>
          ) : (
            <div className="grid gap-4">
              <Input
                label="Nombre"
                value={addressInfo.name}
                onChange={(e) => {
                  setAddressInfo({ ...addressInfo, name: e.target.value });
                  setErrors({ ...errors, name: false });
                }}
                className={errors.name ? "border-red-500" : ""}
                error={errors.name}
              />
              <Input
                label="Dirección"
                value={addressInfo.address}
                onChange={(e) => {
                  setAddressInfo({ ...addressInfo, address: e.target.value });
                  setErrors({ ...errors, address: false });
                }}
                className={errors.address ? "border-red-500" : ""}
                error={errors.address}
              />
              <Input
                label="Localidad"
                value={addressInfo.localidad}
                onChange={(e) => {
                  setAddressInfo({ ...addressInfo, localidad: e.target.value });
                  setErrors({ ...errors, localidad: false });
                }}
                className={errors.localidad ? "border-red-500" : ""}
                error={errors.localidad}
              />
              <Input
                label="Provincia"
                value={addressInfo.provincia}
                onChange={(e) => {
                  setAddressInfo({ ...addressInfo, provincia: e.target.value });
                  setErrors({ ...errors, provincia: false });
                }}
                className={errors.provincia ? "border-red-500" : ""}
                error={errors.provincia}
              />
              <Input
                label="Código Postal"
                value={addressInfo.pincode}
                onChange={(e) => {
                  setAddressInfo({ ...addressInfo, pincode: e.target.value });
                  setErrors({ ...errors, pincode: false });
                }}
                className={errors.pincode ? "border-red-500" : ""}
                error={errors.pincode}
              />
              <Input
                label="Celular"
                value={addressInfo.mobileNumber}
                onChange={(e) => {
                  setAddressInfo({
                    ...addressInfo,
                    mobileNumber: e.target.value,
                  });
                  setErrors({ ...errors, mobileNumber: false });
                }}
                className={errors.mobileNumber ? "border-red-500" : ""}
                error={errors.mobileNumber}
              />

              {/* Resumen dentro del modal */}
              <div className="mt-2 text-sm bg-gray-50 rounded p-3">
                <div className="flex justify-between">
                  <span>Productos + envio :</span>
                  <span>
                    ${Math.round(totalTransfer).toLocaleString("es-AR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>
                    ${Number(shippingCost || 0).toLocaleString("es-AR")}
                  </span>
                </div>
                <div className="flex justify-between font-semibold border-t mt-2 pt-2">
                  <span>Total a transferir:</span>
                  <span>
                    ${Number(totalTransfer || 0).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
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
