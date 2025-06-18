import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";
dotenv.config();

console.log("Token MercadoPago:", process.env.MERCADOPAGO_ACCESS_TOKEN);

// Configurar cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const app = express();

// Configurar CORS
app.use(
  cors({
    origin: [
      "https://ecommerce-tech-zone.vercel.app",
      "https://ecommerce-tech-zone-git-main-devdonattis-projects.vercel.app",
      "https://ecommerce-smile-vercel-mw1z-front-git-main-devdonattis-projects.vercel.app",
      "https://ecommerce-tech-zone-znzpjgxmg-devdonattis-projects.vercel.app",
      "https://ecommerce-smile-vercel-mw1z-front-ju3aczsdf.vercel.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// Ruta base
app.get("/", (req, res) => {
  res.send("Soy el server :)");
});

// Crear preferencia desde carrito
app.post("/api/create_preference_cart", async (req, res) => {
  console.log("Datos recibidos en /create_preference_cart:", req.body);
  try {
    const cartItems = req.body.cartItems;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        error: "El carrito está vacío o no contiene elementos válidos.",
      });
    }

    const items = cartItems.map((item) => {
      const quantity = Number(item.quantity);
      const unit_price = Number(item.price);

      if (isNaN(quantity) || isNaN(unit_price)) {
        throw new Error("Cantidad o precio inválidos");
      }

      return {
        title: `${item.title} x${quantity}`, // Muestra el título con la cantidad
        quantity: 1, // Para que MP lo muestre como un ítem
        unit_price: quantity * unit_price, // Precio total de ese producto
      };
    });

    const body = {
      items,
      back_urls: {
        success: "https://ecommerce-tech-zone.vercel.app",
        failure: "https://ecommerce-tech-zone.vercel.app",
        pending: "https://ecommerce-tech-zone.vercel.app",
      },
      auto_return: "approved",
      notification_url: "https://ecommerce-tech-zone.vercel.app/notificaciones", // opcional
      statement_descriptor: "SMILE SHOP", // nombre corto que aparece en el resumen de tarjeta
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    console.log("Preferencia creada:", result);

    if (result && result.id && result.init_point) {
      return res.json({
        id: result.id,
        init_point: result.init_point,
      });
    } else {
      return res.status(500).json({
        error: "No se recibió un ID de preferencia válido.",
      });
    }
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return res.status(500).json({
      error: error.message || "Error al crear la preferencia.",
    });
  }
});

// Vercel: evitar iniciar servidor en producción
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Servidor local corriendo en el puerto 3000");
  });
}

export default (req, res) => {
  app(req, res);
};
