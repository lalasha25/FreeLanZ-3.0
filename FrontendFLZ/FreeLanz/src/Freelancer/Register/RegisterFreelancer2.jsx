import { useState, useEffect } from "react";
import API from "../../api";

const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

function LoadingModal() {
    return (
        <div style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(5px)",
            zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
        }}>
            <div style={{
                background: "white", borderRadius: "20px", padding: "50px 60px",
                textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "20px",
            }}>
                <div style={{
                    width: "50px", height: "50px",
                    border: "4px solid rgba(0,71,255,0.2)",
                    borderTop: "4px solid #0047ff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                }} />
                <p style={{ fontSize: "18px", fontWeight: 600, color: "#333", letterSpacing: "2px" }}>LOADING...</p>
            </div>
        </div>
    );
}

function SuccessModal({ onClose }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(5px)",
            zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
        }}>
            <div style={{
                background: "white", borderRadius: "20px", padding: "50px 60px",
                textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "15px",
                maxWidth: "400px", width: "90%",
            }}>
                <div style={{
                    width: "70px", height: "70px", backgroundColor: "#ccff00",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "40px", animation: "popIn 0.5s ease-out",
                }}>✓</div>
                <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#000", margin: "10px 0 0" }}>Registration Success!</h2>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#666", lineHeight: 1.5 }}>
                    Your account has been created successfully. Get ready to find amazing gigs!
                </p>
                <button
                    onClick={onClose}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{
                        width: "100%", backgroundColor: "#ccff00", border: "none",
                        borderRadius: "12px", padding: "15px", fontSize: "16px",
                        fontWeight: 800, color: "#000", cursor: "pointer", marginTop: "20px",
                        fontFamily: "'Poppins', sans-serif",
                        transition: "all 0.3s ease",
                        transform: hovered ? "translateY(-2px)" : "translateY(0)",
                        backgroundColor: hovered ? "#b8e600" : "#ccff00",
                    }}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default function RegisterFreelancer2({ onChangePage }) {
    const [form, setForm] = useState({
        fullName: "", email: "", phone: "",
        password: "", confirmPassword: "", location: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [hoveredSubmit, setHoveredSubmit] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Ambil data pendaftaran Step 1 dari localStorage
        const step1DataStr = localStorage.getItem("freelancer_reg_step1");
        if (step1DataStr) {
            try {
                const step1 = JSON.parse(step1DataStr);
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.contact || "");
                setForm(prev => ({
                    ...prev,
                    fullName: step1.fullName || "",
                    email: isEmail ? step1.contact : "",
                    phone: !isEmail ? step1.contact : "",
                }));
            } catch (e) {
                console.error("Gagal mengurai data step 1", e);
            }
        }
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const validate = () => {
        const newErrors = {};
        if (!/^[a-zA-Z\s]{3,}$/.test(form.fullName.trim()))
            newErrors.fullName = "Nama Lengkap harus minimal 3 karakter dan hanya huruf!";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
            newErrors.email = "Format Email tidak valid!";
        if (!/^(?:\+62|62|0)8[1-9][0-9]{7,11}$/.test(form.phone.replace(/\s+/g, "")))
            newErrors.phone = "Nomor Telepon tidak valid! Gunakan format Indonesia (e.g. 0812xxxxxxxx).";
        if (form.password.length < 8)
            newErrors.password = "Password minimal 8 karakter!";
        if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "Password dan Confirm Password tidak cocok!";
        if (!form.location.trim())
            newErrors.location = "Kolom Lokasi tidak boleh kosong!";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);

        let idPhotoUrl = "";
        let proposalUrl = "";

        // Ambil URL file yang diupload di Step 1
        const step1DataStr = localStorage.getItem("freelancer_reg_step1");
        if (step1DataStr) {
            try {
                const step1 = JSON.parse(step1DataStr);
                idPhotoUrl = step1.idPhotoUrl || "";
                proposalUrl = step1.proposalUrl || "";
            } catch (e) {
                console.error(e);
            }
        }

        try {
            await API.post("/auth/register/freelancer", {
                name: form.fullName,
                email: form.email,
                password: form.password,
                phone: form.phone || undefined,
                bio: `Location: ${form.location}`,
                skills: "",
                idPhotoUrl,
                proposalUrl,
            });
            setSuccess(true);
        } catch (err) {
            const errMsg = err.response?.data?.message || "Registrasi Freelancer gagal! Silakan periksa kembali data Anda.";
            setErrors({ apiError: Array.isArray(errMsg) ? errMsg.join(", ") : errMsg });
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessClose = () => {
        localStorage.removeItem("freelancer_reg_step1");
        setSuccess(false);
        onChangePage("freelancerDashboard");
    };

    const goBack = () => { onChangePage("registerFreelancer"); };

    const inputStyle = {
        width: "100%",
        backgroundColor: "#f8f9fa",
        border: "1.5px solid #e5e7eb",
        borderRadius: "12px",
        padding: "12px 16px",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 500, fontSize: "13px", color: "#333",
        outline: "none", transition: "all 0.3s ease",
    };

    const labelStyle = {
        display: "block", fontSize: "10px", fontWeight: 800,
        marginBottom: "8px", color: "#000", textTransform: "uppercase", letterSpacing: "0.5px",
    };

    const errorStyle = {
        color: "#ef4444", fontSize: "10px", fontWeight: 600, marginTop: "5px",
    };

    const PasswordField = ({ name, label, show, onToggle }) => (
        <div>
            <label style={labelStyle}>{label}</label>
            <div style={{ position: "relative" }}>
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    placeholder="••••••••"
                    value={form[name]}
                    onChange={handleChange}
                    required
                    style={{ ...inputStyle, paddingRight: "44px" }}
                />
                <button type="button" onClick={onToggle} style={{
                    position: "absolute", right: "14px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "#888",
                }}>
                    {show ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
            {errors[name] && <p style={errorStyle}>{errors[name]}</p>}
        </div>
    );

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
            <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .form-card::-webkit-scrollbar { width: 6px; }
        .form-card::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
        .form-input-el:focus { border-color: #0047ff !important; background-color: #fff !important; box-shadow: 0 0 8px rgba(0,71,255,0.1) !important; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @media (max-width: 1024px) {
          .reg-container { flex-direction: column !important; height: auto !important; }
          .left-panel { height: auto !important; }
          .right-wrapper { width: 100% !important; padding: 20px !important; }
          .form-card { height: auto !important; border-radius: 20px !important; padding: 30px !important; }
          .illustration { display: none !important; }
        }
      `}</style>

            {loading && <LoadingModal />}
            {success && <SuccessModal onClose={handleSuccessClose} />}

            <div style={{
                fontFamily: "'Poppins', sans-serif", minHeight: "100vh",
                backgroundColor: "#00016D",
                backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            }}>
                <div className="reg-container" style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", padding: "20px" }}>

                    {/* Left Panel */}
                    <div className="left-panel" style={{ flex: 1, padding: "40px 60px", display: "flex", flexDirection: "column", color: "#fff", height: "100%", justifyContent: "center" }}>
                        <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "5px" }}>Hi,</div>
                        <h1 style={{ fontSize: "64px", fontWeight: 800, lineHeight: 1, textTransform: "uppercase" }}>
                            WELCOME<br />LANZER!
                        </h1>
                        <p style={{ marginTop: "20px", fontSize: "22px", fontWeight: 600, maxWidth: "420px", lineHeight: 1.3, opacity: 0.9 }}>
                            Sign up now and start finding your best gigs with FreeLanZ!
                        </p>
                        <div className="illustration" style={{ marginTop: "60px", width: "100%", maxWidth: "400px" }}>
                            <svg viewBox="0 0 250 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="80" cy="40" r="18" stroke="white" strokeWidth="4" />
                                <path d="M40 110 C40 80 120 80 120 110" stroke="white" strokeWidth="4" fill="none" />
                                <line x1="20" y1="130" x2="220" y2="130" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                <g transform="translate(130, 85)">
                                    <path d="M0 45 L50 45 L70 0" stroke="white" strokeWidth="4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                                    <path d="M50 45 L85 45" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                </g>
                                <path d="M100 100 L140 115" stroke="white" strokeWidth="3" strokeDasharray="4 4" opacity="0.6" />
                            </svg>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="right-wrapper" style={{ flex: 0.9, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "20px" }}>
                        <div className="form-card" style={{
                            background: "#fff", width: "100%", maxWidth: "650px",
                            height: "calc(100% - 60px)", borderRadius: "30px", padding: "45px 60px",
                            display: "flex", flexDirection: "column",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)", overflowY: "auto",
                        }}>

                            {/* Top Nav */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px" }}>
                                <button onClick={goBack} style={{ color: "#888", fontWeight: 600, fontSize: "14px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: "5px" }}>
                                    Back
                                </button>
                                {/* Step indicator — both active */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    {[1, 2].map((step, i) => (
                                        <div key={step} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div style={{
                                                width: "26px", height: "26px", borderRadius: "50%",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontWeight: 800, fontSize: "11px",
                                                backgroundColor: "#ccff00", color: "#000",
                                            }}>{step}</div>
                                            {i === 0 && <div style={{ width: "20px", height: "2px", backgroundColor: "#ccff00" }} />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Header */}
                            <div style={{ marginBottom: "25px" }}>
                                <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#000", letterSpacing: "-0.5px" }}>PROFILE DETAILS</h2>
                                <p style={{ fontSize: "10px", fontWeight: 700, color: "#999", letterSpacing: "1px", textTransform: "uppercase" }}>COMPLETE YOUR ACCOUNT INFORMATION</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit}>

                                {/* Full Name */}
                                <div style={{ marginBottom: "18px" }}>
                                    <label style={labelStyle}>FULL NAME *</label>
                                    <input type="text" name="fullName" className="form-input-el" placeholder="Linata Satoro" value={form.fullName} onChange={handleChange} required style={inputStyle} />
                                    {errors.fullName && <p style={errorStyle}>{errors.fullName}</p>}
                                </div>

                                {/* Email + Phone row */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "18px" }}>
                                    <div>
                                        <label style={labelStyle}>EMAIL *</label>
                                        <input type="email" name="email" className="form-input-el" placeholder="linata@gmail.com" value={form.email} onChange={handleChange} required style={inputStyle} />
                                        {errors.email && <p style={errorStyle}>{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label style={labelStyle}>PHONE NUMBER *</label>
                                        <input type="text" name="phone" className="form-input-el" placeholder="08975364785" value={form.phone} onChange={handleChange} required style={inputStyle} />
                                        {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
                                    </div>
                                </div>

                                {/* Password + Confirm row */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "18px" }}>
                                    <PasswordField name="password" label="PASSWORD *" show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                                    <PasswordField name="confirmPassword" label="CONFIRM PASSWORD *" show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                                </div>

                                {/* Location */}
                                <div style={{ marginBottom: "18px" }}>
                                    <label style={labelStyle}>LOCATION *</label>
                                    <input type="text" name="location" className="form-input-el" placeholder="Jakarta, Indonesia" value={form.location} onChange={handleChange} required style={inputStyle} />
                                    {errors.location && <p style={errorStyle}>{errors.location}</p>}
                                </div>

                                {/* API Error Message */}
                                {errors.apiError && (
                                    <div style={{
                                        color: "#ef4444",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        backgroundColor: "#fee2e2",
                                        padding: "12px 16px",
                                        borderRadius: "8px",
                                        border: "1px solid #fca5a5",
                                        marginBottom: "15px",
                                    }}>
                                        {errors.apiError}
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    onMouseEnter={() => !loading && setHoveredSubmit(true)}
                                    onMouseLeave={() => setHoveredSubmit(false)}
                                    style={{
                                        width: "100%", border: "none", borderRadius: "12px",
                                        padding: "15px", fontSize: "18px", fontWeight: 800, color: "#000",
                                        cursor: loading ? "not-allowed" : "pointer", marginTop: "15px",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                        fontFamily: "'Poppins', sans-serif", transition: "all 0.3s ease",
                                        backgroundColor: loading ? "#e2e8f0" : (hoveredSubmit ? "#b8e600" : "#ccff00"),
                                        boxShadow: hoveredSubmit && !loading ? "0 8px 20px rgba(204,255,0,0.4)" : "0 4px 12px rgba(204,255,0,0.2)",
                                        transform: hoveredSubmit && !loading ? "translateY(-2px)" : "translateY(0)",
                                        opacity: loading ? 0.7 : 1,
                                    }}
                                >
                                    {loading ? "Registering..." : "Register"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}