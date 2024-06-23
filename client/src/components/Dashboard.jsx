import React from "react";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Welcome to the Dashboard</h2>
      <div className="summary">
        <h3>Summary</h3>
        <p>This is where you can display summarized information.</p>
      </div>
      <div className="actions">
        <h3>Actions</h3>
        <ul>
          <li>View Orders</li>
          <li>Edit Profile</li>
          <li>Logout</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
0;
