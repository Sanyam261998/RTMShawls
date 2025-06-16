import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const inCart = items.find((item) => item.ID === product.ID);

  const handleAdd = () => {
    if (!inCart) dispatch(addToCart(product));
  };

  return (
    <div className="bg-gray-900 text-white shadow-md p-4 rounded-lg flex flex-col justify-between transition duration-200 hover:shadow-lg hover:border-primary border border-gray-800">
      <div className="mb-3">
        {product["ImageLink"] ? (
          <img
            src={`http://localhost:3001/image?url=${encodeURIComponent(product["ImageLink"])}`}
            alt={product.Name}
            loading="lazy"
            className="w-full h-full object-cover rounded-md bg-gray-700"
          />
        ) : (
          <div className="w-full h-48 bg-gray-700 rounded-md flex items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold text-primary mb-1">{product.Name}</h2>
      <p className="text-gray-300 mb-4">₹{product.Price}</p>

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
    </div>
  );
}

export default ProductCard;
