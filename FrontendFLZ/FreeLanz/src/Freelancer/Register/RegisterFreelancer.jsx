import { useState, useRef } from "react";
import API from "../../api";

const UploadIcon = () => (
  <svg width="22" height="22" fill="none" stroke="#0047ff" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="22" height="22" fill="none" stroke="#0047ff" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Spinner = () => (
  <div style={{
    width: "24px", height: "24px",
    border: "3px solid rgba(0,71,255,0.2)",
    borderTop: "3px solid #0047ff",
    borderRadius: "50%",
    marginBottom: "10px",
    animation: "spin 1s linear infinite",
  }} />
);

function UploadArea({ id, icon, text, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setFileName(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Select public upload endpoint based on file type
      const endpoint = id === "idCardArea" ? "/upload/public/id-photo" : "/upload/public/portfolio";
      const response = await API.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFileName(file.name);
      if (onUpload) onUpload(response.data.url);
    } catch (err) {
      alert("Gagal mengupload file: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    if (!uploading) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    handleUpload(e.target.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleUpload(e.dataTransfer.files[0]);
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        backgroundColor: dragging ? "#e3f2fd" : "#f8f9fa",
        border: `1.5px dashed ${dragging ? "#0047ff" : "#ccc"}`,
        borderRadius: "15px",
        padding: "18px",
        textAlign: "center",
        cursor: uploading ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        opacity: uploading ? 0.6 : 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {uploading ? (
        <>
          <Spinner />
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#777" }}>Uploading...</p>
        </>
      ) : fileName ? (
        <>
          <svg width="22" height="22" fill="none" stroke="#22c55e" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "6px" }}>
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#22c55e" }}>{fileName}</p>
        </>
      ) : (
        <>
          <div style={{ marginBottom: "6px" }}>{icon}</div>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#777" }}>
            {text} or click to <span style={{ color: "#0047ff", textDecoration: "underline" }}>upload</span>
          </p>
        </>
      )}
    </div>
  );
}

export default function RegisterFreelancer({ onChangePage }) {
  const [form, setForm] = useState({
    fullName: "",
    contact: "",
    idPhotoUrl: "",
    proposalUrl: "",
  });
  const [hoveredSubmit, setHoveredSubmit] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUploadSuccess = (field, url) => {
    setForm(prev => ({ ...prev, [field]: url }));
  };

  const goBack = () => { onChangePage('chooseRole'); };
  
  const goToNext = () => {
    if (!form.fullName.trim() || !form.contact.trim()) {
      alert("Nama lengkap dan Email/No Telepon wajib diisi!");
      return;
    }
    if (!form.idPhotoUrl) {
      alert("Harap upload foto identitas (Identity Card) Anda!");
      return;
    }
    if (!form.proposalUrl) {
      alert("Harap upload file Project Proposal Anda!");
      return;
    }
    
    // Simpan data step 1 ke localStorage
    localStorage.setItem("freelancer_reg_step1", JSON.stringify(form));
    onChangePage('registerFreelancer2');
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

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .form-card::-webkit-scrollbar { width: 6px; }
        .form-card::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
        .form-input:focus { border-color: #061093 !important; box-shadow: none; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .register-container { flex-direction: column !important; height: auto !important; }
          .left-panel { height: auto !important; }
          .right-panel-wrapper { width: 100% !important; padding: 20px !important; }
          .form-card { height: auto !important; border-radius: 20px !important; padding: 30px !important; }
          .illustration { display: none !important; }
        }
      `}</style>

      <div style={{
        fontFamily: "'Poppins', sans-serif",
        minHeight: "100vh",
        backgroundColor: "#00016D",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        <div className="register-container" style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", padding: "20px" }}>

          {/* Left Panel */}
          <div className="left-panel" style={{ flex: 1, padding: "40px 60px", display: "flex", flexDirection: "column", color: "#fff", height: "100%", justifyContent: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "5px" }}>Hi,</div>
            <h1 style={{ fontSize: "64px", fontWeight: 800, lineHeight: 1, textTransform: "uppercase" }}>
              WELCOME<br />LANZER!
            </h1>
            <p style={{ marginTop: "20px", fontSize: "22px", fontWeight: 600, maxWidth: "420px", lineHeight: 1.3, opacity: 0.9 }}>
              Sign up now and start finding your best gigs with FreeLanZ!
            </p>

            {/* Illustration */}
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
          <div className="right-panel-wrapper" style={{ flex: 0.9, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "20px" }}>
            <div className="form-card" style={{
              background: "#fff",
              width: "100%",
              maxWidth: "650px",
              height: "calc(100% - 60px)",
              borderRadius: "30px",
              padding: "45px 60px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              overflowY: "auto",
            }}>
              {/* Top Nav */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px" }}>
                <button onClick={goBack} style={{ color: "#888", fontWeight: 600, fontSize: "14px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: "5px" }}>
                  Back
                </button>

                {/* Step Indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {[1, 2].map((step, i) => (
                    <div key={step} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "26px", height: "26px", borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: "11px",
                        backgroundColor: step === 1 ? "#ccff00" : "#f0f0f0",
                        color: step === 1 ? "#000" : "#bbb",
                      }}>
                        {step}
                      </div>
                      {i === 0 && <div style={{ width: "20px", height: "2px", backgroundColor: "#eee" }} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Header */}
              <div style={{ marginBottom: "25px" }}>
                <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#000", letterSpacing: "-0.5px" }}>CREATE_PROFILE</h2>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#999", letterSpacing: "1px", textTransform: "uppercase" }}>SHOWCASE YOUR SKILLS</p>
              </div>

              {/* Form */}
              <div>
                {/* Full Name */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={labelStyle}>FULL NAME *</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    placeholder="eg. Linata Satoro"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Email / Phone */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={labelStyle}>EMAIL / PHONE NUMBER *</label>
                  <input
                    type="text"
                    name="contact"
                    className="form-input"
                    placeholder="eg. 08975364785"
                    value={form.contact}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Identity Card Upload */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={labelStyle}>IDENTITY CARD *</label>
                  <UploadArea
                    id="idCardArea"
                    icon={<UploadIcon />}
                    text="Drag your image here"
                    onUpload={(url) => handleUploadSuccess("idPhotoUrl", url)}
                  />
                </div>

                {/* Project Proposal Upload */}
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>PROJECT PROPOSAL *</label>
                    <a href="#" style={{ fontSize: "9px", fontWeight: 700, color: "#0047ff", textDecoration: "underline" }}>
                      Download Template
                    </a>
                  </div>
                  <UploadArea
                    id="proposalArea"
                    icon={<DocumentIcon />}
                    text="Drag your file here"
                    onUpload={(url) => handleUploadSuccess("proposalUrl", url)}
                  />
                </div>

                {/* Next Button */}
                <button
                  onClick={goToNext}
                  onMouseEnter={() => setHoveredSubmit(true)}
                  onMouseLeave={() => setHoveredSubmit(false)}
                  style={{
                    width: "100%",
                    backgroundColor: "#ccff00",
                    border: "none",
                    borderRadius: "12px",
                    padding: "15px",
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "#000",
                    cursor: "pointer",
                    marginTop: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontFamily: "'Poppins', sans-serif",
                    transition: "all 0.3s ease",
                    boxShadow: hoveredSubmit ? "0 8px 20px rgba(204,255,0,0.4)" : "0 4px 12px rgba(204,255,0,0.2)",
                    transform: hoveredSubmit ? "translateY(-2px)" : "translateY(0)",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}