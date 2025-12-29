import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");

    if (token) {
      localStorage.setItem("token", token);
      if (username) localStorage.setItem("username", username);
      navigate("/", { replace: true }); // prevent going back
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h3>Logging you in with Google...</h3>
    </div>
  );
};

export default OAuthSuccess;
