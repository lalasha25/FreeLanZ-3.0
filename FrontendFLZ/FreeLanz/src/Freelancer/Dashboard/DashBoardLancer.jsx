import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import UploadSuccessModal from '../components/UploadSuccessModal';
import UploadVideoModal from '../components/UploadVideoModal';

const Dashboard = ({ onChangePage, currentPage }) => {
  const [profile, setProfile] = useState({
    name: 'Kim Veny',
    avatar: 'https://i.pravatar.cc/150?u=kim',
  });
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  useEffect(() => {
    const loadProfile = () => {
      const loggedInUser = localStorage.getItem('user');
      const savedProfile = localStorage.getItem('userProfile');
      
      let data = null;
      if (loggedInUser) {
        try {
          data = JSON.parse(loggedInUser);
        } catch (e) {
          console.error(e);
        }
      }
      if (!data && savedProfile) {
        try {
          data = JSON.parse(savedProfile);
        } catch (e) {
          console.error(e);
        }
      }

      if (data) {
        const imgUrl = data.avatarUrl || data.profileImage || data.image || data.avatar || 'https://i.pravatar.cc/150?u=kim';
        setProfile({
          name: data.name || 'Kim Veny',
          avatar: imgUrl.startsWith('http') || imgUrl.startsWith('data:') ? imgUrl : `http://localhost:5000${imgUrl}`,
        });
      }
    };

    loadProfile();

    const handleStorage = (e) => {
      if (!e.key || e.key === 'userProfile' || e.key === 'user') {
        loadProfile();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    // --- SINKRONISASI STATS DARI LOCALSTORAGE ---
    const savedOrderStats = localStorage.getItem('orderStats');
    const savedViews = localStorage.getItem('userViews');
    const cardNumbers = document.querySelectorAll('.summary-cards .card h3');

    if (cardNumbers.length >= 3) {
      cardNumbers[0].textContent = savedViews || "12.5K";
      if (savedOrderStats) {
        const orderStats = JSON.parse(savedOrderStats);
        cardNumbers[1].textContent = orderStats.pendingCount;
        cardNumbers[2].textContent = orderStats.completedCount;
      } else {
        cardNumbers[1].textContent = "4";
        cardNumbers[2].textContent = "12";
      }
    }
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <style>{`
        :root {
          --bg-dark: #000060;
          --sidebar-bg: #FFFFFF;
          --accent-lime: #CCFF00;
          --text-dark: #000033;
          --card-bg: #FFFFFF;
          --grey-text: #666666;
          --item-dark-bg: #1A1A1A;
        }

        body { background-color: var(--bg-dark); color: white; overflow-x: hidden; margin: 0; font-family: 'Inter', sans-serif; }
        .container { display: flex; min-height: 100vh; }
        .main-content { flex: 1; padding: 2.5rem 3.5rem; }

        header.dashboard-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 0.5rem; padding: 0.5rem 0;
        }
        header.dashboard-header h1 { font-size: 1.4rem; color: var(--accent-lime); font-weight: 700; }
        .header-right { display: flex; align-items: center; gap: 20px; }
        .notification-icon { position: relative; cursor: pointer; }
        .notification-icon i { font-size: 1.2rem; color: #FFFFFF; }
        .notification-icon::after { content: ''; position: absolute; top: -2px; right: -2px; width: 6px; height: 6px; background-color: var(--accent-lime); border-radius: 50%; }
        .header-user-info { display: flex; flex-direction: column; text-align: right; }
        .header-user-info .user-name { font-size: 0.9rem; font-weight: 700; color: #FFFFFF; }
        .header-user-info .user-badge { font-size: 0.65rem; font-weight: 800; color: var(--accent-lime); letter-spacing: 0.5px; margin-top: 2px; }
        .header-avatar img.profile-img { width: 42px; height: 42px; border-radius: 50%; border: 2px solid var(--accent-lime); object-fit: cover; }

        .divider { height: 1px; background: rgba(255,255,255,0.2); margin-bottom: 2rem; }
        .welcome-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
        .main-content h2 { font-size: 2.2rem; margin-bottom: 5px; color: white; }
        .main-content p { opacity: 0.8; font-weight: 300; }

        .btn-upload { background: var(--accent-lime); color: black; border: none; padding: 14px 28px; border-radius: 30px; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .btn-upload:hover { transform: scale(1.05); }

        .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
        .card { background: var(--card-bg); color: var(--text-dark); padding: 1.8rem; border-radius: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .card p { font-size: 0.85rem; font-weight: 600; color: var(--grey-text); }
        .card h3 { font-size: 2rem; font-weight: 800; margin-top: 8px; }

        .bottom-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        .section-container { background: white; color: var(--text-dark); padding: 2rem; border-radius: 24px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .btn-lihat-semua { background: var(--accent-lime); color: black; text-decoration: none; font-size: 0.65rem; font-weight: 800; padding: 5px 12px; border-radius: 10px; }

        .request-item { background: var(--item-dark-bg); color: white; display: flex; align-items: center; padding: 1.2rem; border-radius: 15px; margin-bottom: 12px; cursor: pointer; transition: 0.2s; }
        .request-item:hover { background: #333; }
        .icon-circle { width: 45px; height: 45px; background: #0000AA; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; margin-right: 15px; }
        .icon-circle.blue { background: #0000FF; }
        .item-detail h4 { font-size: 1rem; color: var(--accent-lime); margin-bottom: 4px; }
        .item-detail p { font-size: 0.75rem; opacity: 0.7; letter-spacing: 0.5px; }

        /* Modal */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: none; justify-content: center; align-items: center; z-index: 9999; }
        .modal-content-new { background: #FFFFFF; width: 450px; border-radius: 20px; overflow: hidden; color: #000; position: relative; padding-bottom: 30px; }
        .close-modal { position: absolute; top: 15px; right: 20px; font-size: 24px; font-weight: bold; cursor: pointer; color: #000; z-index: 10; }
        .modal-body-new { padding: 30px; padding-top: 50px; text-align: center; }
        .modal-body-new h2 { font-size: 1.8rem; font-weight: 800; margin-bottom: 10px; color: #000 !important; }
        .subtitle { font-size: 0.8rem; color: #888; margin-bottom: 25px; line-height: 1.4; }
        .upload-dropzone { background: #F0F4FF; border: 2px dashed #3D88E3; border-radius: 15px; padding: 25px; margin-bottom: 20px; cursor: pointer; color: #3D88E3; }
        .upload-dropzone i { font-size: 1.5rem; margin-bottom: 10px; }
        .upload-dropzone p { font-size: 0.75rem; font-weight: 600; color: #000; }
        .upload-link { text-decoration: underline; }
        .input-group-new { text-align: left; margin-bottom: 15px; }
        .input-group-new label { display: block; font-weight: 800; font-size: 0.85rem; margin-bottom: 8px; }
        .input-group-new input, .input-group-new textarea { width: 100%; padding: 12px 15px; border: 2px solid #ccc; border-radius: 12px; font-weight: 600; outline: none; }
        .input-group-new textarea { height: 120px; resize: none; background: #F8F8F8; }
        .btn-main-upload { background: #B4FF00; color: #000; border: none; width: 70%; padding: 15px; border-radius: 50px; font-weight: 800; font-size: 1rem; margin-top: 10px; cursor: pointer; transition: 0.2s; }
        .btn-main-upload:hover { transform: scale(1.05); }
      `}</style>

      <div className="container">
        <Sidebar onChangePage={onChangePage} currentPage={currentPage} />

        <main className="main-content">
          <header className="dashboard-header">
            <h1>Summary Dashboard</h1>
            <div className="header-right">
              <div className="notification-icon"><i className="fas fa-bell"></i></div>
              <div className="header-user-info">
                <span className="user-name">{profile.name}</span>
                <span className="user-badge">VERIFIED PRO</span>
              </div>
              <div className="header-avatar">
                <img src={profile.avatar} className="profile-img" alt={profile.name} />
              </div>
            </div>
          </header>
          <div className="divider"></div>

          <section className="welcome-section">
            <div>
              <h2>Hai, {profile.name}</h2>
              <p style={{ color: 'white' }}>Berikut adalah perkembangan proyek Anda hari ini.</p>
            </div>
            <button type="button" id="btnOpenUpload" className="btn-upload" onClick={() => setIsUploadOpen(true)}>Upload Video</button>
          </section>

          <div className="summary-cards">
            <div className="card"><p>Total Views FYP</p><h3>124.5K</h3></div>
            <div className="card"><p>Incoming Request</p><h3>10</h3></div>
            <div className="card"><p>Ongoing Project</p><h3>12</h3></div>
          </div>

          <div className="bottom-grid">
            <div className="section-container">
              <div className="section-header">
                <h3>Permintaan Masuk</h3>
                <a href="#order" className="btn-lihat-semua" onClick={(e) => { e.preventDefault(); onChangePage('order'); }}>LIHAT SEMUA</a>
              </div>
              <div className="request-item">
                <div className="icon-circle">S</div>
                <div className="item-detail"><h4>Kampanye Iklan TikTok</h4><p>SARAH JOHNSON • $150</p></div>
              </div>
              <div className="request-item">
                <div className="icon-circle blue">T</div>
                <div className="item-detail"><h4>Video Explainer</h4><p>TECHFLOW STARTUP • $450</p></div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL UPLOAD VIDEO */}
      <UploadVideoModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSubmit={() => {
          setIsUploadOpen(false);
          setIsSuccessOpen(true);
        }}
      />

      {/* MODAL SUCCESS */}
      <UploadSuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
    </>
  );
};

export default Dashboard;