import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function Order({ onChangePage, currentPage }) {
  const [activeTab, setActiveTab] = useState('pending');

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('freelancer_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse freelancer_orders:', e);
      }
    }
    return [
      {
        id: 'row-lilisha',
        title: 'ANNIVERSARY CELEBRATION VIDEO',
        user: 'Lilisha Natasha',
        avatar: 'https://i.pinimg.com/736x/59/b4/8a/59b48ac4cadb1e0995da5bfdc48eb8ec.jpg',
        clientId: 'lilisha',
        category: 'VIDEO & ANIMATION',
        desc: 'Looking for a professional videographer to create a cinematic anniversary celebration video. The video should capture romantic moments, special messages from guests, and have a cinematic color grade with emotional background music.',
        budget: '$ 320.00',
        deadline: '15 Jun 2026',
        highlight: true,
        status: 'pending'
      },
      {
        id: 'row-1',
        title: 'URBAN NIGHT PHOTOSHOT',
        user: 'Budi Pratomo',
        avatar: 'https://i.pinimg.com/736x/06/4a/90/064a909845cf46a82de608565d410b57.jpg',
        clientId: 'budi',
        category: 'PHOTOGRAPHY',
        desc: 'Looking for a neon-style urban photoshoot in downtown. Must have experience with low-light portraits.',
        budget: '$ 500.00',
        deadline: '9 May 2026',
        highlight: true,
        status: 'pending'
      },
      {
        id: 'row-2',
        title: 'PRODUCT CATALOG B-ROLL',
        user: 'Alex Doe',
        avatar: 'https://i.pinimg.com/736x/e8/1e/fa/e81efa839696aa8ee965dfcb38275e8f.jpg',
        clientId: 'alex',
        category: 'VIDEOGRAPHY',
        desc: 'Need a 30-second cinematic B-roll for our new gadget launch.',
        budget: '$ 750.00',
        deadline: '15 May 2026',
        highlight: false,
        status: 'pending'
      },
      {
        id: 'row-3',
        title: 'PORTRAIT EDITORIAL',
        user: 'SARAH_M',
        avatar: null,
        clientId: null,
        category: 'PHOTOGRAPHY',
        desc: 'Outdoor portrait session for a local fashion brand magazine.',
        budget: '$ 350.00',
        deadline: '20 May 2026',
        highlight: true,
        status: 'pending'
      },
      {
        id: 'row-4',
        title: 'ALBUM COVER CONCEPT',
        user: 'VIBE_RECORDS',
        avatar: null,
        clientId: null,
        category: 'DIGITAL ART',
        desc: 'Visual artwork for an upcoming Lo-fi hip hop album cover.',
        budget: '$ 600.00',
        deadline: '2 Jun 2026',
        highlight: false,
        status: 'pending'
      }
    ];
  });

  const [userProfile, setUserProfile] = useState({
    name: 'Kim Veny',
    title: 'UI/UX Designer',
    image: 'https://i.pravatar.cc/150?u=kim'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [pendingAction, setPendingAction] = useState({ id: null, type: null, title: '' });

  useEffect(() => {
    const loadProfile = () => {
      const loggedInUser = localStorage.getItem('user');
      const savedData = localStorage.getItem('userProfile');
      
      let data = null;
      if (loggedInUser) {
        try {
          data = JSON.parse(loggedInUser);
        } catch (e) {
          console.error(e);
        }
      }
      if (!data && savedData) {
        try {
          data = JSON.parse(savedData);
        } catch (e) {
          console.error(e);
        }
      }

      if (data) {
        const imgUrl = data.avatarUrl || data.profileImage || data.image || data.avatar || 'https://i.pravatar.cc/150?u=kim';
        setUserProfile({
          name: data.name || 'Kim Veny',
          title: data.title || data.role || 'UI/UX Designer',
          image: imgUrl.startsWith('http') || imgUrl.startsWith('data:') ? imgUrl : `http://localhost:5000${imgUrl}`
        });
      }
    };

    loadProfile();

    const handleStorage = (e) => {
      if (!e.key || e.key === 'userProfile' || e.key === 'user') loadProfile();
    };
    window.addEventListener('storage', handleStorage);

    let orderStats = JSON.parse(localStorage.getItem('orderStats'));
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    if (!orderStats) {
      orderStats = { pendingCount: pendingCount, completedCount: 12 };
    } else {
      orderStats.pendingCount = pendingCount;
    }
    localStorage.setItem('orderStats', JSON.stringify(orderStats));

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    localStorage.setItem('freelancer_orders', JSON.stringify(orders));
    let orderStats = JSON.parse(localStorage.getItem('orderStats')) || { pendingCount: 4, completedCount: 12 };
    orderStats.pendingCount = orders.filter(o => o.status === 'pending').length;
    localStorage.setItem('orderStats', JSON.stringify(orderStats));
  }, [orders]);

  const handleLogout = () => { window.location.href = 'chooseRole'; };

  const openModal = (project) => { setSelectedProject(project); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  const handleShowFeedback = (type, title, id) => {
    setPendingAction({ id, type, title });
    if (type === 'accept') setShowSuccess(true);
    else setShowDecline(true);
  };

  const handleCloseFeedback = () => {
    setShowSuccess(false);
    setShowDecline(false);
    if (pendingAction.id) {
      const project = orders.find(o => o.id === pendingAction.id);
      const updatedOrders = orders.map(item =>
        item.id === pendingAction.id
          ? { ...item, status: pendingAction.type === 'accept' ? 'approved' : 'rejected' }
          : item
      );
      setOrders(updatedOrders);
      localStorage.setItem('freelancer_orders', JSON.stringify(updatedOrders));

      if (pendingAction.type === 'accept') {
        let orderStats = JSON.parse(localStorage.getItem('orderStats')) || { pendingCount: 4, completedCount: 12 };
        orderStats.completedCount = parseInt(orderStats.completedCount) + 1;
        orderStats.pendingCount = updatedOrders.filter(o => o.status === 'pending').length;
        localStorage.setItem('orderStats', JSON.stringify(orderStats));
        // Signal Messages page to open price-proposal for this client
        if (project && project.clientId) {
          localStorage.setItem('open_chat_client', JSON.stringify({
            clientId: project.clientId,
            orderTitle: project.title,
            budget: project.budget
          }));
        }
      }
    }
    setPendingAction({ id: null, type: null, title: '' });
  };

  const handleAcceptAndGoToChat = () => {
    handleCloseFeedback();
    onChangePage('messages');
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('ord-overlay')) {
      closeModal();
      setShowSuccess(false);
      setShowDecline(false);
    }
  };

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
          --grey-text: #666666;
          --navy: #000066;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body { background-color: var(--bg-dark); overflow-x: hidden; }

        .ord-wrap { display: flex; min-height: 100vh; }

        /* ── SIDEBAR ── */
        .ord-sidebar {
          width: 260px; background: var(--sidebar-bg); color: var(--text-dark);
          padding: 2rem 1.2rem 0 1.2rem; display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh; flex-shrink: 0;
        }
        .ord-logo {
          font-size: 1.6rem; font-weight: 800; font-style: italic;
          margin-bottom: 2.5rem; color: var(--text-dark);
        }
        .ord-nav ul { list-style: none; padding: 0; }
        .ord-nav a {
          display: flex; align-items: center; padding: 12px 15px; text-decoration: none;
          color: var(--grey-text); font-weight: 500; border-radius: 8px;
          transition: 0.2s; margin-bottom: 5px; font-size: 0.9rem;
        }
        .ord-nav a:hover, .ord-nav a.active { background: #F0F4FF; color: #2F54EB; }
        .ord-nav a i { width: 22px; margin-right: 12px; font-size: 1.05rem; }
        .ord-sidebar-footer {
          background: #F0F0F0; margin: 0 -1.2rem;
          padding: 1rem 1.2rem; margin-top: auto;
        }
        .ord-user-profile { display: flex; align-items: center; gap: 12px; }
        .ord-user-profile img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
        .ord-user-info .uname { font-weight: 700; font-size: 0.88rem; color: var(--text-dark); }
        .ord-user-info .urole { font-size: 0.72rem; color: var(--grey-text); }
        .ord-logout { margin-left: auto; color: var(--grey-text); cursor: pointer; transition: 0.2s; }
        .ord-logout:hover { color: #EF4444; }

        /* ── RIGHT AREA ── */
        .ord-right { flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

        /* ── TOP BAR ── */
        .ord-topbar {
          height: 80px; background: var(--bg-dark);
          display: flex; align-items: center;
          justify-content: space-between; padding: 0 3rem;
        }
        .ord-topbar h1 {
          font-size: 2rem; font-weight: 800; color: white; letter-spacing: -0.5px;
        }
        .ord-topbar-right { display: flex; align-items: center; gap: 18px; }
        .ord-notif { position: relative; cursor: pointer; }
        .ord-notif i { font-size: 1.2rem; color: white; }
        .ord-notif::after {
          content: ''; position: absolute; top: -2px; right: -2px;
          width: 7px; height: 7px; background: var(--accent-lime); border-radius: 50%;
        }
        .ord-user-badge-area { text-align: right; }
        .ord-user-badge-area .tname { font-size: 0.88rem; font-weight: 700; color: white; }
        .ord-user-badge-area .tbadge { font-size: 0.6rem; font-weight: 800; color: var(--accent-lime); letter-spacing: 0.5px; }
        .ord-topbar-avatar img {
          width: 42px; height: 42px; border-radius: 50%;
          border: 2px solid var(--accent-lime); object-fit: cover;
        }

        /* ── MAIN ── */
        .ord-main {
          flex: 1; padding: 2rem 3rem; background: var(--bg-dark);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }

        .ord-card {
          background: white; width: 100%; max-width: 860px;
          border-radius: 28px; padding: 2rem 2.5rem;
          color: var(--text-dark);
        }

        /* ── TABS ── */
        .ord-tabs {
          display: flex; gap: 6px; margin-bottom: 1.75rem;
          border-bottom: 1px solid #E5E7EB; padding-bottom: 0;
        }
        .ord-tab-btn {
          padding: 10px 26px; border: none; background: transparent;
          font-weight: 600; font-size: 0.9rem; color: var(--grey-text);
          cursor: pointer; border-radius: 10px 10px 0 0;
          border-bottom: 3px solid transparent; transition: 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .ord-tab-btn.active {
          color: var(--text-dark); background: #F3F4F6;
          border-bottom: 3px solid var(--navy);
          font-weight: 700;
        }
        .ord-tab-btn:hover:not(.active) { background: #F9FAFB; color: #333; }

        /* ── TABLE ── */
        .ord-table { width: 100%; border-collapse: separate; border-spacing: 0 6px; }
        .ord-table thead th {
          text-align: left; color: var(--grey-text); font-size: 0.82rem;
          font-weight: 600; padding: 4px 12px 10px 12px;
          text-transform: uppercase; letter-spacing: 0.4px;
        }
        .ord-table tbody tr {
          transition: 0.15s;
        }
        .ord-table tbody tr.highlight td { background: #F8F9FA; }
        .ord-table tbody tr td {
          padding: 14px 12px; vertical-align: middle; background: white;
        }
        .ord-table tbody tr td:first-child { border-radius: 12px 0 0 12px; }
        .ord-table tbody tr td:last-child { border-radius: 0 12px 12px 0; }
        .ord-table tbody tr:hover td { background: #F0F4FF !important; }

        .ord-project-name {
          font-weight: 700; font-size: 0.9rem; cursor: pointer;
          color: var(--text-dark); line-height: 1.3;
        }
        .ord-project-name:hover { color: #2F54EB; }

        .ord-user-cell { display: flex; align-items: center; gap: 12px; }
        .ord-avatar-circle {
          width: 36px; height: 36px; background: #E5E7EB;
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
        }
        .ord-avatar-circle i { color: #9CA3AF; font-size: 0.9rem; }
        .ord-username { font-weight: 700; font-size: 0.85rem; color: var(--text-dark); }

        .ord-actions { display: flex; align-items: center; gap: 10px; justify-content: flex-end; }
        .ord-btn-decline {
          display: flex; align-items: center; gap: 6px;
          border: 1.5px solid #D1D5DB; background: white;
          color: #374151; padding: 8px 16px; border-radius: 8px;
          font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .ord-btn-decline:hover { border-color: #EF4444; color: #EF4444; background: #FFF5F5; }
        .ord-btn-accept {
          background: var(--navy); color: white;
          border: none; padding: 8px 20px; border-radius: 8px;
          font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .ord-btn-accept:hover { background: #000044; }

        .ord-empty {
          text-align: center; padding: 40px 0;
          color: var(--grey-text); font-size: 0.9rem;
        }

        /* ── MODALS ── */
        .ord-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          display: flex; justify-content: center; align-items: center; z-index: 1000;
        }
        .ord-modal {
          background: white; width: 450px; border-radius: 24px;
          overflow: hidden; color: var(--text-dark);
          animation: ordFadeIn 0.25s ease;
        }
        @keyframes ordFadeIn { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
        .ord-modal-header {
          background: var(--navy); color: white;
          padding: 1.4rem 2rem; display: flex; justify-content: space-between; align-items: center;
        }
        .ord-modal-header h3 { font-size: 1.3rem; font-weight: 800; letter-spacing: 1px; }
        .ord-modal-close { cursor: pointer; font-size: 1.1rem; }
        .ord-modal-body { padding: 1.5rem 2rem; }
        .ord-modal-body .from-user { color: var(--grey-text); font-size: 0.78rem; font-weight: 600; margin-bottom: 12px; }
        .ord-modal-divider { height: 1px; background: #E5E7EB; margin-bottom: 16px; }
        .ord-label { font-size: 0.72rem; color: var(--grey-text); font-weight: 700; text-transform: uppercase; margin-bottom: 6px; display: block; letter-spacing: 0.4px; }
        .ord-proj-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 14px; }
        .ord-cat-badge {
          background: var(--accent-lime); display: inline-block;
          padding: 5px 14px; border-radius: 7px; font-weight: 800; font-size: 0.78rem; margin-bottom: 18px;
        }
        .ord-desc-box {
          background: #F5F5F5; border: 1.5px solid #000; border-radius: 10px;
          padding: 1rem; font-size: 0.88rem; line-height: 1.5; margin-bottom: 18px;
        }
        .ord-info-row { display: flex; gap: 12px; margin-bottom: 20px; }
        .ord-info-card { flex: 1; border: 1.5px solid #000; border-radius: 10px; padding: 10px 14px; }
        .ord-info-card .val { font-weight: 800; font-size: 1.2rem; }
        .ord-info-card .val.price { color: #7C3AED; }
        .ord-modal-footer { display: flex; gap: 12px; padding: 0 2rem 1.5rem 2rem; }
        .ord-modal-btn { flex: 1; padding: 12px; border-radius: 10px; font-weight: 800; cursor: pointer; font-size: 0.9rem; border: none; font-family: 'Inter', sans-serif; }
        .ord-modal-btn.decline { background: white; border: 2px solid var(--navy); color: var(--navy); }
        .ord-modal-btn.accept { background: var(--navy); color: white; }

        /* Feedback popup */
        .ord-feedback {
          background: white; padding: 2.5rem 2rem; border-radius: 24px;
          text-align: center; width: 340px;
          animation: ordFadeIn 0.3s ease;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .ord-feedback-icon { font-size: 3.5rem; margin-bottom: 1.25rem; }
        .ord-feedback-icon.success { color: #16a34a; }
        .ord-feedback-icon.decline { color: #EF4444; }
        .ord-feedback h4 { font-size: 1.4rem; font-weight: 800; margin-bottom: 10px; color: var(--text-dark); }
        .ord-feedback p { color: var(--grey-text); font-size: 0.85rem; line-height: 1.5; margin-bottom: 1.75rem; }
        .ord-btn-done {
          background: var(--text-dark); color: white; border: none;
          padding: 11px 30px; border-radius: 10px; font-weight: 700;
          cursor: pointer; font-family: 'Inter', sans-serif;
        }
      `}</style>

      <div className="ord-wrap">
        {/* ── SIDEBAR ── */}
        <Sidebar onChangePage={onChangePage} currentPage={currentPage} />

        {/* ── RIGHT AREA ── */}
        <div className="ord-right">
          {/* Top Bar */}
          <header className="ord-topbar" style={{ justifyContent: 'flex-end' }}>
            <div className="ord-topbar-right">
              <div className="ord-notif"><i className="fas fa-bell"></i></div>
              <div className="ord-user-badge-area">
                <div className="tname">{userProfile.name}</div>
                <div className="tbadge">VERIFIED PRO</div>
              </div>
              <div className="ord-topbar-avatar">
                <img
                  src={userProfile.image}
                  alt={userProfile.name}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--accent-lime)', objectFit: 'cover' }}
                />
              </div>
            </div>
          </header>

          {/* Main */}
          <main className="ord-main">
            <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: '800', width: '100%', maxWidth: '860px', marginBottom: '1.5rem', textAlign: 'left' }}>Orders Preview</h1>
            <div className="ord-card">

              {/* Tabs */}
              <div className="ord-tabs">
                <button className={`ord-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pending')}>
                  Pending
                </button>
                <button className={`ord-tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
                  onClick={() => setActiveTab('approved')}>
                  Approved
                  {orders.filter(o => o.status === 'approved').length > 0 && (
                    <span style={{ marginLeft: '6px', background: '#16a34a', color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '0.7rem' }}>
                      {orders.filter(o => o.status === 'approved').length}
                    </span>
                  )}
                </button>
                <button className={`ord-tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rejected')}>
                  Rejected
                  {orders.filter(o => o.status === 'rejected').length > 0 && (
                    <span style={{ marginLeft: '6px', background: '#EF4444', color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '0.7rem' }}>
                      {orders.filter(o => o.status === 'rejected').length}
                    </span>
                  )}
                </button>
              </div>

              {/* Table */}
              {activeTab === 'pending' && (() => {
                const pendingOrders = orders.filter(o => o.status === 'pending');
                return (
                  <table className="ord-table">
                    <thead>
                      <tr>
                        <th style={{ width: '45%' }}>Project</th>
                        <th style={{ width: '35%' }}>User</th>
                        <th style={{ width: '20%' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingOrders.length === 0 ? (
                        <tr>
                          <td colSpan="3">
                            <div className="ord-empty">No pending orders.</div>
                          </td>
                        </tr>
                      ) : (
                        pendingOrders.map((project) => (
                          <tr key={project.id} className={project.highlight ? 'highlight' : ''}>
                            <td>
                              <span className="ord-project-name" onClick={() => openModal(project)}>
                                {project.title}
                              </span>
                            </td>
                            <td>
                              <div className="ord-user-cell">
                                {project.avatar ? (
                                  <img src={project.avatar} alt={project.user}
                                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #CCFF00' }} />
                                ) : (
                                  <div className="ord-avatar-circle">
                                    <i className="fas fa-camera"></i>
                                  </div>
                                )}
                                <span className="ord-username">{project.user}</span>
                              </div>
                            </td>
                            <td>
                              <div className="ord-actions">
                                <button className="ord-btn-decline"
                                  onClick={() => handleShowFeedback('decline', project.title, project.id)}>
                                  Decline
                                </button>
                                <button className="ord-btn-accept"
                                  onClick={() => handleShowFeedback('accept', project.title, project.id)}>
                                  Accept
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                );
              })()}

              {activeTab === 'approved' && (() => {
                const approvedOrders = orders.filter(o => o.status === 'approved');
                return approvedOrders.length === 0 ? (
                  <div className="ord-empty">
                    <i className="fas fa-check-circle" style={{ fontSize: '2.5rem', color: '#16a34a', marginBottom: '12px', display: 'block' }}></i>
                    No approved orders yet.
                  </div>
                ) : (
                  <table className="ord-table">
                    <thead>
                      <tr>
                        <th style={{ width: '45%' }}>Project</th>
                        <th style={{ width: '35%' }}>User</th>
                        <th style={{ width: '20%' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedOrders.map((project) => (
                        <tr key={project.id} className={project.highlight ? 'highlight' : ''}>
                          <td>
                            <span className="ord-project-name" onClick={() => openModal(project)}>
                              {project.title}
                            </span>
                          </td>
                          <td>
                            <div className="ord-user-cell">
                              {project.avatar ? (
                                <img src={project.avatar} alt={project.user}
                                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #CCFF00' }} />
                              ) : (
                                <div className="ord-avatar-circle"><i className="fas fa-camera"></i></div>
                              )}
                              <span className="ord-username">{project.user}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                              <span style={{ background: '#DCFCE7', color: '#16a34a', padding: '5px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>
                                Accepted
                              </span>
                              {project.clientId && (
                                <button
                                  className="ord-btn-accept"
                                  style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                                  onClick={() => {
                                    localStorage.setItem('open_chat_client', JSON.stringify({
                                      clientId: project.clientId,
                                      orderTitle: project.title,
                                      budget: project.budget
                                    }));
                                    onChangePage('messages');
                                  }}
                                >
                                  Chat
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}

              {activeTab === 'rejected' && (() => {
                const rejectedOrders = orders.filter(o => o.status === 'rejected');
                return rejectedOrders.length === 0 ? (
                  <div className="ord-empty">
                    <i className="fas fa-times-circle" style={{ fontSize: '2.5rem', color: '#EF4444', marginBottom: '12px', display: 'block' }}></i>
                    No rejected orders yet.
                  </div>
                ) : (
                  <table className="ord-table">
                    <thead>
                      <tr>
                        <th style={{ width: '45%' }}>Project</th>
                        <th style={{ width: '35%' }}>User</th>
                        <th style={{ width: '20%' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rejectedOrders.map((project) => (
                        <tr key={project.id} className={project.highlight ? 'highlight' : ''}>
                          <td>
                            <span className="ord-project-name">{project.title}</span>
                          </td>
                          <td>
                            <div className="ord-user-cell">
                              {project.avatar ? (
                                <img src={project.avatar} alt={project.user}
                                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E5E7EB' }} />
                              ) : (
                                <div className="ord-avatar-circle"><i className="fas fa-camera"></i></div>
                              )}
                              <span className="ord-username">{project.user}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span style={{ background: '#FEE2E2', color: '#EF4444', padding: '5px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>
                              Declined
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}

            </div>
          </main>
        </div>
      </div>

      {/* MODAL DETAIL PROJECT */}
      {isModalOpen && selectedProject && (
        <div className="ord-overlay" onClick={handleOverlayClick}>
          <div className="ord-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ord-modal-header">
              <h3>DETAIL PROJECT</h3>
              <i className="fas fa-times ord-modal-close" onClick={closeModal}></i>
            </div>
            <div className="ord-modal-body">
              <p className="from-user">Dari: {selectedProject.user}</p>
              <div className="ord-modal-divider"></div>
              <span className="ord-label">Project Title</span>
              <div className="ord-proj-title">{selectedProject.title}</div>
              <span className="ord-label">Category</span>
              <div className="ord-cat-badge">{selectedProject.category}</div>
              <span className="ord-label">Project Description</span>
              <div className="ord-desc-box">{selectedProject.desc}</div>
              <div className="ord-info-row">
                <div className="ord-info-card">
                  <span className="ord-label">Budget</span>
                  <div className="val price">{selectedProject.budget}</div>
                </div>
                <div className="ord-info-card">
                  <span className="ord-label">Deadline</span>
                  <div className="val">{selectedProject.deadline}</div>
                </div>
              </div>
            </div>
            <div className="ord-modal-footer">
              <button className="ord-modal-btn decline"
                onClick={() => { closeModal(); handleShowFeedback('decline', selectedProject.title, selectedProject.id); }}>
                DECLINE
              </button>
              <button className="ord-modal-btn accept"
                onClick={() => { closeModal(); handleShowFeedback('accept', selectedProject.title, selectedProject.id); }}>
                ACCEPT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP SUCCESS */}
      {showSuccess && (() => {
        const proj = orders.find(o => o.id === pendingAction.id);
        const hasChat = proj && proj.clientId;
        return (
          <div className="ord-overlay" onClick={handleOverlayClick}>
            <div className="ord-feedback" onClick={(e) => e.stopPropagation()}>
              <div className="ord-feedback-icon success">
                <i className="fas fa-check-circle"></i>
              </div>
              <h4>Order Accepted!</h4>
              <p>You've accepted <b>"{pendingAction.title}"</b>.{hasChat ? ' Head to Messages to negotiate your price and kick off the project.' : ' Check the Approved tab to track this order.'}</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button className="ord-btn-done" style={{ background: '#E5E7EB', color: '#374151' }} onClick={handleCloseFeedback}>Stay</button>
                {hasChat && (
                  <button className="ord-btn-done" style={{ background: 'var(--navy)' }} onClick={handleAcceptAndGoToChat}>
                    <i className="fas fa-comments" style={{ marginRight: '6px' }}></i>Chat
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* POPUP DECLINE */}
      {showDecline && (
        <div className="ord-overlay" onClick={handleOverlayClick}>
          <div className="ord-feedback" onClick={(e) => e.stopPropagation()}>
            <div className="ord-feedback-icon decline">
              <i className="fas fa-times-circle"></i>
            </div>
            <h4>Proyek Ditolak</h4>
            <p>Proyek "{pendingAction.title}" telah ditolak dan dihapus dari daftar.</p>
            <button className="ord-btn-done" onClick={handleCloseFeedback}>Selesai</button>
          </div>
        </div>
      )}
    </>
  );
}