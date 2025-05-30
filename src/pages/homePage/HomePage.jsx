import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleJoinRoomId = () => {
    const roomID = crypto.randomUUID();
    console.log(roomID);
    
    navigate(`/room/${roomID}`);
  }

  return (
    <div className="home-container">
      <div className="glass-card">
        <h1 className="title">LiveSlate</h1>
        <p className="subtitle">Collaborate live with video, chat & canvas</p>
        <div className="button-group">
          <button onClick={handleJoinRoomId} className="btn join-btn">Join Room</button>
          <button onClick={() => navigate('/createRoom')} className="btn create-btn">Create Room</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
