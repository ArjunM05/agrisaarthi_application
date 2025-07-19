import { useEffect, useState } from "react";
import { Card, Modal, Container, Row, Col } from "react-bootstrap";
import HomeHeader from "../Components/HomeHeader";
import HomeFooter from "../Components/HomeFooter";

const PestHistoryPage = () => {
  const user_id = localStorage.getItem("user_id");
  const [pestHistory, setPestHistory] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedPest, setSelectedPest] = useState<any>(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (user_id) {
      fetch(`https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/pest_history/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.history) {
            setPestHistory(data.history);
          }
        })
        .catch((error) => {
          console.error("Error fetching pest history:", error);
        });
      fetch(`https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/last_contacted_suppliers/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.contacts && data.contacts.length > 0) {
            setSuppliers(data.contacts);
          }
        })
        .catch((error) => {
          console.error("Error fetching suppliers:", error);
        })
        .finally(() => setTimeout(() => setLoading(false), 1));
    } else {
      setLoading(false);
    }
  }, [user_id]);

  const handlePestClick = (pestItem: any) => {
    setSelectedPest(pestItem);
    // Find all suppliers matching any pesticide in pestItem.pesticide (comma separated)
    const pesticides = (pestItem.pesticide || "")
      .split(",")
      .map((p: string) => p.trim());
    const matchingSuppliers = suppliers.filter((s) =>
      pesticides.includes(s.pesticide)
    );
    setSelectedSuppliers(matchingSuppliers);
    setShowModal(true);
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg, #f6f2ed 0%, #e8f5e8 100%)",
      }}
    >
      <HomeHeader />
      {loading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="flex-grow-1">
          <Container className="mt-4">
            <h3 className="mb-4">Pest Detection History</h3>
            {pestHistory.length > 0 ? (
              <Row>
                {pestHistory.map((item, index) => (
                  <Col key={index} md={6} lg={4} className="mb-4">
                    <Card
                      className="h-100 shadow-sm pest-history-image-container border rounded"
                      style={{ cursor: "pointer", overflow: "hidden" }}
                      onClick={() => handlePestClick(item)}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "160px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={item.img_url}
                          alt={`Pest ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "160px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                        <div
                          className="position-absolute bottom-0 start-0 w-100 text-white bg-dark bg-opacity-50 px-2 py-1"
                          style={{
                            fontSize: "1em",
                            borderBottomLeftRadius: "6px",
                            borderBottomRightRadius: "6px",
                          }}
                        >
                          {item.pest_name}
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="text-center p-5">
                <Card.Body>
                  <h5 className="text-muted">No pest detections found</h5>
                  <p className="text-muted">
                    You haven't uploaded any pest images yet.
                  </p>
                </Card.Body>
              </Card>
            )}
          </Container>
        </div>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pest Identification Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPest && (
            <>
              <h4 className="mb-3">Pest: {selectedPest.pest_name}</h4>
              <h5 className="mb-4">
                Pesticide(s): {selectedPest.pesticide || "-"}
              </h5>
              <p className="mb-3">
                <b>Suppliers Contacted for this Pesticide:</b>
              </p>
              {selectedSuppliers.length > 0 ? (
                selectedSuppliers.map((supplier) => (
                  <div className="card p-3 mb-3" key={supplier.supplier_id}>
                    <h6>Supplier Details</h6>
                    <p>
                      <strong>Shop Name:</strong> {supplier.shop_name}
                      <br />
                      <strong>Supplier Name:</strong> {supplier.supplier_name}
                      <br />
                      <strong>Contacted On:</strong>{" "}
                      {supplier.contact_time?.slice(0, 10)}
                    </p>
                    <button
                      className="btn btn-outline-success fw-medium"
                      onClick={() =>
                        window.open(
                          `tel:${supplier.supplier_phone || ""}`,
                          "_blank"
                        )
                      }
                    >
                      📞 Call Supplier
                    </button>
                  </div>
                ))
              ) : (
                <p>No supplier contact found for this pesticide.</p>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
      <HomeFooter />
    </div>
  );
};

export default PestHistoryPage;
