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
      {role === "supplier" ? <SupplierHeader /> : <HomeHeader />}

      <div className="container pt-4">
        <ProfileSection />
      </div>
      <HomeFooter />
    </>
  );
};

export default ProfilePage;
