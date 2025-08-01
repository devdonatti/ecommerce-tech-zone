import { useState, useEffect } from "react";

const ProductGallery = ({ product }) => {
  const [mainImage, setMainImage] = useState(product?.productImageUrl);

  useEffect(() => {
    // Cada vez que cambia el producto, resetear imagen principal
    setMainImage(product?.productImageUrl);
  }, [product]);

  return (
    <div className="md:w-1/2 flex flex-col items-center gap-4">
      <img
        src={mainImage}
        alt={product?.title}
        className="w-full max-w-md border p-2 rounded-lg object-contain"
      />
      <div className="flex gap-2 flex-wrap justify-center">
        {[product?.productImageUrl, ...(product?.images || [])].map(
          (img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Miniatura ${idx}`}
              onClick={() => setMainImage(img)}
              className={`h-16 w-16 object-cover cursor-pointer border ${
                mainImage === img ? "border-cyan-500" : "border-gray-300"
              } rounded-md hover:opacity-80 transition`}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
