import React from "react";
import CaseCard from "../components/CaseCard";

function AgentDashboard() {
  const assignedCases = [
    { id: 3, title: "Bridge Collapse", status: "In Progress", assignedTo: "You" },
  ];

  return (
    <div className="dashboard">
      <h2>Agent Dashboard</h2>
      <div className="case-list">
        {assignedCases.map((c) => (
          <CaseCard key={c.id} data={c} />
        ))}
      </div>
    </div>
  );
}

export default AgentDashboard;
