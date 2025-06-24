import { useNavigate, useParams } from "react-router";
import Layout from "../../components/layout/Layout";
import { useContext, useEffect } from "react";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";

const CategoryPage = () => {
  const { categoryname } = useParams();
  const context = useContext(myContext);
  const { getAllProduct, loading } = context;

  const navigate = useNavigate();

  const filterProduct = getAllProduct.filter((obj) =>
    obj.category.includes(categoryname)
  );

  return (
    <Layout>
      <div className="mt-10 px-5">
        {/* Heading */}
        <h1 className="text-center mb-5 text-2xl font-semibold first-letter:uppercase">
          {categoryname}
        </h1>

        {/* Main content */}
        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <>
            {filterProduct.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filterProduct.map((item) => {
                  const { id, title, price, productImageUrl } = item;
                  return (
                    <div
                      key={id}
                      className="relative border-2 border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-cyan-500"
                    >
                      {/* Imagen */}
                      <img
                        onClick={() => navigate(`/productinfo/${id}`)}
                        className="h-60 w-full object-cover cursor-pointer"
                        src={productImageUrl}
                        alt={title}
                      />

                      {/* Contenido */}
                      <div className="p-4">
                        <h2 className="text-sm font-medium text-gray-700 mb-1">
                          {title}
                        </h2>

                        {/* Precio original tachado */}
                        <p className="text-gray-400 text-sm line-through">
                          ${Math.round(price * 1.1).toLocaleString("es-AR")}
                        </p>

                        {/* Precio final destacado */}
                        <p className="text-gray-900 font-bold text-lg">
                          ${Number(price).toLocaleString("es-AR")}
                        </p>

                        {/* Precio con transferencia */}
                        <p className="text-green-600 text-sm font-semibold">
                          ${Math.round(price * 0.9).toLocaleString("es-AR")} con
                          Transferencia
                        </p>

                        {/* Botón VER MÁS */}
                        <button
                          onClick={() => navigate(`/productinfo/${id}`)}
                          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded text-sm transition-colors"
                        >
                          VER MÁS
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center mt-10">
                <img
                  className="mb-2"
                  src="https://cdn-icons-png.flaticon.com/128/2748/2748614.png"
                  alt="No products"
                />
                <h1 className="text-black text-xl">
                  {categoryname} no fue encontrado
                </h1>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
