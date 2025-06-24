import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";
dotenv.config();

console.log("Token MercadoPago:", process.env.MERCADOPAGO_ACCESS_TOKEN);

// Configuración del cliente de MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: [
      "https://www.vikingtech.com.ar",

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
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Soy el server :)");
});

// Endpoint para crear una preferencia desde el detalle del producto
app.post("/api/create_preference", async (req, res) => {
  console.log("Datos recibidos en /create_preference:", req.body);
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "ARS",
          description: req.body.description,
          picture_url: req.body.productImageUrl,
        },
      ],
      back_urls: {
        success: "https://www.vikingtech.com.ar",
        failure: "https://www.vikingtech.com.ar",
        pending: "https://www.vikingtech.com.ar",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    if (result?.id && result?.init_point) {
      return res.json({
        id: result.id,
        init_point: result.init_point,
      });
    } else {
      return res.status(500).json({ error: "No se recibió un ID válido." });
    }
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return res.status(500).json({
      error: error.message || "Error al crear la preferencia.",
    });
  }
});

// ✅ Endpoint para crear una preferencia desde el carrito, incluyendo envío
app.post("/api/create_preference_cart", async (req, res) => {
  console.log("Datos recibidos en /create_preference_cart:", req.body);

  try {
    const cartItems = req.body.cartItems;
    const shippingCost = Number(req.body.shippingCost || 0);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        error: "El carrito está vacío o no contiene elementos válidos.",
      });
    }

    const items = cartItems.map((item) => {
      const quantity = Number(item.quantity);
      const unit_price = Number(item.price);

      if (isNaN(quantity) || isNaN(unit_price)) {
        throw new Error("La cantidad o el precio no son válidos");
      }

      return {
        title: item.title,
        quantity,
        unit_price,
        currency_id: "ARS",
        description: item.description,
        picture_url: item.productImageUrl,
      };
    });

    // Agregar el costo de envío como ítem adicional si corresponde
    if (shippingCost > 0) {
      items.push({
        title: "Costo de envío",
        quantity: 1,
        unit_price: shippingCost,
        currency_id: "ARS",
        description: "Envío seleccionado por el cliente",
        picture_url: "",
      });
    }

    const body = {
      items,
      back_urls: {
        success: "https://www.vikingtech.com.ar",
        failure: "https://www.vikingtech.com.ar",
        pending: "https://www.vikingtech.com.ar",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    if (result?.id && result?.init_point) {
      return res.json({
        id: result.id,
        init_point: result.init_point,
      });
    } else {
      return res.status(500).json({ error: "No se recibió un ID válido." });
    }
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return res.status(500).json({
      error: error.message || "Error al crear la preferencia.",
    });
  }
});

// Configuración para Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Servidor local corriendo en el puerto 3000");
  });
}

export default (req, res) => {
  app(req, res);
};
