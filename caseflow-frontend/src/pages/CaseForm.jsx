import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CaseForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Case reported successfully!");
    navigate("/citizen");
  };

  return (
    <div className="form-container">
      <h2>Report a New Case</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Case Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Case Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <button type="submit">Submit Case</button>
      </form>
    </div>
  );
}

export default CaseForm;
