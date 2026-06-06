import React, { useState } from 'react';

const ProjectEvaluation = ({onChangePage}) => {
  const [currentUser, setCurrentUser] = useState(null);
  // State untuk melacak jumlah bintang yang dipilih
  const [rating, setRating] = useState(0);
  // State untuk menampilkan/menyembunyikan popup sukses
  const [showPopup, setShowPopup] = useState(false);
  // State untuk menampung teks kritik & saran
  const [comment, setComment] = useState('');

  React.useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  // Fungsi untuk menangani klik pada bintang
  const handleStarClick = (value) => {
    setRating(value);
  };

  // Fungsi untuk submit ulasan
  const submitRating = () => {
    localStorage.setItem('isProjectRated', 'true');
    localStorage.setItem('projectStep', '4');
    setShowPopup(true);
  };

  // --- STYLES (Dipertahankan 100% sesuai CSS Asli) ---
  const styles = {
    bodyWrapper: {
      backgroundColor: '#f4f7f9',
      color: '#333',
      fontFamily: "'Segoe UI', sans-serif",
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    },
    header: {
      width: '100%',
      backgroundColor: '#000066'
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 5%'
    },
    logo: {
      color: '#ccff00',
      fontSize: '26px',
      fontWeight: 900,
      fontStyle: 'italic'
    },
    navLinks: {
      display: 'flex',
      listStyle: 'none',
      gap: '25px',
      margin: 0,
      padding: 0
    },
    navLinkA: {
      textDecoration: 'none',
      color: 'white',
      fontSize: '13px',
      fontWeight: 'bold'
    },
    navLinkActive: {
      color: '#ccff00'
    },
    userProfile: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: 'white',
      fontSize: '13px',
      cursor: 'pointer'
    },
    userIcon: {
      width: '35px',
      height: '35px',
      backgroundColor: '#e0e0e0',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#333'
    },
    mainWrapper: {
      maxWidth: '600px',
      margin: '40px auto',
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    headerProject: {
      marginBottom: '30px'
    },
    badge: {
      background: '#008080',
      color: 'white',
      padding: '5px 12px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: 'bold'
    },
    h1: {
      margin: '10px 0',
      fontSize: '24px',
      color: '#000'
    },
    collab: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '15px',
      fontSize: '14px'
    },
    ratingSection: {
      borderTop: '1px solid #eee',
      paddingTop: '20px',
      textAlign: 'center'
    },
    stars: {
      fontSize: '40px',
      cursor: 'pointer',
      color: '#ccc',
      margin: '15px 0',
      display: 'block'
    },
    starSpan: {
      cursor: 'pointer',
      transition: 'color 0.2s'
    },
    starActive: {
      color: '#ffcc00'
    },
    label: {
      display: 'block',
      textAlign: 'left',
      fontWeight: 'bold',
      marginTop: '10px'
    },
    textarea: {
      width: '100%',
      height: '120px',
      margin: '15px 0',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      resize: 'none',
      fontFamily: 'inherit'
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '15px'
    },
    button: {
      padding: '12px 25px',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '14px'
    },
    btnCancel: {
      background: 'transparent',
      border: '1px solid #ccc'
    },
    btnSubmit: {
      background: '#000066',
      color: 'white'
    },
    successPopup: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(255,255,255,0.9)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    },
    popupIcon: {
      fontSize: '80px',
      color: '#2ecc71',
      marginBottom: '20px'
    },
    popupH2: {
      color: '#000066',
      marginBottom: '20px'
    },
    popupBtn: {
      background: '#ccff00',
      border: 'none',
      padding: '12px 30px',
      borderRadius: '25px',
      fontWeight: 'bold',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.bodyWrapper}>
      {/* --- NAVBAR --- */}
      <header style={styles.header}>
        <nav style={styles.navbar}>
          <div style={styles.logo}>FreeLanZ</div>
          <ul style={styles.navLinks}>
            {/* Navigasi via Prop React */}
            <li><a href="#" style={styles.navLinkA} onClick={(e) => { e.preventDefault(); onChangePage?.('explore'); }}>EXPLORE</a></li>
            <li><a href="#" style={styles.navLinkA} onClick={(e) => { e.preventDefault(); onChangePage?.('chat'); }}>CHAT</a></li>
            <li><a href="#" style={{ ...styles.navLinkA, ...styles.navLinkActive }} onClick={(e) => { e.preventDefault(); onChangePage?.('project'); }}>PROJECT</a></li>
          </ul>
          <div style={styles.userProfile}>
            <span>{currentUser ? currentUser.name.toUpperCase() : "LINATA SATORO"}</span>
            <div style={styles.userIcon}>
              <i className="fas fa-user"></i>
            </div>
          </div>
        </nav>
      </header>

      {/* --- CONTENT --- */}
      <div style={styles.mainWrapper}>
        <div style={styles.headerProject}>
          <span style={styles.badge}>PROJECT DONE</span>
          <h1 style={styles.h1}>MOBILE APP COFFEE</h1>
          <p>Project #FLZ-2024-001 - Last Update: 10m ago</p>
          <div style={styles.collab}>
            <span>Collaboration with</span>
            <strong>Elena Visions</strong>
          </div>
        </div>

        {/* --- RATING --- */}
        <div style={styles.ratingSection}>
          <h2>Berikan Penilaian!</h2>
          <p>Berikan penilaian terhadap freelancer anda:</p>

          <div style={styles.stars}>
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                style={{
                  ...styles.starSpan,
                  ...(rating >= value ? styles.starActive : {})
                }}
                onClick={() => handleStarClick(value)}
              >
                &#9733;
              </span>
            ))}
          </div>

          <label style={styles.label}>Kritik & saran!</label>
          <textarea
            placeholder="Tuliskan pengalaman anda secara detail"
            style={styles.textarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <div style={styles.actions}>
            {/* FIX: Menggunakan onChangePage untuk kembali */}
            <button
              style={{ ...styles.button, ...styles.btnCancel }}
              onClick={() => { 
                if(onChangePage) onChangePage('project');
                else window.location.reload();
              }}
            >
              Batal
            </button>
            <button
              style={{ ...styles.button, ...styles.btnSubmit }}
              onClick={submitRating}
            >
              Kirim Ulasan! &gt;
            </button>
          </div>
        </div>
      </div>

      {/* --- SUCCESS POPUP --- */}
      {showPopup && (
        <div style={styles.successPopup}>
          <div style={styles.popupIcon}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 style={styles.popupH2}>Rating successfully submitted</h2>
          {/* FIX: Menggunakan onChangePage untuk kembali ke halaman project */}
          <button
            style={styles.popupBtn}
            onClick={() => { 
              if(onChangePage) onChangePage('project');
              else window.location.reload();
            }}
          >
            Back to mainpage!
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectEvaluation;