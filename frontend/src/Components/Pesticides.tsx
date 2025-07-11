// src/Components/Pesticides.tsx

import React, { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import SupplierCard from "./SupplierCard";

type PesticideOption = {
  pest: string;
  pesticide: string;
};

const Pesticides: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allOptions, setAllOptions] = useState<PesticideOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<PesticideOption[]>([]);
  const [selected, setSelected] = useState<PesticideOption | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("Pesticides")
        .select("pest, pesticide");
      if (error) console.error("Error fetching pesticides:", error.message);
      else setAllOptions(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions([]);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const results = allOptions.filter(
      (opt) =>
        opt.pesticide.toLowerCase().includes(lower) ||
        opt.pest.toLowerCase().includes(lower)
    );
    setFilteredOptions(results);
  }, [searchTerm, allOptions]);

  const handleSelect = (opt: PesticideOption) => {
    setSelected(opt);
    setSearchTerm(`${opt.pesticide} (${opt.pest})`);
    setFilteredOptions([]);
  };

  const handleRedirect = () => {
    window.location.href = "/farmer/pest-identification";
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Search Pesticides</h3>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Search by pest or pesticide..."
        autoComplete="off"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setSelected(null);
        }}
      />

      {filteredOptions.length > 0 && (
        <ul className="list-group mb-3">
          {filteredOptions.map((opt, idx) => (
            <li
              key={idx}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(opt)}
              style={{ cursor: "pointer" }}
            >
              {opt.pesticide} ({opt.pest})
            </li>
          ))}
        </ul>
      )}

      {searchTerm && filteredOptions.length === 0 && !selected && (
        <div className="alert alert-warning">
          No matches found.
          <button
            className="btn btn-sm btn-outline-primary ms-2"
            onClick={handleRedirect}
          >
            Identify pest through an image?
          </button>
        </div>
      )}

      {selected && (
        <>
          <h4 className="mt-4">Nearby Suppliers</h4>
          <div className="row mt-2">
            {[1, 2, 3].map((_, i) => (
              <SupplierCard
                key={i}
                supplierName={`Supplier ${i + 1}`}
                distance={Math.floor(Math.random() * 10 + 1)}
                price={Math.floor(Math.random() * 500 + 100)}
                phone="+1234567890"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Pesticides;
