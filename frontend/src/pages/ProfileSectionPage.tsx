// pages/ProfilePage.tsx
import { useEffect, useState } from "react";
import ProfileSection from "../Components/ProfileSection";
import HomeHeader from "../Components/HomeHeader";
import HomeFooter from "../Components/HomeFooter";

const ProfilePage = () => {
  const [user, setUser] = useState({ email: "", role: "", name: "" });
  const [additionalInfo, setAdditionalInfo] = useState({
    address: "",
    phone: "",
    landSize: "",
  });

  useEffect(() => {
    // Simulated fetch – replace with Supabase query
    const email = localStorage.getItem("user_email") || "";
    const role = localStorage.getItem("user_type") || "";
    setUser({ email, role, name: "John Doe" }); // Replace with actual data

    // Dummy additional info (can be empty)
    setAdditionalInfo({
      address: "",
      phone: "",
      landSize: role === "farmer" ? "2 acres" : "",
    });
  }, []);

  return (
    <>
      <HomeHeader />
      <div className="container pt-4">
        <ProfileSection user={user} additionalInfo={additionalInfo} />
        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-danger">Delete Account</button>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default ProfilePage;
