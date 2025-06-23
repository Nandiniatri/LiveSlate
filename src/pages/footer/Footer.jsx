import { useUsername } from '../../context/UsernamePrompt';
import './Footer.css';


const Footer = () => {
  const { footerNav } = useUsername();


  const handleFooterUI = (id) => {
    alert(id)
  }

  return (
    <div className="footer">
      <div className="footer-top">
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p className="footer-message">Let’s Discuss Your Vision. With Us</p>
          <button className="footer-button">Schedule a call now →</button>
          <p className="footer-email">OR EMAIL US AT</p>
          <div className="footer-email-box">hey@liveslate.com</div>
        </div>

        <div className="footer-links">
          <div>
            <h4>Quick Links</h4>
            <ul>
              {footerNav.map((item) => (
                <li key={item.id} onClick={() => handleFooterUI(item.id)}>{item.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Information</h4>
            <ul>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Cookies Settings</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© LiveSlate 2025. ALL RIGHTS RESERVED.</p>
        <div className="footer-socials">
          <i className="fa-brands fa-twitter"></i>
          <i className="fa-brands fa-instagram"></i>
          <i className="fa-brands fa-linkedin"></i>
        </div>
      </div>
    </div>
  );
};

export default Footer;
