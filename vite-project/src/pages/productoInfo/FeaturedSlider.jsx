import Slider from "react-slick";
import { ChevronLeft, ChevronRight, Eye, ShoppingCart } from "lucide-react";

const PrevArrow = ({ onClick }) => (
  <div
    className="hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 shadow p-2 rounded-full"
    onClick={onClick}
  >
    <ChevronLeft size={22} />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div
    className="hidden md:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 shadow p-2 rounded-full"
    onClick={onClick}
  >
    <ChevronRight size={22} />
  </div>
);

const FeaturedSlider = ({ products, addCart, navigate }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="mt-12 px-4" id="destacados">
      <h1 className="text-center mb-6 text-2xl font-semibold dark:text-cyan-600">
        Destacados
      </h1>
      <div className="relative">
        <Slider {...settings}>
          {products.slice(0, 10).map((item) => {
            const { id, title, price, productImageUrl } = item;
            return (
              <div key={id} className="px-2 m-4">
                <div className="bg-white dark:bg-gray-900 border p-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-[0_0_15px_#06b6d4] hover:border-cyan-500 transition-all duration-300">
                  {/* Imagen */}
                  <img
                    onClick={() => {
                      navigate(`/productinfo/${id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="h-52 sm:h-60 w-full object-cover cursor-pointer"
                    src={productImageUrl}
                    alt={title}
                  />

                  {/* Contenido */}
                  <div className="p-4 space-y-2">
                    <h2 className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                      {title}
                    </h2>
                    <p className="text-xs text-green-400 dark:text-gray-500 line-through">
                      ${Math.round(price * 1.25).toLocaleString("es-AR")}
                    </p>

                    <p className="text-xl font-bold text-green-400 dark:text-green-400">
                      ${Math.round(price * 0.85).toLocaleString("es-AR")}
                      <span className="text-sm font-normal text-green-400 ml-1">
                        débito o transferencia
                      </span>
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${Math.round(price * 1.1).toLocaleString("es-AR")} crédito
                    </p>

                    <div className="flex flex-col gap-2 mt-3">
                      <button
                        onClick={() => {
                          navigate(`/productinfo/${id}`);
                          window.scrollTo(0, 0);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors"
                      >
                        <Eye size={16} /> VER MÁS
                      </button>
                      <button
                        onClick={() => addCart(item)}
                        className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-800 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors"
                      >
                        <ShoppingCart size={16} /> AGREGAR AL CARRITO
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default FeaturedSlider;
