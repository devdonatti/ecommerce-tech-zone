import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Configuración del cliente de MercadoPago
const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-5002262327522339-110611-d2dfcbaa10598f2336e9c4b9ded29dd7-1338912701",
});

const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: [
      "https://tiendasmile.vercel.app",
      "https://ecommerce-smile-vercel-mw1z-front.vercel.app",
      "https://ecommerce-smile-vercel-mw1z-front-git-main-devdonattis-projects.vercel.app",
      "https://ecommerce-smile-vercel-mw1z-front-dd1wnhnyv.vercel.app",
      "https://ecommerce-smile-vercel-mw1z-front-ju3aczsdf.vercel.app",
    ], // Permitir ambos frontends
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
  console.log("Datos recibidos en /create_preference:", req.body); // Agregar log para verificar los datos que recibes
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
        success: "https://ecommerce-smile-vercel-mw1z-front.vercel.app",
        failure: "https://ecommerce-smile-vercel-mw1z-front.vercel.app",
        pending: "https://ecommerce-smile-vercel-mw1z-front.vercel.app",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    console.log("Resultado completo de MercadoPago:", result);

    if (result && result.id && result.init_point) {
      return res.json({
        id: result.id,
        init_point: result.init_point,
      });
    } else {
      console.error("Respuesta inesperada de MercadoPago:", result);
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

// Endpoint para crear una preferencia desde el carrito de compras
app.post("/api/create_preference_cart", async (req, res) => {
  console.log("Datos recibidos en /create_preference_cart:", req.body); // Agregar log para verificar los datos que recibes
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
        throw new Error("La cantidad o el precio no son números válidos");
      }

      return {
        title: item.title,
        quantity,
        unit_price,
        description: item.description,
        picture_url: item.productImageUrl,
      };
    });

    const body = {
      items: items,
      back_urls: {
        success: "https://ecommerce-smile-vercel-mw1z-front.vercel.app",
        failure: "https://ecommerce-smile-vercel-mw1z-front.vercel.app",
        pending: "https://ecommerce-smile-vercel-mw1z-front.vercel.app",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    console.log("Resultado completo de MercadoPago:", result);

    if (result && result.id && result.init_point) {
      return res.json({
        id: result.id,
        init_point: result.init_point,
      });
    } else {
      console.error("Respuesta inesperada de MercadoPago:", result);
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

// Configuración para Vercel: No iniciar el servidor manualmente
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log(`Servidor local corriendo en el puerto 3000`);
  });
}

export default (req, res) => {
  app(req, res); // Llamar a la aplicación express para manejar las solicitudes en Vercel
};
