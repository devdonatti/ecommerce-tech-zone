import { CheckCircle, Truck, PackageCheck, CreditCard } from "lucide-react";

const ProductDetails = ({
  product,
  cartItems,
  addCart,
  deleteCart,
  preferenceId,
  Wallet,
}) => {
  return (
    <div className="md:w-1/2 space-y-4">
      <h1 className="text-2xl font-semibold">{product?.title}</h1>

      {/* Precios */}
      {/* Precios */}
      {/* Precios */}
      <div className="space-y-1">
        {/* Precio tachado con recargo (simula descuento) */}
        <p className="text-base text-gray-400 dark:text-gray-500 line-through">
          ${Math.round(product?.price * 1.25).toLocaleString("es-AR")}
        </p>

        {/* Precio principal en verde (original) */}
        <p className="text-3xl font-bold text-green-400 dark:text-green-400">
          ${product?.price.toLocaleString("es-AR")}
          <span className="text-sm text-green-400 font-medium ml-2">
            con débito o transferencia
          </span>
        </p>

        {/* Precio en cuotas (+10%) */}
        <p className="text-base text-gray-500 dark:text-gray-400">
          ${Math.round(product?.price * 1.1).toLocaleString("es-AR")} hasta en
          12 cuotas
        </p>
      </div>

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
