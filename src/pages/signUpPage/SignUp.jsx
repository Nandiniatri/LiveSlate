import './SignUp.css';

const SignUpPage = () => {
  return (
    <div className="signup-container">
      <div className="signup-icon">👤</div>
      <h1 className="signup-heading">Welcome to <br />LiveSlate</h1>
      <p className="signup-subheading">
        Create your account and discover<br />
        world-class collaboration.
      </p>

      <button className="google-button">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
          alt="Google Logo" 
        />
        Continue with Google
      </button>

      <div className="or-text">or</div>

      <button className="continue-button">Continue</button>

      <p className="terms-text">
        By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
      </p>

      <p className="login-text">
        Already have an account? <a href="#">Login</a>
      </p>
    </div>
  );
};

export default SignUpPage;
