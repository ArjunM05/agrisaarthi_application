import { useState, useEffect, useRef } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const districts = [
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kancheepuram",
  "Kanniyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Mayiladuthurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",
];

// Fuzzy search helper (Levenshtein distance)
function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] =
          1 +
          Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]);
      }
    }
  }
  return matrix[a.length][b.length];
}

function getFilteredDistricts(input: string) {
  if (!input) return districts;
  // Fuzzy match: sort by Levenshtein distance, then filter those with distance <= 3 or substring match
  const matches = districts
    .map((district) => ({
      name: district,
      dist: levenshtein(input, district),
      substr: district.toLowerCase().includes(input.toLowerCase()),
    }))
    .sort((a, b) => a.dist - b.dist || (b.substr ? -1 : 1));
  // Show substring matches and plausible fuzzy matches
  return matches
    .filter((d) => d.substr || d.dist <= 3)
    .map((d) => d.name)
    .slice(0, 8); // Limit to 8 suggestions
}

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
    password: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "",
    description: "",
    variant: "success",
  });
  const navigate = useNavigate();
  const [districtInput, setDistrictInput] = useState("");
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [districtOptions, setDistrictOptions] = useState(districts);
  const districtInputRef = useRef<HTMLInputElement>(null);
  const districtDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDistrictOptions(getFilteredDistricts(districtInput));
  }, [districtInput]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        districtDropdownRef.current &&
        !districtDropdownRef.current.contains(event.target as Node) &&
        districtInputRef.current &&
        !districtInputRef.current.contains(event.target as Node)
      ) {
        setDistrictDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (
    title: string,
    description: string,
    variant: "success" | "danger" = "success"
  ) => {
    setToastMessage({ title, description, variant });
    setToastShow(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.district ||
      !formData.password ||
      !formData.role
    ) {
      showToast(
        "Incomplete Form",
        "Please fill in all required fields",
        "danger"
      );
      return;
    }

    if (formData.phone.length < 10) {
      showToast(
        "Invalid Phone Number",
        "Please enter a valid 10-digit phone number",
        "danger"
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
          district: formData.district,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        showToast(
          "Registration Successful",
          data.message ||
            "Welcome to AgroSaarthi! Your account has been created. Please login.",
          "success"
        );
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showToast(
          "Registration Failed",
          data.error || "An error occurred during registration.",
          "danger"
        );
      }
    } catch (error: any) {
      showToast(
        "Connection Error",
        error.message || "Unable to connect to server. Please try again later.",
        "danger"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <>
      <div
        className="card shadow-lg"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="h3 fw-bold text-dark mb-0">REGISTRATION</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="name"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                NAME*
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                EMAIL*
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-4 position-relative">
              <label
                htmlFor="password"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                PASSWORD*
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter your password"
                className="form-control"
                required
              />
              <span
                className="position-absolute top-50 end-0 me-3"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="mb-3">
              <label
                htmlFor="phone"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                PHONE NUMBER*
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3 position-relative">
              <label
                htmlFor="district"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                DISTRICT*
              </label>
              <input
                id="district"
                type="text"
                value={districtInput}
                ref={districtInputRef}
                onFocus={() => setDistrictDropdownOpen(true)}
                onChange={(e) => {
                  setDistrictInput(e.target.value);
                  handleInputChange("district", e.target.value);
                  setDistrictDropdownOpen(true);
                }}
                className="form-select"
                autoComplete="off"
                placeholder="Select District"
                required
              />
              {districtDropdownOpen && districtOptions.length > 0 && (
                <div
                  ref={districtDropdownRef}
                  style={{
                    position: "absolute",
                    zIndex: 1000,
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    maxHeight: 180,
                    overflowY: "auto",
                    width: "100%",
                  }}
                >
                  {districtOptions.map((option) => (
                    <div
                      key={option}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        background:
                          formData.district === option ? "#e9ecef" : "#fff",
                      }}
                      onMouseDown={() => {
                        setDistrictInput(option);
                        handleInputChange("district", option);
                        setDistrictDropdownOpen(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label text-uppercase fw-medium text-muted small">
                ROLE*
              </label>
              <div className="d-flex justify-content-center gap-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="role"
                    id="role-farmer"
                    value="farmer"
                    checked={formData.role === "farmer"}
                    onChange={() => handleInputChange("role", "farmer")}
                    required
                  />
                  <label className="form-check-label" htmlFor="role-farmer">
                    Farmer
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="role"
                    id="role-supplier"
                    value="supplier"
                    checked={formData.role === "supplier"}
                    onChange={() => handleInputChange("role", "supplier")}
                  />
                  <label className="form-check-label" htmlFor="role-supplier">
                    Supplier
                  </label>
                </div>
              </div>
            </div>

            <div className="row justify-content-md-center">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-success btn-lg w-100 rounded-pill fw-medium mb-2"
              >
                {isLoading ? "Registering..." : "REGISTER"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg w-50 col-3 rounded-pill"
                onClick={() => handleBack()}
              >
                Go Back
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toastShow}
          onClose={() => setToastShow(false)}
          delay={3000}
          autohide
          bg={toastMessage.variant}
        >
          <Toast.Header>
            <strong className="me-auto">{toastMessage.title}</strong>
          </Toast.Header>
          <Toast.Body
            className={toastMessage.variant === "danger" ? "text-white" : ""}
          >
            {toastMessage.description}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Registration;
