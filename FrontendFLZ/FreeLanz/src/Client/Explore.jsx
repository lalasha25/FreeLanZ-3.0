import React, { useState, useEffect, useRef } from 'react';
import API from '../api';

// --- IMPORT ASSETS ---
import thumbnail1 from '../assets/Thumbnail_1.jpeg';
import thumbnail2 from '../assets/Thumbnail_2.jpeg';
import thumbnail3 from '../assets/Thumbnail_3.png';
import thumbnail4 from '../assets/Thumbnail_4.png';
import video1 from '../assets/VIdeo_1.mp4';
import video2 from '../assets/Video_2.mp4';
import video3 from '../assets/Video_3.mp4';
import video4 from '../assets/VIdeo_4.mp4';

// --- DATA FREELANCER ---
const freelancersData = [
  {
    name: "Budi Pratomo",
    role: "Programming & Tech",
    price: "$ 16,20",
    rating: "4.6 (2k+)",
    description: "Jasa pembuatan website portfolio, e-commerce, dan kustom sistem backend cepat jadi...",
    aboutMe: "Saya adalah seorang programmer yang berpengalaman dalam mengembangkan aplikasi web dan solusi teknologi yang inovatif.",
    location: "Jakarta",
    video: video3,
    thumbnail: thumbnail4,
    avatar: "https://nationaltoday.com/wp-content/uploads/2022/10/13-John-Travolta-1200x834.jpg"
  },
  {
    name: "Zelika Lutfy",
    role: "Video & Animation",
    price: "$ 15,00",
    rating: "4.8 (2k+)",
    description: "Tips pembuatan hook promosi konten produk yang dapat memikat audiens dalam 3 detik...",
    aboutMe: "Saya adalah seorang videografer dan animator yang berpengalaman dalam menciptakan konten visual yang menarik dan berkualitas tinggi.",
    location: "Yogyakarta",
    video: video4,
    thumbnail: thumbnail1,
    avatar: "https://tse1.mm.bing.net/th/id/OIP.KdZD7eFXkBPjFnhFGqilmwHaFj?pid=Api&P=0&h=180"
  },
  {
    name: "Alex Doe",
    role: "Graphics & Design",
    price: "$ 12,50",
    rating: "4.5 (1k+)",
    description: "Desain logo brand premium, feeds Instagram estetik, dan pembuatan banner mockup kilat...",
    aboutMe: "Saya adalah seorang desainer grafis yang berpengalaman dalam menciptakan visual yang menarik dan efektif.",
    location: "Bandung",
    video: video1,
    thumbnail: thumbnail3,
    avatar: "https://tse3.mm.bing.net/th/id/OIP.50ynshYaPzsSlsw8ZhqQeQHaE5?pid=Api&P=0&h=180"
  },
  {
    name: "Jane Smith",
    role: "Digital Marketing",
    price: "$ 20,00",
    rating: "4.7 (1.5k+)",
    description: "Optimasi SEO halaman web, riset keywords kompetitor, dan strategi ads tertarget...",
    aboutMe: "Saya adalah seorang digital marketer yang ahli dalam meningkatkan visibilitas online dan konversi penjualan.",
    location: "Surabaya",
    video: video2,
    thumbnail: thumbnail2,
    avatar: "https://tse1.mm.bing.net/th/id/OIP.78_Qi7Z2LXZ88A1BRrNzzQHaHa?pid=Api&P=0&h=180"
  },
  {
    name: "Clara Vance",
    role: "Photography",
    price: "$ 16,20",
    rating: "4.9 (3k+)",
    description: "Fotografi produk katalog studio komersial dan editing color grading tone sinematik...",
    aboutMe: "Saya adalah seorang fotografer yang berpengalaman dalam menciptakan gambar yang menarik dan berkualitas tinggi.",
    location: "Jakarta",
    video: "https://assets.mixkit.co/videos/preview/mixkit-photographer-setting-up-her-camera-on-a-tripod-41950-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
  },
  {
    name: "Aris Thorne",
    role: "Music & Audio",
    price: "$ 18,50",
    rating: "4.8 (2k+)",
    description: "Pembuatan jingle iklan perusahaan, mixing audio podcast, dan aransemen musik latar...",
    aboutMe: "Saya adalah seorang musisi dan audio engineer yang berpengalaman dalam menciptakan suara yang menarik dan berkualitas tinggi.",
    location: "Medan",
    video: "https://assets.mixkit.co/videos/preview/mixkit-hands-adjusting-sound-parameters-on-a-mixer-42225-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  }
];

const categories = [
  'All', 'Graphics & Design', 'Digital Marketing', 'Writing & Translation',
  'Video & Animation', 'Music & Audio', 'Programming & Tech', 'Photography'
];

export default function ExplorePage({ onChangePage, currentPage }) {
  // --- STATE MANAGEMENT ---
  const [currentCategory, setCurrentCategory] = useState('All');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isTopExpanded, setIsTopExpanded] = useState(false);
  const [isBudgetExpanded, setIsBudgetExpanded] = useState(false);
  const [shuffledData, setShuffledData] = useState([]);
  const [dbFreelancers, setDbFreelancers] = useState([]);

  // Modal States
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [isReelsOpen, setIsReelsOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Project Form States
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [projectDeadline, setProjectDeadline] = useState('');

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await API.get('/user/freelancers');
        setDbFreelancers(response.data);
      } catch (err) {
        console.error("Gagal mengambil data freelancer dari database", err);
      }
    };
    fetchFreelancers();

    const userStr = localStorage.getItem("user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const getFreelancerDbId = (name) => {
    const found = dbFreelancers.find(f => f.name.toLowerCase() === name.toLowerCase());
    return found ? found.id : null;
  };

  const videoRef = useRef(null);

  // Mengacak data budget sekali saat component di-mount
  useEffect(() => {
    const shuffled = [...freelancersData].sort(() => Math.random() - 0.5);
    setShuffledData(shuffled);
  }, []);

  // Efek Autoplay/Pause untuk Video Tag di Modal
  useEffect(() => {
    if (isReelsOpen && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => console.log("Autoplay prevented", err));
    } else if (!isReelsOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isReelsOpen, selectedFreelancer]);

  // --- LOGIKA FILTER DATA ---
  const getFilteredData = (baseData) => {
    return baseData.filter(item => {
      const matchCategory = currentCategory === 'All' || item.role.toLowerCase().includes(currentCategory.toLowerCase());
      const matchKeyword = item.name.toLowerCase().includes(searchKeyword.toLowerCase().trim()) ||
        item.role.toLowerCase().includes(searchKeyword.toLowerCase().trim());
      return matchCategory && matchKeyword;
    });
  };

  const isSearching = searchKeyword.trim() !== '' || currentCategory !== 'All';

  // Penentuan data akhir yang akan di-render
  const rawTopData = getFilteredData(freelancersData);
  const rawBudgetData = getFilteredData(shuffledData);

  const displayTopData = isSearching ? rawTopData : (isTopExpanded ? rawTopData : rawTopData.slice(0, 4));
  const displayBudgetData = isSearching ? rawBudgetData : (isBudgetExpanded ? rawBudgetData : rawBudgetData.slice(0, 4));

  // --- HANDLERS ---
  const handleOpenReels = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setIsReelsOpen(true);
  };

  const handleCloseReels = () => {
    setIsReelsOpen(false);
  };

  const handleOpenProjectModal = () => {
    if (selectedFreelancer) {
      // Set default kategori form sesuai profesi talent yang aktif
      const targetCategory = categories.find(c => c.toLowerCase() === selectedFreelancer.role.toLowerCase()) || '';
      setProjectCategory(targetCategory);
    }
    setIsProjectModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Cari id freelancer di database
    const dbId = getFreelancerDbId(selectedFreelancer.name);
    if (!dbId) {
      alert(`Freelancer "${selectedFreelancer.name}" belum terdaftar di database backend! Harap lakukan registrasi freelancer dengan nama "${selectedFreelancer.name}" terlebih dahulu.`);
      return;
    }

    try {
      const response = await API.post('/request', {
        title: projectTitle,
        description: projectDesc,
        budget: parseFloat(projectBudget),
        freelancerId: dbId,
      });

      // Simpan id request terbaru agar chat halaman berikutnya bisa otomatis membukanya
      if (response.data?.request?.id) {
        localStorage.setItem('active_request_id', response.data.request.id);
      }

      setIsProjectModalOpen(false); // Tutup modal form request
      setIsReelsOpen(false);        // Tutup modal detail freelancer jika masih terbuka
      setIsSuccessOpen(true);       // Tampilkan sukses modal
    } catch (err) {
      alert("Gagal mengirim project request: " + (err.response?.data?.message || err.message));
    }
  };

  const handleContinueToChat = () => {
    setIsSuccessOpen(false);
    onChangePage('chat');
  };

  const handleGoToProfile = () => {
    if (!selectedFreelancer) return;
    const params = new URLSearchParams({
      name: selectedFreelancer.name,
      role: selectedFreelancer.role,
      img: selectedFreelancer.avatar,
      price: selectedFreelancer.price,
      rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
      projects: Math.floor(Math.random() * 50) + 10,
      video: selectedFreelancer.video,
      thumbnail: selectedFreelancer.thumbnail
    });
    window.location.href = `../Profile.html?${params.toString()}`;
  };

  return (
    <div style={{ backgroundColor: '#000066', color: 'white', paddingBottom: '50px', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      {/* --- INJECT STYLE TAG (Menjaga keaslian CSS Animasi & Responsive bawaan) --- */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-links a { text-decoration: none; color: white; font-size: 13px; font-weight: bold; transition: 0.3s; }
        .category-bar span {
          font-size: 11px; font-weight: bold; color: #000000; background-color: #ccff00;
          white-space: nowrap; cursor: pointer; padding: 8px 16px; border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: inline-block;
        }
        .category-bar span:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(204, 255, 0, 0.3); opacity: 0.9; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .category-bar span.active { background-color: #ffffff; color: #000066; transform: scale(1.05); box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2); }
        
        .card { 
          display: flex; 
          flex-direction: column; 
          width: 100%; 
          max-width: 240px; 
          margin: 0 auto; 
          animation: fadeInUp 0.4s ease forwards; 
          background-color: #ffffff; 
          color: #000000;            
          border-radius: 24px;      
          padding: 12px;             
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); 
          font-family: 'Poppins', sans-serif;
        }

        .card-image { 
          background-color: #cccccc; 
          height: 320px; 
          border-radius: 18px;       
          width: 100%; 
          transition: transform 0.3s; 
          cursor: pointer; 
          overflow: hidden; 
        }

        .card-image:hover { transform: scale(1.02); }
        @media (max-width: 768px) {
          .modal-content-reels { flex-direction: column !important; max-width: 380px !important; height: 85vh !important; }
          .video-side-reels { flex: 1.2 !important; }
          .info-side-reels { flex: 1 !important; padding: 15px !important; }
        }
      `}</style>

      {/* --- HEADER & NAVBAR --- */}
      <header style={{ width: '100%' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', height: '70px' }}>
          <div
            style={{ color: '#ccff00', fontSize: '26px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-1px', cursor: 'pointer' }}
            onClick={() => onChangePage('landing')}
            title="Kembali ke Landing Page"
          >FreeLanZ</div>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '25px' }}>
            <li>
              <a
                href="#explore"
                style={{ textDecoration: 'none', color: currentPage === 'explore' ? '#ccff00' : 'white', fontSize: '13px', fontWeight: 'bold' }}
                onClick={(e) => { e.preventDefault(); onChangePage('explore'); }}
              >EXPLORE</a>
            </li>
            <li>
              <a
                href="#chat"
                style={{ textDecoration: 'none', color: currentPage === 'chat' ? '#ccff00' : 'white', fontSize: '13px', fontWeight: 'bold' }}
                onClick={(e) => { e.preventDefault(); onChangePage('chat'); }}
              >CHAT</a>
            </li>
            <li>
              <a
                href="#project"
                style={{ textDecoration: 'none', color: currentPage === 'project' ? '#ccff00' : 'white', fontSize: '13px', fontWeight: 'bold' }}
                onClick={(e) => { e.preventDefault(); onChangePage('project'); }}
              >PROJECT</a>
            </li>
          </ul>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: '600', color: 'white', cursor: 'pointer' }}
            onClick={() => onChangePage?.('profile')}
          >
            <span>{currentUser ? currentUser.name.toUpperCase() : "LINATA SATORO"}</span>
            <div style={{ width: '35px', height: '35px', backgroundColor: '#e0e0e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', overflow: 'hidden' }}>
              {currentUser && currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl.startsWith('http') ? currentUser.avatarUrl : `http://localhost:5000${currentUser.avatarUrl}`}
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <i className="fas fa-user"></i>
              )}
            </div>
          </div>
        </nav>

        {/* --- CATEGORY BAR --- */}
        <div className="category-bar" style={{ backgroundColor: '#000044', display: 'flex', justifyContent: 'center', gap: '15px', padding: '14px 20px', overflowX: 'auto', borderBottom: '1px solid rgba(204, 255, 0, 0.2)' }}>
          {categories.map(cat => (
            <span key={cat} className={currentCategory === cat ? 'active' : ''} onClick={() => setCurrentCategory(cat)}>
              {cat}
            </span>
          ))}
        </div>

        {/* --- SEARCH BAR --- */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 5% 10px 5%' }}>
          <div style={{ background: 'white', display: 'flex', alignItems: 'center', padding: '12px 25px', borderRadius: '12px', width: '100%', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}>
            <i className="fas fa-search" style={{ color: '#999', marginRight: '15px', fontSize: '18px' }}></i>
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: '#333' }}
            />
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main style={{ maxWidth: '1200px', margin: '20px auto 0 auto', padding: '0 5%' }}>

        {/* SECTION 1: TOP FREELANCER */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#ccff00', fontSize: '32px', fontWeight: 'bold' }}>Our top Freelancer!</h2>
            {!isSearching && (
              <a href="javascript:void(0)" style={{ color: '#ccff00', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '5px' }} onClick={() => setIsTopExpanded(!isTopExpanded)}>
                {isTopExpanded ? 'Show Less' : 'Show All'}
                <i className="fas fa-chevron-right" style={{ transform: isTopExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}></i>
              </a>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px', marginBottom: '30px' }}>
            {displayTopData.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#aaa', padding: '20px' }}>No talents found.</div>
            ) : (
              displayTopData.map((f, index) => (
                <div className="card" key={index}>
                  <div className="card-image" onClick={() => handleOpenReels(f)}>
                    <img src={f.thumbnail} alt={`Thumbnail ${f.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'block', marginTop: '15px', paddingLeft: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <img src={f.avatar} className="avatar" alt={f.name} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ccff00', objectFit: 'cover' }} />
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{f.name}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#000000', fontWeight: 'bold', display: 'block' }}>{f.role}</div>
                    <span style={{ fontSize: '11px', color: '#000000', display: 'block', marginTop: '4px', opacity: 0.9, lineHeight: 1.3 }}>{f.description}</span>
                    <span style={{ fontSize: '11px', color: '#000000', marginTop: '3px', display: 'block' }}><i className="fas fa-star" style={{ color: '#ffcc00', marginRight: '4px' }}></i>{f.rating}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <hr style={{ border: '0', borderTop: '2px solid #ccff00', opacity: 0.3, margin: '40px 0' }} />

        {/* SECTION 2: MATCHES BUDGET */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#ccff00', fontSize: '32px', fontWeight: 'bold' }}> Found Your Matches !</h2>
            {!isSearching && (
              <a href="javascript:void(0)" style={{ color: '#ccff00', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '5px' }} onClick={() => setIsBudgetExpanded(!isBudgetExpanded)}>
                {isBudgetExpanded ? 'Show Less' : 'Show All'}
                <i className="fas fa-chevron-right" style={{ transform: isBudgetExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}></i>
              </a>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px', marginBottom: '30px' }}>
            {displayBudgetData.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'rgb(132, 128, 128)', padding: '20px' }}>No talents found.</div>
            ) : (
              displayBudgetData.map((f, index) => (
                <div className="card" key={index}>
                  <div className="card-image" onClick={() => handleOpenReels(f)}>
                    <img src={f.thumbnail} alt={`Thumbnail ${f.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'block', marginTop: '15px', paddingLeft: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <img src={f.avatar} alt={f.name} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ccff00', objectFit: 'cover' }} />
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{f.name}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#000000', fontWeight: 'bold', display: 'block' }}>{f.role}</div>
                    <span style={{ fontSize: '11px', color: '#000000', marginTop: '3px', display: 'block' }}><i className="fas fa-star" style={{ color: '#ffcc00', marginRight: '4px' }}></i>{f.rating}</span>
                    <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#000000', marginTop: '5px', display: 'block' }}>Start from <b>{f.price}</b></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* --- POPUP REELS MODAL --- */}
      {isReelsOpen && selectedFreelancer && (
        <div style={{ display: 'flex', position: 'fixed', zIndex: 1000, top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(8px)' }} onClick={handleCloseReels}>
          <div className="modal-content-reels" style={{ position: 'relative', display: 'flex', width: '90%', maxWidth: '750px', height: '80vh', background: '#000', borderRadius: '25px', overflow: 'hidden', border: '2px solid rgba(255, 255, 255, 0.1)' }} onClick={(e) => e.stopPropagation()}>

            {/* Sisi Kiri: Video */}
            <div className="video-side-reels" style={{ position: 'relative', flex: 1, height: '100%', background: '#000' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '25px',
                  left: '25px',
                  width: '42px',
                  height: '42px',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '2px solid #ffffff',
                  borderRadius: '14px', /* Membuat sudut agak melengkung kotak rounded sesuai gambar */
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  transition: 'transform 0.2s, background 0.2s'
                }}
                onClick={handleCloseReels}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
              >
                {/* Ikon Panah Kembali (Back Arrow SVG) */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </div>
              <video ref={videoRef} src={selectedFreelancer.video} loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
            </div>

            {/* Sisi Kanan: Panel Info */}
            <div className="info-side-reels" style={{ flex: 1, background: 'white', color: '#333333', padding: '30px', display: 'flex', flexDirection: 'column', overflowY: 'auto', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>

              {/* Header Info: Nama, Role, Lokasi & Tombol Hire */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={selectedFreelancer.avatar} alt="Avatar" style={{ width: '55px', height: '55px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>{selectedFreelancer.name}</div>
                    <div style={{ fontSize: '13px', color: '#555', marginTop: '2px', fontWeight: '500' }}>{selectedFreelancer.role}</div>
                  </div>
                </div>
                <button style={{ background: '#2563eb', color: 'white', padding: '8px 24px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }} onClick={handleOpenProjectModal}>Hire Me</button>
              </div>

              {/* Sub-header: Rating & Lokasi */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '11px', color: '#666', marginBottom: '25px', paddingLeft: '5px' }}>
                <span><i className="fas fa-star" style={{ color: '#ffcc00', marginRight: '4px' }}></i><b>5</b> <span style={{ color: '#aaa' }}>(123 Reviews)</span></span>
                <span><i className="fas fa-map-marker-alt" style={{ marginRight: '4px', color: '#2563eb' }}></i> {selectedFreelancer.location || 'Jakarta'}</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: '20px' }} />

              {/* Section: About Me */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000', marginBottom: '8px' }}>About Me</div>
                <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6', textAlign: 'justify' }}>
                  {selectedFreelancer.aboutMe || 'I make videos that go viral. Specialized in short-form content for TikTok, Instagram Reels, and YouTube Shorts with engaging captions and transitions.'}
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: '20px' }} />

              {/* Section: Expertise (Tags) */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000', marginBottom: '10px' }}>Expertise</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Content Creation', 'Social Media Specialist', 'KOL'].map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '11px', color: '#555', backgroundColor: '#f3f4f6', padding: '6px 14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontWeight: '500' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: '20px' }} />

              {/* BARU!! Section: Top Feedback Tags (Sesuai Gambar Mockup) */}
              <div style={{ marginBottom: '25px' }}>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#000', marginBottom: '12px' }}>Top Feedback Tags</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['#GREATPERSONALITY', '#GOODCOLLABORATION'].map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '10px', color: '#444', backgroundColor: '#f8fafc', padding: '8px 18px', borderRadius: '20px', border: '1px solid #cbd5e1', fontWeight: '600', letterSpacing: '0.3px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: '20px' }} />

              {/* Section: Recent Work & Portfolio Link */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000', marginBottom: '12px' }}>Recent Work</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  {/* Placeholder box abu-abu sesuai mock-up */}
                  <div style={{ width: '100%', height: '85px', backgroundColor: '#cccccc', borderRadius: '12px' }}></div>
                  <div style={{ width: '100%', height: '85px', backgroundColor: '#cccccc', borderRadius: '12px' }}></div>
                </div>
                <a href="#portfolio" style={{ fontSize: '11px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }} onClick={(e) => { e.preventDefault(); handleGoToProfile(); }}>
                  Portfolio Link
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- NEW PROJECT REQUEST MODAL --- */}
      {isProjectModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', zIndex: 1100, top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' }} onClick={() => setIsProjectModalOpen(false)}>
          <div style={{ position: 'relative', width: '90%', maxWidth: '550px', height: 'auto', background: 'white', color: '#000066', padding: '30px', display: 'flex', flexDirection: 'column', borderRadius: '25px' }} onClick={(e) => e.stopPropagation()}>

            <span style={{ position: 'absolute', top: '20px', right: '25px', fontSize: '24px', cursor: 'pointer', color: '#333', fontWeight: 'bold' }} onClick={() => setIsProjectModalOpen(false)}>&times;</span>

            <h2 style={{ color: '#000066', fontSize: '28px', marginBottom: '25px', fontWeight: 800 }}>New Project Request</h2>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Project Title<span style={{ color: 'red' }}>*</span></label>
                <input type="text" placeholder="Enter project title" required value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Category<span style={{ color: 'red' }}>*</span></label>
                <select
                  required
                  value={projectCategory}
                  onChange={(e) => setProjectCategory(e.target.value)}
                  style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '10px', fontSize: '14px', outline: 'none', background: 'white', appearance: 'none', WebkitAppearance: 'none', backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                >
                  <option value="" disabled>Choose a category</option>
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Description<span style={{ color: 'red' }}>*</span></label>
                <textarea placeholder="Describe your project requirements" rows="4" required value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '10px', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit' }}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Budget<span style={{ color: 'red' }}>*</span></label>
                  <input type="text" placeholder="e.g. 500" required value={projectBudget} onChange={(e) => setProjectBudget(e.target.value)} style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Deadline<span style={{ color: 'red' }}>*</span></label>
                  <input type="date" required value={projectDeadline} onChange={(e) => setProjectDeadline(e.target.value)} style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '10px', fontSize: '14px', outline: 'none', color: '#666' }} />
                </div>
              </div>

              <button type="submit" style={{ marginTop: '15px', background: '#ccff00', color: '#000066', border: 'none', padding: '15px', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(204, 255, 0, 0.3)', transition: 'transform 0.2s' }}>
                Send Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- POPUP SUCCESS REQUEST MODAL --- */}
      {isSuccessOpen && (
        <div style={{ display: 'flex', position: 'fixed', zIndex: 1200, top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setIsSuccessOpen(false)}>
          <div style={{ position: 'relative', width: '90%', maxWidth: '400px', background: 'white', padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '25px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>

            {/* Lingkaran Hijau & Centang */}
            <div style={{ width: '100px', height: '100px', backgroundColor: '#2ecc71', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', boxShadow: '0 4px 10px rgba(46, 204, 113, 0.3)' }}>
              <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            {/* Teks Deskripsi */}
            <h3 style={{ color: '#000066', fontSize: '22px', fontWeight: '800', marginBottom: '30px', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
              New Project Deliver!
            </h3>

            {/* Tombol Continue */}
            <button
              onClick={handleContinueToChat}
              style={{ background: '#ccff00', color: '#000', border: 'none', padding: '12px 35px', borderRadius: '25px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s', width: '100%', maxWidth: '220px', boxShadow: '0 4px 10px rgba(204, 255, 0, 0.2)' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Continue to chat
            </button>

          </div>
        </div>
      )}
    </div>
  );
}