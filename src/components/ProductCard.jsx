import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const inCart = items.find((item) => item.ID === product.ID);
  const isAdmin = user?.role === "admin";

  const [imgLoaded, setImgLoaded] = useState(false);

  const handleAdd = () => {
    if (!inCart) dispatch(addToCart(product));
  };

  return (
    <div className="bg-gray-900 text-white shadow-md p-4 rounded-lg flex flex-col justify-between transition duration-200 hover:shadow-lg hover:border-primary border border-gray-800">
      <div className="mb-3 relative w-full h-full rounded-md overflow-hidden">
        {/* Skeleton shimmer */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-md" />
        )}

        {product["ImageLink"] ? (
          <img
            src={`/api/image?url=${encodeURIComponent(product["ImageLink"])}`}
            alt={product.Name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold text-primary mb-1">{product.Name}</h2>
      <p className="text-gray-300 mb-4">₹{product.Price}</p>

      {!isAdmin && (
        <button
          onClick={handleAdd}
          disabled={!!inCart}
          className={`mt-auto px-4 py-2 rounded font-semibold transition-all ${
            inCart
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-primary text-black hover:bg-yellow-500"
          }`}
        >
          {inCart ? "Added to Cart" : "Add to Cart"}
        </button>
      )}
    </div>
  );
}

export default ProductCard;
