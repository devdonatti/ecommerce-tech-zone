import { useState } from "react";
import { CheckCircle, Truck, PackageCheck, CreditCard } from "lucide-react";

const ProductDetails = ({
  product,
  cartItems,
  addCart,
  deleteCart,
  preferenceId,
  Wallet,
}) => {
  const price = product?.price || 0;
  const [showInstallments, setShowInstallments] = useState(false);

  const cuotas = [
    { n: 1, recargo: 0 },
    { n: 2, recargo: 0 },
    { n: 3, recargo: 0 },
    { n: 6, recargo: 0.424 },
    { n: 12, recargo: 0.753 },
  ];

  return (
    <div className="md:w-1/2 space-y-4">
      <h1 className="text-2xl font-semibold">{product?.title}</h1>

      {/* Precios */}
      <div className="space-y-1">
        <p className="text-base text-gray-400 dark:text-gray-500 line-through">
          ${Math.round(price * 1.25).toLocaleString("es-AR")}
        </p>

        <p className="text-3xl font-bold text-[#08BC08] dark:text-[#08BC08]">
          ${price.toLocaleString("es-AR")}
          <span className="text-sm text-[#08BC08] font-medium ml-2">
            con débito o transferencia
          </span>
        </p>

        <p className="text-base text-gray-500 dark:text-gray-400">
          ${Math.round(price * 1.1).toLocaleString("es-AR")} hasta en 12 cuotas
          fijas
        </p>
      </div>

      {/* Cuotas fijas + botón ver cuotas */}
      {/* Cuotas fijas + botón ver cuotas */}
      <ul className="text-sm space-y-1 mt-4">
        <li className="flex items-center gap-2">
          <CreditCard size={24} className="text-green-500" />
          <span className="text-sm text-gray-700 dark:text-gray-200">
            12 cuotas fijas de{" "}
            <span className="font-medium">
              ${Math.round((price * 1.1 * 1.753) / 12).toLocaleString("es-AR")}
            </span>
          </span>
        </li>

        <li>
          <button
            onClick={() => setShowInstallments(!showInstallments)}
            className="text-sm text-blue-600 cursor-pointer hover:underline mt-1"
          >
            {showInstallments ? "Ocultar cuotas" : "Ver cuotas"}
          </button>
        </li>
      </ul>

      {/* Cuadro de cuotas Mercado Pago */}
      {showInstallments && (
        <div className="mt-2 border border-gray-300 rounded-md p-4 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 space-y-2">
          <p className="font-medium text-gray-700 dark:text-gray-200 mb-2">
            Mercado Pago promociones:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
              <thead className="bg-gray-200 dark:bg-gray-800 font-semibold text-xs uppercase text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-2">Cuotas</th>
                  <th className="px-4 py-2">Valor cuota</th>
                  <th className="px-4 py-2">Precio final</th>
                </tr>
              </thead>
              <tbody>
                {cuotas.map(({ n, recargo }) => {
                  const precioCredito = price * 1.1; // precio con tarjeta
                  const total = precioCredito * (1 + recargo);
                  const cuota = total / n;
                  return (
                    <tr
                      key={n}
                      className="border-b border-gray-300 dark:border-gray-700"
                    >
                      <td className="px-4 py-2 flex items-center gap-2">
                        {n} cuota{n > 1 ? "s" : ""}
                        {recargo === 0 && (
                          <span className="text-green-600 font-medium text-xs">
                            Sin interés
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        ${cuota.toFixed(2).toLocaleString("es-AR")}
                      </td>
                      <td className="px-4 py-2">
                        ${total.toFixed(2).toLocaleString("es-AR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Características */}
      <ul className="text-sm space-y-1 border-t pt-4">
        <li className="flex gap-2 items-start">
          <div className="flex-shrink-0">
            <CreditCard size={24} className="text-green-500" />
          </div>
          <div className="flex flex-col">
            <p className="font-medium">Medios de pago</p>
            <img
              src="/tarjetasss.png"
              alt="Medios de pago"
              className="mt-2 w-60 ml-[-26px]"
            />
          </div>
        </li>

        <li className="flex items-center gap-2">
          <CheckCircle size={32} className="text-green-500" /> Stock disponible
        </li>
        <li className="flex items-center gap-2">
          <Truck size={32} className="text-green-500" />{" "}
          <span className="text-green-500">Envíos gratis</span> a todo el país
        </li>
        <li className="flex items-center gap-2">
          <PackageCheck size={32} className="text-green-500" /> Retiro sin cargo
        </li>
      </ul>

      {/* Botones */}
      <div className="flex flex-col gap-3 pt-4">
        {cartItems.some((p) => p.id === product.id) ? (
          <button
            onClick={() => deleteCart(product)}
            className="w-full px-4 py-3 text-white bg-red-600 hover:bg-red-700 border border-red-700 rounded-md"
          >
            Quitar del carrito
          </button>
        ) : (
          <button
            onClick={() => addCart(product)}
            className="w-full px-4 py-3 text-white bg-black hover:bg-gray-800 dark:bg-cyan-500 dark:hover:bg-cyan-600 border border-black dark:border-cyan-500 rounded-md transition-colors duration-200"
          >
            Agregar al carrito
          </button>
        )}
        {preferenceId && (
          <Wallet
            initialization={{ preferenceId }}
            customization={{ texts: { valueProp: "smart_option" } }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
