import React from "react";

import ContactPageContent from "../Components/ContactPageContent";
import HomeHeader from "../Components/HomeHeader";
import HomeFooter from "../Components/HomeFooter";
import SupplierHeader from "../Components/SupplierHeader";

const ContactUsPage: React.FC = () => {
  const role = localStorage.getItem("user_type");
  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg, #f6f2ed 0%, #e8f5e8 100%)",
      }}
    >
      {role === "supplier" ? <SupplierHeader /> : <HomeHeader />}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center mt-5">
        <ContactPageContent />
      </div>
      <HomeFooter />
    </div>
  );
};

export default ContactUsPage;
