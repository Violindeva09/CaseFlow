import React from "react";

function CaseCard({ data }) {
  return (
    <div className="case-card">
      <h3>{data.title}</h3>
      <p>Status: <strong>{data.status}</strong></p>
      {data.assignedTo && <p>Assigned To: {data.assignedTo}</p>}
    </div>
  );
}

export default CaseCard;
