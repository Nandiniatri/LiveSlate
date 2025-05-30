import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="glass-card">
        <h1 className="title">LiveSlate</h1>
        <p className="subtitle">Collaborate live with video, chat & canvas</p>
        <div className="button-group">
          <button onClick={() => navigate('/joinRoom')} className="btn join-btn">Join Room</button>
          <button onClick={() => navigate('/createRoom')} className="btn create-btn">Create Room</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
