import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container header-content">
          <Link to="/" className="logo">NepaJob</Link>
          <nav className="nav">
            <Link to="/jobs" className="nav-link">Find Jobs</Link>
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'EMPLOYER' ? '/dashboard/employer' : '/dashboard/jober'} className="nav-link">
                  Dashboard
                </Link>
                <Link to="/messages" className="nav-link">Messages</Link>
                <button onClick={() => {}} className="btn btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 700 }}>
            Find Instant Jobs in Nepal
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
            Connect with employers and find hourly, daily, or part-time work near you
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/jobs" className="btn" style={{ background: 'white', color: '#667eea' }}>
              Browse Jobs
            </Link>
            <Link to="/register" className="btn" style={{ background: 'transparent', border: '2px solid white', color: 'white' }}>
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>Why Choose NepaJob?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <h3>Instant Posting</h3>
              <p style={{ color: 'var(--text-light)' }}>Post a job in under 60 seconds and start receiving applications immediately</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
              <h3>Transparent Pricing</h3>
              <p style={{ color: 'var(--text-light)' }}>Clear commission structure with no hidden fees</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h3>Mobile First</h3>
              <p style={{ color: 'var(--text-light)' }}>Access from any device, optimized for Nepal's connectivity</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
              <h3>Direct Messaging</h3>
              <p style={{ color: 'var(--text-light)' }}>Chat directly with employers or job seekers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Preview */}
      <section style={{ padding: '4rem 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>Latest Jobs</h2>
            <Link to="/jobs" className="btn btn-secondary">View All</Link>
          </div>
          <div style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem' }}>
            Browse hundreds of jobs in delivery, construction, events, and more...
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem 0', background: 'var(--text)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <p>© 2026 NepaJob. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>Made with ❤️ in Nepal</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
