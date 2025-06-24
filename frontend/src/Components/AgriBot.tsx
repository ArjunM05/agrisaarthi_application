import { useState } from "react";

const AgriBot = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    setResponse(
      "Agriculture encompasses crop and livestock production, aquaculture, and forestry for food and non-food products. Agriculture was a key factor in the rise of sedentary human civilization, whereby farming of domesticated species created food surpluses that enabled people to live in the cities. While humans started gathering grains at least 105,000 years ago, nascent farmers only began planting them around 11,500 years ago. Sheep, goats, pigs, and cattle were domesticated around 10,000 years ago. Plants were independently cultivated in at least 11 regions of the world. In the 20th century, industrial agriculture based on large-scale monocultures came to dominate agricultural output."
    );
    setQuery("");
  };

  return (
    <div className="container my-4">
      <div className="mb-3">
        <h3>Hi there! How can I assist you with your farming needs today?</h3>

        <div className="mb-4">
          {/* <label
              htmlFor="phone"
              className="form-label text-uppercase fw-medium text-muted small"
            >
              PHONE NUMBER
            </label> */}
          <form onSubmit={handleSubmit}>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter any query.."
              rows={3}
              className="form-control form-control-lg"
            />
            <div className="row justify-content-md-center">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-success rounded-pill fw-medium col-3"
              >
                {isLoading ? "Asking...." : "ASK AGRIBOT"}
              </button>
            </div>
          </form>
          <div className="mb-3">
            <span className="badge bg-secondary mb-1">RESPONSE:</span>
            <div className="bg-dark text-white p-3 rounded">
              <p className="mb-0">{response || "No response yet."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriBot;
