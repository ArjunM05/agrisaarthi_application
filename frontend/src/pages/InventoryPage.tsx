// src/pages/InventoryPage.tsx
import SupplierHeader from "../Components/SupplierHeader";
import HomeFooter from "../Components/HomeFooter";
import Inventory from "../Components/Inventory";

const InventoryPage = () => {
  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg, #f6f2ed 0%, #e8f5e8 100%)",
      }}
    >
      <SupplierHeader />
      <div className="container flex-grow-1 py-4">
        <Inventory />
      </div>
      <HomeFooter />
    </div>
  );
};

export default InventoryPage;
