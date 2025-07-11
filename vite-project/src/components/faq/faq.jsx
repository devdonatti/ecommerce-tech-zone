import { useState } from "react";
import { Sun, Moon, ChevronDown } from "lucide-react";
import Layout from "../layout/Layout";

const faqs = [
  {
    question: "¿Tienen local físico?",
    answer:
      "No, VikingTech funciona 100% online. Podés hacer tu compra desde la comodidad de tu casa.",
  },
  {
    question: "¿Tengo que registrarme para comprar?",
    answer:
      "No es obligatorio. Podés comprar como invitado. Pero si te registrás, vas a poder seguir el estado de tu compra y ver tu historial de órdenes.",
  },
  {
    question: "¿Qué medios de pago aceptan?",
    answer:
      "Podés pagar con tarjeta de débito o crédito a través de Mercado Pago. También aceptamos transferencias directas al CBU de VikingTech.",
  },
  {
    question: "¿Qué pasa después de que pago?",
    answer:
      "Una vez recibido el pago, el equipo de VikingTech se va a contactar con vos para coordinar el envío o entrega del producto.",
  },
  {
    question: "¿Cuanto tarda en llegar mi producto?",
    answer:
      "Una vez recibido el pago, el equipo de VikingTech despachará el producto el mismo dia, o el siguiente",
  },
];

const FAQ = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Layout>
      <div
        className={`min-h-screen px-6 py-14 transition-colors duration-300 ${
          darkMode ? "bg-[#0d0d0d] text-white" : "bg-[#f9f9f9] text-black"
        }`}
      >
        <div className="flex justify-between items-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold ">Preguntas Frecuentes</h2>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-transparent border border-gray-300 dark:border-gray-700 hover:scale-105 transition"
          >
            {darkMode ? (
              <Sun className="text-yellow-400" />
            ) : (
              <Moon className="text-cyan-600" />
            )}
          </button>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className={`p-6 rounded-2xl backdrop-blur-md cursor-pointer border transition-all duration-300 ${
                darkMode
                  ? openIndex === index
                    ? "bg-[#1f1f1f]/70 border-[#c026d3]"
                    : "bg-[#121212]/50 border-gray-700"
                  : openIndex === index
                  ? "bg-white border-[#c026d3] shadow-md"
                  : "bg-white/70 border-gray-300 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-cyan-600">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-300 ${
                    openIndex === index
                      ? "rotate-180 text-[#c026d3]"
                      : "text-gray-500"
                  }`}
                />
              </div>
              {openIndex === index && (
                <p className="mt-3 text-sm text-gray-700 dark:text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
