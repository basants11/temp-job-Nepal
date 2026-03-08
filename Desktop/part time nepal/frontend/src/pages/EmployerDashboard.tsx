const EmployerDashboard = () => {
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1>Employer Dashboard</h1>
      <div className="stats-grid" style={{ marginTop: '1rem' }}>
        <div className="stat-card"><div className="stat-value">0</div><div className="stat-label">Active Jobs</div></div>
        <div className="stat-card"><div className="stat-value">0</div><div className="stat-label">Total Applicants</div></div>
        <div className="stat-card"><div className="stat-value">0</div><div className="stat-label">Views Today</div></div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
