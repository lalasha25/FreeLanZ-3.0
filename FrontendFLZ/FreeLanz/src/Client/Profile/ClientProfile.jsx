import { useState, useEffect, useRef } from "react";
import API from "../../api";

const INITIAL_USER = {
    name: "Linata Satoro",
    job: "Product Manager at Google",
    phone: "+62 812-3333-4444",
    email: "linata.satoro@gmail.com",
    bio: "Managing large-scale digital products by day, building passion projects by night. Looking for elite UI/UX designers and creative minds to help prototype next-gen mobile experiences and clean, interactive interfaces.",
    memberSince: "2023",
    avatarUrl: null,
};

export default function UserProfile({ onChangePage, currentPage }) {
    const [user, setUser] = useState(INITIAL_USER);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Edit Profile Modal
    const [showEdit, setShowEdit] = useState(false);
    const [draft, setDraft] = useState({});
    const [draftAvatar, setDraftAvatar] = useState(null);

    // Change Password Modal
    const [showPassword, setShowPassword] = useState(false);
    const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
    const [pwError, setPwError] = useState("");

    // Toast
    const [toast, setToast] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
        document.head.appendChild(link);

        const fetchUserProfile = async () => {
            try {
                const response = await API.get('/auth/profile');
                const fetchedUser = response.data;
                setUser((prev) => ({
                    ...prev,
                    ...fetchedUser,
                    bio: fetchedUser.bio || "",
                    phone: fetchedUser.phone || "",
                    email: fetchedUser.email || "",
                    name: fetchedUser.name || "",
                }));
                if (fetchedUser.avatarUrl) {
                    const avatarFullUrl = fetchedUser.avatarUrl.startsWith("http")
                        ? fetchedUser.avatarUrl
                        : `http://localhost:5000${fetchedUser.avatarUrl}`;
                    setAvatarPreview(avatarFullUrl);
                }
            } catch (err) {
                console.error("Gagal mengambil data profil dari backend, menggunakan local storage:", err);
                try {
                    const stored = localStorage.getItem("user");
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        setUser((prev) => ({ ...prev, ...parsed }));
                        if (parsed.avatarUrl) {
                            const avatarFullUrl = parsed.avatarUrl.startsWith("http")
                                ? parsed.avatarUrl
                                : `http://localhost:5000${parsed.avatarUrl}`;
                            setAvatarPreview(avatarFullUrl);
                        }
                    }
                } catch {}
            }
        };

        fetchUserProfile();

        return () => { document.head.removeChild(link); };
    }, []);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const openEditModal = () => {
        setDraft({ ...user });
        setDraftAvatar(avatarPreview);
        setShowEdit(true);
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);
        setDraftAvatar(localUrl);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await API.post("/upload/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const uploadedUrl = response.data.url;
            const fullUrl = `http://localhost:5000${uploadedUrl}`;
            setDraftAvatar(fullUrl);
            showToast("Foto profil berhasil diunggah!");
        } catch (err) {
            console.error("Gagal mengunggah foto profil:", err);
            showToast("Gagal mengunggah foto profil: " + (err.response?.data?.message || err.message), "error");
        }
    };

    const handleSaveProfile = async () => {
        if (!draft.name?.trim()) { showToast("Nama tidak boleh kosong!", "error"); return; }
        
        try {
            let avatarRelativeUrl = draftAvatar;
            if (draftAvatar && draftAvatar.includes("http://localhost:5000")) {
                avatarRelativeUrl = draftAvatar.replace("http://localhost:5000", "");
            }

            const response = await API.put("/auth/profile", {
                name: draft.name,
                phone: draft.phone || "",
                bio: draft.bio || "",
                avatarUrl: avatarRelativeUrl || "",
            });

            const updatedUser = response.data.user;

            setUser((prev) => ({
                ...prev,
                ...updatedUser,
            }));

            const stored = localStorage.getItem("user");
            if (stored) {
                const parsed = JSON.parse(stored);
                localStorage.setItem("user", JSON.stringify({
                    ...parsed,
                    ...updatedUser,
                }));
            }

            if (updatedUser.avatarUrl) {
                const avatarFullUrl = updatedUser.avatarUrl.startsWith("http")
                    ? updatedUser.avatarUrl
                    : `http://localhost:5000${updatedUser.avatarUrl}`;
                setAvatarPreview(avatarFullUrl);
            } else {
                setAvatarPreview(null);
            }

            setShowEdit(false);
            showToast("Profil berhasil diperbarui!");
        } catch (err) {
            console.error("Gagal menyimpan profil ke backend:", err);
            showToast("Gagal menyimpan profil: " + (err.response?.data?.message || err.message), "error");
        }
    };

    const handleSavePassword = async () => {
        setPwError("");
        if (!passwords.current) { setPwError("Password lama tidak boleh kosong."); return; }
        if (!passwords.newPass) { setPwError("Password baru tidak boleh kosong."); return; }
        if (passwords.newPass.length < 6) { setPwError("Password baru minimal 6 karakter."); return; }
        if (passwords.newPass !== passwords.confirm) { setPwError("Password baru dan konfirmasi tidak cocok."); return; }

        try {
            await API.put("/auth/change-password", {
                oldPassword: passwords.current,
                newPassword: passwords.newPass,
            });

            setPasswords({ current: "", newPass: "", confirm: "" });
            setShowPassword(false);
            showToast("Password berhasil diperbarui!");
        } catch (err) {
            console.error("Gagal memperbarui password di backend:", err);
            setPwError(err.response?.data?.message || "Password lama salah atau terjadi kesalahan pada server.");
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        onChangePage?.("landing");
    };

    return (
        <div style={styles.root}>
            <style>{css}</style>

            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <div style={styles.logo} onClick={() => onChangePage?.("landing")}>FreeLanZ</div>
                <ul style={styles.navLinks}>
                    {["explore", "chat", "project"].map((p) => (
                        <li key={p}>
                            <a
                                href={`#${p}`}
                                style={{ ...styles.navA, ...(currentPage === p ? styles.navAActive : {}) }}
                                onClick={(e) => { e.preventDefault(); onChangePage?.(p); }}
                            >
                                {p.toUpperCase()}
                            </a>
                        </li>
                    ))}
                </ul>
                <div style={styles.navUser}>
                    <span>{user.name.toUpperCase()}</span>
                    <div style={styles.navAvatar}>
                        {avatarPreview
                            ? <img src={avatarPreview} alt="av" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                            : <i className="fas fa-user" style={{ fontSize: 14 }} />}
                    </div>
                </div>
            </nav>

            {/* MAIN */}
            <main style={styles.main}>
                <div className="up-card">

                    {/* DECORATIVE TOP BAR */}
                    <div style={styles.topBar}>
                        <div style={styles.topBarDots} />
                        <div style={styles.topBarGlow} />
                        {/* floating circles */}
                        <div style={{ ...styles.floatCircle, width: 180, height: 180, top: -60, right: -40, opacity: 0.12 }} />
                        <div style={{ ...styles.floatCircle, width: 100, height: 100, bottom: -40, left: "35%", opacity: 0.07 }} />
                    </div>

                    {/* AVATAR overlapping bar */}
                    <div style={styles.avatarWrap}>
                        {avatarPreview
                            ? <img src={avatarPreview} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                            : <i className="fas fa-user" style={{ fontSize: 62, color: "#888" }} />}
                    </div>

                    {/* PROFILE HEADER */}
                    <div style={styles.profileHeader}>
                        <div style={styles.statsAndBtn}>
                            {/* MEMBER SINCE only */}
                            <div style={styles.statsRow}>
                                <div style={styles.statItem}>
                                    <span style={styles.statVal}>{user.memberSince}</span>
                                    <span style={styles.statLabel}>Member Since</span>
                                </div>
                            </div>
                            {/* EDIT BTN */}
                            <button className="up-edit-btn" onClick={openEditModal}>
                                <i className="fas fa-pen" /> Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* PROFILE INFO */}
                    <div style={styles.profileInfo}>
                        <h1 style={styles.userName}>{user.name}</h1>
                        <p style={styles.userJob}>{user.job}</p>

                        <div style={styles.contactRow}>
                            <div style={styles.contactItem}>
                                <div style={styles.contactIcon}>
                                    <i className="fas fa-phone" style={{ fontSize: 13, color: "#000066" }} />
                                </div>
                                <span>{user.phone}</span>
                            </div>
                            <div style={styles.contactItem}>
                                <div style={styles.contactIcon}>
                                    <i className="fas fa-envelope" style={{ fontSize: 13, color: "#000066" }} />
                                </div>
                                <span>{user.email}</span>
                            </div>
                        </div>

                        <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>Bio</p>
                            <p style={styles.bio}>{user.bio}</p>
                        </div>
                    </div>

                    {/* SIGN OUT */}
                    <div style={{ padding: "28px 45px 40px" }}>
                        <button className="up-signout-btn" onClick={handleSignOut}>
                            <i className="fas fa-arrow-right-from-bracket" /> Sign Out Account
                        </button>
                    </div>
                </div>
            </main>

            {/* ===================== EDIT PROFILE MODAL ===================== */}
            {showEdit && (
                <div className="up-overlay" onClick={(e) => { if (e.target.classList.contains("up-overlay")) setShowEdit(false); }}>
                    <div className="up-modal-card">
                        {/* Modal Header */}
                        <div style={styles.modalHeaderRow}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <button className="up-circle-btn" onClick={() => setShowEdit(false)}>
                                    <i className="fas fa-chevron-left" />
                                </button>
                                <h2 style={styles.modalTitle}>Profile Settings</h2>
                            </div>
                            <button className="up-save-btn" onClick={handleSaveProfile}>Save Change</button>
                        </div>

                        {/* Modal Body */}
                        <div style={styles.modalBody}>
                            {/* LEFT */}
                            <div style={styles.modalLeft}>
                                <div style={styles.modalAvatarFrame}>
                                    {draftAvatar
                                        ? <img src={draftAvatar} alt="prev" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                                        : <i className="fas fa-user" style={{ fontSize: 68, color: "#aaa" }} />}
                                </div>
                                <p style={{ fontWeight: 800, fontSize: 18, color: "#111", marginBottom: 4 }}>{draft.name || "—"}</p>
                                <p style={{ fontSize: 13, color: "#777", marginBottom: 24 }}>{draft.job || "—"}</p>
                                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleAvatarChange} />
                                <button className="up-action-btn up-btn-blue" onClick={() => fileInputRef.current?.click()}>
                                    <i className="fas fa-camera" /> Change Photo
                                </button>
                                <button className="up-action-btn up-btn-neon" onClick={() => { setShowEdit(false); setShowPassword(true); }}>
                                    <i className="fas fa-lock" /> Change Password
                                </button>
                            </div>

                            {/* RIGHT */}
                            <div style={styles.modalRight}>
                                {[
                                    { label: "Full Name", key: "name", type: "text" },
                                    { label: "Professional Title", key: "job", type: "text" },
                                ].map(({ label, key, type }) => (
                                    <div key={key} style={styles.formGroup}>
                                        <label style={styles.formLabel}>{label}</label>
                                        <input
                                            type={type}
                                            value={draft[key] || ""}
                                            onChange={(e) => setDraft((p) => ({ ...p, [key]: e.target.value }))}
                                            style={styles.formInput}
                                        />
                                    </div>
                                ))}

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    {[
                                        { label: "Phone Number", key: "phone", type: "text" },
                                        { label: "Email", key: "email", type: "email" },
                                    ].map(({ label, key, type }) => (
                                        <div key={key} style={styles.formGroup}>
                                            <label style={styles.formLabel}>{label}</label>
                                            <input
                                                type={type}
                                                value={draft[key] || ""}
                                                onChange={(e) => setDraft((p) => ({ ...p, [key]: e.target.value }))}
                                                style={styles.formInput}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Bio</label>
                                    <textarea
                                        value={draft.bio || ""}
                                        onChange={(e) => setDraft((p) => ({ ...p, bio: e.target.value }))}
                                        style={{ ...styles.formInput, minHeight: 110, resize: "vertical", lineHeight: 1.6 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===================== CHANGE PASSWORD MODAL ===================== */}
            {showPassword && (
                <div className="up-overlay" onClick={(e) => { if (e.target.classList.contains("up-overlay")) setShowPassword(false); }}>
                    <div className="up-pw-card">
                        <button className="up-close-x" onClick={() => setShowPassword(false)}>
                            <i className="fas fa-times" />
                        </button>
                        <h2 style={styles.pwTitle}>Change Password</h2>

                        {["current", "newPass", "confirm"].map((key) => (
                            <div key={key} style={{ ...styles.formGroup, marginBottom: 20 }}>
                                <label style={{ ...styles.formLabel, color: "#222", fontSize: 13, fontWeight: 600 }}>
                                    {{ current: "Current Password", newPass: "New Password", confirm: "Confirm Password" }[key]}
                                    <span style={{ color: "red" }}> *</span>
                                </label>
                                <input
                                    type="password"
                                    value={passwords[key]}
                                    onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                                    placeholder="••••••••"
                                    style={{ ...styles.formInput, border: "1.5px solid #ccc", background: "#fff" }}
                                />
                            </div>
                        ))}

                        {pwError && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12, fontWeight: 600 }}>{pwError}</p>}

                        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                            <button className="up-pw-save-btn" onClick={handleSavePassword}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST */}
            {toast && (
                <div className={`up-toast up-toast-${toast.type}`}>{toast.msg}</div>
            )}
        </div>
    );
}

/* ─── Inline styles (layout/structural) ─── */
const styles = {
    root: {
        background: "#00004d",
        minHeight: "100vh",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "fixed",
        top: 0, left: 0,
        zIndex: 999999,
        overflowY: "auto",
    },
    navbar: {
        width: "100%",
        background: "#00004d",
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 5%",
        flexShrink: 0,
    },
    logo: { color: "#ccff00", fontSize: 26, fontWeight: 900, fontStyle: "italic", letterSpacing: -1, cursor: "pointer" },
    navLinks: { display: "flex", listStyle: "none", gap: 25, margin: 0, padding: 0 },
    navA: { textDecoration: "none", color: "white", fontSize: 13, fontWeight: "bold" },
    navAActive: { color: "#ccff00" },
    navUser: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600, color: "white" },
    navAvatar: { width: 35, height: 35, background: "#e0e0e0", borderRadius: "50%", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", overflow: "hidden" },

    main: { flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "30px 5% 50px" },

    topBar: {
        height: 110,
        background: "linear-gradient(135deg, #000066 0%, #0000cc 55%, #000044 100%)",
        position: "relative",
        overflow: "hidden",
        borderRadius: "24px 24px 0 0",
    },
    topBarDots: {
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
    },
    topBarGlow: {
        position: "absolute", top: -80, left: "40%",
        width: 260, height: 260, borderRadius: "50%",
        background: "rgba(204,255,0,0.06)",
    },
    floatCircle: {
        position: "absolute", borderRadius: "50%",
        background: "rgba(204,255,0,1)",
    },

    avatarWrap: {
        position: "absolute",
        top: 42,
        left: 50,
        width: 130, height: 130,
        borderRadius: "50%",
        border: "5px solid #ccff00",
        background: "#e8e8e8",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        boxShadow: "0 6px 28px rgba(0,0,0,0.35)",
        zIndex: 2,
    },

    profileHeader: {
        display: "flex",
        justifyContent: "flex-end",
        padding: "18px 45px 0 45px",
        marginBottom: 10,
    },
    statsAndBtn: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 },
    statsRow: { display: "flex", alignItems: "center", gap: 0, background: "#f4f7fb", borderRadius: 14, border: "1px solid #e4e8ef", overflow: "hidden" },
    statItem: { padding: "14px 24px", textAlign: "center" },
    statVal: { display: "block", fontSize: 26, fontWeight: 900, color: "#000066", lineHeight: 1 },
    statLabel: { fontSize: 11, color: "#888", fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase", marginTop: 5, display: "block" },
    statDivider: { width: 1.5, height: 44, background: "#dde2ec" },

    profileInfo: { padding: "8px 45px 0 45px" },
    userName: { fontSize: 36, fontWeight: 900, color: "#000066", letterSpacing: -0.5, marginBottom: 6 },
    userJob: { fontSize: 15, color: "#666", fontWeight: 500, marginBottom: 22 },
    contactRow: { display: "flex", gap: 30, marginBottom: 22, flexWrap: "wrap" },
    contactItem: { display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#333", fontWeight: 500 },
    contactIcon: { width: 34, height: 34, background: "#eef1f7", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#000066", fontSize: 14 },
    bio: { fontSize: 14, color: "#555", lineHeight: 1.8, padding: "16px 20px", background: "#f8fafc", borderRadius: 12, borderLeft: "3px solid #ccff00", marginBottom: 20 },
    badges: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 },
    badge: { background: "#eef1ff", color: "#000066", fontSize: 11, fontWeight: 700, padding: "5px 13px", borderRadius: 20, border: "1px solid #d0d8ff", letterSpacing: 0.3 },

    // Modal
    modalHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
    modalTitle: { fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: 0.3 },
    modalBody: { display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: 24 },
    modalLeft: { background: "#fff", borderRadius: 18, padding: "36px 20px", display: "flex", flexDirection: "column", alignItems: "center", color: "#333", textAlign: "center" },
    modalAvatarFrame: { width: 140, height: 140, borderRadius: "50%", border: "4px solid #ccff00", outline: "3px solid #00004d", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, overflow: "hidden" },
    modalRight: { background: "#fff", borderRadius: 18, padding: "30px 28px", display: "flex", flexDirection: "column", gap: 16 },
    formGroup: { display: "flex", flexDirection: "column", gap: 6 },
    formLabel: { fontSize: 12, fontWeight: 700, color: "#aaa", letterSpacing: 0.3 },
    formInput: { background: "#f1f3f6", border: "none", padding: "11px 14px", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#222", outline: "none", fontFamily: "inherit", width: "100%" },

    // Password modal
    pwTitle: { fontSize: 26, fontWeight: 800, color: "#000066", marginBottom: 26, marginTop: 8 },
};

/* ─── CSS classes ─── */
const css = `
  .up-card {
    background: #ffffff;
    border-radius: 24px;
    width: 100%;
    max-width: 860px;
    box-shadow: 0 24px 70px rgba(0,0,80,0.45);
    border: 1px solid rgba(255,255,255,0.08);
    position: relative;
    overflow: visible;
  }

  /* edit btn */
  .up-edit-btn {
    background: #ccff00;
    color: #000;
    border: none;
    border-radius: 10px;
    padding: 11px 28px;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s, transform 0.15s;
    font-family: inherit;
  }
  .up-edit-btn:hover { background: #b3ff00; transform: translateY(-2px); }

  /* sign out btn */
  .up-signout-btn {
    width: 100%;
    background: #000066;
    color: #ff6b6b;
    border: none;
    border-radius: 14px;
    padding: 16px;
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: background 0.2s, transform 0.15s;
    font-family: inherit;
    letter-spacing: 0.3px;
  }
  .up-signout-btn:hover { background: #00004d; transform: translateY(-2px); }

  /* overlay */
  .up-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,50,0.82);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999998;
    padding: 20px;
    backdrop-filter: blur(3px);
  }

  /* edit modal card */
  .up-modal-card {
    background: #000080;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 28px;
    padding: 38px;
    width: 100%;
    max-width: 920px;
    max-height: 92vh;
    overflow-y: auto;
    box-shadow: 0 30px 80px rgba(0,0,0,0.6);
  }

  /* circle back btn */
  .up-circle-btn {
    background: transparent;
    border: 2px solid rgba(255,255,255,0.6);
    color: white;
    width: 34px; height: 34px;
    border-radius: 50%;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    transition: 0.2s;
    font-family: inherit;
  }
  .up-circle-btn:hover { background: rgba(255,255,255,0.12); }

  /* save btn */
  .up-save-btn {
    background: #ccff00;
    color: #00004d;
    border: none;
    padding: 11px 34px;
    border-radius: 11px;
    font-weight: 900;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s;
    font-family: inherit;
  }
  .up-save-btn:hover { transform: scale(1.03); background: #b3ff00; }

  /* action btns in left modal panel */
  .up-action-btn {
    width: 85%;
    padding: 11px 0;
    border-radius: 25px;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    border: none;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: 0.2s;
    font-family: inherit;
  }
  .up-action-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .up-btn-blue { background: #1a1aff; color: white; }
  .up-btn-neon { background: #ccff00; color: #00004d; }

  /* password modal */
  .up-pw-card {
    background: #fff;
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 500px;
    position: relative;
    color: #111;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  }
  .up-close-x {
    position: absolute;
    top: 22px; right: 22px;
    background: transparent;
    border: none;
    font-size: 18px;
    color: #777;
    cursor: pointer;
    transition: 0.2s;
    font-family: inherit;
  }
  .up-close-x:hover { color: #000; }

  .up-pw-save-btn {
    background: #ccff00;
    color: #000;
    border: none;
    padding: 14px 72px;
    border-radius: 30px;
    font-size: 20px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 5px 18px rgba(204,255,0,0.35);
    transition: 0.2s;
    font-family: inherit;
  }
  .up-pw-save-btn:hover { transform: scale(1.04); box-shadow: 0 7px 24px rgba(204,255,0,0.55); }

  /* toast */
  .up-toast {
    position: fixed;
    bottom: 28px; right: 28px;
    padding: 12px 22px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    z-index: 99999999;
    box-shadow: 0 6px 24px rgba(0,0,0,0.3);
    animation: up-slide-in 0.3s ease;
    font-family: 'Segoe UI', sans-serif;
  }
  .up-toast-success { background: #ccff00; color: #000; }
  .up-toast-error { background: #ef4444; color: white; }
  @keyframes up-slide-in {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* scrollbar on modal */
  .up-modal-card::-webkit-scrollbar { width: 6px; }
  .up-modal-card::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
`;