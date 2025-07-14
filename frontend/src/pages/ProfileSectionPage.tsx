// pages/ProfilePage.tsx
import { useEffect, useState } from "react";
import ProfileSection from "../Components/ProfileSection";
import HomeHeader from "../Components/HomeHeader";
import HomeFooter from "../Components/HomeFooter";
import SupplierHeader from "../Components/SupplierHeader";

const ProfilePage = () => {
  const email = localStorage.getItem("user_email");
  const role = localStorage.getItem("user_type");

  return (
    <>
      

      <div
        className="min-vh-100 d-flex flex-column"
        style={{
          background: "linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)",
        }}
      >
        {role === "supplier" ? <SupplierHeader /> : <HomeHeader />}
        <div className="container pt-4">
          <ProfileSection />
        </div>
        <HomeFooter />
      </div>
    </>
  );
};

export default ProfilePage;
