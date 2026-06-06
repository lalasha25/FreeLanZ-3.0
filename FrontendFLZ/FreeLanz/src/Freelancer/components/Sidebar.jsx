import React, { useState, useEffect } from 'react';

const Sidebar = ({ onChangePage, currentPage }) => {
  const [profile, setProfile] = useState({
    name: 'Kim Veny',
    title: 'UI/UX Designer',
    image: 'https://i.pravatar.cc/150?u=kim',
  });

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
        setProfile({
          name: data.name || 'Kim Veny',
          title: data.title || data.role || 'UI/UX Designer',
          image: imgUrl.startsWith('http') || imgUrl.startsWith('data:') ? imgUrl : `http://localhost:5000${imgUrl}`,
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
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    window.location.href = 'chooseRole';
  };

  const navItems = [
    { page: 'freelancerDashboard', icon: 'fas fa-th-large', label: 'Dashboard' },
    { page: 'userFeed',            icon: 'fas fa-user',      label: 'User Feed' },
    { page: 'messages',            icon: 'fas fa-comment-dots', label: 'Messages' },
    { page: 'order',               icon: 'fas fa-shopping-cart', label: 'Order' },
    { page: 'settingUser',         icon: 'fas fa-user-cog',  label: 'Setting User' },
  ];

  return (
    <>
      <style>{`
        .sb-sidebar {
          width: 260px;
          background: #FFFFFF;
          color: #000033;
          padding: 2rem 1.2rem 0 1.2rem;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          flex-shrink: 0;
          font-family: 'Inter', sans-serif;
        }

        .sb-logo {
          font-size: 1.6rem;
          font-weight: 800;
          font-style: italic;
          margin-bottom: 2.5rem;
          color: #000033;
          letter-spacing: -0.5px;
        }

        .sb-nav { flex-grow: 1; }
        .sb-nav ul { list-style: none; padding: 0; margin: 0; }

        .sb-nav a {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          text-decoration: none;
          color: #666666;
          font-weight: 500;
          border-radius: 8px;
          transition: 0.2s;
          margin-bottom: 4px;
          font-size: 0.9rem;
          gap: 14px;
        }

        .sb-nav a i { width: 20px; font-size: 1.05rem; }

        .sb-nav a:hover,
        .sb-nav a.active {
          background: #F0F4FF;
          color: #2F54EB;
        }

        .sb-footer {
          background-color: #F0F0F0;
          margin: 0 -1.2rem;
          padding: 1rem 1.2rem;
          margin-top: auto;
        }

        .sb-user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sb-user-profile img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .sb-user-info .sb-name {
          font-weight: 700;
          font-size: 0.88rem;
          color: #000033;
          margin: 0;
        }

        .sb-user-info .sb-role {
          font-size: 0.72rem;
          color: #666666;
          margin: 0;
        }

        .sb-logout {
          margin-left: auto;
          color: #666666;
          cursor: pointer;
          font-size: 1.05rem;
          transition: 0.2s;
        }

        .sb-logout:hover { color: #EF4444; }
      `}</style>

      <aside className="sb-sidebar">
        <div className="sb-logo">FreeLanZ</div>

        <nav className="sb-nav">
          <ul>
            {navItems.map(({ page, icon, label }) => (
              <li key={page}>
                <a
                  href={`#${page}`}
                  className={currentPage === page ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); onChangePage(page); }}
                >
                  <i className={icon}></i>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sb-footer">
          <div className="sb-user-profile">
            <img src={profile.image} alt={profile.name} />
            <div className="sb-user-info">
              <p className="sb-name">{profile.name}</p>
              <p className="sb-role">{profile.title}</p>
            </div>
            <i className="fas fa-sign-out-alt sb-logout" onClick={handleLogout}></i>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
