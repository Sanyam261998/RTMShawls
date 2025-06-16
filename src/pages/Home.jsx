import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

const BATCH_SIZE = 12;

// Utility to convert Google Drive link to direct image
const getDriveImageUrl = (url) => {
  const match = url?.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : null;
};

function Home() {
  const [products, setProducts] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const query = useSelector((state) => state.search.query.toLowerCase());

  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const processed = data.map((item) => ({
          ...item,
          image: getDriveImageUrl(item["ImageLink"]),
        }));

        setProducts(processed);

        const categoryMap = {};
        processed.forEach((item) => {
          const cat = item.Category?.trim() || "Others";
          if (!categoryMap[cat]) categoryMap[cat] = [];
          categoryMap[cat].push(item);
        });

        setGrouped(categoryMap);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        setVisibleCount((prev) => prev + BATCH_SIZE);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const uniqueCategories = ["All", ...Object.keys(grouped)];
  const filtered =
    selectedCategory === "All"
      ? Object.values(grouped).flat()
      : grouped[selectedCategory] || [];

  const searchFiltered = query
    ? filtered.filter((item) =>
        item.Name?.toLowerCase().includes(query)
      )
    : filtered;

  const visibleProducts = searchFiltered.slice(0, visibleCount);

  return (
    <div className="bg-dark text-white min-h-screen p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary">Product Catalog</h1>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-6">
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full font-medium transition-all border ${
              selectedCategory === cat
                ? "bg-primary text-black border-primary"
                : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
            }`}
            onClick={() => {
              setSelectedCategory(cat);
              setVisibleCount(BATCH_SIZE);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loader or Product Grid */}
      {loading ? (
        <Loader />
      ) : visibleProducts.length === 0 ? (
        <p className="text-center text-gray-400">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.ID} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
