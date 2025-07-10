// src/components/SupplierCard.tsx
import React from "react";

interface SupplierCardProps {
  supplierName: string;
  distance: number;
  price: number;
  phone: string;
}

const SupplierCard: React.FC<SupplierCardProps> = ({
  supplierName,
  distance,
  price,
  phone,
}) => (
  <div className="col-md-4">
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{supplierName}</h5>
        <p className="card-text">
          Distance: {distance} km
          <br />
          Price: ₹{price}
        </p>
        <a href={`tel:${phone}`} className="btn btn-outline-success btn-sm">
          📞 Call Supplier
        </a>
      </div>
    </div>
  </div>
);

export default SupplierCard;
