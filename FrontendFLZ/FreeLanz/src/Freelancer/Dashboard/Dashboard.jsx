import React from 'react';

export default function FreelancerDashboard({ onChangePage }) {
  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #050b14 0%, #0a1128 100%)',
      minHeight: '100vh',
      color: '#fff',
      padding: '40px 5%',
      boxSizing: 'border-box'
    }}>
      <style>{`
        .dash-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 30px;
          backdrop-filter: blur(10px);
          transition: 0.3s;
        }
        .dash-card:hover {
          border-color: #4cc9f0;
          box-shadow: 0 10px 25px rgba(76, 201, 240, 0.1);
        }
        .stat-val {
          font-size: 2.5rem;
          font-weight: 800;
          color: #4cc9f0;
          margin: 10px 0;
        }
        .back-btn {
          background: #ccff00;
          color: #050b14;
          border: none;
          padding: 10px 25px;
          border-radius: 30px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }
        .back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(204, 255, 0, 0.3);
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>
            Freelancer <span style={{ color: '#4cc9f0' }}>Dashboard</span>
          </h1>
          <p style={{ opacity: 0.6, marginTop: '5px' }}>Welcome back, Lanzer! Here is your project overview.</p>
        </div>
        <button className="back-btn" onClick={() => onChangePage('landing')}>
          Log Out
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginBottom: '50px' }}>
        <div className="dash-card">
          <div style={{ opacity: 0.7, fontSize: '0.9rem', fontWeight: 600 }}>ACTIVE PROJECTS</div>
          <div className="stat-val">3</div>
          <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>2 in progress, 1 pending review</div>
        </div>
        <div className="dash-card">
          <div style={{ opacity: 0.7, fontSize: '0.9rem', fontWeight: 600 }}>TOTAL EARNINGS</div>
          <div className="stat-val" style={{ color: '#ccff00' }}>Rp 12.8M</div>
          <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>+Rp 2.4M this month</div>
        </div>
        <div className="dash-card">
          <div style={{ opacity: 0.7, fontSize: '0.9rem', fontWeight: 600 }}>PROFILE VIEWS</div>
          <div className="stat-val">342</div>
          <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>+12% vs last week</div>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', flexWrap: 'wrap' }}>
        <div className="dash-card">
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}>Recent Gigs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Gig 1 */}
            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>E-Commerce Redesign</h4>
                <p style={{ opacity: 0.5, fontSize: '0.8rem', margin: '5px 0 0' }}>Client: Jacqueline S.</p>
              </div>
              <span style={{ background: 'rgba(76, 201, 240, 0.1)', color: '#4cc9f0', padding: '5px 12px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 700 }}>IN PROGRESS</span>
            </div>
            {/* Gig 2 */}
            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Corporate Landing Page</h4>
                <p style={{ opacity: 0.5, fontSize: '0.8rem', margin: '5px 0 0' }}>Client: Linata Satoro</p>
              </div>
              <span style={{ background: 'rgba(204, 255, 0, 0.1)', color: '#ccff00', padding: '5px 12px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 700 }}>UNDER REVIEW</span>
            </div>
          </div>
        </div>

        <div className="dash-card">
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}>Next Tasks</h3>
          <ul style={{ paddingLeft: '20px', lineHeight: '2' }}>
            <li>Upload prototype for E-Commerce</li>
            <li>Submit invoice for Landing Page</li>
            <li>Update portfolio items</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
