import React from "react";
import { Link } from "react-router-dom";
import CaseCard from "../components/CaseCard";

function CitizenDashboard() {
  const myCases = [
    { id: 4, title: "Power Outage", status: "Resolved" },
  ];

  return (
    <div className="dashboard">
      <h2>Citizen Dashboard</h2>
      <Link to="/new-case" className="btn-primary">+ Report New Case</Link>
      <div className="case-list">
        {myCases.map((c) => (
          <CaseCard key={c.id} data={c} />
        ))}
      </div>
    </div>
  );
}

export default CitizenDashboard;
