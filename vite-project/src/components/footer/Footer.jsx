import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { MessageCircle, PhoneCall } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#e5e5e5] text-black text-sm mt-12 dark:bg-gray-900  dark:text-white">
      {/* Logo centrado arriba en mobile */}
      <div className="py-8 text-center lg:hidden">
        <Link to="/">
          <img src="/logo3.png" alt="Logo" className="h-14 mx-auto" />
        </Link>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Logo en desktop */}
        <div className="hidden lg:block">
          <Link to="/">
            <img src="/logo3.png" alt="Logo" className="h-24" />
          </Link>
        </div>

        {/* Categorías */}
        <div>
          <h3 className="font-bold text-lg mb-3">Categorías</h3>
          <ul className="space-y-2">
            {["Pc", "Perifericos", "Monitores"].map((cat, i) => (
              <Link
                key={i}
                to={`/category/${cat.toLowerCase()}`}
                className="block hover:underline"
              >
                {cat}
              </Link>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="font-bold text-lg mb-3">Contáctanos</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <Phone size={16} />
              <a
                href="https://wa.me/541136713215"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp +54 11-3671-3215
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} />
              <a href="mailto:ventas@vikingtech.com.ar">
                ventas@vikingtech.com.ar
              </a>
            </li>
          </ul>
        </div>

        {/* Redes Sociales */}
        <div>
          <h3 className="font-bold text-lg mb-3">Sigamos conectados</h3>
          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
            >
              <Instagram size={20} />
            </a>
            <a
              target="_blank"
              href="https://www.facebook.com/profile.php?id=61577699343940"
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://wa.me/541136713215"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white p-2 rounded-full hover:bg-green-600 transition"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        {/* Pago y envío */}
        <div>
          <h3 className="font-bold text-lg mb-3">Medios de pago y envío</h3>
          <img
            src="/mp2.png"
            alt="Medios de pago"
            className="mb-4 max-w-full h-12 object-contain"
          />
          <img
            src="/correo1.png"
            alt="Correo Argentino"
            className="max-w-[120px] h-10 object-contain"
          />
        </div>
      </div>

      {/* Legal y autoría */}
      <div className="bg-black text-white text-xs text-center py-4 px-6 space-y-1">
        <p>Copyright VikingTech - 2025. Todos los derechos reservados.</p>

        <p className="mt-2">
          Powered by{" "}
          <a
            href="https://www.mdev.com.ar"
            className="underline hover:text-gray-300"
          >
            MDev
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
