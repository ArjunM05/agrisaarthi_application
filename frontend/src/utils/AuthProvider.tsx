import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "./supabase";

const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAndSetUser = async (sessionUser: any) => {
    try {
      if (!sessionUser?.id) {
        console.warn("⚠️ fetchAndSetUser: Invalid sessionUser:", sessionUser);
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Fetch from public.users
      const { data: userRow, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", sessionUser.id)
        .single();

      if (userError || !userRow) {
        console.error("❌ User fetch failed:", userError);
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Fetch from farmer_details
      const { data: farmerData, error: farmerError } = await supabase
        .from("farmer_details")
        .select("*")
        .eq("farmer_id", sessionUser.id)
        .single();

      if (farmerError && farmerError.code !== "PGRST116") {
        console.error("❌ Farmer fetch failed:", farmerError);
      }

      // Fetch pest detection history
      const { data: pestResults, error: pestError } = await supabase
        .from("pest_inference_results")
        .select("*")
        .eq("user_id", sessionUser.id)
        .order("prediction_time", { ascending: false });

      if (pestError) {
        console.error("❌ Error fetching pest results:", pestError);
      }

      const pests =
        pestResults?.map((result) => ({
          id: result.id,
          name: result.pest_name,
          date: new Date(result.prediction_time).toLocaleDateString(),
          image: { uri: result.image_url },
          successful: result.successful ?? true,
        })) || [];

      const pesticideStats = {
        total: pests.length,
        ordered: 0,
        saved: 0,
        successRate:
          pests.length > 0
            ? `${Math.round(
                (pests.filter((p) => p.successful).length / pests.length) * 100
              )}%`
            : "0%",
      };

      const userData = {
        id: sessionUser.id,
        name: userRow.name,
        phone: userRow.phone,
        address: userRow.address,
        district: userRow.district,
        avatar_url: userRow.avatar_url,
        email: userRow.email,
        role: userRow.role,
        hasOnboarded: userRow.has_onboarded,
        landDetails: farmerData || {
          farmSize: "",
          soilType: "",
          irrigationType: "",
          mainCrop: "",
        },
        pests,
        pesticideStats,
      };

      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("❌ fetchAndSetUser unexpected error:", err);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchAndSetUser(session.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await fetchAndSetUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) await fetchAndSetUser(data.user);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedFields: any) => {
    setUser((prev: any) => ({ ...prev, ...updatedFields }));
  };

  const markOnboardingComplete = async () => {
    if (!user?.id) return;
    const { error } = await supabase
      .from("users")
      .update({ has_onboarded: true })
      .eq("id", user.id);
    if (error) {
      console.error("Failed to update onboarding status:", error);
      return;
    }
    await fetchAndSetUser({ id: user.id });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateUser,
        fetchAndSetUser,
        markOnboardingComplete,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
