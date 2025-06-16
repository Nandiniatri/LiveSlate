// import './HomePage.css';
// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';

// const Home = () => {
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [roomID, setRoomID] = useState("");

//   const handleStartMeeting = () => {
//     navigate(`/room/${roomID}`);
//     console.log(`/room/${roomID}`);
//   };

//   const handleOpenModal = () => {
//     const newRoomID = crypto.randomUUID();
//     setRoomID(newRoomID);
//     setIsModalOpen(true);
//   };

//   const handleCopyLink = () => {
//     const fullURL = `${window.location.origin}/room/${roomID}`;
//     console.log(fullURL);
//     navigator.clipboard.writeText(fullURL);
//   };

//   return (
//     <div className="home-container">
//       <div className="glass-card">
//         <h1 className="title">LiveSlate</h1>
//         <p className="subtitle">Collaborate live with video, chat & canvas</p>
//         <div className="button-group">
//           <button onClick={handleOpenModal} className="btn join-btn">
//             New Meeting
//           </button>
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h2>Start a New Meeting</h2>
//             <p>Send this to people you want to meet with. Be sure to save it so you can use it later, too.</p>

//             <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
//               <input
//                 type="text"
//                 value={`${window.location.origin}/room/${roomID}`}
//                 readOnly
//                 className="invite-link"
//               />
//               <button className="copy-btn" onClick={handleCopyLink}>Copy Link</button>
//             </div>

//             <div className="modal-buttons">
//               <button onClick={handleStartMeeting} className="btn create-btn">Start Now</button>
//               <button onClick={() => setIsModalOpen(false)} className="btn cancel-btn">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default Home;










import Button from '../../components/Button';
import Image from '../../components/Image';
import Header from '../header/Header';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomID, setRoomID] = useState("");

  const handleCopyLink = () => {
    const fullURL = `${window.location.origin}/room/${roomID}`;
    console.log(fullURL);
    navigator.clipboard.writeText(fullURL);
  };

  const handleStartMeeting = () => {
    navigate(`/room/${roomID}`);
    console.log(`/room/${roomID}`);
  };

  const handleOpenModal = () => {
    const newRoomID = crypto.randomUUID();
    setRoomID(newRoomID);
    setIsModalOpen(true);
  };

  return (
    <div className="home-container">
      <Header />

      <div className="home-container-div2">
        <div className="home-container-h1-div">
          <h1>
            Free Online Collabration <br />
            Platform for <span className="highlight-blue">Everyone</span>
          </h1>
        </div>

        <p>
          Access live video calls, shared canvas, and chat in one unified platform
        </p>

        <Button className="btn join-btn" onClick={handleOpenModal}>New Meeting</Button>
      </div>

      <Image
        src="https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-88dc-622f-b370-dfcc3a705420/raw?se=2025-06-16T11%3A46%3A11Z&sp=r&sv=2024-08-04&sr=b&scid=615b1d47-49b7-5b95-8e05-685eb3005ec5&skoid=e9d2f8b1-028a-4cff-8eb1-d0e66fbefcca&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-16T01%3A32%3A04Z&ske=2025-06-17T01%3A32%3A04Z&sks=b&skv=2024-08-04&sig=dc3crTCVDmgiTbjoXJN7TIYaPCm60hJf8PNhZly0B%2B8%3D" className="home-image" />




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
