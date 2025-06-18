import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";
import dotenv from "dotenv";
dotenv.config();

console.log("Token MercadoPago:", process.env.MERCADOPAGO_ACCESS_TOKEN);

// Configuración de MercadoPago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const app = express();

// CORS: agregar tus frontends permitidos
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

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Soy el server :)");
});

// Crear preferencia desde producto individual
app.post("/api/create_preference", async (req, res) => {
  console.log("Datos recibidos en /create_preference:", req.body);
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          description: req.body.description,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "ARS",
          picture_url: req.body.productImageUrl,
        },
      ],
      back_urls: {
        success: "https://ecommerce-tech-zone.vercel.app",
        failure: "https://ecommerce-tech-zone.vercel.app",
        pending: "https://ecommerce-tech-zone.vercel.app",
      },
      auto_return: "approved",
      statement_descriptor: "TECH ZONE",
      external_reference: "producto-" + Date.now(),
      metadata: {
        origen: "producto-individual",
      },
    };

    const result = await mercadopago.preferences.create(body);

    return res.json({
      id: result.body.id,
      init_point: result.body.init_point,
    });
  } catch (error) {
    console.error("Error al crear preferencia individual:", error);
    return res.status(500).json({
      error: error.message || "Error al crear la preferencia",
    });
  }
});

// Crear preferencia desde carrito
app.post("/api/create_preference_cart", async (req, res) => {
  console.log("Datos recibidos en /create_preference_cart:", req.body);
  try {
    const cartItems = req.body.cartItems;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío." });
    }

    const items = cartItems.map((item) => ({
      title: item.title,
      description: item.description,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: "ARS",
      picture_url: item.productImageUrl,
    }));

    const body = {
      items,
      back_urls: {
        success: "https://ecommerce-tech-zone.vercel.app",
        failure: "https://ecommerce-tech-zone.vercel.app",
        pending: "https://ecommerce-tech-zone.vercel.app",
      },
      auto_return: "approved",
      statement_descriptor: "TECH ZONE",
      external_reference: "carrito-" + Date.now(),
      metadata: {
        origen: "carrito",
      },
    };

    const result = await mercadopago.preferences.create(body);

    return res.json({
      id: result.body.id,
      init_point: result.body.init_point,
    });
  } catch (error) {
    console.error("Error al crear preferencia carrito:", error);
    return res.status(500).json({
      error: error.message || "Error al crear la preferencia",
    });
  }
});

// Configuración para Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Servidor local corriendo en puerto 3000");
  });
}

export default (req, res) => {
  app(req, res);
};
