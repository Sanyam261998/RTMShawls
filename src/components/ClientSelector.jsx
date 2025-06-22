import React, { useState, useRef, useEffect } from "react";

function ClientSelector({ clients = [], selectedClient, setSelectedClient }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  const filteredClients = clients.filter(client =>
    client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (client) => {
    setSelectedClient(client);
    setSearchQuery(client);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative mb-4">
      <label className="block mb-1 font-semibold text-primary">Order for Client:</label>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search client..."
        className="w-full p-2 border bg-black text-primary rounded"
      />
      {showDropdown && (
        <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto border border-gray-700 bg-black text-primary rounded shadow-lg">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <div
                key={client}
                className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelect(client)}
              >
                {client}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">No clients found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClientSelector;
