import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomID, setRoomID] = useState("");

  const handleStartMeeting = () => {
    navigate(`/room/${roomID}`);
    console.log(`/room/${roomID}`); 
  };

  const handleOpenModal = () => {
    const newRoomID = crypto.randomUUID();
    setRoomID(newRoomID);
    setIsModalOpen(true);
  };

  const handleCopyLink = () => {
    const fullURL = `${window.location.origin}/room/${roomID}`;
    console.log(fullURL);
    navigator.clipboard.writeText(fullURL);
  };

  return (
    <div className="home-container">
      <div className="glass-card">
        <h1 className="title">LiveSlate</h1>
        <p className="subtitle">Collaborate live with video, chat & canvas</p>
        <div className="button-group">
          <button onClick={handleOpenModal} className="btn join-btn">
            New Meeting
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Start a New Meeting</h2>
            <p>Send this to people you want to meet with. Be sure to save it so you can use it later, too.</p>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
              <input
                type="text"
                value={`${window.location.origin}/room/${roomID}`}
                readOnly
                className="invite-link"
              />
              <button className="copy-btn" onClick={handleCopyLink}>Copy Link</button>
            </div>

            <div className="modal-buttons">
              <button onClick={handleStartMeeting} className="btn create-btn">Start Now</button>
              <button onClick={() => setIsModalOpen(false)} className="btn cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;

