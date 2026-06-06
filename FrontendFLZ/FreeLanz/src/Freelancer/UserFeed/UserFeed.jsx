import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import UploadSuccessModal from '../components/UploadSuccessModal';
import UploadVideoModal from '../components/UploadVideoModal';

import thumbnail1 from '../../assets/Thumbnail_1.jpeg';
import thumbnail2 from '../../assets/Thumbnail_2.jpeg';
import thumbnail3 from '../../assets/Thumbnail_3.png';
import thumbnail4 from '../../assets/Thumbnail_4.png';
import video1 from '../../assets/VIdeo_1.mp4';
import video2 from '../../assets/Video_2.mp4';
import video3 from '../../assets/Video_3.mp4';
import video4 from '../../assets/VIdeo_4.mp4';

const portfolioData = [
  { thumbnail: thumbnail1, video: video1, views: '12k', alt: 'Project 1' },
  { thumbnail: thumbnail2, video: video2, views: '6k', alt: 'Project 2' },
  { thumbnail: thumbnail3, video: video3, views: '3k', alt: 'Project 3' },
  { thumbnail: thumbnail4, video: video4, views: '10k', alt: 'Project 4' },
];

const UserFeed = ({ onChangePage, currentPage }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Kim Veny',
    role: 'UI/UX Designer',
    bio: 'An innovative UI/UX Designer with a passion for building the next generation of digital products.',
    tags: ['#Motion_Graphics', '#Branding', '#UI_Design'],
    avatar: 'https://i.pravatar.cc/150?u=kim',
  });

  const videoRef = useRef(null);

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
        setProfileData(prev => ({
          name: data.name || 'Kim Veny',
          role: data.title || data.role || 'UI/UX Designer',
          bio: data.bio || prev.bio,
          tags: data.tags || prev.tags,
          avatar: imgUrl.startsWith('http') || imgUrl.startsWith('data:') ? imgUrl : `http://localhost:5000${imgUrl}`,
        }));
      }
    };

    loadProfile();

    const handleStorage = (e) => {
      if (!e.key || e.key === 'userProfile' || e.key === 'user') {
        loadProfile();
      }
    };

    window.addEventListener('storage', handleStorage);

    const logoutIcon = document.querySelector('.uf-logout-icon');
    if (logoutIcon) {
      logoutIcon.onclick = () => { window.location.href = 'chooseRole'; };
    }

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Autoplay video when modal opens
  useEffect(() => {
    if (isVideoOpen && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => console.log('Autoplay prevented', err));
    } else if (!isVideoOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isVideoOpen, selectedVideo]);

  const handleOpenVideo = (item) => {
    setSelectedVideo(item);
    setIsVideoOpen(true);
  };

  const handleCloseVideo = () => {
    setIsVideoOpen(false);
    setSelectedVideo(null);
  };

  const handleUploadSubmit = () => {
    setIsUploadOpen(false);
    setIsSuccessOpen(true);
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
          --btn-blue: #2F54EB;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body { background-color: var(--bg-dark); color: white; }
        .uf-container { display: flex; min-height: 100vh; }


        .uf-main { flex: 1; padding: 2.5rem 3.5rem; position: relative; background: var(--bg-dark); }

        .uf-profile-header {
          display: flex; flex-direction: column; align-items: flex-start;
          margin-top: 1rem; margin-bottom: 3rem;
        }

        .uf-profile-row { display: flex; align-items: center; gap: 2rem; }
        .uf-profile-img {
          width: 150px; height: 150px; border-radius: 50%;
          border: 4px solid var(--accent-lime); object-fit: cover; flex-shrink: 0;
        }

        .uf-profile-meta { }
        .uf-profile-meta h2 { font-size: 2rem; margin-bottom: 4px; color: white; }
        .uf-profile-meta p.role-text { opacity: 0.7; margin-bottom: 8px; color: white; }
        .uf-tags { display: flex; gap: 8px; font-size: 0.78rem; opacity: 0.6; flex-wrap: wrap; }

        .uf-stats-row {
          display: flex; gap: 50px; margin-left: 1rem;
        }
        .uf-stat-item { text-align: center; position: relative; }
        .uf-stat-item:not(:last-child)::after {
          content: ''; position: absolute; right: -25px; top: 15%;
          height: 70%; width: 1px; background: rgba(255,255,255,0.3);
        }
        .uf-stat-value { font-size: 1.4rem; font-weight: 800; display: block; }
        .uf-stat-value.lime { color: var(--accent-lime); }
        .uf-stat-label { font-size: 0.78rem; opacity: 0.6; }

        .uf-bio {
          max-width: 800px; text-align: left; line-height: 1.6;
          margin: 1.75rem 0 1.25rem; opacity: 0.9; font-size: 0.95rem; color: white;
        }

        .uf-btn-edit {
          background: #1D1D8F; color: white; border: none;
          padding: 10px 22px; border-radius: 10px; font-weight: 700;
          cursor: pointer; font-size: 0.85rem; text-transform: uppercase;
          font-family: 'Inter', sans-serif;
        }

        .uf-portfolio-section h3 { margin-bottom: 1.5rem; font-size: 1.1rem; color: white; }
        .uf-portfolio-box {
          background: rgba(255,255,255,0.06); padding: 25px;
          border-radius: 20px; backdrop-filter: blur(5px);
        }
        .uf-portfolio-grid {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px;
        }
        .uf-portfolio-item {
          aspect-ratio: 9/16; background: rgba(255,255,255,0.1); border-radius: 15px;
          overflow: hidden; position: relative; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1); transition: transform 0.2s;
        }
        .uf-portfolio-item img { width: 100%; height: 100%; object-fit: cover; }
        .uf-portfolio-item:hover { transform: translateY(-5px); }
        .uf-play-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.25);
          display: flex; flex-direction: column;
          align-items: flex-start; justify-content: flex-end;
          padding: 10px; opacity: 0; transition: opacity 0.2s;
        }
        .uf-portfolio-item:hover .uf-play-overlay { opacity: 1; }
        .uf-views-badge {
          font-size: 0.7rem; display: flex; align-items: center; gap: 4px; color: white;
        }

        .uf-upload-placeholder {
          border: 2px dashed rgba(255,255,255,0.25);
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; color: var(--accent-lime); font-size: 0.78rem;
          text-align: center; padding: 10px; font-weight: 700; gap: 8px;
          cursor: pointer; border-radius: 15px; aspect-ratio: 9/16;
          transition: background 0.2s;
        }
        .uf-upload-placeholder:hover { background: rgba(204,255,0,0.07); }

        /* ── VIDEO PLAYER MODAL ── */
        .uf-video-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.9);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; backdrop-filter: blur(10px);
        }
        .uf-video-modal {
          position: relative; display: flex;
          width: 90%; max-width: 750px; height: 80vh;
          background: #000; border-radius: 25px; overflow: hidden;
          border: 2px solid rgba(255,255,255,0.1);
        }
        .uf-video-side {
          position: relative; flex: 1; height: 100%; background: #000;
        }
        .uf-video-side video { width: 100%; height: 100%; object-fit: cover; }
        .uf-back-btn {
          position: absolute; top: 20px; left: 20px;
          width: 42px; height: 42px;
          background: rgba(255,255,255,0.25);
          border: 2px solid #fff;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10; transition: 0.2s;
        }
        .uf-back-btn:hover { background: rgba(255,255,255,0.4); transform: scale(1.05); }
        .uf-info-side {
          flex: 1; background: white; color: #333;
          padding: 25px; display: flex; flex-direction: column;
          overflow-y: auto; text-align: left;
        }
        .uf-pop-header {
          display: flex; justify-content: space-between;
          align-items: flex-start; margin-bottom: 16px;
        }
        .uf-pop-meta { display: flex; gap: 12px; align-items: center; }
        .uf-pop-avatar {
          width: 52px; height: 52px; border-radius: 50%;
          object-fit: cover; border: 1px solid #ccc; flex-shrink: 0;
        }
        .uf-pop-name { font-size: 17px; font-weight: bold; color: #111; }
        .uf-pop-role { font-size: 12px; color: #666; margin-top: 2px; }
        .uf-pop-divider { border: 0; border-top: 1px solid #e5e7eb; margin: 14px 0; }
        .uf-pop-section-title { font-size: 13px; font-weight: bold; color: #111; margin-bottom: 6px; }
        .uf-pop-text { font-size: 13px; color: #4b5563; line-height: 1.5; }
        .uf-pop-desc { font-size: 12px; color: #555; line-height: 1.5; margin-top: 5px; }

        /* ── UPLOAD MODAL ── */
        .uf-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75);
          display: flex; align-items: center; justify-content: center;
          z-index: 9998; backdrop-filter: blur(4px);
        }
        .uf-modal-box {
          background: white; width: 440px; border-radius: 40px; overflow: hidden; color: #000;
        }
        .uf-modal-lime-header {
          background: #CCFF00; height: 55px;
          display: flex; justify-content: flex-end; align-items: center; padding: 0 22px;
        }
        .uf-modal-close { font-size: 22px; font-weight: bold; cursor: pointer; color: #000; }
        .uf-modal-body { padding: 25px 30px 30px; text-align: center; }
        .uf-modal-body h2 { font-size: 1.6rem; font-weight: 800; margin-bottom: 8px; color: #000; }
        .uf-modal-subtitle { font-size: 0.78rem; color: #888; margin-bottom: 20px; line-height: 1.4; }
        .uf-dropzone {
          background: #F0F4FF; border: 2px dashed #2F54EB;
          border-radius: 14px; padding: 22px; margin-bottom: 16px; cursor: pointer; color: #2F54EB;
        }
        .uf-dropzone i { font-size: 1.4rem; margin-bottom: 8px; display: block; }
        .uf-dropzone p { font-size: 0.72rem; font-weight: 600; color: #000; }
        .uf-upload-link { color: #2F54EB; text-decoration: underline; }
        .uf-input-group { text-align: left; margin-bottom: 12px; }
        .uf-input-group label { display: block; font-weight: 800; font-size: 0.82rem; margin-bottom: 6px; }
        .uf-input-group input, .uf-input-group textarea {
          width: 100%; padding: 11px 14px; border: 2px solid #000;
          border-radius: 10px; font-weight: 600; outline: none; font-family: 'Inter', sans-serif;
        }
        .uf-input-group textarea { height: 100px; resize: none; background: #F8F8F8; }
        .uf-submit-btn {
          background: #CCFF00; color: #000; border: none;
          width: 70%; padding: 14px; border-radius: 50px;
          font-weight: 800; font-size: 0.95rem; margin-top: 10px;
          cursor: pointer; box-shadow: 0 4px 12px rgba(204,255,0,0.3);
          transition: 0.2s; font-family: 'Inter', sans-serif;
        }
        .uf-submit-btn:hover { transform: scale(1.04); }

        @media (max-width: 768px) {
          .uf-video-modal { flex-direction: column; max-width: 380px; height: 85vh; }
          .uf-video-side { flex: 1.2; }
          .uf-info-side { flex: 1; padding: 15px; }
          .uf-portfolio-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div className="uf-container">
        {/* ── SIDEBAR ── */}
        <Sidebar onChangePage={onChangePage} currentPage={currentPage} />

        {/* ── MAIN CONTENT ── */}
        <main className="uf-main">
          {/* Profile Header */}
          <div className="uf-profile-header">
            <div className="uf-profile-row">
              <img src={profileData.avatar} className="uf-profile-img" alt={profileData.name} />

              <div>
                <div className="uf-profile-meta">
                  <h2>{profileData.name}</h2>
                  <p className="role-text">{profileData.role}</p>
                  <div className="uf-tags">
                    {profileData.tags.map((tag, i) => <span key={i}>{tag}</span>)}
                  </div>
                </div>
              </div>

              <div className="uf-stats-row">
                <div className="uf-stat-item">
                  <span className="uf-stat-value">4.9</span>
                  <span className="uf-stat-label">Rating</span>
                </div>
                <div className="uf-stat-item">
                  <span className="uf-stat-value">42+</span>
                  <span className="uf-stat-label">Projects</span>
                </div>
                <div className="uf-stat-item">
                  <span className="uf-stat-value lime">12.5k</span>
                  <span className="uf-stat-label">Views</span>
                </div>
              </div>
            </div>

            <p className="uf-bio">{profileData.bio}</p>

            <button className="uf-btn-edit" onClick={() => onChangePage('settingUser')}>
              Edit Profile
            </button>
          </div>

          {/* Portfolio Section */}
          <div className="uf-portfolio-section">
            <h3>Featured Portfolios</h3>
            <div className="uf-portfolio-box">
              <div className="uf-portfolio-grid">
                {portfolioData.map((item, i) => (
                  <div key={i} className="uf-portfolio-item" onClick={() => handleOpenVideo(item)}>
                    <img src={item.thumbnail} alt={item.alt} />
                    <div className="uf-play-overlay">
                      <div className="uf-views-badge">
                        <i className="fas fa-play"></i> {item.views}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Upload placeholder */}
                <div className="uf-upload-placeholder" onClick={() => setIsUploadOpen(true)}>
                  <i className="fas fa-plus" style={{ fontSize: '1.4rem' }}></i>
                  <p>Upload Video</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── VIDEO PLAYER MODAL (same format as Explore.jsx) ── */}
      {isVideoOpen && selectedVideo && (
        <div className="uf-video-overlay" onClick={handleCloseVideo}>
          <div className="uf-video-modal" onClick={(e) => e.stopPropagation()}>

            {/* Left: Video */}
            <div className="uf-video-side">
              <div
                className="uf-back-btn"
                onClick={handleCloseVideo}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </div>
              <video ref={videoRef} src={selectedVideo.video} loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
            </div>

            {/* Right: Info Panel — sama format Explore.jsx */}
            <div className="uf-info-side" style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>

              {/* Header: Avatar, Nama, Role */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={profileData.avatar} alt="Avatar" className="uf-pop-avatar" />
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>{profileData.name}</div>
                    <div style={{ fontSize: '13px', color: '#555', marginTop: '2px', fontWeight: '500' }}>{profileData.role}</div>
                  </div>
                </div>
              </div>

              {/* Rating & Lokasi */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '11px', color: '#666', marginBottom: '20px', paddingLeft: '5px' }}>
                <span><i className="fas fa-star" style={{ color: '#ffcc00', marginRight: '4px' }}></i><b>4.9</b> <span style={{ color: '#aaa' }}>(42 Projects)</span></span>
                <span><i className="fas fa-map-marker-alt" style={{ marginRight: '4px', color: '#2563eb' }}></i> Indonesia</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: '16px' }} />

              {/* About Me */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000', marginBottom: '8px' }}>About Me</div>
                <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6', textAlign: 'justify' }}>
                  {profileData.bio}
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: '16px' }} />

              {/* Expertise (Tags/Hashtag) */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000', marginBottom: '10px' }}>Expertise</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {profileData.tags.map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '11px', color: '#555', backgroundColor: '#f3f4f6', padding: '6px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontWeight: '500' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: '16px' }} />

              {/* Top Feedback Tags */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#000', marginBottom: '12px' }}>Top Feedback Tags</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['#GREATPERSONALITY', '#GOODCOLLABORATION', '#TOPQUALITY'].map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '10px', color: '#444', backgroundColor: '#f8fafc', padding: '8px 16px', borderRadius: '20px', border: '1px solid #cbd5e1', fontWeight: '600', letterSpacing: '0.3px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: '16px' }} />

              {/* Views stat */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000', marginBottom: '10px' }}>Video Stats</div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#cccc00' }}>{selectedVideo.views}</div>
                    <div style={{ fontSize: '0.72rem', color: '#888' }}>Views</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111' }}>12.5k</div>
                    <div style={{ fontSize: '0.72rem', color: '#888' }}>Total Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD MODAL ── */}
      <UploadVideoModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSubmit={handleUploadSubmit}
      />

      {/* ── SUCCESS MODAL ── */}
      <UploadSuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
    </>
  );
};

export default UserFeed;