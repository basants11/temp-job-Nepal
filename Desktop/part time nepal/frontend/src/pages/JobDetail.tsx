import { useParams, Link } from 'react-router-dom';

const JobDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <Link to="/jobs">← Back to Jobs</Link>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h2>Job Details</h2>
        <p>Job ID: {id}</p>
        <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>
          Job detail page - implement with actual API data
        </p>
      </div>
    </div>
  );
};

export default JobDetail;
