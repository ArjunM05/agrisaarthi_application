import { useEffect, useState } from "react";
import { Card, Modal, Button, Container, Row, Col } from "react-bootstrap";
import { FaPhone } from "react-icons/fa";
import HomeHeader from "../Components/HomeHeader";
import HomeFooter from "../Components/HomeFooter";

const SupplierHistoryPage = () => {
  const user_id = localStorage.getItem("user_id");
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [supplierDetails, setSupplierDetails] = useState<any>(null);

  useEffect(() => {
    if (user_id) {
      fetch(`http://localhost:5001/last_contacted_suppliers/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.contacts && data.contacts.length > 0) {
            setSuppliers(data.contacts);
          }
        })
        .catch((error) => {
          console.error("Error fetching suppliers:", error);
        });
    }
  }, [user_id]);

  const handleSupplierClick = async (supplier: any) => {
    setSelectedSupplier(supplier);

    // Fetch supplier details
    try {
      const response = await fetch("http://localhost:5001/supplier_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pesticide_name: supplier.pesticide,
        }),
      });

      const data = await response.json();
      if (data.suppliers && data.suppliers.length > 0) {
        // Find the specific supplier
        const supplierDetail = data.suppliers.find(
          (s: any) => s.supplier_id === supplier.supplier_id
        );
        if (supplierDetail) {
          setSupplierDetails(supplierDetail);
        }
      }
    } catch (error) {
      console.error("Error fetching supplier details:", error);
    }

    setShowModal(true);
  };

  const handleCallSupplier = async (supplierId: number) => {
    try {
      const response = await fetch("http://localhost:5001/call_supplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplier_id: supplierId,
        }),
      });

      const data = await response.json();
      if (data.supplier_phone) {
        window.open(`tel:${data.supplier_phone}`, "_blank");
      }
    } catch (error) {
      console.error("Error getting supplier phone:", error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <HomeHeader />
      <div className="flex-grow-1" style={{ marginTop: "100px" }}>
        <Container>
          <h3 className="mb-4">Supplier Contact History</h3>

          {suppliers.length > 0 ? (
            <Row>
              {suppliers.map((supplier, index) => (
                <Col key={index} md={6} lg={4} className="mb-4">
                  <Card
                    className="h-100 shadow-sm"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSupplierClick(supplier)}
                  >
                    <Card.Body>
                      <Card.Title>{supplier.supplier_name}</Card.Title>
                      <Card.Text>
                        <strong>Pesticide:</strong> {supplier.pesticide}
                        <br />
                        <strong>Contact Time:</strong> {supplier.contact_time}
                      </Card.Text>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCallSupplier(supplier.supplier_id);
                        }}
                      >
                        <FaPhone className="me-1" /> Call Supplier
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="text-center p-5">
              <Card.Body>
                <h5 className="text-muted">No supplier contacts found</h5>
                <p className="text-muted">
                  You haven't contacted any suppliers yet.
                </p>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>

      {/* Supplier Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Supplier Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSupplier && supplierDetails ? (
            <div>
              <h5>{selectedSupplier.supplier_name}</h5>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Pesticide:</strong> {selectedSupplier.pesticide}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{supplierDetails.price}
                  </p>
                  <p>
                    <strong>Stock:</strong> {supplierDetails.stock} units
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Address:</strong>{" "}
                    {supplierDetails.address || "Address not available"}
                  </p>
                  <p>
                    <strong>Contact Time:</strong>{" "}
                    {selectedSupplier.contact_time}
                  </p>
                </Col>
              </Row>
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
              if (selectedSupplier) {
                handleCallSupplier(selectedSupplier.supplier_id);
              }
              setShowModal(false);
            }}
          >
            <FaPhone className="me-1" /> Call Supplier
          </Button>
        </Modal.Footer>
      </Modal>

      <HomeFooter />
    </div>
  );
};

export default SupplierHistoryPage;
