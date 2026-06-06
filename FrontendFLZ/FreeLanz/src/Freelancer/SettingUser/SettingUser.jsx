import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../../api';

const resolveAvatarUrl = (url) => {
  if (!url) return 'https://i.pravatar.cc/300?u=kim';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `http://localhost:5000${url}`;
};

const SettingUser = ({ onChangePage, currentPage }) => {
  // --- STATE MANAGEMENT ---
  const [name, setName] = useState('Kim Veny');
  const [title, setTitle] = useState('Professional UI/UX Designer');
  const [bio, setBio] = useState(
    'An innovative UI/UX Designer with a passion for building the next generation of digital products. By combining modern design principles with a futuristic visual approach, I help brands redefine their digital identity through immersive interfaces and high-impact design solutions that leave a lasting impression on every user.'
  );
  const [tags, setTags] = useState([
    '#Motion Graphics',
    '#Branding',
    '#UI Design',
    '#UX Design'
  ]);
  const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/300?u=kim');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // --- 1. MEMUAT DATA DARI API / LOCALSTORAGE ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await API.get('/auth/profile');
          const user = response.data;
          if (user.name) setName(user.name);
          if (user.bio) setBio(user.bio);
          if (user.skills) {
            try {
              const parsedSkills = user.skills.startsWith('[') ? JSON.parse(user.skills) : user.skills.split(',').map(s => s.trim());
              setTags(parsedSkills);
            } catch (e) {
              setTags(user.skills.split(',').map(s => s.trim()));
            }
          }
          if (user.avatarUrl) {
            setProfileImage(user.avatarUrl);
          }
          // Save a copy to local storage
          const profileData = {
            name: user.name,
            title: 'Professional UI/UX Designer',
            bio: user.bio,
            tags: user.skills ? (user.skills.startsWith('[') ? JSON.parse(user.skills) : user.skills.split(',').map(s => s.trim())) : [],
            profileImage: user.avatarUrl
          };
          localStorage.setItem('userProfile', JSON.stringify(profileData));
        } catch (err) {
          console.error("Failed to fetch profile from API, loading from localStorage", err);
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const savedData = localStorage.getItem('userProfile');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          if (data.name) setName(data.name);
          if (data.title) setTitle(data.title);
          if (data.bio) setBio(data.bio);
          if (data.tags) setTags(data.tags);
          if (data.profileImage) setProfileImage(data.profileImage);
        } catch (e) {
          console.error('Failed to load userProfile from localStorage:', e);
        }
      }
    };

    fetchProfile();
  }, []);

  // --- 2. LOGIKA PENYIMPANAN ---
  const handleSave = async () => {
    const profileData = { name, title, bio, tags, profileImage };
    localStorage.setItem('userProfile', JSON.stringify(profileData));

    // Update 'user' key in localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        user.name = name;
        user.bio = bio;
        user.avatarUrl = profileImage;
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.error(e);
      }
    }

    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        await API.put('/auth/profile', {
          name,
          bio,
          skills: JSON.stringify(tags),
          avatarUrl: profileImage
        });
      } catch (err) {
        console.error("Failed to save profile to backend", err);
      }
    }

    window.dispatchEvent(new StorageEvent('storage', { key: 'userProfile' }));
    alert('Profil berhasil disimpan!');
  };

  // --- LOGIKA UPLOAD FOTO ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show immediate local preview
    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);

    const token = localStorage.getItem('access_token');
    if (token) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await API.post('/upload/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const uploadedUrl = response.data.url;
        setProfileImage(uploadedUrl);

        // Instantly update local storage
        const savedData = localStorage.getItem('userProfile');
        const parsed = savedData ? JSON.parse(savedData) : {};
        parsed.profileImage = uploadedUrl;
        localStorage.setItem('userProfile', JSON.stringify(parsed));
        window.dispatchEvent(new StorageEvent('storage', { key: 'userProfile' }));
      } catch (err) {
        console.error("Failed to upload avatar to server", err);
        alert("Gagal mengunggah foto ke server. Foto hanya akan disimpan secara lokal.");
        // local fallback: convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result;
          setProfileImage(base64Data);
          const savedData = localStorage.getItem('userProfile');
          const parsed = savedData ? JSON.parse(savedData) : {};
          parsed.profileImage = base64Data;
          localStorage.setItem('userProfile', JSON.stringify(parsed));
          window.dispatchEvent(new StorageEvent('storage', { key: 'userProfile' }));
        };
        reader.readAsDataURL(file);
      } finally {
        setUploading(false);
      }
    } else {
      // Local fallback (no token)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setProfileImage(base64Data);
        const savedData = localStorage.getItem('userProfile');
        const parsed = savedData ? JSON.parse(savedData) : {};
        parsed.profileImage = base64Data;
        localStorage.setItem('userProfile', JSON.stringify(parsed));
        window.dispatchEvent(new StorageEvent('storage', { key: 'userProfile' }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 3. LOGIKA TOMBOL LOGOUT ---
  const handleLogout = () => {
    window.location.href = 'chooseRole';
  };

  // --- 4. LOGIKA TAMBAH & HAPUS TAG ---
  const handleAddTag = () => {
    const tagName = prompt('Masukkan nama tag baru:');
    if (tagName && tagName.trim() !== '') {
      const formattedName = tagName.startsWith('#') ? tagName.trim() : '#' + tagName.trim();
      setTags([...tags, formattedName]);
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
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
            --card-bg: #FFFFFF;
            --grey-text: #666666;
            --input-bg: #F3F4F6;
            --btn-blue: #1D1D9B;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }

        .setting-user-body {
            background-color: var(--bg-dark);
            color: white;
            min-height: 100vh;
            width: 100%;
            display: flex;
        }

        .container {
            display: flex;
            width: 100%;
            min-height: 100vh;
        }



        .main-content {
            flex: 1;
            padding: 2rem 3rem; 
            align-self: flex-start;
        }

        .header-profile {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .header-profile h1 { font-size: 2rem; font-weight: 700; color: white;}

        .btn-save {
            background: var(--accent-lime);
            color: black;
            border: none;
            padding: 12px 40px;
            border-radius: 10px;
            font-weight: 800;
            cursor: pointer;
            font-size: 0.9rem;
        }

        .profile-grid {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 2.5rem;
            align-items: start;
        }

        .profile-left { display: flex; flex-direction: column; gap: 1.5rem; }

        /* PERBAIKAN DI SINI: Ditambahkan color eksplisit agar teks nama tidak mewarisi warna putih dari body */
        .card-avatar {
            background: white;
            border-radius: 24px;
            padding: 2.5rem 1.5rem;
            text-align: center;
            color: var(--text-dark); /* Mengunci warna teks agar tetap gelap (#000033) */
        }

        .card-avatar h2 { 
            font-size: 1.8rem; 
            margin-bottom: 5px; 
            color: var(--text-dark); /* Memastikan tag h2 berwarna gelap */
        }

        .avatar-wrapper {
            position: relative;
            width: 160px;
            height: 160px;
            margin: 0 auto 1.5rem;
        }

        .avatar-wrapper img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 5px solid var(--accent-lime);
            object-fit: cover;
        }

        .card-avatar p { color: var(--grey-text); margin-bottom: 1.5rem; font-size: 0.9rem; }

        .btn-change-photo {
            background: var(--btn-blue);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 12px;
            font-weight: 600;
            width: 100%;
            cursor: pointer;
        }

        .card-stats {
            background: white;
            border-radius: 24px;
            padding: 1.5rem;
            color: var(--text-dark);
        }

        .stat-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 0.9rem;
        }

        .stat-label { color: var(--grey-text); font-weight: 500; }
        .stat-value { font-weight: 700; }

        .card-form {
            background: white;
            border-radius: 24px;
            padding: 2.5rem;
            color: var(--text-dark);
        }

        .form-group { margin-bottom: 1.5rem; }
        .form-group label {
            display: block;
            font-size: 0.85rem;
            color: #999;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .form-group input, .form-group textarea {
            width: 100%;
            background: var(--input-bg);
            border: none;
            padding: 15px;
            border-radius: 12px;
            font-size: 0.95rem;
            font-weight: 500;
            color: var(--text-dark);
            outline: none;
        }

        .form-group textarea { height: 120px; resize: none; line-height: 1.6; }

        .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
        }

        .tag {
            background: var(--accent-lime);
            color: black;
            padding: 8px 15px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .tag i { cursor: pointer; font-size: 0.7rem; }

        .btn-add-tag {
            background: var(--input-bg);
            color: #999;
            border: none;
            padding: 8px 15px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
        }
      `}</style>

      <div className="setting-user-body">
        <div className="container">
          {/* --- SIDEBAR --- */}
          <Sidebar onChangePage={onChangePage} currentPage={currentPage} />

          {/* --- MAIN CONTENT --- */}
          <main className="main-content">
            <header className="header-profile">
              <h1>Profile Settings</h1>
              <button className="btn-save" onClick={handleSave}>Save Change</button>
            </header>

            <div className="profile-grid">
              {/* Left Side: Avatar & Stats */}
              <div className="profile-left">
                <div className="card-avatar">
                  <div className="avatar-wrapper">
                    <img src={resolveAvatarUrl(profileImage)} alt="Profile Picture" />
                  </div>
                  <h2 className="sync-name">{name}</h2>
                  <p className="sync-title">{title}</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <button 
                    className="btn-change-photo" 
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Change Photo'}
                  </button>
                </div>

                <div className="card-stats">
                  <div className="stat-row">
                    <span className="stat-label">Quick Stats</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Member Since</span>
                    <span className="stat-value">Jan 2024</span>
                  </div>
                  <div className="stat-row" style={{ marginBottom: 0 }}>
                    <span className="stat-label">Response Time</span>
                    <span className="stat-value">Within 1 hr</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="card-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label>Professional Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label>Tag</label>
                  <div className="tags-container">
                    {tags.map((tag, index) => (
                      <div className="tag" key={index}>
                        {tag}{' '}
                        <i 
                          className="fas fa-times remove-tag" 
                          onClick={() => handleRemoveTag(index)}
                        ></i>
                      </div>
                    ))}
                    <button type="button" className="btn-add-tag" onClick={handleAddTag}>
                      + Add Tag
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default SettingUser;