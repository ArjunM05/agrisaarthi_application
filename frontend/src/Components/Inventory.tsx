// src/components/SupplierInventory.tsx
import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Card,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import supabase from "../utils/supabase";
import ChatBot from "./ChatBot";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<PesticideOption | null>(
    null
  );
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingInventory, setFetchingInventory] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  // Get user info from localStorage
  const userName = localStorage.getItem("user_name") || "";
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchPesticides = async () => {
      const { data, error } = await supabase
        .from("pesticides")
        .select("pest, pesticide");
      if (data) setAllOptions(data);
      else console.error(error);
    };
    fetchPesticides();
  }, []);

  // Fetch existing inventory from backend
  useEffect(() => {
    if (userId && userId !== "undefined" && userId !== "null") {
      fetchInventory();
    }
  }, [userId]);

  const fetchInventory = async () => {
    setFetchingInventory(true);
    try {
      const response = await fetch(
        `http://localhost:5001/supplier_inventory/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.inventory && Array.isArray(data.inventory)) {
          // Transform backend data to match frontend interface
          const transformedInventory = data.inventory.map((item: any) => ({
            pesticide: item.pesticide || "Unknown",
            pest: item.pest || "Unknown",
            price: item.price || 0,
            stock: item.stock || 0,
          }));
          setInventory(transformedInventory);
        } else {
          setInventory([]);
        }
      } else {
        console.error("Failed to fetch inventory");
        setInventory([]);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventory([]);
    } finally {
      setFetchingInventory(false);
    }
  };

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

  const handleSave = async () => {
    if (!selectedOption || price <= 0 || stock <= 0) {
      showToast(
        "Please enter valid price and stock (both must be greater than 0)",
        "danger"
      );
      return;
    }

    if (!userId || userId === "undefined" || userId === "null") {
      showToast("User not logged in", "danger");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/update_inventory/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price: price,
            stock: stock,
            pesticide: selectedOption.pesticide,
            name: userName,
          }),
        }
      );

      if (response.ok) {
        // Refresh inventory from backend
        await fetchInventory();
        setShowModal(false);
        setSearchTerm("");
        setFilteredOptions([]);
        setPrice(0);
        setStock(0);
        showToast("Inventory updated successfully!", "success");
      } else {
        const errorData = await response.json();
        showToast(`Failed to update inventory: ${errorData.error}`, "danger");
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      showToast("Failed to update inventory. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pesticide: string) => {
    if (!userId || userId === "undefined" || userId === "null") {
      showToast("User not logged in", "danger");
      return;
    }

    setItemToDelete(pesticide);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Set stock to 0 to effectively "delete" the item
      const response = await fetch(
        `http://localhost:5001/update_inventory/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price: 0,
            stock: 0,
            pesticide: itemToDelete,
            name: userName,
          }),
        }
      );

      if (response.ok) {
        await fetchInventory();
        showToast("Item removed from inventory!", "success");
      } else {
        const errorData = await response.json();
        showToast(`Failed to remove item: ${errorData.error}`, "danger");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      showToast("Failed to remove item. Please try again.", "danger");
    } finally {
      setShowDeleteModal(false);
      setItemToDelete("");
    }
  };

  // Toast helper
  const showToast = (
    message: string,
    variant: "success" | "danger" | "info" = "success"
  ) => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
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
      {fetchingInventory ? (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading inventory...</p>
        </div>
      ) : (
        <div className="row">
          {inventory.length === 0 ? (
            <div className="col-12 text-center my-4">
              <p className="text-muted">
                No inventory items found. Add your first item by searching
                above.
              </p>
            </div>
          ) : (
            inventory
              .filter((item) => item.stock > 0)
              .map((item, i) => (
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
                        onClick={() => handleDelete(item.pesticide)}
                      >
                        Delete
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))
          )}
        </div>
      )}

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
          <Button variant="success" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete <strong>{itemToDelete}</strong> from
            inventory?
          </p>
          <p className="text-muted">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Toast */}
      <ToastContainer
        className="p-3"
        position="top-center"
        style={{ zIndex: 9999 }}
      >
        <Toast
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          show={toast.show}
          bg={toast.variant}
          autohide
          delay={3000}
        >
          <Toast.Body className="text-center text-white">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <ChatBot />
    </div>
  );
};

export default SupplierInventory;
