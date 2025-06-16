// components/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-black border-gray-300"></div>
    </div>
  );
};

export default Loader;
