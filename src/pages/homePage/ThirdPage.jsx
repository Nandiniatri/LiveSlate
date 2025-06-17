const ThirdPage = () => {
  return (
    <div className="third-section">
      <h2 className="third-heading">Why Choose LiveSlate?</h2>
      <p className="third-subtext">
        Empowering educators and learners with powerful real-time tools for seamless collaboration, communication, and creativity.
      </p>
      <div className="feature-grid">
        <div className="feature-box">
          <img src="./assets/secure.png" alt="Secure" className="feature-img-icon" />
          <h3 className="feature-title">Private & Secure</h3>
          <p className="feature-desc">End-to-end encryption ensures safe and secure collaboration for all users.</p>
        </div>
        <div className="feature-box">
          <img src="./assets/crossplateform.png" alt="Cross Platform" className="feature-img-icon" />
          <h3 className="feature-title">Cross-Platform</h3>
          <p className="feature-desc">Accessible from desktop, tablet, and mobile—connect from anywhere, anytime.</p>
        </div>
        <div className="feature-box">
          <img src="./assets/lightfast.png" alt="Real-Time" className="feature-img-icon" />
          <h3 className="feature-title">Lightning Fast</h3>
          <p className="feature-desc">Real-time drawing, chatting, and calling—experience near-zero latency communication.</p>
        </div>
      </div>
    </div>
  );
};

export default ThirdPage;
