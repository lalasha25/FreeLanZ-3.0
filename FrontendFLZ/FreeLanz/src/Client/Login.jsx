import { useState, useEffect } from "react";
import API from "../api";

export default function Login({ onChangePage }) {
  const [role, setRole] = useState("freelancer");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Baca parameter URL saat halaman dimuat
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramRole = urlParams.get("role");
    if (paramRole === "client") {
      setRole("client");
    } else {
      setRole("freelancer");
    }
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError("Email/Username dan Password wajib diisi!");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await API.post("/auth/login", {
        email: username,
        password: password,
      });

      const { access_token, user } = response.data;

      // Simpan data login ke localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      alert(`Login Sukses! Selamat datang kembali, ${user.name}.`);

      // Arahkan berdasarkan role yang terdaftar di database
      if (user.role === "CLIENT") {
        onChangePage("explore");
      } else if (user.role === "FREELANCER") {
        onChangePage("freelancerDashboard");
      } else {
        onChangePage("explore");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Login gagal! Email atau password salah.";
      setError(Array.isArray(errMsg) ? errMsg.join(", ") : errMsg);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    onChangePage("chooseRole");
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; }
        .login-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          border-color: #93c5fd;
        }
        .login-btn:hover {
          background-color: #b8e600;
          transform: translateY(-2px);
        }
        .login-btn:active {
          transform: scale(0.98);
        }
        .back-btn:hover { color: #555; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}</style>

      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          backgroundColor: "#00016D",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "40px 24px",
          overflowX: "hidden",
        }}
      >
        {/* Grid Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.2,
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {/* Polygon 1 */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "-5%",
            width: "400px",
            height: "400px",
            backgroundColor: "white",
            opacity: 0.05,
            transform: "rotate(12deg)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Polygon 2 */}
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "20%",
            width: "300px",
            height: "300px",
            backgroundColor: "white",
            opacity: 0.05,
            transform: "rotate(-12deg)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Main Container */}
        <div
          style={{
            maxWidth: "1250px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 10,
            gap: "40px",
          }}
        >
          {/* Left: Heading */}
          <div style={{ color: "white", flex: "1 1 300px" }}>
            <p style={{ fontSize: "22px", fontWeight: 800, opacity: 0.8 }}>Hi,</p>
            <h1
              style={{
                fontSize: "clamp(52px, 7vw, 86px)",
                fontWeight: 700,
                lineHeight: 0.9,
                marginTop: "8px",
                marginBottom: "24px",
                letterSpacing: "-1px",
              }}
            >
              HELLO AGAIN,
              <br />
              LANZER!
            </h1>
            <p
              style={{
                maxWidth: "420px",
                fontSize: "clamp(17px, 2vw, 26px)",
                fontWeight: 500,
                opacity: 0.7,
                lineHeight: 1.3,
              }}
            >
              Sign in to manage your projects and stay on track.
            </p>
          </div>

          {/* Right: Login Card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              width: "100%",
              maxWidth: "580px",
              flex: "1 1 340px",
              borderRadius: "10px",
              padding: "clamp(32px, 5vw, 56px)",
              position: "relative",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            {/* Back Button */}
            <button
              className="back-btn"
              onClick={goBack}
              style={{
                display: "flex",
                alignItems: "center",
                color: "#888888",
                fontWeight: 700,
                fontSize: "14px",
                marginBottom: "40px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Poppins', sans-serif",
                transition: "color 0.2s",
              }}
            >
              ← Back
            </button>

            {/* Header */}
            <div style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 38px)",
                  fontWeight: 700,
                  color: "#0d0d0d",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                IDENTIFY_SELF
              </h2>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#b0b0b0",
                  letterSpacing: "5px",
                  textTransform: "uppercase",
                  opacity: 0.8,
                }}
              >
                Welcome back, Lanzer
              </p>
            </div>

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Username / Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#0d0d0d",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                  }}
                >
                  Username / Email *
                </label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="jacqueline@binus.ac.id"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: "100%",
                    height: "52px",
                    backgroundColor: "#f4f4f6",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "0 20px",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#4b5563",
                    transition: "all 0.2s",
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#0d0d0d",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                  }}
                >
                  Password *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    placeholder="password123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      height: "52px",
                      backgroundColor: "#f4f4f6",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      padding: "0 52px 0 20px",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#4b5563",
                      transition: "all 0.2s",
                    }}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "20px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6b7280",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {showPassword ? (
                      // Eye-off icon
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      // Eye icon
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Role Radio */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "#0d0d0d",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                  }}
                >
                  Masuk Sebagai / Role *
                </label>
                <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
                  {["freelancer", "client"].map((r) => (
                    <label
                      key={r}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#4b5563",
                        cursor: "pointer",
                        gap: "8px",
                      }}
                    >
                      <input
                        type="radio"
                        name="login_role"
                        value={r}
                        checked={role === r}
                        onChange={() => setRole(r)}
                        style={{ width: "16px", height: "16px", accentColor: "#2563eb" }}
                      />
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </label>
                  ))}
                </div>
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
                    marginTop: "8px",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                className="login-btn"
                onClick={handleLogin}
                disabled={loading}
                style={{
                  width: "100%",
                  height: "60px",
                  borderRadius: "10px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: "22px",
                  color: "#000",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  backgroundColor: loading ? "#e2e8f0" : "#CCFF00",
                  opacity: loading ? 0.7 : 1,
                  transition: "transform 0.2s, background-color 0.2s",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            {/* Spacer */}
            <div style={{ height: "96px" }} />

            {/* Smiley Face Decoration */}
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                right: "24px",
                width: "clamp(80px, 10vw, 136px)",
                height: "clamp(80px, 10vw, 136px)",
                color: "#0047FF",
                opacity: 0.9,
                pointerEvents: "none",
              }}
            >
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2.5" />
                <path d="M22 38L29 42L36 38L33 32L38 26L31 28L24 24L26 31L22 38Z" fill="currentColor" />
                <path d="M64 38L71 42L78 38L75 32L80 26L73 28L66 24L68 31L64 38Z" fill="currentColor" />
                <path d="M30 62C35 70 42 74 50 74C58 74 65 70 70 62H30Z" fill="currentColor" />
                <path d="M30 62C35 70 42 74 50 74C58 74 65 70 70 62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}