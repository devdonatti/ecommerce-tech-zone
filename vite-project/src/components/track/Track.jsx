import { CreditCard, Truck, MessageCircle, Percent } from "lucide-react";

const Features = () => {
  return (
    <section className="bg-[#eeeeee] text-black py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {/* Feature 1 */}
        <div className="flex flex-col items-center space-y-2">
          <CreditCard className="w-10 h-10 text-black" />
          <h4 className="font-bold">12 CUOTAS</h4>
          <p className="text-sm text-gray-700">Sin interés</p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center space-y-2">
          <Truck className="w-10 h-10 text-black" />
          <h4 className="font-bold">¡ENVÍOS A TODO EL PAIS!</h4>
          <p className="text-sm text-gray-700">
            Antes de las 13hs. Envíos en el día.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center space-y-2">
          <a
            target="_blank"
            href="https://wa.me/541136713215"
            className="flex flex-col items-center space-y-2"
          >
            <MessageCircle className="w-10 h-10 text-black" />
            <h4 className="font-bold">¿TENÉS DUDAS?</h4>
            <p className="text-sm text-gray-700">
              ¡Escribinos a nuestro WhatsApp!
            </p>
          </a>
        </div>

        {/* Feature 4 */}
        <div className="flex flex-col items-center space-y-2">
          <Percent className="w-10 h-10 text-black" />
          <h4 className="font-bold">15% DE DESCUENTO</h4>
          <p className="text-sm text-gray-700">Pagando por transferencia</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
