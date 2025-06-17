import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import { fireDB } from "../../firebase/FirebaseConfig";
import { useNavigate } from "react-router";
import Loader from "../../components/loader/Loader";

const categoryList = [
  {
    name: "pc",
  },
  {
    name: "monitores",
  },
  {
    name: "perifericos",
  },
];
const AddProductPage = () => {
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  // navigate
  const navigate = useNavigate();

  // product state
  const [product, setProduct] = useState({
    title: "",
    price: "",
    productImageUrl: "",
    category: "",
    description: "",
    quantity: 1,
    time: Timestamp.now().toDate().toISOString(),
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });

  // Add Product Function
  const addProductFunction = async () => {
    if (
      product.title == "" ||
      product.price == "" ||
      product.productImageUrl == "" ||
      product.category == "" ||
      product.description == ""
    ) {
      return toast.error("Todos los campos son requeridos");
    }

    setLoading(true);
    try {
      const productRef = collection(fireDB, "products");
      await addDoc(productRef, product);
      toast.success("Add product successfully");
      navigate("/admin-dashboard");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Agregar producto falló");
    }
  };
  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        {loading && <Loader />}
        {/* Login Form  */}
        <div className="login_Form bg-gray-400 px-8 py-6 border border-black rounded-xl shadow-md">
          {/* Top Heading  */}
          <div className="mb-5">
            <h2 className="text-center text-2xl font-bold text-black "></h2>
          </div>
          {/* Input One  */}
          <div className="mb-3">
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={(e) => {
                setProduct({
                  ...product,
                  title: e.target.value,
                });
              }}
              placeholder="Titulo del producto"
              className="bg-gray-100 border text-black border-black px-2 py-2 w-96 rounded-md outline-none placeholder-gray-400"
            />
          </div>
          {/* Input Two  */}
          <div className="mb-3">
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={(e) => {
                setProduct({
                  ...product,
                  price: e.target.value,
                });
              }}
              placeholder="Precio del producto"
              className="bg-gray-100 border text-black border-black px-2 py-2 w-96 rounded-md outline-none placeholder-gray-400"
            />
          </div>
          {/* Input Three  */}
          <div className="mb-3">
            <input
              type="text"
              name="productImageUrl"
              value={product.productImageUrl}
              onChange={(e) => {
                setProduct({
                  ...product,
                  productImageUrl: e.target.value,
                });
              }}
              placeholder="Producto Imagen Url"
              className="bg-gray-100 border text-black border-black px-2 py-2 w-96 rounded-md outline-none placeholder-gray-400"
            />
          </div>
          {/* Input Four  */}
          <div className="mb-3">
            <select
              value={product.category}
              onChange={(e) => {
                setProduct({
                  ...product,
                  category: e.target.value,
                });
              }}
              className="w-full px-1 py-2 text-black bg-gray-100 border border-black rounded-md outline-none   "
            >
              <option disabled>Seleccionar categoria del producto</option>
              {categoryList.map((value, index) => {
                const { name } = value;
                return (
                  <option
                    className=" placeholder-gray-400 first-letter:uppercase"
                    key={index}
                    value={name}
                  >
                    {name}
                  </option>
                );
              })}
            </select>
          </div>
          {/* Input Five  */}
          <div className="mb-3">
            <textarea
              value={product.description}
              onChange={(e) => {
                setProduct({
                  ...product,
                  description: e.target.value,
                });
              }}
              name="description"
              placeholder="Descripcion del producto"
              rows="5"
              className=" w-full px-2 py-1 text-black bg-gray-50 border border-black rounded-md outline-none  placeholder-gray-400 "
            ></textarea>
          </div>
          {/* Add Product Button  */}
          <div className="mb-3">
            <button
              onClick={addProductFunction}
              type="button"
              className="bg-gray-600 hover:bg-black w-full text-white text-center py-2 font-bold rounded-md "
            >
              Agregar producto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
