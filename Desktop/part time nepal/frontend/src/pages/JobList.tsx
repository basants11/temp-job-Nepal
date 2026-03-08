import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Job {
  id: string;
  title: string;
  description: string;
  rate: number;
  rateType: string;
  location: string;
  city: string;
  company: { name: string; logo?: string; isVerified: boolean };
  skills: { skill: { name: string } }[];
  createdAt: string;
  applicants: number;
}

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data.data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const formatRate = (rate: number, rateType: string) => {
    const typeLabel = rateType === 'HOURLY' ? '/hr' : rateType === 'DAILY' ? '/day' : '';
    return `NPR ${rate.toLocaleString()}${typeLabel}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <header className="header">
        <div className="container header-content">
          <Link to="/" className="logo">NepaJob</Link>
          <nav className="nav">
            <Link to="/jobs" className="nav-link">Find Jobs</Link>
            <Link to="/post-job" className="btn btn-primary">Post a Job</Link>
          </nav>
        </div>
      </header>

      <div className="container" style={{ padding: '2rem 0' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '1rem' }}>Browse Jobs</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1 }}
            />
            <select
              className="form-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="">All Cities</option>
              <option value="Kathmandu">Kathmandu</option>
              <option value="Pokhara">Pokhara</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Birgunj">Birgunj</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
            No jobs found. Be the first to post a job!
          </div>
        ) : (
          <div>
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <span className="company-name">{job.company.name}</span>
                  </div>
                  <div className="job-rate">{formatRate(job.rate, job.rateType)}</div>
                </div>
                <p className="job-description">{job.description.substring(0, 150)}...</p>
                <div className="job-meta">
                  <span>📍 {job.city}</span>
                  <span>👥 {job.applicants} applicants</span>
                  <span>🕐 {formatDate(job.createdAt)}</span>
                </div>
                {job.skills.length > 0 && (
                  <div className="job-skills">
                    {job.skills.slice(0, 3).map(({ skill }) => (
                      <span key={skill.name} className="skill-tag">{skill.name}</span>
                    ))}
                  </div>
                )}
                <div className="job-card-footer">
                  <span className="posted-date">{formatDate(job.createdAt)}</span>
                  <Link to={`/jobs/${job.id}`} className="btn btn-primary">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
