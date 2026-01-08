import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authStorage } from "../utils/storage";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");
    const redirect = params.get("redirect") || "/";

    if (!token) {
      authStorage.clear();
      navigate("/login", { replace: true });
      return;
    }

    authStorage.set({ token, username: username || "" });
    navigate(redirect, { replace: true });
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h3>Logging you in with Google...</h3>
    </div>
  );
};

export default OAuthSuccess;
