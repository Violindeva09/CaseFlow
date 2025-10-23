import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [role, setRole] = useState("citizen");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (role === "admin") navigate("/admin");
    else if (role === "agent") navigate("/agent");
    else navigate("/citizen");
  };

  return (
    <div className="signin-container">
      <h2>Welcome to CaseFlow</h2>
      <p>Select your role to continue:</p>

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="admin">Admin</option>
        <option value="agent">Agent</option>
        <option value="citizen">Citizen</option>
      </select>

      <button onClick={handleLogin}>Sign In</button>
    </div>
  );
}

export default SignIn;
