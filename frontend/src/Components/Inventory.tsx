// src/components/SupplierInventory.tsx
import { useEffect, useState } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";
import { supabase } from "../utils/supabase";

interface PesticideOption {
  pest: string;
  pesticide: string;
}

interface InventoryItem extends PesticideOption {
  price: number;
  stock: number;
}

const SupplierInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allOptions, setAllOptions] = useState<PesticideOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<PesticideOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PesticideOption | null>(
    null
  );
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const fetchPesticides = async () => {
      const { data, error } = await supabase
        .from("Pesticides")
        .select("pest, pesticide");
      if (data) setAllOptions(data);
      else console.error(error);
    };
    fetchPesticides();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions([]);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setFilteredOptions(
      allOptions.filter(
        (opt) =>
          opt.pesticide.toLowerCase().includes(lower) ||
          opt.pest.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, allOptions]);

  const handleOptionClick = (opt: PesticideOption) => {
    setSelectedOption(opt);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!selectedOption || price <= 0 || stock <= 0) {
      alert("Please enter valid price and stock (both must be greater than 0)");
      return;
    }
    const newItem: InventoryItem = {
      ...selectedOption,
      price,
      stock,
    };

    const existingIndex = inventory.findIndex(
      (item) =>
        item.pesticide === selectedOption.pesticide &&
        item.pest === selectedOption.pest
    );

    let updatedInventory = [...inventory];

    if (existingIndex !== -1) {
      updatedInventory[existingIndex] = newItem;
    } else {
      updatedInventory = [newItem, ...inventory]; // Add new card to the left
    }

    setInventory(updatedInventory);
    setShowModal(false);
    setSearchTerm("");
    setFilteredOptions([]);
    setPrice(0);
    setStock(0);
  };

  return (
    <div className="container my-4">
      <h4 className="mb-3">Manage Inventory</h4>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Search pesticide or pest..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredOptions.length > 0 && (
        <ul className="list-group mb-3">
          {filteredOptions.map((opt, i) => (
            <li
              key={i}
              className="list-group-item list-group-item-action"
              onClick={() => handleOptionClick(opt)}
              style={{ cursor: "pointer" }}
            >
              {opt.pesticide} ({opt.pest})
            </li>
          ))}
        </ul>
      )}

      {/* Inventory List */}
      <div className="row">
        {inventory.map((item, i) => (
          <div className="col-md-4 mb-3" key={i}>
            <Card className="p-3 shadow-sm">
              <Card.Title>{item.pesticide}</Card.Title>
              <Card.Body>
                <p>
                  <strong>Pest:</strong> {item.pest}
                </p>
                <p>
                  <strong>Price:</strong> Rs. {item.price}
                </p>
                <p>
                  <strong>Stock:</strong> {item.stock} units
                </p>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => {
                    setSelectedOption({
                      pest: item.pest,
                      pesticide: item.pesticide,
                    });
                    setPrice(item.price);
                    setStock(item.stock);
                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  className="ms-2"
                  onClick={() => {
                    const updatedInventory = inventory.filter(
                      (inv, idx) => idx !== i
                    );
                    setInventory(updatedInventory);
                  }}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Inventory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Pesticide</Form.Label>
              <Form.Control
                type="text"
                value={selectedOption?.pesticide}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pest</Form.Label>
              <Form.Control type="text" value={selectedOption?.pest} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price (Rs.)</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock Available</Form.Label>
              <Form.Control
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SupplierInventory;
