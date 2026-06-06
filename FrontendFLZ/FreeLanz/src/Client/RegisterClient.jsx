import { useState } from "react";
import API from "../api";

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IllustrationSVG = () => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="white"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", maxWidth: "240px", marginTop: "50px" }}
  >
    <path d="M15 25 C15 15, 45 15, 45 25 C45 33, 25 33, 20 37 L20 32 C17 32, 15 30, 15 25 Z" />
    <line x1="23" y1="22" x2="37" y2="22" />
    <line x1="23" y1="27" x2="31" y2="27" />
    <circle cx="75" cy="22" r="7" />
    <path d="M63 40 C63 33, 87 33, 87 40" />
    <circle cx="25" cy="68" r="7" />
    <path d="M13 86 C13 79, 37 79, 37 86" />
    <path d="M85 71 C85 61, 55 61, 55 71 C55 79, 75 79, 80 83 L80 78 C83 78, 85 76, 85 71 Z" />
    <line x1="63" y1="68" x2="77" y2="68" />
    <line x1="69" y1="73" x2="77" y2="73" />
  </svg>
);

export default function RegisterClient({ onChangePage }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hoveredSubmit, setHoveredSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal harus 6 karakter!");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register/client", {
        name: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });

      alert("Registration successful! Silakan login untuk melanjutkan.");
      onChangePage("login");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Registration failed! Silakan periksa kembali data Anda.";
      setError(Array.isArray(errMsg) ? errMsg.join(", ") : errMsg);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    onChangePage("chooseRole");
  };

  const inputStyle = {
    width: "100%",
    backgroundColor: "#f8f9fa",
    border: "1.5px solid #e5e7eb",
    borderRadius: "12px",
    padding: "12px 16px",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    fontSize: "13px",
    color: "#333",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "10px",
    fontWeight: 800,
    marginBottom: "8px",
    color: "#000",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const fields = [
    { label: "FULL NAME *", name: "fullName", type: "text", placeholder: "eg. Linata Satoro" },
    { label: "PHONE NUMBER *", name: "phone", type: "tel", placeholder: "eg. 08975364785" },
    { label: "EMAIL *", name: "email", type: "email", placeholder: "eg. linata@gmail.com" },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .form-card::-webkit-scrollbar { width: 6px; }
        .form-card::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
        .form-input:focus { border-color: #061093 !important; }
        @media (max-width: 1024px) {
          .register-container { flex-direction: column !important; height: auto !important; }
          .left-panel { height: auto !important; }
          .right-panel-wrapper { width: 100% !important; padding: 20px !important; }
          .form-card { height: auto !important; border-radius: 20px !important; padding: 30px !important; }
          .illustration { display: none !important; }
        }
      `}</style>

      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          minHeight: "100vh",
          backgroundColor: "#061093",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          className="register-container"
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            padding: "20px",
          }}
        >
          {/* Left Panel */}
          <div
            className="left-panel"
            style={{
              flex: 1,
              padding: "40px 60px",
              display: "flex",
              flexDirection: "column",
              color: "#ffffff",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "5px" }}>Hi,</div>
            <h1
              style={{
                fontSize: "64px",
                fontWeight: 800,
                lineHeight: 1,
                textTransform: "uppercase",
              }}
            >
              WELCOME
              <br />
              LANZER!
            </h1>
            <p
              style={{
                marginTop: "20px",
                fontSize: "22px",
                fontWeight: 600,
                maxWidth: "420px",
                lineHeight: 1.3,
                opacity: 0.9,
              }}
            >
              Create your account to access the best of FreeLanZ.
            </p>
            <div className="illustration">
              <IllustrationSVG />
            </div>
          </div>

          {/* Right Panel */}
          <div
            className="right-panel-wrapper"
            style={{
              flex: 0.9,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingRight: "20px",
            }}
          >
            <div
              className="form-card"
              style={{
                background: "#ffffff",
                width: "100%",
                maxWidth: "650px",
                height: "calc(100% - 60px)",
                borderRadius: "30px",
                padding: "45px 60px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                overflowY: "auto",
              }}
            >
              {/* Top Nav */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px" }}>
                <button
                  onClick={goBack}
                  style={{
                    color: "#888",
                    fontWeight: 600,
                    fontSize: "14px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Poppins', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  Back
                </button>
              </div>

              {/* Form Header */}
              <div style={{ marginBottom: "25px" }}>
                <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#000", letterSpacing: "-0.5px" }}>
                  CREATE_PROFILE
                </h2>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#999", letterSpacing: "1px", textTransform: "uppercase" }}>
                  FIND ELITE TALENT
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Regular Fields */}
                {fields.map(({ label, name, type, placeholder }) => (
                  <div key={name} style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type={type}
                      name={name}
                      className="form-input"
                      placeholder={placeholder}
                      value={form[name]}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                ))}

                {/* Password */}
                <div style={{ marginBottom: "18px", position: "relative" }}>
                  <label style={labelStyle}>PASSWORD *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{ ...inputStyle, paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "16px",
                      bottom: "14px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#888",
                    }}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div style={{ marginBottom: "18px", position: "relative" }}>
                  <label style={labelStyle}>CONFIRM PASSWORD *</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    style={{ ...inputStyle, paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "16px",
                      bottom: "14px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#888",
                    }}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: "13px",
                      fontWeight: 600,
                      backgroundColor: "#fee2e2",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #fca5a5",
                      marginBottom: "15px",
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  onMouseEnter={() => !loading && setHoveredSubmit(true)}
                  onMouseLeave={() => setHoveredSubmit(false)}
                  style={{
                    width: "100%",
                    backgroundColor: loading ? "#e2e8f0" : (hoveredSubmit ? "#b8e600" : "#ccff00"),
                    border: "none",
                    borderRadius: "12px",
                    padding: "15px",
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "#000",
                    cursor: loading ? "not-allowed" : "pointer",
                    marginTop: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontFamily: "'Poppins', sans-serif",
                    transition: "all 0.3s ease",
                    boxShadow: hoveredSubmit && !loading
                      ? "0 8px 20px rgba(204,255,0,0.4)"
                      : "0 4px 12px rgba(204,255,0,0.2)",
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