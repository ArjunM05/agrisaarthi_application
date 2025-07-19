// pages/ProfilePage.tsx
import ProfileSection from "../Components/ProfileSection";
import HomeHeader from "../Components/HomeHeader";
import HomeFooter from "../Components/HomeFooter";
import SupplierHeader from "../Components/SupplierHeader";

const ProfilePage = () => {
  const role = localStorage.getItem("user_type");

  return (
    <>
      <div className="min-vh-100 d-flex flex-column">
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
