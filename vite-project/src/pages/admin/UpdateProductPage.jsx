import { useNavigate, useParams } from "react-router";
import myContext from "../../context/myContext";
import { useContext, useEffect, useState } from "react";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

// Estructura agrupada de categorías con optgroups
const categoryData = {
  "Componentes de PC": {
    "": [
      "Placas de Video",
      "Motherboards",
      "Microprocesadores",
      "Discos SSD",
      "Memorias RAM",
      "Gabinetes",
      "Fuentes",
      "CPU Coolers - Coolers",
      "Conectividad",
    ],
    Accesorios: ["Pasta térmica"],
  },
  Notebooks: {
    Notebooks: ["Notebooks AMD", "Notebooks Intel"],
    Almacenamiento: [
      "Discos SSD",
      "Discos Externos USB",
      "Memorias SD - Pendrives",
    ],
    Accesorios: ["Mouse Inalámbricos", "Mochilas", "Pads"],
    "Memorias RAM": ["Memorias RAM Sodimm"],
  },
  Periféricos: {
    Auriculares: [
      "Gamer",
      "Estéreo",
      "Surround",
      "Para celular",
      "Soporte de auriculares",
    ],
    Mouse: ["Gamer", "Inalámbrico"],
    Teclados: ["Mecánicos", "Membrana", "RGB", "Combo"],
    Pads: ["Small", "Medium", "Large"],
    Parlantes: ["Parlantes"],
    Joysticks: ["Joystick"],
    "Volantes y Accesorios": ["Volantes"],
    Webcams: ["WebCams"],
    Impresoras: ["Tinta y tóner"],
  },
  Monitores: {
    "": [
      "Monitores LED",
      'Monitores 21"',
      'Monitores 24"',
      'Monitores 27"',
      'Monitores 32"',
      "Monitores Curvos",
    ],
  },
};

const UpdateProductPage = () => {
  const context = useContext(myContext);
  const { loading, setLoading, getAllProductFunction } = context;

  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({
    title: "",
    price: "",
    productImageUrl: "",
    images: [],
    category: "",
    description: "",
    brand: "",
    connectivity: "",
    compatibility: "",
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });

  const getSingleProductFunction = async () => {
    setLoading(true);
    try {
      const productTemp = await getDoc(doc(fireDB, "products", id));
      const data = productTemp.data();
      setProduct({
        title: data?.title || "",
        price: data?.price || "",
        productImageUrl: data?.productImageUrl || "",
        images: data?.images || [],
        category: data?.category || "",
        description: data?.description || "",
        brand: data?.brand || "",
        connectivity: data?.connectivity || "",
        compatibility: data?.compatibility || "",
        time: data?.time || Timestamp.now(),
        date:
          data?.date ||
          new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
      });
    } catch (error) {
      console.log(error);
      toast.error("Error al cargar el producto");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async () => {
    if (
      !product.title ||
      !product.price ||
      !product.productImageUrl ||
      !product.category ||
      !product.description
    ) {
      return toast.error("Todos los campos obligatorios deben completarse");
    }

    setLoading(true);
    try {
      await setDoc(doc(fireDB, "products", id), product);
      toast.success("Producto actualizado exitosamente");
      getAllProductFunction();
      navigate("/admin-dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar producto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleProductFunction();
  }, [id]);

  return (
    <div className="flex justify-center items-center h-screen bg-[#0a0a0a] px-4">
      {loading && <Loader />}

      <div className="w-full max-w-xl bg-black border border-fuchsia-700 rounded-2xl shadow-xl flex flex-col overflow-hidden h-[90vh]">
        <div className="px-6 pt-6">
          <h2 className="text-center text-2xl font-extrabold text-white tracking-wide mb-4">
            Actualizar producto
          </h2>
        </div>

        <div className="px-6 pb-4 overflow-y-auto flex-grow">
          <Input
            placeholder="Título del producto"
            value={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Precio del producto"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
          <Input
            placeholder="Imagen principal (URL)"
            value={product.productImageUrl}
            onChange={(e) =>
              setProduct({ ...product, productImageUrl: e.target.value })
            }
          />
          <Textarea
            placeholder="Galería de imágenes (URLs separadas por coma)"
            value={product.images?.join(", ") || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                images: e.target.value
                  .split(",")
                  .map((url) => url.trim())
                  .filter((url) => url !== ""),
              })
            }
          />

          {/* Categoría */}
          <div className="mb-3">
            <label className="text-white text-sm font-medium mb-1 block">
              Categoría
            </label>
            <div className="relative">
              <select
                value={product.category}
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
                }
                className="w-full appearance-none bg-black border border-cyan-400 text-white px-3 py-2 pr-10 rounded-md outline-none focus:ring-2 focus:ring-fuchsia-600 transition duration-200"
              >
                <option disabled value="">
                  Seleccionar categoría
                </option>

                {Object.entries(categoryData).map(([group, subgroups]) => (
                  <optgroup key={group} label={group}>
                    {Object.entries(subgroups).flatMap(
                      ([subgroupName, items]) =>
                        items.map((item) => {
                          // Si el nombre de subgrupo es cadena vacía, solo muestro el item
                          const optionLabel = subgroupName
                            ? `${subgroupName} - ${item}`
                            : item;
                          return (
                            <option
                              key={`${subgroupName}-${item}`}
                              value={optionLabel}
                            >
                              {optionLabel}
                            </option>
                          );
                        })
                    )}
                  </optgroup>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <Textarea
            placeholder="Descripción del producto"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />
          <Input
            placeholder="Marca"
            value={product.brand}
            onChange={(e) => setProduct({ ...product, brand: e.target.value })}
          />
          <Input
            placeholder="Conectividad"
            value={product.connectivity}
            onChange={(e) =>
              setProduct({ ...product, connectivity: e.target.value })
            }
          />
          <Input
            placeholder="Compatibilidad"
            value={product.compatibility}
            onChange={(e) =>
              setProduct({ ...product, compatibility: e.target.value })
            }
          />
        </div>

        <div className="px-6 py-4 border-t border-fuchsia-800">
          <button
            onClick={updateProduct}
            className="w-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:from-fuchsia-500 hover:to-cyan-400 text-black py-2 font-bold rounded-md transition duration-300"
          >
            Actualizar producto
          </button>
        </div>
      </div>
    </div>
  );
};

// 🌌 Input oscuro con acento tech
const Input = ({ type = "text", ...props }) => (
  <div className="mb-3">
    <input
      type={type}
      {...props}
      className="w-full px-3 py-2 rounded-md border border-cyan-400 bg-black text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-fuchsia-600 transition duration-200"
    />
  </div>
);

const Textarea = ({ ...props }) => (
  <div className="mb-3">
    <textarea
      rows="3"
      {...props}
      className="w-full px-3 py-2 rounded-md border border-cyan-400 bg-black text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-fuchsia-600 transition duration-200"
    />
  </div>
);

export default UpdateProductPage;
