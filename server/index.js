import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();
const app = express();

// Inicializar cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://ecommerce-tech-zone.vercel.app",
      "https://ecommerce-tech-zone-git-main-devdonattis-projects.vercel.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando 😎");
});

// Crear preferencia desde el carrito
app.post("/api/create_preference_cart", async (req, res) => {
  try {
    const cartItems = req.body.cartItems;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Carrito vacío o inválido." });
    }

    const items = cartItems.map((item) => ({
      title: item.title,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: "ARS",
      description: item.description || "",
      picture_url: item.productImageUrl || "",
    }));

    const body = {
      items,
      back_urls: {
        success: "https://ecommerce-tech-zone.vercel.app",
        failure: "https://ecommerce-tech-zone.vercel.app",
        pending: "https://ecommerce-tech-zone.vercel.app",
      },
      auto_return: "approved",
      external_reference: "pedido_carrito_ecommerce", // opcional
      notification_url: "https://ecommerce-tech-zone.vercel.app/api/webhook", // opcional
      metadata: {
        platform: "React/Vercel",
        app: "Ecommerce Smile",
      },
      payer: {
        name: "Cliente Smile", // opcional
      },
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    return res.json({
      id: result.id,
      init_point: result.init_point,
    });
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    return res.status(500).json({
      error: error.message || "Error al generar la preferencia",
    });
  }
});

// No iniciar server si está en producción (Vercel lo maneja)
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
  });
}

// Exportar para Vercel
export default (req, res) => {
  app(req, res);
};
