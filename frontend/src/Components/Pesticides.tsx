// src/Components/Pesticides.tsx

import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import supabase from "../utils/supabase";
import ChatBot from "./ChatBot";

type PesticideOption = {
  pest: string;
  pesticide: string;
};

interface Supplier {
  supplier_id: number;
  supplier_name: string;
  shop_name: string;
  address: string;
  price: number;
  stock: number;
}

const Pesticides: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allOptions, setAllOptions] = useState<PesticideOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<PesticideOption[]>([]);
  const [selected, setSelected] = useState<PesticideOption | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("pesticides")
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

  const fetchSuppliersForPesticide = async (pesticideName: string) => {
    setLoadingSuppliers(true);
    try {
      const response = await fetch("https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/supplier_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pesticide_name: pesticideName,
        }),
      });

      const data = await response.json();
      if (data.suppliers && data.suppliers.length > 0) {
        // Filter suppliers with stock > 0
        const availableSuppliers = data.suppliers.filter(
          (supplier: any) => supplier.stock > 0
        );
        setSuppliers(availableSuppliers);
      } else {
        setSuppliers([]);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setSuppliers([]);
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const handleSelect = (opt: PesticideOption) => {
    setSelected(opt);
    setSearchTerm(`${opt.pesticide} (${opt.pest})`);
    setFilteredOptions([]);
    setIsDropdownOpen(false);
    // Fetch suppliers for the selected pesticide
    fetchSuppliersForPesticide(opt.pesticide);
  };

  const handleRedirect = () => {
    window.location.href = "/farmer/pest-identification";
  };

  const handleCallSupplier = async (supplierId: number, pesticide: string) => {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        alert("Please login to contact suppliers");
        return;
      }

      const response = await fetch("https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/call_supplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplier_id: supplierId,
          farmer_id: user_id,
          pesticide: pesticide,
        }),
      });

      const data = await response.json();
      if (data.supplier_phone) {
        window.open(`tel:${data.supplier_phone}`, "_blank");
      } else {
        alert("Could not get supplier phone number");
      }
    } catch (error) {
      console.error("Error calling supplier:", error);
      alert("Error contacting supplier");
    }
  };

  const handleSupplierClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowModal(true);
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Search Pesticides</h3>

      <div ref={dropdownRef} className="position-relative">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Search by pest or pesticide..."
          autoComplete="off"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelected(null);
            setSuppliers([]);
            setIsDropdownOpen(true);
          }}
          onFocus={() => {
            if (filteredOptions.length > 0) {
              setIsDropdownOpen(true);
            }
          }}
        />

        {isDropdownOpen && filteredOptions.length > 0 && (
          <ul
            className="list-group position-absolute w-100 dropdown-menu"
            style={{
              zIndex: 1000,
              maxHeight: "40vh",
              overflowY: "auto",
            }}
          >
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
      </div>

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
          <h4 className="mt-4">Available Suppliers</h4>
          {loadingSuppliers ? (
            <div className="text-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Finding suppliers...</p>
            </div>
          ) : suppliers.length > 0 ? (
            <div className="row mt-2">
              {suppliers.map((supplier, idx) => (
                <div className="col-md-6 col-lg-4 mb-3" key={idx}>
                  <div
                    className="card shadow-sm h-100"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSupplierClick(supplier)}
                  >
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{supplier.shop_name}</h5>
                      <p className="card-text">
                        <strong>Supplier:</strong> {supplier.supplier_name}
                        <br />
                        <strong>Address:</strong>{" "}
                        {supplier.address || "Address not available"}
                      </p>
                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <div>
                          <strong className="text-success">
                            ₹{supplier.price}/litre
                          </strong>
                          <br />
                          <small className="text-muted">
                            Stock: {supplier.stock} units
                          </small>
                        </div>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallSupplier(
                              supplier.supplier_id,
                              selected.pesticide
                            );
                          }}
                        >
                          📞 Call Supplier
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              No suppliers found with stock for this pesticide in your area.
            </div>
          )}
        </>
      )}

      {/* Supplier Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Supplier Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSupplier && selected ? (
            <div>
              <h5>{selectedSupplier.shop_name}</h5>
              <p>
                <strong>Supplier:</strong> {selectedSupplier.supplier_name}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {selectedSupplier.address || "Address not available"}
              </p>
              <p>
                <strong>Pesticide:</strong> {selected.pesticide}
              </p>
              <p>
                <strong>Price:</strong> ₹{selectedSupplier.price}/litre
              </p>
              <p>
                <strong>Stock:</strong> {selectedSupplier.stock} units
              </p>
            </div>
          ) : (
            <p>Loading supplier details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => {
              if (selectedSupplier && selected) {
                handleCallSupplier(
                  selectedSupplier.supplier_id,
                  selected.pesticide
                );
              }
              setShowModal(false);
            }}
          >
            📞 Call Supplier
          </Button>
        </Modal.Footer>
      </Modal>
      <ChatBot />
    </div>
  );
};

export default Pesticides;
