import React from "react";
import CaseCard from "../components/CaseCard";

function AdminDashboard() {
  const cases = [
    { id: 1, title: "Flood Relief", status: "Pending", assignedTo: "Agent-01" },
    { id: 2, title: "Earthquake Aid", status: "In Progress", assignedTo: "Agent-02" },
  ];

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <div className="case-list">
        {cases.map((c) => (
          <CaseCard key={c.id} data={c} />
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
