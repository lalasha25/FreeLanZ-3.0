import { useState } from "react";

const styles = {
  body: {
    backgroundColor: "#05044a",
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: "60px 20px",
    fontFamily: "'Poppins', sans-serif",
    overflowX: "hidden",
    boxSizing: "border-box",
  },
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "60px",
    padding: "80px 70px",
    width: "100%",
    maxWidth: "820px",
    textAlign: "center",
    boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
  },
  subtitleTop: {
    fontStyle: "italic",
    color: "#666",
    fontSize: "28px",
    marginBottom: "5px",
  },
  title: {
    fontSize: "76px",
    fontWeight: 900,
    color: "#111",
    lineHeight: 1.05,
    letterSpacing: "1px",
    margin: 0,
  },
  titleBlue: {
    fontSize: "84px",
    fontWeight: 900,
    color: "#2b6eff",
    lineHeight: 1,
    marginBottom: "20px",
    marginTop: 0,
  },
  instruction: {
    fontStyle: "italic",
    color: "#888",
    fontSize: "20px",
    marginBottom: "60px",
  },
  rolesWrapper: {
    display: "flex",
    gap: "40px",
    justifyContent: "center",
    marginBottom: "60px",
  },
  roleCard: {
    flex: 1,
    borderRadius: "35px",
    padding: "50px 30px 40px 30px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "280px",
    border: "none",
    outline: "none",
  },
  freelancerCard: {
    backgroundColor: "#1bf2ff",
  },
  clientCard: {
    backgroundColor: "#42a5f5",
  },
  roleIcon: {
    width: "110px",
    height: "110px",
    marginBottom: "25px",
    opacity: 0.9,
  },
  roleLabel: {
    backgroundColor: "#ffffff",
    color: "#000",
    fontWeight: 700,
    fontSize: "18px",
    padding: "14px 28px",
    borderRadius: "50px",
    whiteSpace: "nowrap",
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    fontFamily: "'Poppins', sans-serif",
  },
  footerText: {
    color: "#777",
    fontSize: "20px",
  },
  backBtn: {
    position: "absolute",
    top: "30px",
    left: "30px",
    backgroundColor: "#ccff00",
    color: "#000",
    padding: "12px 24px",
    borderRadius: "50px",
    border: "none",
    fontWeight: 700,
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    transition: "transform 0.2s",
  },
  loginLink: {
    color: "#05044a",
    fontWeight: 700,
    textDecoration: "underline",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "20px",
  },
};

const FreelancerIcon = () => (
  <svg
    style={styles.roleIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#05044a"
    strokeWidth="2"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
  </svg>
);

const ClientIcon = () => (
  <svg
    style={styles.roleIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#05044a"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function ChooseRole({ onChangePage }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredBack, setHoveredBack] = useState(false);

  const goBack = () => {
    onChangePage('landing');
  };

  const selectRole = (role) => {
    if (role === "Freelancer") {
      onChangePage('registerFreelancer');
    } else if (role === "Client") {
      onChangePage('registerClient');
    }
  };

  const goToLogin = () => {
    onChangePage('login');
  };

  const getCardStyle = (cardName, baseColor) => ({
    ...styles.roleCard,
    backgroundColor: baseColor,
    transform: hoveredCard === cardName ? "translateY(-10px)" : "translateY(0)",
    boxShadow:
      hoveredCard === cardName
        ? "0 15px 30px rgba(0,0,0,0.25)"
        : "none",
  });

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;0,900;1,400&display=swap"
        rel="stylesheet"
      />
      <div style={styles.body}>
        <div style={{ ...styles.cardContainer, position: "relative" }}>
          {/* Tombol Back */}
          <button
            style={{
              ...styles.backBtn,
              transform: hoveredBack ? "scale(1.05)" : "scale(1)",
            }}
            onClick={goBack}
            onMouseEnter={() => setHoveredBack(true)}
            onMouseLeave={() => setHoveredBack(false)}
          >
            Back
          </button>

          <p style={styles.subtitleTop}>Hellooo,</p>
          <h1 style={styles.title}>WELCOME</h1>
          <h1 style={styles.titleBlue}>ABOARD!</h1>
          <p style={styles.instruction}>Choose the role that fits you best!</p>

          <div style={styles.rolesWrapper}>
            {/* Freelancer Card */}
            <button
              style={getCardStyle("freelancer", "#1bf2ff")}
              onClick={() => selectRole("Freelancer")}
              onMouseEnter={() => setHoveredCard("freelancer")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <FreelancerIcon />
              <span style={styles.roleLabel}>I am a Freelancer</span>
            </button>

            {/* Client Card */}
            <button
              style={getCardStyle("client", "#42a5f5")}
              onClick={() => selectRole("Client")}
              onMouseEnter={() => setHoveredCard("client")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <ClientIcon />
              <span style={styles.roleLabel}>I am a Client</span>
            </button>
          </div>

          <p style={styles.footerText}>
            Already have an account?{" "}
            <button style={styles.loginLink} onClick={goToLogin}>
              Log_In
            </button>
          </p>
        </div>
      </div>
    </>
  );
}